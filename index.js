import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./configuration/connectMondoDB.js";
import userRoutes from './routes/userRoutes.js';
const app = express();

app.use(express.json({ limit: '999999mb' }));
app.use(express.urlencoded({ limit: '999999mb', extended: true}));
app.use(json())
app.use(cors());

config();
connectDB();

app.use(userRoutes)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`));