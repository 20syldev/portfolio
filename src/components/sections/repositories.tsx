"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CardDialog } from "@/components/dialogs/card";
import { Footer } from "@/components/layout/footer";
import { VeilleCard } from "@/components/sections/veille";
import { ProjectCard } from "@/components/ui/project";
import { articles } from "@/data/articles";
import { contributions } from "@/data/contributions";
import { type Project, projects } from "@/data/projects";
import { veilles } from "@/data/veille";
import { useApi } from "@/hooks/api";
import { useCard } from "@/hooks/card";
import { useSmoothScroll } from "@/hooks/scroll";
import { useStatus } from "@/hooks/status";

const personalProjects = projects.filter((p) => !p.work);
const workProjects = projects.filter((p) => p.work);

interface RepositoriesProps {
    initialProjectId?: string;
}

/**
 * Projets tab content: the projects done at Zenetys, then the personal ones, then the first
 * veilles, with the project card dialogs.
 *
 * @param props - Component props
 * @param props.initialProjectId - Optional project ID to open on load
 * @returns The rendered projects list
 */
export function Repositories({ initialProjectId }: RepositoriesProps) {
    const { scrollRef } = useSmoothScroll<HTMLDivElement>();
    const { versions } = useApi();
    const getProjectStatus = useStatus();
    const { project: selected, open, close } = useCard(initialProjectId);
    const getVersion = (projectId: string): string | undefined => {
        if (!versions) return undefined;
        return versions[projectId];
    };

    const renderProject = (project: Project) => (
        <ProjectCard key={project.id} project={project} onOpen={open} />
    );

    return (
        <div ref={scrollRef} className="flex flex-col h-dvh overflow-y-auto scrollbar-none">
            <div className="flex-1 container mx-auto px-4 pt-page pb-12">
                <div className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Projets</h1>
                    <p className="text-xl text-muted-foreground">
                        {personalProjects.length} projets personnels et {workProjects.length}{" "}
                        réalisés chez Zenetys
                    </p>
                </div>

                <section id="zenetys">
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
                        <h2 className="text-2xl font-bold">Zenetys</h2>
                        <span className="text-right text-sm text-muted-foreground">
                            {workProjects.length} projets réalisés en alternance
                        </span>
                    </div>
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                        <p className="text-sm text-muted-foreground">
                            Société créée en 2016, spécialisée dans la supervision et la gestion des
                            infrastructures informatiques.
                        </p>
                        <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-sm">
                            <Link
                                href="/contributions"
                                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Contributions externes ({contributions.length})
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/articles"
                                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Articles ({articles.length})
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {workProjects.map(renderProject)}
                    </div>
                </section>

                <section id="personnels" className="mt-16">
                    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4">
                        <h2 className="text-2xl font-bold">Personnels</h2>
                        <span className="text-right text-sm text-muted-foreground">
                            {personalProjects.length} projets
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {personalProjects.map(renderProject)}
                    </div>
                </section>

                <section id="veille" className="mt-16">
                    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4">
                        <h2 className="text-2xl font-bold">Veille</h2>
                        <Link
                            href="/veille"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Voir les {veilles.length} veilles
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {veilles.slice(0, 3).map((veille) => (
                            <VeilleCard key={veille.id} veille={veille} />
                        ))}
                    </div>
                </section>
            </div>
            <Footer />

            <CardDialog
                project={selected}
                version={selected ? getVersion(selected.id) : undefined}
                status={selected ? getProjectStatus(selected.id) : null}
                onOpenChange={close}
            />
        </div>
    );
}
