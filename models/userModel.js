import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

let userSchema= new Schema(
    {
        firstName: {
            type: String,
        required: true
        },
        lastName: {
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
            enum: ['admin', 'restaurant', 'deliveryman', 'customer'],
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
    }, {timestamps: true}
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const hash = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT));
    this.password = hash;    
    next();
  });

userSchema.plugin(uniqueValidator);

let User = mongoose.model("users", userSchema);

export default User;