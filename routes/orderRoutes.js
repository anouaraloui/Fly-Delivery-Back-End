import express from "express";
import { role } from "../middlewares/checkRole.js";
import isAuth from "../middlewares/auth.js";
import { addNewOrderController, changeOrderDecisionController, decisionOrderController, deleteAllOrdersController, deleteOrderController, getAllOrdersController, orderDecisionController, updateOrderController } from "../controllers/orderController.js";
import checkArticle from "../middlewares/checkArticle.js";
import { validatorId } from "../middlewares/idValidator.js";

const router = express.Router();

// Route for add new order
router.post('/orders/:id', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
checkArticle, addNewOrderController);

// Route for display all orders created by the same user
router.get('/orders', isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next),
getAllOrdersController);

// Route for update an order
router.patch('/orders/:id', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
updateOrderController);

// Route for delete an order
router.delete('/orders/:id', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
validatorId, deleteOrderController);

// Route for remove all orders created by the same client
router.delete('/orders', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
deleteAllOrdersController);

// Route to make the order decision by the restaurant
router.post('/orders/restaurant/:id', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validatorId, orderDecisionController);

// Route to change the order decision by the restaurant
router.patch('/orders/restaurant/:id', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validatorId, changeOrderDecisionController);

// Route for accept or reject an order by the deliveryman
router.post('/orders/deliveryman/:id', isAuth, (req, res, next) => role(['Deliveryman'], req, res, next),
validatorId, decisionOrderController);

export default router;