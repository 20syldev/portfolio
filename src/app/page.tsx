"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Cards } from "@/components/sections/cards";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Repositories } from "@/components/sections/repositories";
import { Technologies } from "@/components/sections/technologies";
import { Veille } from "@/components/sections/veille";
import { useScroll } from "@/hooks/scroll";
import { tabs, titles, urls } from "@/lib/nav";

const sections = 4;

/**
 * Determines the active tab index based on the current route path.
 * Maps paths to tab indices for navigation highlighting.
 *
 * @param path - Current pathname from router
 * @returns Tab index (0-based)
 */
function getTab(path: string): number {
    const p = path.replace(/\/$/, "");
    if (p === "/repositories") return 1;
    if (p === "/veille") return 2;
    return 0;
}

/**
 * Home page with horizontal tab navigation and vertical section scrolling.
 * Contains Hero, Technologies, Projects, Cards, Projets and Veille tabs. The Projets and Veille
 * tabs mount after the first interaction, or at once when the page opens on them.
 *
 * @returns The rendered home page
 */
export default function HomePage() {
    const pathname = usePathname();
    const mounted = useRef(false);

    const {
        containerRef,
        tabsRef,
        sectionsRef,
        tabsStyle,
        sectionsStyle,
        currentTab,
        currentSection,
        goToTab,
        goToSection,
    } = useScroll({
        totalTabs: tabs.length,
        sections,
        threshold: 10,
        scrollDuration: 600,
        initialTab: getTab(pathname),
    });

    const [repositoriesReady, setRepositoriesReady] = useState(() => getTab(pathname) === 1);
    useEffect(() => {
        if (repositoriesReady) return;
        if (currentTab > 0) {
            setRepositoriesReady(true);
            return;
        }

        const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
        let cancel = () => {};
        const mount = () => setRepositoriesReady(true);
        const start = () => {
            events.forEach((name) => removeEventListener(name, start));
            if (typeof requestIdleCallback === "function") {
                const id = requestIdleCallback(mount, { timeout: 1500 });
                cancel = () => cancelIdleCallback(id);
            } else {
                const id = setTimeout(mount, 300);
                cancel = () => clearTimeout(id);
            }
        };

        events.forEach((name) => addEventListener(name, start, { passive: true }));
        return () => {
            events.forEach((name) => removeEventListener(name, start));
            cancel();
        };
    }, [currentTab, repositoriesReady]);

    const [veilleReady, setVeilleReady] = useState(() => getTab(pathname) === 2);
    useEffect(() => {
        if (veilleReady || currentTab < 1) return;

        const id = setTimeout(() => setVeilleReady(true), 800);
        return () => clearTimeout(id);
    }, [currentTab, veilleReady]);

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }

        const url = urls[currentTab];
        if (location.pathname !== url) history.pushState(null, "", url);

        document.title = titles[currentTab];
    }, [currentTab]);

    useEffect(() => {
        const normalized = pathname.replace(/\/$/, "");
        const index = urls.findIndex((u) => u.replace(/\/$/, "") === normalized);
        if (index !== -1) document.title = titles[index];
    }, [pathname]);

    useEffect(() => {
        const panels = tabsRef.current?.children;
        if (!panels) return;

        Array.from(panels).forEach((panel, index) => {
            (panel as HTMLElement).inert = index !== currentTab;
        });
    }, [currentTab, tabsRef]);

    useEffect(() => {
        if (!mounted.current) return;

        const normalized = pathname.replace(/\/$/, "");
        if (!urls.some((u) => u.replace(/\/$/, "") === normalized)) return;

        const expected = getTab(pathname);
        if (expected !== currentTab) goToTab(expected);
    }, [pathname, currentTab, goToTab]);

    useEffect(() => {
        const sync = () => {
            if (location.pathname.startsWith("/card/")) return;

            const expected = getTab(location.pathname);
            if (expected !== currentTab) goToTab(expected);
        };

        addEventListener("popstate", sync);
        return () => removeEventListener("popstate", sync);
    }, [currentTab, goToTab]);

    useEffect(() => {
        const scrollToHash = () => {
            const id = location.hash.slice(1);
            if (!id) return;

            const el = document.getElementById(id);
            if (!el) return;

            const rect = el.getBoundingClientRect();
            if (rect.left >= 0 && rect.left < innerWidth) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        };
        setTimeout(scrollToHash, 100);
        addEventListener("hashchange", scrollToHash);
        return () => removeEventListener("hashchange", scrollToHash);
    }, []);

    const panels = useMemo(
        () => (
            <div ref={tabsRef} role="main" className="snap-tabs" style={tabsStyle}>
                <div className="snap-tab">
                    <div ref={sectionsRef} className="snap-sections" style={sectionsStyle}>
                        <section className="snap-section">
                            <Hero />
                        </section>

                        <section className="snap-section">
                            <Technologies preview />
                        </section>

                        <section className="snap-section">
                            <Projects />
                        </section>

                        <section className="snap-section flex flex-col px-4 pt-bar lg:px-8">
                            <div className="flex flex-1 items-center-safe justify-center">
                                <div className="w-full max-w-6xl xl:max-w-[1400px]">
                                    <Cards />
                                </div>
                            </div>
                            <Footer />
                        </section>
                    </div>
                </div>

                <div className="snap-tab">{repositoriesReady && <Repositories />}</div>

                <div className="snap-tab">{veilleReady && <Veille />}</div>
            </div>
        ),
        [repositoriesReady, veilleReady, tabsRef, sectionsRef, tabsStyle, sectionsStyle]
    );

    return (
        <div ref={containerRef} className="snap-container">
            <Nav currentTab={currentTab} tabs={tabs} onTabChange={goToTab} />

            {currentTab === 0 && (
                <div className="fixed right-3 top-1/2 z-50 -translate-y-1/2 hidden sm:flex flex-col gap-4.5">
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

            {currentTab === 0 && currentSection < sections - 1 && (
                <button
                    onClick={() => goToSection(currentSection + 1)}
                    className="fixed left-1/2 z-50 -translate-x-1/2 animate-float short:hidden"
                    style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}
                    aria-label="Section suivante"
                >
                    <ChevronDown className="h-5 w-5 text-foreground" />
                </button>
            )}

            {panels}
        </div>
    );
}