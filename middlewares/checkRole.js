import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const role = (roles, req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    (roles.includes(verifyToken.role)) ? next() : res.status(403).json({ error: 'Access denied' });
}