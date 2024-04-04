import mongoose from "mongoose";
import { config } from "dotenv";

config();

const urlCompass = process.env.URL_COMPASS
mongoose.set('strictQuery', true);

export const connectDB = () => {
    mongoose.connect(urlCompass)
    .then(()=> {
        console.log("Successful connection to the database.");
    })
    .catch(()=> {
        console.log("Unable to connect to database.");
    })
}