"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ExternalLink,
    Github,
    Package,
    FolderCode,
    ArrowRight,
    Archive,
    Clock,
    BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tags } from "@/components/ui/tags";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { projects, type Project } from "@/data/projects";
import { ProjectDetailModal } from "@/components/detail";
import { getProjectContent, hasProjectContent } from "@/lib/projects";
import { useApi, getApiKey } from "@/hooks/api";

const PREVIEW_COUNT = 8;

export function Projects() {
    const { versions } = useApi();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const getVersion = (projectId: string): string | undefined => {
        if (!versions) return undefined;
        const apiKey = getApiKey(projectId);
        return versions[apiKey];
    };

    // Detail modal state
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailProject, setDetailProject] = useState<Project | null>(null);

    const handleOpenDetail = (project: Project) => {
        setDetailProject(project);
        setSelectedProject(null);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setDetailProject(null);
    };

    const previewProjects = projects.slice(0, PREVIEW_COUNT);

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <FolderCode className="h-4 w-4 text-primary"/>
                            Projets
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {projects.length} projets
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
                    {previewProjects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`relative flex flex-col gap-2 rounded-lg border p-3 text-left card-hover hover:cursor-pointer ${
                                project.featured
                                    ? "gradient-border glow-hover"
                                    : "transition-colors hover:bg-muted/50"
                            } ${project.archived || project.paused ? "opacity-60" : ""}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {project.name}
                                </span>
                                <div className="flex gap-1">
                                    {getVersion(project.id) && (
                                        <Badge className="py-0 text-xs font-normal" variant="outline">
                                            {getVersion(project.id)}
                                        </Badge>
                                    )}
                                    {project.archived && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="secondary" className="py-0 text-xs">
                                                    <Archive className="h-3 w-3"/>
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Ce projet n'est plus maintenu
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                    {project.paused && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge className="py-0 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                    <Clock className="h-3 w-3"/>
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Travail en pause
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                            <span className="line-clamp-2 text-xs text-muted-foreground">
                                {project.description}
                            </span>
                            <Tags tags={project.tags} />
                        </button>
                    ))}
                </CardContent>
                {projects.length > PREVIEW_COUNT && (
                    <div className="flex justify-center pb-4">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/repositories">
                                Voir tout ({projects.length - PREVIEW_COUNT} de plus)
                                <ArrowRight className="ml-1 h-4 w-4"/>
                            </Link>
                        </Button>
                    </div>
                )}
            </Card>

            {/* Quick preview modal */}
            <Dialog
                open={!!selectedProject}
                onOpenChange={() => setSelectedProject(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedProject?.name}
                            {selectedProject && getVersion(selectedProject.id) && (
                                <Badge variant="outline" className="text-xs">
                                    {getVersion(selectedProject.id)}
                                </Badge>
                            )}
                            {selectedProject?.archived && (
                                <Badge variant="secondary" className="text-xs">
                                    <Archive className="mr-1 h-3 w-3"/>
                                    Archivé
                                </Badge>
                            )}
                            {selectedProject?.paused && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                >
                                    <Clock className="mr-1 h-3 w-3"/>
                                    WIP
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedProject?.longDescription ||
                                selectedProject?.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-wrap gap-2">
                        {selectedProject?.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                        {selectedProject?.github && (
                            <Button asChild size="sm" variant="outline">
                                <a
                                    href={selectedProject.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="mr-2 h-4 w-4"/>
                                    GitHub
                                </a>
                            </Button>
                        )}
                        {selectedProject?.demo && (
                            <Button asChild size="sm" variant="default">
                                <a
                                    href={selectedProject.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4"/>
                                    Démo
                                </a>
                            </Button>
                        )}
                        {selectedProject?.npm && (
                            <Button asChild size="sm" variant="outline">
                                <a
                                    href={selectedProject.npm}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Package className="mr-2 h-4 w-4"/>
                                    NPM
                                </a>
                            </Button>
                        )}
                        {selectedProject &&
                            hasProjectContent(selectedProject.id) && (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                    handleOpenDetail(selectedProject)
                                }
                            >
                                <BookOpen className="mr-2 h-4 w-4"/>
                                En savoir plus
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Full documentation modal */}
            <ProjectDetailModal
                project={detailProject}
                content={detailProject ? getProjectContent(detailProject.id) : null}
                open={detailOpen}
                onOpenChange={(open) => {
                    if (!open) handleCloseDetail();
                }}
            />
        </>
    );
}