import Article from "../models/articleModel.js";


// Service for create new article
export const createArticle = async (data, restaurantId) => {
    return await Article.findOne({ name: data.name })
        .then(async article => {
            if (article) return { status: 404, success: false, message: 'Bad request! Article name already exist!' };
            else {

                article = new Article({ ...data, picture: data.picture || '', restaurantId: restaurantId });
                await article.save();
                return { status: 201, success: true, message: "Article created", article: data }
            }
        })
        .catch(error => {
            return { status: 500, success: false, message: error.message };
        })
}

// Service for get all articles
export const listArticles = async (data) => {
    try {
        const minPriceFind = Number(data.minPrice);
        const maxPriceFind = Number(data.maxPrice);
        if (isNaN(minPriceFind) || isNaN(maxPriceFind) || minPriceFind > maxPriceFind) return { status: 400, success: true, message: 'Invalid price range!' };
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const articleList = await Article.find()
            .sort({ [data.sortBy]: 1 })
            .skip(skipPage)
            .limit(parseInt(data.limit))
            .where('price').gte(minPriceFind).lte(maxPriceFind)
            .exec();
        const count = articleList.length;
        if (articleList && count === 0) return { status: 404, success: true, message: 'There are no article!' };
        else return { status: 200, success: true, page: data.page, limit: data.limit, totalArticles: count, articles: articleList };
    } catch (error) {
        return { status: 500, success: false, message: error };
    };
};

// Service to display an article whose identifier is known
export const getAticleById = async (id) => {
    return await Article.findById(id)
    .then( article => {
        if(!article) return { status: 404, success: true, message: 'Article not found!' };
        else return { status: 200, success: true, article: article }
    })
    .catch(err => { 
        return { status: 500, success: false, message: err.message };
    });
};

// Service to display all article created by the same restaurant
export const getArticleByRestaurant = async (data,restaurant) => {
    try {       
    if (!data.page) data.page = 1;
    if (!data.limit) data.limit = 30;
    const skipPage = (data.page - 1) * data.limit;
    const articleList = await Article.find({ restaurantId: restaurant})
                        .skip(skipPage)
                        .limit(parseInt(data.limit))
                        .exec();
    const count = articleList.length;
    if(articleList && count === 0 || !articleList) return { status: 404, success: false, message: 'You have no article yet' };
    else return { status: 200, success: true, page: data.page, limit: data.limit, totalArticles: count, articles: articleList };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for update article
export const updateArticle = async (id, data) => {
    return await Article.findById(id)
        .then(async (result) => {
            if (!result) return { status: 404, success: false, message: 'Article not found!' }
            else {
                const newArticle = await Article.findByIdAndUpdate(id, { ...data })
                await newArticle.save();
                return { status: 200, success: true, message: 'Article updated', article: newArticle }
            }
        }).catch((err) => {
            return { status: 400, success: false, message: err.message }
        });
};

// Service for delete article
export const deleteArticle = async (id, userId) => {
    return await Article.findById(id)
        .then(async article => {
            if (!article) return { status: 404, succes: false, message: 'Article not found!' };
            else {
                const restaurant = article.restaurantId;
                if (restaurant != userId) return { status: 401, succes: false, message: 'Unauthorized! Invalid token' };
                else    {
                    await Article.findByIdAndDelete(id);
                    return { status: 200, succes: true, message: 'Article is deleted' }
                };
            }
        })
        .catch(err => {
            return { status: 400, succes: false, message: err }
        });
};

// Service for delete all articles created by the same restaurant
export const deleteAllArticles = async (restaurantId) => {
    return await Article.find({ restaurantId: restaurantId})
    .then(async article => {
        if(!article) return { status: 404, succes: false, message: 'You have no articles!' };
        else {
            await Article.deleteMany({ restaurantId: restaurantId });
            return { status: 200, succes: true, message: 'Your articles are deleted' } ;
        };
    })
    .catch(err => {
        return { status: 400, succes: false, message: err }
    });
};