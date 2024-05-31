import { createArticle, deleteArticle, getAticleById, listArticles, updateArticle } from "../services/articleService.js"
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

// Controller for create new article
export const createArticleController = async (req, res) => {
    const restaurantToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(restaurantToken, process.env.ACCESS_TOKEN);
    const restaurantId = decoded.userId;
    const createArticleService = await createArticle(req.body, restaurantId);
    return res.status(createArticleService.status).json({ response: createArticleService })
};

// Controller for get all articles
export const getAllController = async (req, res) => {
    const getAllService = await listArticles(req.query);
    return res.status(getAllService.status).json({ response: getAllService });
};

// Controller to display an article with id
export const getAticleByIdController = async(req, res) => {
    const getAticleByIdService = await getAticleById(req.params.id);
    return res.status(getAticleByIdService.status).json({ response: getAticleByIdService });
};

// Controller for update article with id 
export const updateArticleController = async (req, res) => {
    const updateArticleService = await updateArticle(req.params.id, req.body);
    return res.status(updateArticleService.status).json({ response: updateArticleService });
};

// Controller for delete article with id
export const deleteArticleController = async (req, res) => {
    const restaurantToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(restaurantToken, process.env.ACCESS_TOKEN);
    const userId = decoded.userId;
    const deleteArticleService = await deleteArticle(req.params.id, userId);
    console.log('delete controller: ', deleteArticleService);
    return res.status(deleteArticleService.status).json({ response: deleteArticleService });
};