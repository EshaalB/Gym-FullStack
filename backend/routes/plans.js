const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const planController = require('../controllers/planController');
const router = express.Router();

// List all plans
router.get('/', authenticateToken, requireRole(['Admin']), planController.getAllPlans);

module.exports = router; 