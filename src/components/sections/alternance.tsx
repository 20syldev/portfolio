"use client";

import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "@/components/ui/video";
import { projects } from "@/data/alternance";
import { getApiKey, useApi } from "@/hooks/api";
import { useSmoothScroll } from "@/hooks/scroll";

/**
 * Alternance tab content.
 * Displays projects done at Zenetys.
 */
export function Alternance() {
    const { versions } = useApi();
    const scrollRef = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="h-dvh overflow-y-auto overflow-x-hidden scrollbar-none">
            <div className="px-4 pt-24">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-2 text-4xl font-bold">Alternance</h1>
                        <p className="text-xl text-muted-foreground">
                            Développement Web chez Zenetys
                        </p>
                    </div>

                    {/* Introduction */}
                    <Card className="mb-12">
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
                    <h2 className="mb-8 text-2xl font-bold">Projets réalisés</h2>
                    <div className="mb-12 space-y-8">
                        {projects.map((project) => (
                            <Card key={project.id} id={project.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-xl">{project.title}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            {versions?.[getApiKey(project.id)] && (
                                                <Badge variant="outline" className="text-xs">
                                                    {versions[getApiKey(project.id)]}
                                                </Badge>
                                            )}
                                            {project.github && (
                                                <a
                                                    href={project.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <Github className="mr-2 h-4 w-4" />
                                                        GitHub
                                                    </Button>
                                                </a>
                                            )}
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Voir
                                                    </Button>
                                                </a>
                                            )}
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Contributions */}
                    <h2 className="mb-8 text-2xl font-bold">Contributions externes</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">split()</CardTitle>
                                    <a
                                        href="https://github.com/rsyslog/rsyslog/pull/6384"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer hover:bg-muted"
                                        >
                                            PR #6384
                                        </Badge>
                                    </a>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="secondary">rsyslog</Badge>
                                    <Badge variant="secondary">C</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Nouvelle fonction RainerScript pour parser des chaînes
                                    délimitées (CSV, tags, chemins) en tableaux JSON sans traitement
                                    externe.
                                </p>
                                <code className="block rounded bg-muted px-2 py-1 text-xs">
                                    split(string, separator) → JSON array
                                </code>
                                <p className="text-xs text-muted-foreground">
                                    Gère les cas limites : entrées vides, délimiteurs consécutifs,
                                    en début/fin de chaîne. Documentation et tests inclus.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">append_json()</CardTitle>
                                    <a
                                        href="https://github.com/rsyslog/rsyslog/pull/6385"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer hover:bg-muted"
                                        >
                                            PR #6385
                                        </Badge>
                                    </a>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="secondary">rsyslog</Badge>
                                    <Badge variant="secondary">C</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Nouvelle fonction RainerScript pour construire dynamiquement des
                                    structures JSON sans traitement externe.
                                </p>
                                <code className="block rounded bg-muted px-2 py-1 text-xs">
                                    append_json(array, element) → JSON array
                                    <br />
                                    append_json(object, key, value) → JSON object
                                </code>
                                <p className="text-xs text-muted-foreground">
                                    Retourne une nouvelle structure (immutable). Documentation et
                                    tests inclus.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}