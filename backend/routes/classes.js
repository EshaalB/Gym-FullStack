const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const classController = require('../controllers/classController');
const router = express.Router();

// List all classes
router.get('/', authenticateToken, requireRole(['Admin']), classController.getAllClasses);
// Add a new class
router.post('/', authenticateToken, requireRole(['Admin']), classController.createClass);

module.exports = router; 