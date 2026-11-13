import { type StatusName, useApi } from "@/hooks/api";

export type ProjectStatus = StatusName | null;

/**
 * Hook to get the status of a project (new, patched, updated, wip).
 *
 * @returns A function that takes a project ID and returns its status
 */
export function useStatus() {
    const { statuses } = useApi();
    return (projectId: string): ProjectStatus => statuses[projectId] ?? null;
}
