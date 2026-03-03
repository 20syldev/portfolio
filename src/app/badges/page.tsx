"use client";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Gallery } from "@/components/ui/gallery";
import {
    gdevBadges,
    totalCertifications,
    totalGdevBadges,
    totalSkillsBadges,
} from "@/data/achievements";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Badges page.
 *
 * @returns The rendered badges page
 */
export default function BadgesPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />
            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <Gallery
                    categories={gdevBadges}
                    title="Badges"
                    subtitle={`${totalGdevBadges} badges Google Developer`}
                    relatedPages={[
                        {
                            label: "Certifications",
                            href: "/certifications",
                            count: totalCertifications,
                        },
                        { label: "Complétion", href: "/completion", count: totalSkillsBadges },
                    ]}
                />
            </main>
            <Footer />
        </div>
    );
}