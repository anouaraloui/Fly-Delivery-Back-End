import express from "express";
import isAuth from "../middlewares/auth.js";
import { role } from "../middlewares/checkRole.js";
import { getAllOrdersAvailableControlelr } from "../controllers/deliveryManController.js";

const router = express.Router();

// Route for display all orders available
router.get('/deliveryman/orders', isAuth, (req, res, next) => role(['Deliveryman'], req, res, next),
getAllOrdersAvailableControlelr);

export default router;