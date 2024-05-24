import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";


const { Schema } = mongoose;

let articleSchema= new Schema(
    {
        articleName: {
            trpe: String,
            required: true
        },
        articlePicture: {
            trpe: String,
            required: false
        },
        articlePrice: {
            type: String,
            required: true
        },
        articleRating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
            default: 0
        },
        articleNbrReviews: {
            type: Number,
            required: true,
            default: 0
        },
        discountPrice: {
            type: true,
            required: false
        },
        articleInformation: {
            type: String,
            required: true
        }
    }
);

articleSchema.plugin(uniqueValidator);

const Article = mongoose.model('articles', articleSchema);

export default Article;