import express from "express";
import { validateArticle } from "../middlewares/requestValidator.js";
import { role } from "../middlewares/checkRole.js";
import { createArticleController, deleteArticleController, getAllController, getAticleByIdController, updateArticleController } from "../controllers/articleControllers.js";
import isAuth from "../middlewares/auth.js";

const router = express.Router();

// Route for create a new article
router.post('/article', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validateArticle, createArticleController);

// Route for display all articles
router.get('/article',isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next), 
getAllController);

// Route to display an article whose identifier is known
router.get('/article/:id', isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next),
getAticleByIdController)

// Route to update an article
router.put('/article/:id', isAuth, (req, res, next) => role(['Admin', 'Restaurant', 'Deliveryman', 'Customer'], req, res, next), 
updateArticleController);

// Route for delete an article
router.delete('/article/:id', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
deleteArticleController);

export default router;