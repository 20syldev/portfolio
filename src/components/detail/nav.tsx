"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Section {
    id: string;
    title: string;
}

interface DetailNavProps {
    className?: string;
    mobile?: boolean;
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
    scrollTo?: (target: string | HTMLElement, offset?: number) => void;
    content?: string | null;
}

function extractSections(content: string | null | undefined): Section[] {
    if (!content) return [];

    const sections: Section[] = [];
    const regex = /^##\s+(.+?)\s*\{#([a-z0-9-]+)\}/gim;
    let match;

    while ((match = regex.exec(content)) !== null) {
        sections.push({ title: match[1].trim(), id: match[2] });
    }

    return sections;
}

export function DetailNav({
    className,
    mobile,
    scrollContainerRef,
    scrollTo,
    content,
}: DetailNavProps) {
    const sections = useMemo(() => extractSections(content), [content]);
    const [active, setActive] = useState(sections[0]?.id ?? "");
    const observer = useRef<IntersectionObserver | null>(null);
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    useEffect(() => {
        if (sections.length > 0 && !sections.find((s) => s.id === active)) {
            setActive(sections[0].id);
        }
    }, [sections, active]);

    useEffect(() => {
        if (sections.length === 0) return;

        const container = scrollContainerRef?.current;
        const useWindow = !container;
        const visible = new Set<string>();

        const getScrollTop = () => (useWindow ? window.scrollY : container!.scrollTop);
        const getClientHeight = () => (useWindow ? window.innerHeight : container!.clientHeight);
        const getScrollHeight = () =>
            useWindow ? document.documentElement.scrollHeight : container!.scrollHeight;

        const updateActiveSection = () => {
            if (getScrollTop() < 50) return setActive(sections[0].id);

            const bottom = getScrollTop() + getClientHeight() >= getScrollHeight() - 50;
            if (bottom) return setActive(sections[sections.length - 1].id);

            if (visible.size > 0) {
                for (const section of sections) {
                    if (visible.has(section.id)) {
                        return setActive(section.id);
                    }
                }
            }

            const threshold = useWindow
                ? window.innerHeight * 0.2
                : (() => {
                      const containerRect = container!.getBoundingClientRect();
                      return containerRect.top + containerRect.height * 0.2;
                  })();

            let last: string | null = null;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.getBoundingClientRect().top < threshold) {
                    last = section.id;
                }
            }

            if (last) setActive(last);
        };

        observer.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        visible.add(entry.target.id);
                    } else {
                        visible.delete(entry.target.id);
                    }
                }
                updateActiveSection();
            },
            { root: useWindow ? null : container, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
        );

        const scrollTarget = useWindow ? window : container!;
        scrollTarget.addEventListener("scroll", updateActiveSection, { passive: true });

        const timeout = setTimeout(() => {
            for (const { id } of sections) {
                const element = document.getElementById(id);
                if (element) observer.current?.observe(element);
            }
            updateActiveSection();
        }, 100);

        return () => {
            clearTimeout(timeout);
            observer.current?.disconnect();
            scrollTarget.removeEventListener("scroll", updateActiveSection);
        };
    }, [scrollContainerRef, sections]);

    const scrollToSection = (id: string) => {
        setActive(id);
        if (scrollTo) {
            scrollTo(`#${id}`, -120);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (!mobile || !active) return;
        const button = buttonRefs.current.get(active);
        button?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [active, mobile]);

    if (sections.length === 0) return null;

    if (mobile) {
        return (
            <nav
                className={cn(
                    "bg-background/80 backdrop-blur-sm border-b border-border p-2 -mx-4 px-4 sm:-mx-6 sm:px-6",
                    className
                )}
            >
                <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    {sections.map(({ id, title }) => (
                        <button
                            key={id}
                            ref={(el) => {
                                if (el) buttonRefs.current.set(id, el);
                            }}
                            onClick={() => scrollToSection(id)}
                            className={cn(
                                "px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors",
                                active === id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
        <aside className={cn("w-auto max-w-200 flex-shrink-0 border-r border-border", className)}>
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
                            active === id
                                ? "bg-muted text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {title}
                    </button>
                ))}
            </nav>
        </aside>
    );
}