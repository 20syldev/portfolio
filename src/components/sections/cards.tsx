"use client";

import {
    Award,
    BookOpen,
    Briefcase,
    BriefcaseBusiness,
    CalendarDays,
    ChartBar,
    Database,
    Dot,
    Download,
    Github,
    GitPullRequest,
    Globe,
    GraduationCap,
    LucideBookOpenText,
    Plane,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Sparkline } from "@/components/stats/chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { GalleryTooltipContent } from "@/components/ui/gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Certification,
    certifications,
    completionBadges,
    gdevBadges,
    totalCertifications,
    totalCompletionBadges,
    totalGdevBadges,
} from "@/data/achievements";
import { contributions } from "@/data/contributions";
import { profile, projects } from "@/data/profile";
import { projects as allProjects } from "@/data/projects";
import { useApi } from "@/hooks/api";
import { useDragScroll } from "@/hooks/scroll";
import { random } from "@/lib/utils";

const certPool: Certification[] = certifications.flatMap((cat) => cat.items);
const completionPool: Certification[] = completionBadges.flatMap((cat) => cat.items);
const gdevPool: Certification[] = gdevBadges.flatMap((cat) => cat.items);

const pools = [certPool, completionPool, gdevPool];
const certDisplayCount = 12;
const certMaxRows = 2;

/**
 * Returns N random certifications from a random pool.
 * Ensures that the same pool is not picked consecutively to maintain variety.
 *
 * @param n - Number of items to pick
 * @param excludeIndex - Pool index to exclude (ensures category alternation)
 * @returns The selected items and the pool index used
 */
function pickRandomCerts(
    n: number,
    excludeIndex?: number
): { items: Certification[]; poolIndex: number } {
    const candidates = pools.map((pool, i) => ({ pool, i })).filter(({ i }) => i !== excludeIndex);
    const { pool, i } = candidates[Math.floor(Math.random() * candidates.length)];
    return { items: random.shuffle(pool).slice(0, n), poolIndex: i };
}

const iconMap = {
    calendar: CalendarDays,
    chart: ChartBar,
    database: Database,
    plane: Plane,
};

const count = 3;

/**
 * Education and work experience card.
 * Displays school, degree, work experience and years of experience.
 *
 * @param props - Component properties.
 * @param props.stats - API stats for experience years.
 * @param props.loading - Whether API data is still loading.
 * @param props.className - Optional CSS class.
 */
function ParcoursCard({
    stats,
    loading,
    className,
}: {
    stats: ReturnType<typeof useApi>["stats"];
    loading?: boolean;
    className?: string;
}) {
    return (
        <Card className={`card-hover ${className || ""}`}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm lg:text-base xl:text-lg font-medium">
                    <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-primary" />
                    Parcours
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 lg:space-y-4 xl:space-y-5 text-sm lg:text-base xl:text-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{profile.education.school}</p>
                        <p className="text-xs text-muted-foreground">
                            {profile.education.degree} ({profile.education.duration})
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                Projets
                                <LucideBookOpenText className="ml-1 h-3 w-3" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                            <DialogHeader>
                                <DialogTitle>Projets Ensitech</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                                {projects.map((project) => {
                                    const Icon = iconMap[project.icon as keyof typeof iconMap];
                                    return (
                                        <div
                                            key={project.repo}
                                            className="flex items-center gap-4 p-3 rounded-lg border"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{project.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {project.description}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {allProjects.some((p) => p.id === project.repo) && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Link href={`/projet/${project.repo}`}>
                                                            <BookOpen className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {project.link && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <a
                                                            href={project.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Globe className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {project.repo && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <a
                                                            href={`https://github.com/20syldev/${project.repo}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Github className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {project.repo && project.branch && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <a
                                                            href={`https://github.com/20syldev/${project.repo}/archive/refs/heads/${project.branch}.zip`}
                                                            download
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{profile.work.company}</span>
                        </div>
                        <Link href="/alternance/" scroll={false}>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                Projets
                                <BriefcaseBusiness className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{profile.work.role}</p>
                </div>
                <div className="border-t pt-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Front-End</span>
                        <span className="font-medium">
                            {loading ? (
                                <Skeleton className="inline-block h-3 w-10 align-middle" />
                            ) : (
                                stats?.frontend || "8 ans"
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Back-End</span>
                        <span className="font-medium">
                            {loading ? (
                                <Skeleton className="inline-block h-3 w-10 align-middle" />
                            ) : (
                                stats?.backend || "5 ans"
                            )}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * GitHub profile card.
 * Displays commit counts and notable contributions.
 *
 * @param props - Component properties.
 * @param props.stats - API stats for commit counts.
 * @param props.loading - Whether API data is still loading.
 * @param props.className - Optional CSS class.
 */
function GitHubCard({
    stats,
    loading,
    className,
}: {
    stats: ReturnType<typeof useApi>["stats"];
    loading?: boolean;
    className?: string;
}) {
    const [displayed] = useState(() => random.shuffle(contributions).slice(0, 2));

    return (
        <Card className={`card-hover ${className || ""}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm lg:text-base xl:text-lg font-medium">
                    <Github className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-primary" />
                    GitHub
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 lg:space-y-4 xl:space-y-5 text-sm lg:text-base xl:text-lg">
                <a
                    href="https://github.com/20syldev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium hover:text-primary"
                >
                    @20syldev
                </a>
                <Link href="/stats">
                    {loading ? (
                        <Skeleton className="h-[75px] w-full rounded" />
                    ) : (
                        <Sparkline data={stats?.activity} className="w-full h-[75px]" interactive />
                    )}
                </Link>
                <div className="border-t pt-3 mt-2 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-1.5 text-muted-foreground mb-2">
                        <div className="flex items-center gap-1.5">
                            <GitPullRequest className="h-3 w-3" />
                            <span>Contributions externes</span>
                        </div>
                        <Link
                            href="/contributions"
                            className="hover:text-primary transition-colors"
                        >
                            Voir les {contributions.length} contributions
                        </Link>
                    </div>
                    {displayed.map((pr) => (
                        <a
                            key={pr.url}
                            href={pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 hover:text-primary"
                        >
                            <span className="truncate text-muted-foreground">{pr.repo}</span>
                            <span className="shrink-0 truncate max-w-[45%]">{pr.title}</span>
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Certifications card.
 * Displays certification badges in a grid layout.
 *
 * @param props - Component properties.
 * @param props.className - Optional CSS class.
 */
function CertificationsCard({ className }: { className?: string }) {
    const [displayed, setDisplayed] = useState<Certification[]>([]);
    const [visible, setVisible] = useState(true);
    const [loaded, setLoaded] = useState<Set<string>>(new Set());
    const lastPoolIndex = useRef<number | undefined>(undefined);

    useEffect(() => {
        const initial = pickRandomCerts(certDisplayCount);
        setDisplayed(initial.items);
        lastPoolIndex.current = initial.poolIndex;

        let timeout: ReturnType<typeof setTimeout>;
        const timer = setInterval(() => {
            setVisible(false);
            timeout = setTimeout(() => {
                const result = pickRandomCerts(certDisplayCount, lastPoolIndex.current);
                setLoaded(new Set());
                setDisplayed(result.items);
                lastPoolIndex.current = result.poolIndex;
                setVisible(true);
            }, 300);
        }, 7000);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }, []);

    const handleImageLoad = useCallback((icon: string) => {
        setLoaded((prev) => new Set(prev).add(icon));
    }, []);

    return (
        <Card className={`card-hover flex flex-col ${className || ""}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm lg:text-base xl:text-lg font-medium">
                    <Award className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-primary" />
                    Certifications
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <TooltipProvider>
                        <div
                            className={`grid gap-3 place-items-center w-full transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
                            style={{
                                gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
                                maxHeight: `calc(${certMaxRows} * 60px + ${certMaxRows - 1} * 12px)`,
                                overflow: "hidden",
                            }}
                        >
                            {displayed.map((cert) => (
                                <Tooltip key={cert.name}>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={cert.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative w-[60px] h-[60px] flex items-center justify-center"
                                        >
                                            {!loaded.has(cert.icon) && (
                                                <Skeleton className="absolute inset-0 rounded-md" />
                                            )}
                                            <Image
                                                src={cert.icon}
                                                alt={cert.name}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-contain"
                                                style={{ width: 60, height: 60 }}
                                                onLoad={() => handleImageLoad(cert.icon)}
                                            />
                                        </a>
                                    </TooltipTrigger>
                                    <GalleryTooltipContent cert={cert} />
                                </Tooltip>
                            ))}
                        </div>
                    </TooltipProvider>
                </div>
                <div className="flex justify-center gap-3 border-t pt-3">
                    <Link
                        href="/certifications"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        <span className="sm:hidden">Tout voir</span>
                        <span className="hidden sm:inline">
                            +{totalCertifications} certifications
                        </span>
                    </Link>
                    <span className="hidden sm:inline">
                        <Dot className="h-3 w-3 text-muted-foreground" />
                    </span>
                    <Link
                        href="/completion"
                        className="hidden sm:inline text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        +{totalCompletionBadges} complétion
                    </Link>
                    <span className="hidden sm:inline">
                        <Dot className="h-3 w-3 text-muted-foreground" />
                    </span>
                    <Link
                        href="/badges"
                        className="hidden sm:inline text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        +{totalGdevBadges} badges
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Info cards grid.
 * Displays Career, GitHub, and Certifications cards.
 * Carousel on mobile, grid on tablet/desktop.
 *
 * @returns The rendered info cards section
 */
export function Cards() {
    const { stats, loading } = useApi();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    useDragScroll(scrollRef);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, clientWidth } = scrollRef.current;
        setScrollProgress(scrollLeft / clientWidth);
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    /**
     * Scroll to card.
     * Scrolls the carousel to a specific card by index.
     *
     * @param index - The card index to scroll to.
     */
    function scrollToCard(index: number) {
        if (!scrollRef.current) return;
        const { clientWidth } = scrollRef.current;
        scrollRef.current.scrollTo({ left: index * clientWidth, behavior: "smooth" });
    }

    /**
     * Get dot width.
     * Calculates carousel indicator dot width based on scroll position.
     *
     * @param index - The dot index.
     * @returns The calculated width in pixels.
     */
    function getDotWidth(index: number) {
        const distance = Math.abs(scrollProgress - index);
        const width = Math.max(0, 1 - distance) * 16 + 8;
        return width;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Mobile/Tablet carousel */}
            <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory overflow-x-auto py-3 scrollbar-hide lg:hidden"
            >
                <div className="flex-shrink-0 w-full snap-center flex justify-center px-4">
                    <ParcoursCard stats={stats} loading={loading} className="w-full max-w-lg" />
                </div>
                <div className="flex-shrink-0 w-full snap-center flex justify-center px-4">
                    <GitHubCard stats={stats} loading={loading} className="w-full max-w-lg" />
                </div>
                <div className="flex-shrink-0 w-full snap-center flex justify-center px-4">
                    <CertificationsCard className="w-full max-w-lg" />
                </div>
            </div>

            {/* Mobile/Tablet dots */}
            <div className="flex justify-center gap-2 lg:hidden">
                {Array.from({ length: count }).map((_, index) => {
                    const isActive = Math.abs(scrollProgress - index) < 0.5;
                    return (
                        <button
                            key={index}
                            onClick={() => scrollToCard(index)}
                            className={`h-2 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`}
                            style={{ width: getDotWidth(index) }}
                            aria-label={`Carte ${index + 1}`}
                        />
                    );
                })}
            </div>

            {/* Desktop grid */}
            <div className="hidden lg:grid gap-4 lg:grid-cols-3 xl:gap-8">
                <ParcoursCard stats={stats} loading={loading} />
                <GitHubCard stats={stats} loading={loading} />
                <CertificationsCard />
            </div>
        </div>
    );
}