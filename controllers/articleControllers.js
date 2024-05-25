import { createArticle } from "../services/articleService.js"


// Controller for create new article
export const createArticleController = async (req, res) => {
    const createArticleService = await createArticle(req.body);
    return res.status(createArticleService.status).json({ response: createArticleService })
}