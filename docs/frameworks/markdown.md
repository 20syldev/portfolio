---
title: Modules Markdown pour présenter du contenu
description: Utiliser React Markdown et VitePress pour transformer du Markdown en interfaces riches et maintenables.
category: frameworks
slug: markdown
order: 2
---

## Introduction {#intro}

Le Markdown est un format de texte simple qui se transforme facilement en HTML. Plutôt que d'écrire du HTML ou du JSX directement, vous écrivez du contenu en Markdown et un **module** le convertit automatiquement en composants rendus à l'écran.

### Pourquoi cette approche ?

- **Maintenabilité** : Le contenu est séparé du code — pas besoin de toucher aux composants pour modifier un texte
- **Lisibilité** : Le Markdown est lisible même sans rendu, contrairement au HTML
- **Productivité** : Écrire en Markdown est beaucoup plus rapide qu'écrire du JSX
- **Portabilité** : Les fichiers `.md` fonctionnent partout (GitHub, VS Code, éditeurs)
- **Collaboration** : N'importe qui peut éditer du Markdown, même sans connaître React

### Deux approches, deux outils

| Outil              | Écosystème | Cas d'usage                        | Exemple          |
| ------------------ | ---------- | ---------------------------------- | ---------------- |
| **React Markdown** | React      | Contenu intégré dans une app React | Ce portfolio     |
| **VitePress**      | Vue.js     | Site de documentation dédié        | docs.sylvain.pro |

## React Markdown {#react-markdown}

**React Markdown** est une bibliothèque qui transforme du Markdown en composants React. Elle est idéale quand le contenu Markdown fait partie d'une application React ou Next.js.

### Installation

```bash
npm install react-markdown remark-gfm
```

| Package          | Rôle                                                   |
| ---------------- | ------------------------------------------------------ |
| `react-markdown` | Convertit le Markdown en éléments React                |
| `remark-gfm`     | Ajoute le support GFM (tables, listes de tâches, etc.) |

### Utilisation de base

```tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MonContenu({ content }: { content: string }) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
```

C'est tout. Le Markdown est automatiquement converti en HTML sémantique : `##` devient `<h2>`, `**texte**` devient `<strong>`, etc.

### Composants personnalisés

La vraie puissance de React Markdown réside dans le **remplacement des éléments HTML** par vos propres composants React. Chaque élément Markdown peut être remplacé :

```tsx
const components = {
    h2: ({ children }) => (
        <h2 className="text-2xl font-semibold mt-10 mb-4 border-t pt-6">{children}</h2>
    ),
    p: ({ children }) => <p className="text-muted-foreground leading-7 mb-4">{children}</p>,
    table: ({ children }) => (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">{children}</table>
        </div>
    ),
    code: ({ children, className }) => {
        const isInline = !className;
        if (isInline) {
            return <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>;
        }
        return <code className={className}>{children}</code>;
    },
    a: ({ children, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80"
        >
            {children}
        </a>
    ),
    img: ({ src, alt }) => (
        <figure className="my-6">
            <img src={src} alt={alt} className="rounded-lg border" />
            {alt && <figcaption className="text-center text-xs mt-2">{alt}</figcaption>}
        </figure>
    ),
};

<ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
    {content}
</ReactMarkdown>;
```

### Headings avec ID personnalisé

Pour générer une table des matières avec des ancres, vous pouvez utiliser une syntaxe custom dans le Markdown :

```md
## Ma section {#ma-section}
```

Et un parser dans le composant qui extrait l'ID :

```tsx
function parseHeadingId(children: ReactNode) {
    if (typeof children === "string") {
        const match = children.match(/^(.+?)\s*\{#([a-z0-9-]+)\}\s*$/i);
        if (match) {
            return { id: match[2], text: match[1].trim() };
        }
    }
    return { id: null, text: children };
}
```

Cela permet ensuite de naviguer vers `#ma-section` dans l'URL et de générer automatiquement une sidebar de navigation.

### Écosystème remark/rehype

React Markdown repose sur un pipeline de plugins :

| Plugin             | Type   | Rôle                                       |
| ------------------ | ------ | ------------------------------------------ |
| `remark-gfm`       | Remark | Tables, listes de tâches, autolinks, barré |
| `remark-math`      | Remark | Support des formules mathématiques LaTeX   |
| `rehype-highlight` | Rehype | Coloration syntaxique des blocs de code    |
| `rehype-slug`      | Rehype | Ajoute des IDs automatiques aux headings   |
| `rehype-raw`       | Rehype | Permet le HTML brut dans le Markdown       |

Les plugins **remark** transforment le Markdown, les plugins **rehype** transforment le HTML généré.

### Avantages de React Markdown

- **Intégration native** : Fonctionne directement dans une app React/Next.js
- **Composants custom** : Chaque élément peut être remplacé par un composant React
- **Plugins extensibles** : Large écosystème de plugins remark/rehype
- **Pas de build séparé** : Le Markdown est rendu au runtime (ou au build avec SSG)
- **Léger** : Pas de framework supplémentaire, juste une lib

## VitePress {#vitepress}

**VitePress** est un générateur de sites statiques construit sur **Vue.js** et **Vite**. Il transforme des fichiers Markdown en un site de documentation complet avec navigation, recherche et thème.

### Installation

```bash
npm init vitepress
```

L'assistant crée la structure du projet automatiquement.

### Structure type

```
docs-project/
├── src/
│   ├── .vitepress/
│   │   ├── config.ts      # Configuration du site
│   │   └── theme/          # Personnalisation du thème
│   ├── guide/
│   │   ├── getting-started.md
│   │   └── installation.md
│   └── index.md            # Page d'accueil
└── package.json
```

### Configuration

```ts
// src/.vitepress/config.ts
import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Ma Documentation",
    description: "Description du projet",
    themeConfig: {
        nav: [{ text: "Guide", link: "/guide/getting-started" }],
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
    },
});
```

### Fonctionnalités incluses

| Fonctionnalité         | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **Navigation auto**    | Sidebar et navbar configurables                     |
| **Recherche locale**   | Recherche plein texte intégrée                      |
| **Thème par défaut**   | Design professionnel avec mode clair/sombre         |
| **Composants Vue**     | Utiliser des composants Vue dans le Markdown        |
| **Conteneurs custom**  | `:::info`, `:::warning`, `:::danger` pour les notes |
| **Frontmatter**        | Métadonnées YAML en haut de chaque page             |
| **Table des matières** | Générée automatiquement à partir des headings       |
| **Multi-langue**       | Support i18n intégré                                |

### Conteneurs personnalisés

VitePress propose des conteneurs Markdown pour les notes et avertissements :

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
```

### Avantages de VitePress

- **Prêt à l'emploi** : Un site complet en quelques minutes
- **Recherche intégrée** : Pas besoin de service externe (Algolia en option)
- **Navigation automatique** : Sidebar et breadcrumbs configurables
- **Performance** : Build ultra-rapide grâce à Vite
- **Markdown étendu** : Conteneurs, code groups, badges, etc.
- **Idéal pour la doc** : Conçu spécifiquement pour la documentation technique

## Comparaison {#comparaison}

### Quand utiliser quoi ?

| Critère              | React Markdown               | VitePress                   |
| -------------------- | ---------------------------- | --------------------------- |
| **Type de projet**   | App React/Next.js existante  | Site de documentation dédié |
| **Framework**        | React                        | Vue.js                      |
| **Setup**            | `npm install react-markdown` | `npm init vitepress`        |
| **Personnalisation** | Composants React custom      | Thème Vue + config          |
| **Recherche**        | À implémenter                | Intégrée                    |
| **Navigation**       | À implémenter                | Auto-générée                |
| **Build séparé**     | Non (intégré à l'app)        | Oui (site autonome)         |
| **Hébergement**      | Avec l'app                   | Site statique indépendant   |

### Choix recommandé

- **React Markdown** si vous avez déjà une app React/Next.js et voulez y intégrer du contenu Markdown (portfolio, blog intégré, fiches projet, section d'aide)

- **VitePress** si vous voulez créer un site de documentation dédié, séparé de votre app principale (documentation technique, wiki, guides)

## Cas d'usage concrets {#cas-usage}

### Présenter un projet

Utilisez React Markdown pour afficher une fiche projet avec du contenu riche :

```
projects/mon-projet.md
```

```md
---
name: Mon Projet
description: Une description courte
tags: ["react", "typescript"]
github: https://github.com/user/projet
---

## Fonctionnalités

- Authentification JWT
- Dashboard en temps réel
- Export PDF

## Installation

\`\`\`bash
git clone https://github.com/user/projet.git
npm install && npm run dev
\`\`\`
```

Le script de génération compile ce Markdown en JSON, et un composant React l'affiche avec le style du site.

### Créer de la documentation

Utilisez VitePress pour un site de documentation autonome :

1. Créer le projet : `npm init vitepress`
2. Écrire les pages en Markdown dans `src/`
3. Configurer la sidebar dans `config.ts`
4. Déployer avec un [workflow GitHub Actions](/help/github/workflows/vitepress)

### Combiner les deux

C'est exactement ce qui est fait ici :

- **Ce portfolio** utilise React Markdown pour afficher les docs, projets et articles de veille
- **docs.sylvain.pro** utilise VitePress pour une documentation technique dédiée

Les deux coexistent, chacun avec son workflow de déploiement et son domaine.

## Résumé {#resume}

| Aspect               | React Markdown                    | VitePress                      |
| -------------------- | --------------------------------- | ------------------------------ |
| **Intégration**      | Dans une app React existante      | Site autonome                  |
| **Complexité setup** | Faible (1 package)                | Faible (assistant)             |
| **Personnalisation** | Composants React                  | Thème Vue + config             |
| **Maintenabilité**   | Contenu séparé du code            | Contenu séparé du code         |
| **Idéal pour**       | Portfolio, blog, app avec contenu | Documentation technique dédiée |

> **Voir aussi** : [Guide complet Next.js](/help/frameworks/nextjs) pour comprendre comment React Markdown est intégré dans ce projet, et les guides de déploiement [VitePress](/help/github/workflows/vitepress) et [Next.js](/help/github/workflows/nextjs).