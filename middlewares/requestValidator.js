import { body, validationResult } from 'express-validator';

// Validator for register a new user
export const ValidateRequestRegister = [
    body(['firstName', 'lastName']).notEmpty()
        .withMessage('Name is required!')
        .isLength({ min: 2 })
        .isString()
        .trim()
        .escape()
        .withMessage(' First name should be at least 2 chars!'),
    body('email').isEmail().normalizeEmail().withMessage('Not a valid e-mail adress!'),
    body('password').isStrongPassword()
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/).withMessage("Password must include one lowercase character, one uppercase character, a number, a special character, and at least 8 chars."),
    body('role').notEmpty()
        .isIn(['admin', 'restaurant', 'deliveryman', 'customer']).withMessage('Role is required!'),
    body('phone').notEmpty().withMessage('Phone is required')
        .isMobilePhone('ar-TN'),
    body('adress').optional(),
    body('avatar').optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

// Validator for password reset
export const validateRequestPasswordReset = [
    body('userId').notEmpty().withMessage("User Id is required!"),
    body('password').isStrongPassword()
                    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/).withMessage("Password must include one lowercase character, one uppercase character, a number, a special character, and at least 8 chars."),
    body('token').notEmpty().withMessage("Token is required!"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];
