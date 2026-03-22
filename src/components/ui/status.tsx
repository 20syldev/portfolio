import { RefreshCw, Sparkles, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { type ProjectStatus } from "@/hooks/status";

export type { ProjectStatus };

interface StatusBadgeProps {
    status: ProjectStatus;
    github?: string;
    npm?: string;
    variant?: "absolute" | "inline";
}

const config = {
    new: {
        label: "Nouveau",
        icon: Sparkles,
        className: "badge-new",
    },
    updated: {
        label: "Mis à jour",
        icon: RefreshCw,
        className: "badge-updated",
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
 * @param props.github - Optional GitHub URL for linking the badge to the latest release
 * @param props.variant - Display variant: "absolute" for overlay positioning, "inline" for flow (default: "absolute")
 * @returns The rendered status badge, or null if no status
 */
export function StatusBadge({ status, github, npm, variant = "absolute" }: StatusBadgeProps) {
    if (!status) return null;

    const cfg = config[status];
    const Icon = cfg.icon;
    const href = npm ?? (github ? `${github}/releases/latest` : undefined);

    const badge = (
        <Badge className={`gap-2 text-xs h-5 text-white border-0 ${cfg.className}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
        </Badge>
    );

    const linked = href ? (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
        >
            {badge}
        </a>
    ) : (
        badge
    );

    if (variant === "inline") return linked;
    return <div className="absolute right-2 -top-[13px]">{linked}</div>;
}