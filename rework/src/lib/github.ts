export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    updated_at: string;
    fork: boolean;
}

export async function getRepositories(
    username: string = "20syldev"
): Promise<GitHubRepo[]> {
    try {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
                next: { revalidate: 3600 },
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch repositories");
        }

        const repos: GitHubRepo[] = await res.json();
        return repos.filter((repo) => !repo.fork);
    } catch (error) {
        console.error("Error fetching GitHub repos:", error);
        return [];
    }
}

export function getLanguageColor(language: string | null): string {
    const colors: Record<string, string> = {
        JavaScript: "#f7df1e",
        TypeScript: "#3178c6",
        Python: "#3572A5",
        HTML: "#e34c26",
        CSS: "#563d7c",
        PHP: "#4F5D95",
        Shell: "#89e051",
        Vue: "#41b883",
        "C#": "#178600",
        Java: "#b07219",
    };
    return colors[language || ""] || "#6e7681";
}