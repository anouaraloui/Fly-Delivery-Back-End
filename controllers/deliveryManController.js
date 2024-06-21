import { decisionOrder, getAllOrdersAvailable } from "../services/deliverymanService.js";
import findUserId from "../utils/findUserId.js";


// Controller for display all orders available
export const getAllOrdersAvailableControlelr = async (req, res) => {
    const getAllOrdersAvailableService = await getAllOrdersAvailable(req.query);
    return res.status(getAllOrdersAvailableService.status).json({ response: getAllOrdersAvailableService });
};

// Controller for accept or reject an order
export const decisionOrderController = async (req, res) => {
    const { id } = req.params;
    const userId = ((await findUserId(req)).userId);
    const decision = req.body.decision;
    const decisionOrderService = await decisionOrder(id, userId, decision);
    return res.status(decisionOrderService.status).json({ response: decisionOrderService });
};