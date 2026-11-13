"use client";

import {
    CircleCheck,
    CircleDot,
    CircleX,
    GitMerge,
    GitPullRequestClosed,
    GitPullRequestDraft,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type Contribution } from "@/data/contributions";
import { useExpand } from "@/hooks/expand";

const STATUS_LABELS: Record<Contribution["type"], Record<string, string>> = {
    pr: {
        open: "Pull request ouverte",
        closed: "Pull request fermée",
        merged: "Pull request mergée",
        resolved: "Pull request mergée",
    },
    issue: {
        open: "Issue ouverte",
        closed: "Issue fermée",
        merged: "Issue résolue",
        resolved: "Issue résolue",
    },
};

/**
 * Icon indicating the status of a contribution (merged, resolved, closed, or open).
 *
 * @param props - Component props
 * @param props.type - Whether this is a PR or an issue
 * @param props.status - The contribution status
 * @returns The rendered status icon
 */
export function ContributionStatus({
    type,
    status,
}: {
    type: Contribution["type"];
    status: Contribution["status"];
}) {
    let icon: React.ReactNode;
    if (status === "merged") {
        icon = (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/15 shrink-0 mt-0.5">
                <GitMerge className="h-2.5 w-2.5 text-purple-500" />
            </span>
        );
    } else if (status === "resolved") {
        icon = (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/15 shrink-0 mt-0.5">
                <CircleCheck className="h-2.5 w-2.5 text-purple-500" />
            </span>
        );
    } else if (status === "closed") {
        icon = (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-destructive/15 shrink-0 mt-0.5">
                {type === "issue" ? (
                    <CircleX className="h-2.5 w-2.5 text-destructive" />
                ) : (
                    <GitPullRequestClosed className="h-2.5 w-2.5 text-destructive" />
                )}
            </span>
        );
    } else {
        icon = (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500/15 shrink-0 mt-0.5">
                {type === "issue" ? (
                    <CircleDot className="h-2.5 w-2.5 text-green-500" />
                ) : (
                    <GitPullRequestDraft className="h-2.5 w-2.5 text-green-500" />
                )}
            </span>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent>{STATUS_LABELS[type][status]}</TooltipContent>
        </Tooltip>
    );
}

/**
 * Description text that clamps to 2 lines and expands smoothly on hover.
 *
 * @param props - Component props
 * @param props.children - Text to display
 * @param props.className - Additional classes applied to the paragraph
 * @returns The rendered expandable description
 */
export function ExpandableText({ children, className }: { children: string; className?: string }) {
    const { expanded, clamped, expandedHeight, wrapRef, pRef, onMouseEnter, onMouseLeave } =
        useExpand();

    return (
        <div
            ref={wrapRef}
            className="mt-1 overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{ maxHeight: expanded ? expandedHeight + "px" : "2rem" }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <p ref={pRef} className={`${className ?? ""}${clamped ? " line-clamp-2" : ""}`}>
                {children}
            </p>
        </div>
    );
}
