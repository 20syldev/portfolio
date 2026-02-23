"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { RandomButton } from "@/components/dialogs/random";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import type { Doc } from "@/data/docs";
import { docs } from "@/data/docs";
import { useOverflow } from "@/hooks/overflow";
import { useSmoothScroll } from "@/hooks/scroll";
import { getDocCategories } from "@/lib/docs";
import { tabs, urls } from "@/lib/nav";

/**
 * Displays doc titles on a single line with overflow truncation.
 * Uses useOverflow to measure, truncate and show a "+X" counter.
 *
 * @param docs - List of docs to display
 * @returns The rendered tag row
 */
function DocPreview({ docs: items }: { docs: Doc[] }) {
    const [shuffled, setShuffled] = useState<Doc[] | null>(null);
    const [skeletonWidths] = useState(() =>
        [0, 1, 2].map(() => 32 + Math.floor(Math.random() * 148))
    );
    const containerRef = useOverflow<HTMLDivElement>(shuffled?.length ?? 0);
    const itemsRef = useRef(items);

    useEffect(() => {
        setShuffled([...itemsRef.current].sort(() => Math.random() - 0.5));
    }, []);

    if (!shuffled) {
        return (
            <div className="flex flex-nowrap gap-2 overflow-hidden">
                {skeletonWidths.map((width, i) => (
                    <span
                        key={i}
                        suppressHydrationWarning
                        className="h-6 rounded-full bg-muted animate-pulse"
                        style={{ width }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex flex-nowrap gap-2 overflow-hidden">
            {shuffled.map((doc) => (
                <span
                    key={doc.id}
                    data-item
                    className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground whitespace-nowrap"
                >
                    {doc.title}
                </span>
            ))}
            <span
                data-counter
                className="px-2.5 py-1 text-xs rounded-full bg-muted text-primary font-medium whitespace-nowrap"
                style={{ display: "none" }}
            />
        </div>
    );
}

/**
 * Help index page listing all documentation categories.
 *
 * @returns The rendered help index page
 */
export default function HelpPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();
    const categories = getDocCategories();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <RandomButton />
                </div>
                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Documentations</h1>
                    <p className="text-lg text-muted-foreground">
                        {docs.length} {docs.length > 1 ? "guides" : "guide"} disponible
                        {docs.length > 1 ? "s" : ""}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
                    {categories.map((category) => {
                        const categoryDocs = docs.filter((d) => d.category === category);
                        return (
                            <Link
                                key={category}
                                href={`/help/${category}`}
                                className="flex flex-col gap-3 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50 card-hover min-w-0"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        <span className="text-lg font-medium capitalize">
                                            {category}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {categoryDocs.length}
                                    </span>
                                </div>
                                <DocPreview docs={categoryDocs} />
                            </Link>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}