import nodemailer from "nodemailer";
import { config } from "dotenv";


config()

const transport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})

const emailForgotPassword = (email, firstName, lastName, token, userId) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset Password",
        html: `<div>
        <h1>Reset Password!</h1>
        <h2>Hello ${firstName} ${lastName},<h2>
        <p>Somebody requested a new password for the account associated with your email.</p>
        <p>No changes have been made to your account yet.</p>
        <p>You can reset your password by clicking the link below:<p>
        <a href=http://localhost:3000/auth/requestResetPassword?${token}&${userId}/>Click hier to reset your password </a>
        <p>If you did not request a new password, please let us know immediately by replying to this email.</p>
        <p>Yours,</p>
        <p>The Fly-Delivery team</p>
        </div>
        `
    })
        .catch(err => console.log(err))
};


const emailResetPassword = (email, firstName, lastName) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password change confirmation",
        html: `<div>
        <h2> Dear ${firstName} ${lastName}</h2>
        <h2>Your password has been changed successfully. </h2>
        <p>This is to confirm that the password for your account has been successfully changed. Your account is now secured with the new password that you have set.</p>
        <p>If you did not change your password, please contact us immediately to report any unauthorized access to your account.</p>
        <p>Thank you for using our service.<p>     
        <p>With best regards<p>
        <p>Your Fly-Delivery Team</p>
        `
    })
};


const welcome = (email, firstName, lastName) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Welcome to your application",
        html: `<div>
        <h2>Welcome to Fly Delivery! </h2>
        <h2> Dear ${firstName} ${lastName}</h2>        
        <p>We wanted to take a moment to welcome you to Fly Delivery. We are excited to have you as a client and appreciate your trust in us.</p>
        <p>As a new client, you can expect to receive top-notch customer service, high-quality products and services, and timely communication from us. We are committed to meeting and exceeding your expectations.</p>
        <p>Thank you again for choosing Fly Delivery. We look forward to working with you!<p>     
        <p>Best,<p>
        <p>Your Fly-Delivery Team</p>
        `
    })
}


export { emailForgotPassword, emailResetPassword, welcome };