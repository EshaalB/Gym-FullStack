const express = require('express');
const sql = require('mssql');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const pool = require('../db');

// Get meal plan by membership type
router.get('/:membershipType', authenticateToken, async (req, res) => {
  try {
    const { membershipType } = req.params;
    
    const mealPlans = {
      'Basic': {
        name: 'Basic Fitness Meal Plan',
        description: 'A balanced meal plan for general fitness and weight maintenance',
        duration: '4 weeks',
        meals: {
          breakfast: [
            'Oatmeal with berries and nuts',
            'Greek yogurt with honey and granola',
            'Whole grain toast with avocado and eggs',
            'Smoothie bowl with protein powder'
          ],
          lunch: [
            'Grilled chicken salad with mixed greens',
            'Quinoa bowl with vegetables and tofu',
            'Turkey sandwich on whole grain bread',
            'Lentil soup with whole grain crackers'
          ],
          dinner: [
            'Salmon with steamed vegetables and brown rice',
            'Lean beef stir-fry with quinoa',
            'Vegetarian pasta with tomato sauce',
            'Grilled fish with sweet potato and greens'
          ],
          snacks: [
            'Apple with almond butter',
            'Carrot sticks with hummus',
            'Greek yogurt with berries',
            'Mixed nuts and dried fruits'
          ]
        },
        nutritionInfo: {
          calories: '1800-2200',
          protein: '120-150g',
          carbs: '200-250g',
          fat: '60-80g'
        }
      },
      'Premium': {
        name: 'Premium Performance Meal Plan',
        description: 'Advanced meal plan for muscle building and performance',
        duration: '6 weeks',
        meals: {
          breakfast: [
            'Protein pancakes with banana and maple syrup',
            'Egg white omelette with spinach and cheese',
            'Protein smoothie with oats and peanut butter',
            'Greek yogurt parfait with granola and fruits'
          ],
          lunch: [
            'Grilled chicken breast with quinoa and vegetables',
            'Tuna salad with mixed greens and olive oil',
            'Lean beef burger with sweet potato fries',
            'Salmon salad with avocado and nuts'
          ],
          dinner: [
            'Grilled steak with roasted vegetables and rice',
            'Baked chicken with mashed potatoes and greens',
            'Fish tacos with whole grain tortillas',
            'Lean pork chops with quinoa and vegetables'
          ],
          snacks: [
            'Protein shake with banana',
            'Cottage cheese with pineapple',
            'Hard-boiled eggs with avocado',
            'Protein bars and nuts'
          ]
        },
        nutritionInfo: {
          calories: '2200-2800',
          protein: '150-200g',
          carbs: '250-300g',
          fat: '80-100g'
        }
      },
      'VIP': {
        name: 'VIP Elite Nutrition Plan',
        description: 'Customized meal plan for maximum results and recovery',
        duration: '8 weeks',
        meals: {
          breakfast: [
            'Protein-rich smoothie bowl with superfoods',
            'Egg white frittata with vegetables and cheese',
            'Overnight oats with protein powder and berries',
            'Greek yogurt with honey, nuts, and fruits'
          ],
          lunch: [
            'Grilled salmon with quinoa and roasted vegetables',
            'Lean beef stir-fry with brown rice and vegetables',
            'Chicken Caesar salad with whole grain croutons',
            'Tuna steak with sweet potato and greens'
          ],
          dinner: [
            'Filet mignon with mashed potatoes and asparagus',
            'Grilled chicken with wild rice and vegetables',
            'Baked cod with quinoa and roasted vegetables',
            'Lean lamb chops with couscous and greens'
          ],
          snacks: [
            'Protein shake with creatine and BCAAs',
            'Greek yogurt with berries and honey',
            'Mixed nuts with dried fruits',
            'Protein bars and electrolyte drinks'
          ]
        },
        nutritionInfo: {
          calories: '2500-3200',
          protein: '180-220g',
          carbs: '280-350g',
          fat: '90-120g'
        }
      },
      'Temporary': {
        name: 'Temporary Fitness Starter Plan',
        description: 'Simple meal plan for beginners and temporary members',
        duration: '2 weeks',
        meals: {
          breakfast: [
            'Whole grain cereal with milk and banana',
            'Toast with peanut butter and honey',
            'Yogurt with granola and berries',
            'Oatmeal with raisins and cinnamon'
          ],
          lunch: [
            'Chicken sandwich with vegetables',
            'Pasta salad with tuna and vegetables',
            'Bean soup with whole grain bread',
            'Turkey wrap with mixed greens'
          ],
          dinner: [
            'Grilled chicken with rice and vegetables',
            'Fish with potatoes and salad',
            'Vegetarian stir-fry with rice',
            'Lean beef with pasta and vegetables'
          ],
          snacks: [
            'Fruit with yogurt',
            'Vegetables with hummus',
            'Nuts and dried fruits',
            'Whole grain crackers with cheese'
          ]
        },
        nutritionInfo: {
          calories: '1600-2000',
          protein: '100-130g',
          carbs: '180-220g',
          fat: '50-70g'
        }
      }
    };
    
    const mealPlan = mealPlans[membershipType];
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found for this membership type' });
    }
    
    res.json(mealPlan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's current meal plan
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's membership type
    const membershipQuery = `
      SELECT membershipType
      FROM MembershipDetails
      WHERE userId = @userId
    `;
    
    const membershipResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(membershipQuery);
    
    if (membershipResult.recordset.length === 0) {
      return res.status(404).json({ message: 'User membership not found' });
    }
    
    const membershipType = membershipResult.recordset[0].membershipType;
    
    // Get meal plan for this membership type
    const mealPlanResponse = await fetch(`http://localhost:3500/api/meal-plans/${membershipType}`, {
      headers: { Authorization: req.headers.authorization }
    });
    
    if (!mealPlanResponse.ok) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    const mealPlan = await mealPlanResponse.json();
    
    // Add user-specific information
    const userMealPlan = {
      ...mealPlan,
      userId: parseInt(userId),
      assignedDate: new Date().toISOString(),
      membershipType: membershipType
    };
    
    res.json(userMealPlan);
  } catch (error) {
    console.error('Error fetching user meal plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user's meal plan preferences
router.put('/user/:userId/preferences', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { dietaryRestrictions, allergies, preferences } = req.body;
    
    // Store user preferences (you might want to create a new table for this)
    const updateQuery = `
      UPDATE MembershipDetails
      SET 
        dietaryRestrictions = @dietaryRestrictions,
        allergies = @allergies,
        mealPreferences = @preferences
      WHERE userId = @userId
    `;
    
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('dietaryRestrictions', sql.VarChar, dietaryRestrictions || '')
      .input('allergies', sql.VarChar, allergies || '')
      .input('preferences', sql.VarChar, preferences || '')
      .query(updateQuery);
    
    res.json({ message: 'Meal plan preferences updated successfully' });
  } catch (error) {
    console.error('Error updating meal plan preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get meal plan statistics (for admin)
router.get('/stats/overview', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        membershipType,
        COUNT(*) as memberCount
      FROM MembershipDetails
      WHERE membershipStatus = 'Active'
      GROUP BY membershipType
    `;
    
    const result = await pool.request().query(statsQuery);
    
    const stats = {
      totalMembers: result.recordset.reduce((sum, row) => sum + row.memberCount, 0),
      byMembershipType: result.recordset
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching meal plan stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 