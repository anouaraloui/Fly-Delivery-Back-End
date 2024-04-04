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
        <h2>Hello ${firstName} ${lastName}<h2>
        <p>Please, click the link below to reset your password<p>
        <a href=http://localhost:3000/auth/requestResetPassword?token=${token}&id=${userId}/>Reset Password </a>
        </div>
        `
    })
        .catch(err => console.log(err))
};


const emailResetPassword = (email, firstName, lastName) => {
    transport.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Change your FlyDelivery account password",
        html: `<div>
        <h2> Hi ${firstName} ${lastName}</h2>
        <h2>Your password has been changed successfully. </h2>
        <h2>Welcome back to your application.<h2>     
        <p>With best regards<p>
        <p>Your Fly-Delivery-Team</p>
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


export { emailForgotPassword, emailResetPassword};