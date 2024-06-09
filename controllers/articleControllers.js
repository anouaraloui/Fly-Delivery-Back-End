import { createArticle, deleteAllArticles, deleteArticle, getArticleByRestaurant, getAticleById, listArticles, updateArticle } from "../services/articleService.js"
import findUserId from "../utils/findUserId.js";

// Controller for create new article
export const createArticleController = async (req, res) => {
    const restaurant = await findUserId(req);
    const createArticleService = await createArticle(req.body, restaurant);
    return res.status(createArticleService.status).json({ response: createArticleService });
};

// Controller for get all articles
export const getAllController = async (req, res) => {
    const getAllService = await listArticles(req.query);
    return res.status(getAllService.status).json({ response: getAllService });
};

// Controller for display articles created by the some restaurant
export const getArticleByRestaurantController = async (req, res) => {
    const restaurant = await findUserId(req);
    const getArticleByRestaurantService = await getArticleByRestaurant(req.query, restaurant);
    return res.status(getArticleByRestaurantService.status).json({ response: getArticleByRestaurantService });
};

// Controller to display an article with id
export const getAticleByIdController = async(req, res) => {
    const { id } = req.params;
    const getAticleByIdService = await getAticleById(id);
    return res.status(getAticleByIdService.status).json({ response: getAticleByIdService });
};

// Controller for update article with id 
export const updateArticleController = async (req, res) => {
    const userId = await findUserId(req);
    const { id } = req.params;
    const updateArticleService = await updateArticle(id, userId, req.body);
    return res.status(updateArticleService.status).json({ response: updateArticleService });
};

// Controller for delete article with id
export const deleteArticleController = async (req, res) => {
    const restaurant = await findUserId(req);
    const { id } = req.params;
    const deleteArticleService = await deleteArticle(id, restaurant);
    return res.status(deleteArticleService.status).json({ response: deleteArticleService });
};

// Controller to remove all articles created by the same restaurant
export const deleteAllArticlesController = async (req, res) => {
    const restaurant = await findUserId(req);
    const deleteAllArticlesService = await deleteAllArticles(restaurant);
    return res.status(deleteAllArticlesService.status).json({ response: deleteAllArticlesService });
};