"use client";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Gallery } from "@/components/ui/gallery";
import {
    certifications,
    totalCertifications,
    totalGdevBadges,
    totalCompletionBadges,
} from "@/data/achievements";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

/**
 * Certifications page.
 *
 * @returns The rendered certifications page
 */
export default function CertificationsPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />
            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <Gallery
                    categories={certifications}
                    title="Certifications"
                    subtitle={`${totalCertifications} certifications`}
                    relatedPages={[
                        { label: "Badges", href: "/badges", count: totalGdevBadges },
                        { label: "Complétion", href: "/completion", count: totalCompletionBadges },
                    ]}
                />
            </main>
            <Footer />
        </div>
    );
}