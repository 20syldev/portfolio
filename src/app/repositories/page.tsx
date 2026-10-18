"use client";

import { ArrowLeft, ArrowRight, GitPullRequest } from "lucide-react";
import Link from "next/link";

import { CardDialog } from "@/components/dialogs/card";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetaBadges } from "@/components/ui/meta";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status";
import { Tags } from "@/components/ui/tags";
import { projects as alternanceProjects } from "@/data/alternance";
import { type Project, projects } from "@/data/projects";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useCard } from "@/hooks/card";
import { useSmoothScroll } from "@/hooks/scroll";
import { useStatus } from "@/hooks/status";
import { tabs, urls } from "@/lib/nav";

const personalProjects = projects.filter((p) => !p.work);
const workProjects = projects.filter((p) => p.work);

const projectIds = new Set(projects.map((p) => p.id));

// Work-study entries without a project page of their own, only listed on /alternance
const alternanceOnly = alternanceProjects
    .filter((p) => !p.projectId && !projectIds.has(p.id))
    .map((p) => p.title.split(" - ")[0]);

interface RepositoriesPageProps {
    initialProjectId?: string;
}

/**
 * Full repositories listing page with project cards and detail dialogs.
 *
 * @param props - Page props
 * @param props.initialProjectId - Optional project ID to open on load
 * @returns The rendered repositories page
 */
export default function RepositoriesPage({ initialProjectId }: RepositoriesPageProps) {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();
    const { versions, loading } = useApi();
    const getProjectStatus = useStatus();
    const { project: selected, open, close } = useCard(initialProjectId);
    const getVersion = (projectId: string): string | undefined => {
        if (!versions) return undefined;
        const apiKey = getApiKey(projectId);
        return versions[apiKey];
    };

    const renderProject = (project: Project) => {
        const status = getProjectStatus(project.id);

        return (
            <button
                key={project.id}
                data-status={status ?? undefined}
                onClick={() => open(project)}
                className={`relative flex flex-col gap-2 rounded-lg p-4 text-left card-hover hover:cursor-pointer ${
                    status
                        ? "gradient-border glow-hover"
                        : "border bg-card transition-colors hover:bg-muted/50"
                } ${project.archived || project.paused ? "inactive" : ""}`}
            >
                {status && (
                    <StatusBadge status={status} github={project.github} npm={project.npm} />
                )}

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <div className="flex gap-1">
                        {loading ? (
                            <Skeleton className="h-5 w-10" />
                        ) : getVersion(project.id) ? (
                            project.npm || project.github ? (
                                <a
                                    href={project.npm ?? `${project.github}/releases/latest`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Badge
                                        className="py-0 text-xs font-normal hover:bg-muted transition-colors"
                                        variant="outline"
                                    >
                                        {getVersion(project.id)}
                                    </Badge>
                                </a>
                            ) : (
                                <Badge className="py-0 text-xs font-normal" variant="outline">
                                    {getVersion(project.id)}
                                </Badge>
                            )
                        ) : null}
                        <MetaBadges project={project} variant="compact" />
                    </div>
                </div>
                <span className="line-clamp-2 text-xs text-muted-foreground">
                    {project.description}
                </span>
                <Tags tags={project.tags} />
            </button>
        );
    };

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/contributions">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <GitPullRequest className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Projets personnels</h1>
                    <p className="text-xl text-muted-foreground">
                        {personalProjects.length} projets
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {personalProjects.map(renderProject)}
                </div>

                <section id="zenetys" className="mt-16">
                    <div className="mb-12 text-center">
                        <h2 className="mb-2 text-4xl font-bold">Zenetys</h2>
                        <p className="text-xl text-muted-foreground">
                            {workProjects.length} projets réalisés en alternance
                            {alternanceOnly.length > 0 &&
                                `, et ${alternanceOnly.length} autres sur la page alternance`}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {workProjects.map(renderProject)}
                        {alternanceOnly.length > 0 && (
                            <Link
                                href="/alternance"
                                className="flex flex-col gap-2 rounded-lg border border-dashed bg-card p-4 text-left card-hover transition-colors hover:bg-muted/50"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Et en alternance</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="line-clamp-3 text-xs text-muted-foreground">
                                    {new Intl.ListFormat("fr", {
                                        style: "long",
                                        type: "conjunction",
                                    }).format(alternanceOnly)}{" "}
                                    : à retrouver en détail sur la page alternance.
                                </span>
                            </Link>
                        )}
                    </div>
                </section>
            </main>
            <Footer />

            <CardDialog
                project={selected}
                version={selected ? getVersion(selected.id) : undefined}
                status={selected ? getProjectStatus(selected.id) : null}
                onOpenChange={close}
            />
        </div>
    );
}