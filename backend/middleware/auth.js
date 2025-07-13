const jwt = require('jsonwebtoken');
const sql = require('mssql');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Middleware to check if user has required role
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.userRole)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

// Middleware to check if user is accessing their own data or is admin
const requireOwnershipOrAdmin = (req, res, next) => {
    const requestedUserId = parseInt(req.params.userId || req.body.userId);
    
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.userRole === 'Admin' || req.user.userId === requestedUserId) {
        return next();
    }

    return res.status(403).json({ error: 'Access denied' });
};

// Middleware to refresh token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Check if refresh token exists in database (optional security measure)
        const query = `
            SELECT userId, fName, lName, email, userRole 
            FROM gymUser 
            WHERE userId = @UserId
        `;
        
        const request = req.app.locals.pool.request();
        request.input('UserId', sql.Int, decoded.userId);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const user = result.recordset[0];
        const newAccessToken = jwt.sign(
            { 
                userId: user.userId, 
                email: user.email, 
                userRole: user.userRole 
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ 
            accessToken: newAccessToken,
            user: {
                userId: user.userId,
                firstName: user.fName,
                lastName: user.lName,
                email: user.email,
                userRole: user.userRole
            }
        });
    } catch (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }
};

module.exports = {
    authenticateToken,
    requireRole,
    requireOwnershipOrAdmin,
    refreshToken
}; 