"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Meta } from "@/components/ui/meta";
import { ProjectLinks } from "@/components/ui/links";
import type { Project } from "@/data/projects";
import type { ProjectStatus } from "@/hooks/status";
import { hasProjectContent } from "@/lib/projects";

interface CardDialogProps {
    project: Project | null;
    version?: string;
    status?: ProjectStatus;
    onOpenChange: (open: boolean) => void;
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
export function CardDialog({ project, version, status, onOpenChange }: CardDialogProps) {
    return (
        <Dialog open={!!project} onOpenChange={() => onOpenChange(false)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 flex-wrap">
                        {project?.name}
                        <Meta version={version} status={status} project={project} />
                    </DialogTitle>
                    <DialogDescription className="text-left">
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
                    {project && <ProjectLinks project={project} />}
                    {project && hasProjectContent(project.id) && (
                        <Button size="sm" variant="secondary" asChild>
                            <Link href={`/projet/${project.id}`}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                En savoir plus
                            </Link>
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}