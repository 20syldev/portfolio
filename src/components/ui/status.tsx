import { RefreshCw, Sparkles, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

interface StatusBadgeProps {
    status: ProjectStatus;
    variant?: "absolute" | "inline";
}

const config = {
    new: {
        label: "Nouveau",
        icon: Sparkles,
        className: "badge-new text-white",
    },
    updated: {
        label: "Mis à jour",
        icon: RefreshCw,
        className: "badge-updated text-white",
    },
    patched: {
        label: "Patché",
        icon: Wrench,
        className: "badge-patched",
    },
};

/**
 * Displays a colored badge indicating the project status (new, updated, patched).
 *
 * @param props - Component props
 * @param props.status - Project status to display
 * @param props.variant - Display variant: "absolute" for overlay positioning, "inline" for flow (default: "absolute")
 * @returns The rendered status badge, or null if no status
 */
export function StatusBadge({ status, variant = "absolute" }: StatusBadgeProps) {
    if (!status) return null;

    const cfg = config[status];
    const Icon = cfg.icon;

    const badge = (
        <Badge className={`gap-1 text-xs ${cfg.className}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
        </Badge>
    );

    if (variant === "inline") return badge;
    return <div className="absolute right-2 -top-[13px]">{badge}</div>;
}