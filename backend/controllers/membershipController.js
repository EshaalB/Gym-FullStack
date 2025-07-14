const { executeQuery, executeSingleQuery, sql } = require('../utils/database');

exports.renewMembership = async (req, res) => {
  try {
    const { userId, period } = req.body;
    if (!userId || !period) {
      return res.status(400).json({ error: 'userId and period are required' });
    }
    // Get current expiry
    const membership = await executeSingleQuery(
      'SELECT expiryDate FROM MembershipDetails WHERE userId = @UserId',
      [{ name: 'UserId', type: sql.Int, value: userId }]
    );
    let newExpiry;
    if (membership && membership.expiryDate && new Date(membership.expiryDate) > new Date()) {
      // Extend from current expiry
      newExpiry = new Date(membership.expiryDate);
    } else {
      // Start from today
      newExpiry = new Date();
    }
    newExpiry.setMonth(newExpiry.getMonth() + Number(period));
    // Update expiry
    await executeQuery(
      'UPDATE MembershipDetails SET expiryDate = @ExpiryDate WHERE userId = @UserId',
      [
        { name: 'ExpiryDate', type: sql.Date, value: newExpiry },
        { name: 'UserId', type: sql.Int, value: userId }
      ]
    );
    res.json({ message: 'Membership renewed successfully', newExpiry });
  } catch (error) {
    console.error('Renew membership error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 