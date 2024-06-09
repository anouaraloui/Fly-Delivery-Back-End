import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { emailForgotPassword, emailResetPassword } from "../middlewares/nodemailer.js";
import crypto from "crypto";

config();

// Service for request to reset the password
export const requestPasswordReset = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: 404, success: false, message: 'User does not exist!' };
        let token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne();
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));
        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now()
        }).save();
        emailForgotPassword(user.email, user.firstName, user.lastName, resetToken, user._id);
        return { status: 200, success: true, message: 'Please check your email for reset your password!' };
    } catch (error) {
        return { status: 444, success: false, message: err.message };
    };
};

// Service for reset password
export const resetPassword = async (userId, token, password) => {
    try {
        let passwordResetToken = await Token.findOne({ userId });
        if (!passwordResetToken) return { status: 404, success: false, message: 'Request user not exist!' };
        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) return { status: 401, success: false, message: 'Invalid token!' };
        const user = await User.findById({ _id: userId });
        const oldPassword = await bcrypt.compare(password, user.password);
        if (oldPassword) return { status: 400, success: false, message: 'You have entered an actual password. Please enter a new password or log in again using the same password.' };
        const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    password: hash
                }
            },
            {
                new: true
            }
        );
        emailResetPassword(user.email, user.firstName, user.lastName);
        await passwordResetToken.deleteOne();
        return { status: 200, success: true, message: 'Your password has been changed successfully' };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};
