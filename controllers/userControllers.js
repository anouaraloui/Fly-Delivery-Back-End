import { config } from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requestPasswordReset, resetPassword } from "../services/passwordService.js";
import { register, listUsers, userById, changePassword, validationAccountClientService, confirmAccount, listUsersUnvalidated, loginUserService } from "../services/userService.js";


config();

// Controller for Register new user
export const signUpController = async (req, res) => {
    const signupService = await register(req.body);
    return res.status(signupService.status).json({ response: signupService });
};

// Controller for validation account
export const validationAccountClientController = async (req, res) => {
    const validationService = await validationAccountClientService(req.body.token);
    return res.status(validationService.status).json({ response: validationService });
};

// Controller for confirm account Restaurant and Deliveryman
export const confirmAccountController = async (req, res) => {
    const { id } = req.params;
    const confirmAccountService = await confirmAccount(id);
    return res.status(confirmAccountService.status).json({ response: confirmAccountService });
}

// Controller for login user
export const loginController = async (req, res) => {
    const { email, password } = req.body;
    const loginService = await loginUserService(email, password);
    return res.status(loginService.status).json({ response: loginService });
};

// Controller for request password reset
export const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(req.body.email);
    return res.status(requestPasswordResetService.status).json({ response: requestPasswordResetService });
};

// Controller for password reset
export const resetPasswordController = async (req, res) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    return res.status(resetPasswordService.status).json({ response: resetPasswordService });
};

// Controller for get all users
export const listUsersController = async (req, res) => {
    const listUsersService = await listUsers(req.query);
    return res.status(listUsersService.status).json({ response: listUsersService });
};

// Controller for get all users unvalidated with role " Restaurant & Deliveryman"
export const listUsersUnvalidatedController = async (req, res) => {
    try {
        const listUsersUnvalidatedService = await listUsersUnvalidated(req.query);
        if (listUsersUnvalidatedService.success) return res.status(listUsersUnvalidatedService.status).json({ response: listUsersUnvalidatedService });
        else return res.status(listUsersUnvalidatedService.status).json({ response: listUsersUnvalidatedService });
    } catch (error) {
        return res.status(500).json({ error });
    };

};

// Controller for get one user
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const getUserService = await userById(id);
        if (getUserService.success) return res.status(getUserService.status).json({ response: getUserService });
        else return res.status(getUserService.status).json({ response: getUserService });
    } catch (error) {
        return res.status(500).json({ error });
    }


};

// Controller for update password
export const updatePasswordController = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const updatePasswordService = await changePassword(
        req.body.actualPassword,
        req.body.newPassword,
        req.body.confirmPassword,
        token);
    if (updatePasswordService) return res.status(200).json({ message: 'Password updated!', updatePasswordService });
    else return res.status(400).json({ message: 'Bad Request!', updatePasswordService });
};
