import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin.ts';

export async function requireCredits(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const token = authHeader.slice(7);
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);

  if (!user) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const { data: creditRow } = await supabaseAdmin
    .from('user_credits')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  const balance = (creditRow as { balance: number } | null)?.balance ?? 0;

  if (balance <= 0) {
    res.status(402).json({ error: 'insufficient_credits' });
    return;
  }

  res.locals['user'] = user;
  res.locals['balance'] = balance;
  next();
}
