import { addNewOrder, changeOrderDecision,  orderDecisionDeliveryman, orderDecisionRestaurant, deleteAllOrders, deleteOrder, getAllOrders,  updateOrder, getAllOrdersAccepted, isPaid } from "../services/orderService.js";
import findUserId from "../utils/findUserId.js";

// Controller for create new order
export const addNewOrderController = async(req, res) => {
    const userId = (await findUserId(req)).userId;
    const addNewOrderService = await addNewOrder(req.params.id, userId, req.body);
    return res.status(addNewOrderService.status).json({ response: addNewOrderService });
};

// Controller for display all orders and orders created by the same user OR received at the same restaurant OR available to the deliveryman
export const getAllOrdersController = async (req, res) => {
    const userId = (await findUserId(req)).userId;
    const role = (await findUserId(req)).role;
    const getAllOrdersService = await getAllOrders(userId, role, req.query);
    return res.status(getAllOrdersService.status).json({ response: getAllOrdersService, message: "no content" });
};

// Controller for update an order
export const updateOrderController = async (req, res) => {
    const userId = (await findUserId(req)).userId;
    const {id} = req.params;
    const data = req.body;
    const updateOrderService = await updateOrder(userId, id, data);
    return res.status(updateOrderService.status).json({ response: updateOrderService });
};

// Controller for delete order
export const deleteOrderController = async(req, res) => {
    const userId = (await findUserId(req)).userId;
    const {id}= req.params;
    const deleteOrderService = await deleteOrder(userId, id);
    return res.status(deleteOrderService.status).json({ response: deleteOrderService });
};

// Controller for remove all orders created by the sama client
export const deleteAllOrdersController = async (req, res) => {
    const userId = (await findUserId(req)).userId;
    const deleteAllOrdersService = await deleteAllOrders(userId);
    return res.status(deleteAllOrdersService.status).json({ response: deleteAllOrdersService });
};

// Controller to make the order decision by the restaurant
export const orderDecisionController = async (req, res) => {
    const { id } = req.params;
    const userId = (await findUserId(req)).userId;
    const status = req.body.status;
    const orderDecisionService = await orderDecisionRestaurant(id, userId, status);
    return res.status(orderDecisionService.status).json({ response: orderDecisionService });
};

// Controller to update the order decision by the restaurant
export const changeOrderDecisionController = async (req, res) => {
    const { id } = req.params;
    const userId = (await findUserId(req)).userId;
    const status = req.body.status;
    const changeOrderDecisionService = await changeOrderDecision(id, userId, status);
    return res.status(changeOrderDecisionService.status).json({ response: changeOrderDecisionService });
};

// Controller for accept or reject an order by the deliveryman
export const decisionOrderController = async (req, res) => {
    const { id } = req.params;
    const userId = ((await findUserId(req)).userId);
    const decision = req.body.decision;
    const decisionOrderService = await orderDecisionDeliveryman(id, userId, decision);
    return res.status(decisionOrderService.status).json({ response: decisionOrderService });
};

// Controller for display all orders accepted to the deliveryman
export const historyOrdersAccepted = async (req, res) => {
    const historyOrdersAcceptedService = await getAllOrdersAccepted(req.query);
    return res.status(historyOrdersAcceptedService.status).json({ response: historyOrdersAcceptedService });
};

// Controller for ther payment
export const isPaidController = async (req, res) => {
    const {id} = req.params;
    const user = ((await findUserId(req)).userId);
    const isPaidService = await isPaid(id, user, req.body);
    return res.status(isPaidService.status).json({ response: isPaidService });
};