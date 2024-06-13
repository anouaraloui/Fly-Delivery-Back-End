import nodemailer from "nodemailer";
import { config } from "dotenv";

config()

// Configuration nodemailer
const transport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

//  Email for admin when created the first time
const welcomeAdmin = (email, name, password) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Welcome Admin to your application",
        html: `<div>
        <h2>Welcome to Fly Delivery! </h2>
        <h2> Dear ${name}</h2> 
        <p>To can enter in our company, please enter this email and this password :<p>       
        <p>email: ${email}</p>
        <p>password: ${password}</p>
        <p>Best regards.<p>
        <p>Your Fly-Delivery Team</p>
        `
    });
};

// Email for user when to forget password
const emailForgotPassword = (email, name, token, userId) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset Password",
        html: `<div>
        <h1>Reset Password!</h1>
        <h2>Hello ${name},<h2>
        <p>Somebody requested a new password for the account associated with your email.</p>
        <p>No changes have been made to your account yet.</p>
        <p>You can reset your password by clicking the link below:<p>
        <a href=http://localhost:3000/auth/requestResetPassword?token=${token}&id=${userId}/>Click hier to reset your password </a>
        <p>If you did not request a new password, please let us know immediately by replying to this email.</p>
        <p>Yours,</p>
        <p>The Fly-Delivery team</p>
        </div>
        `
    })
    .catch(err => console.log(err))
};

// Email for user to reset password
const emailResetPassword = (email, name) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password change confirmation",
        html: `<div>
        <h2> Dear ${name}</h2>
        <h2>Your password has been changed successfully. </h2>
        <p>This is to confirm that the password for your account has been successfully changed. Your account is now secured with the new password that you have set.</p>
        <p>If you did not change your password, please contact us immediately to report any unauthorized access to your account.</p>
        <p>Thank you for using our service.<p>     
        <p>With best regards<p>
        <p>Your Fly-Delivery Team</p>
        `
    });
};

// Email to the user when registering for this application
const welcome = (email, name) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Welcome our application",
        html: `<div>
        <h2>Welcome to Fly Delivery! </h2>
        <h2> Dear ${name}</h2>        
        <p>We wanted to take a moment to welcome you to Fly Delivery. We are excited to have you as a client and appreciate your trust in us.</p>
        <p>As a new client, you can expect to receive top-notch customer service, high-quality products and services, and timely communication from us. We are committed to meeting and exceeding your expectations.</p>
        <p>Thank you again for choosing Fly Delivery. We look forward to working with you!<p>     
        <p>Best regards.<p>
        <p>Your Fly-Delivery Team</p>
        `
    });
};

// Email to user when changing password
const welcomeBack = (email, name) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome back to our team',
        html: `<div>
        <h2>Welcome back to Fly Delivery! </h2>
        <h2> Dear ${name}</h2>   
        <p>This is to confirm that the password for your account has been successfully changed. Your account is now secured with the new password that you have set.</p>
        <p>If you did not change your password, please contact us immediately to report any unauthorized access to your account.</p>
        <p>Thank you again for choosing Fly Delivery. We look forward to working with you!<p>     
        <p>Best regards.<p>
        <p>Your Fly-Delivery Team</p>
        `
    });
};

// Email to the user to validate the account
const validationAccount = (email, name, token, userId) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Validation your account',
        html: `<div>
        <h2>Hello ${name}</h2>
        <p>Are you ready to gain access to all of the assets we prepared for clients of Fly Delivery?</p>
        <p>First, you must complete your registration by clicking on the button below: </p>
        <a href=http://localhost:3000/auth/validationAccount?${token}&${userId}/>Verify Now</a>
        <p>This link will verify your account, and then you'll officially be a part of the Fly-Delivery community</p>
        <p>See you there!<p>
        <p>Best regards, the Fly-Delivery Team</p>
        `
    });
};

export { welcomeAdmin, emailForgotPassword, emailResetPassword, welcome, welcomeBack, validationAccount };