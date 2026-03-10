"use client";

import { DocumentationLayout } from "@/components/detail/layout";
import { Badge } from "@/components/ui/badge";
import { ProjectMeta } from "@/components/ui/flags";
import { ProjectLinks } from "@/components/ui/links";
import type { Project } from "@/data/projects";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useProjectStatus } from "@/hooks/status";

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
    const { versions } = useApi();
    const getProjectStatus = useProjectStatus();
    const version = versions?.[getApiKey(project.id)];

    const header = (
        <>
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
                <ProjectLinks project={project} className="hidden sm:flex flex-wrap gap-2" />
            </div>
            {/* Mobile links */}
            <ProjectLinks project={project} className="flex sm:hidden flex-wrap gap-2 mt-4" />
        </>
    );

    return <DocumentationLayout header={header} content={content} />;
}