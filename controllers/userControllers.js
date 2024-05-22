import { config } from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requestPasswordReset, resetPassword } from "../services/passwordService.js";
import { register, listUsers, userById, changePassword, validationAccountClientService, confirmAccount, listUsersUnvalidated, loginUserService } from "../services/userService.js";

config();

// Controller for Register new user
export const signUpController = async (req, res, next) => {
    const signupService = await register(req.body);
    if(signupService) return res.status(201).json({ message: "User created", user: signupService });
    else return res.status(400).json({ message: 'Bad request!'});
};

// Controller for validation account
export const validationAccountClientController = async (req, res) => {
   try {
    const validationService = await validationAccountClientService(req.body.token);
    if(validationService.success) return res.status(200).json({ validationService })
    else return res.status(400).json({  validationService })
   } catch (error) {
    return res.status(400).json({ error })
   }     
    };

// Controller for confirm account Restaurant and Deliveryman
export const confirmAccountController = async (req, res) => {
    const {id} = req.params;
    const confirmAccountService = await confirmAccount(id);
    return res.status(200).json({ message: 'Confirm account ', confirmAccountService });
     
}

// Controller for login user
export const loginController = async (req, res) => {
     const { email, password } = req.body;
    try {
        const loginService = await loginUserService(email, password);
        if(loginService.success) return res.status(loginService.status).json({ response: loginService });
        else return res.status(loginService.status).json({ loginService });
    } catch (error) {
        return res.status(500).json({ error })
    }
};

// Controller for request password reset
export const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(req.body.email);
    return res.status(200).json({ message: "Check your email!", requestPasswordResetService });
};

// Controller for password reset
export const resetPasswordController = async (req, res) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    return res.status(200).json({ message: "Your password has been changed successfully.", resetPasswordService });
};

// Controller for get all users
export const listUsersController = async (req, res) => {
    const listUsersService = await listUsers(req.query);
    return res.status(200).json(listUsersService);
};

// Controller for get all users unvalidated with role " Restaurant & Deliveryman"
export const listUsersUnvalidatedController = async (req, res) => {
    const listUsersUnvalidatedService = await listUsersUnvalidated(req.query);
    return res.status(200).json(listUsersUnvalidatedService);
};

// Controller for get one user
export const getUser = async (req, res) => {
    const getUserService = await userById(req.params.id);
    return res.status(200).json(getUserService);
};

// Controller for update password
export const updatePasswordController = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const updatePasswordService = await changePassword(
        req.body.actualPassword,
        req.body.newPassword,
        req.body.confirmPassword,
        token);
    if(updatePasswordService) return res.status(200).json({ message: 'Password updated!', updatePasswordService });
    else return res.status(400).json({ message: 'Bad Request!', updatePasswordService });
};
