"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CommandMenu } from "@/components/command";
import { ThemeToggle } from "@/components/layout/toggle";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

interface NavProps {
    currentTab: number;
    tabs: string[];
    onTabChange?: (index: number) => void;
    links?: string[];
}

/**
 * Adaptive navigation header with morphing animation.
 * Compact centered pill on homepage, expands to full header bar on other tabs.
 * Includes hamburger menu on mobile.
 */
export function Nav({ currentTab, tabs, onTabChange, links }: NavProps) {
    const isHome = currentTab === 0;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <div
                className={`
                    pointer-events-auto
                    transition-all duration-500 ease-out
                    ${
                        isHome
                            ? "relative mt-4 md:mt-6 mx-auto w-fit rounded-full bg-muted/80 backdrop-blur-sm border border-border/50"
                            : "relative mt-0 mx-0 w-full rounded-none bg-background/80 backdrop-blur-sm border-b border-border/50"
                    }
                `}
            >
                <div
                    className={`
                    flex items-center
                    transition-all duration-500 ease-out
                    ${isHome ? "justify-center px-1 md:px-1.5 md:py-1" : "justify-between px-4 md:px-6 h-16"}
                `}
                >
                    {/* Logo - visible on non-home pages (desktop + mobile) */}
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
                        className={`
                            text-xl font-bold whitespace-nowrap
                            transition-all duration-500 ease-out
                            ${isHome ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
                        `}
                    >
                        {profile.name}
                    </Link>

                    {/* Navigation tabs - pills on home (always visible), hidden on mobile for other pages */}
                    <nav
                        className={`
                        flex items-center gap-1
                        transition-all duration-500 ease-out
                        ${isHome ? "" : "hidden md:flex"}
                    `}
                    >
                        {tabs.map((tab, index) => {
                            const className = `
                                transition-all duration-300 ease-out
                                ${
                                    isHome
                                        ? `px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-full ${
                                              currentTab === index
                                                  ? "bg-background text-foreground shadow-sm"
                                                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                          }`
                                        : `px-4 py-2 text-sm ${
                                              currentTab === index
                                                  ? "text-foreground font-medium"
                                                  : "text-muted-foreground hover:text-foreground"
                                          }`
                                }
                            `;

                            if (links) {
                                return (
                                    <Link key={tab} href={links[index]} className={className}>
                                        {tab}
                                    </Link>
                                );
                            }

                            return (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange?.(index)}
                                    className={className}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Actions container - right side for non-home pages */}
                    <div
                        className={`
                        flex items-center gap-1 h-8
                        transition-all duration-500 ease-out
                        ${isHome ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
                    `}
                    >
                        {/* Desktop: CommandMenu + ThemeToggle */}
                        <div className="hidden md:flex items-center gap-1">
                            <CommandMenu />
                            <ThemeToggle />
                        </div>

                        {/* Mobile: actions appear when menu is open */}
                        {isMenuOpen && (
                            <div className="flex md:hidden items-center gap-1">
                                <CommandMenu />
                                <ThemeToggle />
                            </div>
                        )}

                        {/* Mobile: hamburger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="h-8 w-8 md:hidden"
                        >
                            <span className="relative h-4 w-4">
                                <Menu
                                    className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${isMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
                                />
                                <X
                                    className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${isMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
                                />
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Mobile menu - non-home pages only */}
                {!isHome && isMenuOpen && (
                    <nav className="md:hidden border-t border-border/50">
                        <div className="flex flex-col p-2">
                            {tabs.map((tab, index) => {
                                const isActive = currentTab === index;

                                if (links) {
                                    return (
                                        <Link
                                            key={tab}
                                            href={links[index]}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`
                                                px-4 py-3 text-sm rounded-lg transition-colors
                                                ${
                                                    isActive
                                                        ? "bg-muted/60 backdrop-blur-[2px] text-foreground font-medium"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                }
                                            `}
                                        >
                                            {tab}
                                        </Link>
                                    );
                                }

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            onTabChange?.(index);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`
                                            px-4 py-3 text-sm rounded-lg transition-colors text-left
                                            ${
                                                isActive
                                                    ? "bg-muted/60 backdrop-blur-[2px] text-foreground font-medium"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            }
                                        `}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                )}
            </div>

            {/* Floating actions - desktop on home, mobile hamburger on home */}
            <div
                className={`
                    fixed right-4 md:right-6 top-4 md:top-6 flex items-center gap-1 pointer-events-auto
                    transition-all duration-500 ease-out
                    ${
                        isHome
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                `}
            >
                {/* Desktop: show actions directly */}
                <div className="hidden md:flex items-center gap-1">
                    <CommandMenu />
                    <ThemeToggle />
                </div>

                {/* Mobile: show hamburger for actions */}
                <div className="md:hidden flex flex-col items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="h-9 w-9"
                    >
                        <span className="relative h-4 w-4">
                            <Menu
                                className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${isMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
                            />
                            <X
                                className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${isMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
                            />
                        </span>
                    </Button>

                    {/* Actions revealed when open */}
                    {isMenuOpen && (
                        <>
                            <CommandMenu />
                            <ThemeToggle />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}