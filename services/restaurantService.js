import Order from "../models/orderModel.js";


// Service to display all orders received at the same restaurant 
export const allOrdersRestaurant = async(userId)=> {
    return await Order.find().where('restaurantId').equals(userId)
    .then(async(orders) => {
        if(!orders) return { status: 404, succes: false, message: 'There are no article yet to your restaurant' }
        if(orders) return { status: 200, succes: true, message: 'All orders: ', order: orders }
    }).catch((err) => {
        console.log('error: ', err.message);        
    });
};