import { ExternalLink } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSmoothScroll } from "@/hooks/scroll";

/**
 * Tech Watch tab content.
 * Displays Node.js news and updates.
 */
export function Veille() {
    const scrollRef = useSmoothScroll<HTMLDivElement>();

    return (
        <div ref={scrollRef} className="h-dvh overflow-y-auto overflow-x-hidden scrollbar-none">
            <div className="px-4 pt-24">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-2 text-4xl font-bold">Veille Technologique</h1>
                        <p className="text-xl text-muted-foreground">Actualités sur Node.js</p>
                    </div>

                    {/* Introduction */}
                    <Card className="mb-8">
                        <CardContent>
                            <p className="text-muted-foreground">
                                En 2025, j'ai décidé de commencer une veille technologique pour
                                suivre les dernières actualités de Node.js, un environnement
                                d'exécution JavaScript côté serveur. Il s'agit d'une veille mise à
                                jour régulièrement pour refléter les dernières évolutions de cette
                                technologie essentielle au développement web moderne en 2026.
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
                                    Node.js est un environnement d'exécution JavaScript côté
                                    serveur, open-source et multi-plateforme. Créé par Ryan Dahl en
                                    2009, il est construit sur le moteur JavaScript V8 de Chrome et
                                    permet d'exécuter du code JavaScript en dehors d'un navigateur
                                    web. Node.js révolutionne le développement backend en utilisant
                                    un modèle non bloquant et orienté événements.
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
                                            Support natif des workers multithreads, améliorations
                                            pour les applications serverless, et API de gestion des
                                            événements optimisée.
                                        </li>
                                        <li>
                                            <strong className="text-foreground">
                                                Node.js 24 (LTS) :
                                            </strong>{" "}
                                            Optimisations pour les modules ESM et meilleure
                                            compatibilité avec les runtimes edge computing.
                                        </li>
                                        <li>
                                            <strong className="text-foreground">
                                                Runtimes alternatifs :
                                            </strong>{" "}
                                            Intégration améliorée avec Bun et Deno pour une
                                            interopérabilité accrue.
                                        </li>
                                        <li>
                                            <strong className="text-foreground">
                                                Edge Computing :
                                            </strong>{" "}
                                            Fonctionnalités avancées pour exécuter du code au plus
                                            près des utilisateurs via des réseaux CDN.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Tendances technologiques en 2025
                                    </h4>
                                    <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                                        <li>
                                            <strong className="text-foreground">
                                                TypeScript :
                                            </strong>{" "}
                                            Devient le standard pour les projets Node.js, avec une
                                            adoption massive dans les entreprises.
                                        </li>
                                        <li>
                                            <strong className="text-foreground">
                                                Serverless et Edge Computing :
                                            </strong>{" "}
                                            Node.js est de plus en plus utilisé pour des
                                            architectures serverless.
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
                                        <strong className="text-foreground">Deno :</strong>{" "}
                                        Alternative moderne à Node.js qui met l'accent sur la
                                        sécurité avec un système de permissions explicites.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">PHP :</strong> Modèle de
                                        traitement synchrone traditionnel, peut limiter les
                                        performances sous forte charge comparé à Node.js.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Ruby on Rails :</strong>{" "}
                                        Framework axé sur la convention, productivité élevée mais
                                        pas aussi rapide que Node.js pour les opérations I/O
                                        intensives.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">
                                            Django (Python) :
                                        </strong>{" "}
                                        Approche &quot;batteries included&quot;, n'exploite pas
                                        nativement l'approche événementielle de Node.js.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">ASP.NET Core :</strong>{" "}
                                        Excellentes performances avec support de l'asynchronicité,
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
                                    <CardTitle>L'écosystème Node.js en 2024</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="mb-3 font-semibold">Frameworks backend</h4>
                                    <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                        <p>
                                            <strong className="text-foreground">
                                                Express.js :
                                            </strong>{" "}
                                            Framework le plus utilisé, minimaliste et flexible.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Nest.js :</strong>{" "}
                                            Architecture modulaire, support TypeScript, injection de
                                            dépendances.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Fastify :</strong>{" "}
                                            Alternative moderne, jusqu'à 2x plus rapide qu'Express.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Hapi.js :</strong>{" "}
                                            Framework robuste, accent sur la configuration
                                            déclarative.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Koa.js :</strong>{" "}
                                            Approche légère avec meilleur support async/await.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">Frameworks fullstack</h4>
                                    <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                        <p>
                                            <strong className="text-foreground">Next.js :</strong>{" "}
                                            Framework React avec SSR et SSG, version 14 avec
                                            nouvelles optimisations.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Nuxt.js :</strong>{" "}
                                            Équivalent de Next.js pour Vue.js.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Remix :</strong>{" "}
                                            Focus sur les modèles web natifs et performances.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Meteor :</strong>{" "}
                                            Plateforme complète pour applications web temps réel
                                            avec synchronisation automatique.
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
                                            <strong className="text-foreground">Prisma :</strong>{" "}
                                            ORM moderne avec excellent DX et sécurité de type.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Mongoose :</strong>{" "}
                                            ODM pour MongoDB, le plus populaire dans l'écosystème.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">TypeORM :</strong>{" "}
                                            ORM avancé avec support TypeScript.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Sequelize :</strong>{" "}
                                            ORM mature pour bases SQL.
                                        </p>
                                        <p>
                                            <strong className="text-foreground">Knex.js :</strong>{" "}
                                            Constructeur de requêtes SQL flexible.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Outils de test et qualité */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Badge>Test & Qualité</Badge>
                                    <CardTitle>Outils de test et qualité du code</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                    <p>
                                        <strong className="text-foreground">Jest :</strong>{" "}
                                        Framework de test complet avec mocking, couverture de code
                                        et isolation des tests.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Vitest :</strong>{" "}
                                        Alternative moderne à Jest avec meilleure intégration Vite
                                        et performances supérieures.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">Mocha :</strong>{" "}
                                        Framework flexible avec différentes bibliothèques
                                        d'assertions comme Chai.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">ESLint :</strong>{" "}
                                        Analyse statique pour identifier les problèmes dans le code
                                        JavaScript.
                                    </p>
                                    <p>
                                        <strong className="text-foreground">TypeScript :</strong>{" "}
                                        Typage statique améliorant la qualité et maintenabilité du
                                        code.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Exemples de code */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Badge>Exemples</Badge>
                                    <CardTitle>Exemples pratiques avec Node.js</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-muted-foreground">
                                    Voici quelques exemples de code pour illustrer les
                                    fonctionnalités clés de Node.js et les bonnes pratiques
                                    actuelles.
                                </p>

                                <div>
                                    <h4 className="mb-3 font-semibold">Serveur HTTP natif</h4>
                                    <pre className="overflow-x-auto max-w-full rounded-lg bg-muted p-4 text-sm">
                                        {`const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\\n');
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Serveur démarré sur http://127.0.0.1:3000/');
});`}
                                    </pre>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        API REST avec Express.js et ESM
                                    </h4>
                                    <pre className="overflow-x-auto max-w-full rounded-lg bg-muted p-4 text-sm">
                                        {`import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
];

app.get('/api/users', (req, res) => res.json(users));

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'Non trouvé' });
    res.json(user);
});

app.listen(PORT, () => console.log(\`Serveur sur port \${PORT}\`));`}
                                    </pre>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Async/await avec gestion d'erreurs
                                    </h4>
                                    <pre className="overflow-x-auto max-w-full rounded-lg bg-muted p-4 text-sm">
                                        {`import fs from 'fs/promises';

async function readConfigFile() {
    try {
        const data = await fs.readFile('config.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            const defaultConfig = { theme: 'light', language: 'fr' };
            await fs.writeFile('config.json', JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
        }
        throw error;
    }
}

const config = await readConfigFile();
console.log('Configuration chargée :', config);`}
                                    </pre>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Communication temps réel avec Socket.IO
                                    </h4>
                                    <pre className="overflow-x-auto max-w-full rounded-lg bg-muted p-4 text-sm">
                                        {`import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "http://localhost:8080", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
    console.log('Utilisateur connecté', socket.id);
    socket.emit('welcome', { message: 'Bienvenue!' });

    socket.on('chatMessage', (data) => {
        io.emit('newMessage', { userId: socket.id, message: data.message });
    });

    socket.on('disconnect', () => {
        io.emit('userLeft', { userId: socket.id });
    });
});

httpServer.listen(3000);`}
                                    </pre>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        API moderne avec Fastify et Prisma
                                    </h4>
                                    <pre className="overflow-x-auto max-w-full rounded-lg bg-muted p-4 text-sm">
                                        {`import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

await fastify.register(import('@fastify/cors'));

fastify.post('/posts', {
    schema: {
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' }
            },
            required: ['title', 'content']
        }
    }
}, async (request, reply) => {
    const { title, content } = request.body;
    const post = await prisma.post.create({ data: { title, content } });
    return reply.code(201).send(post);
});

await fastify.listen({ port: 3000 });`}
                                    </pre>
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
                                        <strong className="text-foreground">
                                            JavaScript unifié :
                                        </strong>{" "}
                                        Même langage frontend et backend, travail plus efficace sur
                                        toute la pile.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">
                                            I/O non bloquant :
                                        </strong>{" "}
                                        Architecture événementielle pour gérer de nombreuses
                                        connexions simultanées.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">NPM :</strong> Plus
                                        grand écosystème de bibliothèques open-source au monde.
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
                                        <strong className="text-foreground">Communauté :</strong>{" "}
                                        Large communauté contribuant à l'amélioration continue.
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Tendances et évolutions */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Badge>Tendances</Badge>
                                    <CardTitle>Tendances et évolutions de Node.js</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-muted-foreground">
                                    L'écosystème Node.js continue d'évoluer rapidement. Voici les
                                    tendances actuelles qui façonnent l'avenir du développement avec
                                    Node.js.
                                </p>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        TypeScript comme standard
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        TypeScript est en train de devenir le standard de facto pour
                                        les projets Node.js d'envergure. Ses avantages en termes de
                                        typage statique, d'autocomplétion et de détection d'erreurs
                                        en font un choix privilégié pour les équipes qui recherchent
                                        la robustesse et la maintenabilité.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Architecture en microservices
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        La légèreté et la rapidité de démarrage de Node.js en font
                                        une technologie idéale pour les architectures en
                                        microservices. On observe également une augmentation de
                                        l'utilisation de Docker, Kubernetes, et les outils de
                                        service mesh pour orchestrer des écosystèmes complexes.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Serverless et Edge Computing
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        L'adoption des architectures serverless avec Node.js
                                        progresse rapidement. Des plateformes comme AWS Lambda,
                                        Vercel, Netlify et Cloudflare Workers supportent nativement
                                        les fonctions Node.js. Le edge computing permet d'exécuter
                                        du code au plus près des utilisateurs.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Modules ESM comme standard
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Les modules ECMAScript (ESM) remplacent progressivement
                                        CommonJS. Cette transition permet une meilleure
                                        interopérabilité entre le code frontend et backend, ainsi
                                        qu'une meilleure optimisation par les moteurs JavaScript.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">Frameworks isomorphiques</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Les frameworks qui permettent de partager du code entre
                                        client et serveur connaissent une forte croissance. Next.js,
                                        Nuxt.js et Remix offrent SSR, SSG, Streaming SSR et Partial
                                        Hydration. Les React Server Components représentent une
                                        évolution majeure.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conclusion */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Badge>Conclusion</Badge>
                                    <CardTitle>
                                        L'avenir de Node.js et du JavaScript côté serveur
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    Node.js reste solidement ancré comme l'une des technologies
                                    backend dominantes, avec une communauté active et un écosystème
                                    en constante évolution. Malgré l'émergence d'alternatives comme
                                    Deno et Bun, Node.js continue de bénéficier d'une inertie
                                    considérable et d'une adoption massive dans l'industrie.
                                </p>
                                <p className="text-muted-foreground">
                                    Les priorités pour l'avenir incluent l'amélioration continue des
                                    performances, le renforcement de la sécurité, et la
                                    simplification du développement grâce à une meilleure
                                    intégration des fonctionnalités modernes de JavaScript.
                                </p>
                                <p className="text-muted-foreground">
                                    Avec l'adoption croissante de TypeScript, l'évolution vers les
                                    modules ESM, et l'intégration de plus en plus poussée avec les
                                    technologies cloud natives, Node.js est bien positionné pour
                                    rester pertinent dans le paysage technologique en constante
                                    évolution.
                                </p>
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

                        {/* Sources */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Badge>Sources</Badge>
                                    <CardTitle>Références bibliographiques</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="mb-3 font-semibold">Documentation officielle</h4>
                                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                                        <a
                                            href="https://nodejs.org/docs/latest/api"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Node.js Foundation - Documentation officielle
                                        </a>
                                        <a
                                            href="https://nodejs.org/en/blog/release/v24.1.0"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Node.js v24.1.0 Release Notes
                                        </a>
                                        <a
                                            href="https://nodejs.org/api/esm.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            ESM URL Imports Documentation
                                        </a>
                                        <a
                                            href="https://nodejs.org/api/permissions.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Permissions API Documentation
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Alternatives et comparaisons
                                    </h4>
                                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                                        <a
                                            href="https://deno.com/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Deno Land Inc. - Deno vs Node.js
                                        </a>
                                        <a
                                            href="https://kinsta.com/fr/blog/php-vs-nodejs"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Kinsta - PHP vs Node.js
                                        </a>
                                        <a
                                            href="https://blog.logrocket.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            LogRocket - Ruby on Rails vs Node.js
                                        </a>
                                        <a
                                            href="https://devblogs.microsoft.com/dotnet"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Microsoft - ASP.NET Core
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">Frameworks et écosystème</h4>
                                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                                        <a
                                            href="https://expressjs.com/en/changelog/#5.x"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Express 5.0.0 Changelog
                                        </a>
                                        <a
                                            href="https://docs.nestjs.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            NestJS Documentation
                                        </a>
                                        <a
                                            href="https://www.fastify.io/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Fastify Team - Fastify v5
                                        </a>
                                        <a
                                            href="https://www.prisma.io/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Prisma ORM Suite
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">Frameworks fullstack</h4>
                                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                                        <a
                                            href="https://nextjs.org/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Vercel - Next.js Blog
                                        </a>
                                        <a
                                            href="https://nuxt.com/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Nuxt Team - Nuxt Blog
                                        </a>
                                        <a
                                            href="https://remix.run/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Remix Team - Remix Blog
                                        </a>
                                        <a
                                            href="https://adonisjs.com/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            AdonisJS Blog
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">
                                        Outils de test et tendances
                                    </h4>
                                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                                        <a
                                            href="https://jestjs.io/blog"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Facebook - Jest Blog
                                        </a>
                                        <a
                                            href="https://vitest.dev/guide/why"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Vitest Team - Why Vitest?
                                        </a>
                                        <a
                                            href="https://devblogs.microsoft.com/typescript"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Microsoft - TypeScript Blog
                                        </a>
                                        <a
                                            href="https://survey.stackoverflow.co"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Stack Overflow Developer Survey
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-semibold">Études de cas</h4>
                                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                                        <a
                                            href="https://netflixtechblog.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Netflix Technology Blog
                                        </a>
                                        <a
                                            href="https://medium.com/paypal-tech"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            PayPal Tech Blog
                                        </a>
                                        <a
                                            href="https://medium.com/walmartglobaltech"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Walmart Global Tech
                                        </a>
                                        <a
                                            href="https://nodejs.dev/learn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Learn Node.js
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}