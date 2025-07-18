const { executeQuery, sql, executeSingleQuery } = require('../utils/database');
const bcrypt = require('bcryptjs');

exports.getAllTrainers = async (req, res) => {
  try {
    // If ?all=true, return all trainers for dropdowns
    if (req.query.all === 'true') {
      const trainers = await executeQuery(`
        SELECT u.userId, u.fName, u.lName, u.email, t.specialization, t.experienceYears 
        FROM gymUser u 
        JOIN TrainerData t ON u.userId = t.userId 
        WHERE u.userRole = 'Trainer'
        ORDER BY u.fName, u.lName
      `);
      return res.json({ trainers });
    }
    // Paginated (default)
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

exports.createTrainer = async (req, res) => {
  const { fName, lName, email, password, dateofBirth, gender, specialization, experienceYears } = req.body;
  if (!fName || !lName || !email || !password || !dateofBirth || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const pool = req.app.locals.pool;
  const transaction = new (require('mssql')).Transaction(pool);
  try {
    await transaction.begin();
    // Check if email already exists
    const existing = await pool.request()
      .input('Email', require('mssql').VarChar(100), email)
      .query('SELECT userId FROM gymUser WHERE email = @Email');
    if (existing.recordset.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Email already registered' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Insert into gymUser
    const userResult = await transaction.request()
      .input('FName', require('mssql').VarChar(100), fName)
      .input('LName', require('mssql').VarChar(100), lName)
      .input('Email', require('mssql').VarChar(100), email)
      .input('Password', require('mssql').VarChar(255), hashedPassword)
      .input('DateOfBirth', require('mssql').Date, dateofBirth)
      .input('Gender', require('mssql').VarChar(20), gender)
      .input('UserRole', require('mssql').VarChar(20), 'Trainer')
      .query(`INSERT INTO gymUser (fName, lName, email, password, dateofBirth, gender, userRole)
              OUTPUT INSERTED.userId
              VALUES (@FName, @LName, @Email, @Password, @DateOfBirth, @Gender, @UserRole)`);
    const userId = userResult.recordset[0].userId;
    // Insert into TrainerData
    await transaction.request()
      .input('UserId', require('mssql').Int, userId)
      .input('Specialization', require('mssql').VarChar(100), specialization || null)
      .input('ExperienceYears', require('mssql').Int, experienceYears || 0)
      .query('INSERT INTO TrainerData (userId, specialization, experienceYears) VALUES (@UserId, @Specialization, @ExperienceYears)');
    await transaction.commit();
    res.status(201).json({
      message: 'Trainer created successfully',
      trainer: {
        userId,
        fName,
        lName,
        email,
        specialization,
        experienceYears
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create trainer error:', error, req.body);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}; 

// Update a trainer (Admin only)
exports.updateTrainer = async (req, res) => {
  const { trainerId } = req.params;
  const { fName, lName, email, dateofBirth, gender, specialization, experienceYears } = req.body;
  if (!fName || !lName || !email || !dateofBirth || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const pool = req.app.locals.pool;
  const transaction = new (require('mssql')).Transaction(pool);
  try {
    await transaction.begin();
    // Update gymUser
    await transaction.request()
      .input('UserId', require('mssql').Int, trainerId)
      .input('FName', require('mssql').VarChar(100), fName)
      .input('LName', require('mssql').VarChar(100), lName)
      .input('Email', require('mssql').VarChar(100), email)
      .input('DateOfBirth', require('mssql').Date, dateofBirth)
      .input('Gender', require('mssql').VarChar(20), gender)
      .query(`UPDATE gymUser SET fName=@FName, lName=@LName, email=@Email, dateofBirth=@DateOfBirth, gender=@Gender WHERE userId=@UserId AND userRole='Trainer'`);
    // Update TrainerData
    await transaction.request()
      .input('UserId', require('mssql').Int, trainerId)
      .input('Specialization', require('mssql').VarChar(100), specialization || null)
      .input('ExperienceYears', require('mssql').Int, experienceYears || 0)
      .query('UPDATE TrainerData SET specialization=@Specialization, experienceYears=@ExperienceYears WHERE userId=@UserId');
    await transaction.commit();
    res.json({ message: 'Trainer updated successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Update trainer error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Delete a trainer (Admin only)
exports.deleteTrainer = async (req, res) => {
  const { trainerId } = req.params;
  const pool = req.app.locals.pool;
  const transaction = new (require('mssql')).Transaction(pool);
  try {
    await transaction.begin();
    // 1. Find all classIds for this trainer
    const classIdsResult = await transaction.request()
      .input('TrainerId', require('mssql').Int, trainerId)
      .query('SELECT classId FROM Class WHERE trainerId=@TrainerId');
    const classIds = classIdsResult.recordset.map(row => row.classId);
    if (classIds.length > 0) {
      // 2. Delete all enrollments for those classIds
      await transaction.request()
        .query(`DELETE FROM Class_Enrollment WHERE classId IN (${classIds.join(',')})`);
      // 3. (Attendance should be deleted via ON DELETE CASCADE on Class_Enrollment)
    }
    // 4. Delete all classes where this trainer is assigned
    await transaction.request()
      .input('TrainerId', require('mssql').Int, trainerId)
      .query('DELETE FROM Class WHERE trainerId=@TrainerId');
    // 5. Delete all workout plans where this trainer is assigned
    await transaction.request()
      .input('TrainerId', require('mssql').Int, trainerId)
      .query('DELETE FROM WorkoutPlan WHERE trainerId=@TrainerId');
    // 6. Delete from TrainerData first (FK constraint)
    await transaction.request()
      .input('UserId', require('mssql').Int, trainerId)
      .query('DELETE FROM TrainerData WHERE userId=@UserId');
    // 7. Delete from gymUser
    await transaction.request()
      .input('UserId', require('mssql').Int, trainerId)
      .query("DELETE FROM gymUser WHERE userId=@UserId AND userRole='Trainer'");
    await transaction.commit();
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete trainer error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}; 

// Get all members in the trainer's classes
exports.getTrainerMembers = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    const query = `
      SELECT u.userId as memberId, u.fName, u.lName, u.email, u.gender, ce.classId, c.className, ce.enrollmentId
      FROM Class_Enrollment ce
      JOIN gymUser u ON ce.memberId = u.userId
      JOIN Class c ON ce.classId = c.classId
      WHERE c.trainerId = @TrainerId
      ORDER BY c.className, u.fName, u.lName
    `;
    const members = await executeQuery(query, [
      { name: 'TrainerId', type: sql.Int, value: trainerId }
    ]);
    res.json({ members });
  } catch (error) {
    console.error('Trainer members fetch error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}; 

// Trainer Dashboard Analytics Endpoint
exports.getTrainerDashboardAnalytics = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    // 1. Class stats
    const classStatsQuery = `
      SELECT c.classId, c.className, c.genderSpecific, c.seats,
        (SELECT COUNT(*) FROM Class_Enrollment ce WHERE ce.classId = c.classId) as memberCount
      FROM Class c
      WHERE c.trainerId = @TrainerId
      ORDER BY c.className
    `;
    // 2. Gender distribution of members
    const genderDistQuery = `
      SELECT u.gender, COUNT(*) as count
      FROM Class_Enrollment ce
      JOIN Class c ON ce.classId = c.classId
      JOIN gymUser u ON ce.memberId = u.userId
      WHERE c.trainerId = @TrainerId
      GROUP BY u.gender
    `;
    // 3. Attendance rates (overall, by class, by week)
    const attendanceOverallQuery = `
      SELECT 
        COUNT(*) as totalAttendance,
        SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN a.attendanceStatus = 'A' THEN 1 ELSE 0 END) as absentCount,
        SUM(CASE WHEN a.attendanceStatus = 'L' THEN 1 ELSE 0 END) as lateCount
      FROM Attendance a
      JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
      JOIN Class c ON ce.classId = c.classId
      WHERE c.trainerId = @TrainerId AND a.currDate >= DATEADD(MONTH, -1, GETDATE())
    `;
    const attendanceByClassQuery = `
      SELECT 
        c.className,
        COUNT(*) as totalAttendance,
        SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN a.attendanceStatus = 'A' THEN 1 ELSE 0 END) as absentCount,
        (SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) * 100.0) / COUNT(*) as attendanceRate
      FROM Attendance a
      JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
      JOIN Class c ON ce.classId = c.classId
      WHERE c.trainerId = @TrainerId AND a.currDate >= DATEADD(MONTH, -1, GETDATE())
      GROUP BY c.classId, c.className
      ORDER BY attendanceRate DESC
    `;
    // 4. Plan assignment rate (unique members with a plan / total unique members)
    const planAssignmentQuery = `
      SELECT COUNT(DISTINCT wp.memberId) as membersWithPlans
      FROM WorkoutPlan wp
      JOIN Class_Enrollment ce ON wp.memberId = ce.memberId
      JOIN Class c ON ce.classId = c.classId
      WHERE c.trainerId = @TrainerId
    `;
    const totalMembersQuery = `
      SELECT COUNT(DISTINCT ce.memberId) as totalMembers
      FROM Class_Enrollment ce
      JOIN Class c ON ce.classId = c.classId
      WHERE c.trainerId = @TrainerId
    `;
    // Run all queries in parallel
    const [
      classStats,
      genderDist,
      attendanceOverall,
      attendanceByClass,
      planAssignment,
      totalMembers
    ] = await Promise.all([
      executeQuery(classStatsQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]),
      executeQuery(genderDistQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]),
      executeSingleQuery(attendanceOverallQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]),
      executeQuery(attendanceByClassQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]),
      executeSingleQuery(planAssignmentQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]),
      executeSingleQuery(totalMembersQuery, [{ name: 'TrainerId', type: sql.Int, value: trainerId }])
    ]);
    // Calculate plan assignment rate
    const planAssignmentRate = totalMembers.totalMembers > 0 ? Math.round((planAssignment.membersWithPlans / totalMembers.totalMembers) * 100) : 0;
    // Calculate overall attendance rate
    const totalAttendance = attendanceOverall.totalAttendance || 0;
    const presentCount = attendanceOverall.presentCount || 0;
    const overallAttendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;
    res.json({
      classStats,
      genderDistribution: genderDist,
      attendance: {
        overall: {
          ...attendanceOverall,
          attendanceRate: Math.round(overallAttendanceRate * 100) / 100
        },
        byClass: attendanceByClass
      },
      planAssignmentRate
    });
  } catch (error) {
    console.error('Get trainer dashboard analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 