import { connectDB } from "./configuration/connectMondoDB.js";
import User from "./models/userModel.js";
import bcrypt from "bcrypt";
import adminData from "./admin.json" assert { type: "json" };
import { welcome, welcomeAdmin } from "./middlewares/nodemailer.js";

connectDB();

const query = User.findOne({ 'role' : 'admin' });
query.select('role')
query.exec( (err, res) => {
    if(err) res.status(500).json({ err });
    else {
        if(res) {
            console.log('admin is already exist!');
            return process.exit()
        } else {
            const admin = new User({...adminData});
            admin.save();
            welcomeAdmin(admin.email, admin.firstName, admin.lastName, adminData.password);                    
            console.log('admin is created');
        }
    }
});
