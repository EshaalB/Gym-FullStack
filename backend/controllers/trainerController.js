const { executeQuery, sql, executeSingleQuery } = require('../utils/database');

exports.getAllTrainers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const trainersQuery = `
      SELECT u.userId, u.fName, u.lName, u.email, t.specialization, t.experienceYears 
      FROM gymUser u 
      JOIN TrainerData t ON u.userId = t.userId 
      WHERE u.userRole = 'Trainer'
      ORDER BY u.userId DESC
      OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
    `;
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM gymUser u 
      JOIN TrainerData t ON u.userId = t.userId 
      WHERE u.userRole = 'Trainer'
    `;
    const [trainers, countResult] = await Promise.all([
      executeQuery(trainersQuery, [
        { name: 'Offset', type: sql.Int, value: offset },
        { name: 'Limit', type: sql.Int, value: limit }
      ]),
      executeQuery(countQuery)
    ]);
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    res.json({
      trainers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('List trainers error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}; 

exports.getTrainerDashboard = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    // Total classes taught by this trainer
    const totalClassesQuery = `SELECT COUNT(*) as totalClasses FROM Class WHERE trainerId = @TrainerId`;
    // Total unique members enrolled in this trainer's classes
    const totalMembersQuery = `
      SELECT COUNT(DISTINCT ce.memberId) as totalMembers
      FROM Class_Enrollment ce
      JOIN Class c ON ce.classId = c.classId
      WHERE c.trainerId = @TrainerId
    `;
    // Attendance rate for this trainer's classes
    const attendanceQuery = `
      SELECT 
        SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) as presentCount,
        COUNT(*) as totalAttendance
      FROM Attendance a
      JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
      JOIN Class c ON ce.classId = c.classId
      WHERE c.trainerId = @TrainerId
    `;
    const [totalClasses, totalMembers, attendance] = await Promise.all([
      executeSingleQuery(totalClassesQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]),
      executeSingleQuery(totalMembersQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]),
      executeSingleQuery(attendanceQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }])
    ]);
    const attendanceRate = attendance.totalAttendance > 0 ? Math.round((attendance.presentCount / attendance.totalAttendance) * 100) : 0;
    res.json({
      totalClasses: totalClasses.totalClasses || 0,
      totalMembers: totalMembers.totalMembers || 0,
      attendanceRate
    });
  } catch (error) {
    console.error('Trainer dashboard stats error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getTrainerClasses = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    const query = `
      SELECT c.classId, c.className, c.genderSpecific, c.seats
      FROM Class c
      WHERE c.trainerId = @TrainerId
      ORDER BY c.className
    `;
    const classes = await executeQuery(query, [
      { name: 'TrainerId', type: sql.Int, value: trainerId }
    ]);
    res.json({ classes });
  } catch (error) {
    console.error('Trainer classes error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}; 