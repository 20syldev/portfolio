"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { darkInvertHueIcons, darkInvertIcons, techCategories } from "@/data/technologies";
import { useDragScroll } from "@/hooks/scroll";

/** Approximate height of one row of tech icons in the carousel */
const ITEM_ROW_HEIGHT = 100;

/**
 * Hook to calculate how many tech items fit in the carousel based on viewport height.
 * Mirrors the pattern used in the Projects section.
 */
function useTechCarousel() {
    const [itemsPerCategory, setItemsPerCategory] = useState(6);

    useEffect(() => {
        const calculate = () => {
            // Fixed overhead: py-20 + title + category name + dots + "voir tout" link
            const overhead = 240;
            const availableHeight = window.innerHeight - overhead;
            const rows = Math.min(5, Math.max(2, Math.floor(availableHeight / ITEM_ROW_HEIGHT)));
            setItemsPerCategory(rows * 3);
        };

        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, []);

    return itemsPerCategory;
}

/**
 * Technologies section.
 * Displays all technologies organized by category with icons.
 * Mobile: carousel with one category at a time showing icons + names.
 * Desktop: grid layout with all categories visible.
 *
 * @returns The rendered technologies section
 */
export function Technologies({ preview }: { preview?: boolean }) {
    const itemsPerCategory = useTechCarousel();
    const mobileCategories = preview ? techCategories.slice(0, 4) : techCategories;
    const [currentCategory, setCurrentCategory] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    useDragScroll(scrollRef);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        const maxScroll = scrollWidth - offsetWidth;
        if (maxScroll <= 0) return;
        const scrollProgress = scrollLeft / maxScroll;
        const newIndex = Math.round(scrollProgress * (mobileCategories.length - 1));
        if (newIndex !== currentCategory && newIndex >= 0 && newIndex < mobileCategories.length) {
            setCurrentCategory(newIndex);
        }
    }, [currentCategory, mobileCategories.length]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className="flex h-full flex-col items-center px-4 py-20">
            <div className="w-full max-w-4xl flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-center mb-6 lg:mb-8">Technologies</h2>

                {/* Mobile/Tablet: Carousel */}
                <div className="lg:hidden flex flex-col">
                    <div
                        ref={scrollRef}
                        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide -mx-4 px-4"
                    >
                        {mobileCategories.map((category) => (
                            <div
                                key={category.name}
                                className="flex-shrink-0 w-full snap-center px-2"
                            >
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                                    {category.name}
                                </h3>
                                <div className="grid grid-cols-3">
                                    {(preview
                                        ? category.items.slice(0, itemsPerCategory - 1)
                                        : category.items
                                    ).map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="flex flex-col items-center gap-1.5 p-2"
                                        >
                                            <a
                                                href={tech.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg hover:bg-muted/50 transition-colors w-16 h-16 flex items-center justify-center"
                                                aria-label={tech.name}
                                            >
                                                <Image
                                                    src={tech.icon}
                                                    alt={tech.name}
                                                    width={36}
                                                    height={36}
                                                    className={
                                                        darkInvertIcons.includes(tech.name)
                                                            ? "dark:invert"
                                                            : darkInvertHueIcons.includes(tech.name)
                                                              ? "invert-hue"
                                                              : ""
                                                    }
                                                />
                                            </a>
                                            <span className="text-xs text-muted-foreground text-center leading-tight">
                                                {tech.name}
                                            </span>
                                        </div>
                                    ))}
                                    {preview && category.items.length > itemsPerCategory - 1 && (
                                        <div className="flex flex-col items-center gap-1.5 p-2">
                                            <Link
                                                href="/tech"
                                                className="w-16 h-16 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                            >
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    +
                                                    {category.items.length - (itemsPerCategory - 1)}
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {mobileCategories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    scrollRef.current?.scrollTo({
                                        left: index * (scrollRef.current?.offsetWidth || 0),
                                        behavior: "smooth",
                                    });
                                }}
                                className={`h-1.5 rounded-full transition-all ${
                                    currentCategory === index
                                        ? "w-4 bg-primary"
                                        : "w-1.5 bg-muted-foreground/30"
                                }`}
                                aria-label={`Catégorie ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Grid of blocks */}
                <TooltipProvider>
                    <div className="hidden lg:block lg:columns-4 gap-4">
                        {techCategories.map((category) => (
                            <div
                                key={category.name}
                                className="bg-muted/30 rounded-xl p-4 border border-border/50 break-inside-avoid mb-4"
                            >
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
                                    {category.name}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-1.5">
                                    {category.items.map((tech) => (
                                        <Tooltip key={tech.name}>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href={tech.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                                >
                                                    <Image
                                                        src={tech.icon}
                                                        alt={tech.name}
                                                        width={24}
                                                        height={24}
                                                        className={`w-6 h-6 ${darkInvertIcons.includes(tech.name) ? "dark:invert" : darkInvertHueIcons.includes(tech.name) ? "invert-hue" : ""}`}
                                                    />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{tech.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
        </div>
    );
}