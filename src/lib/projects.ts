import { type Project, projects } from "@/data/projects";

export { projectOrder } from "@/lib/order";

/**
 * Retrieves the markdown content of a project by its identifier.
 *
 * @param projectId - The unique project identifier
 * @returns The project markdown content, or null if not found
 */
export function getProjectContent(projectId: string): string | null {
    const project = projects.find((p) => p.id === projectId);
    return project?.content ?? null;
}

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