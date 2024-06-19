import { getAllOrdersAvailable } from "../services/deliverymanService.js";


// Controller for display all orders available
export const getAllOrdersAvailableControlelr = async (req, res) => {
    const getAllOrdersAvailableService = await getAllOrdersAvailable(req.query);
    return res.status(getAllOrdersAvailableService.status).json({ response: getAllOrdersAvailableService });
};