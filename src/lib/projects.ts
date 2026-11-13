import { type Project, projects } from "@/data/projects";
import type { ProjectStatus } from "@/hooks/status";

export { projectOrder } from "@/lib/order";

/**
 * Checks whether a project has associated markdown content.
 *
 * @param projectId - The unique project identifier
 * @returns True if the project has content, false otherwise
 */
export function hasProjectContent(projectId: string): boolean {
    const project = projects.find((p) => p.id === projectId);
    return project?.hasContent ?? false;
}

/**
 * Builds the internal URL of a project: its page when it has content, its card otherwise.
 *
 * @param project - The project to link to
 * @returns The project page or card pathname
 */
export function projectPath(project: Project): string {
    return project.hasContent ? `/projet/${project.id}` : `/card/${project.id}/`;
}

/**
 * Finds a project by its identifier.
 *
 * @param projectId - The unique project identifier
 * @returns The matching project, or undefined if not found
 */
export function getProject(projectId: string): Project | undefined {
    return projects.find((p) => p.id === projectId);
}

// Order of the statuses on the featured grid, anything without one comes after them
const statusRank: Record<string, number> = { new: 0, updated: 1, patched: 2, wip: 3 };

/**
 * Puts the projects that carry a status first: new, then updated, then patched, then in progress.
 * The sort is stable, so the curated order still decides between two projects of the same rank,
 * and an archived project stays last whatever its status.
 *
 * @param list - Projects in their curated order
 * @param getStatus - Returns the status of a project from its identifier
 * @returns A new list, sorted by status rank
 */
export function sortByStatus(
    list: Project[],
    getStatus: (projectId: string) => ProjectStatus
): Project[] {
    const rank = (project: Project) => {
        if (project.archived) return Number.MAX_SAFE_INTEGER;
        return statusRank[getStatus(project.id) ?? ""] ?? Object.keys(statusRank).length;
    };
    return [...list].sort((a, b) => rank(a) - rank(b));
}
