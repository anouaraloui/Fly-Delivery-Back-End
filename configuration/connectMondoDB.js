import mongoose from "mongoose";

const urlCompass = "mongodb://localhost:27017/flyDelivery"
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