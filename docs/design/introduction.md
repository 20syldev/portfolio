---
title: Introduction au design system
description: Fondamentaux des design systems, principes de conception, design tokens, outils modernes et mise en place dans un projet web.
category: design
slug: introduction
order: 1
---

## Qu'est-ce qu'un design system ? {#intro}

Un **design system** est un ensemble de règles, de composants et de tokens visuels documentés qui garantissent la cohérence d'une interface à travers toutes les pages et tous les écrans d'un produit. Contrairement à une simple charte graphique (fichier PDF statique), un design system est **vivant** : il évolue avec le produit et son code est directement utilisable par les développeurs.

Les design systems les plus connus sont **Material Design** (Google), **Carbon** (IBM), **Polaris** (Shopify) et **Radix** (WorkOS). Chacun définit une palette de couleurs, des règles de typographie, des composants réutilisables et des patterns d'interaction.

### Pourquoi s'en soucier ?

- **Cohérence** — Un bouton a le même aspect partout. Un utilisateur qui apprend un pattern dans une page le retrouve dans toutes les autres.
- **Rapidité** — Les développeurs assemblent des composants existants au lieu de recréer des éléments à chaque page.
- **Maintenabilité** — Modifier la couleur primaire ou le radius des boutons se fait en un seul endroit, et se propage partout.
- **Accessibilité** — Les règles d'accessibilité sont intégrées dans les composants eux-mêmes, pas laissées à la bonne volonté de chaque développeur.

## Les couches d'un design system {#layers}

Un design system s'organise en couches, du plus abstrait au plus concret :

```
┌───────────────────────────────────────────────┐
│  Patterns (formulaires, navigation, layout)   │
├───────────────────────────────────────────────┤
│  Composants (Button, Card, Dialog, Tooltip)   │
├───────────────────────────────────────────────┤
│  Tokens (couleurs, typographie, espacements)  │
├───────────────────────────────────────────────┤
│  Principes (accessibilité, responsive, ton)   │
└───────────────────────────────────────────────┘
```

Les **principes** guident les décisions à chaque couche. Les **tokens** sont les valeurs atomiques. Les **composants** assemblent les tokens en éléments réutilisables. Les **patterns** combinent les composants en expériences complètes.

## Design tokens {#tokens}

Les **design tokens** sont les atomes du système : des paires nom-valeur qui encodent toutes les décisions visuelles.

| Catégorie       | Exemples de tokens                      | Valeurs possibles            |
| --------------- | --------------------------------------- | ---------------------------- |
| **Couleurs**    | `--color-primary`, `--color-background` | `#1a1a2e`, `oklch(0.95 0 0)` |
| **Typographie** | `--font-sans`, `--font-size-lg`         | `Inter`, `1.125rem`          |
| **Espacement**  | `--spacing-sm`, `--spacing-xl`          | `0.5rem`, `2rem`             |
| **Radius**      | `--radius-md`, `--radius-full`          | `8px`, `9999px`              |
| **Ombres**      | `--shadow-sm`, `--shadow-lg`            | `0 1px 2px rgba(0,0,0,0.1)`  |

On distingue souvent deux niveaux :

- **Tokens primitifs** — valeurs brutes (`blue-500: #3b82f6`)
- **Tokens sémantiques** — intentions d'usage (`--color-primary: var(--blue-500)`)

```css
/* Tokens primitifs */
:root {
    --blue-500: oklch(0.623 0.214 259);
    --gray-100: oklch(0.97 0 0);
    --gray-900: oklch(0.145 0 0);
}

/* Tokens sémantiques */
:root {
    --color-primary: var(--blue-500);
    --color-background: var(--gray-100);
    --color-foreground: var(--gray-900);
}
```

Cette indirection permet de changer de thème (clair/sombre) en redéfinissant uniquement les tokens sémantiques, sans toucher aux composants.

> **En pratique** : Les frameworks CSS modernes comme Tailwind CSS v4 permettent de déclarer des tokens via `@theme` et les exposent directement comme classes utilitaires (`bg-primary`, `text-foreground`, etc.).

## Principes de design {#principles}

Chaque design system repose sur des principes qui guident les décisions quand les règles ne couvrent pas un cas. Voici les principes les plus répandus :

| Principe                            | Description                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| **Cohérence plutôt que créativité** | Réutiliser un composant existant même si un design unique serait "plus beau"             |
| **Accessibilité par défaut**        | Chaque composant doit être utilisable au clavier et compatible avec les lecteurs d'écran |
| **Mobile-first**                    | Concevoir d'abord pour les petits écrans, puis enrichir pour les grands                  |
| **Contenu avant décoration**        | L'interface sert le contenu, pas l'inverse                                               |
| **Mouvement intentionnel**          | Les animations renforcent la compréhension, elles ne sont jamais purement décoratives    |

## Outils et technologies {#tools}

### Côté design

| Outil         | Rôle                                                                |
| ------------- | ------------------------------------------------------------------- |
| **Figma**     | Création de composants, prototypage, handoff design-dev             |
| **Storybook** | Documentation interactive des composants (isolation, tests visuels) |
| **Chromatic** | Tests de régression visuelle automatisés                            |

### Côté code

| Outil                              | Rôle                                                                |
| ---------------------------------- | ------------------------------------------------------------------- |
| **CSS custom properties**          | Stocker les tokens comme variables CSS natifs                       |
| **Tailwind CSS**                   | Framework utilitaire qui consomme les tokens via `@theme`           |
| **CVA** (Class Variance Authority) | Définir les variantes de composants de manière type-safe            |
| **Radix UI**                       | Primitives de composants accessibles (Dialog, Tooltip, Dropdown...) |
| **shadcn/ui**                      | Collection de composants Radix + Tailwind prêts à l'emploi          |

> **Note** : shadcn/ui n'est pas une bibliothèque classique (pas de `npm install`). Tu copies les composants dans ton projet et tu les adaptes. Cela garantit un contrôle total sur le code.

### Espaces colorimétriques

Le choix de l'espace colorimétrique influence la qualité des palettes :

| Espace        | Avantage                                | Inconvénient                  |
| ------------- | --------------------------------------- | ----------------------------- |
| `hex` / `rgb` | Universel, simple                       | Non perceptuellement uniforme |
| `hsl`         | Intuitif (teinte-saturation-luminosité) | Luminosité non perceptuelle   |
| **`oklch`**   | Perceptuellement uniforme, gamut P3     | Moins intuitif au début       |

**oklch** est aujourd'hui recommandé car deux couleurs avec la même valeur `L` (lightness) ont **réellement** la même luminosité perçue, quel que soit leur angle de teinte. Cela simplifie la création de palettes accessibles.

## Structure d'un projet {#structure}

Un design system dans un projet web se matérialise généralement par cette organisation :

```
src/
├── styles/
│   └── globals.css          Tokens (custom properties, thèmes)
├── components/
│   ├── ui/                  Composants atomiques (Button, Card, Badge...)
│   ├── layout/              Structure (Nav, Footer, Sidebar...)
│   └── sections/            Assemblages (Hero, Features, Pricing...)
├── lib/
│   └── utils.ts             Fonctions utilitaires (cn(), formatDate()...)
└── hooks/
    └── use-media-query.ts   Hooks pour le responsive
```

La séparation entre `ui/` (composants indépendants du contexte) et `sections/` (composants liés à une page) permet de maintenir des composants véritablement réutilisables.

## Pour aller plus loin {#next}

- [Couleurs et espaces colorimétriques](/help/design/colors) — oklch, palettes, thèmes clair/sombre
- [Typographie web](/help/design/typography) — polices, chargement, échelle typographique
- [Accessibilité web](/help/design/accessibility) — WCAG, ARIA, navigation clavier
- [Animations et transitions](/help/design/animations) — mouvement, performance, motion design
- [Layout et responsive](/help/design/layout) — grilles, flexbox, breakpoints
- [Composants UI](/help/design/components) — architecture, variantes, primitives
- [Interactions utilisateur](/help/design/interactions) — feedback, microinteractions, raccourcis