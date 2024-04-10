import express from "express";
import {   loginController, getUser, listUsersController, resetPasswordController, resetPasswordRequestController,  signUpController } from "../controllers/userControllers.js";

import isAuth from "../middlewares/auth.js";
import { ValidateRequestRegister, validateRequestPasswordReset } from "../middlewares/requestValidator.js";
import { validatorId } from "../middlewares/idvalidator.js";


const router = express.Router();

// Route for login user
router.post('/auth/login', loginController);

// Route for request to reset the password
router.post('/auth/requestResetPassword', resetPasswordRequestController);

// Route for reset the password
router.patch('/auth/resetPassword', validateRequestPasswordReset,resetPasswordController);

// Route for register a new user
router.post('/users', ValidateRequestRegister , signUpController);

// Route for get all users
router.get('/users', listUsersController)

// Route for get one user
router.get('/users/:id', validatorId,getUser)

export default router;