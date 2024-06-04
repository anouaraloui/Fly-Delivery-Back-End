import express from "express";
import { role } from "../middlewares/checkRole.js";
import isAuth from "../middlewares/auth.js";
import { addNewOrderController } from "../controllers/orderController.js";

const router = express.Router();

// Route for add new order
router.post('/order/:id', isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next),
addNewOrderController);

export default router;