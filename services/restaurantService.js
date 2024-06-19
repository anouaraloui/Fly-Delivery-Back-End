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

// Service to make the order decision
export const orderDecision = async (id, userId, status) => {
    return await Order.findById(id).where('restaurantId').equals(userId)
    .then(async (order) => {
        if(!order) return { status: 404, succes: false, message: 'Not found!' };
        if(order.orderStatus || order.restaurantStatus != null ) return { status: 400, succes: false, message: 'Your decision already send' };
        await Order.findByIdAndUpdate(
            {_id: id},
            {
                $set: {
                    "restaurantStatus": status
                }
            }
        );
        return { status: 200, succes: true, message: "Your answer is succussffully send" };
    }).catch((err) => {
        return { status: 400, succes: false, message: err.message }; 
    });
};

// Service to update the order decision
export const changeOrderDecision = async (id, userId, status) => {
    return await Order.findById(id).where('restaurantId').equals(userId)
    .then(async (order) => {
        if(!order) return { status: 404, succes: false, message: 'Not found!' };
        if(order.orderStatus != null) return { status: 400, succes: false, message: 'You cannot change your decision!' };
        await Order.findByIdAndUpdate(
            {_id: id},
            {
                $set: {
                    "restaurantStatus": status
                }
            }
        );
        return { status: 200, succes: true, message: "Your answer is succussffully send" };
    }).catch((err) => {
        return { status: 400, succes: false, message: err.message }; 
    });
}