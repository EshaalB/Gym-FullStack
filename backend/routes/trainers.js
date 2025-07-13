const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { executeQuery, executeSingleQuery, sql } = require('../utils/database');
const router = express.Router();

// List all trainers
router.get('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const trainers = await executeQuery('SELECT u.userId, u.fName, u.lName, u.email, t.specialization, t.experienceYears FROM gymUser u JOIN TrainerData t ON u.userId = t.userId WHERE u.userRole = \'Trainer\'');
        res.json({ trainers });
    } catch (error) {
        console.error('List trainers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trainer's own classes
router.get('/my-classes', authenticateToken, requireRole(['Trainer']), async (req, res) => {
    try {
        const trainerId = req.user.userId;
        const classes = await executeQuery(`
            SELECT c.classId, c.className, c.genderSpecific, c.seats,
                   u.fName, u.lName, u.email
            FROM Class c
            JOIN gymUser u ON c.trainerId = u.userId
            WHERE c.trainerId = @TrainerId
        `, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]);
        
        res.json({ classes });
    } catch (error) {
        console.error('Get trainer classes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get members in trainer's classes
router.get('/my-classes/members', authenticateToken, requireRole(['Trainer']), async (req, res) => {
    try {
        const trainerId = req.user.userId;
        const members = await executeQuery(`
            SELECT ce.enrollmentId, ce.memberId, ce.classId,
                   u.fName, u.lName, u.email, u.gender,
                   c.className, c.genderSpecific
            FROM Class_Enrollment ce
            JOIN gymUser u ON ce.memberId = u.userId
            JOIN Class c ON ce.classId = c.classId
            WHERE c.trainerId = @TrainerId
        `, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]);
        
        res.json({ members });
    } catch (error) {
        console.error('Get trainer class members error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trainer's workout plans
router.get('/my-plans', authenticateToken, requireRole(['Trainer']), async (req, res) => {
    try {
        const trainerId = req.user.userId;
        const plans = await executeQuery(`
            SELECT wp.planId, wp.plan_name, wp.duration_weeks, wp.assigned_on,
                   u.fName, u.lName, u.email
            FROM WorkoutPlan wp
            JOIN gymUser u ON wp.memberId = u.userId
            WHERE wp.trainerId = @TrainerId
        `, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]);
        
        res.json({ plans });
    } catch (error) {
        console.error('Get trainer plans error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Assign workout plan to member
router.post('/assign-plan', authenticateToken, requireRole(['Trainer']), async (req, res) => {
    try {
        const trainerId = req.user.userId;
        const { memberId, planName, durationWeeks } = req.body;
        
        if (!memberId || !planName || !durationWeeks) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Check if member exists and is enrolled in trainer's class
        const memberCheck = await executeSingleQuery(`
            SELECT ce.enrollmentId
            FROM Class_Enrollment ce
            JOIN Class c ON ce.classId = c.classId
            WHERE ce.memberId = @MemberId AND c.trainerId = @TrainerId
        `, [
            { name: 'MemberId', type: sql.Int, value: memberId },
            { name: 'TrainerId', type: sql.Int, value: trainerId }
        ]);
        
        if (!memberCheck) {
            return res.status(400).json({ error: 'Member is not enrolled in your classes' });
        }
        
        // Check if member already has a plan
        const existingPlan = await executeSingleQuery(`
            SELECT planId FROM WorkoutPlan WHERE memberId = @MemberId
        `, [{ name: 'MemberId', type: sql.Int, value: memberId }]);
        
        if (existingPlan) {
            return res.status(400).json({ error: 'Member already has a workout plan' });
        }
        
        // Create workout plan
        await executeQuery(`
            INSERT INTO WorkoutPlan (memberId, trainerId, plan_name, duration_weeks, assigned_on)
            VALUES (@MemberId, @TrainerId, @PlanName, @DurationWeeks, GETDATE())
        `, [
            { name: 'MemberId', type: sql.Int, value: memberId },
            { name: 'TrainerId', type: sql.Int, value: trainerId },
            { name: 'PlanName', type: sql.VarChar(100), value: planName },
            { name: 'DurationWeeks', type: sql.Int, value: durationWeeks }
        ]);
        
        res.json({ message: 'Workout plan assigned successfully' });
    } catch (error) {
        console.error('Assign plan error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trainer statistics
router.get('/stats', authenticateToken, requireRole(['Trainer']), async (req, res) => {
    try {
        const trainerId = req.user.userId;
        
        // Get total classes
        const totalClasses = await executeSingleQuery(`
            SELECT COUNT(*) as totalClasses
            FROM Class
            WHERE trainerId = @TrainerId
        `, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]);
        
        // Get total members
        const totalMembers = await executeSingleQuery(`
            SELECT COUNT(DISTINCT ce.memberId) as totalMembers
            FROM Class_Enrollment ce
            JOIN Class c ON ce.classId = c.classId
            WHERE c.trainerId = @TrainerId
        `, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]);
        
        // Get total workout plans
        const totalPlans = await executeSingleQuery(`
            SELECT COUNT(*) as totalPlans
            FROM WorkoutPlan
            WHERE trainerId = @TrainerId
        `, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]);
        
        // Get today's attendance
        const todayAttendance = await executeSingleQuery(`
            SELECT COUNT(*) as todayAttendance
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN Class c ON ce.classId = c.classId
            WHERE c.trainerId = @TrainerId
            AND CAST(a.currDate AS DATE) = CAST(GETDATE() AS DATE)
            AND a.attendanceStatus = 'P'
        `, [{ name: 'TrainerId', type: sql.Int, value: trainerId }]);
        
        res.json({
            stats: {
                totalClasses: totalClasses.totalClasses || 0,
                totalMembers: totalMembers.totalMembers || 0,
                totalPlans: totalPlans.totalPlans || 0,
                todayAttendance: todayAttendance.todayAttendance || 0
            }
        });
    } catch (error) {
        console.error('Get trainer stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get class attendance for a specific class
router.get('/class/:classId/attendance', authenticateToken, requireRole(['Trainer']), async (req, res) => {
    try {
        const { classId } = req.params;
        const trainerId = req.user.userId;
        
        // Verify trainer owns this class
        const classOwnership = await executeSingleQuery(`
            SELECT classId FROM Class WHERE classId = @ClassId AND trainerId = @TrainerId
        `, [
            { name: 'ClassId', type: sql.Int, value: classId },
            { name: 'TrainerId', type: sql.Int, value: trainerId }
        ]);
        
        if (!classOwnership) {
            return res.status(403).json({ error: 'Access denied to this class' });
        }
        
        const attendance = await executeQuery(`
            SELECT a.attendanceId, a.currDate, a.attendanceStatus,
                   u.fName, u.lName, u.email,
                   ce.enrollmentId
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN gymUser u ON ce.memberId = u.userId
            WHERE ce.classId = @ClassId
            ORDER BY a.currDate DESC
        `, [{ name: 'ClassId', type: sql.Int, value: classId }]);
        
        res.json({ attendance });
    } catch (error) {
        console.error('Get class attendance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark attendance for a class
router.post('/class/:classId/attendance', authenticateToken, requireRole(['Trainer']), async (req, res) => {
    try {
        const { classId } = req.params;
        const trainerId = req.user.userId;
        const { memberId, attendanceStatus } = req.body;
        
        // Verify trainer owns this class
        const classOwnership = await executeSingleQuery(`
            SELECT classId FROM Class WHERE classId = @ClassId AND trainerId = @TrainerId
        `, [
            { name: 'ClassId', type: sql.Int, value: classId },
            { name: 'TrainerId', type: sql.Int, value: trainerId }
        ]);
        
        if (!classOwnership) {
            return res.status(403).json({ error: 'Access denied to this class' });
        }
        
        // Get enrollment ID
        const enrollment = await executeSingleQuery(`
            SELECT enrollmentId FROM Class_Enrollment 
            WHERE memberId = @MemberId AND classId = @ClassId
        `, [
            { name: 'MemberId', type: sql.Int, value: memberId },
            { name: 'ClassId', type: sql.Int, value: classId }
        ]);
        
        if (!enrollment) {
            return res.status(400).json({ error: 'Member is not enrolled in this class' });
        }
        
        // Check if attendance already marked for today
        const existingAttendance = await executeSingleQuery(`
            SELECT attendanceId FROM Attendance 
            WHERE enrollmentId = @EnrollmentId 
            AND CAST(currDate AS DATE) = CAST(GETDATE() AS DATE)
        `, [{ name: 'EnrollmentId', type: sql.Int, value: enrollment.enrollmentId }]);
        
        if (existingAttendance) {
            return res.status(400).json({ error: 'Attendance already marked for today' });
        }
        
        // Mark attendance
        await executeQuery(`
            INSERT INTO Attendance (enrollmentId, currDate, attendanceStatus)
            VALUES (@EnrollmentId, GETDATE(), @AttendanceStatus)
        `, [
            { name: 'EnrollmentId', type: sql.Int, value: enrollment.enrollmentId },
            { name: 'AttendanceStatus', type: sql.VarChar(2), value: attendanceStatus }
        ]);
        
        res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new trainer
router.post('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, gender, specialization, experienceYears, salary } = req.body;
        if (!firstName || !lastName || !email || !password || !dateOfBirth || !gender || !specialization || !experienceYears || !salary) {
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
        const insertUserQuery = `INSERT INTO gymUser (fName, lName, email, password, dateofBirth, gender, userRole) VALUES (@FirstName, @LastName, @Email, @Password, @DateOfBirth, @Gender, 'Trainer')`;
        await executeQuery(insertUserQuery, [
            { name: 'FirstName', type: sql.VarChar(100), value: firstName },
            { name: 'LastName', type: sql.VarChar(100), value: lastName },
            { name: 'Email', type: sql.VarChar(100), value: email },
            { name: 'Password', type: sql.VarChar(255), value: hashedPassword },
            { name: 'DateOfBirth', type: sql.Date, value: dateOfBirth },
            { name: 'Gender', type: sql.VarChar(20), value: gender }
        ]);
        // Get new userId
        const newTrainer = await executeSingleQuery('SELECT userId FROM gymUser WHERE email = @Email', [
            { name: 'Email', type: sql.VarChar(100), value: email }
        ]);
        // Insert trainer data
        const insertTrainerQuery = `INSERT INTO TrainerData (userId, specialization, experienceYears, salary) VALUES (@UserId, @Specialization, @ExperienceYears, @Salary)`;
        await executeQuery(insertTrainerQuery, [
            { name: 'UserId', type: sql.Int, value: newTrainer.userId },
            { name: 'Specialization', type: sql.VarChar(100), value: specialization },
            { name: 'ExperienceYears', type: sql.Int, value: experienceYears },
            { name: 'Salary', type: sql.Decimal(10,2), value: salary }
        ]);
        res.status(201).json({ message: 'Trainer created successfully' });
    } catch (error) {
        console.error('Create trainer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit a trainer
router.put('/:userId', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, email, dateOfBirth, gender, specialization, experienceYears, salary } = req.body;
        // Update user
        await executeQuery(`UPDATE gymUser SET fName = @FirstName, lName = @LastName, email = @Email, dateofBirth = @DateOfBirth, gender = @Gender WHERE userId = @UserId`, [
            { name: 'FirstName', type: sql.VarChar(100), value: firstName },
            { name: 'LastName', type: sql.VarChar(100), value: lastName },
            { name: 'Email', type: sql.VarChar(100), value: email },
            { name: 'DateOfBirth', type: sql.Date, value: dateOfBirth },
            { name: 'Gender', type: sql.VarChar(20), value: gender },
            { name: 'UserId', type: sql.Int, value: userId }
        ]);
        // Update trainer data
        await executeQuery(`UPDATE TrainerData SET specialization = @Specialization, experienceYears = @ExperienceYears, salary = @Salary WHERE userId = @UserId`, [
            { name: 'Specialization', type: sql.VarChar(100), value: specialization },
            { name: 'ExperienceYears', type: sql.Int, value: experienceYears },
            { name: 'Salary', type: sql.Decimal(10,2), value: salary },
            { name: 'UserId', type: sql.Int, value: userId }
        ]);
        res.json({ message: 'Trainer updated successfully' });
    } catch (error) {
        console.error('Edit trainer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a trainer
router.delete('/:userId', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        await executeQuery('DELETE FROM TrainerData WHERE userId = @UserId', [
            { name: 'UserId', type: sql.Int, value: userId }
        ]);
        await executeQuery('DELETE FROM gymUser WHERE userId = @UserId', [
            { name: 'UserId', type: sql.Int, value: userId }
        ]);
        res.json({ message: 'Trainer deleted successfully' });
    } catch (error) {
        console.error('Delete trainer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 