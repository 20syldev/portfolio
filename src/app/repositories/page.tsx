"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Archive,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Clock,
    ExternalLink,
    Github,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { projects, type Project } from "@/data/projects";
import { ProjectDetailModal } from "@/components/detail";
import { getProjectContent, hasProjectContent } from "@/lib/projects";
import { useApi, getApiKey } from "@/hooks/api";

export default function RepositoriesPage() {
    const { versions } = useApi();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailProject, setDetailProject] = useState<Project | null>(null);

    const getVersion = (projectId: string): string | undefined => {
        if (!versions) return undefined;
        const apiKey = getApiKey(projectId);
        return versions[apiKey];
    };

    const handleOpenDetail = (project: Project) => {
        setDetailProject(project);
        setSelectedProject(null);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setDetailProject(null);
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header/>
            <main className="container mx-auto flex-1 px-4 py-12">
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                </Link>
                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold flex items-center justify-center gap-3">
                        Projets personnels
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {projects.length} projets
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {projects.map((project) => (
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
                            <div className="flex flex-wrap gap-1">
                                {project.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs px-1.5 py-0"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
                <Link href="/alternance" className="mt-12 flex justify-end">
                    <Button variant="ghost">
                        Voir mes projets d'alternance
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </Link>
            </main>
            <Footer/>

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
                                    Archiv&eacute;
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
                                    D&eacute;mo
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
        </div>
    );
}