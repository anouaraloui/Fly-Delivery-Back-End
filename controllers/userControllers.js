import { config } from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {  requestPasswordReset, resetPassword } from "../services/passwordService.js";
import { register, listUsers, userById, changePassword, validationAccountService } from "../services/userService.js";

config();

// Controller for validation account
export const validationAccountController = async (req, res) => {
    const validationService = await validationAccountService(req.body.token)
    return res.status(200).json({message: 'your account is verify now', validationService})
}

// Controller for Register new user
export const signUpController = async (req, res, next) => {
    const signupService = await register(req.body);
    return res.status(201).json({message: "User created",user: signupService});
};

// Controller for login user
export const loginController = async (req, res) => {
    const { email } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ error: "User not found!" });
            else if(!user.statusAccount) return res.status(400).json({ error: "Your account is not verified" });
            else bcrypt.compare(req.body.password, user.password)
                .then(validatePassword => {
                    if (!validatePassword) return res.status(401).json({ error: "Incorrect password!" });
                    else res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id, role: user.role }, process.env.ACCESS_TOKEN, { expiresIn: '1d' }
                        ),
                        refreshToken: jwt.sign(
                            { userId: user._id, role: user.role }, process.env.REFRESH_TOKEN, { expiresIn: '2d' }
                        )
                    });
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Controller for request password reset
export const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(req.body.email);
    return res.status(200).json({message: "Check your email!", requestPasswordResetService});
};

// Controller for password reset
export const resetPasswordController = async (req, res, next) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    next();
    return res.status(200).json({ message: "Your password has been changed successfully.", resetPasswordService});
};

// Controller for get all users
export const listUsersController = async (req, res) => {
    const listUsersService = await listUsers(req.query);
    return res.status(200).json(listUsersService);
};

// Controller for get one user
export const getUser = async (req, res) => {
    const getUserService = await userById(req.params.id);
    return res.status(200).json(getUserService);
}

// Controller for update password
export const updatePasswordController = async (req, res) => {
    const updatePasswordService = await changePassword(
        req.body.password,
        req.body.newPassword,
        req.body.confirmPassword,
        req.body.token);
        return res.status(200).json({ message: 'Password updated!', updatePasswordService });

}
