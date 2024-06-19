import { allOrdersRestaurant, changeOrderDecision, orderDecision } from "../services/restaurantService.js";
import findUserId from "../utils/findUserId.js";

// Controller for display all orders received at the same restaurant 
export const allOrdersRestaurantController = async (req, res) => {
    const userId = (await findUserId(req)).userId;
    const allOrdersRestaurantService = await allOrdersRestaurant(userId);
    return res.status(allOrdersRestaurantService.status).json({ response: allOrdersRestaurantService });
};

// Controller to make the order decision
export const orderDecisionController = async (req, res) => {
    const { id } = req.params;
    const userId = (await findUserId(req)).userId;
    const status = req.body.status;
    const orderDecisionService = await orderDecision(id, userId, status);
    return res.status(orderDecisionService.status).json({ response: orderDecisionService });
};

// Controller to update the order decision
export const changeOrderDecisionController = async (req, res) => {
    const { id } = req.params;
    const userId = (await findUserId(req)).userId;
    const status = req.body.status;
    const changeOrderDecisionService = await changeOrderDecision(id, userId, status);
    return res.status(changeOrderDecisionService.status).json({ response: changeOrderDecisionService });
};

