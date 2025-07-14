const { executeQuery, sql } = require('../utils/database');

exports.getAllPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const plansQuery = `
      SELECT * FROM WorkoutPlan
      ORDER BY planId DESC
      OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
    `;
    const countQuery = 'SELECT COUNT(*) as total FROM WorkoutPlan';
    const [plans, countResult] = await Promise.all([
      executeQuery(plansQuery, [
        { name: 'Offset', type: require('mssql').Int, value: offset },
        { name: 'Limit', type: require('mssql').Int, value: limit }
      ]),
      executeQuery(countQuery)
    ]);
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    res.json({
      plans,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('List plans error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get all workout plans assigned to a specific user
exports.getUserPlans = async (req, res) => {
  try {
    // Table does not exist, so return empty result
    res.json({ plans: [], message: 'UserWorkoutPlans table not found. No plans assigned.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};  