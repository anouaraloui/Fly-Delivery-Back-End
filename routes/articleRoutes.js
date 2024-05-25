import express from "express";
import { validateArticle } from "../middlewares/requestValidator.js";
import { role } from "../middlewares/checkRole.js";
import { createArticleController } from "../controllers/articleControllers.js";
import isAuth from "../middlewares/auth.js";

const router = express.Router();

// Route for create a new article
router.post('/article', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validateArticle, createArticleController)

export default router;