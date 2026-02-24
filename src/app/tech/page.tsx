"use client";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Technologies } from "@/components/sections/technologies";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Technologies page.
 *
 * @returns The rendered technologies page
 */
export default function TechPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />
            <main className="flex-1 container mx-auto pt-8">
                <Technologies />
            </main>
            <Footer />
        </div>
    );
}