"use client";

import { ArrowLeft, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Certification, CertificationCategory } from "@/data/achievements";
import { useDragScroll } from "@/hooks/scroll";

interface RelatedPage {
    label: string;
    href: string;
    count: number;
}

interface GalleryProps {
    categories: CertificationCategory[];
    title: string;
    subtitle: string;
    backHref?: string;
    relatedPages?: RelatedPage[];
}

const badgeSizes = {
    square: { mobile: 96, desktop: 160, container: 180 },
    round: { mobile: 80, desktop: 120, container: 160 },
    rectangle: { mobile: 160, desktop: 220, container: 240 },
} as const;

const badgeRounding = (item: Certification) =>
    item.shape === "round"
        ? "rounded-full"
        : item.provider === "cisco"
          ? "rounded-xl"
          : "rounded-[2.5px]";

const maxContainer = 200;
const tooltipSize = 220;

/**
 * Tooltip popup content for a single certification badge.
 *
 * @param props - Component props
 * @param props.cert - The certification to display
 * @returns The rendered tooltip content
 */
export function GalleryTooltipContent({ cert }: { cert: Certification }) {
    return (
        <TooltipContent
            side="top"
            className="p-0 bg-background text-foreground border rounded-xl shadow-xl w-[250px]"
        >
            <div className="flex flex-col items-center gap-3 p-4">
                <div className="relative">
                    <Image
                        src={cert.icon}
                        alt={cert.name}
                        width={tooltipSize}
                        height={tooltipSize}
                        className="rounded-[2.5px] object-contain"
                        style={{ width: tooltipSize, height: "auto" }}
                    />
                    {cert.counter !== undefined && (
                        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#4285F4] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                            {cert.counter}
                        </span>
                    )}
                </div>
                <div className="text-center space-y-1">
                    <p className="font-medium text-sm leading-tight">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {cert.provider === "cisco" ? "Cisco Networking Academy" : "Google Cloud"}
                    </p>
                    {cert.date && (
                        <p className="text-xs text-muted-foreground">Obtenu le {cert.date}</p>
                    )}
                    {cert.level && (
                        <Badge variant="outline" className="text-[10px] py-0">
                            {cert.level}
                        </Badge>
                    )}
                    {cert.type && (
                        <Badge
                            variant={cert.type === "Examen" ? "default" : "outline"}
                            className="text-[10px] py-0"
                        >
                            {cert.type}
                        </Badge>
                    )}
                </div>
            </div>
        </TooltipContent>
    );
}

/**
 * Full-page gallery for displaying categorised certification badges.
 *
 * @param props - Component props
 * @param props.categories - List of badge/certification categories to display
 * @param props.title - Page heading
 * @param props.subtitle - Subheading (e.g. badge count)
 * @returns The rendered gallery page layout
 */
export function Gallery({
    categories,
    title,
    subtitle,
    backHref = "/",
    relatedPages,
}: GalleryProps) {
    const [currentCategory, setCurrentCategory] = useState(0);
    const [relatedOpen, setRelatedOpen] = useState(false);
    const [loaded, setLoaded] = useState<Set<string>>(new Set());
    const [aspectRatios, setAspectRatios] = useState<Record<string, string>>({});
    const scrollRef = useRef<HTMLDivElement>(null);
    useDragScroll(scrollRef);

    const handleImageLoad = useCallback(
        (icon: string, e: React.SyntheticEvent<HTMLImageElement>) => {
            setLoaded((prev) => new Set(prev).add(icon));
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth > 0 && naturalHeight > 0 && naturalWidth !== naturalHeight) {
                setAspectRatios((prev) => ({
                    ...prev,
                    [icon]: `${naturalWidth}/${naturalHeight}`,
                }));
            }
        },
        []
    );

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        const maxScroll = scrollWidth - offsetWidth;
        if (maxScroll <= 0) return;
        const newIndex = Math.round((scrollLeft / maxScroll) * (categories.length - 1));
        if (newIndex !== currentCategory && newIndex >= 0 && newIndex < categories.length) {
            setCurrentCategory(newIndex);
        }
    }, [currentCategory, categories.length]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-7xl">
                {/* Navigation */}
                <div className="mb-8 flex justify-between items-center">
                    <Link href={backHref}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    {relatedPages && relatedPages.length > 0 && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setRelatedOpen(true)}
                            >
                                <Award className="h-4 w-4" />
                            </Button>
                            <Dialog open={relatedOpen} onOpenChange={setRelatedOpen}>
                                <DialogContent className="sm:max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>Voir aussi</DialogTitle>
                                        <DialogDescription>Autres galeries</DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-2">
                                        {relatedPages.map((page) => (
                                            <Button
                                                key={page.href}
                                                variant="outline"
                                                asChild
                                                className="justify-between"
                                            >
                                                <Link href={page.href}>
                                                    {page.label}
                                                    <span className="text-muted-foreground text-xs">
                                                        {page.count}
                                                    </span>
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">{title}</h1>
                    <p className="text-xl text-muted-foreground">{subtitle}</p>
                </div>

                {/* Mobile: Carousel */}
                <div className="lg:hidden flex flex-col">
                    <div
                        ref={scrollRef}
                        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide -mx-4 px-4"
                    >
                        {categories.map((category, categoryIndex) => (
                            <div
                                key={category.name}
                                className="flex-shrink-0 w-full snap-center px-2"
                            >
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                                    {category.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {category.items.map((item, itemIndex) => {
                                        const sizes = badgeSizes[item.shape ?? "square"];
                                        const isExternal = !item.url.startsWith("/");
                                        const ratio = aspectRatios[item.icon];
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.url}
                                                {...(isExternal && {
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                })}
                                                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div
                                                    className="relative"
                                                    style={
                                                        ratio
                                                            ? { width: "100%", aspectRatio: ratio }
                                                            : {}
                                                    }
                                                >
                                                    {!loaded.has(item.icon) && (
                                                        <Skeleton
                                                            className={`absolute inset-0 ${badgeRounding(item)}`}
                                                        />
                                                    )}
                                                    <Image
                                                        src={item.icon}
                                                        alt={item.name}
                                                        width={sizes.mobile}
                                                        height={sizes.mobile}
                                                        className={`${badgeRounding(item)} object-contain transition-opacity duration-300 ${loaded.has(item.icon) ? "opacity-100" : "opacity-0"}`}
                                                        style={{
                                                            width: ratio ? "100%" : sizes.mobile,
                                                            height: ratio ? "auto" : sizes.mobile,
                                                        }}
                                                        priority={
                                                            categoryIndex === 0 && itemIndex === 0
                                                        }
                                                        onLoad={(e) =>
                                                            handleImageLoad(item.icon, e)
                                                        }
                                                    />
                                                    {item.counter !== undefined && (
                                                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#4285F4] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                            {item.counter}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-center leading-tight line-clamp-2">
                                                    {item.name}
                                                </span>
                                                {item.level && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] py-0"
                                                    >
                                                        {item.level}
                                                    </Badge>
                                                )}
                                                {item.type && (
                                                    <Badge
                                                        variant={
                                                            item.type === "Examen"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="text-[10px] py-0"
                                                    >
                                                        {item.type}
                                                    </Badge>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dot indicators */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {categories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    scrollRef.current?.scrollTo({
                                        left: index * (scrollRef.current?.offsetWidth || 0),
                                        behavior: "smooth",
                                    })
                                }
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

                {/* Desktop: Stacked categories */}
                <TooltipProvider>
                    <div className="hidden lg:flex flex-col gap-8">
                        {categories.map((category) => (
                            <div key={category.name}>
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                                    {category.name}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {category.items.map((item) => {
                                        const sizes = badgeSizes[item.shape ?? "square"];
                                        const ratio = aspectRatios[item.icon];
                                        return (
                                            <Tooltip key={item.name}>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={item.url}
                                                        {...(!item.url.startsWith("/") && {
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                        })}
                                                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                                        style={{
                                                            maxWidth: maxContainer,
                                                            width: sizes.container,
                                                        }}
                                                    >
                                                        <div
                                                            className="relative"
                                                            style={
                                                                ratio
                                                                    ? {
                                                                          width: "100%",
                                                                          aspectRatio: ratio,
                                                                      }
                                                                    : {}
                                                            }
                                                        >
                                                            {!loaded.has(item.icon) && (
                                                                <Skeleton
                                                                    className={`absolute inset-0 ${badgeRounding(item)}`}
                                                                />
                                                            )}
                                                            <Image
                                                                src={item.icon}
                                                                alt={item.name}
                                                                width={sizes.desktop}
                                                                height={sizes.desktop}
                                                                className={`${badgeRounding(item)} object-contain transition-opacity duration-300 ${loaded.has(item.icon) ? "opacity-100" : "opacity-0"}`}
                                                                style={{
                                                                    width: sizes.desktop,
                                                                    height: ratio
                                                                        ? "auto"
                                                                        : sizes.desktop,
                                                                }}
                                                                onLoad={(e) =>
                                                                    handleImageLoad(item.icon, e)
                                                                }
                                                            />
                                                            {item.counter !== undefined && (
                                                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#4285F4] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                                    {item.counter}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground text-center leading-tight line-clamp-2">
                                                            {item.name}
                                                        </span>
                                                        {item.level && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] py-0"
                                                            >
                                                                {item.level}
                                                            </Badge>
                                                        )}
                                                        {item.type && (
                                                            <Badge
                                                                variant={
                                                                    item.type === "Examen"
                                                                        ? "default"
                                                                        : "outline"
                                                                }
                                                                className="text-[10px] py-0"
                                                            >
                                                                {item.type}
                                                            </Badge>
                                                        )}
                                                    </Link>
                                                </TooltipTrigger>
                                                <GalleryTooltipContent cert={item} />
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
        </div>
    );
}