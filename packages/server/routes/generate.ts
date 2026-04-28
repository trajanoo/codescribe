import { Router } from 'express';
import type { Request, Response } from 'express';
import type { User } from '@supabase/supabase-js';
import { analyzeRepository } from '../services/github.service';
import { generatePost, generateREADME } from '../services/openai.service';
import { generateRedditPost } from '../services/reddit.service';
import { requireCredits } from '../middleware/requireCredits.ts';
import { supabaseAdmin } from '../lib/supabaseAdmin.ts';

const router = Router();

async function debitCredit(userId: string, currentBalance: number): Promise<void> {
  await Promise.all([
    supabaseAdmin
      .from('user_credits')
      .update({ balance: currentBalance - 1 })
      .eq('user_id', userId),
    supabaseAdmin
      .from('credit_transactions')
      .insert({ user_id: userId, amount: -1, reason: 'generation' }),
  ]);
}

router.post("/generatePost", requireCredits, async (req: Request, res: Response) => {
    try {
        const { repoUrl, tone, length, language } = req.body

        if (!repoUrl) {
            return res.status(400).json({ error: "repoUrl is required" });
          }

        const repoData = await analyzeRepository(repoUrl);
        const post = await generatePost(repoData, tone, length, language);

        const user = res.locals['user'] as User;
        const balance = res.locals['balance'] as number;
        debitCredit(user.id, balance).catch((err) =>
          console.error('[credits] debit failed for generatePost:', err)
        );

        res.json({ content: post });

    } catch(e) {
        res.status(500).json({ error: e })
    }
});

router.post("/generateREADME", requireCredits, async (req: Request, res: Response) => {
    try {
        const { repoUrl } = req.body

        if(!repoUrl) {
            return res.status(400).json({ error: "repoUrl is required" });
        }

        const repoData = await analyzeRepository(repoUrl);
        const readme = await generateREADME(repoData);

        const user = res.locals['user'] as User;
        const balance = res.locals['balance'] as number;
        debitCredit(user.id, balance).catch((err) =>
          console.error('[credits] debit failed for generateREADME:', err)
        );

        res.json({ content: readme });

    } catch(e) {
        res.status(500).json({ error: e });
    }
});

router.post("/generateReddit", requireCredits, async (req: Request, res: Response) => {
    try {
        const { repoUrl, language } = req.body;

        if (!repoUrl) {
            return res.status(400).json({ error: "repoUrl is required" });
        }

        console.log("[generateReddit] language received:", language);

        const repoData = await analyzeRepository(repoUrl);
        const result = await generateRedditPost(repoData, language);

        const user = res.locals['user'] as User;
        const balance = res.locals['balance'] as number;
        debitCredit(user.id, balance).catch((err) =>
          console.error('[credits] debit failed for generateReddit:', err)
        );

        res.json(result);

    } catch(e) {
        res.status(500).json({ error: e });
    }
});

export default router;
