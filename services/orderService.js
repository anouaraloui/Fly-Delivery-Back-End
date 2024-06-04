import Article from "../models/articleModel.js";
import Order from "../models/orderModel.js";

// Service for create new order
export const addNewOrder = async (article, userId, data) => {
    return await Article.findById(article)
        .then(async (order) => {
            if (!order) return { status: 404, success: false, message: 'Article not found! Please repeat it again' };
            else {
                // Make condition when same client add an order with the same article id ==> it will be patch just number of pieces 
                // Without this condition we can find more than one order with same article id 
                // so if client send an order on the same article id just change the number of pieces  
                const articleId = order._id;
                const restaurantId = order.restaurantId;
                const pricePieces = order.price;
                const priceOrder = pricePieces * data.numberPieces;
                order = new Order({
                    articleId: articleId,
                    clientId: userId,
                    restaurantId: restaurantId,
                    numberPieces: data.numberPieces,
                    pricePieces: pricePieces,
                    priceOrder: priceOrder
                });
                await order.save();
                return { status: 200, success: true, message: 'Order created', order: order };
            };
        })
        .catch(error => {
            return { status: 500, success: false, message: error.message };
        });
};