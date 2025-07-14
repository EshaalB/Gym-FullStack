const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');
const { paymentValidation, handleValidationErrors } = require('../utils/validation');
const router = express.Router();

// Get revenue by payment type (Admin only)
router.get('/revenue-by-type', authenticateToken, requireRole(['Admin']), paymentController.getRevenueByType);
// Get monthly revenue (Admin only)
router.get('/monthly-revenue', authenticateToken, requireRole(['Admin']), paymentController.getMonthlyRevenue);
// Process payment (Admin/Trainer only)
router.post('/process', authenticateToken, requireRole(['Admin', 'Trainer']), paymentValidation, handleValidationErrors, paymentController.processPayment);
// Get pending payments (Admin only)
router.get('/pending', authenticateToken, requireRole(['Admin']), paymentController.getPendingPayments);
// Get payment history for a user (Admin or own payments)
router.get('/user/:userId', authenticateToken, paymentController.getUserPayments);
// Update payment status (Admin only)
router.patch('/:paymentId/status', authenticateToken, requireRole(['Admin']), paymentController.updatePaymentStatus);
// Get payment statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireRole(['Admin']), paymentController.getStatsOverview);

module.exports = router;