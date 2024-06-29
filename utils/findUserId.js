import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const findUserId = async (req) => {
    try {
    const restaurantToken = await req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(restaurantToken, process.env.ACCESS_TOKEN);
      return {userId: decoded.userId, name: decoded.name, role: decoded.role};
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Unauthorized');
    }
  };
  

export default findUserId;