import { BookCheck, ExternalLink, Github, Package } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

interface LinksProps {
    project: Project;
    className?: string;
}

/**
 * Renders external link buttons (GitHub, Demo, NPM, Guide complet) for a project.
 *
 * @param props - Component props
 * @param props.project - Project with optional github, demo, npm and docs fields
 * @param props.className - Optional wrapper class
 * @returns The rendered link buttons
 */
export function Links({ project, className }: LinksProps) {
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
        </div>
    );
}