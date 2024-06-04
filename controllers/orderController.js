import { addNewOrder } from "../services/orderService.js";
import findUserId from "../utils/findUserId.js";

// Controller for create new order
export const addNewOrderController = async(req, res) => {
    const userId = await findUserId(req);
    const addNewOrderService = await addNewOrder(req.params.id, userId, req.body);
    return res.status(addNewOrderService.status).json({ response: addNewOrderService });
}