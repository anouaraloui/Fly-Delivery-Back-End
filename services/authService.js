import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { emailForgotPassword, emailResetPassword } from "../middlewares/nodemailer.js";
import crypto from "crypto";


config();

export const register = async (data) => {
    let user = await User.findOne({ email: data.email });
  if (user) {
    throw new Error("Email already exist");
  }
  user = new User(data);
  //const token = jwt.sign({ id: user._id }, process.env.REGISTER_TOKEN);
  await user.save();
  return (data);

}

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
    emailForgotPassword(user.email, user.firstName, user.lastName, resetToken, user._id)
    // const link = `${process.env.CLIENT_URL}/auth/requestResetPassword?token=${resetToken}&id=${user._id}`;
    // sendEmail(
    //     user.email,
    //     "Password Reset Request",
    //     {
    //         firstName: user.firstName ,
    //         link: link,
    //     },
    //     "../middlewares/template/requestResetPassword.handlebars");

    // return { link };
}


export const resetPassword = async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ userId });
    if(!passwordResetToken) throw new Error('Invalid Id or expired password reset token');
   
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    console.log('is Valid:', isValid);
    console.log("token password reset: ", passwordResetToken.token);
   console.log('token req body :', token);
    if(!isValid) {
        throw new Error('Invalid or expired password reset token');}
        
    const hash = await bcrypt.hash(password, Number(10));
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
    const user = await User.findById({ _id: userId });
   emailResetPassword(user.email, user.firstName, user.lastName)
    // sendEmail(
    //     user.email,
    //     "Password Reset Succussfuly",
    //     {
    //         name: user.firstName
    //     },
    //     "../middlewares/template/resetPassword.handlebars"
    // );
    await passwordResetToken.deleteOne();
    return true;
}