import axios from "axios";

function extractRepoInfo(repoUrl: string) {
    const parts = repoUrl.replace("https://github.com/", "").split("/");
    return {
        owner: parts[0],
        repo: parts[1]
    }
}

export async function analyzeRepository(repoUrl: string) {
    const { owner, repo } = extractRepoInfo(repoUrl);

    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`
    }

    const repoRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers }
    )

    const defaultBranch = repoRes.data.default_branch;

    // GET README
    let readmeContent = ""
    try {
        const readmeRes = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            { headers }
        );

        readmeContent = Buffer.from(
            readmeRes.data.content,
            "base64"
        ).toString("utf-8");
    } catch (e) {
        readmeContent = "no readme found."
    }

    // GET REPO TREE
    let treeRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
        { headers }
    )

    const tree = treeRes.data.tree;

    function isValidFile(file: any) {
        return (
            file.type === "blob" &&
            (
                file.path.endsWith(".ts") ||
                file.path.endsWith(".js") ||
                file.path.endsWith(".py")
            ) &&
            !file.path.includes("node_modules") &&
            !file.path.includes("dist") &&
            !file.path.includes("build") &&
            !file.path.includes(".next") &&
            !file.path.includes("coverage") &&
            !file.path.endsWith(".spec.ts") &&
            !file.path.endsWith(".test.ts")
        );
    }

    function scoreFile(path: string) {
        let score = 0;

        if (!path.includes("/")) score += 50;

        if (path.startsWith("src/")) score += 30;

        // app principal
        if (path.includes("app.ts") || path.includes("main.ts") || path.includes("index.ts")) {
            score += 40;
        }

        // penalizar config
        if (path.includes("config")) score -= 10;

        return score;
    }

    const files = tree
        .filter(isValidFile)
        .map(file => ({
            ...file,
            score: scoreFile(file.path)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    let filesContent = "";

    for (const file of files) {
        const fileRes = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
            { headers }
        );

        const content = Buffer.from(
            fileRes.data.content,
            "base64"
        ).toString("utf-8");

        filesContent += `\n\nFile: ${file.path}\n${content.slice(0, 1500)}`;
    }

    return {
        repoName: repo,
        readme: readmeContent.slice(0, 2000),
        files: filesContent
    };
}