import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { Schema } = mongoose;

let orderSchema = new Schema(
    {
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
            required: false
        },
        restaurantStatus: {
            type: Boolean,
            default: false,
            required: true
        },
        deliverymanStatus: {
            type: Boolean,
            default: false,
            required: true
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

orderSchema.plugin(uniqueValidator);

const Order = mongoose.model('orders', orderSchema);

export default Order;