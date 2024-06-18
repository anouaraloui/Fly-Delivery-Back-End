import { allOrdersRestaurant } from "../services/restaurantService.js";
import findUserId from "../utils/findUserId.js";

// Controller for display all orders received at the same restaurant 
export const allOrdersRestaurantController = async (req, res) => {
    const userId = (await findUserId(req)).userId;
    const allOrdersRestaurantService = await allOrdersRestaurant(userId);
    return res.status(allOrdersRestaurantService.status).json({ response: allOrdersRestaurantService });
};