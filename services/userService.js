import { validationAccount, welcome, welcomeBack } from "../middlewares/nodemailer.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();


// Service for validation account
export const validationAccountClientService = async (token) => {
    const verifyToken = (data) => {
        try {
            const decodedVerified = jwt.verify(token, process.env.VALIDATION_TOKEN);

            return { success: true, dataToken: decodedVerified }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const resultVerify = verifyToken(token)
    if(!resultVerify.success) return  new Error ('invalid signatur')
        else return console.log('great');

    // console.log('decoded: ', decodedToken);
    // const userId = await decodedToken.userId;
    // console.log("user id: ", userId);
    // const verifyUser = await User.findOne({ _id: userId });
    // if (!verifyUser) throw new Error('User not found!');
    // if(verifyUser.statusAccount == true) throw new Error('Your account is validated')
    // else if (verifyUser.role === "Customer") {
    //     await User.updateOne(
    //         {
    //             _id: userId
    //         },
    //         {
    //             $set: {
    //                 statusAccount: true
    //             }
    //         }
    //     );
    // Compare code Validation with token.validationCode
    //} else err;
    //welcome(verifyUser.email, verifyUser.firstName, verifyUser.lastName);


};

// Service for confirm account for Restaurant od Deliveryman
export const confirmAccount = async (id) => {
    const user = await User.findOne({ id });
    if (!user) throw new Error('User not found!');
    else if (user.role != "Customer") {
        await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    "statusAccount": true
                }
            }
        );
        welcome(user.email, user.firstName, user.lastName);
    };
};

//Service for register a new user
export const register = async (data) => {
    const charactersCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let generateCode = '';
    for (let i = 0; i < 20; i++) {
        generateCode += charactersCode.charAt(Math.floor(Math.random() * charactersCode.length))
    };
    const codeValidationAccount = generateCode;
    let user = await User.findOne({ email: data.email });
    if (user) throw new Error("Email already exist");
    user = new User({ ...data, avatar: data.avatar || '', validationCode: codeValidationAccount });

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
            codeValidation: codeValidationAccount
        },
        process.env.VALIDATION_TOKEN,
        { expiresIn: '48h' },

    );
    if (data.role === "Customer") {
        // validationAccount(user.email, user.firstName, user.lastName, token, user._id)
        console.log("token for validation account: ", token);
    }
    await user.save();
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
        .exec();
    const countList = await User.countDocuments();
    if (usersList) return { page: data.page, limit: data.limit, totalUsers: countList, users: usersList };
    else throw new Error('Users not found!')
};

//Service for get all users unvalidated with role " Restaurant & Deliveryman"
export const listUsersUnvalidated = async (data) => {
    if (!data.page) data.page = 1;
    if (!data.limit) data.limit = 30;
    const skipPage = (data.page - 1) * data.limit;
    const usersList = await User.find({ role: ["Restaurant", "Deliveryman"], statusAccount: false })
        .skip(skipPage)
        .limit(data.limit)
        .select('-password')
        .exec();
    const countList = await User.countDocuments({ role: ["Restaurant", "Deliveryman"], statusAccount: false });
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
export const changePassword = async (actualPassword, newPassword, confirmPassword, token) => {
    try {
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        const idUserVerified = verifyToken.userId;
        const user = await User.findOne({ _id: idUserVerified });
        if (!user) throw new Error('User not found!');
        else {
            const userPassword = user.password;
            bcrypt.compare(actualPassword, userPassword)
                .then(async (isValid) => {
                    if (!isValid) throw new Error('Current password is not correct!');
                    else {
                        const comparePassword = newPassword.localeCompare(confirmPassword);
                        if (comparePassword != 0) throw new Error('Password is not confirm');
                        else {
                            const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT));
                            await User.updateOne(
                                { _id: idUserVerified },
                                {
                                    $set: {
                                        password: hashedPassword
                                    }
                                }
                            );
                            //welcomeBack(user.email, user.firstName, user.lastName);
                        };
                    };
                }).catch(err => {
                    new Error(err)
                });
        };
    } catch (error) {
        new Error(error);
    }
};