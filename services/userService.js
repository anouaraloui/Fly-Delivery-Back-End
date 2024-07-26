import { validationAccount, welcome, welcomeBack } from "../middlewares/nodemailer.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();


// Service for validation account
export const validationAccountClientService = async (token) => {
    try {
        const decodedVerified = jwt.verify(token, process.env.VALIDATION_TOKEN);
        const userId = decodedVerified.userId;
        const verifyUser = await User.findById({ _id: userId });
        if (!verifyUser) return { status: 404, success: false, message: 'User not found!' };
        if (verifyUser.statusAccount == true) return { status: 409, success: false, message: 'Your account is already validated!' };
        if (decodedVerified.codeValidation != verifyUser.validationCode) return { status: 404, success: false, message: 'Validation code is wrong!' };
        if (verifyUser.role === 'Customer')
            await User.findOneAndUpdate(
                {
                    _id: userId
                },
                {
                    $set: {
                        statusAccount: true
                    }
                }
            );
        welcome(verifyUser.email, verifyUser.name);
        return { status: 200, success: true, message: 'Your account is verify now', dataToken: decodedVerified };

    } catch (error) {
        return { status: 500, success: false, message: 'Bad request!', error: error.message };
    };
};

// Service for confirm account for Restaurant od Deliveryman
export const confirmAccount = async (id) => {
    return await User.findById({ _id: id })
        .then(async user => {
            if (!user) return { status: 404, success: false, message: 'User not found!' };
            if (user.statusAccount) return { status: 409, success: false, message: 'Bad request! Your account is already verified!' };
            else if (user.role != "Customer") {
                await User.findByIdAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            "statusAccount": true
                        }
                    }
                );
                welcome(user.email, user.name);
                return { status: 200, success: true, message: "Successful Operation Account Confirmed" };
            };
        }).catch((err) => {
            return { status: 500, success: false, message: err.message };
        });
};

//Service for register a new user
export const register = async (data) => {
    const charactersCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let generateCode = '';
    for (let i = 0; i < 20; i++) {
        generateCode += charactersCode.charAt(Math.floor(Math.random() * charactersCode.length));
    };
    const codeValidationAccount = generateCode;
    return await User.findOne({ $or: [{ email: data.email }, { phone: data.phone }] })
        .then(async user => {
            if (user) {
                if (user.email === data.email && user.phone === data.phone) return { status: 400, success: false, message: 'Bad request! Email and Phone already exists!' };
                if (user.email === data.email) return { status: 400, success: false, message: 'Bad request! Email already exists!' };
                if (user.phone === data.phone) return { status: 400, success: false, message: 'Bad request! Phone already exists!' };
            } else {
                user = new User({ ...data, avatar: data.avatar || '', validationCode: codeValidationAccount });
                const token = jwt.sign(
                    {
                        userId: user._id,
                        role: user.role,
                        codeValidation: codeValidationAccount,
                        name: user.name
                    },
                    process.env.VALIDATION_TOKEN,
                    { expiresIn: '48h' },

                );
                if (data.role === "Customer") {
                    validationAccount(user.email, user.name, token, user._id);
                    console.log("token for validation account: ", token);
                };
                await user.save();
                return { status: 201, success: true, message: "User created", user: data };
            }
        })
        .catch(error => {
            return { status: 500, success: false, message: error.message };
        });
};

// Service for login user
export const loginUserService = async (email, password) => {
    return await User.findOne({ email })
        .then(async user => {
            if (!user) return { status: 401, success: false, message: 'Invalid email. Please try again with the correct credentials.!' };
            if (!user.statusAccount) return { status: 401, success: false, message: 'Your account is not verified!' };
            else return bcrypt.compare(password, user.password)
                .then(validatePassword => {
                    if (!validatePassword) return { status: 401, success: false, message: 'Incorrect password!' };
                    else return {
                        status: 200,
                        success: true,
                        message: "You have successfully logged in.",
                        userId: user._id,
                        token: jwt.sign({ userId: user._id, role: user.role, name: user.name }, process.env.ACCESS_TOKEN, { expiresIn: '1d' }),
                        refreshToken: jwt.sign({ userId: user._id, role: user.role, name: user.name }, process.env.REFRESH_TOKEN, { expiresIn: '2d' })
                    };
                })
                .catch(error => {
                    return { status: 400, success: false, message: error };
                });
        })
        .catch(error => {
            return { status: 500, success: false, message: error.message };
        });
};


// Service for get all users
export const listUsers = async (data) => {
    try {
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const usersList = await User.find()
            .sort({ [data.sortBy]: 1 })
            .skip(skipPage)
            .limit(data.limit)
            .where('createdAt').lt(data.createdAtBefore).gt(data.createdAtAfter)
            .select('-password')
            .exec();
        const countList = await User.countDocuments();
        if (countList == 0) return { status: 204, success: true, message: 'There are no article!' };
        if (usersList) return { status: 200, success: true, message: 'Successfully operation', page: data.page, limit: data.limit, totalUsers: countList, users: usersList };
        else return { status: 404, success: false, error: 'Users not found!' };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

//Service for get all users unvalidated with role " Restaurant & Deliveryman"
export const listUsersUnvalidated = async (data) => {
    try {
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const usersList = await User.find({ role: ["Restaurant", "Deliveryman"], statusAccount: false })
            .skip(skipPage)
            .limit(data.limit)
            .select('-password')
            .exec();
        const countList = await User.countDocuments({ role: ["Restaurant", "Deliveryman"], statusAccount: false });
        if (countList == 0) return { status: 204, success: true, message: 'There are no unvalidated users!' };
        if (usersList) return { status: 200, success: true, page: data.page, limit: data.limit, totalUsers: countList, users: usersList };
        else return { status: 404, success: false, message: 'Users not found!' };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for get one user
export const userById = async (data) => {
    return await User.findById({ _id: data }).select('-password')
        .then(user => {
            if (!user) return { status: 404, success: false, error: 'User not found!' };
            else return { status: 200, success: true, user: user };
        })
        .catch(error => {
            return { status: 500, success: false, message: error.message };
        });
};

// Service for update password
export const changePassword = async (actualPassword, newPassword, confirmPassword, token) => {
    try {
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        const idUserVerified = verifyToken.userId;
        return await User.findById({ _id: idUserVerified })
            .then(async user => {
                if (!user) return { status: 404, success: false, error: 'User not found!' };
                else {
                    const userPassword = user.password;
                    return await bcrypt.compare(actualPassword, userPassword)
                        .then(async (isValid) => {
                            if (!isValid) return { status: 400, success: false, error: 'Current password is not correct!' };
                            else {
                                const comparePassword = newPassword.localeCompare(confirmPassword);
                                if (comparePassword != 0) return { status: 406, success: false, error: 'Password is not confirm!' };
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
                                    welcomeBack(user.email, user.name);
                                    return { status: 200, success: true, message: 'Password has been changed' };
                                };
                            };
                        }).catch(err => {
                            return { status: 400, success: false, message: 'Bad request!' };
                        });
                };
            })
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for delete user(Customer/Restaurant/Delieveryman)
export const deleteUser = async(id) => {
    try {
     const user = await User.findByIdAndDelete({ _id: id });
     return { status: 200, success: true, message: `${user.name} is successfully deleted` };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };       
};