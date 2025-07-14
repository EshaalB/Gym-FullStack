const express = require('express');
const router = express.Router();
const { renewMembership } = require('../controllers/membershipController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/memberships/renew
router.post('/renew', authenticateToken, renewMembership);

module.exports = router; 