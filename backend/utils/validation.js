const { body, param, query, validationResult } = require('express-validator');

// Validation chains for different endpoints
const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const signupValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('dob')
        .isISO8601()
        .withMessage('Please provide a valid date of birth'),
    body('gender')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('userRole')
        .isIn(['Member', 'Trainer', 'Admin'])
        .withMessage('User role must be Member, Trainer, or Admin'),
    body('membershipType')
        .optional()
        .isIn(['Basic', 'Premium', 'VIP'])
        .withMessage('Membership type must be Basic, Premium, or VIP'),
    body('specialization')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Specialization must be less than 100 characters'),
    body('experience')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be a number between 0 and 50')
];

const userIdValidation = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
];

const attendanceValidation = [
    body('memberId')
        .isInt({ min: 1 })
        .withMessage('Member ID must be a positive integer'),
    body('classId')
        .isInt({ min: 1 })
        .withMessage('Class ID must be a positive integer'),
    body('attendanceStatus')
        .isIn(['P', 'A', 'L'])
        .withMessage('Attendance status must be P (Present), A (Absent), or L (Late)')
];

const paymentValidation = [
    body('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    body('paymentMethod')
        .isIn(['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'])
        .withMessage('Payment method must be Credit Card, Debit Card, Cash, or Bank Transfer'),
    body('paymentType')
        .isIn(['Membership', 'Class', 'Personal Training', 'Equipment'])
        .withMessage('Payment type must be Membership, Class, Personal Training, or Equipment')
];

const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Sanitize user input
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    return input;
};

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength
const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    loginValidation,
    signupValidation,
    userIdValidation,
    attendanceValidation,
    paymentValidation,
    paginationValidation,
    handleValidationErrors,
    sanitizeInput,
    isValidEmail,
    validatePasswordStrength
}; 