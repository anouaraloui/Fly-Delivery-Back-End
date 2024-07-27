import Article from "../models/articleModel.js";
import Order from "../models/orderModel.js";
import OrdersAccepted from "../models/orderAcceptedModel.js";

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

// Service for display all orders and orders created by the same user OR received at the same restaurant OR available to the deliveryman
export const getAllOrders = async (userId, role, data) => {
    try {
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 10;
        const skipPage = (data.page - 1) * data.limit;
        if (role === "Admin") {
            try {
                const orders = await Order.find()
                    .sort({ [data.sortBy]: data.createdAt })
                    .skip(data.skip)
                    .limit(data.limit)
                    .where('createdAt').lt(data.createdAtBefore).gt(data.createdAtAfter);
                const count = await Order.count();
                if (count != 0 && orders.length === 0) return { status: 200, succes: true, message: "No orders in this period " };
                if (count === 0 || orders.length === 0) return { status: 200, succes: true, message: "No orders yet " };
                return { status: 200, succes: true, page: data.page, lmit: data.limit, listOrders: count, orders: orders };
            } catch (error) {
                return { status: 400, success: false, message: error.message };
            }
        }
        if (role === "Customer") {
            return await Order.find({ clientId: userId })
                .skip(skipPage).limit(data.limit).exec()
                .then(order => {
                    if (!order) return { status: 404, success: false, message: 'You have no orders yet' };
                    else {
                        const count = order.length;
                        if (count == 0) return { status: 200, success: true, message: "You have no orders yet" };
                        return { status: 200, success: true, page: data.page, limit: data.limit, listOrders: count, orders: order };
                    };
                }).catch(error => {
                    return { status: 400, success: false, message: error.message };
                });
        };
        if (role === "Restaurant") {
            return await Order.find().where('restaurantId').equals(userId)
                .then(async (orders) => {
                    if (!orders) return { status: 404, succes: false, message: 'There is no order for your restaurant yet' };
                    if (orders) return { status: 200, succes: true, order: orders };
                }).catch((error) => {
                    return { status: 400, succes: false, message: error.message };
                });
        };
        if (role === "Deliveryman") {
            return await Order.find().where('restaurantStatus').equals(true)
                .$where('this.deliverymanStatus != true')
                .skip(skipPage)
                .limit(parseInt(data.limit))
                .exec()
                .then((ordersList) => {
                    const count = ordersList.length;
                    if (ordersList && count === 0 || !ordersList) return { status: 404, success: false, message: 'No orders available yet' };
                    else return { status: 200, success: true, page: data.page, limit: data.limit, totalOrders: count, orders: ordersList };
                }).catch((error) => {
                    return { status: 400, success: false, message: error.message };
                });
        };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for update an order
export const updateOrder = async (userId, id, data) => {
    return await Order.findById(id).where('clientId').equals(userId)
        .then(async (result) => {
            if (!result) return { status: 404, success: false, message: 'Order not found!' };
            else {
                if (result.orderStatus != null || result.restaurantStatus != null) return { status: 400, success: false, message: 'You can not update this order!' };
                else {
                    const newNumberPieces = result.numberPieces + data.numberPieces;
                    const newPriceOrder = result.pricePieces * newNumberPieces;
                    await Order.findByIdAndUpdate(
                        { _id: result._id },
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
        .then(async (order) => {
            if (!order) return { status: 404, success: false, message: 'Order not found!' };
            if (order.orderStatus != null || order.restaurantStatus != null) return { status: 400, success: false, message: 'You can not delete this order!' };
            else {
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
        .then(async (result) => {
            if (result.length == 0) return { status: 404, success: false, message: 'You have not yet an order!' };
            else {
                await Order.deleteMany({ clientId: userId }).where('orderStatus' && 'restaurantStatus').equals(null);
                return { status: 200, success: true, message: 'All your orders are deleted' };
            };
        }).catch((err) => {
            return { status: 400, succes: false, message: err.message };
        });
};

// Service to make the order decision by the restaurant
export const orderDecision = async (id, userId, status) => {
    return await Order.findById(id).where('restaurantId').equals(userId)
        .then(async (order) => {
            if (!order) return { status: 404, succes: false, message: 'Not found!' };
            if (order.orderStatus || order.restaurantStatus != null) return { status: 400, succes: false, message: 'Your decision already send' };
            await Order.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        "restaurantStatus": status
                    }
                }
            );
            return { status: 200, succes: true, message: "Your answer is successfully send" };
        }).catch((err) => {
            return { status: 400, succes: false, message: err.message };
        });
};

// Service to update the order decision by the restaurant
export const changeOrderDecision = async (id, userId, status) => {
    return await Order.findById(id).where('restaurantId').equals(userId)
        .then(async (order) => {
            if (!order) return { status: 404, succes: false, message: 'Not found!' };
            if (order.orderStatus != null) return { status: 400, succes: false, message: 'You cannot change your decision!' };
            await Order.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        "restaurantStatus": status
                    }
                }
            );
            return { status: 200, succes: true, message: "Your answer is successfully send" };
        }).catch((err) => {
            return { status: 400, succes: false, message: err.message };
        });
};

// Service to accept or reject an order by the deliveryman
export const decisionOrder = async (id, userId, decision) => {
    try {
        const order = await Order.findOne({ _id: id }).where('restaurantStatus').equals(true).where('deliverymanStatus').equals(false);
        if (!order) {
            return { status: 404, success: false, message: 'There are no orders available yet' };
        };
        if (decision === true) {
            await Order.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        "deliverymanId": userId,
                        "deliverymanStatus": decision,
                        "orderStatus": true
                    }
                },
                { new: true }
            );
            const completedOrder = new OrdersAccepted({
                orderId: order._id,
                deliverymanId: userId,
                restaurantStatus: order.restaurantStatus,
                deliverymanStatus: decision,
                articleId: order.articleId,
                clientId: order.clientId,
                restaurantId: order.restaurantId,
                orderStatus: true,
                numberPieces: order.numberPieces,
                pricePieces: order.pricePieces,
                priceOrder: order.priceOrder
            });
            await completedOrder.save();
        };
        return { status: 200, success: true, message: "Your answer is successfully sent" };
    } catch (err) {
        return { status: 400, success: false, message: err.message };
    };
};