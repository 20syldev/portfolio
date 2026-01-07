import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
    title: "Veille Technologique - Sylvain L.",
    description: "Veille technologique sur Node.js - Actualités et tendances 2025",
};

export default function VeillePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container mx-auto flex-1 px-4 py-12">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Link href="/">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                    <h1 className="mb-2 text-4xl font-bold">Veille Technologique</h1>
                    <p className="text-xl text-muted-foreground">Actualités sur Node.js</p>
                </div>

                {/* Introduction */}
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            Cette année, j&apos;ai décidé de faire une veille technologique pour
                            suivre les dernières actualités de Node.js, un environnement
                            d&apos;exécution JavaScript côté serveur. Il s&apos;agit d&apos;une
                            veille mise à jour régulièrement pour refléter les dernières
                            évolutions de cette technologie essentielle au développement web
                            moderne en 2025.
                        </p>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    {/* À propos de Node.js */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Badge>Node.js</Badge>
                                <CardTitle>À propos de Node.js</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-muted-foreground">
                                Node.js est un environnement d&apos;exécution JavaScript côté
                                serveur, open-source et multi-plateforme. Créé par Ryan Dahl en
                                2009, il est construit sur le moteur JavaScript V8 de Chrome et
                                permet d&apos;exécuter du code JavaScript en dehors d&apos;un
                                navigateur web. Node.js révolutionne le développement backend en
                                utilisant un modèle non bloquant et orienté événements.
                            </p>

                            <div>
                                <h4 className="mb-3 font-semibold">
                                    Dernières versions et nouveautés
                                </h4>
                                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <strong className="text-foreground">
                                            Node.js 26 (Current) :
                                        </strong>{" "}
                                        Support natif des workers multithreads, améliorations pour
                                        les applications serverless, et API de gestion des événements
                                        optimisée.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">
                                            Node.js 24 (LTS) :
                                        </strong>{" "}
                                        Optimisations pour les modules ESM et meilleure compatibilité
                                        avec les runtimes edge computing.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">
                                            Runtimes alternatifs :
                                        </strong>{" "}
                                        Intégration améliorée avec Bun et Deno pour une
                                        interopérabilité accrue.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">Edge Computing :</strong>{" "}
                                        Fonctionnalités avancées pour exécuter du code au plus près
                                        des utilisateurs via des réseaux CDN.
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-3 font-semibold">
                                    Tendances technologiques en 2025
                                </h4>
                                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                                    <li>
                                        <strong className="text-foreground">TypeScript :</strong>{" "}
                                        Devient le standard pour les projets Node.js, avec une
                                        adoption massive dans les entreprises.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">
                                            Serverless et Edge Computing :
                                        </strong>{" "}
                                        Node.js est de plus en plus utilisé pour des architectures
                                        serverless.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">
                                            Frameworks isomorphiques :
                                        </strong>{" "}
                                        Next.js, Nuxt.js et Remix dominent avec Streaming SSR et
                                        Partial Hydration.
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comparaison */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Badge>Comparaison</Badge>
                                <CardTitle>Node.js vs autres environnements</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    <strong className="text-foreground">Deno :</strong> Alternative
                                    moderne à Node.js qui met l&apos;accent sur la sécurité avec un
                                    système de permissions explicites.
                                </p>
                                <p>
                                    <strong className="text-foreground">PHP :</strong> Modèle de
                                    traitement synchrone traditionnel, peut limiter les performances
                                    sous forte charge comparé à Node.js.
                                </p>
                                <p>
                                    <strong className="text-foreground">Ruby on Rails :</strong>{" "}
                                    Framework axé sur la convention, productivité élevée mais pas
                                    aussi rapide que Node.js pour les opérations I/O intensives.
                                </p>
                                <p>
                                    <strong className="text-foreground">Django (Python) :</strong>{" "}
                                    Approche &quot;batteries included&quot;, n&apos;exploite pas
                                    nativement l&apos;approche événementielle de Node.js.
                                </p>
                                <p>
                                    <strong className="text-foreground">ASP.NET Core :</strong>{" "}
                                    Excellentes performances avec support de l&apos;asynchronicité,
                                    mais nécessite plus de ressources système.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Écosystème */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Badge>Écosystème</Badge>
                                <CardTitle>L&apos;écosystème Node.js en 2024</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="mb-3 font-semibold">Frameworks backend</h4>
                                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                    <p>
                                        <strong className="text-foreground">Express.js :</strong>{" "}
                                        Framework le plus utilisé, minimaliste et flexible.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Nest.js :</strong>{" "}
                                        Architecture modulaire, support TypeScript, injection de
                                        dépendances.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Fastify :</strong>{" "}
                                        Alternative moderne, jusqu&apos;à 2x plus rapide qu&apos;Express.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Koa.js :</strong> Approche
                                        légère avec meilleur support async/await.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-3 font-semibold">Frameworks fullstack</h4>
                                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                    <p>
                                        <strong className="text-foreground">Next.js :</strong> Framework
                                        React avec SSR et SSG, version 14 avec nouvelles optimisations.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Nuxt.js :</strong>{" "}
                                        Équivalent de Next.js pour Vue.js.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Remix :</strong> Focus sur
                                        les modèles web natifs et performances.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">AdonisJS :</strong>{" "}
                                        Framework fullstack inspiré de Laravel.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-3 font-semibold">Bases de données et ORM</h4>
                                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                    <p>
                                        <strong className="text-foreground">Prisma :</strong> ORM
                                        moderne avec excellent DX et sécurité de type.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Mongoose :</strong> ODM
                                        pour MongoDB, le plus populaire dans l&apos;écosystème.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">TypeORM :</strong> ORM
                                        avancé avec support TypeScript.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Sequelize :</strong> ORM
                                        mature pour bases SQL.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Avantages */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Badge>Avantages</Badge>
                                <CardTitle>Pourquoi utiliser Node.js ?</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <strong className="text-foreground">JavaScript unifié :</strong>{" "}
                                    Même langage frontend et backend, travail plus efficace sur
                                    toute la pile.
                                </li>
                                <li>
                                    <strong className="text-foreground">I/O non bloquant :</strong>{" "}
                                    Architecture événementielle pour gérer de nombreuses connexions
                                    simultanées.
                                </li>
                                <li>
                                    <strong className="text-foreground">NPM :</strong> Plus grand
                                    écosystème de bibliothèques open-source au monde.
                                </li>
                                <li>
                                    <strong className="text-foreground">Microservices :</strong>{" "}
                                    Parfaitement adapté grâce à sa légèreté et démarrage rapide.
                                </li>
                                <li>
                                    <strong className="text-foreground">Performances :</strong>{" "}
                                    Excellente vitesse grâce au moteur V8 de Google.
                                </li>
                                <li>
                                    <strong className="text-foreground">Communauté :</strong> Large
                                    communauté contribuant à l&apos;amélioration continue.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Ressources */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Badge>Ressources</Badge>
                                <CardTitle>Pour approfondir</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <a
                                    href="https://nodejs.org/fr/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Documentation officielle Node.js
                                </a>
                                <a
                                    href="https://nodejs.org/en/blog"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Blog officiel Node.js
                                </a>
                                <a
                                    href="https://github.com/goldbergyoni/nodebestpractices"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Node.js Best Practices
                                </a>
                                <a
                                    href="https://nodeschool.io"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    NodeSchool - Tutoriels interactifs
                                </a>
                                <a
                                    href="https://expressjs.com/fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Express.js Documentation
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}