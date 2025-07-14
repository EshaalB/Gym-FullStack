const express = require('express');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');
const { userIdValidation, paginationValidation, handleValidationErrors } = require('../utils/validation');
const userController = require('../controllers/userController');

const router = express.Router();

// Create a new user (Admin only)
router.post('/', authenticateToken, requireRole(['Admin']), userController.createUser);

// Delete a user (Admin only)
router.delete('/:userId', authenticateToken, requireRole(['Admin']), userIdValidation, handleValidationErrors, userController.deleteUser);

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole(['Admin']), paginationValidation, handleValidationErrors, userController.getAllUsers);

// Get user by ID (Admin or own profile)
router.get('/:userId', authenticateToken, requireOwnershipOrAdmin, userIdValidation, handleValidationErrors, userController.getUserById);

// Update user profile (Admin or own profile)
router.put('/:userId', authenticateToken, requireOwnershipOrAdmin, userIdValidation, handleValidationErrors, userController.updateUser);

// PUT /api/users/:userId
router.put('/:userId', authenticateToken, userController.updateUser);

// Deactivate/Activate user (Admin only)
router.patch('/:userId/status', authenticateToken, requireRole(['Admin']), userIdValidation, handleValidationErrors, userController.updateUserStatus);

// Get user statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireRole(['Admin']), userController.getStatsOverview);

// Search users (Admin only)
router.get('/search', authenticateToken, requireRole(['Admin']), userController.searchUsers);

// Get next class for user
router.get('/next-class', userController.getNextClass);

// Get user payments
router.get('/user-payments', userController.getUserPayments);

// Get user stats
router.get('/user-stats', userController.getUserStats);

// Add route for user to see their assigned classes
router.get('/:userId/classes', authenticateToken, requireOwnershipOrAdmin, userController.getUserClasses);

module.exports = router; 