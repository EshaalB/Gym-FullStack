const express = require('express');
const router = express.Router();
const { sendTrainerMessage } = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/messages/trainer
router.post('/trainer', authenticateToken, sendTrainerMessage);

module.exports = router; 