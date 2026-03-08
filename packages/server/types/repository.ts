export interface RepoFile {
    path: string;
    content: string;
}

export interface RepoAnalysis {
    repoName: string;
    description: string;
    readme: string;
    dependencies: Record<string, string>;
    files: RepoFile[];
}