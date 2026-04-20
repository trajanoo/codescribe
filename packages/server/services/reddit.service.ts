import OpenAI from "openai";
import type { RepoAnalysis } from "../types/repository";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ProjectContext {
  whatItDoes: string;
  problemItSolves: string;
  targetAudience: string[];
  niche: string;
  themeKeywords: string[];
  techKeywords: string[];
}

interface Subreddit {
  name: string;
  members: number;
  description: string;
}

async function analyzeProjectContext(repoData: RepoAnalysis): Promise<ProjectContext> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert at understanding software projects from the perspective of the people who USE them, not the people who BUILD them. Always respond in English.

Given a project's README, description, and file structure, extract a deep thematic understanding of the project.

Return ONLY valid JSON in this exact shape:
{
  "whatItDoes": "string — one plain-English sentence describing what the project does for its users, with zero technical jargon",
  "problemItSolves": "string — the specific real-world frustration or gap this addresses",
  "targetAudience": ["string", ...] — 2-4 specific groups of real people who would benefit (e.g. "indie hackers launching side projects", "freelance designers", "small restaurant owners"). Never say "developers" unless the tool is explicitly for developers to use in their workflow, not to build with.",
  "niche": "string — the domain or vertical this belongs to (e.g. 'personal finance', 'creator tools', 'remote work', 'e-commerce')",
  "themeKeywords": ["string", ...] — 4-6 Reddit search terms a non-developer in the target audience would use to find their community. Focus on the problem space and lifestyle, not the technology. E.g. for a budget tracker: ["personal finance", "frugal living", "financial independence", "budgeting"]. For a portfolio builder: ["freelancing", "creative portfolio", "job hunting", "design career"].",
  "techKeywords": ["string", ...] — 2-3 terms for developer/builder communities who might find this technically interesting. E.g. ["open source", "nextjs", "side project"]."
}`
      },
      {
        role: "user",
        content: `Project name: ${repoData.repoName}
GitHub description: ${repoData.description ?? "(none)"}
README:
${repoData.readme}

Key file paths: ${repoData.files.map(f => f.path).join(", ")}`
      }
    ]
  });

  return JSON.parse(response.choices[0]?.message.content!) as ProjectContext;
}

async function fetchSubreddits(keywords: string[]): Promise<Subreddit[]> {
  const results = await Promise.all(
    keywords.map(async (kw) => {
      try {
        const res = await fetch(
          `https://www.reddit.com/search.json?q=${encodeURIComponent(kw)}&type=sr&limit=8`,
          { headers: { "User-Agent": "codescribe/1.0" } }
        );
        const data = await res.json() as any;
        return data.data.children
          .map((s: any) => ({
            name: s.data.display_name,
            members: s.data.subscribers as number,
            description: s.data.public_description?.slice(0, 150) ?? ""
          }))
          .filter((s: Subreddit) => s.members >= 5000);
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
  context: ProjectContext,
  themeSubreddits: Subreddit[],
  techSubreddits: Subreddit[],
  language: string
) {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `OUTPUT LANGUAGE: You MUST write the "title" and "body" fields in ${language}. Every word of both fields must be in ${language}. This is mandatory — do not use English for title or body unless ${language} is English.

You are a developer sharing a side project on Reddit. Writing style: first-person, casual, honest; leads with the problem solved, not the product; self-deprecating when appropriate; never uses marketing language ("powerful", "revolutionary", "seamless").

Structure the post body as:
1. The real-world problem you kept running into (from the perspective of the target audience)
2. What you built and how it helps
3. One honest limitation or rough edge
4. A genuine question inviting the community's feedback or experience

Return ONLY valid JSON in this exact shape:
{
  "title": "string (Reddit-style, curiosity-driven, no hype, under 200 chars)",
  "body": "string (200-350 words, Reddit markdown ok)",
  "subreddits": [{ "name": "string", "members": number, "reason": "string (one sentence: why people in THIS community specifically would care about this project's purpose)" }]
}

For subreddits: pick 4-6 total from the provided lists. The majority should come from the theme-based list. Only include a tech community if the project is genuinely interesting to that community beyond just using the same stack. Do not invent subreddits not in the lists.`
      },
      {
        role: "user",
        content: `Write title and body in ${language}.

What it does: ${context.whatItDoes}
Problem it solves: ${context.problemItSolves}
Target audience: ${context.targetAudience.join(", ")}
Niche: ${context.niche}

Theme-based communities (people who face the problem this project solves):
${JSON.stringify(themeSubreddits, null, 2)}

Tech/developer communities:
${JSON.stringify(techSubreddits, null, 2)}`
      }
    ]
  });

  return JSON.parse(response.choices[0]?.message.content!) as {
    title: string;
    body: string;
    subreddits: { name: string; members: number; reason: string }[];
  };
}

export async function generateRedditPost(repoData: RepoAnalysis, language = "English") {
  const context = await analyzeProjectContext(repoData);

  const [themeSubreddits, techSubreddits] = await Promise.all([
    fetchSubreddits(context.themeKeywords),
    fetchSubreddits(context.techKeywords)
  ]);

  return generatePostAndPick(context, themeSubreddits, techSubreddits, language);
}
