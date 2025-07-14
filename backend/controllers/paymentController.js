const { executeQuery, executeSingleQuery, executeProcedure, sql } = require('../utils/database');

exports.processPayment = async (req, res) => {
  try {
    const { userId, amount, paymentMethod, paymentType, description } = req.body;

    // Check if user exists and is active
    const user = await executeSingleQuery(
      'SELECT userId, fName, lName, userRole FROM gymUser WHERE userId = @UserId AND isActive = 1',
      [{ name: 'UserId', type: sql.Int, value: userId }]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    // Process payment using stored procedure
    const result = await executeProcedure('ProcessPayment', [
      { name: 'memberId', type: sql.Int, value: userId },
      { name: 'amount', type: sql.Decimal(10, 2), value: amount },
      { name: 'paymentMethod', type: sql.VarChar(50), value: paymentMethod },
      { name: 'paymentType', type: sql.VarChar(50), value: paymentType },
      { name: 'description', type: sql.VarChar(255), value: description || null },
      { name: 'processedBy', type: sql.Int, value: req.user.userId }
    ]);

    res.json({ 
      message: 'Payment processed successfully',
      payment: {
        userId,
        amount,
        paymentMethod,
        paymentType,
        status: 'Completed',
        processedBy: req.user.userId
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

exports.getRevenueByType = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = '';
    let inputs = [];
    if (startDate && endDate) {
      dateFilter = 'AND p.paymentDate BETWEEN @StartDate AND @EndDate';
      inputs.push(
        { name: 'StartDate', type: sql.Date, value: startDate },
        { name: 'EndDate', type: sql.Date, value: endDate }
      );
    }
    const query = `
      SELECT 
        p.paymentType,
        COUNT(*) as transactionCount,
        SUM(p.amount) as totalRevenue,
        AVG(p.amount) as averageAmount
      FROM Payment p
      WHERE p.status = 'Completed' ${dateFilter}
      GROUP BY p.paymentType
      ORDER BY totalRevenue DESC
    `;
    const revenue = await executeQuery(query, inputs);
    res.json({ revenue });
  } catch (error) {
    console.error('Get revenue by type error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const query = `
      SELECT 
        YEAR(p.paymentDate) as year, 
        MONTH(p.paymentDate) as month,
        DATENAME(MONTH, p.paymentDate) as monthName,
        p.paymentType,
        COUNT(*) as transactionCount,
        SUM(p.amount) as totalRevenue
      FROM Payment p
      WHERE p.paymentDate >= DATEADD(MONTH, -@Months, GETDATE())
      AND p.status = 'Completed'
      GROUP BY YEAR(p.paymentDate), MONTH(p.paymentDate), DATENAME(MONTH, p.paymentDate), p.paymentType
      ORDER BY year ASC, month ASC, p.paymentType
    `;
    const revenue = await executeQuery(query, [{ name: 'Months', type: sql.Int, value: parseInt(months) }]);
    res.json({ revenue });
  } catch (error) {
    console.error('Get monthly revenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPendingPayments = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.paymentId,
        p.memberId,
        (u.fName + ' ' + u.lName) AS userName,
        u.email,
        p.amount,
        p.paymentMethod,
        p.paymentDate,
        p.status
      FROM Payment p
      LEFT JOIN gymUser u ON p.memberId = u.userId
      WHERE p.status = 'Pending'
      ORDER BY p.paymentDate DESC
    `;
    const pendingPayments = await executeQuery(query);
    res.json({ pendingPayments });
  } catch (error) {
    console.error('Get pending payments error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, status } = req.query;
    if (req.user.userRole === 'Member' && req.user.userId != userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    let whereConditions = ['p.memberId = @UserId'];
    let inputs = [{ name: 'UserId', type: sql.Int, value: userId }];
    if (startDate) {
      whereConditions.push('p.paymentDate >= @StartDate');
      inputs.push({ name: 'StartDate', type: sql.Date, value: startDate });
    }
    if (endDate) {
      whereConditions.push('p.paymentDate <= @EndDate');
      inputs.push({ name: 'EndDate', type: sql.Date, value: endDate });
    }
    if (status) {
      whereConditions.push('p.status = @Status');
      inputs.push({ name: 'Status', type: sql.VarChar(20), value: status });
    }
    const query = `
      SELECT 
        p.paymentId,
        p.amount,
        p.paymentMethod,
        p.paymentDate,
        p.status
      FROM Payment p
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY p.paymentDate DESC
    `;
    const payments = await executeQuery(query, inputs);
    // Calculate payment statistics
    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const completedPayments = payments.filter(p => p.status === 'Completed').length;
    const pendingPayments = payments.filter(p => p.status === 'Pending').length;
    res.json({
      payments,
      statistics: {
        totalPayments: payments.length,
        totalAmount: Math.round(totalAmount * 100) / 100,
        completedPayments,
        pendingPayments
      }
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    if (!['Pending', 'Completed', 'Failed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }
    await executeQuery(
      'UPDATE Payment SET status = @Status WHERE paymentId = @PaymentId',
      [
        { name: 'Status', type: sql.VarChar(20), value: status },
        { name: 'PaymentId', type: sql.Int, value: paymentId }
      ]
    );
    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStatsOverview = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let dateFilter = '';
    switch (period) {
      case 'week':
        dateFilter = "AND paymentDate >= DATEADD(WEEK, -1, GETDATE())";
        break;
      case 'month':
        dateFilter = "AND paymentDate >= DATEADD(MONTH, -1, GETDATE())";
        break;
      case 'year':
        dateFilter = "AND paymentDate >= DATEADD(YEAR, -1, GETDATE())";
        break;
    }
    // Overall payment statistics
    const overallStatsQuery = `
      SELECT 
        COUNT(*) as totalPayments,
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as totalRevenue,
        SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pendingAmount,
        AVG(CASE WHEN status = 'Completed' THEN amount END) as averagePayment,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completedPayments,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pendingPayments
      FROM Payment
      WHERE 1=1 ${dateFilter}
    `;
    const overallStats = await executeSingleQuery(overallStatsQuery);
    res.json({
      totalRevenue: overallStats.totalRevenue || 0,
      totalPayments: overallStats.totalPayments || 0,
      completedPayments: overallStats.completedPayments || 0,
      pendingPayments: overallStats.pendingPayments || 0,
      averagePayment: overallStats.averagePayment || 0,
      period
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 