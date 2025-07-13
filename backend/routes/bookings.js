const express = require('express');
const sql = require('mssql');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const pool = require('../db');

// Get available classes for booking
router.get('/available-for-booking', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        c.classId,
        c.className,
        t.fName + ' ' + t.lName as trainerName,
        c.seats,
        (SELECT COUNT(*) FROM Class_Enrollment WHERE classId = c.classId) as enrolledCount,
        cd.Day as classDay,
        '60' as duration
      FROM Class c
      INNER JOIN gymUser t ON c.trainerId = t.userId
      INNER JOIN ClassDays cd ON c.classId = cd.classId
      WHERE c.seats > (SELECT COUNT(*) FROM Class_Enrollment WHERE classId = c.classId)
      ORDER BY c.className, cd.Day
    `;
    
    const result = await pool.request().query(query);
    
    // Process results to add available seats and class time
    const classes = result.recordset.map(classItem => ({
      ...classItem,
      availableSeats: classItem.seats - classItem.enrolledCount,
      classTime: getClassTimeByDay(classItem.classDay)
    }));
    
    res.json(classes);
  } catch (error) {
    console.error('Error fetching available classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a booking
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { classId, bookingDate, userId } = req.body;
    
    // Validate input
    if (!classId || !bookingDate || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user is already enrolled in this class
    const existingEnrollment = await pool.request()
      .input('userId', sql.Int, userId)
      .input('classId', sql.Int, classId)
      .query(`
        SELECT enrollmentId 
        FROM Class_Enrollment 
        WHERE memberId = @userId AND classId = @classId
      `);
    
    if (existingEnrollment.recordset.length > 0) {
      return res.status(400).json({ message: 'You are already enrolled in this class' });
    }
    
    // Check if class has available seats
    const classAvailability = await pool.request()
      .input('classId', sql.Int, classId)
      .query(`
        SELECT 
          c.seats,
          (SELECT COUNT(*) FROM Class_Enrollment WHERE classId = c.classId) as enrolledCount
        FROM Class c
        WHERE c.classId = @classId
      `);
    
    if (classAvailability.recordset.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    const classData = classAvailability.recordset[0];
    if (classData.enrolledCount >= classData.seats) {
      return res.status(400).json({ message: 'Class is full' });
    }
    
    // Create enrollment
    const enrollmentResult = await pool.request()
      .input('userId', sql.Int, userId)
      .input('classId', sql.Int, classId)
      .query(`
        INSERT INTO Class_Enrollment (memberId, classId, enrolled_on)
        OUTPUT INSERTED.enrollmentId
        VALUES (@userId, @classId, GETDATE())
      `);
    
    const enrollmentId = enrollmentResult.recordset[0].enrollmentId;
    
    // Create booking record
    await pool.request()
      .input('enrollmentId', sql.Int, enrollmentId)
      .input('bookingDate', sql.Date, bookingDate)
      .query(`
        INSERT INTO Bookings (enrollmentId, bookingDate, status, created_at)
        VALUES (@enrollmentId, @bookingDate, 'Confirmed', GETDATE())
      `);
    
    res.json({
      message: 'Class booked successfully',
      bookingId: enrollmentId,
      classId: classId,
      bookingDate: bookingDate
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT 
        b.bookingId,
        b.bookingDate,
        b.status,
        b.created_at,
        c.className,
        c.classId,
        t.fName + ' ' + t.lName as trainerName,
        cd.Day as classDay
      FROM Bookings b
      INNER JOIN Class_Enrollment ce ON b.enrollmentId = ce.enrollmentId
      INNER JOIN Class c ON ce.classId = c.classId
      INNER JOIN gymUser t ON c.trainerId = t.userId
      INNER JOIN ClassDays cd ON c.classId = cd.classId
      WHERE ce.memberId = @userId
      ORDER BY b.bookingDate DESC, b.created_at DESC
    `;
    
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(query);
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel a booking
router.delete('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId; // From token
    
    // Check if booking belongs to user
    const bookingCheck = await pool.request()
      .input('bookingId', sql.Int, bookingId)
      .input('userId', sql.Int, userId)
      .query(`
        SELECT b.bookingId, b.status
        FROM Bookings b
        INNER JOIN Class_Enrollment ce ON b.enrollmentId = ce.enrollmentId
        WHERE b.bookingId = @bookingId AND ce.memberId = @userId
      `);
    
    if (bookingCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const booking = bookingCheck.recordset[0];
    
    // Check if booking can be cancelled (e.g., not within 24 hours)
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const hoursUntilClass = (bookingDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilClass < 24) {
      return res.status(400).json({ message: 'Bookings can only be cancelled at least 24 hours before the class' });
    }
    
    // Update booking status
    await pool.request()
      .input('bookingId', sql.Int, bookingId)
      .query(`
        UPDATE Bookings 
        SET status = 'Cancelled', updated_at = GETDATE()
        WHERE bookingId = @bookingId
      `);
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get booking statistics (for admin)
router.get('/stats/overview', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as totalBookings,
        COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmedBookings,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelledBookings,
        COUNT(CASE WHEN bookingDate >= DATEADD(day, -30, GETDATE()) THEN 1 END) as bookingsThisMonth
      FROM Bookings
    `;
    
    const result = await pool.request().query(statsQuery);
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to get class time based on day
function getClassTimeByDay(day) {
  const timeMap = {
    'Monday': '09:00 AM',
    'Tuesday': '10:00 AM',
    'Wednesday': '06:00 PM',
    'Thursday': '07:00 AM',
    'Friday': '05:00 PM',
    'Saturday': '08:00 AM',
    'Sunday': '10:00 AM'
  };
  return timeMap[day] || '09:00 AM';
}

module.exports = router; 