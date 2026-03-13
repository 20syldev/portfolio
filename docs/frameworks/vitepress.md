---
title: VitePress
description: Créer un site de documentation statique avec VitePress — configuration, extensions Markdown, thème, déploiement GitHub Pages.
category: frameworks
slug: vitepress
order: 4
---

## Introduction {#intro}

**VitePress** est un générateur de sites statiques construit sur **Vue.js** et **Vite**. Il transforme des fichiers Markdown en un site de documentation complet avec navigation, recherche et thème — sans configuration manuelle.

Il est conçu pour la documentation technique : guides, API reference, wikis. Pour intégrer du Markdown dans une app React existante, préférez [React Markdown](/help/frameworks/react).

## Installation {#installation}

```bash
npm init vitepress
```

L'assistant interactif crée la structure du projet automatiquement. Il demande le nom du site, la langue et l'emplacement des sources.

### Structure type

```
docs-project/
├── src/
│   ├── .vitepress/
│   │   ├── config.ts       # Configuration du site
│   │   └── theme/          # Personnalisation du thème
│   │       ├── index.ts
│   │       └── custom.css
│   ├── guide/
│   │   ├── getting-started.md
│   │   └── installation.md
│   ├── api/
│   │   └── reference.md
│   └── index.md            # Page d'accueil
└── package.json
```

### Commandes

| Commande               | Action                                   |
| ---------------------- | ---------------------------------------- |
| `npm run docs:dev`     | Serveur de développement avec hot reload |
| `npm run docs:build`   | Build statique dans `.vitepress/dist/`   |
| `npm run docs:preview` | Prévisualiser le build localement        |

## Configuration {#configuration}

```ts
// src/.vitepress/config.ts
import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Ma Documentation",
    description: "Description du projet",
    srcDir: "src",
    lang: "fr-FR",
    themeConfig: {
        nav: [
            { text: "Guide", link: "/guide/getting-started" },
            { text: "API", link: "/api/reference" },
        ],
        sidebar: [
            {
                text: "Guide",
                items: [
                    { text: "Démarrage", link: "/guide/getting-started" },
                    { text: "Installation", link: "/guide/installation" },
                ],
            },
        ],
        search: { provider: "local" },
        footer: {
            message: "Publié sous licence MIT",
            copyright: "© 2025 Mon Projet",
        },
        socialLinks: [{ icon: "github", link: "https://github.com/user/project" }],
        editLink: {
            pattern: "https://github.com/user/project/edit/main/src/:path",
            text: "Modifier cette page",
        },
    },
});
```

## Fonctionnalités incluses {#features}

| Fonctionnalité         | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **Navigation auto**    | Sidebar et navbar configurables                     |
| **Recherche locale**   | Recherche plein texte intégrée (sans serveur)       |
| **Thème par défaut**   | Design professionnel avec mode clair/sombre         |
| **Composants Vue**     | Utiliser des composants Vue dans le Markdown        |
| **Conteneurs custom**  | `:::info`, `:::warning`, `:::danger` pour les notes |
| **Frontmatter**        | Métadonnées YAML en haut de chaque page             |
| **Table des matières** | Générée automatiquement à partir des headings       |
| **Multi-langue**       | Support i18n intégré                                |
| **Edit Link**          | Lien "Modifier cette page" vers le dépôt GitHub     |

## Extensions Markdown {#extensions}

VitePress étend le Markdown standard avec de nombreuses fonctionnalités supplémentaires.

### Conteneurs personnalisés

```md
:::info
Ceci est une note d'information.
:::

:::warning
Attention à ce point important.
:::

:::danger
Ne faites jamais ceci en production !
:::

:::details Cliquez pour voir
Contenu masqué par défaut, révélé au clic.
:::

:::tip Titre personnalisé
Vous pouvez personnaliser le titre du conteneur.
:::
```

### Groupes de code

Afficher plusieurs implémentations côte à côte avec des onglets :

````md
:::code-group

```bash [npm]
npm install react-markdown
```

```bash [pnpm]
pnpm add react-markdown
```

```bash [yarn]
yarn add react-markdown
```

:::
````

### Highlighting de lignes

Mettre en évidence des lignes spécifiques dans un bloc de code :

````md
```ts{1,3-5}
const a = 1;   // ligne 1 surlignée
const b = 2;
const c = 3;   // lignes 3-5 surlignées
const d = 4;
const e = 5;
```
````

Syntaxes disponibles :

- `{3}` — une ligne
- `{3-5}` — plage de lignes
- `{1,3-5}` — combinaison

### Numéros de lignes

````md
```ts:line-numbers
const hello = "world";
const foo = "bar";
```
````

````
### Badges

```md
## Ma fonctionnalité <Badge type="info" text="nouveau" />

## Fonction dépréciée <Badge type="warning" text="deprecated" />

## Fonctionnalité supprimée <Badge type="danger" text="removed" />
```

### Import de code externe

Importer directement le contenu d'un fichier source :

```md
<<< @/src/components/example.ts

<<< @/src/components/example.ts{ts} (avec syntaxe)

<<< @/src/components/example.ts#region (région marquée)
```

## Frontmatter par page {#frontmatter}

Chaque page peut définir ses propres métadonnées en YAML :

```md
---
title: Mon Guide
description: Description de cette page spécifique
layout: home
outline: deep
sidebar: false
---
```

| Champ         | Rôle                                                    |
| ------------- | ------------------------------------------------------- |
| `title`       | Titre de la page (overrides config)                     |
| `description` | Description pour les moteurs de recherche               |
| `layout`      | `doc` (défaut), `home` (page d'accueil), `page` (blank) |
| `outline`     | `false` (masquer TdM), `deep` (tous niveaux), `[2,3]`   |
| `sidebar`     | `false` pour masquer la sidebar sur cette page          |
| `editLink`    | `false` pour masquer le lien d'édition                  |

### Page d'accueil

Le layout `home` accepte une structure spéciale :

```md
---
layout: home

hero:
  name: Mon Projet
  text: Une super documentation
  tagline: Simple, rapide, accessible
  actions:
    - theme: brand
      text: Démarrer
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/user/project

features:
  - title: Rapide
    details: Construit sur Vite pour un build ultra-rapide.
  - title: Extensible
    details: Plugins Vue et Markdown à volonté.
---
```

## Composants Vue dans le Markdown {#vue}

VitePress permet d'utiliser des composants Vue directement dans les fichiers Markdown :

```vue
<!-- src/.vitepress/theme/components/MonComposant.vue -->
<template>
    <div class="mon-composant">
        <slot />
    </div>
</template>
```

```ts
// src/.vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import MonComposant from "./components/MonComposant.vue";
import type { Theme } from "vitepress";

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("MonComposant", MonComposant);
    },
} satisfies Theme;
```

```md
<!-- Utilisation dans n'importe quel fichier .md -->
<MonComposant>
Contenu passé en slot
</MonComposant>
```

## Thème personnalisé {#theme}

### CSS variables

VitePress expose des variables CSS pour personnaliser les couleurs :

```css
/* src/.vitepress/theme/custom.css */
:root {
    --vp-c-brand-1: #646cff;
    --vp-c-brand-2: #747bff;
    --vp-c-brand-soft: rgba(100, 108, 255, 0.14);
}

/* Personnaliser la sidebar */
.VPSidebar {
    background-color: var(--vp-c-bg-alt);
}

/* Personnaliser les conteneurs */
.custom-block.info {
    border-color: var(--vp-c-brand-1);
}
```

```ts
// src/.vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default DefaultTheme;
```

## Déploiement GitHub Pages {#deployment}

Créez un workflow GitHub Actions pour déployer automatiquement :

```yaml
# .github/workflows/docs.yml
name: Deploy VitePress to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

Activez GitHub Pages dans les paramètres du dépôt : **Settings → Pages → Source → GitHub Actions**.

## Recherche Algolia {#algolia}

Pour une recherche plus avancée, connectez Algolia DocSearch :

```ts
// src/.vitepress/config.ts
export default defineConfig({
    themeConfig: {
        search: {
            provider: "algolia",
            options: {
                appId: "VOTRE_APP_ID",
                apiKey: "VOTRE_CLE_PUBLIQUE",
                indexName: "VOTRE_INDEX",
            },
        },
    },
});
```

Algolia DocSearch est gratuit pour les projets open source. La recherche locale (`provider: "local"`) fonctionne sans configuration pour la plupart des cas.

## Avantages {#advantages}

- **Prêt à l'emploi** : Un site complet en quelques minutes
- **Recherche intégrée** : Pas besoin de service externe (Algolia en option)
- **Navigation automatique** : Sidebar et breadcrumbs configurables
- **Performance** : Build ultra-rapide grâce à Vite
- **Markdown étendu** : Conteneurs, code groups, badges, import de fichiers
- **Composants Vue** : Enrichir le Markdown avec des composants interactifs
- **Idéal pour la doc** : Conçu spécifiquement pour la documentation technique
````