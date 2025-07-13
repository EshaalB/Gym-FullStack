const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { executeQuery, executeSingleQuery, sql } = require('../utils/database');
const router = express.Router();

// List all plans
router.get('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const plans = await executeQuery('SELECT * FROM WorkoutPlan');
        res.json({ plans });
    } catch (error) {
        console.error('List plans error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Add a new plan
router.post('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { memberId, trainerId, plan_name, duration_weeks } = req.body;
        if (!memberId || !trainerId || !plan_name || !duration_weeks) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const insertQuery = `INSERT INTO WorkoutPlan (memberId, trainerId, plan_name, duration_weeks, assigned_on) VALUES (@MemberId, @TrainerId, @PlanName, @DurationWeeks, GETDATE())`;
        await executeQuery(insertQuery, [
            { name: 'MemberId', type: sql.Int, value: memberId },
            { name: 'TrainerId', type: sql.Int, value: trainerId },
            { name: 'PlanName', type: sql.VarChar(100), value: plan_name },
            { name: 'DurationWeeks', type: sql.Int, value: duration_weeks }
        ]);
        res.status(201).json({ message: 'Plan created successfully' });
    } catch (error) {
        console.error('Create plan error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Edit a plan
router.put('/:planId', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { planId } = req.params;
        const { plan_name, duration_weeks } = req.body;
        await executeQuery('UPDATE WorkoutPlan SET plan_name = @PlanName, duration_weeks = @DurationWeeks WHERE planId = @PlanId', [
            { name: 'PlanName', type: sql.VarChar(100), value: plan_name },
            { name: 'DurationWeeks', type: sql.Int, value: duration_weeks },
            { name: 'PlanId', type: sql.Int, value: planId }
        ]);
        res.json({ message: 'Plan updated successfully' });
    } catch (error) {
        console.error('Edit plan error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete a plan
router.delete('/:planId', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { planId } = req.params;
        await executeQuery('DELETE FROM WorkoutPlan WHERE planId = @PlanId', [
            { name: 'PlanId', type: sql.Int, value: planId }
        ]);
        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        console.error('Delete plan error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router; 