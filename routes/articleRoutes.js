import express from "express";
import { validateArticle } from "../middlewares/requestValidator.js";
import { role } from "../middlewares/checkRole.js";
import { createArticleController, deleteAllArticlesController, deleteArticleController, getAllController, getArticleByRestaurantController, getAticleByIdController, updateArticleController } from "../controllers/articleControllers.js";
import isAuth from "../middlewares/auth.js";
import { validatorId } from "../middlewares/idValidator.js";

const router = express.Router();

// Route for create a new article
router.post('/restaurant/article', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validateArticle, createArticleController);

// Route for display all articles to the customer
router.get('/articles',isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next), 
getAllController);

// Route for display all articles created by the same restaurant
router.get('/restaurant/:name/articles/myarticles', (req, res, next) => role(['Restaurant'], req, res, next),
getArticleByRestaurantController);

// Route to display an article whose identifier is known
router.get('articles/:id', isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next),
getAticleByIdController);

// Route to update an article
router.put('/restaurant/articles/:id', isAuth, (req, res, next) => role([ 'Restaurant' ], req, res, next), 
validatorId, updateArticleController);

// Route for delete an article
router.delete('/restaurant/articles/:id', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
deleteArticleController);

// Route to delete all articles created by the same restaurant
router.delete('/restaurant/articles', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
deleteAllArticlesController);

export default router;