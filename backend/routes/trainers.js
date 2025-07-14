const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const trainerController = require('../controllers/trainerController');
const router = express.Router();

// List all trainers
router.get('/', authenticateToken, requireRole(['Admin']), trainerController.getAllTrainers);

// Trainer's own dashboard stats
router.get('/dashboard', authenticateToken, requireRole(['Trainer']), trainerController.getTrainerDashboard);

// Trainer's own classes
router.get('/classes', authenticateToken, requireRole(['Trainer']), trainerController.getTrainerClasses);

module.exports = router; 