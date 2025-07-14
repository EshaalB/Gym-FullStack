require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeDatabase } = require('./utils/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');
const paymentRoutes = require('./routes/payments');
const trainersRoutes = require('./routes/trainers');
const plansRoutes = require('./routes/plans');
const classesRoutes = require('./routes/classes');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/trainers', trainersRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/classes', classesRoutes);

// Legacy routes (for backward compatibility)
app.get('/api/active-inactive-members', async (req, res) => {
    try {
        const { executeQuery } = require('./utils/database');
        const query = `
            SELECT membershipStatus, COUNT(*) AS member_count 
            FROM MembershipDetails m
            JOIN gymUser u ON m.userId = u.userId
            WHERE u.userRole = 'Member'
            GROUP BY m.membershipStatus;
        `;
        const result = await executeQuery(query);
        res.json(result);
    } catch (error) {
        console.error('Active/inactive members error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/non-attendees-last-month', async (req, res) => {
    try {
        const { executeQuery } = require('./utils/database');
        const query = `
            SELECT u.userId, u.fName, u.lName 
            FROM gymUser u
            JOIN MembershipDetails m ON u.userId = m.userId
            LEFT JOIN Class_Enrollment ce ON m.userId = ce.memberId
            LEFT JOIN Attendance a ON ce.enrollmentId = a.enrollmentId 
                AND DATEDIFF(MONTH, a.currDate, GETDATE()) = 1
            WHERE u.userRole = 'Member' 
                AND a.enrollmentId IS NULL;
        `;
        const result = await executeQuery(query);
        res.json(result);
    } catch (error) {
        console.error('Non-attendees error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/active-members', async (req, res) => {
    try {
        const { executeQuery } = require('./utils/database');
        const query = `SELECT * FROM active_members;`;
        const result = await executeQuery(query);
        res.json(result);
    } catch (error) {
        console.error('Active members error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/class-attendance-rate', async (req, res) => {
    try {
        const { executeQuery } = require('./utils/database');
        const query = `
            SELECT ce.memberId, COUNT(*) AS TotalClasses,
                COUNT(CASE WHEN a.attendanceStatus = 'P' THEN 1 END) AS presentCount, 
                COUNT(CASE WHEN a.attendanceStatus = 'A' THEN 1 END) AS absentCount,
                (COUNT(CASE WHEN a.attendanceStatus = 'P' THEN 1 END) * 100.0) / COUNT(*) AS percent_rate
            FROM Class_Enrollment ce
            JOIN Attendance a ON ce.enrollmentId = a.enrollmentId
            GROUP BY ce.memberId;
        `;
        const result = await executeQuery(query);
        res.json(result);
    } catch (error) {
        console.error('Class attendance rate error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/frequent-attendees', async (req, res) => {
    try {
        const { executeQuery } = require('./utils/database');
        const query = `
            SELECT ce.memberId, u.fName, u.lName, COUNT(*) AS attendance_count 
            FROM Attendance a
            JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
            JOIN gymUser u ON ce.memberId = u.userId
            WHERE a.attendanceStatus = 'P'
                AND DATEDIFF(MONTH, a.currDate, GETDATE()) = 1
            GROUP BY ce.memberId, u.fName, u.lName
            HAVING COUNT(*) >= 10;
        `;
        const result = await executeQuery(query);
        res.json(result);
    } catch (error) {
        console.error('Frequent attendees error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/regular-absentees', async (req, res) => {
    try {
        const { executeQuery } = require('./utils/database');
        const query = `SELECT * FROM regular_absentees;`;
        const result = await executeQuery(query);
        res.json(result);
    } catch (error) {
        console.error('Regular absentees error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    const isDev = process.env.NODE_ENV === 'development';
    let message = 'Internal server error';
    let details = undefined;
    if (error.name === 'ValidationError') {
        message = 'Validation error';
        details = error.message;
    } else if (error.name === 'UnauthorizedError') {
        message = 'Unauthorized';
    } else if (error.message) {
        message = error.message;
        if (isDev && error.stack) {
            details = error.stack;
        }
    } else if (isDev && error.stack) {
        details = error.stack;
    }
    res.status(error.status || 500).json({ error: message, ...(details && { details }) });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Initialize database and start server
const PORT = process.env.PORT || 3500;

const startServer = async () => {
    try {
        // Initialize database connection
        await initializeDatabase();
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🔐 API Documentation: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app; 