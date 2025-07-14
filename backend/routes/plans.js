const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const planController = require('../controllers/planController');
const router = express.Router();

// List all plans
router.get('/', authenticateToken, requireRole(['Admin']), planController.getAllPlans);
// Add route to get plans for a specific user
router.get('/user/:userId', authenticateToken, planController.getUserPlans);

module.exports = router; 