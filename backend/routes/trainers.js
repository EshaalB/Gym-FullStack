const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const trainerController = require('../controllers/trainerController');
const router = express.Router();

// List all trainers
router.get('/', authenticateToken, trainerController.getAllTrainers);

// Add a new trainer (Admin only)
router.post('/', authenticateToken, requireRole(['Admin']), trainerController.createTrainer);

// Update a trainer (Admin only)
router.put('/:trainerId', authenticateToken, requireRole(['Admin']), trainerController.updateTrainer);

// Delete a trainer (Admin only)
router.delete('/:trainerId', authenticateToken, requireRole(['Admin']), trainerController.deleteTrainer);

// Trainer's own dashboard stats
router.get('/dashboard', authenticateToken, requireRole(['Trainer']), trainerController.getTrainerDashboard);

// Trainer's own classes
router.get('/classes', authenticateToken, requireRole(['Trainer']), trainerController.getTrainerClasses);

module.exports = router; 