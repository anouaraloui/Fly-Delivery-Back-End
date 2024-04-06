import { body, validationResult } from 'express-validator';

export const ValidateRequestRegister = [
    body('firstName', 'lastName').notEmpty()
                                .withMessage('First name is required!')
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
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];
