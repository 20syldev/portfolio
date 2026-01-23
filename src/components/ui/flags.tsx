import { Archive, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { type ProjectStatus, StatusBadge } from "@/components/ui/status";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Project } from "@/data/projects";

type ProjectLike = Pick<Project, "archived" | "paused">;

interface ProjectMetaProps {
    version?: string | null;
    status?: ProjectStatus | null;
    project?: ProjectLike | null;
}

/**
 * Unified component for project metadata badges.
 * Centralizes version, status and project flags with consistent spacing.
 */
export function ProjectMeta({ version, status, project }: ProjectMetaProps) {
    return (
        <div className="flex items-center gap-1">
            {version && (
                <Badge variant="outline" className="text-xs">
                    {version}
                </Badge>
            )}
            <StatusBadge status={status ?? null} variant="inline" />
            <ProjectBadges project={project} />
        </div>
    );
}

interface ProjectBadgesProps {
    project: ProjectLike | null | undefined;
    variant?: "full" | "compact";
}

/**
 * Renders status badges for archived/paused projects.
 * - full: Badge with icon and text (for headers/dialogs)
 * - compact: Icon-only badge with tooltip (for grid cards)
 */
export function ProjectBadges({ project, variant = "full" }: ProjectBadgesProps) {
    if (!project?.archived && !project?.paused) return null;

    const { archived, paused } = project;

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-2">
                {archived && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant="secondary" className="text-xs">
                                <Archive className="h-3 w-3" />
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Ce projet n'est plus maintenu</TooltipContent>
                    </Tooltip>
                )}
                {paused && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Clock className="h-3 w-3" />
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Travail en pause</TooltipContent>
                    </Tooltip>
                )}
            </div>
        );
    }

    return (
        <>
            {archived && (
                <Badge variant="secondary" className="text-xs gap-1">
                    <Archive className="h-2.5 w-2.5" />
                    Archivé
                </Badge>
            )}
            {paused && (
                <Badge
                    variant="secondary"
                    className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1"
                >
                    <Clock className="h-2.5 w-2.5" />
                    En pause
                </Badge>
            )}
        </>
    );
}