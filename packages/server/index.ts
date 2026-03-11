import express from 'express';
import generateRoutes from './routes/generate.ts'
import { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", generateRoutes);


app.listen(3001, () => {
    console.log("server listening on 3001 port.")
})