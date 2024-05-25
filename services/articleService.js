import Article from "../models/articleModel.js";


// Service for create new article
export const createArticle = async (data) => {
    return await Article.findOne({ name: data.name })
    .then( async article => {
        if(article) return { status: 404, success: false, message: 'Bad request! Article name already exist!' };
        else {
            article = new Article({ ...data,  picture: data.picture || ''});
            await article.save();
            return { status: 201, success: true, message: "Article created", article: data }
        }
    })
    .catch( error => {
        return { status: 500, success: false, message: error };
    })
}

// Service for get all articles
export const listArticles = async (data) => {
    try {
        if(!data.page) data.page = 1;
        if(!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const articleList = await Article.find()
        .sort({ [data.sortBy]: 1 })
        .skip(skipPage)
        .limit(data.limit)
    } catch (error) {
        
    }
}