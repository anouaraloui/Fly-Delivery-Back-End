import { addNewOrder, getAllOrder } from "../services/orderService.js";
import findUserId from "../utils/findUserId.js";

// Controller for create new order
export const addNewOrderController = async(req, res) => {
    const userId = await findUserId(req);
    const addNewOrderService = await addNewOrder(req.params.id, userId, req.body);
    return res.status(addNewOrderService.status).json({ response: addNewOrderService });
};

// Controller for display all orders created by the same user
export const getAllOrderController = async (req, res) => {
    const userId = await findUserId(req);
    const getAllOrderService = await getAllOrder(userId, req.query);
    return res.status(getAllOrderService.status).json({ response: getAllOrderService });
};