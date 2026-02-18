---
title: Déployer un site Next.js
description: Workflow GitHub Actions pour builder et déployer automatiquement un site Next.js en export statique sur GitHub Pages.
category: github
slug: workflows/nextjs
order: 2
---

## Introduction {#intro}

**Next.js** est un framework React qui supporte le rendu statique, le rendu côté serveur (SSR), et l'export statique. Ce dernier mode permet de générer un site entièrement statique, déployable sur **GitHub Pages** sans serveur.

Ce guide présente un workflow GitHub Actions pour déployer automatiquement un projet Next.js en mode **static export** sur GitHub Pages.

### Export statique vs SSR

| Mode              | Serveur requis | GitHub Pages | Cas d'usage                         |
| ----------------- | -------------- | ------------ | ----------------------------------- |
| **Static Export** | Non            | Compatible   | Portfolio, docs, blog, landing page |
| **SSR / App**     | Oui            | Incompatible | App dynamique, API routes, auth     |

> **Important** : GitHub Pages ne supporte que des fichiers statiques. Votre projet Next.js doit être configuré en mode `export` pour fonctionner.

## Prérequis {#prerequis}

- Un projet Next.js fonctionnel avec `npm run build` qui passe sans erreur
- Le mode `export` activé dans `next.config.ts`
- Un dépôt GitHub avec GitHub Pages activé (source : **GitHub Actions**)

### Configuration Next.js requise

Votre fichier `next.config.ts` doit contenir :

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export", // Génère un site statique dans /out
    trailingSlash: true, // Ajoute un / à la fin des URLs
    images: {
        unoptimized: true, // Désactive l'optimisation d'images (pas de serveur)
    },
};

export default nextConfig;
```

| Option               | Rôle                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| `output: "export"`   | Active l'export statique — le build génère un dossier `out/` au lieu de `.next/` |
| `trailingSlash`      | URLs terminées par `/` (obligatoire pour GitHub Pages)                           |
| `images.unoptimized` | Désactive l'API d'optimisation d'images qui nécessite un serveur                 |

## Le workflow {#workflow}

Créez le fichier `.github/workflows/deploy.yml` dans votre dépôt :

```yml
name: Deploy Next.js website

on:
    push:
        branches: ["master"]

    workflow_dispatch:

permissions:
    contents: read
    pages: write
    id-token: write

concurrency:
    group: "pages"
    cancel-in-progress: false

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Node
              uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: npm

            - name: Setup Pages
              uses: actions/configure-pages@v4

            - name: Install dependencies
              run: npm ci

            - name: Build with Next.js
              run: npm run build

            - name: Upload artifact
              uses: actions/upload-pages-artifact@v3
              with:
                  path: out

    deploy:
        environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
        needs: build
        runs-on: ubuntu-latest
        steps:
            - name: Deploy to GitHub Pages
              id: deployment
              uses: actions/deploy-pages@v4
```

## Explication détaillée {#details}

### Différences avec le workflow VitePress

Si vous avez lu le guide [VitePress](/help/github/workflows/vitepress), voici les différences clés :

| Aspect             | VitePress                   | Next.js                   |
| ------------------ | --------------------------- | ------------------------- |
| **Checkout**       | `fetch-depth: 0` (full)     | Par défaut (shallow)      |
| **Build command**  | `npm run build` (VitePress) | `npm run build` (Next.js) |
| **Sortie**         | `src/.vitepress/dist`       | `out`                     |
| **Config requise** | `config.ts` VitePress       | `next.config.ts` export   |

> **Pourquoi pas de `fetch-depth: 0` ?** : VitePress utilise l'historique git pour les dates de mise à jour. Next.js n'a pas ce besoin par défaut, donc un clone shallow (plus rapide) suffit.

### Les étapes du build

| Étape           | Action                             | Détail                                              |
| --------------- | ---------------------------------- | --------------------------------------------------- |
| **Checkout**    | `actions/checkout@v4`              | Clone le dépôt (shallow par défaut)                 |
| **Setup Node**  | `actions/setup-node@v4`            | Installe Node.js 20 avec cache npm                  |
| **Setup Pages** | `actions/configure-pages@v4`       | Configure l'environnement GitHub Pages              |
| **Install**     | `npm ci`                           | Installe les dépendances depuis `package-lock.json` |
| **Build**       | `npm run build`                    | Compile le projet Next.js en HTML statique          |
| **Upload**      | `actions/upload-pages-artifact@v3` | Envoie le dossier `out/` comme artifact             |

### Que fait `npm run build` ?

Pour un projet Next.js en mode export, le build :

1. **Compile TypeScript** → JavaScript
2. **Génère les pages statiques** pour toutes les routes (y compris les routes dynamiques via `generateStaticParams`)
3. **Optimise le CSS** (Tailwind CSS purge les classes inutilisées)
4. **Bundle le JavaScript** avec minification et tree-shaking
5. **Copie les assets** (images, polices, etc.) dans `out/`

Le résultat est un dossier `out/` contenant uniquement des fichiers HTML, CSS, JS et des assets — prêt à être servi par n'importe quel hébergeur statique.

### Script de pré-build

Si votre projet utilise un script de génération de données (comme ce portfolio), votre `package.json` peut ressembler à :

```json
{
    "scripts": {
        "generate": "tsx scripts/generate.ts",
        "build": "npm run generate && next build && cp -r legacy out/"
    }
}
```

Le script `generate` compile les fichiers Markdown en JSON **avant** le build Next.js. Cela permet d'avoir du contenu dynamique (docs, projets, etc.) tout en restant 100% statique.

## Personnalisation {#custom}

### Changer la branche

```yml
on:
    push:
        branches: ["main"] # Au lieu de "master"
```

### Ajouter des variables d'environnement

```yml
- name: Build with Next.js
  run: npm run build
  env:
      NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      NEXT_PUBLIC_GA_ID: ${{ vars.GA_ID }}
```

> Les variables `NEXT_PUBLIC_*` sont exposées côté client. Les autres ne sont disponibles que côté serveur (build-time pour l'export statique).

### Changer le chemin de sortie

Si vous changez le dossier de sortie dans `next.config.ts` :

```ts
const nextConfig: NextConfig = {
    output: "export",
    distDir: "build", // Par défaut: "out" pour export
};
```

Adaptez le workflow :

```yml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
      path: build
```

### Ajouter un cache pour accélérer le build

```yml
- name: Cache Next.js
  uses: actions/cache@v4
  with:
      path: .next/cache
      key: nextjs-${{ hashFiles('package-lock.json') }}
      restore-keys: nextjs-
```

> Le cache `.next/cache` accélère les builds en réutilisant les résultats précédents (webpack, images optimisées, etc.).

## Limitations de l'export statique {#limitations}

Certaines fonctionnalités Next.js ne sont **pas disponibles** en mode export :

| Fonctionnalité         | Disponible | Alternative                               |
| ---------------------- | ---------- | ----------------------------------------- |
| API Routes (`/api/*`)  | Non        | Service externe (API séparée)             |
| SSR / ISR              | Non        | Regénérer et redéployer                   |
| Middleware             | Non        | Redirection côté hébergeur                |
| Image Optimization     | Non        | `unoptimized: true` dans la config        |
| `generateStaticParams` | Oui        | Fonctionne normalement                    |
| `dynamicParams`        | Oui        | Utile pour restreindre les routes valides |
| Client Components      | Oui        | Fonctionne normalement                    |
| CSS Modules / Tailwind | Oui        | Fonctionne normalement                    |

## Résumé {#resume}

| Élément         | Valeur                             |
| --------------- | ---------------------------------- |
| **Framework**   | Next.js (React)                    |
| **Mode**        | Static Export (`output: "export"`) |
| **Déclencheur** | Push sur `master` + manuel         |
| **Node.js**     | 20                                 |
| **Build**       | `npm run build`                    |
| **Sortie**      | `out/`                             |
| **Déploiement** | GitHub Pages                       |

> **Voir aussi** : [Déployer un site VitePress](/help/github/workflows/vitepress) pour comparer avec un workflow VitePress, et [Héberger un site sur GitHub Pages](/help/github/pages) pour la configuration initiale de GitHub Pages.