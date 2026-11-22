import { Badge } from "@/components/ui/badge";
import { MetaBadges } from "@/components/ui/meta";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status";
import { Tags } from "@/components/ui/tags";
import { Tile } from "@/components/ui/tile";
import { type Project } from "@/data/projects";
import { useApi } from "@/hooks/api";
import { useStatus } from "@/hooks/status";

interface ProjectCardProps {
    project: Project;
    onOpen: (project: Project) => void;
}

/**
 * Clickable project card of the home grid and the Projets list. It reads the live version and
 * status of the project itself, and the version badge links to the latest release when it has one.
 *
 * @param props - Component props
 * @param props.project - Project to display
 * @param props.onOpen - Called with the project when the card is clicked
 * @returns The rendered project card
 */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
    const { versions, loading } = useApi();
    const status = useStatus()(project.id);
    const version = versions?.[project.id];
    const href = project.npm ?? (project.github ? `${project.github}/releases/latest` : undefined);
    const badge = (
        <Badge className="py-0 text-xs font-normal" variant="outline">
            {version}
        </Badge>
    );

    return (
        <Tile
            asChild
            status={status}
            inactive={project.archived || project.paused}
            className="relative gap-2 text-left hover:cursor-pointer"
        >
            <button onClick={() => onOpen(project)}>
                {status && (
                    <StatusBadge
                        status={status}
                        github={project.github}
                        npm={project.npm}
                        name={project.name}
                    />
                )}

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <div className="flex gap-1">
                        {loading ? (
                            <Skeleton className="h-5 w-10" />
                        ) : version ? (
                            href ? (
                                <a
                                    href={href}
                                    aria-label={`Version ${version} de ${project.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {badge}
                                </a>
                            ) : (
                                badge
                            )
                        ) : null}
                        <MetaBadges project={project} variant="compact" />
                    </div>
                </div>
                <span className="line-clamp-2 text-xs text-muted-foreground">
                    {project.description}
                </span>
                <Tags tags={project.tags} />
            </button>
        </Tile>
    );
}
