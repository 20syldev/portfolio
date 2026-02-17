"use client";

import { ExternalLink, Github, Package } from "lucide-react";

import { DetailContent } from "@/components/detail/content";
import { DetailNav } from "@/components/detail/nav";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectMeta } from "@/components/ui/flags";
import { useProjectStatus } from "@/components/ui/status";
import type { Project } from "@/data/projects";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

interface DocProps {
    project: Project;
    content: string;
}

/**
 * Full-page project documentation layout with header, sidebar navigation and markdown content.
 *
 * @param props - Component props
 * @param props.project - Project data
 * @param props.content - Markdown content to render
 * @returns The rendered documentation page
 */
export function Doc({ project, content }: DocProps) {
    const { scrollRef, scrollTo } = useSmoothScroll<HTMLDivElement>();
    const { versions } = useApi();
    const getProjectStatus = useProjectStatus();
    const version = versions?.[getApiKey(project.id)];

    return (
        <div
            ref={scrollRef}
            className="h-dvh overflow-x-hidden overflow-y-auto scrollbar-none flex flex-col"
        >
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            {/* Project Header */}
            <div className="border-b pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold">{project.name}</h1>
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
                        <div className="hidden sm:flex flex-wrap gap-2">
                            {project.github && (
                                <Button asChild size="sm" variant="outline">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="mr-2 h-4 w-4" />
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
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Démo
                                    </a>
                                </Button>
                            )}
                            {project.npm && (
                                <Button asChild size="sm" variant="outline">
                                    <a href={project.npm} target="_blank" rel="noopener noreferrer">
                                        <Package className="mr-2 h-4 w-4" />
                                        NPM
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                    {/* Mobile links */}
                    <div className="flex sm:hidden flex-wrap gap-2 mt-4">
                        {project.github && (
                            <Button asChild size="sm" variant="outline">
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 h-4 w-4" />
                                    GitHub
                                </a>
                            </Button>
                        )}
                        {project.demo && (
                            <Button asChild size="sm" variant="default">
                                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Démo
                                </a>
                            </Button>
                        )}
                        {project.npm && (
                            <Button asChild size="sm" variant="outline">
                                <a href={project.npm} target="_blank" rel="noopener noreferrer">
                                    <Package className="mr-2 h-4 w-4" />
                                    NPM
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto flex flex-1 w-full">
                {/* Desktop sidebar */}
                <DetailNav
                    className="hidden md:flex sticky top-16 h-[calc(100vh-4rem)] border-r-0"
                    scrollContainerRef={scrollRef}
                    scrollTo={scrollTo}
                    content={content}
                />

                {/* Main content */}
                <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 md:py-6">
                    {/* Mobile navigation */}
                    <DetailNav
                        className="md:hidden sticky top-16 z-10 -mx-6 mb-6"
                        mobile
                        scrollContainerRef={scrollRef}
                        scrollTo={scrollTo}
                        content={content}
                    />

                    <DetailContent content={content} />
                </main>
            </div>

            <Footer />
        </div>
    );
}