"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { ArticleList } from "@/components/ui/articles";
import { Button } from "@/components/ui/button";
import { articles, blog } from "@/data/articles";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Dedicated page listing the Zenetys blog articles formatted and integrated for the company site.
 *
 * @returns The rendered articles page
 */
export default function ArticlesPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="flex-1 container mx-auto max-w-4xl px-4 pt-page pb-12">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/repositories">
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Retour aux projets"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <a href={blog} target="_blank" rel="noopener noreferrer">
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Le blog Zenetys"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </a>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Articles</h1>
                    <p className="text-xl text-muted-foreground">
                        Mis en forme pour le blog Zenetys
                    </p>
                </div>

                <ArticleList
                    articles={articles}
                    note="Rédaction by Zenetys, mise en forme et intégration web de mon côté."
                />
            </main>
            <Footer />
        </div>
    );
}