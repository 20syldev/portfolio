"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CardDialog } from "@/components/dialogs/card";
import { ProjectCard } from "@/components/ui/project";
import { projects } from "@/data/projects";
import { useApi } from "@/hooks/api";
import { useCard } from "@/hooks/card";
import { useStatus } from "@/hooks/status";
import { sortByStatus } from "@/lib/projects";

// Row stride in pixels (card height) for row calculation
const cardHeight = 124;

// Phone row stride: a 121px card plus the 16px grid gap
const phoneCardHeight = 137;

/**
 * Hook to calculate optimal grid layout based on viewport.
 * Dynamically adjusts columns and rows for any screen size.
 */
function useProjectGrid() {
    const [grid, setGrid] = useState({ cols: 4, rows: 2, count: 8 });

    useEffect(() => {
        const calculate = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Columns based on viewport width
            let cols: number;
            let headerOffset: number;
            let rowHeight = cardHeight;

            if (width < 640) {
                // Mobile: single column, offset is the measured chrome around the cards
                cols = 1;
                headerOffset = 164;
                rowHeight = phoneCardHeight;
            } else if (width < 1024) {
                // Tablet (sm/md): 2 columns
                cols = 2;
                headerOffset = 260;
            } else {
                // Desktop (lg+): 4 columns
                cols = 4;
                headerOffset = 240;
            }

            // Rows based on available height
            const availableHeight = height - headerOffset;
            let rows = Math.floor(availableHeight / rowHeight);

            // Clamp rows based on layout
            const maxRows = cols === 1 ? 5 : 4;
            const minRows = cols === 1 ? 3 : 2;
            rows = Math.min(maxRows, Math.max(minRows, rows));

            setGrid({ cols, rows, count: cols * rows });
        };

        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, []);

    return grid;
}

/**
 * Projects display section.
 * Dynamic grid that adapts columns and rows based on viewport dimensions.
 *
 * @returns The rendered projects grid section
 */
export function Projects() {
    const { versions, loading } = useApi();
    const getProjectStatus = useStatus();
    const { project: selected, open, close } = useCard();
    const { cols, count } = useProjectGrid();

    const getVersion = (projectId: string): string | undefined => {
        if (!versions) return undefined;
        return versions[projectId];
    };

    const previewProjects = (loading ? projects : sortByStatus(projects, getProjectStatus)).slice(
        0,
        count
    );

    return (
        <>
            <div className="flex h-full flex-col px-4 pt-bar pb-chevron overflow-y-hidden">
                <div className="flex flex-1 min-h-0 flex-col items-center justify-center-safe gap-6 overflow-y-auto pt-3 scrollbar-none">
                    <div
                        className="grid w-full max-w-7xl gap-4 stagger-children px-2"
                        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                    >
                        {previewProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} onOpen={open} />
                        ))}
                    </div>
                    <Link
                        href="/repositories"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Voir tous les projets
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <CardDialog
                project={selected}
                version={selected ? getVersion(selected.id) : undefined}
                status={selected ? getProjectStatus(selected.id) : null}
                onOpenChange={close}
            />
        </>
    );
}
