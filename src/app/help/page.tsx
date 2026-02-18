"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

import { RandomButton } from "@/components/dialogs/random";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { docs } from "@/data/docs";
import { useSmoothScroll } from "@/hooks/scroll";
import { getDocCategories } from "@/lib/docs";
import { tabs, urls } from "@/lib/nav";

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

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const categoryDocs = docs.filter((d) => d.category === category);
                        return (
                            <Link
                                key={category}
                                href={`/help/${category}`}
                                className="flex flex-col gap-3 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50 card-hover"
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
                                <div className="flex flex-wrap gap-2">
                                    {categoryDocs.slice(0, 4).map((doc, index) => (
                                        <span
                                            key={doc.id}
                                            className={`px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground whitespace-nowrap ${index >= 1 ? "sm:hidden 2xl:inline-block" : ""}`}
                                            title={doc.title}
                                        >
                                            {doc.title.length > 30
                                                ? doc.title.slice(0, 27) + "..."
                                                : doc.title}
                                        </span>
                                    ))}
                                    {categoryDocs.length > 1 && (
                                        <span className="hidden sm:inline-block 2xl:hidden px-2.5 py-1 text-xs rounded-full bg-muted text-primary font-medium">
                                            + {categoryDocs.length - 1}
                                        </span>
                                    )}
                                    {categoryDocs.length > 4 && (
                                        <span className="sm:hidden 2xl:inline-block px-2.5 py-1 text-xs rounded-full bg-muted text-primary font-medium">
                                            + {categoryDocs.length - 4}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}