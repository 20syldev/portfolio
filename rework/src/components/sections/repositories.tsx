import { Star, GitFork, ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRepositories, getLanguageColor } from "@/lib/github";

export async function Repositories() {
    const repos = await getRepositories();
    const displayRepos = repos.slice(0, 6);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-primary" />
                        Repositories
                    </span>
                    <a
                        href="https://github.com/20syldev?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary"
                    >
                        Voir tout →
                    </a>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
                {displayRepos.map((repo) => (
                    <div
                        key={repo.id}
                        className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-center justify-between">
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium hover:text-primary hover:underline"
                            >
                                {repo.name}
                            </a>
                            {repo.homepage && (
                                <a
                                    href={repo.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                            {repo.description || "Pas de description"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {repo.language && (
                                <span className="flex items-center gap-1">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor: getLanguageColor(repo.language),
                                        }}
                                    />
                                    {repo.language}
                                </span>
                            )}
                            {repo.stargazers_count > 0 && (
                                <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {repo.stargazers_count}
                                </span>
                            )}
                            {repo.forks_count > 0 && (
                                <span className="flex items-center gap-1">
                                    <GitFork className="h-3 w-3" />
                                    {repo.forks_count}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}