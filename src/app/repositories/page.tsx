"use client";

import { ArrowLeft, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CardDialog } from "@/components/card";
import { ContributionsDialog } from "@/components/contributions";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectBadges } from "@/components/ui/flags";
import { StatusBadge, useProjectStatus } from "@/components/ui/status";
import { Tags } from "@/components/ui/tags";
import { type Project, projects } from "@/data/projects";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useProjectDetail } from "@/hooks/detail";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

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
    const { versions } = useApi();
    const getProjectStatus = useProjectStatus();
    const initialProject = initialProjectId
        ? projects.find((p) => p.id === initialProjectId)
        : null;
    const [selectedProject, setSelectedProject] = useState<Project | null>(initialProject ?? null);
    const [showContributions, setShowContributions] = useState(false);
    const { openProject } = useProjectDetail();

    const getVersion = (projectId: string): string | undefined => {
        if (!versions) return undefined;
        const apiKey = getApiKey(projectId);
        return versions[apiKey];
    };

    const handleOpenDetail = (project: Project) => {
        setSelectedProject(null);
        openProject(project.id, {
            onClose: initialProjectId ? () => setSelectedProject(project) : undefined,
        });
    };

    return (
        <div ref={scrollRef} className="h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="container mx-auto px-4 pt-24 pb-12">
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
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowContributions(true)}
                    >
                        <GitPullRequest className="h-4 w-4" />
                    </Button>
                </div>
                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Projets personnels</h1>
                    <p className="text-xl text-muted-foreground">{projects.length} projets</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {projects.map((project) => {
                        const status = getProjectStatus(project.id);
                        const hasGradient = status === "new" || status === "updated";

                        return (
                            <button
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={`relative flex flex-col gap-2 rounded-lg p-4 text-left card-hover hover:cursor-pointer ${
                                    hasGradient
                                        ? "gradient-border glow-hover"
                                        : "border bg-card transition-colors hover:bg-muted/50"
                                } ${project.archived || project.paused ? "inactive" : ""}`}
                            >
                                {status && <StatusBadge status={status} />}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{project.name}</span>
                                    <div className="flex gap-1">
                                        {getVersion(project.id) && (
                                            <Badge
                                                className="py-0 text-xs font-normal"
                                                variant="outline"
                                            >
                                                {getVersion(project.id)}
                                            </Badge>
                                        )}
                                        <ProjectBadges project={project} variant="compact" />
                                    </div>
                                </div>
                                <span className="line-clamp-2 text-xs text-muted-foreground">
                                    {project.description}
                                </span>
                                <Tags tags={project.tags} />
                            </button>
                        );
                    })}
                </div>
            </main>
            <Footer />

            <CardDialog
                project={selectedProject}
                version={selectedProject ? getVersion(selectedProject.id) : undefined}
                status={selectedProject ? getProjectStatus(selectedProject.id) : null}
                onOpenChange={() => setSelectedProject(null)}
                onOpenDetail={handleOpenDetail}
            />

            <ContributionsDialog open={showContributions} onOpenChange={setShowContributions} />
        </div>
    );
}