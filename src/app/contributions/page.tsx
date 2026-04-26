"use client";

import { ArrowLeft, Dot } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContributionStatus } from "@/components/ui/contributions";
import { type Contribution, contributions } from "@/data/contributions";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Dedicated page listing all external open-source contributions, grouped by repository.
 *
 * @returns The rendered contributions page
 */
export default function ContributionsPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    const grouped = contributions.reduce<Record<string, Contribution[]>>((acc, c) => {
        (acc[c.repo] ??= []).push(c);
        return acc;
    }, {});

    const groups = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
    const NUM_COLS = 3;
    const cols: [string, Contribution[]][][] = Array.from({ length: NUM_COLS }, () => []);
    const heights = new Array(NUM_COLS).fill(0);
    for (const group of groups) {
        const shortest = heights.indexOf(Math.min(...heights));
        cols[shortest].push(group);
        heights[shortest] += group[1].length;
    }

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <div className="mb-8">
                    <Link href="/repositories">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Contributions externes</h1>
                    <p className="text-xl text-muted-foreground">
                        {contributions.length} pull requests <Dot className="inline h-5 w-5" />{" "}
                        {Object.keys(grouped).length} projets
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {cols.map((col, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            {col.map(([repo, prs]) => (
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
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {pr.description}
                                                    </p>
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
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}