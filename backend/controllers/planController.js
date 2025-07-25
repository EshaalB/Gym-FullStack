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

// Get all workout plans assigned to the logged-in trainer
exports.getTrainerPlans = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    const plans = await executeQuery(
      'SELECT * FROM WorkoutPlan WHERE trainerId = @TrainerId ORDER BY assigned_on DESC',
      [{ name: 'TrainerId', type: sql.Int, value: trainerId }]
    );
    res.json({ plans });
  } catch (error) {
    console.error('Get trainer plans error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Trainer assigns a workout plan to a member
exports.assignWorkoutPlan = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    const { memberId, plan_name, duration_weeks } = req.body;
    if (!memberId || !plan_name) {
      return res.status(400).json({ error: 'memberId and plan_name are required' });
    }
    // Check if member exists and is a Member
    const member = await executeQuery(
      'SELECT userId FROM gymUser WHERE userId = @MemberId AND userRole = \'Member\'',
      [{ name: 'MemberId', type: sql.Int, value: memberId }]
    );
    if (!member.length) {
      return res.status(404).json({ error: 'Member not found' });
    }
    // Insert workout plan
    await executeQuery(
      'INSERT INTO WorkoutPlan (memberId, trainerId, plan_name, duration_weeks) VALUES (@MemberId, @TrainerId, @PlanName, @DurationWeeks)',
      [
        { name: 'MemberId', type: sql.Int, value: memberId },
        { name: 'TrainerId', type: sql.Int, value: trainerId },
        { name: 'PlanName', type: sql.VarChar(100), value: plan_name },
        { name: 'DurationWeeks', type: sql.Int, value: duration_weeks || 4 }
      ]
    );
    res.status(201).json({ message: 'Workout plan assigned successfully' });
  } catch (error) {
    console.error('Assign workout plan error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Admin: Add a new workout plan
exports.addPlan = async (req, res) => {
  try {
    const { memberId, trainerId, plan_name, duration_weeks } = req.body;
    if (!memberId || !trainerId || !plan_name) {
      return res.status(400).json({ error: 'memberId, trainerId, and plan_name are required' });
    }
    await executeQuery(
      'INSERT INTO WorkoutPlan (memberId, trainerId, plan_name, duration_weeks) VALUES (@MemberId, @TrainerId, @PlanName, @DurationWeeks)',
      [
        { name: 'MemberId', type: sql.Int, value: memberId },
        { name: 'TrainerId', type: sql.Int, value: trainerId },
        { name: 'PlanName', type: sql.VarChar(100), value: plan_name },
        { name: 'DurationWeeks', type: sql.Int, value: duration_weeks || 4 }
      ]
    );
    res.status(201).json({ message: 'Workout plan created successfully' });
  } catch (error) {
    console.error('Add plan error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Admin: Update a workout plan
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { memberId, trainerId, plan_name, duration_weeks } = req.body;
    if (!memberId || !trainerId || !plan_name) {
      return res.status(400).json({ error: 'memberId, trainerId, and plan_name are required' });
    }
    const result = await executeQuery(
      'UPDATE WorkoutPlan SET memberId = @MemberId, trainerId = @TrainerId, plan_name = @PlanName, duration_weeks = @DurationWeeks WHERE planId = @PlanId',
      [
        { name: 'MemberId', type: sql.Int, value: memberId },
        { name: 'TrainerId', type: sql.Int, value: trainerId },
        { name: 'PlanName', type: sql.VarChar(100), value: plan_name },
        { name: 'DurationWeeks', type: sql.Int, value: duration_weeks || 4 },
        { name: 'PlanId', type: sql.Int, value: planId }
      ]
    );
    res.json({ message: 'Workout plan updated successfully' });
  } catch (error) {
    console.error('Update plan error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Admin: Delete a workout plan
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    await executeQuery(
      'DELETE FROM WorkoutPlan WHERE planId = @PlanId',
      [
        { name: 'PlanId', type: sql.Int, value: planId }
      ]
    );
    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Trainer: Create and assign a workout plan in one go
exports.createAndAssignWorkoutPlan = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    const { memberId, plan_name, duration_weeks } = req.body;
    if (!memberId || !plan_name) {
      return res.status(400).json({ error: 'memberId and plan_name are required' });
    }
    // Check if member exists and is a Member
    const member = await executeQuery(
      'SELECT userId FROM gymUser WHERE userId = @MemberId AND userRole = \'Member\'',
      [{ name: 'MemberId', type: sql.Int, value: memberId }]
    );
    if (!member.length) {
      return res.status(404).json({ error: 'Member not found' });
    }
    // Insert workout plan
    const result = await executeQuery(
      'INSERT INTO WorkoutPlan (memberId, trainerId, plan_name, duration_weeks) OUTPUT INSERTED.* VALUES (@MemberId, @TrainerId, @PlanName, @DurationWeeks)',
      [
        { name: 'MemberId', type: sql.Int, value: memberId },
        { name: 'TrainerId', type: sql.Int, value: trainerId },
        { name: 'PlanName', type: sql.VarChar(100), value: plan_name },
        { name: 'DurationWeeks', type: sql.Int, value: duration_weeks || 4 }
      ]
    );
    res.status(201).json({ message: 'Workout plan created and assigned successfully', plan: result[0] });
  } catch (error) {
    console.error('Create and assign workout plan error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};  