const { executeQuery, sql } = require('../utils/database');

exports.sendTrainerMessage = async (req, res) => {
  try {
    const { userId, trainerId, message } = req.body;
    if (!userId || !trainerId || !message) {
      return res.status(400).json({ error: 'userId, trainerId, and message are required' });
    }
    await executeQuery(
      'INSERT INTO TrainerMessages (userId, trainerId, message, sentAt) VALUES (@UserId, @TrainerId, @Message, GETDATE())',
      [
        { name: 'UserId', type: sql.Int, value: userId },
        { name: 'TrainerId', type: sql.Int, value: trainerId },
        { name: 'Message', type: sql.VarChar(1000), value: message }
      ]
    );
    res.json({ message: 'Message sent to trainer successfully' });
  } catch (error) {
    console.error('Send trainer message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 