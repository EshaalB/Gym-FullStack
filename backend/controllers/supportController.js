const { executeQuery, sql } = require('../utils/database');

exports.sendSupportRequest = async (req, res) => {
  try {
    const { userId, subject, message } = req.body;
    if (!userId || !subject || !message) {
      return res.status(400).json({ error: 'userId, subject, and message are required' });
    }
    await executeQuery(
      'INSERT INTO SupportRequests (userId, subject, message, sentAt) VALUES (@UserId, @Subject, @Message, GETDATE())',
      [
        { name: 'UserId', type: sql.Int, value: userId },
        { name: 'Subject', type: sql.VarChar(255), value: subject },
        { name: 'Message', type: sql.VarChar(1000), value: message }
      ]
    );
    res.json({ message: 'Support request sent successfully' });
  } catch (error) {
    console.error('Send support request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 