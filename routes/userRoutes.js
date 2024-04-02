import express from "express";
import { forgotPassword, login, registerUser, resetpassword } from "../controllers/userControllers.js";

const router = express.Router();

// Route for login user
router.post('/auth/login', login);

// Route for forgot password
router.post('/auth/forgotpassword', forgotPassword);

// Route for reset the password
router.patch('/auth/resetpassword', resetpassword);

// Route for register a new user
router.post('/users', registerUser);

export default router;