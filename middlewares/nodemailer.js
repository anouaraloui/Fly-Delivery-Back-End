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

// const sendEmail = async (email, subject, payload, template) => {

//     try {
//         const transporter = nodemailer.createTransport({
//             service: process.env.EMAIL_SERVICE,
//             auth: {
//                 user: process.env.EMAIL_USERNAME,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });
//         const source = fs.readFileSync(path.join(__dirname, template), "utf8");
//         const compiledTemplate = handlebars.compile(source);

//         console.log('source: ', source);
//         console.log('source block');

//         const options = () => {
//             return {
//                 from: process.emitnv.EMAIL_FROM,
//                 to: email,
//                 subject: subject,
//                 html: compiledTemplate(payload)
//             };
//         };

//         transporter.sendMail(options(), (error, res) => {
//             if (error) return error;
//             else return res.status(200).json({ success: true });
//         });
//     } catch (error) {
//         return error;
//     }
// }


export { emailForgotPassword, emailResetPassword };