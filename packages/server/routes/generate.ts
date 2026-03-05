import express from 'express';
import { Router } from 'express';
import type { Request, Response } from 'express';
import { analyzeRepository } from '../services/github.service';

const router = Router();   

router.post("/generate", async (req: Request, res: Response) => {
    try {
        const { repoUrl } = req.body

        if (!repoUrl) {
            return res.status(400).json({ error: "repoUrl is required" });
          }

        const repoData = await analyzeRepository(repoUrl)

        res.json({ repoData })
    } catch(e) {
        res.status(500).json({ error: e })
    }
})

export default router;