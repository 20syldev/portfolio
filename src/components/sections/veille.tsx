"use client";

import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { veilles } from "@/data/veille";
import { useSmoothScroll } from "@/hooks/scroll";

/**
 * Tech Watch tab content.
 * Displays the list of veille cards directly in the snap-tab.
 *
 * @returns The rendered veille section
 */
export function Veille() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div
            ref={scrollRef}
            className="h-dvh overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col"
        >
            <div className="px-4 pt-24 pb-12 flex-1">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h1 className="mb-2 text-4xl font-bold">Veilles Technologiques</h1>
                        <p className="text-xl text-muted-foreground">
                            Suivi des actualités et évolutions technologiques
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {veilles.map((veille, index) => (
                            <Link
                                key={veille.id}
                                href={`/veille/${veille.id}`}
                                className={
                                    veilles.length % 2 !== 0 && index === veilles.length - 1
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
                </div>
            </div>

            <Footer />
        </div>
    );
}