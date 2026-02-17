"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CardDialog } from "@/components/dialogs/card";
import { Badge } from "@/components/ui/badge";
import { ProjectBadges } from "@/components/ui/flags";
import { StatusBadge, useProjectStatus } from "@/components/ui/status";
import { Tags } from "@/components/ui/tags";
import { type Project, projects } from "@/data/projects";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useProjectDetail } from "@/hooks/detail";

/** Card height in pixels for row calculation */
const CARD_HEIGHT = 124;

/**
 * Hook to calculate optimal grid layout based on viewport.
 * Dynamically adjusts columns and rows for any screen size.
 */
function useProjectGrid() {
    const [grid, setGrid] = useState({ cols: 4, rows: 2, count: 8 });

    useEffect(() => {
        const calculate = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Columns based on viewport width
            let cols: number;
            let headerOffset: number;

            if (width < 640) {
                // Mobile: single column
                cols = 1;
                headerOffset = 300;
            } else if (width < 1024) {
                // Tablet (sm/md): 2 columns
                cols = 2;
                headerOffset = 260;
            } else {
                // Desktop (lg+): 4 columns
                cols = 4;
                headerOffset = 240;
            }

            // Rows based on available height
            const availableHeight = height - headerOffset;
            let rows = Math.floor(availableHeight / CARD_HEIGHT);

            // Clamp rows based on layout
            const maxRows = cols === 1 ? 5 : 4;
            const minRows = cols === 1 ? 3 : 2;
            rows = Math.min(maxRows, Math.max(minRows, rows));

            setGrid({ cols, rows, count: cols * rows });
        };

        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, []);

    return grid;
}

/**
 * Projects display section.
 * Dynamic grid that adapts columns and rows based on viewport dimensions.
 *
 * @returns The rendered projects grid section
 */
export function Projects() {
    const { versions } = useApi();
    const getProjectStatus = useProjectStatus();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { cols, count } = useProjectGrid();

    const getVersion = (projectId: string): string | undefined => {
        if (!versions) return undefined;
        const apiKey = getApiKey(projectId);
        return versions[apiKey];
    };

    const { openProject } = useProjectDetail();

    const handleOpenDetail = (project: Project) => {
        setSelectedProject(null);
        openProject(project.id);
    };

    const previewProjects = projects.slice(0, count);

    return (
        <>
            <div className="flex h-full flex-col px-4 overflow-y-hidden">
                <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-6 overflow-y-auto scrollbar-none">
                    <div
                        className="grid w-full max-w-7xl gap-4 stagger-children px-2"
                        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                    >
                        {previewProjects.map((project) => {
                            const status = getProjectStatus(project.id);
                            const hasGradient = status === "new" || status === "updated";

                            return (
                                <button
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className={`flex relative flex-col gap-2 rounded-lg p-4 text-left card-hover hover:cursor-pointer ${
                                        hasGradient
                                            ? "gradient-border glow-hover"
                                            : "border bg-card transition-colors hover:bg-muted/50"
                                    } ${project.archived || project.paused ? "inactive" : ""}`}
                                >
                                    {/* Status Badge */}
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
                    <Link
                        href="/repositories"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Voir tous les projets
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <CardDialog
                project={selectedProject}
                version={selectedProject ? getVersion(selectedProject.id) : undefined}
                status={selectedProject ? getProjectStatus(selectedProject.id) : null}
                onOpenChange={() => setSelectedProject(null)}
                onOpenDetail={handleOpenDetail}
            />
        </>
    );
}