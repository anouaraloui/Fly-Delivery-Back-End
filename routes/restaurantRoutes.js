import express from 'express';
import { role } from '../middlewares/checkRole.js';
import isAuth from '../middlewares/auth.js';
import { allOrdersRestaurantController } from '../controllers/restaurantController.js';

const router = express.Router();

// Route for display all orders received at the same restaurant
router.get('/restaurant/orders', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
allOrdersRestaurantController);

export default router;