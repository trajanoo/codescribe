import OpenAI from "openai";
import type { RepoAnalysis } from "../types/repository";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function generatePost(repoData: RepoAnalysis): Promise<string> {

    const dependencies = Object.keys(repoData.dependencies)
        .slice(0, 10)
        .join(", ");

    const files = repoData.files
        .map(file => `File: ${file.path}\n${file.content}`)
        .join("\n\n");
    
    const prompt = `You are a professional LinkedIn ghostwriter for software developers.

    Based on the following GitHub repository information, write a high-engagement LinkedIn post.
    
    Repository Name:
    ${repoData.repoName}
    
    README:
    ${repoData.readme}

    Dependencies:
    ${dependencies}
    
    Code Snippets:
    ${files}
    
    Rules:
    - Start with a strong hook
    - Use short paragraphs
    - Explain what the project does
    - Mention technologies if identifiable
    - End with a call-to-action
    - Keep it professional but engaging
    - Max 250 words
    `

    const response = await client.responses.create({
        input: prompt,
        model: 'gpt-4o-mini',
        temperature: 0.7,
    });

    return response.output_text;
}