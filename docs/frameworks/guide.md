---
title: Guide complet Next.js + TypeScript + Tailwind CSS
description: Architecture, structure, build et personnalisation d'un projet Next.js avec TypeScript et Tailwind CSS.
category: frameworks
slug: nextjs
order: 1
---

## Introduction {#intro}

Ce guide documente le fonctionnement complet d'un projet web moderne basé sur le stack **Next.js + TypeScript + Tailwind CSS**. Il s'appuie sur l'architecture de ce portfolio comme exemple concret.

### Le stack technique

| Technologie        | Version | Rôle                                            |
| ------------------ | ------- | ----------------------------------------------- |
| **Next.js**        | 16      | Framework React (routing, SSG, export statique) |
| **React**          | 19      | Bibliothèque UI (composants, hooks, state)      |
| **TypeScript**     | 5       | Typage statique                                 |
| **Tailwind CSS**   | 4       | Styles utilitaires                              |
| **Radix UI**       | -       | Composants accessibles (Dialog, Tooltip, etc.)  |
| **Lucide React**   | -       | Icônes SVG                                      |
| **React Markdown** | 10      | Rendu Markdown en composants React              |

## Structure du projet {#structure}

```
portfolio/
├── docs/                    # Fichiers Markdown des docs (help)
│   ├── git/
│   ├── github/
│   ├── linux/
│   └── nextjs/
├── projects/                # Fiches projets en Markdown
├── veille/                  # Articles de veille technologique
├── scripts/
│   └── generate.ts          # Compile le Markdown en JSON
├── public/                  # Assets statiques (images, favicon, etc.)
├── src/
│   ├── app/                 # Routes Next.js (App Router)
│   ├── components/          # Composants React réutilisables
│   ├── data/                # Données typées + JSON généré
│   ├── hooks/               # Hooks React personnalisés
│   └── lib/                 # Fonctions utilitaires
├── next.config.ts           # Configuration Next.js
├── package.json
├── tsconfig.json
└── postcss.config.mjs       # PostCSS (Tailwind CSS 4)
```

### Les dossiers clés

| Dossier           | Contenu                                                           |
| ----------------- | ----------------------------------------------------------------- |
| `docs/`           | Documentation Markdown, organisée par catégorie et sous-catégorie |
| `projects/`       | Fiches projets avec frontmatter (nom, tags, liens, etc.)          |
| `veille/`         | Articles de veille technologique en Markdown                      |
| `scripts/`        | Script de génération des données (Markdown → JSON)                |
| `src/app/`        | Pages et routes de l'application                                  |
| `src/components/` | Composants React organisés par rôle                               |
| `src/data/`       | Interfaces TypeScript + JSON généré                               |
| `src/hooks/`      | Hooks personnalisés (scroll, API, etc.)                           |
| `src/lib/`        | Fonctions utilitaires et helpers                                  |

## Le système de routing {#routing}

Next.js utilise l'**App Router** : chaque dossier dans `src/app/` correspond à une route URL.

### Routes principales

| Route                        | Fichier                                  | Description                    |
| ---------------------------- | ---------------------------------------- | ------------------------------ |
| `/`                          | `app/page.tsx`                           | Page d'accueil                 |
| `/help`                      | `app/help/page.tsx`                      | Index de la documentation      |
| `/help/[category]`           | `app/help/[category]/page.tsx`           | Liste des docs d'une catégorie |
| `/help/[category]/[...slug]` | `app/help/[category]/[...slug]/page.tsx` | Page d'un doc spécifique       |
| `/projet/[id]`               | `app/projet/[id]/page.tsx`               | Fiche d'un projet              |
| `/veille/[tech]`             | `app/veille/[tech]/page.tsx`             | Article de veille              |
| `/card/[id]`                 | `app/card/[id]/page.tsx`                 | Carte de visite                |

### Routes dynamiques

Les routes entre crochets `[param]` sont des routes dynamiques. Avec l'export statique, chaque route dynamique doit définir `generateStaticParams()` pour indiquer les pages à générer :

```tsx
// Exemple : app/help/[category]/page.tsx
export function generateStaticParams() {
    const categories = getDocCategories();
    return categories.map((category) => ({ category }));
}
```

Cette fonction retourne toutes les valeurs possibles du paramètre. Au build, Next.js génère une page HTML pour chaque valeur.

### Catch-all routes

La route `[...slug]` est un **catch-all** : elle capture un ou plusieurs segments d'URL.

- `/help/github/pages` → `slug = ["pages"]`
- `/help/github/configuration/namecheap` → `slug = ["configuration", "namecheap"]`

Cela permet de gérer les docs simples et les sous-catégories avec une seule route.

### Restreindre les routes

```tsx
export const dynamicParams = false;
```

Avec cette option, seules les routes retournées par `generateStaticParams()` sont valides. Toute autre URL retourne une 404.

## Build et développement {#build}

### Commandes disponibles

| Commande           | Action                                                      |
| ------------------ | ----------------------------------------------------------- |
| `npm run dev`      | Génère les données + lance le serveur de développement      |
| `npm run build`    | Génère les données + build de production + copie des assets |
| `npm run start`    | Sert le dossier `out/` localement (preview du build)        |
| `npm run generate` | Compile les Markdown en JSON (données uniquement)           |
| `npm run check`    | Vérification TypeScript (`tsc --noEmit`)                    |
| `npm run lint`     | Linting ESLint                                              |
| `npm run format`   | Formatage du code                                           |

### Le script de génération

Le script `scripts/generate.ts` est au coeur du système de contenu. Il :

1. **Lit** tous les fichiers `.md` dans `docs/`, `projects/` et `veille/`
2. **Parse** le frontmatter (métadonnées YAML en haut de chaque fichier) avec `gray-matter`
3. **Extrait** la catégorie depuis la structure de dossiers
4. **Génère** des fichiers JSON dans `src/data/` :
    - `docs.json` — Documentation
    - `projects.json` — Projets
    - `veille.json` — Veille technologique

Ce JSON est ensuite importé par les composants React au build.

### Le processus de build

```
npm run build
    │
    ├── 1. npm run generate    → Markdown → JSON
    ├── 2. next build          → Compilation + génération HTML
    └── 3. cp -r legacy out/   → Copie des assets legacy
```

Le résultat est un dossier `out/` contenant uniquement des fichiers statiques (HTML, CSS, JS, images).

### Configuration Next.js

```ts
// next.config.ts
const nextConfig: NextConfig = {
    output: process.env.NODE_ENV === "production" ? "export" : undefined,
    trailingSlash: true,
    images: { unoptimized: true },
};
```

| Option          | Valeur                  | Rôle                                                  |
| --------------- | ----------------------- | ----------------------------------------------------- |
| `output`        | `"export"` en prod      | Génère un site statique (pas de serveur requis)       |
| `trailingSlash` | `true`                  | URLs avec `/` final (nécessaire pour GitHub Pages)    |
| `images`        | `{ unoptimized: true }` | Pas d'optimisation serveur (incompatible avec export) |

> En développement, `output` est `undefined` pour garder le hot reload et les features dev de Next.js.

## Les composants {#components}

### Organisation

```
src/components/
├── detail/          # Rendu de contenu (Markdown, layout, navigation)
│   ├── content.tsx  # Affiche le Markdown avec ReactMarkdown
│   ├── layout.tsx   # Layout des pages de détail (header + nav + contenu)
│   ├── mdx.tsx      # Composants personnalisés pour le Markdown
│   └── nav.tsx      # Sidebar avec table des matières
├── dialogs/         # Modales et popups
│   ├── contact.tsx  # Formulaire de contact
│   └── random.tsx   # Documentation aléatoire
├── layout/          # Layout global
│   ├── nav.tsx      # Barre de navigation principale
│   ├── footer.tsx   # Pied de page
│   └── toggle.tsx   # Toggle thème clair/sombre
├── sections/        # Sections de la page d'accueil
│   ├── hero.tsx     # Bannière principale
│   ├── projects.tsx # Grille de projets
│   └── ...
├── ui/              # Composants primitifs (Radix UI + custom)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
└── utils/           # Utilitaires visuels
    ├── command.tsx   # Palette de commandes
    └── cursor.tsx    # Curseur personnalisé
```

### Conventions

- **Un composant par fichier** : Chaque fichier exporte un seul composant principal
- **Nommage** : PascalCase pour les composants (`Nav`, `Footer`), camelCase pour les fonctions
- **Client vs Server** : Les composants interactifs ont `"use client"` en première ligne
- **Props typées** : Chaque composant a une interface TypeScript pour ses props
- **Tailwind inline** : Les styles sont directement dans le `className`, pas de fichiers CSS séparés

### Ajouter un composant

1. Créer le fichier dans le bon sous-dossier de `src/components/`
2. Typer les props avec une interface TypeScript
3. Exporter le composant comme fonction nommée
4. L'importer dans la page ou le composant parent avec un alias `@/` :

```tsx
import { MonComposant } from "@/components/sections/mon-composant";
```

> L'alias `@/` pointe vers `src/` et est configuré dans `tsconfig.json`.

## Ajouter une page de documentation {#add-doc}

Le système de documentation est conçu pour être simple à étendre. Il suffit de créer un fichier Markdown.

### Étape 1 : Créer le fichier

Créez un fichier `.md` dans `docs/<catégorie>/` :

```
docs/
└── ma-categorie/
    └── mon-guide.md
```

### Étape 2 : Écrire le frontmatter

Chaque doc commence par un bloc de métadonnées YAML :

```md
---
title: Titre du guide
description: Description courte qui apparaît dans la liste.
category: ma-categorie
slug: mon-guide
order: 1
---
```

| Champ         | Obligatoire | Rôle                                                     |
| ------------- | ----------- | -------------------------------------------------------- |
| `title`       | Oui         | Titre affiché dans la liste et en haut de la page        |
| `description` | Oui         | Description courte affichée dans les cards de listing    |
| `category`    | Oui         | Catégorie de la doc (doit correspondre au dossier)       |
| `slug`        | Oui         | Identifiant URL (peut contenir `/` pour sous-catégories) |
| `order`       | Non         | Ordre d'affichage dans la liste (défaut: 999)            |

### Étape 3 : Écrire le contenu

Utilisez du Markdown standard avec le support GFM (GitHub Flavored Markdown) :

```md
## Ma section {#ma-section}

Du texte avec du **gras**, de l'_italique_ et du `code inline`.

### Sous-section

| Colonne 1 | Colonne 2 |
| --------- | --------- |
| Valeur    | Valeur    |

> Une citation en blockquote.
```

La syntaxe `{#id}` après un titre `##` crée un identifiant pour la navigation dans la sidebar. Sans cette syntaxe, le titre n'apparaît pas dans la table des matières.

### Étape 4 : Générer et vérifier

```bash
npm run generate
npm run dev
```

Le script détecte automatiquement le nouveau fichier, l'ajoute à `docs.json`, et la page est accessible à `/help/<catégorie>/<slug>`.

## Slugs et sous-catégories {#slugs}

### Slug simple

Un slug simple correspond à un doc direct dans une catégorie :

```
docs/git/commit.md        → slug: "commit"     → /help/git/commit
docs/github/pages.md      → slug: "pages"      → /help/github/pages
```

### Slug avec sous-catégorie

Un slug contenant `/` crée une sous-catégorie. Le fichier doit être dans un sous-dossier correspondant :

```
docs/github/configuration/namecheap.md
    → slug: "configuration/namecheap"
    → /help/github/configuration/namecheap
```

La page de listing `/help/github` affiche automatiquement "configuration" comme sous-catégorie cliquable.

### Ajouter une nouvelle catégorie

1. Créer un dossier dans `docs/` :

```bash
mkdir docs/ma-categorie
```

2. Y ajouter au moins un fichier `.md` avec le frontmatter approprié
3. Lancer `npm run generate`

La catégorie apparaît automatiquement sur la page `/help` avec un compteur de guides.

## Tailwind CSS 4 {#tailwind}

### Configuration

Tailwind CSS 4 utilise une approche différente des versions précédentes. Il n'y a plus de fichier `tailwind.config.ts`. La configuration se fait via **PostCSS** et le fichier CSS principal.

```js
// postcss.config.mjs
const config = {
    plugins: {
        "@tailwindcss/postcss": {},
    },
};
export default config;
```

Les classes utilitaires sont utilisées directement dans les composants :

```tsx
<div className="flex items-center gap-3 rounded-lg border bg-card p-6">
    <span className="text-sm font-medium">Mon contenu</span>
</div>
```

### Librairies complémentaires

| Librairie                  | Rôle                                                   |
| -------------------------- | ------------------------------------------------------ |
| `tailwind-merge`           | Fusionne les classes Tailwind sans conflit             |
| `class-variance-authority` | Gère les variantes de composants (taille, style, etc.) |
| `clsx`                     | Concatène des classes conditionnellement               |
| `tw-animate-css`           | Animations CSS prêtes à l'emploi                       |

### Utilitaire `cn()`

La fonction `cn()` combine `clsx` et `tailwind-merge` pour gérer les classes dynamiques :

```tsx
import { cn } from "@/lib/utils";

<div className={cn("bg-card p-4", isActive && "bg-primary text-white")} />;
```

### Thème clair/sombre

Le thème est géré par `next-themes`. Les classes Tailwind utilisent les variables CSS du thème :

- `bg-background` / `bg-card` / `bg-muted` — Couleurs de fond
- `text-foreground` / `text-muted-foreground` — Couleurs de texte
- `border-border` — Bordures
- `text-primary` — Couleur d'accent

## Export statique {#export}

### Comment ça marche

En production, Next.js génère un dossier `out/` contenant :

```
out/
├── index.html           # Page d'accueil
├── help/
│   ├── index.html       # /help
│   ├── git/
│   │   ├── index.html   # /help/git
│   │   └── commit/
│   │       └── index.html  # /help/git/commit
│   └── ...
├── _next/
│   ├── static/          # CSS et JS bundlés
│   └── ...
└── images/              # Assets statiques
```

Chaque route devient un dossier avec un `index.html` (grâce à `trailingSlash: true`). Le site peut être hébergé sur n'importe quel serveur statique.

### Limitations

Les fonctionnalités suivantes ne sont **pas disponibles** en mode export :

- **API Routes** (`/api/*`) — Pas de serveur backend
- **SSR / ISR** — Pas de rendu côté serveur dynamique
- **Middleware** — Pas de logique côté serveur
- **Image Optimization** — Nécessite un serveur (`unoptimized: true` obligatoire)

### Déploiement

Le dossier `out/` peut être déployé sur :

- **GitHub Pages** — Avec un [workflow GitHub Actions](/help/github/workflows/nextjs)
- **Netlify** / **Vercel** — Configuration automatique
- **Tout serveur HTTP** — Apache, Nginx, `npx serve out/`

## Résumé {#resume}

| Aspect               | Détail                                       |
| -------------------- | -------------------------------------------- |
| **Framework**        | Next.js 16 (App Router)                      |
| **Langage**          | TypeScript 5                                 |
| **Styles**           | Tailwind CSS 4                               |
| **Contenu**          | Markdown → JSON (build-time)                 |
| **Routing**          | Basé sur le système de fichiers (`src/app/`) |
| **Export**           | Statique (`out/`)                            |
| **Hébergement**      | GitHub Pages                                 |
| **Ajout de contenu** | Créer un `.md` + `npm run generate`          |