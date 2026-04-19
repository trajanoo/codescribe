import OpenAI from "openai";
import type { RepoAnalysis } from "../types/repository";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractKeywords(repoData: RepoAnalysis): Promise<string[]> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Extract Reddit search keywords from a software project. Return ONLY valid JSON: { "keywords": ["...", "..."] }. Rules: 3-4 keywords max. Each should be a short phrase a developer would search on Reddit to find a relevant community. Be specific to the project's domain, not generic.`
      },
      {
        role: "user",
        content: `Project: ${repoData.repoName}
Description: ${repoData.description ?? ""}
Dependencies: ${Object.keys(repoData.dependencies).slice(0, 10).join(", ")}
README: ${repoData.readme.slice(0, 500)}`
      }
    ]
  });

  const parsed = JSON.parse(response.choices[0]?.message.content!);
  return parsed.keywords as string[];
}

async function fetchSubreddits(keywords: string[]) {
  const results = await Promise.all(
    keywords.map(async (kw) => {
      try {
        const res = await fetch(
          `https://www.reddit.com/search.json?q=${encodeURIComponent(kw)}&type=sr&limit=5`,
          { headers: { "User-Agent": "codescribe/1.0" } }
        );
        const data = await res.json() as any;
        return data.data.children.map((s: any) => ({
          name: s.data.display_name,
          members: s.data.subscribers,
          description: s.data.public_description?.slice(0, 120) ?? ""
        }));
      } catch {
        return [];
      }
    })
  );

  const seen = new Set<string>();
  return results.flat().filter((s) => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });
}

async function generatePostAndPick(
  repoData: RepoAnalysis,
  subreddits: { name: string; members: number; description: string }[]
) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a developer sharing a side project on Reddit. Writing style: first-person, casual, honest; leads with the problem solved, not the product; self-deprecating when appropriate; never uses marketing language ("powerful", "revolutionary", "seamless"). Return ONLY valid JSON in this exact shape:
{
  "title": "string (Reddit-style title, curiosity-driven, no hype, under 200 chars)",
  "body": "string (150-300 words, Reddit markdown ok)",
  "subreddits": [{ "name": "string", "members": number, "reason": "string (one short sentence)" }]
}
For subreddits: pick 4-6 from the provided list where the project is genuinely a good fit. Do not invent any subreddits not in the list.`
      },
      {
        role: "user",
        content: `Project: ${repoData.repoName}
Description: ${repoData.description ?? ""}
Tech stack: ${Object.keys(repoData.dependencies).slice(0, 10).join(", ")}
README: ${repoData.readme.slice(0, 800)}
Key files: ${repoData.files.map(f => f.path).join(", ")}

Real subreddits to choose from:
${JSON.stringify(subreddits, null, 2)}`
      }
    ]
  });

  return JSON.parse(response.choices[0]?.message.content!) as {
    title: string;
    body: string;
    subreddits: { name: string; members: number; reason: string }[];
  };
}

export async function generateRedditPost(repoData: RepoAnalysis) {
  const keywords = await extractKeywords(repoData);
  const subreddits = await fetchSubreddits(keywords);
  return generatePostAndPick(repoData, subreddits);
}
