const express = require('express');
const router = express.Router();
const { sendSupportRequest } = require('../controllers/supportController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/support
router.post('/', authenticateToken, sendSupportRequest);

module.exports = router; 