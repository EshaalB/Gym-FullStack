const bcrypt = require('bcryptjs');
const { executeQuery, executeSingleQuery, sql } = require('../utils/database');

exports.createUser = async (req, res) => {
  try {
    const { fName, lName, email, password, dateofBirth, gender, userRole } = req.body;
    if (!fName || !lName || !email || !password || !dateofBirth || !gender || !userRole) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await executeSingleQuery('SELECT userId FROM gymUser WHERE email = @Email', [
      { name: 'Email', type: sql.VarChar(100), value: email }
    ]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
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
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let whereClause = '';
    let inputs = [
      { name: 'Offset', type: sql.Int, value: offset },
      { name: 'Limit', type: sql.Int, value: limit }
    ];
    let query, countQuery;
    if (req.query.role === 'Member') {
      // Only return members who are active and have MembershipDetails
      query = `
        SELECT u.userId, u.fName, u.lName, u.email, u.userRole, u.dateofBirth, u.gender, u.age
        FROM gymUser u
        INNER JOIN MembershipDetails m ON u.userId = m.userId
        WHERE u.userRole = 'Member' AND m.membershipStatus = 'Active'
        ORDER BY u.userId DESC
        OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
      `;
      countQuery = `SELECT COUNT(*) as total FROM gymUser u INNER JOIN MembershipDetails m ON u.userId = m.userId WHERE u.userRole = 'Member' AND m.membershipStatus = 'Active'`;
    } else if (req.query.role) {
      whereClause = 'WHERE userRole = @Role';
      inputs.unshift({ name: 'Role', type: sql.VarChar(20), value: req.query.role });
      query = `
        SELECT userId, fName, lName, email, userRole, dateofBirth, gender, age
        FROM gymUser 
        ${whereClause}
        ORDER BY userId DESC
        OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
      `;
      countQuery = `SELECT COUNT(*) as total FROM gymUser ${whereClause}`;
    } else {
      query = `
        SELECT userId, fName, lName, email, userRole, dateofBirth, gender, age
        FROM gymUser 
        ORDER BY userId DESC
        OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
      `;
      countQuery = `SELECT COUNT(*) as total FROM gymUser`;
    }
    const [users, countResult] = await Promise.all([
      executeQuery(query, inputs),
      executeSingleQuery(countQuery, inputs.slice(0, whereClause ? 1 : 0))
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
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await executeSingleQuery(`
      SELECT userId, fName, lName, email, userRole, dateOfBirth, gender, age
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
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fName, lName, email, dateofBirth, gender } = req.body;
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
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId == req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    // Delete from TrainerData (if trainer)
    await executeQuery('DELETE FROM TrainerData WHERE userId = @UserId', [
      { name: 'UserId', type: sql.Int, value: userId }
    ]);
    // Delete from Class_Enrollment (if member)
    await executeQuery('DELETE FROM Class_Enrollment WHERE memberId = @UserId', [
      { name: 'UserId', type: sql.Int, value: userId }
    ]);
    // Delete classes where this user is the trainer
    await executeQuery('DELETE FROM Class WHERE trainerId = @UserId', [
      { name: 'UserId', type: sql.Int, value: userId }
    ]);
    // Delete workout plans where this user is member or trainer
    await executeQuery('DELETE FROM WorkoutPlan WHERE memberId = @UserId OR trainerId = @UserId', [
      { name: 'UserId', type: sql.Int, value: userId }
    ]);
    // Delete payments where this user is the member
    await executeQuery('DELETE FROM Payment WHERE memberId = @UserId', [
      { name: 'UserId', type: sql.Int, value: userId }
    ]);
    // Delete from gymUser
    await executeQuery('DELETE FROM gymUser WHERE userId = @UserId', [
      { name: 'UserId', type: sql.Int, value: userId }
    ]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean value' });
    }
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
};

exports.getStatsOverview = async (req, res) => {
  try {
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
};

exports.searchUsers = async (req, res) => {
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
      executeSingleQuery(countQuery, inputs.slice(0, -2))
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
};

exports.getNextClass = async (req, res) => {
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
    const result = await executeQuery(query, [
      { name: 'userId', type: sql.Int, value: userId }
    ]);
    res.json(result[0] || null);
  } catch (error) {
    console.error('Error fetching next class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserPayments = async (req, res) => {
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
    const result = await executeQuery(query, [
      { name: 'userId', type: sql.Int, value: userId }
    ]);
    res.json(result);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserStats = async (req, res) => {
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
    const stats = await executeSingleQuery(query, [
      { name: 'userId', type: sql.Int, value: userId }
    ]);
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
}; 

exports.getUserClasses = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT c.classId, c.className, cd.Day as classDay, t.fName + ' ' + t.lName as trainerName
      FROM Class_Enrollment ce
      INNER JOIN Class c ON ce.classId = c.classId
      INNER JOIN ClassDays cd ON c.classId = cd.classId
      INNER JOIN gymUser t ON c.trainerId = t.userId
      WHERE ce.memberId = @userId
      ORDER BY c.className, cd.Day
    `;
    const classes = await executeQuery(query, [
      { name: 'userId', type: sql.Int, value: userId }
    ]);
    res.json({ classes });
  } catch (error) {
    console.error('Error fetching user classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 

// Admin Dashboard Analytics Endpoint
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // 1. User stats
    const userStatsQuery = `
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
    const genderDistQuery = `
      SELECT gender, COUNT(*) as count
      FROM gymUser
      GROUP BY gender
    `;
    // 2. Monthly user growth (last 6 months)
    const userGrowthQuery = `
      SELECT YEAR(createdAt) as year, MONTH(createdAt) as month, DATENAME(MONTH, createdAt) as monthName, COUNT(*) as count
      FROM gymUser
      WHERE createdAt >= DATEADD(MONTH, -5, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
      GROUP BY YEAR(createdAt), MONTH(createdAt), DATENAME(MONTH, createdAt)
      ORDER BY year ASC, month ASC
    `;
    // 3. Revenue trend (last 6 months)
    const revenueTrendQuery = `
      SELECT 
        YEAR(paymentDate) as year, 
        MONTH(paymentDate) as month,
        DATENAME(MONTH, paymentDate) as monthName,
        SUM(amount) as totalRevenue
      FROM Payment
      WHERE paymentDate >= DATEADD(MONTH, -5, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0))
        AND status = 'Completed'
      GROUP BY YEAR(paymentDate), MONTH(paymentDate), DATENAME(MONTH, paymentDate)
      ORDER BY year ASC, month ASC
    `;
    // 4. Plan/membership type distribution
    const planDistQuery = `
      SELECT membershipType, COUNT(*) as count
      FROM MembershipDetails
      WHERE membershipStatus = 'Active'
      GROUP BY membershipType
    `;
    // 5. Attendance stats (overall and by class, last month)
    const attendanceOverallQuery = `
      SELECT 
        COUNT(*) as totalAttendance,
        SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN a.attendanceStatus = 'A' THEN 1 ELSE 0 END) as absentCount,
        SUM(CASE WHEN a.attendanceStatus = 'L' THEN 1 ELSE 0 END) as lateCount
      FROM Attendance a
      WHERE a.currDate >= DATEADD(MONTH, -1, GETDATE())
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
      WHERE a.currDate >= DATEADD(MONTH, -1, GETDATE())
      GROUP BY c.classId, c.className
      ORDER BY attendanceRate DESC
    `;

    // Run all queries in parallel
    const [
      userStats,
      activeMemberships,
      genderDist,
      userGrowth,
      revenueTrend,
      planDist,
      attendanceOverall,
      attendanceByClass
    ] = await Promise.all([
      executeSingleQuery(userStatsQuery),
      executeSingleQuery(activeMembershipsQuery),
      executeQuery(genderDistQuery),
      executeQuery(userGrowthQuery),
      executeQuery(revenueTrendQuery),
      executeQuery(planDistQuery),
      executeSingleQuery(attendanceOverallQuery),
      executeQuery(attendanceByClassQuery)
    ]);

    // Calculate overall attendance rate
    const totalAttendance = attendanceOverall.totalAttendance || 0;
    const presentCount = attendanceOverall.presentCount || 0;
    const overallAttendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    res.json({
      userStats: {
        ...userStats,
        activeMemberships: activeMemberships.activeMemberships || 0
      },
      genderDistribution: genderDist,
      userGrowth,
      revenueTrend,
      planDistribution: planDist,
      attendance: {
        overall: {
          ...attendanceOverall,
          attendanceRate: Math.round(overallAttendanceRate * 100) / 100
        },
        byClass: attendanceByClass
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 