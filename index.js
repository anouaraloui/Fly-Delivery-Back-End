import "express-async-errors";
import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./configuration/connectMondoDB.js";
import userRoutes from './routes/userRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: "json" };
import articleRoutes from './routes/articleRoutes.js'

const app = express();

app.use(express.json({ limit: '999999mb' }));
app.use(express.urlencoded({ limit: '999999mb', extended: true}));
app.use(json())
app.use(cors());
app.use(express.json())

config();
connectDB();

app.use('/api-swagger-test', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(userRoutes);
app.use(articleRoutes)

app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
    next()
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`));