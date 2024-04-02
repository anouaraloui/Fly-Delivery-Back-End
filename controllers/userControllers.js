import { config } from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { emailForgotPassword, emailResetPassword } from "../middlewares/nodemailer.js";

config();

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

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user) return res.status(404).json({ error: "User not exist!" });
        else {
            const secretToken = process.env.RESET_PASSWORD_TOKEN + user.password;
            const token = jwt.sign({ email: user.email, userId: user._id }, secretToken, {expiresIn: '1d'});
            // tempUser.save(token)
            emailForgotPassword(user.email, user._id, token)
            res.status(200).json({ message: "Please check your email for reset your password!"}) 
        }
    } catch (error) {
        res.status(500).json({ error })
    }
};

export const resetpassword = async(req, res) => {
    const { password, token } = req.body;
    try {
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    password: encryptedPassword
                }
            }
        )
        emailResetPassword(user.email, password);
        res.status(200).json({ message: "Password updated" });
    } catch (error) {
        res.status(500).json({ message: "Somthing went wrong!" });
    }
}

export const registerUser = (req, res) => {
    const {firstName, lastName, email, password, role, phone, adress, avatar} = req.body;
    bcrypt.hash(password, 10)
    .then(hashPass => {
        let user = new User({
            firstName,
            lastName,
            email,
            password: hashPass,
            role,
            phone,
            adress,
            avatar: avatar || '',
        });
        user.save()
        .then(()=> {
            res.status(201).json({ message: 'User created', user});
        })
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
};