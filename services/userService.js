import { validationAccount, welcome, welcomeBack } from "../middlewares/nodemailer.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();


// Service for validation account
export const validationAccountClientService = async (data) => {
    const decodedToken = jwt.decode(data);
    const userId = decodedToken.userId;
    const verifyUser = await User.findOne({ _id: userId });
    if(!verifyUser)  throw new Error('User not found!');
     else if(verifyUser.role === "customer"){
        await User.updateOne(
            {
                _id: userId
            },
            {
                $set: {
                    statusAccount: true
                }
            }
        );
    } else throw new Error('Admin must confirm your account.')
    welcome(verifyUser.email, verifyUser.firstName, verifyUser.lastName);

};

// Service for confirm account for Restaurant od Deliveryman
export const confirmAccount = async (id) => {
    console.log('fdsfs');
    console.log('id: ', id);
    const user = await User.findOne({ _id: id });
    console.log('user : ', user);
    if(!user) throw new Error('User not found!');
    else if(user.role != "customer"){
        await User.findByIdAndUpdate(
        {_id: id},
        {$set: {
            "statusAccount": true
        }}
    );
    };
    welcome(user.email, user.firstName, user.lastName); 
}

//Service for register a new user
export const register = async (data) => {
    let user = await User.findOne({ email: data.email });
    if (user) throw new Error("Email already exist");
    user = new User({ ...data, avatar: data.avatar || '' });
    await user.save();
    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.VALIDATION_TOKEN,
        {expiresIn: '48h'}
    )
    if(data.role === "customer") {
        validationAccount(user.email, user.firstName, user.lastName, token, user._id)}
    return (data);
};

//Service for get all users
export const listUsers = async (data) => {
    if (!data.page) data.page = 1;
    if (!data.limit) data.limit = 30;
    const skipPage = (data.page - 1) * data.limit;
    const usersList = await User.find()
        .sort({ [data.sortBy]: 1 })
        .skip(skipPage)
        .limit(data.limit)
        .where('cratedAt').lt(data.createdAtBefore).gt(data.createdAtAfter)
        .select('-password')
    const countList = await User.countDocuments();
    if (usersList) return { page: data.page, limit: data.limit, totalUsers: countList, users: usersList };
    else throw new Error('Users not found!')
};

// Service for get one user
export const userById = (data) => {
    const user = User.find({ _id: data }).select('-password')
    if (!user) throw new Error('Bad request!')
    else return user;
};

// Service for update password
export const changePassword = async (password, newPassword,confirmPassword, token) => {
    const decoded = jwt.decode(token);
    const idUser = decoded.userId;
    const user = await User.findOne({ _id: idUser });
    if (!user) throw new Error('User not found!');
    else {
        const acctualPassword = user.password;
        bcrypt.compare(password, acctualPassword)
            .then(async (isValid) => {
                if (!isValid) throw new Error('Password is not correct!');
                else {
                    bcrypt.compare(newPassword, confirmPassword)
                        .then(async (passConfirm) => {
                            if (!passConfirm) throw new Error('Password is not confirm')
                            else {
                                const password = bcrypt.hash(password, process.env.BCRYPT_SALT);
                                await User.updateOne(
                                    { _id: idUser },
                                    {
                                        $set: {
                                            password: password
                                        }
                                    }
                                );
                            }
                        })
                    welcomeBack(user.email, user.firstName, user.lastName);

                }
            }).catch(err => {
                throw new Error(err)
            })

    }
    //const acctualPassword = data.password;
    //bcrypt.compare(acctualPassword, User)
    //    const user = await User.find();
    //    console.log('user: ', user);
    //    return user;

}