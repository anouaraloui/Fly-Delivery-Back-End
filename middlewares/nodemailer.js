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

const emailForgotPassword = (email, userId, token) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset Password",
        html: `<div>
        <h1>Reset Password!</h1>
        <h2>Hello<h2>
        <p>To reset your password, please click on the link<p>
        <a href=http://localhost:3000/auth/resetpassword/${userId}/${token}>Click here! </a>
        </div>
        ` 
    })
    .catch(err => console.log(err))
};


const emailResetPassword = (email) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Change your FlyDelivery account password",
        html: `<div>
        <h1>Your password has been changed. </h1>
        <h2>Welcome back to your application.<h2>     
        <p>With best regards<p>
        <p>Your Fly-Delivery-Team</p>
        `
    })
}
export { emailForgotPassword, emailResetPassword };

{/* <p>Your password is updated :<p> <p> email: ${email}<p> <p> password: ${password}<p> */}