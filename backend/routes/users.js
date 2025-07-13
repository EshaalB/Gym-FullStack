const express = require('express');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');
const { userIdValidation, paginationValidation, handleValidationErrors } = require('../utils/validation');
const { executeQuery, executeSingleQuery, sql } = require('../utils/database');

const router = express.Router();

// Create a new user (Admin only)
router.post('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { fName, lName, email, password, dateofBirth, gender, userRole } = req.body;
        
        // Validate required fields
        if (!fName || !lName || !email || !password || !dateofBirth || !gender || !userRole) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const existingUser = await executeSingleQuery('SELECT userId FROM gymUser WHERE email = @Email', [
            { name: 'Email', type: sql.VarChar(100), value: email }
        ]);
        
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const bcrypt = require('bcryptjs');
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user
        const insertQuery = `INSERT INTO gymUser (fName, lName, email, password, dateofBirth, gender, userRole) VALUES (@FName, @LName, @Email, @Password, @DateOfBirth, @Gender, @UserRole)`;
        
        await executeQuery(insertQuery, [
            { name: 'FName', type: sql.VarChar(100), value: fName },
            { name: 'LName', type: sql.VarChar(100), value: lName },
            { name: 'Email', type: sql.VarChar(100), value: email },
            { name: 'Password', type: sql.VarChar(255), value: hashedPassword },
            { name: 'DateOfBirth', type: sql.Date, value: dateofBirth },
            { name: 'Gender', type: sql.VarChar(20), value: gender },
            { name: 'UserRole', type: sql.VarChar(20), value: userRole }
        ]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete a user (Admin only)
router.delete('/:userId', authenticateToken, requireRole(['Admin']), userIdValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        // Prevent admin from deleting themselves
        if (userId == req.user.userId) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        await executeQuery('DELETE FROM gymUser WHERE userId = @UserId', [
            { name: 'UserId', type: sql.Int, value: userId }
        ]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole(['Admin']), paginationValidation, handleValidationErrors, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT userId, fName, lName, email, userRole, dateofBirth, gender, age
            FROM gymUser 
            ORDER BY userId DESC
            OFFSET @Offset ROWS
            FETCH NEXT @Limit ROWS ONLY
        `;

        const countQuery = 'SELECT COUNT(*) as total FROM gymUser';

        const [users, countResult] = await Promise.all([
            executeQuery(query, [
                { name: 'Offset', type: sql.Int, value: offset },
                { name: 'Limit', type: sql.Int, value: limit }
            ]),
            executeSingleQuery(countQuery)
        ]);

        const total = countResult.total;
        const totalPages = Math.ceil(total / limit);

        res.json({
            users,
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
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user by ID (Admin or own profile)
router.get('/:userId', authenticateToken, requireOwnershipOrAdmin, userIdValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await executeSingleQuery(`
            SELECT userId, fName, lName, email, userRole, dateOfBirth, gender, isActive, createdAt
            FROM gymUser 
            WHERE userId = @UserId
        `, [{ name: 'UserId', type: sql.Int, value: userId }]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile (Admin or own profile)
router.put('/:userId', authenticateToken, requireOwnershipOrAdmin, userIdValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        const { fName, lName, email, dateofBirth, gender } = req.body;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await executeSingleQuery(
                'SELECT userId FROM gymUser WHERE email = @Email AND userId != @UserId',
                [
                    { name: 'Email', type: sql.VarChar(100), value: email },
                    { name: 'UserId', type: sql.Int, value: userId }
                ]
            );

            if (existingUser) {
                return res.status(400).json({ error: 'Email already taken' });
            }
        }

        const updateQuery = `
            UPDATE gymUser 
            SET fName = @FName, 
                lName = @LName, 
                email = @Email, 
                dateofBirth = @DateOfBirth, 
                gender = @Gender
            WHERE userId = @UserId
        `;

        await executeQuery(updateQuery, [
            { name: 'FName', type: sql.VarChar(100), value: fName },
            { name: 'LName', type: sql.VarChar(100), value: lName },
            { name: 'Email', type: sql.VarChar(100), value: email },
            { name: 'DateOfBirth', type: sql.Date, value: dateofBirth },
            { name: 'Gender', type: sql.VarChar(20), value: gender },
            { name: 'UserId', type: sql.Int, value: userId }
        ]);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Deactivate/Activate user (Admin only)
router.patch('/:userId/status', authenticateToken, requireRole(['Admin']), userIdValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ error: 'isActive must be a boolean value' });
        }

        // Prevent admin from deactivating themselves
        if (userId == req.user.userId) {
            return res.status(400).json({ error: 'Cannot deactivate your own account' });
        }

        await executeQuery(
            'UPDATE gymUser SET isActive = @IsActive WHERE userId = @UserId',
            [
                { name: 'IsActive', type: sql.Bit, value: isActive },
                { name: 'UserId', type: sql.Int, value: userId }
            ]
        );

        const status = isActive ? 'activated' : 'deactivated';
        res.json({ message: `User ${status} successfully` });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        // Get total users and trainers
        const totalUsersQuery = `
            SELECT 
                COUNT(*) as totalUsers,
                SUM(CASE WHEN userRole = 'Member' THEN 1 ELSE 0 END) as totalMembers,
                SUM(CASE WHEN userRole = 'Trainer' THEN 1 ELSE 0 END) as totalTrainers
            FROM gymUser
        `;
        const activeMembershipsQuery = `
            SELECT COUNT(*) as activeMemberships
            FROM MembershipDetails
            WHERE membershipStatus = 'Active'
        `;
        const stats = await executeSingleQuery(totalUsersQuery);
        const active = await executeSingleQuery(activeMembershipsQuery);
        res.json({
            totalUsers: stats.totalUsers || 0,
            totalTrainers: stats.totalTrainers || 0,
            totalMembers: stats.totalMembers || 0,
            activeMemberships: active.activeMemberships || 0
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search users (Admin only)
router.get('/search', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { q, role, status } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereConditions = [];
        let inputs = [];

        if (q) {
            whereConditions.push('(fName LIKE @Search OR lName LIKE @Search OR email LIKE @Search)');
            inputs.push({ name: 'Search', type: sql.VarChar(100), value: `%${q}%` });
        }

        if (role) {
            whereConditions.push('userRole = @Role');
            inputs.push({ name: 'Role', type: sql.VarChar(20), value: role });
        }

        if (status !== undefined) {
            whereConditions.push('isActive = @Status');
            inputs.push({ name: 'Status', type: sql.Bit, value: status === 'true' });
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const query = `
            SELECT userId, fName, lName, email, userRole, isActive, createdAt
            FROM gymUser 
            ${whereClause}
            ORDER BY createdAt DESC
            OFFSET @Offset ROWS
            FETCH NEXT @Limit ROWS ONLY
        `;

        const countQuery = `
            SELECT COUNT(*) as total 
            FROM gymUser 
            ${whereClause}
        `;

        inputs.push(
            { name: 'Offset', type: sql.Int, value: offset },
            { name: 'Limit', type: sql.Int, value: limit }
        );

        const [users, countResult] = await Promise.all([
            executeQuery(query, inputs),
            executeSingleQuery(countQuery, inputs.slice(0, -2)) // Remove offset and limit for count
        ]);

        const total = countResult.total;
        const totalPages = Math.ceil(total / limit);

        res.json({
            users,
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
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get next class for user
router.get('/next-class', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const query = `
      SELECT TOP 1 
        c.className,
        c.classId,
        cd.Day as classDay,
        t.fName + ' ' + t.lName as trainerName
      FROM Class c
      INNER JOIN ClassDays cd ON c.classId = cd.classId
      INNER JOIN Class_Enrollment ce ON c.classId = ce.classId
      INNER JOIN gymUser t ON c.trainerId = t.userId
      WHERE ce.memberId = @userId
      AND cd.Day IN (
        CASE DATEPART(WEEKDAY, GETDATE())
          WHEN 1 THEN 'Sunday'
          WHEN 2 THEN 'Monday'
          WHEN 3 THEN 'Tuesday'
          WHEN 4 THEN 'Wednesday'
          WHEN 5 THEN 'Thursday'
          WHEN 6 THEN 'Friday'
          WHEN 7 THEN 'Saturday'
        END
      )
      ORDER BY cd.Day
    `;
    
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(query);
    
    res.json(result.recordset[0] || null);
  } catch (error) {
    console.error('Error fetching next class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user payments
router.get('/user-payments', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const query = `
      SELECT 
        p.paymentId,
        p.amount,
        p.paymentDate,
        p.paymentMethod,
        p.status
      FROM Payment p
      WHERE p.memberId = @userId
      ORDER BY p.paymentDate DESC
    `;
    
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(query);
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user stats
router.get('/user-stats', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM Class_Enrollment WHERE memberId = @userId) as totalClasses,
        (SELECT COUNT(*) FROM Attendance a 
         INNER JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId 
         WHERE ce.memberId = @userId AND a.attendanceStatus = 'P') as classesAttended,
        (SELECT COUNT(*) FROM WorkoutPlan WHERE memberId = @userId) as activePlans,
        (SELECT COUNT(*) FROM Attendance a 
         INNER JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId 
         WHERE ce.memberId = @userId) as totalAttendance
    `;
    
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(query);
    
    const stats = result.recordset[0];
    const attendanceRate = stats.totalAttendance > 0 
      ? Math.round((stats.classesAttended / stats.totalAttendance) * 100) 
      : 0;
    
    res.json({
      totalClasses: stats.totalClasses,
      classesAttended: stats.classesAttended,
      attendanceRate: attendanceRate,
      activePlans: stats.activePlans
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 