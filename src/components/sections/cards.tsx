"use client";

import {
    Award,
    Briefcase,
    BriefcaseBusiness,
    CalendarDays,
    Database,
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { badges, contributions, profile, projects } from "@/data/profile";
import { useApi } from "@/hooks/api";
import { useDragScroll } from "@/hooks/scroll";

const iconMap = {
    calendar: CalendarDays,
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
 * @param props.className - Optional CSS class.
 */
function ParcoursCard({
    stats,
    className,
}: {
    stats: ReturnType<typeof useApi>["stats"];
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
                        <DialogContent aria-describedby={undefined}>
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
                        <span className="font-medium">{stats?.frontend || "8 ans"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Back-End</span>
                        <span className="font-medium">{stats?.backend || "5 ans"}</span>
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
 * @param props.className - Optional CSS class.
 */
function GitHubCard({
    stats,
    className,
}: {
    stats: ReturnType<typeof useApi>["stats"];
    className?: string;
}) {
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
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Contributions aujourd'hui</span>
                        <span className="font-medium">{stats?.today || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Contributions ce mois</span>
                        <span className="font-medium">{stats?.this_month || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Contributions l'an dernier</span>
                        <span className="font-medium">{stats?.last_year || "—"}</span>
                    </div>
                </div>
                <div className="border-t pt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                        <GitPullRequest className="h-3 w-3" />
                        <span>Contributions importantes</span>
                    </div>
                    {contributions.map((pr) => (
                        <a
                            key={pr.url}
                            href={pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate hover:text-primary"
                        >
                            <span className="text-muted-foreground">{pr.repo}:</span> {pr.title}
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
 * @param props.badgeGridClass - Optional grid layout class.
 */
function CertificationsCard({
    className,
    badgeGridClass,
}: {
    className?: string;
    badgeGridClass?: string;
}) {
    return (
        <Card className={`card-hover flex flex-col ${className || ""}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm lg:text-base xl:text-lg font-medium">
                    <Award className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-primary" />
                    Certifications
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center">
                <TooltipProvider>
                    <div
                        className={
                            badgeGridClass || "grid grid-cols-3 gap-2 place-items-center w-full"
                        }
                    >
                        {badges.map((badge) => (
                            <Tooltip key={badge.name}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={badge.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 xl:p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <Image
                                            src={`/icons/${badge.icon}.svg`}
                                            alt={badge.name}
                                            width={44}
                                            height={44}
                                            className="xl:w-14 xl:h-14"
                                        />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{badge.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
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
export function InfoCards() {
    const { stats } = useApi();
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
                    <ParcoursCard stats={stats} className="w-full max-w-lg" />
                </div>
                <div className="flex-shrink-0 w-full snap-center flex justify-center px-4">
                    <GitHubCard stats={stats} className="w-full max-w-lg" />
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
                <ParcoursCard stats={stats} />
                <GitHubCard stats={stats} />
                <CertificationsCard badgeGridClass="grid grid-cols-2 md:grid-cols-3 gap-2 xl:gap-4 place-items-center w-full" />
            </div>
        </div>
    );
}