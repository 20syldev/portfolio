import { type Project, projects } from "@/data/projects";

export function getProjectContent(projectId: string): string | null {
    const project = projects.find((p) => p.id === projectId);
    return project?.content ?? null;
}

export function hasProjectContent(projectId: string): boolean {
    const project = projects.find((p) => p.id === projectId);
    return project?.hasContent ?? false;
}

export function getProject(projectId: string): Project | undefined {
    return projects.find((p) => p.id === projectId);
}