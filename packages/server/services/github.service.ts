import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`
  }
});

// extrai nome e dono do repo 
function extractRepoInfo(repoUrl: string) {
  const url = new URL(repoUrl);
  const [owner, repoRaw] = url.pathname.split("/").filter(Boolean);

  const repo = repoRaw?.replace(".git", "");

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }

  return { owner, repo };
}

async function getRepoMetadata(owner: string, repo: string) {
  const res = await githubApi.get(`/repos/${owner}/${repo}`);
  return res.data;
}

// extrai package.json

async function getPackageJson(owner: string, repo: string) {
  try {
    const res = await githubApi.get(
      `/repos/${owner}/${repo}/contents/package.json`
    );

    const decoded = Buffer.from(res.data.content, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);

    return parsed.dependencies || {};
  } catch {
    return {};
  }
}

// extrai readme
async function getReadme(owner: string, repo: string) {
  try {
    const res = await githubApi.get(`/repos/${owner}/${repo}/readme`);

    return Buffer.from(res.data.content, "base64")
      .toString("utf-8")
      .slice(0, 2000);
  } catch {
    return "No README found.";
  }
}

// extrai tree de arquivos
async function getRepoTree(
  owner: string,
  repo: string,
  branch: string
) {
  const res = await githubApi.get(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );

  if (res.data.truncated) {
    throw new Error("Repository too large for MVP analysis.");
  }

  return res.data.tree;
}

// valida tipo do arquivo (apenas type, js e python) e descarta arquivos não uteis
function isValidFile(file: any) {
  return (
    file.type === "blob" &&
    (file.path.endsWith(".ts") ||
      file.path.endsWith(".tsx") ||
      file.path.endsWith(".js") ||
      file.path.endsWith(".jsx") ||
      file.path.endsWith(".py")) &&
    !file.path.includes("node_modules") &&
    !file.path.includes("dist") &&
    !file.path.includes("build") &&
    !file.path.includes(".next") &&
    !file.path.includes("coverage") &&
    !file.path.endsWith(".test.ts") &&
    !file.path.endsWith(".spec.ts")
  );
}

// heurística para favorecer arquivos principais e penalizar arquivos inuteis

function scoreFile(path: string) {
  let score = 0;

  // páginas (Next / React)
  if (path.includes("page.")) score += 60;

  // rotas API
  if (path.includes("route.") || path.includes("api/")) score += 50;

  // controllers e services
  if (path.includes("controller")) score += 40;
  if (path.includes("service")) score += 30;

  // componentes importantes
  if (path.includes("component")) score += 20;

  // arquivos principais
  if (path.includes("app.") || path.includes("main.") || path.includes("index.")) {
    score += 40;
  }

  // src geralmente contém lógica
  if (path.startsWith("src/")) score += 20;

  // penalizações
  if (path.includes("config")) score -= 30;
  if (path.includes("client")) score -= 20;
  if (path.includes("types")) score -= 20;

  return score;
}

function selectImportantFiles(tree: any[]) {
  return tree
    .filter(isValidFile)
    .map((file) => ({
      ...file,
      score: scoreFile(file.path)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}


async function getFilesContent(
  owner: string,
  repo: string,
  files: any[]
) {
  const requests = files.map((file) =>
    githubApi.get(`/repos/${owner}/${repo}/contents/${file.path}`)
  );

  const responses = await Promise.all(requests);

  return responses.map((res, index) => {
    const decoded = Buffer.from(res.data.content, "base64").toString("utf-8");

    return {
      path: files[index].path,
      content: decoded.split("\n").slice(0, 120).join("\n")
    };
  });
}

export async function analyzeRepository(repoUrl: string) {
  const { owner, repo } = extractRepoInfo(repoUrl);

  const metadata = await getRepoMetadata(owner, repo);

  const defaultBranch = metadata.default_branch;

  const [readme, dependencies, tree] = await Promise.all([
    getReadme(owner, repo),
    getPackageJson(owner, repo),
    getRepoTree(owner, repo, defaultBranch)
  ]);

  const importantFiles = selectImportantFiles(tree);

  const files = await getFilesContent(owner, repo, importantFiles);

  return {
    repoName: repo,
    description: metadata.description,
    readme,
    dependencies,
    files
  };
}