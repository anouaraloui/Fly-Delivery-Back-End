import Article from "../models/articleModel.js";

const checkArticle = async (req, res, next) => {
    return await Article.findById(req.params.id)
    .then( article => {
        if(!article) return res.status(404).json({message: "Article not found! please repeat again"});
        else return next()  ;      
    }).catch(error => {
        return res.status(400).json({error: error});
    });
};

export default checkArticle;