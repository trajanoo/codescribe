import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import cors from 'cors';
import generateRoutes from './routes/generate.ts';
import paymentsRouter, { webhookHandler } from './routes/payments.ts';
import './jobs/resetCredits.ts';

const app = express();

app.use(cors({
    origin: 'https://codescribe-client.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

// Must be registered BEFORE express.json() so the raw body is preserved for Stripe
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json());
app.use('/api', generateRoutes);
app.use('/api/payments', paymentsRouter);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server listening on 3001 port.');
});
