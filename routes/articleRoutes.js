import express from "express";
import isAuth from "../middlewares/auth";
import { validateArticle } from "../middlewares/requestValidator";
import { role } from "../middlewares/checkRole";
import { createArticleController } from "../controllers/articleControllers";

const router = express.Router();

// Route for create a new article
router.post('/article', isAuth, (req, res, next) => role(['Restaurant'], req, res, next),
validateArticle, createArticleController)