import express from 'express';
import { Router } from 'express';
import type { Request, Response } from 'express';
import { analyzeRepository } from '../services/github.service';
import { generatePost, generateREADME } from '../services/openai.service';

const router = Router();   

router.post("/generatePost", async (req: Request, res: Response) => {
    try {
        const { repoUrl } = req.body

        if (!repoUrl) {
            return res.status(400).json({ error: "repoUrl is required" });
          }

        const repoData = await analyzeRepository(repoUrl);
        const post = await generatePost(repoData);

        res.json({ content: post });
        
    } catch(e) {
        res.status(500).json({ error: e })
    }
});

router.post("/generateREADME", async (req: Request, res: Response) => {
    try {
        const { repoUrl } = req.body

        if(!repoUrl) {
            return res.status(400).json({ error: "repoUrl is required" });
        }

        const repoData = await analyzeRepository(repoUrl);
        const readme = await generateREADME(repoData);

        res.json({ content: readme });

    } catch(e) {
        res.status(500).json({ error: e });
    }
});

export default router;