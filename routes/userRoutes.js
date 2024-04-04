import express from "express";
import {  login,  resetPasswordController, resetPasswordRequestController,  signUpController } from "../controllers/userControllers.js";

const router = express.Router();

// Route for login user
router.post('/auth/login', login);

// Route for forgot password
router.post('/auth/requestResetPassword', resetPasswordRequestController);

// Route for reset the password
router.patch('/auth/resetPassword', resetPasswordController);

// Route for register a new user
router.post('/users', signUpController);

export default router;