"use client";

import Link from "next/link";
import { useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { veilles } from "@/data/veille";
import { useSmoothScroll } from "@/hooks/scroll";

const filters = [
    {
        label: "Frontend",
        keywords: [
            "Frontend",
            "UI",
            "Composants",
            "SPA",
            "Accessibilité",
            "React",
            "Vue.js",
            "Radix UI",
            "Next.js",
            "Vercel",
        ],
    },
    {
        label: "Backend",
        keywords: ["Backend", "Node.js", "Server", "Runtime", "Microsoft"],
    },
    {
        label: "JavaScript",
        keywords: ["JavaScript", "TypeScript", "Typage"],
    },
    {
        label: "Frameworks",
        keywords: ["Framework", "React", "Vue.js", "Next.js", "Node.js"],
    },
];

/**
 * Tech Watch tab content.
 * Displays the list of veille cards with category filters.
 *
 * @returns The rendered veille section
 */
export function Veille() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const filtered =
        activeFilters.length === 0
            ? veilles
            : veilles.filter((v) =>
                  activeFilters.some((f) => {
                      const gf = filters.find((g) => g.label === f);
                      return gf?.keywords.some((k) => v.keywords?.includes(k));
                  })
              );

    function toggleFilter(label: string) {
        setActiveFilters((prev) =>
            prev.includes(label) ? prev.filter((k) => k !== label) : [...prev, label]
        );
    }

    return (
        <div
            ref={scrollRef}
            className="h-dvh overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col"
        >
            <div className="px-4 pt-24 pb-12 flex-1">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-4xl font-bold">Veilles Technologiques</h1>
                        <p className="text-xl text-muted-foreground">
                            Suivi des actualités et évolutions technologiques
                        </p>
                    </div>

                    {/* Category filters */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                        {filters.map(({ label }) => (
                            <button key={label} onClick={() => toggleFilter(label)}>
                                <Badge
                                    variant={activeFilters.includes(label) ? "default" : "outline"}
                                    className="cursor-pointer text-xs"
                                >
                                    {label}
                                </Badge>
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    {filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">Aucun résultat</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {filtered.map((veille, index) => (
                                <Link
                                    key={veille.id}
                                    href={`/veille/${veille.id}`}
                                    className={
                                        filtered.length % 2 !== 0 && index === filtered.length - 1
                                            ? "md:col-span-2 md:mx-auto md:w-[50%] md:max-w-[calc(50%-0.75rem)]"
                                            : ""
                                    }
                                >
                                    <Card className="h-full transition-colors hover:border-primary">
                                        <CardHeader>
                                            <CardTitle>{veille.title}</CardTitle>
                                            <CardDescription>{veille.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {veille.keywords && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {veille.keywords.map((keyword) => (
                                                        <Badge
                                                            key={keyword}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {keyword}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}