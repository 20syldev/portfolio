"use client";

import { BookOpen, ExternalLink, Github, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProjectMeta } from "@/components/ui/flags";
import type { ProjectStatus } from "@/components/ui/status";
import type { Project } from "@/data/projects";
import { hasProjectContent } from "@/lib/projects";

interface CardDialogProps {
    project: Project | null;
    version?: string;
    status?: ProjectStatus;
    onOpenChange: (open: boolean) => void;
    onOpenDetail?: (project: Project) => void;
}

/**
 * Project card dialog displaying project details, links and documentation access.
 *
 * @param props - Component props
 * @param props.project - Project to display, or null to close
 * @param props.version - Optional version string
 * @param props.status - Optional project status badge
 * @param props.onOpenChange - Callback when dialog open state changes
 * @param props.onOpenDetail - Optional callback to open full project detail
 * @returns The rendered card dialog
 */
export function CardDialog({
    project,
    version,
    status,
    onOpenChange,
    onOpenDetail,
}: CardDialogProps) {
    return (
        <Dialog open={!!project} onOpenChange={() => onOpenChange(false)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 flex-wrap">
                        {project?.name}
                        <ProjectMeta version={version} status={status} project={project} />
                    </DialogTitle>
                    <DialogDescription>
                        {project?.longDescription || project?.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap gap-1">
                    {project?.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                    {project?.github && (
                        <Button asChild size="sm" variant="outline">
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" />
                                GitHub
                            </a>
                        </Button>
                    )}
                    {project?.demo && (
                        <Button asChild size="sm" variant="default">
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Démo
                            </a>
                        </Button>
                    )}
                    {project?.npm && (
                        <Button asChild size="sm" variant="outline">
                            <a href={project.npm} target="_blank" rel="noopener noreferrer">
                                <Package className="mr-2 h-4 w-4" />
                                NPM
                            </a>
                        </Button>
                    )}
                    {project && hasProjectContent(project.id) && onOpenDetail && (
                        <Button size="sm" variant="secondary" onClick={() => onOpenDetail(project)}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            En savoir plus
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}