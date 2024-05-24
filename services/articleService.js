import Article from "../models/articleModel";


// Service for create new article
export const createArticle = async (data) => {
    return await Article.findOne({ articleName: data.articleName })
    .then( async article => {
        if(article) return { status: 404, success: false, message: 'Bad request! Article name already exist!' };
        else {
            article = new Article({ ...data,  articlePicture: data.articlePicture || ''});
            await article.save();
            return { status: 201, success: true, message: "Article created", article: data }
        }
    })
    .catch( error => {
        return { status: 500, success: false, message: error };
    })
}