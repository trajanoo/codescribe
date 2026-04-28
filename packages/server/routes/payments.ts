import { Router } from 'express';
import type { Request, Response, RequestHandler } from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin.ts';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { plan, userId } = req.body as { plan: 'core' | 'pro'; userId: string };

    const priceId =
      plan === 'core'
        ? process.env.STRIPE_CORE_PRICE_ID!
        : process.env.STRIPE_PRO_PRICE_ID!;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'http://localhost:3000/dashboard?payment=success',
      cancel_url: 'http://localhost:3000/#pricing',
      metadata: { userId, plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export const webhookHandler: RequestHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  let event: Stripe.Event;
try {
  event = await stripe.webhooks.constructEventAsync(
    req.body as Buffer,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
} catch (err) {
  console.error('Webhook error:', err);
  res.status(400).json({ error: 'Webhook verification failed' });
  return;
}

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = (session.metadata ?? {}) as { userId: string; plan: string };
    const credits = plan === 'core' ? 15 : 40;
    const reason = plan === 'core' ? 'core_purchase' : 'pro_purchase';

    const { data: creditRow } = await supabaseAdmin
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    const currentBalance = (creditRow as { balance: number } | null)?.balance ?? 0;

    await supabaseAdmin
  .from('user_credits')
  .upsert(
    {
      user_id: userId,
      balance: (creditRow?.balance ?? 0) + credits,
      reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: 'user_id' }
  );

    await supabaseAdmin
      .from('credit_transactions')
      .insert({ user_id: userId, amount: credits, reason });
  }

  res.json({ received: true });
};

export default router;
