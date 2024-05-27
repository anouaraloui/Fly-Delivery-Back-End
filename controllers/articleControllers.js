import { createArticle, listArticles, updateArticle } from "../services/articleService.js"


// Controller for create new article
export const createArticleController = async (req, res) => {
    const createArticleService = await createArticle(req.body);
    return res.status(createArticleService.status).json({ response: createArticleService })
};

// Controller for get all articles
export const getAllController = async (req, res) => {
    const getAllService = await listArticles(req.query);
    return res.status(getAllService.status).json({ response: getAllService });
};

// Controller for update article with id
export const updateArticleController = async (req, res) => {
    const updateArticleService = await updateArticle(req.params.id, req.body);
    return res.status(updateArticleService.status).json({ response: updateArticleService });
};