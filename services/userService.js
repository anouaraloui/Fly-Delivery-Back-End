import User from "../models/userModel.js"
import { welcome } from "../middlewares/nodemailer.js";

//Service for register a new user
export const register = async (data) => {
    let user = await User.findOne({ email: data.email });
    if (user) throw new Error("Email already exist");
    user = new User({ ...data, avatar: data.avatar || '' });
    await user.save();
    welcome(user.email, user.firstName, user.lastName)
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