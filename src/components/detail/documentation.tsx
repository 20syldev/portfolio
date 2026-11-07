"use client";

import { type ReactNode, useEffect } from "react";

import { DetailContent } from "@/components/detail/content";
import { DetailNav } from "@/components/detail/nav";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { useMotionEnabled } from "@/components/utils/motion";
import type { ContentImage } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/scroll";
import { markAnchor } from "@/lib/anchor";
import { tabs, urls } from "@/lib/nav";

interface DocumentationProps {
    header: ReactNode;
    content: string;
    images?: ContentImage[];
}

/**
 * Unified documentation layout with header, sidebar navigation and markdown content.
 * Used for both project docs and help docs.
 *
 * @param props - Component props
 * @param props.header - Custom header content
 * @param props.content - Markdown content to render
 * @param props.images - Images placed in the content, resolved at build time
 * @returns The rendered documentation page
 */
export function Documentation({ header, content, images }: DocumentationProps) {
    const { scrollRef, scrollTo } = useSmoothScroll<HTMLDivElement>();
    const motion = useMotionEnabled();

    useEffect(() => {
        let cancel: (() => void) | undefined;

        const mark = () => {
            cancel?.();
            const id = decodeURIComponent(window.location.hash.slice(1));
            cancel = id ? markAnchor(id, motion ? undefined : 0) : undefined;
        };

        mark();
        window.addEventListener("hashchange", mark);

        return () => {
            cancel?.();
            window.removeEventListener("hashchange", mark);
        };
    }, [motion]);

    return (
        <div
            ref={scrollRef}
            className="h-dvh overflow-x-hidden overflow-y-auto scrollbar-none flex flex-col"
        >
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            {/* Custom header */}
            <div className="border-b pt-bar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{header}</div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto flex flex-1 w-full">
                {/* Desktop sidebar */}
                <DetailNav
                    className="hidden md:flex sticky top-bar h-[calc(100dvh-var(--bar-h))] border-r-0"
                    scrollContainerRef={scrollRef}
                    scrollTo={scrollTo}
                    content={content}
                />

                {/* Main content */}
                <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 md:py-6">
                    {/* Mobile navigation */}
                    <DetailNav
                        className="md:hidden sticky top-stick z-10 -mx-6 mb-6 transition-[top] duration-300 motion-reduce:transition-none"
                        mobile
                        scrollContainerRef={scrollRef}
                        scrollTo={scrollTo}
                        content={content}
                    />

                    <DetailContent content={content} images={images} />
                </main>
            </div>

            <Footer />
        </div>
    );
}