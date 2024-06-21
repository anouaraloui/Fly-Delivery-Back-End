import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { Schema } = mongoose;

let acceptedOrderSchema = new Schema(
    {
        orderId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        articleId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        clientId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        restaurantId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        deliverymanId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        restaurantStatus: {
            type: Boolean,
            default: null,
            required: true
        },
        deliverymanStatus: {
            type: Boolean,
            default: null,
            required: true
        },
        orderStatus: {
            type: Boolean,
            default: null,
            required: false
        },
        numberPieces : {
            type: Number,
            default: 1,
            required: true
        },
        pricePieces: {
            type: Number, 
            required: true
        },
        priceOrder: {
            type: Number,
            required: true
        }
    }, {timestamps: true}
);

acceptedOrderSchema.plugin(uniqueValidator);

const OrdersAccepted = mongoose.model('historyordersaccepteds', acceptedOrderSchema);

export default OrdersAccepted;