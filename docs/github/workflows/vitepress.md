---
title: Déployer un site VitePress
description: Workflow GitHub Actions pour builder et déployer automatiquement un site VitePress sur GitHub Pages.
category: github
slug: workflows/vitepress
order: 1
---

## Introduction {#intro}

**VitePress** est un générateur de sites statiques construit sur **Vue.js** et **Vite**. Il est conçu pour créer des sites de documentation performants à partir de fichiers Markdown.

Ce guide présente un workflow GitHub Actions prêt à l'emploi pour déployer automatiquement un site VitePress sur **GitHub Pages** à chaque push.

### Pourquoi VitePress ?

- **Rapide** : Basé sur Vite, le build est quasi instantané
- **Markdown natif** : Écrivez en Markdown, VitePress génère le HTML
- **Vue.js intégré** : Utilisez des composants Vue directement dans le Markdown
- **Thème par défaut** : Navigation, sidebar et recherche inclus
- **SEO optimisé** : Génération statique avec métadonnées

## Prérequis {#prerequis}

- Un projet VitePress fonctionnel localement (`npm run build` passe sans erreur)
- Un dépôt GitHub avec GitHub Pages activé (source : **GitHub Actions**)
- Node.js et npm configurés dans le projet

### Structure type d'un projet VitePress

```
mon-projet/
├── src/
│   ├── .vitepress/
│   │   ├── config.ts        # Configuration VitePress
│   │   └── dist/            # Sortie du build (généré)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md             # Page d'accueil
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml       # Le workflow ci-dessous
```

## Le workflow {#workflow}

Créez le fichier `.github/workflows/deploy.yml` dans votre dépôt :

```yml
name: Deploy Vue.js website

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
              with:
                  fetch-depth: 0

            - name: Setup Node
              uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: npm

            - name: Setup Pages
              uses: actions/configure-pages@v4

            - name: Install dependencies
              run: npm ci

            - name: Build with VitePress
              run: npm run build

            - name: Upload artifact
              uses: actions/upload-pages-artifact@v3
              with:
                  path: src/.vitepress/dist

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

### Déclencheurs

```yml
on:
    push:
        branches: ["master"]
    workflow_dispatch:
```

- **push** : Le workflow se lance automatiquement à chaque push sur la branche `master`
- **workflow_dispatch** : Permet de lancer le workflow manuellement depuis l'onglet **Actions** de GitHub

> **Changer la branche** : Remplacez `"master"` par `"main"` ou tout autre nom de branche selon votre configuration.

### Permissions

```yml
permissions:
    contents: read
    pages: write
    id-token: write
```

| Permission | Rôle                                           |
| ---------- | ---------------------------------------------- |
| `contents` | Lire le code source du dépôt                   |
| `pages`    | Écrire et publier sur GitHub Pages             |
| `id-token` | Authentification sécurisée pour le déploiement |

### Concurrency

```yml
concurrency:
    group: "pages"
    cancel-in-progress: false
```

Empêche plusieurs déploiements simultanés. Avec `cancel-in-progress: false`, un déploiement en cours **n'est pas annulé** par un nouveau push — le nouveau attend que l'ancien termine.

### Job de build

Les étapes du build :

| Étape           | Action                             | Détail                                                                   |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| **Checkout**    | `actions/checkout@v4`              | Clone le dépôt avec `fetch-depth: 0` (historique complet pour les dates) |
| **Setup Node**  | `actions/setup-node@v4`            | Installe Node.js 20 avec cache npm                                       |
| **Setup Pages** | `actions/configure-pages@v4`       | Configure l'environnement GitHub Pages                                   |
| **Install**     | `npm ci`                           | Installe les dépendances (plus rapide et fiable que `npm install`)       |
| **Build**       | `npm run build`                    | Compile le site VitePress                                                |
| **Upload**      | `actions/upload-pages-artifact@v3` | Envoie le dossier `src/.vitepress/dist` comme artifact                   |

> **`fetch-depth: 0`** : VitePress utilise les dates de commit git pour afficher "Dernière mise à jour" sur chaque page. Sans l'historique complet, ces dates seraient incorrectes.

### Job de déploiement

```yml
deploy:
    environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
    needs: build
```

- **needs: build** : Attend que le build soit terminé avec succès
- **environment** : Associe le déploiement à l'environnement `github-pages` dans GitHub (visible dans Settings > Environments)

## Personnalisation {#custom}

### Changer la branche

```yml
on:
    push:
        branches: ["main"] # Au lieu de "master"
```

### Changer le chemin de build

Si votre configuration VitePress génère le site dans un dossier différent :

```yml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
      path: docs/.vitepress/dist # Adaptez selon votre structure
```

Le chemin dépend de votre `package.json`. Si votre script `build` est `vitepress build docs`, la sortie sera dans `docs/.vitepress/dist`.

### Changer la version de Node.js

```yml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
      node-version: 22 # Ou 18, selon vos besoins
      cache: npm
```

### Ajouter des variables d'environnement

Si votre build nécessite des variables d'environnement :

```yml
- name: Build with VitePress
  run: npm run build
  env:
      VITE_API_URL: ${{ secrets.API_URL }}
```

## Résumé {#resume}

| Élément         | Valeur                     |
| --------------- | -------------------------- |
| **Framework**   | VitePress (Vue.js + Vite)  |
| **Déclencheur** | Push sur `master` + manuel |
| **Node.js**     | 20                         |
| **Build**       | `npm run build`            |
| **Sortie**      | `src/.vitepress/dist`      |
| **Déploiement** | GitHub Pages               |
| **Checkout**    | Historique complet         |

> **Voir aussi** : [Déployer un site Next.js](/help/github/workflows/nextjs) pour comparer avec un workflow Next.js, et [Héberger un site sur GitHub Pages](/help/github/pages) pour la configuration initiale de GitHub Pages.