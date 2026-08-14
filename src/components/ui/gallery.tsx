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

const containerStyle = (item: Certification, ratio: string | undefined, size: number) => {
    if (item.shape === "round") return { width: size, height: size };
    if (ratio) return { width: "100%", aspectRatio: ratio };
    if (item.shape === "rectangle") return { width: "100%", aspectRatio: "3/2" };
    return { width: size, height: size };
};

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
 * Single badge item with image, label and optional level/type badges.
 *
 * @param props - Component props
 * @param props.item - The certification to render
 * @param props.size - Image size in pixels
 * @param props.ratio - Aspect ratio override (e.g. "16/9")
 * @param props.loaded - Whether the image has finished loading
 * @param props.priority - Whether to use Next.js priority loading
 * @param props.onLoad - Callback fired when the image loads
 * @param props.labelClass - Extra classes for the label text
 * @returns The rendered badge item
 */
function BadgeItem({
    item,
    size,
    ratio,
    loaded,
    priority,
    onLoad,
    labelClass,
}: {
    item: Certification;
    size: number;
    ratio: string | undefined;
    loaded: boolean;
    priority?: boolean;
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    labelClass?: string;
}) {
    const rounding = badgeRounding(item);
    return (
        <>
            <div className="relative" style={containerStyle(item, ratio, size)}>
                {!loaded && <Skeleton className={`absolute inset-0 ${rounding}`} />}
                <Image
                    src={item.icon}
                    alt={item.name}
                    width={size}
                    height={size}
                    className={`${rounding} object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                    style={{ width: "100%", height: "100%" }}
                    priority={priority}
                    onLoad={onLoad}
                />
                {item.counter !== undefined && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#4285F4] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.counter}
                    </span>
                )}
            </div>
            <span className={`text-xs text-center leading-tight line-clamp-2 ${labelClass ?? ""}`}>
                {item.name}
            </span>
            {item.level && (
                <Badge variant="outline" className="text-[10px] py-0">
                    {item.level}
                </Badge>
            )}
            {item.type && (
                <Badge
                    variant={item.type === "Examen" ? "default" : "outline"}
                    className="text-[10px] py-0"
                >
                    {item.type}
                </Badge>
            )}
        </>
    );
}

/**
 * Full-page gallery for displaying categorised certification badges.
 *
 * @param props - Component props
 * @param props.categories - List of badge/certification categories to display
 * @param props.title - Page heading
 * @param props.subtitle - Subheading (e.g. badge count)
 * @param props.backHref - URL for the back button (default: "/")
 * @param props.relatedPages - Optional list of related gallery pages
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
    const [panelHeight, setPanelHeight] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
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

    useEffect(() => {
        const el = contentRefs.current[currentCategory];
        if (!el) return;

        const measure = () => {
            const h = el.scrollHeight;
            if (h > 0) setPanelHeight(h);
        };
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [currentCategory, loaded]);

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
                        className="-mx-4 transition-[height] duration-300"
                        style={{
                            ...(panelHeight ? { height: panelHeight } : {}),
                            overflowY: "clip",
                        }}
                    >
                        <div
                            ref={scrollRef}
                            className="flex items-start snap-x snap-mandatory overflow-x-auto scrollbar-hide px-4"
                        >
                            {categories.map((category, categoryIndex) => (
                                <div
                                    key={category.name}
                                    className="flex-shrink-0 w-full snap-center px-2"
                                >
                                    <div
                                        ref={(el) => {
                                            contentRefs.current[categoryIndex] = el;
                                        }}
                                    >
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                                            {category.name}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {category.items.map((item, itemIndex) => {
                                                const sizes = badgeSizes[item.shape ?? "square"];
                                                const isExternal = !item.url.startsWith("/");
                                                return (
                                                    <Link
                                                        key={item.name}
                                                        href={item.url}
                                                        {...(isExternal && {
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                        })}
                                                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors mx-auto w-full"
                                                        style={{ maxWidth: sizes.container }}
                                                    >
                                                        <BadgeItem
                                                            item={item}
                                                            size={sizes.mobile}
                                                            ratio={aspectRatios[item.icon]}
                                                            loaded={loaded.has(item.icon)}
                                                            priority={
                                                                categoryIndex === 0 &&
                                                                itemIndex === 0
                                                            }
                                                            onLoad={(e) =>
                                                                handleImageLoad(item.icon, e)
                                                            }
                                                        />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        {categories.map((category, categoryIndex) => (
                            <div key={category.name}>
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                                    {category.name}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {category.items.map((item, itemIndex) => {
                                        const sizes = badgeSizes[item.shape ?? "square"];
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
                                                            maxWidth: 200,
                                                            width: sizes.container,
                                                        }}
                                                    >
                                                        <BadgeItem
                                                            item={item}
                                                            size={sizes.desktop}
                                                            ratio={aspectRatios[item.icon]}
                                                            loaded={loaded.has(item.icon)}
                                                            priority={
                                                                categoryIndex === 0 &&
                                                                itemIndex === 0
                                                            }
                                                            onLoad={(e) =>
                                                                handleImageLoad(item.icon, e)
                                                            }
                                                            labelClass="text-muted-foreground"
                                                        />
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