import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

let userSchema= new Schema(
    {
        firstName: {
            type: String,
        required: true
        },
        lasttName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'restaurant', 'deliveryman', 'client'],
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        adress: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: false
        }
    }, {timestamps: {currentTime: ()=> Date.now()}, versionKey: false}
);

userSchema.plugin(uniqueValidator);

let User = mongoose.model("users", userSchema);

export default User;