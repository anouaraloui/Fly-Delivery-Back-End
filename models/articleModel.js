import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";


const { Schema } = mongoose;

let articleSchema= new Schema(
    {
        name: {
            type: String,
            required: true
        },
        picture: {
            type: String,
            required: false
        },
        price: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
            default: 0
        },
        reviews: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            required: false
        },
        information: {
            type: String,
            required: true
        }
    }, {timestamps: true}
);

articleSchema.plugin(uniqueValidator);

const Article = mongoose.model('articles', articleSchema);

export default Article;