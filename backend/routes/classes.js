const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { executeQuery, executeSingleQuery, sql } = require('../utils/database');
const router = express.Router();

// List all classes
router.get('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const classes = await executeQuery('SELECT * FROM Class');
        res.json({ classes });
    } catch (error) {
        console.error('List classes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Add a new class
router.post('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
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
});
// Edit a class
router.put('/:classId', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { classId } = req.params;
        const { className, trainerId, genderSpecific, seats } = req.body;
        await executeQuery('UPDATE Class SET className = @ClassName, trainerId = @TrainerId, genderSpecific = @GenderSpecific, seats = @Seats WHERE classId = @ClassId', [
            { name: 'ClassName', type: sql.VarChar(100), value: className },
            { name: 'TrainerId', type: sql.Int, value: trainerId },
            { name: 'GenderSpecific', type: sql.VarChar(10), value: genderSpecific },
            { name: 'Seats', type: sql.Int, value: seats },
            { name: 'ClassId', type: sql.Int, value: classId }
        ]);
        res.json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error('Edit class error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete a class
router.delete('/:classId', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { classId } = req.params;
        await executeQuery('DELETE FROM Class WHERE classId = @ClassId', [
            { name: 'ClassId', type: sql.Int, value: classId }
        ]);
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Delete class error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Assign user to class
router.post('/assign-user', authenticateToken, requireRole(['Admin', 'Trainer']), async (req, res) => {
  try {
    const { userId, classId } = req.body;
    
    // Check if user exists and is a member
    const userQuery = `
      SELECT userId, userRole 
      FROM gymUser 
      WHERE userId = @userId AND userRole = 'Member'
    `;
    
    const userResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(userQuery);
    
    if (userResult.recordset.length === 0) {
      return res.status(400).json({ message: 'User not found or not a member' });
    }
    
    // Check if class exists
    const classQuery = `
      SELECT classId, className 
      FROM Class 
      WHERE classId = @classId
    `;
    
    const classResult = await pool.request()
      .input('classId', sql.Int, classId)
      .query(classQuery);
    
    if (classResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Class not found' });
    }
    
    // Check if user is already enrolled
    const enrollmentQuery = `
      SELECT enrollmentId 
      FROM Class_Enrollment 
      WHERE memberId = @userId AND classId = @classId
    `;
    
    const enrollmentResult = await pool.request()
      .input('userId', sql.Int, userId)
      .input('classId', sql.Int, classId)
      .query(enrollmentQuery);
    
    if (enrollmentResult.recordset.length > 0) {
      return res.status(400).json({ message: 'User is already enrolled in this class' });
    }
    
    // Enroll user in class
    const insertQuery = `
      INSERT INTO Class_Enrollment (memberId, classId, enrolled_on)
      VALUES (@userId, @classId, GETDATE())
    `;
    
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('classId', sql.Int, classId)
      .query(insertQuery);
    
    res.json({ 
      message: 'User successfully assigned to class',
      className: classResult.recordset[0].className
    });
    
  } catch (error) {
    console.error('Error assigning user to class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get available classes for assignment
router.get('/available-for-assignment', authenticateToken, requireRole(['Admin', 'Trainer']), async (req, res) => {
  try {
    const query = `
      SELECT 
        c.classId,
        c.className,
        t.fName + ' ' + t.lName as trainerName,
        c.seats,
        (SELECT COUNT(*) FROM Class_Enrollment WHERE classId = c.classId) as enrolledCount
      FROM Class c
      INNER JOIN gymUser t ON c.trainerId = t.userId
      WHERE c.seats > (SELECT COUNT(*) FROM Class_Enrollment WHERE classId = c.classId)
      ORDER BY c.className
    `;
    
    const result = await pool.request().query(query);
    res.json(result.recordset);
    
  } catch (error) {
    console.error('Error fetching available classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get available members for assignment
router.get('/available-members', authenticateToken, requireRole(['Admin', 'Trainer']), async (req, res) => {
  try {
    const { classId } = req.query;
    
    const query = `
      SELECT 
        u.userId,
        u.fName + ' ' + u.lName as fullName,
        u.email,
        md.membershipType,
        md.membershipStatus
      FROM gymUser u
      INNER JOIN MembershipDetails md ON u.userId = md.userId
      WHERE u.userRole = 'Member'
      AND md.membershipStatus = 'Active'
      AND u.userId NOT IN (
        SELECT memberId 
        FROM Class_Enrollment 
        WHERE classId = @classId
      )
      ORDER BY u.fName, u.lName
    `;
    
    const result = await pool.request()
      .input('classId', sql.Int, classId)
      .query(query);
    
    res.json(result.recordset);
    
  } catch (error) {
    console.error('Error fetching available members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 