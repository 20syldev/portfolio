import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { alternanceProjects } from "@/data/alternance";

export const metadata: Metadata = {
    title: "Alternance - Sylvain L.",
    description: "Développement Web chez Zenetys - Mes projets en alternance",
};

export default function AlternancePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header/>
            <main className="container mx-auto flex-1 px-4 py-12">
                {/* Header */}
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                </Link>
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
                            est une société par actions simplifiée (SAS) créée
                            en <strong className="text-foreground">2016</strong>{" "}
                            par d'anciens membres de la société Exosec,
                            suite à sa fermeture. L'entreprise est
                            spécialisée dans les solutions de{" "}
                            <strong className="text-foreground">
                                supervision
                            </strong>{" "}
                            et de gestion des{" "}
                            <strong className="text-foreground">
                                infrastructures informatiques
                            </strong>
                            .
                        </p>
                        <p>
                            Elle développe des outils innovants pour la
                            surveillance réseau, la gestion des logs, et
                            l'analyse des systèmes d'information.
                        </p>
                        <p>
                            Je crée, améliore, teste et optimise des
                            applications web et des plugins. J'ai été lancé
                            dans plusieurs projets et j'ai pu mettre en
                            pratique mes connaissances en développement.
                        </p>
                    </CardContent>
                </Card>

                {/* Projects */}
                <h2 className="mb-8 text-2xl font-bold">Projets réalisés</h2>
                <div className="space-y-8">
                    {alternanceProjects.map((project) => (
                        <Card key={project.id} id={project.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-xl">
                                        {project.title}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4"/>
                                                    Voir
                                                </Button>
                                            </a>
                                        )}
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Github className="mr-2 h-4 w-4"/>
                                                    GitHub
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
                                <p className="text-muted-foreground">
                                    {project.description}
                                </p>

                                {project.sections.map((section, index) => (
                                    <div key={index}>
                                        <h4 className="mb-2 font-semibold">
                                            {section.title}
                                        </h4>
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
                                    <div className="mt-6 overflow-hidden rounded-lg border">
                                        <video
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full"
                                        >
                                            <source
                                                src={project.video}
                                                type="video/mp4"
                                            />
                                            Votre navigateur ne supporte pas la
                                            lecture de vidéos.
                                        </video>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
            <Footer/>
        </div>
    );
}