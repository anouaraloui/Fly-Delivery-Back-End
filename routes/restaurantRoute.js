// file Restaurant route
import express from 'express';
import { role } from '../middlewares/checkRole.js';
import isAuth from '../middlewares/auth.js';
import { allOrdersRestaurantController, changeOrderDecisionController, orderDecisionController } from '../controllers/restaurantController.js';
import { validatorId } from '../middlewares/idValidator.js';

const router = express.Router();

// Route for display all orders received at the same restaurant
router.get('/restaurant/orders', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
allOrdersRestaurantController);

// Route to make the order decision
router.post('/restaurant/orders/:id', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validatorId, orderDecisionController);

// Route to change the order decision
router.patch('/restaurant/orders/:id', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validatorId, changeOrderDecisionController);

export default router;