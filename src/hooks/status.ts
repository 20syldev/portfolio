import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";

export type ProjectStatus = "new" | "patched" | "updated" | "wip" | null;

/**
 * Hook to get the status of a project (new, patched, updated, wip).
 *
 * @returns A function that takes a project ID and returns its status
 */
export function useStatus() {
    const { newProjects, patchedProjects, updatedProjects, wipProjects } = useApi();

    return (projectId: string): ProjectStatus => {
        const apiKey = getApiKey(projectId);
        if (newProjects.includes(apiKey)) return "new";
        if (patchedProjects.includes(apiKey)) return "patched";
        if (updatedProjects.includes(apiKey)) return "updated";
        if (wipProjects.includes(apiKey)) return "wip";
        return null;
    };
}