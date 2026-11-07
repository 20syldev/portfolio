"use client";

import Link from "next/link";
import { useRef } from "react";

import { RefractionFilter } from "@/components/layout/refraction";
import { ThemeToggle } from "@/components/layout/theme";
import { Name } from "@/components/ui/name";
import { CommandMenu, SearchButton } from "@/components/utils/command";
import { useFont } from "@/components/utils/font";
import { profile } from "@/data/profile";
import { useFirstVisit } from "@/hooks/entrance";
import { useGlow } from "@/hooks/glow";
import { useHide } from "@/hooks/hide";
import { useRefraction } from "@/hooks/refraction";
import { useSolid } from "@/hooks/solid";

interface NavProps {
    currentTab: number;
    tabs: string[];
    onTabChange?: (index: number) => void;
    links?: string[];
}

/**
 * Floating pill header shown on every page.
 * The wordmark is left out on the home page, on phones and in low windows. The glass goes solid
 * once content scrolls under it, and on phones the pill slides away while a page scrolls down.
 *
 * @param props - Component props
 * @param props.currentTab - Currently active tab index, or -1 on pages outside the tabs
 * @param props.tabs - Array of tab labels
 * @param props.onTabChange - Optional callback when a tab is selected
 * @param props.links - Optional array of URLs for link-based navigation
 * @returns The rendered navigation header
 */
export function Nav({ currentTab, tabs, onTabChange, links }: NavProps) {
    const isHome = currentTab === 0;
    const { setDialogOpen } = useFont();
    const animate = useFirstVisit();
    const headerRef = useRef<HTMLElement>(null);
    const pillRef = useRef<HTMLDivElement>(null);
    useSolid(headerRef);
    useHide(headerRef, !isHome, currentTab);
    useGlow(pillRef);
    const bend = useRefraction(pillRef);

    return (
        <header
            ref={headerRef}
            data-refract={bend ? "" : undefined}
            className={`fixed inset-x-0 top-0 z-50 pointer-events-none ${animate ? "animate-header-in" : ""}`}
        >
            <CommandMenu />

            <div aria-hidden className="glass-fade absolute inset-x-0 top-0" />

            <div
                ref={pillRef}
                className="glass pointer-events-auto relative mx-auto mt-(--bar-top) flex h-(--bar-pill) w-fit max-w-[calc(100%-1rem)] items-center gap-1 rounded-full px-1.5"
            >
                <div
                    inert={isHome}
                    className={`hidden md:grid compact:hidden transition-[grid-template-columns,margin,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                        isHome ? "-mr-1 grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"
                    }`}
                >
                    <div className="min-w-0 overflow-hidden">
                        <Link
                            href={links?.[0] ?? "/"}
                            onClick={
                                onTabChange
                                    ? (e) => {
                                          e.preventDefault();
                                          onTabChange(0);
                                      }
                                    : undefined
                            }
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                setDialogOpen(true);
                            }}
                            className="block pl-3.5 pr-3 text-xl font-bold whitespace-nowrap select-none"
                        >
                            <Name>{profile.name}</Name>
                        </Link>
                    </div>
                </div>

                <nav aria-label="Navigation principale" className="flex items-center gap-1">
                    {tabs.map((tab, index) => {
                        const active = currentTab === index;
                        const className = `glass-tab rounded-full px-(--bar-tab-x) py-(--bar-tab-y) text-(length:--bar-tab-size) leading-[1.4] whitespace-nowrap ${
                            active
                                ? "font-medium text-foreground"
                                : "text-tab-foreground hover:text-foreground"
                        }`;

                        if (links) {
                            return (
                                <Link
                                    key={tab}
                                    href={links[index]}
                                    aria-current={active ? "page" : undefined}
                                    className={className}
                                >
                                    {tab}
                                </Link>
                            );
                        }

                        return (
                            <button
                                key={tab}
                                onClick={() => onTabChange?.(index)}
                                aria-current={active ? "page" : undefined}
                                className={className}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </nav>

                <span aria-hidden className="mx-1 h-[55%] w-px bg-border/50" />

                <div className="flex items-center gap-0.5 [&_button]:size-(--bar-icon)">
                    <SearchButton />
                    <ThemeToggle />
                </div>
            </div>

            {bend && <RefractionFilter {...bend} />}
        </header>
    );
}
