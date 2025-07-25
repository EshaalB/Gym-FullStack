const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const classController = require('../controllers/classController');
const router = express.Router();

// List all classes
router.get('/', authenticateToken, classController.getAllClasses);
// Add a new class
router.post('/', authenticateToken, requireRole(['Admin']), classController.createClass);

// Assign a member to a class
router.post('/assign-member', authenticateToken, classController.assignMemberToClass);

// Assign a trainer to a class
router.post('/assign-trainer', authenticateToken, requireRole(['Admin']), classController.assignTrainerToClass);

module.exports = router; 