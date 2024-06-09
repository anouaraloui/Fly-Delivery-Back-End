import express from "express";
import {  loginController, getUser, listUsersController, resetPasswordController, resetPasswordRequestController,  signUpController, updatePasswordController, validationAccountClientController, confirmAccountController, listUsersUnvalidatedController} from "../controllers/userControllers.js";
import isAuth from "../middlewares/auth.js";
import { ValidateRequestRegister, validateRequestPasswordReset } from "../middlewares/requestValidator.js";
import { validatorId } from "../middlewares/idValidator.js";
import { role } from "../middlewares/checkRole.js";


const router = express.Router();

// Route for login user
router.post('/auth/login', loginController);

// Route for request to reset the password                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
router.post('/auth/requestResetPassword', resetPasswordRequestController);

// Route for reset the password
router.patch('/auth/resetPassword', validateRequestPasswordReset,resetPasswordController);

// Route for register a new user
router.post('/users', ValidateRequestRegister , signUpController)

// Route for get all users
.get('/users', isAuth, (req, res, next) => role(['Admin'], req, res, next),
listUsersController);

// Route for validation a account
router.patch('/users/validationAccountClient', validationAccountClientController);

// Route for confirm account Restaurant und Deliveryman
router.patch('/users/confirmAccount/:id', isAuth, validatorId, (req, res, next) => role(['Admin'], req, res, next),
confirmAccountController);

// Route for get all users unvalidated with role "Restaurant & Deliveryman"
router.get('/users/request', isAuth, (req, res, next) => role(['Admin'], req, res, next),listUsersUnvalidatedController);

// Route for get one user
router.get('/users/:id', isAuth, validatorId, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next),
getUser);

//Route for update password
router.patch('/users/password/change', isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next),
updatePasswordController);

export default router;