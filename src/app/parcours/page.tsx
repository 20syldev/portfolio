"use client";

import {
    ArrowLeft,
    BookOpen,
    Bot,
    Briefcase,
    BriefcaseBusiness,
    CalendarDays,
    Car,
    ChartBar,
    CircleQuestionMark,
    Database,
    Dot,
    Download,
    FileText,
    Github,
    Globe,
    GraduationCap,
    Plane,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Period } from "@/components/ui/period";
import { Tags } from "@/components/ui/tags";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useViewer } from "@/components/utils/viewer";
import {
    alternance,
    bac,
    parcours,
    type ParcoursEntry,
    type ParcoursProject,
    type ParcoursWork,
} from "@/data/parcours";
import { projects as allProjects } from "@/data/projects";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useSmoothScroll } from "@/hooks/scroll";
import { tabs, urls } from "@/lib/nav";

const iconMap = {
    bot: Bot,
    calendar: CalendarDays,
    car: Car,
    chart: ChartBar,
    database: Database,
    plane: Plane,
};

/**
 * Vertical span of the company rail, from the first work marker to the last.
 * Measured rather than hardcoded, so the rail starts where the company story starts instead
 * of running the whole height like the school rail does.
 *
 * @returns A ref to put on the timeline, and the span to apply to the rail
 */
function useCompanyRail() {
    const ref = useRef<HTMLDivElement>(null);
    const [span, setSpan] = useState<{ top: number; height: number } | null>(null);

    const measure = useCallback(() => {
        const root = ref.current;
        if (!root) return;

        const marks = root.querySelectorAll<HTMLElement>("[data-work-marker]");
        if (marks.length === 0 || marks[0].offsetParent === null) return setSpan(null);

        const base = root.getBoundingClientRect();
        const first = marks[0].getBoundingClientRect();
        const last = marks[marks.length - 1].getBoundingClientRect();
        const top = first.top - base.top + first.height / 2;
        setSpan({ top, height: last.top - base.top + last.height / 2 - top });
    }, []);

    useLayoutEffect(() => {
        measure();
        const root = ref.current;
        if (!root) return;

        const observer = new ResizeObserver(measure);
        observer.observe(root);
        document.fonts?.ready.then(measure);

        return () => observer.disconnect();
    }, [measure]);

    return { ref, span };
}

/**
 * Roles held while a formation was running.
 * Compares real bounds so a contract starting days after a formation ends does not
 * attach itself to both.
 *
 * @param entry - The formation to look up
 * @returns The roles overlapping that formation, most recent first
 */
function rolesFor(entry: ParcoursEntry): ParcoursWork[] {
    return alternance.filter((work) => work.start <= entry.end && work.end >= entry.start);
}

/**
 * Card for a single school project.
 * Links to the project documentation when it exists, plus demo, GitHub and archive.
 *
 * @param props - Component properties
 * @param props.project - The school project to display
 * @returns The rendered project card
 */
function ProjectCard({ project }: { project: ParcoursProject }) {
    const Icon = iconMap[project.icon as keyof typeof iconMap] ?? BookOpen;

    const doc = allProjects.find((p) => p.id === project.repo);
    const documented = doc !== undefined;
    const tags = doc?.tags ?? project.tags;

    const { versions } = useApi();
    const version = versions?.[getApiKey(project.repo)];

    return (
        <div className="card-hover flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="flex justify-between items-center gap-2 font-medium leading-tight">
                        {project.name}
                        {version && (
                            <Badge variant="outline" className="text-[10px] font-normal">
                                {version}
                            </Badge>
                        )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{project.description}</p>
                </div>
            </div>

            {tags && tags.length > 0 && <Tags tags={tags} maxVisible={4} />}

            <div className="mt-auto flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                    {project.to ? (
                        <Period from={project.from!} to={project.to} iconClassName="h-2.5 w-2.5" />
                    ) : (
                        project.from
                    )}
                </span>
                <div className="flex shrink-0 gap-2">
                    {documented && (
                        <Button asChild variant="outline" size="icon" className="h-8 w-8">
                            <Link
                                href={`/projet/${project.repo}`}
                                aria-label={`Documentation de ${project.name}`}
                            >
                                <BookOpen className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                    {project.link && (
                        <Button asChild variant="outline" size="icon" className="h-8 w-8">
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Voir ${project.name} en ligne`}
                            >
                                <Globe className="h-4 w-4" />
                            </a>
                        </Button>
                    )}
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <a
                            href={`https://github.com/20syldev/${project.repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Code source de ${project.name}`}
                        >
                            <Github className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <a
                            href={`https://github.com/20syldev/${project.repo}/archive/refs/heads/${project.branch}.zip`}
                            download
                            aria-label={`Télécharger l'archive de ${project.name}`}
                        >
                            <Download className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * One work-study role, hung on the company rail that runs down the right edge.
 * Giving the company its own axis keeps the school rail uncluttered and, since the rail is
 * continuous, successive contracts read as one uninterrupted stint.
 *
 * @param props - Component properties
 * @param props.work - The work-study role to display
 * @returns The rendered role block
 */
function WorkRole({ work }: { work: ParcoursWork }) {
    return (
        <div className="relative flex items-start justify-between gap-4 lg:block lg:text-right">
            <span
                aria-hidden
                data-work-marker
                className={`absolute -right-[39px] top-3 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-4 ring-background lg:block ${
                    work.current
                        ? "bg-primary"
                        : "border-2 border-muted-foreground/60 bg-background"
                }`}
            />
            <div className="min-w-0">
                <p className="flex items-center gap-1.5 lg:justify-end">
                    <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="font-medium">{work.company}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{work.role}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                    <Period from={work.from} to={work.to} />
                </p>
            </div>
            {work.href && (
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-7 shrink-0 text-xs lg:mt-4"
                >
                    <Link href={work.href} scroll={false}>
                        Projets
                        <BriefcaseBusiness className="ml-1 h-3 w-3" />
                    </Link>
                </Button>
            )}
        </div>
    );
}

/**
 * One formation of the timeline, with its school projects.
 *
 * @param props - Component properties
 * @param props.entry - The formation to display
 * @returns The rendered timeline section
 */
function ParcoursSection({ entry }: { entry: ParcoursEntry }) {
    const roles = rolesFor(entry);
    const { openPdf } = useViewer();

    return (
        <section id={entry.id} className="relative">
            <span
                aria-hidden
                className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ring-4 ring-background ${
                    entry.status === "upcoming"
                        ? "border-2 border-primary bg-background"
                        : "bg-primary"
                }`}
            />

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-10">
                <div className="pl-7 sm:pl-10">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold sm:text-xl">{entry.school}</h2>
                        {entry.status === "upcoming" && (
                            <Badge variant="outline" className="text-xs">
                                À venir
                            </Badge>
                        )}
                        <Badge
                            variant="secondary"
                            className="ml-auto shrink-0 whitespace-nowrap text-xs"
                        >
                            <Period from={entry.from} to={entry.to} />
                        </Badge>
                    </div>
                    <p className="flex flex-wrap items-center text-sm text-muted-foreground">
                        {entry.degree}
                        {entry.field && (
                            <>
                                <Dot className="h-4 w-4 shrink-0" aria-hidden />
                                {entry.field}
                            </>
                        )}
                    </p>

                    {entry.description && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {entry.description}
                        </p>
                    )}

                    {entry.skills && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {entry.skillsNote ? (
                                <>
                                    {entry.skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            asChild
                                            variant="secondary"
                                            className="group relative px-1.5 py-0 text-[10px] xl:text-xs"
                                        >
                                            <button type="button">
                                                <span className="opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                                                    {skill}
                                                </span>
                                                <span
                                                    aria-hidden
                                                    className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0 group-focus:opacity-0"
                                                >
                                                    <Sparkles className="h-3 w-3" />
                                                </span>
                                            </button>
                                        </Badge>
                                    ))}
                                </>
                            ) : (
                                <Tags tags={entry.skills} maxVisible={5} />
                            )}
                            {entry.skillsNote && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            aria-label={entry.skillsNote}
                                            className="text-muted-foreground/70 transition-colors hover:text-foreground"
                                        >
                                            <CircleQuestionMark className="h-3.5 w-3.5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>{entry.skillsNote}</TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    )}
                </div>

                {roles.length > 0 && (
                    <aside className="mt-4 space-y-5 pl-7 sm:pl-10 lg:mt-0 lg:pl-0 lg:pr-10">
                        {roles.map((work) => (
                            <WorkRole key={work.id} work={work} />
                        ))}
                    </aside>
                )}
            </div>

            {entry.projects && (
                <div className="mt-5 pl-7 sm:pl-10">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <GraduationCap className="h-4 w-4" aria-hidden />
                            Projets réalisés
                        </h3>
                        {entry.document && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={(e) =>
                                    openPdf(entry.document!.file, entry.document!.label, e)
                                }
                            >
                                {entry.document.label}
                                <FileText className="ml-1 h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {entry.projects.map((project) => (
                            <ProjectCard key={project.repo} project={project} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

/**
 * Dedicated page archiving the academic path as a vertical timeline.
 * Lists each school with its degree, skills, work-study position and school projects.
 *
 * @returns The rendered parcours page
 */
export default function ParcoursPage() {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();
    const { ref: railRef, span: companyRail } = useCompanyRail();
    const totalProjects = parcours.reduce((acc, entry) => acc + (entry.projects?.length ?? 0), 0);

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <Nav currentTab={-1} tabs={tabs} links={urls} />

            <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                <div className="relative mb-10 text-center">
                    <Link href="/" className="absolute left-0 top-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Retour à l'accueil"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/alternance/" scroll={false} className="absolute right-0 top-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Projets réalisés en alternance"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <BriefcaseBusiness className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="mb-2 text-4xl font-bold">Parcours</h1>
                    <p className="text-xl text-muted-foreground">
                        {parcours.length + 1} formations <Dot className="inline h-5 w-5" />{" "}
                        {totalProjects} projets
                    </p>
                </div>

                <div className="mx-auto w-full max-w-6xl">
                    <div ref={railRef} className="relative">
                        <div
                            aria-hidden
                            className="absolute left-[5px] top-3 bottom-3 w-0.5 rounded-full bg-border"
                        />

                        {companyRail && (
                            <div
                                aria-hidden
                                className="absolute right-[5px] hidden w-0.5 rounded-full bg-border lg:block"
                                style={{ top: companyRail.top, height: companyRail.height }}
                            />
                        )}

                        <div className="space-y-6 stagger-children">
                            {parcours.map((entry) => (
                                <ParcoursSection key={entry.id} entry={entry} />
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center border-t pt-8 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{bac.degree}</span>
                        <Dot className="h-4 w-4 shrink-0" aria-hidden />
                        {bac.field}
                        <Dot className="h-4 w-4 shrink-0" aria-hidden />
                        {bac.school}, {bac.city}
                        <Dot className="h-4 w-4 shrink-0" aria-hidden />
                        <Period from={bac.from} to={bac.to} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}