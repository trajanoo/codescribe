import express from 'express';
import generateRoutes from './routes/generate.ts'
import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", generateRoutes);


app.listen(3000, () => {
    console.log("server listening on 3000 port.")
})