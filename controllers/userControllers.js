import { config } from "dotenv";
import { requestPasswordReset, resetPassword } from "../services/passwordService.js";
import { register, listUsers, userById, changePassword, validationAccountClientService, confirmAccount, listUsersUnvalidated, loginUserService, deleteUser } from "../services/userService.js";


config();

// Controller for Register new user
export const signUpController = async (req, res) => {
    const signupService = await register(req.body);
    return res.status(signupService.status).json({ response: signupService });
};

// Controller for validation account
export const validationAccountClientController = async (req, res) => {
    const validationService = await validationAccountClientService(req.body.token);
    return res.status(validationService.status).json({ response: validationService });
};

// Controller for confirm account Restaurant and Deliveryman
export const confirmAccountController = async (req, res) => {
    const { id } = req.params;
    const confirmAccountService = await confirmAccount(id);
    return res.status(confirmAccountService.status).json({ response: confirmAccountService });
};

// Controller for login user
export const loginController = async (req, res) => {
    const { email, password } = req.body;
    const loginService = await loginUserService(email, password);
    return res.status(loginService.status).json({ response: loginService });
};

// Controller for request password reset
export const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(req.body.email);
    return res.status(requestPasswordResetService.status).json({ response: requestPasswordResetService });
};

// Controller for password reset
export const resetPasswordController = async (req, res) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    return res.status(resetPasswordService.status).json({ response: resetPasswordService });
};

// Controller for get all users
export const listUsersController = async (req, res) => {
    const listUsersService = await listUsers(req.query);
    return res.status(listUsersService.status).json({ response: listUsersService });
};

// Controller for get all users unvalidated with role " Restaurant & Deliveryman"
export const listUsersUnvalidatedController = async (req, res) => {
    const listUsersUnvalidatedService = await listUsersUnvalidated(req.query);
    return res.status(listUsersUnvalidatedService.status).json({ response: listUsersUnvalidatedService });
};

// Controller for get one user
export const getUser = async (req, res) => {
    const { id } = req.params;
    const getUserService = await userById(id);
    return res.status(getUserService.status).json({ response: getUserService });
};

// Controller for update password
export const updatePasswordController = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const updatePasswordService = await changePassword(
        req.body.actualPassword,
        req.body.newPassword,
        req.body.confirmPassword,
        token);
    return res.status(updatePasswordService.status).json({ response: updatePasswordService });
};

// Controller for delete User
export const deleteUserController = async (req, res) => {
    const {id} = req.params;
    const deleteUserService = await deleteUser(id);
    return res.status(deleteUserService.status).json({ response: deleteUserService });
};