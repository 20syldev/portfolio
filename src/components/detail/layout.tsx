"use client";

import type { ReactNode } from "react";

import { DetailContent } from "@/components/detail/content";
import { DetailNav } from "@/components/detail/nav";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

interface DocumentationLayoutProps {
    header: ReactNode;
    content: string;
}

/**
 * Unified documentation layout with header, sidebar navigation and markdown content.
 * Used for both project docs and help docs.
 *
 * @param props - Component props
 * @param props.header - Custom header content
 * @param props.content - Markdown content to render
 * @returns The rendered documentation page
 */
export function DocumentationLayout({ header, content }: DocumentationLayoutProps) {
    const { scrollRef, scrollTo } = useSmoothScroll<HTMLDivElement>();

    return (
        <div
            ref={scrollRef}
            className="h-dvh overflow-x-hidden overflow-y-auto scrollbar-none flex flex-col"
        >
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            {/* Custom header */}
            <div className="border-b pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{header}</div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto flex flex-1 w-full">
                {/* Desktop sidebar */}
                <DetailNav
                    className="hidden md:flex sticky top-16 h-[calc(100vh-4rem)] border-r-0"
                    scrollContainerRef={scrollRef}
                    scrollTo={scrollTo}
                    content={content}
                />

                {/* Main content */}
                <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 md:py-6">
                    {/* Mobile navigation */}
                    <DetailNav
                        className="md:hidden sticky top-16 z-10 -mx-6 mb-6"
                        mobile
                        scrollContainerRef={scrollRef}
                        scrollTo={scrollTo}
                        content={content}
                    />

                    <DetailContent content={content} />
                </main>
            </div>

            <Footer />
        </div>
    );
}