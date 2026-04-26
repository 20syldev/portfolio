"use client";

import { BookOpen, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContributionList } from "@/components/ui/contributions";
import { Video } from "@/components/ui/video";
import { projects } from "@/data/alternance";
import { contributions } from "@/data/contributions";
import { getApiKey } from "@/data/redirects";
import { useApi } from "@/hooks/api";
import { useSmoothScroll } from "@/hooks/scroll";
import { random } from "@/lib/utils";

const navSections = [
    { id: "zenetys", label: "Zenetys" },
    ...projects.map((p) => ({ id: p.id, label: p.title.split(" - ")[0].split(".")[0] })),
    { id: "contributions", label: "Contributions" },
];

/**
 * Alternance tab content.
 * Displays projects done at Zenetys.
 *
 * @returns The rendered alternance section
 */
export function Alternance() {
    const { versions } = useApi();
    const { scrollRef, scrollTo } = useSmoothScroll<HTMLDivElement>();
    const [active, setActive] = useState<string>(navSections[0].id);
    const [displayed, setDisplayed] = useState<typeof contributions>([]);
    const navRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const mounted = useRef(false);

    useEffect(() => {
        const byRepo = Object.values(
            contributions.reduce<Record<string, typeof contributions>>((acc, c) => {
                (acc[c.repo] ??= []).push(c);
                return acc;
            }, {})
        );
        const onePer = byRepo.map((prs) => random.pick(prs));
        setDisplayed(random.shuffle(onePer).slice(0, 4));
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const updateActive = () => {
            const threshold = container.getBoundingClientRect().top + container.clientHeight * 0.25;
            let current = navSections[0].id;
            for (const { id } of navSections) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top < threshold) current = id;
            }
            setActive(current);
        };

        container.addEventListener("scroll", updateActive, { passive: true });
        return () => container.removeEventListener("scroll", updateActive);
    }, [scrollRef]);

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        window.history.replaceState(null, "", `#${active}`);
    }, [active]);

    useEffect(() => {
        const button = buttonRefs.current.get(active);
        const nav = navRef.current;
        if (!button || !nav) return;
        const btnLeft = button.offsetLeft;
        const btnWidth = button.offsetWidth;
        const navWidth = nav.offsetWidth;
        nav.scrollTo({ left: btnLeft - navWidth / 2 + btnWidth / 2, behavior: "smooth" });
    }, [active]);

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash && navSections.some((s) => s.id === hash)) {
            setActive(hash);
            const timeout = setTimeout(() => scrollTo(`#${hash}`, -120), 200);
            return () => clearTimeout(timeout);
        }
    }, [scrollTo]);

    const scrollToSection = (id: string) => {
        setActive(id);
        scrollTo(`#${id}`, -120);
    };

    return (
        <div ref={scrollRef} className="h-dvh overflow-y-auto overflow-x-hidden scrollbar-none">
            <div className="px-4 sm:px-6 pt-28 sm:pt-24">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 text-center">
                        <h1 className="mb-3 text-3xl sm:text-4xl font-bold">Alternance</h1>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            Développement Web chez Zenetys
                        </p>
                    </div>

                    {/* Section nav */}
                    <div
                        ref={navRef}
                        className="sticky top-16 z-10 -mx-4 sm:-mx-6 mb-8 sm:mb-12 px-4 sm:px-6 py-2 bg-background/80 backdrop-blur-sm border-b overflow-x-auto scrollbar-hide"
                    >
                        <div className="flex gap-1 w-max mx-auto">
                            {navSections.map((s) => (
                                <button
                                    key={s.id}
                                    ref={(el) => {
                                        if (el) buttonRefs.current.set(s.id, el);
                                        else buttonRefs.current.delete(s.id);
                                    }}
                                    onClick={() => scrollToSection(s.id)}
                                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                                        active === s.id
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Introduction */}
                    <Card id="zenetys" className="mb-8 sm:mb-12">
                        <CardHeader>
                            <CardTitle>À propos de Zenetys</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <p>
                                <a
                                    href="https://zenetys.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    Zenetys
                                </a>{" "}
                                est une société par actions simplifiée (SAS) créée en{" "}
                                <strong className="text-foreground">2016</strong> par d'anciens
                                membres de la société Exosec, suite à sa fermeture. L'entreprise est
                                spécialisée dans les solutions de{" "}
                                <strong className="text-foreground">supervision</strong> et de
                                gestion des{" "}
                                <strong className="text-foreground">
                                    infrastructures informatiques
                                </strong>
                                .
                            </p>
                            <p>
                                Elle développe des outils innovants pour la surveillance réseau, la
                                gestion des logs, et l'analyse des systèmes d'information.
                            </p>
                            <p>
                                Je crée, améliore, teste et optimise des applications web et des
                                plugins. J'ai été lancé dans plusieurs projets et j'ai pu mettre en
                                pratique mes connaissances en développement.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Projects */}
                    <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold">Projets réalisés</h2>
                    <div className="mb-8 sm:mb-12 space-y-6 sm:space-y-8">
                        {projects.map((project) => (
                            <Card key={project.id} id={project.id}>
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <CardTitle className="text-xl">{project.title}</CardTitle>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {versions?.[getApiKey(project.id)] && (
                                                <Badge variant="outline" className="text-xs">
                                                    {versions[getApiKey(project.id)]}
                                                </Badge>
                                            )}
                                            <div className="flex items-center gap-2">
                                                {project.github && (
                                                    <>
                                                        <a
                                                            href={project.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full hover:bg-muted transition-colors sm:hidden"
                                                        >
                                                            <Github className="h-4 w-4" />
                                                        </a>
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="hidden sm:inline-flex"
                                                        >
                                                            <a
                                                                href={project.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Github className="mr-2 h-4 w-4" />
                                                                GitHub
                                                            </a>
                                                        </Button>
                                                    </>
                                                )}
                                                {project.projet && (
                                                    <>
                                                        <Link
                                                            href={`/projet/${project.projet}`}
                                                            className="p-2 rounded-full hover:bg-muted transition-colors sm:hidden"
                                                        >
                                                            <BookOpen className="h-4 w-4" />
                                                        </Link>
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="hidden sm:inline-flex"
                                                        >
                                                            <Link
                                                                href={`/projet/${project.projet}`}
                                                            >
                                                                <BookOpen className="mr-2 h-4 w-4" />
                                                                En savoir plus
                                                            </Link>
                                                        </Button>
                                                    </>
                                                )}
                                                {project.link && (
                                                    <>
                                                        <a
                                                            href={project.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full hover:bg-muted transition-colors sm:hidden"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="hidden sm:inline-flex"
                                                        >
                                                            <a
                                                                href={project.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                                Voir
                                                            </a>
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech) => (
                                            <Badge key={tech} variant="secondary">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-muted-foreground">{project.description}</p>

                                    {project.sections.map((section, index) => (
                                        <div key={index}>
                                            <h4 className="mb-2 font-semibold">{section.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {section.content}
                                            </p>
                                        </div>
                                    ))}

                                    {project.image && (
                                        <div className="mt-6 overflow-hidden rounded-lg border">
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                width={800}
                                                height={450}
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    {project.video && (
                                        <Video
                                            src={project.video}
                                            title={`Démo: ${project.title}`}
                                            className="mt-6"
                                        />
                                    )}

                                    {project.iframe && (
                                        <div
                                            className="relative mt-6 overflow-hidden rounded-lg border"
                                            style={{ height: "300px" }}
                                        >
                                            <iframe
                                                src={project.iframe}
                                                title={project.title}
                                                className="pointer-events-none absolute top-0 left-0 origin-top-left"
                                                style={{
                                                    width: "200%",
                                                    height: "600px",
                                                    transform: "scale(0.5)",
                                                }}
                                            />
                                            <a
                                                href={project.iframe}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute inset-0 flex items-end p-4"
                                            >
                                                <Button variant="secondary" size="sm">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    Ouvrir le site
                                                </Button>
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Contributions */}
                    <div id="contributions" className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold">Contributions externes</h2>
                    </div>
                    <div className="mb-8">
                        <ContributionList contributions={displayed} columns />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}