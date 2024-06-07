import express from "express";
import { role } from "../middlewares/checkRole.js";
import isAuth from "../middlewares/auth.js";
import { addNewOrderController, getAllOrderController, updateOrderController } from "../controllers/orderController.js";
import checkArticle from "../middlewares/checkArticle.js";

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

export default router;