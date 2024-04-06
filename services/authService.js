import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { emailForgotPassword, emailResetPassword } from "../middlewares/nodemailer.js";
import crypto from "crypto";


config();

// Service for request to reset the password
export const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });    
    if(!user) throw new Error("User does not exist!");
    let token = await Token.findOne({ userId: user._id});
    if(token) await token.deleteOne();
    let resetToken =  crypto.randomBytes(32).toString("hex");
    const hash =  await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));
    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
    }).save();
    emailForgotPassword(user.email, user.firstName, user.lastName, resetToken, user._id);
};

// Service for reset password
export const resetPassword = async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ userId });
    if(!passwordResetToken) throw new Error('Invalid or expired token');
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if(!isValid) throw new Error('Invalid or expired token');
    const user = await User.findById({ _id: userId });
    const oldPassword = await bcrypt.compare(password, user.password)
    if(oldPassword) throw new Error('You have entered an actual password. Please enter a new password or log in again using the same password.');
    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await User.updateOne(
        {_id: userId},
        {
            $set: {
                password: hash
            }
        },
        {
            new: true
        }
    );
    emailResetPassword(user.email, user.firstName, user.lastName)
    await passwordResetToken.deleteOne();    
};

//Service for register a new user
export const register = async (data) => {
    let user = await User.findOne({ email: data.email });
  if (user) throw new Error("Email already exist");
  user = new User(data);
  await user.save();
  return (data);
};