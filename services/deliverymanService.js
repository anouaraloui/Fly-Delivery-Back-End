import Order from "../models/orderModel.js";
import OrdersAccepted from "../models/orderAcceptedModel.js";

// Service for display all orders available
export const getAllOrdersAvailable = async (data) => {
    try {
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const ordersList = await Order.find().where('restaurantStatus').equals(true)
            .$where('this.deliverymanStatus != true')
            .skip(skipPage)
            .limit(parseInt(data.limit))
            .exec();
        const count = ordersList.length;
        if (ordersList && count === 0 || !ordersList) return { status: 404, success: false, message: 'No orders available yet' };
        else return { status: 200, success: true, page: data.page, limit: data.limit, totalOrders: count, orders: ordersList };
    } catch (error) {
        return { status: 400, success: false, message: error.message };
    };
};

// Service to accept or reject an order
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