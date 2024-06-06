import Article from "../models/articleModel.js";
import Order from "../models/orderModel.js";

// Service for create new order
export const addNewOrder = async (article, userId, data) => {
    return await Order.find({ clientId: userId })
        .then(async (result) => {
            const oldArticleOrder = result.map((oldArticle) => (oldArticle.articleId).toString());
            const findArticle = () => {
                for (let i = 0, oldArticle = oldArticleOrder.length; i <= oldArticle; i++) {
                    if (oldArticleOrder[i] === article) {
                        return { status: true, value: oldArticleOrder[i] };
                    };
                };
                return { status: false, value: article };
            };
            const articleValueId = findArticle();
            if (articleValueId.status) {
                return await Order.findOne({ articleId: articleValueId.value }).where('clientId').equals(userId)
                    .then(async (findOrder) => {
                        const newNumberPieces = findOrder.numberPieces + data.numberPieces;
                        const newPriceOrder = findOrder.pricePieces * newNumberPieces;
                        await Order.findByIdAndUpdate(
                            { _id: findOrder._id },
                            {
                                $set: {
                                    numberPieces: newNumberPieces,
                                    priceOrder: newPriceOrder
                                }
                            }
                        );
                        await findOrder.save();
                        return { status: 200, success: true, message: 'Order updatet because you already have order with this article' };
                    }).catch((err) => {
                        return { status: 400, success: false, error: err.message };
                    });
            } else try {
                return await Article.findById(article)
                    .then(async (order) => {
                        order = new Order({
                            articleId: article,
                            clientId: userId,
                            restaurantId: order.restaurantId,
                            numberPieces: data.numberPieces,
                            pricePieces: order.price,
                            priceOrder: order.price * data.numberPieces
                        });
                        await order.save();
                        return { status: 200, success: true, message: 'Order created', order: order };
                    })
            } catch (error) {
                return { status: 400, success: false, error: error.message };
            }
        }).catch((err) => {
            return { status: 500, success: false, error: err.message };
        });
};