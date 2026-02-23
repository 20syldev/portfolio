import { useApi } from "@/hooks/api";

export type ProjectStatus = "new" | "updated" | "patched" | null;

/**
 * Hook to get the status of a project (new, updated, patched).
 *
 * @returns A function that takes a project ID and returns its status
 */
export function useProjectStatus() {
    const { newProjects, updatedProjects, patchedProjects } = useApi();

    return (projectId: string): ProjectStatus => {
        if (newProjects.includes(projectId)) return "new";
        if (updatedProjects.includes(projectId)) return "updated";
        if (patchedProjects.includes(projectId)) return "patched";
        return null;
    };
}