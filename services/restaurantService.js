import Order from "../models/orderModel.js";

// Service to display all orders received at the same restaurant 
export const allOrdersRestaurant = async (userId) => {
    return await Order.find().where('restaurantId').equals(userId)
    .then(async(orders) => {
        if(!orders) return { status: 404, succes: false, message: 'There is no order for your restaurant yet' };
        if(orders) return { status: 200, succes: true, order: orders };
    }).catch((err) => {
        return { status: 400, succes: false, message: err.message };  
    });
};