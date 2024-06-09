import express from "express";
import { role } from "../middlewares/checkRole.js";
import isAuth from "../middlewares/auth.js";
import { addNewOrderController, deleteAllOrdersController, deleteOrderController, getAllOrderController, updateOrderController } from "../controllers/orderController.js";
import checkArticle from "../middlewares/checkArticle.js";
import { validatorId } from "../middlewares/idValidator.js";

const router = express.Router();

// Route for add new order
router.post('/order/:id', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
checkArticle, addNewOrderController);

// Route for display all orders created by the same user
router.get('/order', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
getAllOrderController);

// Route for update an order
router.patch('/order/:id', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
updateOrderController);

// Route for delete an order
router.delete('/order/:id', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
validatorId, deleteOrderController);

// Route for remove all orders created by the same client
router.delete('/order', isAuth, (req, res, next) => role(['Admin', 'Customer'], req, res, next),
deleteAllOrdersController);

export default router;