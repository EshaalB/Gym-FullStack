const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { loginValidation, signupValidation, handleValidationErrors } = require('../utils/validation');
const { executeQuery, executeProcedure, executeSingleQuery, sql } = require('../utils/database');

const router = express.Router();

// Login endpoint
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const userQuery = `
            SELECT userId, fName, lName, email, password, userRole
            FROM gymUser 
            WHERE email = @Email 
            AND userRole IN ('Trainer', 'Admin', 'Member')
        `;

        const user = await executeSingleQuery(userQuery, [
            { name: 'Email', type: sql.VarChar(100), value: email }
        ]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { 
                userId: user.userId, 
                email: user.email, 
                userRole: user.userRole 
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                userId: user.userId,
                firstName: user.fName,
                lastName: user.lName,
                email: user.email,
                userRole: user.userRole
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sign-up endpoint
router.post('/signup', signupValidation, handleValidationErrors, async (req, res) => {
    try {
        // Accept both camelCase and snake_case for compatibility
        const firstName = req.body.firstName || req.body.fName;
        const lastName = req.body.lastName || req.body.lName;
        const email = req.body.email;
        const password = req.body.password;
        const dob = req.body.dob || req.body.dateOfBirth || req.body.dateofBirth;
        const gender = req.body.gender;
        const userRole = req.body.userRole;
        const membershipType = req.body.membershipType;
        const specialization = req.body.specialization;
        const experience = req.body.experience;
        const salary = req.body.salary;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !dob || !gender || !userRole) {
            return res.status(400).json({ error: 'All required fields must be provided.' });
        }

        // Check if email already exists
        const existingUser = await executeSingleQuery(
            'SELECT userId FROM gymUser WHERE email = @Email',
            [{ name: 'Email', type: sql.VarChar(100), value: email }]
        );

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Register user using stored procedure
        const inputs = [
            { name: 'fname', type: sql.VarChar(100), value: firstName },
            { name: 'lname', type: sql.VarChar(100), value: lastName },
            { name: 'email', type: sql.VarChar(100), value: email },
            { name: 'password', type: sql.VarChar(255), value: hashedPassword },
            { name: 'dateofbirth', type: sql.Date, value: dob },
            { name: 'gender', type: sql.VarChar(20), value: gender },
            { name: 'userrole', type: sql.VarChar(20), value: userRole },
            { name: 'membershiptype', type: sql.VarChar(10), value: membershipType || null },
            { name: 'specialization', type: sql.VarChar(100), value: specialization || null },
            { name: 'experienceyears', type: sql.Int, value: experience || null },
            { name: 'salary', type: sql.Decimal(10,2), value: salary || null }
        ];

        await executeProcedure('registerUser', inputs);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                firstName,
                lastName,
                email,
                userRole
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message || (error.originalError && error.originalError.info && error.originalError.info.message) || 'Failed to register user' });
    }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Verify user exists
        const user = await executeSingleQuery(
            'SELECT userId, fName, lName, email, userRole FROM gymUser WHERE userId = @UserId',
            [{ name: 'UserId', type: sql.Int, value: decoded.userId }]
        );

        if (!user) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { 
                userId: user.userId, 
                email: user.email, 
                userRole: user.userRole 
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ 
            accessToken: newAccessToken,
            user: {
                userId: user.userId,
                firstName: user.fName,
                lastName: user.lName,
                email: user.email,
                userRole: user.userRole
            }
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
});

// Verify token endpoint
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        // Get user information from database
        const user = await executeSingleQuery(
            'SELECT userId, fName, lName, email, userRole FROM gymUser WHERE userId = @UserId',
            [{ name: 'UserId', type: sql.Int, value: req.user.userId }]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                userId: user.userId,
                firstName: user.fName,
                lastName: user.lName,
                email: user.email,
                userRole: user.userRole
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await executeSingleQuery(
            'SELECT userId, fName, lName, email, userRole, dateOfBirth, gender FROM gymUser WHERE userId = @UserId',
            [{ name: 'UserId', type: sql.Int, value: req.user.userId }]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                userId: user.userId,
                firstName: user.fName,
                lastName: user.lName,
                email: user.email,
                userRole: user.userRole,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password (authenticated users only)
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Get current user with password
        const user = await executeSingleQuery(
            'SELECT password FROM gymUser WHERE userId = @UserId',
            [{ name: 'UserId', type: sql.Int, value: req.user.userId }]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await executeQuery(
            'UPDATE gymUser SET password = @Password WHERE userId = @UserId',
            [
                { name: 'Password', type: sql.VarChar(255), value: hashedNewPassword },
                { name: 'UserId', type: sql.Int, value: req.user.userId }
            ]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user info endpoint
router.get('/me', authenticateToken, async (req, res) => {
    try {
        // Get user information from database
        const user = await executeSingleQuery(
            'SELECT userId, fName, lName, email, userRole FROM gymUser WHERE userId = @UserId',
            [{ name: 'UserId', type: sql.Int, value: req.user.userId }]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                userId: user.userId,
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                userRole: user.userRole
            }
        });
    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 