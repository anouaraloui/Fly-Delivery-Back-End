import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const isAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const userId = decoded.userId;
        if(req.body.userId && req.body.userId !== userId) throw new Error('Invalid user ID');
        else next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized! "Invalid token"'}); 
    }
};

export default isAuth;