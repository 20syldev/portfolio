"use client";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Gallery } from "@/components/ui/gallery";
import {
    completionBadges,
    totalCertifications,
    totalGdevBadges,
    totalCompletionBadges,
} from "@/data/achievements";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Completion page.
 *
 * @returns The rendered completion page
 */
export default function CompletionPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />
            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <Gallery
                    categories={completionBadges}
                    title="Complétion"
                    subtitle={`${totalCompletionBadges} badges de complétion Google Cloud`}
                    relatedPages={[
                        {
                            label: "Certifications",
                            href: "/certifications",
                            count: totalCertifications,
                        },
                        { label: "Badges", href: "/badges", count: totalGdevBadges },
                    ]}
                />
            </main>
            <Footer />
        </div>
    );
}