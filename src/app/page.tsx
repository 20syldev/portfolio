"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Alternance } from "@/components/sections/alternance";
import { InfoCards } from "@/components/sections/cards";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Technologies } from "@/components/sections/technologies";
import { Veille } from "@/components/sections/veille";
import { useScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

const sections = 4;

function getTab(pathname: string): number {
    if (pathname === "/alternance") return 1;
    if (pathname === "/veille") return 2;
    return 0;
}

export default function Home() {
    const pathname = usePathname();
    const initial = getTab(pathname);

    const { containerRef, currentTab, currentSection, goToTab, goToSection } = useScroll({
        totalTabs: tabs.length,
        homeSections: sections,
        threshold: 10,
        scrollDuration: 500,
        initialTab: initial,
    });

    // Sync URL when tab changes
    useEffect(() => {
        const url = urls[currentTab];
        if (pathname !== url) {
            history.pushState(null, "", url);
        }
    }, [currentTab, pathname]);

    // Sync tab when pathname changes
    useEffect(() => {
        const expected = getTab(pathname);
        if (expected !== currentTab) goToTab(expected);
    }, [pathname, currentTab, goToTab]);

    // Handle browser back/forward
    useEffect(() => {
        const onPopState = () => {
            const expected = getTab(location.pathname);
            if (expected !== currentTab) goToTab(expected);
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [currentTab, goToTab]);

    // Handle hash navigation on mount and hash changes
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.slice(1);
            if (!hash) return;

            const element = document.getElementById(hash);
            if (!element) return;

            const rect = element.getBoundingClientRect();
            if (rect.left >= 0 && rect.left < window.innerWidth) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        };

        setTimeout(scrollToHash, 100);
        window.addEventListener("hashchange", scrollToHash);
        return () => window.removeEventListener("hashchange", scrollToHash);
    }, []);

    return (
        <div ref={containerRef} className="snap-container">
            <Nav currentTab={currentTab} tabs={tabs} onTabChange={goToTab} />

            {/* Section dots - desktop */}
            {currentTab === 0 && (
                <div className="fixed right-3 top-1/2 z-50 -translate-y-1/2 hidden sm:flex flex-col gap-2">
                    {Array.from({ length: sections }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSection(index)}
                            className={`w-2 rounded-full transition-all ${
                                currentSection === index
                                    ? "h-6 bg-primary"
                                    : "h-2 bg-muted-foreground/30"
                            }`}
                            style={{
                                transitionDuration: "0.6s",
                                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                            aria-label={`Section ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Scroll indicator */}
            {currentTab === 0 && currentSection < sections - 1 && (
                <button
                    onClick={() => goToSection(currentSection + 1)}
                    className="fixed left-1/2 z-50 -translate-x-1/2 animate-float"
                    style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}
                    aria-label="Section suivante"
                >
                    <ChevronDown className="h-5 w-5 text-foreground" />
                </button>
            )}

            {/* Horizontal tabs container */}
            <div className="snap-tabs" style={{ transform: `translateX(-${currentTab * 100}vw)` }}>
                {/* Tab 1: Accueil */}
                <div className="snap-tab">
                    <div
                        className="snap-sections"
                        style={{ transform: `translateY(-${currentSection * 100}dvh)` }}
                    >
                        {/* Section 1: Hero */}
                        <section className="snap-section">
                            <Hero />
                        </section>

                        {/* Section 2: Technologies */}
                        <section className="snap-section">
                            <Technologies />
                        </section>

                        {/* Section 3: Projects */}
                        <section className="snap-section">
                            <Projects />
                        </section>

                        {/* Section 4: InfoCards + Footer */}
                        <section className="snap-section flex flex-col px-4 lg:px-8">
                            <div className="flex flex-1 items-center justify-center">
                                <div className="w-full max-w-6xl xl:max-w-[1400px]">
                                    <InfoCards />
                                </div>
                            </div>
                            <Footer />
                        </section>
                    </div>
                </div>

                {/* Tab 2: Alternance */}
                <div className="snap-tab">
                    <Alternance />
                </div>

                {/* Tab 3: Veille */}
                <div className="snap-tab">
                    <Veille />
                </div>
            </div>
        </div>
    );
}