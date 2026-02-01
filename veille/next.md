---
id: next
title: Next.js
description: Framework React pour des applications web modernes et performantes
keywords:
  - Next.js
  - React
  - SSR
  - Framework
  - Vercel
url: 'https://nextjs.org'
order: 4
---

## À propos de Next.js {#about}

Next.js est un framework React open-source développé par Vercel. Il fournit une infrastructure optimisée pour créer des applications web modernes avec un excellent support pour le rendu côté serveur (SSR), la génération statique (SSG), et les React Server Components.

### Fonctionnalités principales

- **App Router:** Architecture moderne basée sur les React Server Components
- **Server & Client Components:** Séparation claire entre code serveur et client
- **Streaming SSR:** Rendu progressif pour améliorer le TTFB
- **API Routes:** Endpoints API intégrés
- **Optimisations automatiques:** Images, fonts, scripts optimisés automatiquement
- **File-based routing:** Routing basé sur la structure de fichiers

### Dernières versions

Next.js évolue rapidement avec des versions majeures qui apportent de nouvelles fonctionnalités. La version 13 a introduit l'App Router, et les versions suivantes continuent d'améliorer les performances et le developer experience.

## Patterns de rendu {#rendering}

### Static Site Generation (SSG)

Génère les pages HTML au moment du build. Idéal pour les contenus qui ne changent pas souvent.

### Server-Side Rendering (SSR)

Génère le HTML à la demande pour chaque requête. Parfait pour les contenus dynamiques ou personnalisés.

### Incremental Static Regeneration (ISR)

Permet de mettre à jour les pages statiques après le build, sans tout régénérer.

### Client-Side Rendering (CSR)

Rendu côté client classique pour les parties interactives de l'application.

## Comparaison {#comparison}

### Next.js vs alternatives

**Remix:** Framework React moderne mettant l'accent sur les standards du web et les nested routes. Remix adopte une approche loader/action pattern inspirée du web traditionnel avec un excellent support des progressive enhancements. Contrairement à Next.js qui privilégie les React Server Components, Remix se concentre sur les web fundamentals et la résilience. Excellent pour les applications nécessitant une gestion fine des mutations de données.

**Astro:** Framework content-first offrant une approche multi-framework et une architecture d'îles. Astro génère par défaut du HTML statique sans JavaScript et permet l'hydratation partielle par composant. Idéal pour les sites à fort contenu (blogs, documentations) où la performance est critique. Moins adapté que Next.js pour les applications interactives complexes.

**Nuxt.js:** Équivalent de Next.js pour l'écosystème Vue.js, offrant des fonctionnalités similaires (SSR, SSG, ISR, routing file-based). Nuxt 3 bénéficie d'excellentes performances grâce à Nitro server engine et propose une expérience développeur comparable à Next.js. Le choix entre les deux dépend principalement de la préférence entre React et Vue.

**SvelteKit:** Framework officiel Svelte pour applications full-stack. SvelteKit compile les composants en JavaScript vanilla hautement optimisé, résultant en des bundles plus légers que Next.js. Offre une DX excellente avec moins de boilerplate, mais l'écosystème est moins mature comparé à l'écosystème React/Next.js.

**Gatsby:** Framework React historiquement axé sur la génération statique avec un data layer GraphQL. Gatsby excellait pour les sites statiques mais a perdu du terrain face à Next.js qui couvre à la fois le statique et le dynamique. Gatsby reste pertinent pour les sites nécessitant une agrégation de sources de données multiples via GraphQL.

## Écosystème {#ecosystem}

### L'écosystème Next.js en 2025

#### Plateformes de déploiement

- **Vercel:** Plateforme cloud native optimisée pour Next.js avec déploiements instantanés, preview environments automatiques, et edge network global. Offre la meilleure intégration avec les fonctionnalités Next.js (ISR, Middleware, Server Actions).
- **Netlify:** Support complet de Next.js avec fonctionnalités similaires à Vercel, alternative viable avec pricing compétitif.
- **AWS Amplify:** Solution serverless AWS offrant CI/CD intégré et scaling automatique pour applications Next.js.
- **Railway:** Plateforme moderne simplifiée pour déployer Next.js avec databases, excellente pour projets personnels et MVPs.
- **Docker:** Containerisation pour déploiements self-hosted, on-premise ou sur n'importe quel cloud provider (AWS, GCP, Azure).

#### Authentification et autorisation

- **NextAuth.js (Auth.js):** Solution d'authentification officielle pour Next.js supportant OAuth, email/password, JWT, sessions. Intégration native avec Server Actions et App Router.
- **Clerk:** Service d'authentification moderne avec UI components préconstruits, gestion des utilisateurs, et excellent DX.
- **Auth0:** Plateforme d'identité enterprise-grade offrant authentification, SSO, MFA, et gestion d'utilisateurs complète.
- **Supabase Auth:** Authentification open-source intégrée avec Supabase database, support des social logins et magic links.

#### Bases de données et ORMs

- **Prisma:** ORM nouvelle génération avec excellent TypeScript support, migrations automatiques, et Prisma Studio pour visualisation des données.
- **Drizzle:** ORM TypeScript-first ultra-performant avec excellent type safety et requêtes SQL-like.
- **Kysely:** Query builder TypeScript type-safe sans couche d'abstraction lourde, offrant un contrôle fin sur SQL.
- **Supabase:** Base de données PostgreSQL managed avec APIs auto-générées, real-time subscriptions, et storage.

#### Patterns API et data fetching

- **tRPC:** End-to-end type safety entre client et serveur sans génération de code. Idéal pour monorepos fullstack TypeScript.
- **GraphQL (Apollo Client, urql):** APIs GraphQL pour data fetching flexible avec caching sophistiqué et code generation.
- **REST APIs:** API Routes natives de Next.js pour endpoints REST traditionnels avec support complet des méthodes HTTP.
- **Server Actions:** Nouvelles primitives Next.js 14+ permettant d'appeler des fonctions serveur directement depuis les composants.

#### CMS et gestion de contenu

- **Contentful:** Headless CMS enterprise avec excellent DX, APIs puissantes, et rich text editor.
- **Sanity.io:** CMS en temps réel hautement customisable avec Studio React et excellent support Next.js.
- **Strapi:** CMS open-source self-hosted offrant un control panel complet et APIs générées automatiquement.
- **Payload CMS:** CMS moderne TypeScript-first avec excellent DX et intégration Next.js native.

## Exemples {#examples}

### Exemples pratiques avec Next.js

#### Server Component avec data fetching

```typescript
// app/products/page.tsx - Server Component par défaut
import { prisma } from '@/lib/prisma';

async function getProducts() {
  // Fetch direct depuis la base de données côté serveur
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Nos Produits</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - {product.price}€</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Server Action pour mutation de formulaire

```typescript
// app/products/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);

  await prisma.product.create({
    data: { name, price },
  });

  // Revalider le cache de la page produits
  revalidatePath('/products');
}

// app/products/new/page.tsx
import { createProduct } from '../actions';

export default function NewProductPage() {
  return (
    <form action={createProduct}>
      <input name="name" placeholder="Nom du produit" required />
      <input name="price" type="number" step="0.01" required />
      <button type="submit">Créer</button>
    </form>
  );
}
```

#### Middleware pour protection de routes

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // Rediriger vers login si pas authentifié
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Ajouter des headers personnalisés
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

#### API Route handler (App Router)

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await prisma.user.create({ data: body });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }
}
```

#### Streaming avec Suspense boundaries

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function UserStats() {
  // Simulation d'une requête lente
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return <div>Stats chargées: 1,234 utilisateurs</div>;
}

async function RecentActivity() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <div>Dernière activité: il y a 5 minutes</div>;
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* RecentActivity se charge d'abord, UserStats ensuite */}
      <Suspense fallback={<div>Chargement activité...</div>}>
        <RecentActivity />
      </Suspense>

      <Suspense fallback={<div>Chargement stats...</div>}>
        <UserStats />
      </Suspense>
    </div>
  );
}
```

## Avantages {#advantages}

### Pourquoi choisir Next.js ?

- **React Server Components:** Architecture moderne permettant de réduire drastiquement la taille des bundles JavaScript en exécutant les composants côté serveur. Amélioration significative des performances et du temps de chargement initial.

- **Optimisations automatiques:** Next.js optimise automatiquement les images (`next/image`), les fonts (`next/font`), et les scripts tiers, éliminant le besoin de configuration manuelle et garantissant les meilleures pratiques web.

- **Developer Experience exceptionnel:** Hot Module Replacement rapide, TypeScript support natif, error overlay détaillé, et Fast Refresh rendent le développement fluide et agréable.

- **Rendu flexible:** Choix entre SSR, SSG, ISR, et CSR au niveau de chaque page ou composant. Cette flexibilité permet d'optimiser chaque partie de l'application selon ses besoins spécifiques.

- **File-based routing:** System de routing intuitif basé sur l'arborescence de fichiers, avec support des layouts partagés, loading states, et error boundaries.

- **Edge Computing ready:** Support natif du edge runtime permettant d'exécuter du code au plus près des utilisateurs pour une latence minimale.

- **Écosystème React riche:** Accès complet à l'écosystème React avec des milliers de composants et librairies, combiné aux fonctionnalités full-stack de Next.js.

## Tendances {#trends}

### Tendances et évolutions de Next.js

#### React Server Components adoption mainstream

Next.js a été le premier framework majeur à implémenter les React Server Components en production avec l'App Router. En 2025, les Server Components sont devenus le standard de facto pour les nouvelles applications Next.js, permettant de diviser l'application entre server-only code et client-interactive code. Cette architecture réduit significativement les bundles JavaScript et améliore les performances.

#### Streaming et Suspense pour une meilleure UX

Le streaming SSR avec Suspense boundaries permet d'envoyer progressivement le HTML au navigateur, améliorant le TTFB (Time To First Byte) et donnant une perception de rapidité accrue. Les utilisateurs voient le contenu par sections plutôt que d'attendre le chargement complet, transformant l'expérience utilisateur.

#### Patterns Edge Runtime et Middleware

L'edge computing se généralise avec Next.js Middleware permettant d'exécuter du code sur les edge nodes globalement distribués. Cette approche réduit la latence en traitant les requêtes au plus près des utilisateurs. Cas d'usage: A/B testing, géolocalisation, authentication, redirections, et personnalisation de contenu.

#### Partial Prerendering (PPR) - Future de l'hybridation

Fonctionnalité expérimentale de Next.js 14+ combinant le meilleur du statique et du dynamique. PPR permet de prégenérer la structure statique d'une page tout en laissant des "trous" pour le contenu dynamique qui sera streamed au runtime. Cette approche hybride promet les performances du SSG avec la flexibilité du SSR.

## Conclusion {#conclusion}

### Next.js : le framework React full-stack de référence

Next.js s'est imposé comme le framework React de référence pour les applications web modernes, offrant une solution complète du frontend au backend. Avec les React Server Components, l'optimisation automatique, et un écosystème mature, Next.js permet de créer des applications performantes et scalables avec une excellente expérience développeur.

L'avenir de Next.js est prometteur avec des innovations continues comme le Partial Prerendering, l'amélioration du support edge computing, et l'intégration toujours plus profonde avec l'écosystème React. Pour tout projet React nécessitant SSR, optimisations avancées, ou architecture full-stack, Next.js représente le choix le plus solide en 2025.

## Ressources {#resources}

### Pour apprendre

- [Documentation officielle Next.js](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) - Tutoriel interactif
- [Blog Vercel](https://vercel.com/blog)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Awesome Next.js](https://github.com/unicodeveloper/awesome-nextjs)
- [Next.js Conf Videos](https://nextjs.org/conf)

## Sources {#sources}

### Références bibliographiques

#### Documentation officielle

- [Next.js Official Documentation](https://nextjs.org/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Blog](https://nextjs.org/blog)
- [Vercel Engineering Blog](https://vercel.com/blog)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

#### Alternatives et comparaisons

- [Remix Framework](https://remix.run/)
- [Astro Build](https://astro.build/)
- [Nuxt.js - The Vue Framework](https://nuxt.com/)
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Gatsby Framework](https://www.gatsbyjs.com/)
- [Next.js vs Remix Comparison](https://remix.run/blog/remix-vs-next)
- [Framework Benchmarks](https://krausest.github.io/js-framework-benchmark/)

#### Écosystème et intégrations

- [Vercel Platform](https://vercel.com/)
- [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- [Clerk Authentication](https://clerk.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [tRPC - End-to-end typesafe APIs](https://trpc.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sanity CMS](https://www.sanity.io/)
- [Contentful CMS](https://www.contentful.com/)

#### Tendances et architecture

- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Partial Prerendering](https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)