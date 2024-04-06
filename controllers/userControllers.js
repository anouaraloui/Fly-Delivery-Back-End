import { config } from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../models/tokenModel.js";
import { emailForgotPassword, emailResetPassword} from "../middlewares/nodemailer.js";
import { register, requestPasswordReset, resetPassword } from "../services/authService.js";

config();

export const signUpController = async (req, res, next) => {
    const signupService = await register(req.body);
    return res.status(201).json({message: "User created",user: signupService});
};

export const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(req.body.email);
    return res.status(200).json({message: "Check your email!", requestPasswordResetService});
};

export const resetPasswordController = async (req, res, next) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    return res.status(200).json({ message: "Your password has been changed successfully.", resetPasswordService});
};

export const login = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) return res.status(400).json({ error: "User not found!" });
        else bcrypt.compare(req.body.password, user.password)
            .then(somePassword => {
                if(!somePassword) return res.status(401).json({ error: "Incorrect password!" });
                else res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        {userId: user._id}, process.env.ACCESS_TOKEN, {expiresIn: '1d'} 
                    ),
                    refreshToken: jwt.sign(
                        {userId: user._id}, process.env.REFRESH_TOKEN, {expiresIn: '2d'}
                    )
                });
            })
            .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
};


