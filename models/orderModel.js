import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { config } from "dotenv";

config();

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
            default: null,
            required: false
        },
        deliverymanStatus: {
            type: Boolean,
            default: false,
            required: false
        },
        orderStatus: {
            type: Boolean,
            default: false,
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
            required: true,
            default: function () {
              return (this.itemsPrice * this.numberPieces) + this.shippingPrice + this.taxPrice;
            }
        },
        shippingAddress: {
            fullName: {
              type: String,
              required: true
            },
            address: {
              type: String,
              required: true
            },
            phone: {
              type: Number,
              required: true
            },
            city: {
              type: String,
              required: true
            },
            postalCode: {
              type: String,
              required: true
            },
            country: {
              type: String,
              required: true
            },
            location: {
              lat: Number,
              lng: Number,
              address: String,
              name: String,
              vicinity: String,
              googleAddressId: String,
            },
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: function() {
                const perPiece =  process.env.SHIPPING_PER_PIECE;
                const shippingPrice = this.numberPieces * perPiece;
                return shippingPrice
            }
        },
        paymentMethod: {
          type: String,
          required: true,
          default: "Cash"
        },
        isDelivered: {
          type: Boolean,
          required: false,
          default: false
        },
        isPaid: {
          type: Boolean,
          default: false
        },
        paymentResult: {
          id: String,
          status: Boolean,
          update_time: String,
          email_address: String,
        },
        paidAt: {
          type: Date
        },
        taxPrice: {
          type: Number,
          required: true,
          default: process.env.TAX_PRICE
        }
    }, {timestamps: true}
);

orderSchema.plugin(uniqueValidator);

const Order = mongoose.model('orders', orderSchema);

export default Order;