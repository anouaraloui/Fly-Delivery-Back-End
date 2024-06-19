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

// Service for display all order created by the same user
export const getAllOrder = async (userId, data) => {
    if (!data.page) data.page = 1;
    if (!data.limit) data.limit = 10;
    const skipPage = (data.page - 1) * data.limit;
    return await Order.find({ clientId: userId })
        .skip(skipPage).limit(data.limit).exec()
        .then(order => {
            if (!order) return { status: 404, success: false, message: 'You have not orders' };
            else {
                const count = order.length;
                if(count == 0) return { status: 204, success: true };
                return { status: 200, success: true, page: data.page, limit: data.limit, listOrders: count, orders: order };
            }
        }).catch(error => {
            return { status: 500, success: false, message: error.message };
        });
};

// Service for update an order
export const updateOrder = async (userId, id, data) => {
    return await Order.findById(id).where('clientId').equals(userId)
    .then(async (result) => {
        if(!result) return { status: 404, success: false, message: 'Order not found!'};
        else {
            if(result.orderStatus != null || result.restaurantStatus != null) return { status: 400, success: false, message: 'You can not update this order!'};
            else{
                const newNumberPieces =  result.numberPieces + data.numberPieces;
                const newPriceOrder = result.pricePieces * newNumberPieces;
                await Order.findByIdAndUpdate(
                    {_id: result._id},
                    {
                        $set: {
                            numberPieces: newNumberPieces,
                            priceOrder: newPriceOrder
                        }
                    }
                );
                await result.save();
                return { status: 200, success: true, message: 'Order updatet' };
            }
        }
    }).catch((err) => {
        return { status: 500, success: false, message: err.message };
    });
};

// Service for delete order by id created by the same client
export const deleteOrder = async (userId, id) => {
    return await Order.findById(id).where('clientId').equals(userId)
    .then(async(order) => {
        if(!order) return { status: 404, success: false, message: 'Order not found!' };
        if(order.orderStatus != null || order.restaurantStatus != null) return { status: 400, success: false, message: 'You can not delete this order!'};
        else{
            await Order.findByIdAndDelete(id);
            return { status: 200, success: true, message: 'Order is deleted' };
        }
    }).catch((err) => {
        return { status: 400, succes: false, message: err.message };
    });
};

// Service for delete all orders created by the same client
export const deleteAllOrders = async (userId) => {
    return await Order.find().where('clientId').equals(userId)
    .then(async(result) => {
        if(result.length == 0) return { status: 404, success: false, message: 'You have not yet an order!' };
        else {
            await Order.deleteMany({ clientId: userId }).where('orderStatus' && 'restaurantStatus').equals(null);
            return { status: 200, success: true, message: 'All your orders are deleted' };
        };
    }).catch((err) => {
        return { status: 400, succes: false, message: err.message };
    });
};