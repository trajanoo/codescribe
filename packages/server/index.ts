import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import generateRoutes from './routes/generate.ts';
import paymentsRouter, { webhookHandler } from './routes/payments.ts';
import './jobs/resetCredits.ts';

const app = express();

const corsOptions = {
  origin: 'https://codescribe-client.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json());
app.use('/api', generateRoutes);
app.use('/api/payments', paymentsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});