"use client";

import { GitMerge, GitPullRequestClosed, GitPullRequestDraft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { type Contribution } from "@/data/contributions";
import { useExpand } from "@/hooks/expand";

/**
 * Icon indicating the status of a contribution PR (merged, closed, or open).
 *
 * @param props - Component props
 * @param props.status - The PR status
 * @returns The rendered status icon
 */
export function ContributionStatus({ status }: { status: Contribution["status"] }) {
    if (status === "merged") {
        return (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/15 shrink-0 mt-0.5">
                <GitMerge className="h-2.5 w-2.5 text-purple-500" />
            </span>
        );
    }
    if (status === "closed") {
        return (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-destructive/15 shrink-0 mt-0.5">
                <GitPullRequestClosed className="h-2.5 w-2.5 text-destructive" />
            </span>
        );
    }
    return (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500/15 shrink-0 mt-0.5">
            <GitPullRequestDraft className="h-2.5 w-2.5 text-green-500" />
        </span>
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

/**
 * List of contributions grouped by repository.
 *
 * @param props - Component props
 * @param props.contributions - Contributions to display
 * @param props.columns - Whether to use a two-column grid layout
 * @returns The rendered contribution list
 */
export function ContributionList({
    contributions,
    columns,
}: {
    contributions: Contribution[];
    columns?: boolean;
}) {
    const grouped = contributions.reduce<Record<string, Contribution[]>>((acc, c) => {
        (acc[c.repo] ??= []).push(c);
        return acc;
    }, {});

    return (
        <div className={columns ? "grid gap-4 md:grid-cols-2" : "flex flex-col gap-4"}>
            {Object.entries(grouped).map(([repo, prs]) => (
                <div key={repo} className="rounded-lg border overflow-hidden">
                    <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between gap-3">
                        <a
                            href={`https://github.com/${repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs font-medium hover:text-primary transition-colors truncate"
                        >
                            {repo}
                        </a>
                        <Badge variant="secondary" className="text-xs shrink-0">
                            {prs.length}
                        </Badge>
                    </div>
                    <div className="divide-y divide-border">
                        {prs.map((pr) => (
                            <div
                                key={pr.pr}
                                className="flex items-start gap-2.5 px-4 py-3 hover:bg-muted/30 transition-colors"
                            >
                                <div className="pt-0.5">
                                    <ContributionStatus status={pr.status} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <a
                                        href={pr.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium hover:text-primary transition-colors line-clamp-2 leading-snug"
                                    >
                                        {pr.title}
                                    </a>
                                    <ExpandableText className="text-xs text-muted-foreground">
                                        {pr.description}
                                    </ExpandableText>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0 pt-0.5">
                                    #{pr.pr}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}