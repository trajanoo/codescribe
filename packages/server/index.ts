import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import cors from 'cors';
import generateRoutes from './routes/generate.ts';
import paymentsRouter, { webhookHandler } from './routes/payments.ts';
import './jobs/resetCredits.ts';

const app = express();

app.use(cors());

// Must be registered BEFORE express.json() so the raw body is preserved for Stripe
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json());
app.use('/api', generateRoutes);
app.use('/api/payments', paymentsRouter);

app.listen(3001, () => {
    console.log('server listening on 3001 port.');
});
