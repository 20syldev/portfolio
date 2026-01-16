"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Section {
    id: string;
    title: string;
}

interface ProjectDetailNavProps {
    className?: string;
    mobile?: boolean;
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
    content?: string | null;
}

// Extract sections from markdown content
function extractSections(content: string | null | undefined): Section[] {
    if (!content) return [];

    const sections: Section[] = [];
    // Match ## Heading {#id} pattern
    const regex = /^##\s+(.+?)\s*\{#([a-z0-9-]+)\}/gim;
    let match;

    while ((match = regex.exec(content)) !== null) {
        sections.push({
            title: match[1].trim(),
            id: match[2],
        });
    }

    return sections;
}

export function ProjectDetailNav({
    className,
    mobile,
    scrollContainerRef,
    content,
}: ProjectDetailNavProps) {
    const sections = useMemo(() => extractSections(content), [content]);
    const initialSection = sections[0]?.id ?? "";
    const [activeSection, setActiveSection] = useState<string>(initialSection);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Sync activeSection when sections change
    useEffect(() => {
        if (sections.length > 0 && !sections.find((s) => s.id === activeSection)) {
            setActiveSection(sections[0].id);
        }
    }, [sections, activeSection]);

    useEffect(() => {
        const container = scrollContainerRef?.current;
        if (!container || sections.length === 0) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                root: container,
                rootMargin: "-20% 0px -70% 0px",
                threshold: 0,
            },
        );

        // Small delay to let the content render
        const timeout = setTimeout(() => {
            sections.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) observerRef.current?.observe(element);
            });
        }, 100);

        return () => {
            clearTimeout(timeout);
            observerRef.current?.disconnect();
        };
    }, [scrollContainerRef, sections]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (sections.length === 0) return null;

    if (mobile) {
        return (
            <nav
                className={cn(
                    "bg-background/95 backdrop-blur-sm border-b border-border p-2 -mx-6 px-6",
                    className,
                )}
            >
                <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    {sections.map(({ id, title }) => (
                        <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className={cn(
                                "px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors",
                                activeSection === id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                            )}
                        >
                            {title}
                        </button>
                    ))}
                </div>
            </nav>
        );
    }

    return (
        <aside
            className={cn(
                "w-auto max-w-200 flex-shrink-0 border-r border-border",
                className,
            )}
        >
            <nav className="sticky top-0 p-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Sur cette page
                </p>
                {sections.map(({ id, title }) => (
                    <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={cn(
                            "block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                            activeSection === id
                                ? "bg-muted text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                    >
                        {title}
                    </button>
                ))}
            </nav>
        </aside>
    );
}