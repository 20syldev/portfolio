import { BookCheck, ExternalLink, Github, Newspaper, Package } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

interface LinksProps {
    project: Project;
    className?: string;
    extra?: React.ReactNode;
}

/**
 * Renders external link buttons (GitHub, Demo, Article, NPM, Guide complet) for a project.
 *
 * @param props - Component props
 * @param props.project - Project with optional github, demo, article, npm and docs fields
 * @param props.className - Optional wrapper class
 * @param props.extra - Optional extra button(s) appended after the project links
 * @returns The rendered link buttons
 */
export function Links({ project, className, extra }: LinksProps) {
    return (
        <div className={className ?? "flex flex-wrap gap-2"}>
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
            {project.article && (
                <Button asChild size="sm" variant="outline">
                    <a href={project.article} target="_blank" rel="noopener noreferrer">
                        <Newspaper className="mr-2 h-4 w-4" />
                        Article
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
            {project.docs && (
                <Button asChild size="sm" variant="default">
                    <Link href={`/help/${project.docs}`}>
                        <BookCheck className="mr-2 h-4 w-4" />
                        Guide complet
                    </Link>
                </Button>
            )}
            {extra}
        </div>
    );
}