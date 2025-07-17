const { executeQuery, sql } = require('../utils/database');

exports.getAllClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const classesQuery = `
      SELECT c.*, u.fName + ' ' + u.lName as trainerName,
        (SELECT COUNT(*) FROM Class_Enrollment ce WHERE ce.classId = c.classId) as enrolledCount
      FROM Class c
      INNER JOIN gymUser u ON c.trainerId = u.userId
      ORDER BY c.classId DESC
      OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
    `;
    const countQuery = 'SELECT COUNT(*) as total FROM Class';
    const [classes, countResult] = await Promise.all([
      executeQuery(classesQuery, [
        { name: 'Offset', type: require('mssql').Int, value: offset },
        { name: 'Limit', type: require('mssql').Int, value: limit }
      ]),
      executeQuery(countQuery)
    ]);
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    res.json({
      classes,
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
    console.error('List classes error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { className, trainerId, genderSpecific, seats } = req.body;
    if (!className || !trainerId || !genderSpecific || !seats) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const insertQuery = `INSERT INTO Class (className, trainerId, genderSpecific, seats) VALUES (@ClassName, @TrainerId, @GenderSpecific, @Seats)`;
    await executeQuery(insertQuery, [
      { name: 'ClassName', type: sql.VarChar(100), value: className },
      { name: 'TrainerId', type: sql.Int, value: trainerId },
      { name: 'GenderSpecific', type: sql.VarChar(10), value: genderSpecific },
      { name: 'Seats', type: sql.Int, value: seats }
    ]);
    res.status(201).json({ message: 'Class created successfully' });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.assignMemberToClass = async (req, res) => {
  try {
    const { memberId, classId } = req.body;
    if (!memberId || !classId) {
      return res.status(400).json({ error: 'memberId and classId are required' });
    }
    await require('../utils/database').executeProcedure('AssignMemberToClass', [
      { name: 'memberId', type: sql.Int, value: memberId },
      { name: 'classId', type: sql.Int, value: classId }
    ]);
    res.status(200).json({ message: 'Member assigned to class successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 