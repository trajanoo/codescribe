import cron from 'node-cron';
import { supabaseAdmin } from '../lib/supabaseAdmin.ts';

cron.schedule('0 0 * * *', async () => {
  console.log('[resetCredits] Running daily credit reset check...');

  const { data: rows, error } = await supabaseAdmin
    .from('user_credits')
    .select('user_id')
    .lte('reset_at', new Date().toISOString());

  if (error) {
    console.error('[resetCredits] Error fetching rows:', error);
    return;
  }

  if (!rows || rows.length === 0) {
    console.log('[resetCredits] No users to reset.');
    return;
  }

  const resetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  let resetCount = 0;

  for (const row of rows as { user_id: string }[]) {
    await supabaseAdmin
      .from('user_credits')
      .update({ balance: 5, reset_at: resetAt })
      .eq('user_id', row.user_id);

    await supabaseAdmin
      .from('credit_transactions')
      .insert({ user_id: row.user_id, amount: 5, reason: 'monthly_reset' });

    resetCount++;
  }

  console.log(`[resetCredits] Reset ${resetCount} user(s).`);
});
