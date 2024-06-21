import express from "express";
import isAuth from "../middlewares/auth.js";
import { role } from "../middlewares/checkRole.js";
import { decisionOrderController, getAllOrdersAvailableControlelr } from "../controllers/deliveryManController.js";
import { validatorId } from "../middlewares/idValidator.js";

const router = express.Router();

// Route for display all orders available
router.get('/deliveryman/orders', isAuth, (req, res, next) => role(['Deliveryman'], req, res, next),
getAllOrdersAvailableControlelr);

// Route for accept or reject an order
router.post('/deliveryman/orders/:id', isAuth, (req, res, next) => role(['Deliveryman'], req, res, next),
validatorId, decisionOrderController);

export default router;