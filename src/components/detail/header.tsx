"use client";

import { ExternalLink, Github, Package, Archive, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

interface ProjectDetailHeaderProps {
    project: Project | null;
    onClose: () => void;
}

export function ProjectDetailHeader({
    project,
    onClose,
}: ProjectDetailHeaderProps) {
    if (!project) return null;

    return (
        <header className="flex-shrink-0 border-b border-border pb-4 mb-0">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-2xl font-bold">{project.name}</h2>
                        {project.archived && (
                            <Badge
                                variant="secondary"
                                className="text-xs gap-1"
                            >
                                <Archive className="h-3 w-3"/>
                                Archivé
                            </Badge>
                        )}
                        {project.paused && (
                            <Badge
                                variant="secondary"
                                className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1"
                            >
                                <Clock className="h-3 w-3"/>
                                WIP
                            </Badge>
                        )}
                        {project.version && (
                            <Badge variant="outline" className="text-xs">
                                v{project.version}
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                            >
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
                    <X className="h-5 w-5"/>
                    <span className="sr-only">Fermer</span>
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {project.github && (
                    <Button asChild size="sm" variant="outline">
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="mr-2 h-4 w-4"/>
                            GitHub
                        </a>
                    </Button>
                )}
                {project.demo && (
                    <Button asChild size="sm" variant="default">
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 h-4 w-4"/>
                            Démo
                        </a>
                    </Button>
                )}
                {project.npm && (
                    <Button asChild size="sm" variant="outline">
                        <a
                            href={project.npm}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Package className="mr-2 h-4 w-4"/>
                            NPM
                        </a>
                    </Button>
                )}
            </div>
        </header>
    );
}