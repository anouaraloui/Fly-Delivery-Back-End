import Order from "../models/orderModel.js";

// Service for display all orders available
export const getAllOrdersAvailable = async (data) => {
    try {       
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const ordersList = await Order.find().where('restaurantStatus').equals(true)
                            .skip(skipPage)
                            .limit(parseInt(data.limit))
                            .exec();
        const count = ordersList.length;
        if(ordersList && count === 0 || !ordersList) return { status: 404, success: false, message: 'No orders available yet' };
        else return { status: 200, success: true, page: data.page, limit: data.limit, totalOrders: count, orders: ordersList };
        } catch (error) {
            return { status: 400, success: false, message: error.message };
        };
};