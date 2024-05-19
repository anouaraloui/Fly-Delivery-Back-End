import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const verifiedTokenValidationAccount= (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new Error('Authentication failed!');
      }
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = verified;  
      next();
    } catch (err) {
      res.status(400).send('Invalid token !');
    }
  };