"use client";

import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

import { RandomButton } from "@/components/dialogs/random";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import type { Doc } from "@/data/docs";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

interface ListingProps {
    category: string;
    docs: Doc[];
    subcategories?: string[];
}

/**
 * Category listing page showing all docs in a given category.
 *
 * @param props - Component props
 * @param props.category - The category name
 * @param props.docs - Array of docs in this category
 * @param props.subcategories - Optional array of subcategory names
 * @returns The rendered category listing page
 */
export function Listing({ category, docs, subcategories = [] }: ListingProps) {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();
    const totalItems = docs.length + subcategories.length;

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/help">
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
                    <h1 className="mb-2 text-4xl font-bold capitalize">{category}</h1>
                    <p className="text-xl text-muted-foreground">
                        {totalItems} {totalItems > 1 ? "guides" : "guide"}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {subcategories.map((subcat) => (
                        <Link
                            key={`${category}-${subcat}`}
                            href={`/help/${category}/${subcat}`}
                            className="flex flex-col gap-3 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50 card-hover"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium capitalize">{subcat}</span>
                            </div>
                            <span className="line-clamp-2 text-xs text-muted-foreground">
                                Guides de {subcat}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-primary">
                                Voir les guides
                                <ArrowRight className="h-3 w-3" />
                            </div>
                        </Link>
                    ))}
                    {docs.map((doc) => (
                        <Link
                            key={doc.id}
                            href={`/help/${doc.category}/${doc.slug}`}
                            className="flex flex-col gap-3 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50 card-hover"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">{doc.title}</span>
                            </div>
                            <span className="line-clamp-2 text-xs text-muted-foreground">
                                {doc.description}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-primary">
                                Lire le guide
                                <ArrowRight className="h-3 w-3" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}