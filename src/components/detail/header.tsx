"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectMeta } from "@/components/ui/flags";
import { ProjectLinks } from "@/components/ui/links";
import type { Project } from "@/data/projects";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useProjectStatus } from "@/hooks/status";

interface DetailHeaderProps {
    project: Project | null;
    onClose: () => void;
}

/**
 * Project detail modal header.
 * Displays name, status badges, description, tags and external links.
 *
 * @param props - Component props
 * @param props.project - Project to display
 * @param props.onClose - Callback to close modal
 * @returns The rendered header, or null if no project
 */
export function DetailHeader({ project, onClose }: DetailHeaderProps) {
    const { versions } = useApi();
    const getProjectStatus = useProjectStatus();
    const version = project ? versions?.[getApiKey(project.id)] : null;

    if (!project) return null;

    return (
        <header className="flex-shrink-0 border-b border-border pb-4 mb-0">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-bold">{project.name}</h2>
                        <ProjectMeta
                            version={version}
                            status={getProjectStatus(project.id)}
                            project={project}
                        />
                    </div>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="flex-shrink-0 -mt-1 -mr-2"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fermer</span>
                </Button>
            </div>
            <ProjectLinks project={project} className="flex flex-wrap gap-2 mt-4" />
        </header>
    );
}