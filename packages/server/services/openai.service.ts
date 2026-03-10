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

export async function generateREADME(repoData: RepoAnalysis): Promise<string> {

    const dependencies = Object.keys(repoData.dependencies)
        .slice(0, 10)
        .join(", ");

    const files = repoData.files
        .map(file => `File: ${file.path}\n${file.content}`)
        .join("\n\n");

    const prompt = `
You are a senior software engineer and technical writer.

Your task is to generate a professional GitHub README based on the repository information provided.

Repository Name:
${repoData.repoName}

Description:
${repoData.description ?? "No description provided"}

Dependencies:
${dependencies}

Code Snippets:
${files}

Existing README (if any):
${repoData.readme}

Instructions:

Analyze the code snippets, dependencies, and repository structure to infer the purpose of the project.

Then generate a high-quality README.md using the following structure:

# Project Title

A clear and concise description of what the project does and why it exists.

## Features

List the main features of the project.

## Tech Stack

List the technologies used (frameworks, languages, databases, etc).

## Installation

Explain how to install and run the project locally.

## Usage

Explain how the project works or how to use it.

## Project Structure

Explain the main folders and important files if identifiable.

## Future Improvements

Suggest possible improvements or features.

## Contributing

Short section encouraging contributions.

## License

Use MIT License unless otherwise specified.

Rules:

- Write in clear, professional developer English
- Be concise but informative
- Infer functionality from code when possible
- Use proper Markdown formatting
- Avoid unnecessary verbosity
- Do not invent unrealistic features
- Maximum 500 words
`

    const response = await client.responses.create({
        input: prompt,
        model: 'gpt-4o-mini',
        temperature: 0.7
    });

    return response.output_text;
}