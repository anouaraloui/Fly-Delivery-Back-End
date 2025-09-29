import { body, validationResult } from 'express-validator';

// Validator for register a new user
export const ValidateRequestRegister = [
    body('name').notEmpty()
        .withMessage('Name is required!')
        .isLength({ min: 1 })
        .isString()
        .escape()
        .withMessage(' Name should be at least one chars!'),
    body('email').isEmail().normalizeEmail().withMessage('Not a valid e-mail adress!'),
    body('password').isStrongPassword()
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/).withMessage("Password must include one lowercase character, one uppercase character, a number, a special character, and at least 8 chars."),
    body('role').notEmpty()
        .isIn(['Admin', 'Restaurant', 'Deliveryman', 'Customer']).withMessage('Role is required!'),
    body('phone').notEmpty().withMessage('Phone is required')
    .isMobilePhone().isMobilePhone('ar-TN').withMessage('Phone number should be 8 digits'),
    body('avatar').optional(),
    body('validationCode').optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        else return next();
    }
];

// Validator for password reset
export const validateRequestPasswordReset = [
    body('password').isStrongPassword()
                    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/).withMessage("Password must include one lowercase character, one uppercase character, a number, a special character, and at least 8 chars."),
    body('token').notEmpty().withMessage("Token is required!"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

// Validator for article
export const validateArticle = [
    body('name').notEmpty().withMessage("Article name is required!"),
    body('picture').optional(),
    body('price').notEmpty().withMessage("Article price is required!")
    .isFloat({gt:0}).withMessage("Prise must be a positive number!"),
    body('information').notEmpty().withMessage("Article information is required!"),
    body('discount').isFloat({min: 0, max:100}).withMessage("Discount percentage must be between 0 and 100%!"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }    
];

// Create new Order
export const createOrderValidator = [
    body('shippingAddress.fullName').notEmpty().withMessage('Your Full Name is required!').isLength({min:1}).isString(),
    body('shippingAddress.address').notEmpty().withMessage('Your Adress is required!'),
    body('shippingAddress.phone').notEmpty().isMobilePhone('ar-TN').withMessage('Phone is required!'),
    body('shippingAddress.city').notEmpty().withMessage('Your City is required!'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Your postalCode Name is required!'),
    body('shippingAddress.country').notEmpty().withMessage('Your country is required!'),
    body('pricePieces').notEmpty().isDecimal().withMessage('Item Price is required!'),
    body('numberOfPieces').notEmpty().isNumeric().withMessage('Number of Pieces is required!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        else return next();
    }
];