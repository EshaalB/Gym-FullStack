require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeDatabase } = require('./utils/database');
const logger = require('./utils/logger');
const { requestLogger, errorLogger } = require('./middleware/logging');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');
const paymentRoutes = require('./routes/payments');
const trainersRoutes = require('./routes/trainers');
const plansRoutes = require('./routes/plans');
const classesRoutes = require('./routes/classes');
const membershipRoutes = require('./routes/memberships');
const mealPlanRoutes = require('./routes/mealPlans');
const supportRoutes = require('./routes/support');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3500;

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

// app.use(limiter); // Disabled for development to allow unlimited requests

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

// Add this line to handle preflight requests for all routes
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
    logger.info('Health check requested');
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: require('./package.json').version || '1.0.0'
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
app.use('/api/memberships', membershipRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/messages', messageRoutes);


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
        logger.error('Active/inactive members error:', error);
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
        logger.error('Non-attendees error:', error);
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
        logger.error('Active members error:', error);
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
        logger.error('Class attendance rate error:', error);
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
        logger.error('Frequent attendees error:', error);
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
        logger.error('Regular absentees error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add error logging middleware
app.use(errorLogger);

// 404 handler
app.use('*', (req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`, {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip
    });
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
    logger.error('Global error handler triggered', error, {
        method: req.method,
        path: req.path,
        userId: req.user ? req.user.userId : null
    });

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(error.status || 500).json({
        error: isDevelopment ? error.message : 'Internal server error',
        ...(isDevelopment && { stack: error.stack })
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', new Error(reason), {
        promise: promise.toString()
    });
    process.exit(1);
});

// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database connection
        await initializeDatabase();
        logger.info('Database initialized successfully');
        // Start server
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`, {
                port: PORT,
                environment: process.env.NODE_ENV || 'development',
                logLevel: process.env.LOG_LEVEL || 'INFO'
            });
        });
    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();

module.exports = app; 