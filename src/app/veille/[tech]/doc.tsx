"use client";

import { ExternalLink } from "lucide-react";

import { DetailNav } from "@/components/detail/nav";
import { VeilleContent } from "@/components/detail/veille";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Veille } from "@/data/veille";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

interface DocProps {
    veille: Veille;
    content: string;
}

function removeSpecialSections(content: string): string {
    return content.replace(/## Sources.*?\n[\s\S]*?$/, "");
}

/**
 * Full-page veille article layout with header, sidebar navigation and content.
 *
 * @param props - Component props
 * @param props.veille - Veille article data
 * @param props.content - Markdown content to render
 * @returns The rendered veille documentation page
 */
export function Doc({ veille, content }: DocProps) {
    const { scrollRef, scrollTo } = useSmoothScroll<HTMLDivElement>();
    const navContent = removeSpecialSections(content);

    return (
        <div
            ref={scrollRef}
            className="h-dvh overflow-x-hidden overflow-y-auto scrollbar-none flex flex-col"
        >
            <Nav currentTab={2} tabs={tabs} links={urls} />

            {/* Header */}
            <div className="border-b pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">{veille.title}</h1>
                            <p className="text-muted-foreground">{veille.description}</p>
                            {veille.keywords && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {veille.keywords.map((keyword) => (
                                        <Badge
                                            key={keyword}
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                        {veille.url && (
                            <Button asChild size="sm" variant="outline" className="shrink-0">
                                <a href={veille.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Site officiel
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto flex flex-1 w-full">
                <DetailNav
                    className="hidden md:flex sticky top-16 h-[calc(100vh-4rem)] border-r-0"
                    scrollContainerRef={scrollRef}
                    scrollTo={scrollTo}
                    content={navContent}
                />

                <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 md:py-6">
                    <DetailNav
                        className="md:hidden sticky top-16 z-10 -mx-6 mb-6"
                        mobile
                        scrollContainerRef={scrollRef}
                        scrollTo={scrollTo}
                        content={navContent}
                    />

                    <VeilleContent content={content} />
                </main>
            </div>

            <Footer />
        </div>
    );
}