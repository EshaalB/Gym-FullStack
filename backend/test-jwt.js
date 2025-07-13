const jwt = require('jsonwebtoken');

// Test JWT functionality
const testJWT = () => {
    const payload = {
        userId: 1,
        email: 'test@example.com',
        userRole: 'Admin'
    };

    const secret = process.env.JWT_SECRET || 'test_secret';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret';

    try {
        // Generate access token
        const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
        console.log('✅ Access token generated successfully');
        console.log('Token:', accessToken.substring(0, 50) + '...');

        // Generate refresh token
        const refreshToken = jwt.sign({ userId: payload.userId }, refreshSecret, { expiresIn: '7d' });
        console.log('✅ Refresh token generated successfully');
        console.log('Refresh Token:', refreshToken.substring(0, 50) + '...');

        // Verify access token
        const decoded = jwt.verify(accessToken, secret);
        console.log('✅ Token verification successful');
        console.log('Decoded payload:', decoded);

        console.log('\n🎉 JWT functionality test passed!');
    } catch (error) {
        console.error('❌ JWT test failed:', error.message);
    }
};

// Run test if this file is executed directly
if (require.main === module) {
    require('dotenv').config();
    testJWT();
}

module.exports = { testJWT }; 