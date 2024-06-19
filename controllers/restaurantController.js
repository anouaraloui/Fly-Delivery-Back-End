import { allOrdersRestaurant, orderDecision } from "../services/restaurantService.js";
import findUserId from "../utils/findUserId.js";

// Controller for display all orders received at the same restaurant 
export const allOrdersRestaurantController = async (req, res) => {
    const userId = (await findUserId(req)).userId;
    const allOrdersRestaurantService = await allOrdersRestaurant(userId);
    return res.status(allOrdersRestaurantService.status).json({ response: allOrdersRestaurantService });
};

// Controller to make the order decision
export const orderDecisionController = async (req, res, next) => {
    const { id } = req.params;
    const userId = (await findUserId(req)).userId;
    const status = req.body.status;
    const orderDecisionService = await orderDecision(id, userId, status, next);
    res.status(orderDecisionService.status).json({ response: orderDecisionService });
    return next();    
};