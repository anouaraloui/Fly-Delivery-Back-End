import { connectDB } from "./configuration/connectMondoDB.js";
import User from "./models/userModel.js";
import bcrypt from "bcrypt";
import adminData from "./admin.json" assert { type: "json" };

connectDB();

const charactersPass = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?!&$';
let generatePassword = '';
for (let i=0; i < 10; i++) {
    generatePassword += charactersPass.charAt(Math.floor(Math.random() * charactersPass.length));
};
const pasword = generatePassword;

const query = User.findOne({ 'role' : 'admin' });
query.select('role')
query.exec( (err, res) => {
    if(err) res.status(500).json({ err });
    else {
        if(res) {
            console.log('admin is already exist!');
            return process.exit()
        } else {
            bcrypt.hash(pasword, 10)
            .then((hashedPassword) => {
                const admin = new User({...adminData, password: hashedPassword});
                admin.save();
                console.log('admin is created');
            })
            .catch((err)=> console.log(err))
        }
    }
});
