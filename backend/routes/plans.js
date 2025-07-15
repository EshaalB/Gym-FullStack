const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const planController = require('../controllers/planController');
const router = express.Router();

// List all plans
router.get('/', authenticateToken, requireRole(['Admin']), planController.getAllPlans);
// Add route to get plans for a specific user
router.get('/user/:userId', authenticateToken, planController.getUserPlans);

// Trainer: Get all workout plans assigned to the logged-in trainer
router.get('/trainer', authenticateToken, requireRole(['Trainer']), planController.getTrainerPlans);

// Trainer: Assign a workout plan to a member
router.post('/trainer/assign', authenticateToken, requireRole(['Trainer']), planController.assignWorkoutPlan);

module.exports = router; 