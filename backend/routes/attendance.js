const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { attendanceValidation, handleValidationErrors } = require('../utils/validation');
const { executeQuery, executeProcedure, executeSingleQuery, sql } = require('../utils/database');

const router = express.Router();

// Mark attendance (Trainer/Admin only)
router.post('/mark', authenticateToken, requireRole(['Trainer', 'Admin']), attendanceValidation, handleValidationErrors, async (req, res) => {
    try {
        const { memberId, classId, attendanceStatus, date } = req.body;

        // Check if member is enrolled in the class
        const enrollment = await executeSingleQuery(`
            SELECT enrollmentId 
            FROM Class_Enrollment 
            WHERE memberId = @MemberId AND classId = @ClassId
        `, [
            { name: 'MemberId', type: sql.Int, value: memberId },
            { name: 'ClassId', type: sql.Int, value: classId }
        ]);

        if (!enrollment) {
            return res.status(400).json({ error: 'Member is not enrolled in this class' });
        }

        // Use the provided date or default to today
        const attendanceDate = date ? new Date(date) : new Date();
        const dateParam = attendanceDate.toISOString().split('T')[0];

        // Check if attendance already marked for the given date
        const existingAttendance = await executeSingleQuery(`
            SELECT enrollmentId, currDate 
            FROM Attendance 
            WHERE enrollmentId = @EnrollmentId 
            AND CAST(currDate AS DATE) = @Date
        `, [
            { name: 'EnrollmentId', type: sql.Int, value: enrollment.enrollmentId },
            { name: 'Date', type: sql.Date, value: dateParam }
        ]);

        if (existingAttendance) {
            return res.status(400).json({ error: 'Attendance already marked for this day' });
        }

        // Mark attendance using stored procedure, passing the date
        const result = await executeProcedure('markAttendance', [
            { name: 'memberId', type: sql.Int, value: memberId },
            { name: 'classId', type: sql.Int, value: classId },
            { name: 'attendanceStatus', type: sql.VarChar(2), value: attendanceStatus },
            { name: 'currDate', type: sql.Date, value: dateParam }
        ]);

        // Check the result from the stored procedure
        if (result && result.recordset && result.recordset[0]) {
            const procResult = result.recordset[0];
            
            if (procResult.Result === 0) {
                res.json({ message: procResult.Message || 'Attendance marked successfully' });
            } else {
                // Handle different error cases
                let statusCode = 400;
                if (procResult.Result === 1) {
                    statusCode = 400; // Not enrolled
                } else if (procResult.Result === 2) {
                    statusCode = 409; // Already marked (conflict)
                } else if (procResult.Result === 3) {
                    statusCode = 400; // Invalid status
                } else if (procResult.Result === 4) {
                    statusCode = 404; // User not found
                }
                
                return res.status(statusCode).json({ error: procResult.Message });
            }
        } else {
            res.json({ message: 'Attendance marked successfully' });
        }
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get attendance for a specific class (Trainer/Admin only)
router.get('/class/:classId', authenticateToken, requireRole(['Trainer', 'Admin']), async (req, res) => {
    try {
        const { classId } = req.params;
        const { date } = req.query;

        let dateFilter = '';
        let inputs = [{ name: 'ClassId', type: sql.Int, value: classId }];

        if (date) {
            dateFilter = 'AND CAST(a.currDate AS DATE) = @Date';
            inputs.push({ name: 'Date', type: sql.Date, value: date });
        }

        const query = `
            SELECT 
                u.userId,
                u.fName,
                u.lName,
                u.email,
                a.attendanceStatus,
                a.currDate,
                ce.enrollmentId,
                c.className
            FROM Class_Enrollment ce
            JOIN gymUser u ON ce.memberId = u.userId
            JOIN Class c ON ce.classId = c.classId
            LEFT JOIN Attendance a ON a.enrollmentId = ce.enrollmentId AND CAST(a.currDate AS DATE) = CAST(GETDATE() AS DATE)
            WHERE ce.classId = @ClassId
            ORDER BY u.fName, u.lName
        `;

        const attendance = await executeQuery(query, inputs);

        res.json({ attendance });
    } catch (error) {
        console.error('Get class attendance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export attendance for a class in a given month/year (for Excel export)
router.get('/class/:classId', authenticateToken, requireRole(['Trainer', 'Admin']), async (req, res) => {
    try {
        const { classId } = req.params;
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }
        const query = `
            SELECT 
                a.currDate as date,
                u.fName + ' ' + u.lName as memberName,
                a.attendanceStatus as status
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN gymUser u ON ce.memberId = u.userId
            WHERE ce.classId = @ClassId
                AND MONTH(a.currDate) = @Month
                AND YEAR(a.currDate) = @Year
            ORDER BY a.currDate, memberName
        `;
        const attendance = await executeQuery(query, [
            { name: 'ClassId', type: sql.Int, value: classId },
            { name: 'Month', type: sql.Int, value: month },
            { name: 'Year', type: sql.Int, value: year }
        ]);
        res.json({ attendance: attendance || [] });
    } catch (error) {
        console.error('Export class attendance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get member attendance history (Member can see own, Admin/Trainer can see any)
router.get('/member/:memberId', authenticateToken, async (req, res) => {
    try {
        const { memberId } = req.params;
        const { startDate, endDate, classId } = req.query;

        // Check if user has permission to view this member's attendance
        if (req.user.userRole === 'Member' && req.user.userId != memberId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        let whereConditions = ['ce.memberId = @MemberId'];
        let inputs = [{ name: 'MemberId', type: sql.Int, value: memberId }];

        if (startDate) {
            whereConditions.push('CAST(a.currDate AS DATE) >= @StartDate');
            inputs.push({ name: 'StartDate', type: sql.Date, value: startDate });
        }

        if (endDate) {
            whereConditions.push('CAST(a.currDate AS DATE) <= @EndDate');
            inputs.push({ name: 'EndDate', type: sql.Date, value: endDate });
        }

        if (classId) {
            whereConditions.push('ce.classId = @ClassId');
            inputs.push({ name: 'ClassId', type: sql.Int, value: classId });
        }

        const query = `
            SELECT 
                a.attendanceStatus,
                a.currDate,
                c.className,
                t.fName as trainerFirstName,
                t.lName as trainerLastName,
                ce.enrollmentId
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN Class c ON ce.classId = c.classId
            JOIN gymUser t ON c.trainerId = t.userId
            WHERE ${whereConditions.join(' AND ')}
            ORDER BY a.currDate DESC
        `;

        const attendance = await executeQuery(query, inputs);

        // Calculate attendance statistics
        const totalClasses = attendance.length;
        const presentCount = attendance.filter(a => a.attendanceStatus === 'P').length;
        const absentCount = attendance.filter(a => a.attendanceStatus === 'A').length;
        const lateCount = attendance.filter(a => a.attendanceStatus === 'L').length;
        const attendanceRate = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

        res.json({
            attendance,
            statistics: {
                totalClasses,
                presentCount,
                absentCount,
                lateCount,
                attendanceRate: Math.round(attendanceRate * 100) / 100
            }
        });
    } catch (error) {
        console.error('Get member attendance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get attendance statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        let dateFilter = '';
        switch (period) {
            case 'week':
                dateFilter = 'AND a.currDate >= DATEADD(WEEK, -1, GETDATE())';
                break;
            case 'month':
                dateFilter = 'AND a.currDate >= DATEADD(MONTH, -1, GETDATE())';
                break;
            case 'year':
                dateFilter = 'AND a.currDate >= DATEADD(YEAR, -1, GETDATE())';
                break;
        }

        // Overall attendance statistics
        const overallStatsQuery = `
            SELECT 
                COUNT(*) as totalAttendance,
                SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) as presentCount,
                SUM(CASE WHEN a.attendanceStatus = 'A' THEN 1 ELSE 0 END) as absentCount,
                SUM(CASE WHEN a.attendanceStatus = 'L' THEN 1 ELSE 0 END) as lateCount
            FROM Attendance a
            WHERE 1=1 ${dateFilter}
        `;

        // Attendance by class
        const classStatsQuery = `
            SELECT 
                c.className,
                COUNT(*) as totalAttendance,
                SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) as presentCount,
                SUM(CASE WHEN a.attendanceStatus = 'A' THEN 1 ELSE 0 END) as absentCount,
                (SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) * 100.0) / COUNT(*) as attendanceRate
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN Class c ON ce.classId = c.classId
            WHERE 1=1 ${dateFilter}
            GROUP BY c.classId, c.className
            ORDER BY attendanceRate DESC
        `;

        // Top attendees
        const topAttendeesQuery = `
            SELECT 
                u.fName,
                u.lName,
                COUNT(*) as attendanceCount,
                SUM(CASE WHEN a.attendanceStatus = 'P' THEN 1 ELSE 0 END) as presentCount
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN gymUser u ON ce.memberId = u.userId
            WHERE a.attendanceStatus = 'P' ${dateFilter}
            GROUP BY u.userId, u.fName, u.lName
            ORDER BY attendanceCount DESC
            OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY
        `;

        const [overallStats, classStats, topAttendees] = await Promise.all([
            executeSingleQuery(overallStatsQuery),
            executeQuery(classStatsQuery),
            executeQuery(topAttendeesQuery)
        ]);

        // Calculate overall attendance rate
        const totalAttendance = overallStats.totalAttendance || 0;
        const presentCount = overallStats.presentCount || 0;
        const overallAttendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

        res.json({
            period,
            overallStats: {
                ...overallStats,
                attendanceRate: Math.round(overallAttendanceRate * 100) / 100
            },
            classStats,
            topAttendees
        });
    } catch (error) {
        console.error('Get attendance stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update attendance (Trainer/Admin only)
router.put('/:enrollmentId/:currDate', authenticateToken, requireRole(['Trainer', 'Admin']), async (req, res) => {
    try {
        const { enrollmentId, currDate } = req.params;
        const { attendanceStatus } = req.body;

        if (!['P', 'A', 'L'].includes(attendanceStatus)) {
            return res.status(400).json({ error: 'Invalid attendance status' });
        }
        if (!enrollmentId || !currDate) {
            return res.status(400).json({ error: 'Missing enrollmentId or currDate' });
        }

        await executeQuery(
            'UPDATE Attendance SET attendanceStatus = @Status WHERE enrollmentId = @EnrollmentId AND currDate = @CurrDate',
            [
                { name: 'Status', type: sql.VarChar(2), value: attendanceStatus },
                { name: 'EnrollmentId', type: sql.Int, value: enrollmentId },
                { name: 'CurrDate', type: sql.Date, value: currDate }
            ]
        );

        res.json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get attendance report (Admin only)
router.get('/report', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { startDate, endDate, classId, trainerId } = req.query;

        let whereConditions = ['1=1'];
        let inputs = [];

        if (startDate) {
            whereConditions.push('CAST(a.currDate AS DATE) >= @StartDate');
            inputs.push({ name: 'StartDate', type: sql.Date, value: startDate });
        }

        if (endDate) {
            whereConditions.push('CAST(a.currDate AS DATE) <= @EndDate');
            inputs.push({ name: 'EndDate', type: sql.Date, value: endDate });
        }

        if (classId) {
            whereConditions.push('ce.classId = @ClassId');
            inputs.push({ name: 'ClassId', type: sql.Int, value: classId });
        }

        if (trainerId) {
            whereConditions.push('c.trainerId = @TrainerId');
            inputs.push({ name: 'TrainerId', type: sql.Int, value: trainerId });
        }

        const query = `
            SELECT 
                u.fName + ' ' + u.lName as memberName,
                c.className,
                t.fName + ' ' + t.lName as trainerName,
                a.attendanceStatus,
                a.currDate,
                ce.enrollmentId,
                CASE 
                    WHEN a.attendanceStatus = 'P' THEN 'Present'
                    WHEN a.attendanceStatus = 'A' THEN 'Absent'
                    WHEN a.attendanceStatus = 'L' THEN 'Late'
                END as statusText
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN gymUser u ON ce.memberId = u.userId
            JOIN Class c ON ce.classId = c.classId
            JOIN gymUser t ON c.trainerId = t.userId
            WHERE ${whereConditions.join(' AND ')}
            ORDER BY a.currDate DESC, u.fName, u.lName
        `;

        const report = await executeQuery(query, inputs);

        res.json({ report });
    } catch (error) {
        console.error('Get attendance report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 