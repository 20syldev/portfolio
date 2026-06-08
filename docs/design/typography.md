---
title: Typographie web
description: Polices web, chargement optimisé, échelles typographiques, lisibilité, accessibilité et bonnes pratiques de typographie pour le web.
category: design
slug: typography
order: 3
---

## Pourquoi la typographie compte {#intro}

La typographie est responsable d'environ **95% du contenu d'une interface web**. C'est le texte qui transmet l'information, pas les illustrations. Bien choisir et configurer ses polices est l'un des meilleurs retours sur investissement en design.

Une bonne typographie web c'est :

- Un texte **lisible** à toutes les tailles sur tous les écrans
- Des **polices qui se chargent vite** sans bloquer le rendu
- Une **hiérarchie claire** entre titres, sous-titres et corps de texte
- Un respect des préférences de l'utilisateur (zoom navigateur, préférences de taille)

## Types de polices {#types}

### Familles génériques

| Famille         | Description                         | Exemples                            |
| --------------- | ----------------------------------- | ----------------------------------- |
| **Serif**       | Empattements en bout de trait       | Georgia, Times New Roman, Lora      |
| **Sans-serif**  | Pas d'empattement, look moderne     | Inter, Outfit, Helvetica            |
| **Monospace**   | Caractères à largeur fixe           | Fira Code, JetBrains Mono, Cascadia |
| **Display**     | Polices expressives pour les titres | Fredoka, Playfair Display           |
| **Handwriting** | Imitation de l'écriture manuscrite  | Pacifico, Dancing Script            |

Pour les interfaces web, **sans-serif** est le choix le plus courant : meilleure lisibilité sur écran, look moderne, large disponibilité. Le monospace est réservé au code.

### Polices système vs web fonts

Il existe deux stratégies pour fournir des polices :

**Stack système** : utilise les polices déjà installées sur l'appareil, sans aucun téléchargement.

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Avantage : performance maximale. Inconvénient : rendu différent selon l'OS (macOS, Windows, Linux, iOS, Android).

**Web fonts** : télécharge la police depuis un serveur.

```css
/* Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");
font-family: "Inter", sans-serif;
```

Avantage : cohérence visuelle sur tous les appareils. Inconvénient : requête réseau supplémentaire.

## Chargement optimisé {#loading}

Le chargement des polices est un point de performance critique. Une police mal configurée peut provoquer un **FOUT** (Flash of Unstyled Text) ou un **FOIT** (Flash of Invisible Text).

### font-display

La propriété `font-display` contrôle le comportement pendant le chargement :

| Valeur     | Comportement                                                   |
| ---------- | -------------------------------------------------------------- |
| `auto`     | Laisse le navigateur décider                                   |
| `block`    | Texte invisible jusqu'à la police (FOIT)                       |
| `swap`     | Texte visible avec police de fallback, puis swap (FOUT)        |
| `fallback` | Court délai invisible, puis fallback, puis swap rapide         |
| `optional` | Court délai invisible, pas de swap si la police est trop lente |

```css
@font-face {
    font-family: "Inter";
    src: url("/fonts/inter.woff2") format("woff2");
    font-display: swap; /* recommandé pour les corps de texte */
}
```

### next/font — auto-hébergement en Next.js

Next.js fournit le module `next/font` qui télécharge et auto-héberge automatiquement les polices Google Fonts à la compilation :

```typescript
import { Inter, Fira_Code } from "next/font/google";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});
```

Avantages : zéro appel réseau vers Google au runtime, conformité RGPD (pas de données envoyées à Google), meilleure performance.

> **En pratique** : next/font injecte les polices en tant que variables CSS (`--font-inter`) sur l'élément `<body>`. On les référence ensuite dans Tailwind via `@theme` : `--font-sans: var(--font-inter)`.

## Échelle typographique {#scale}

Une **échelle typographique** est un ensemble de tailles de texte harmonieuses entre elles, généralement basées sur un ratio. Les plus courants :

| Ratio | Nom            | Tailles (base 16px)       |
| ----- | -------------- | ------------------------- |
| 1.125 | Major second   | 16, 18, 20, 22.5, 25.3... |
| 1.250 | Major third    | 16, 20, 25, 31.25, 39...  |
| 1.333 | Perfect fourth | 16, 21.3, 28.4, 37.9...   |
| 1.500 | Perfect fifth  | 16, 24, 36, 54, 81...     |

Tailwind CSS fournit une échelle opiniâtre par défaut (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl) qui couvre la plupart des besoins :

```css
/* Équivalents approximatifs */
text-xs     → 12px   (0.75rem)
text-sm     → 14px   (0.875rem)
text-base   → 16px   (1rem)
text-lg     → 18px   (1.125rem)
text-xl     → 20px   (1.25rem)
text-2xl    → 24px   (1.5rem)
text-4xl    → 36px   (2.25rem)
```

## Lisibilité {#readability}

### Longueur de ligne

La **longueur de ligne** optimale pour la lecture est entre **45 et 75 caractères** (environ 60 pour le corps de texte). Des lignes trop longues fatiguent les yeux, des lignes trop courtes cassent le rythme.

```css
/* Contraindre la largeur du texte */
max-width: 65ch; /* 65 caractères — "ch" = largeur du caractère "0" */
```

### Interligne (line-height)

Un interligne entre **1.4 et 1.6** pour le corps de texte améliore la lisibilité. Tailwind propose `leading-relaxed` (1.625) comme bonne valeur par défaut.

```css
/* Corps de texte */
line-height: 1.6;

/* Titres — interligne plus serré */
line-height: 1.2;
```

### Espacement entre les lettres

Pour les corps de texte, l'espacement par défaut de la police est généralement optimal. Pour les titres en majuscules ou les petits textes, une légère augmentation aide :

```css
/* Uppercase / small caps */
letter-spacing: 0.05em;

/* Corps de texte — souvent 0 ou très proche de 0 */
letter-spacing: -0.01em;
```

## Hiérarchie visuelle {#hierarchy}

Une hiérarchie claire guide l'œil à travers la page. Elle repose sur quatre leviers :

```
Taille       →   les éléments importants sont plus grands
Graisse      →   bold pour les titres, regular pour le corps
Couleur      →   foreground pour le principal, muted-foreground pour le secondaire
Espacement   →   marge plus grande au-dessus des sections = séparation visuelle
```

Exemple de hiérarchie typique :

| Élément            | Taille   | Graisse | Couleur          |
| ------------------ | -------- | ------- | ---------------- |
| Titre de page (h1) | 2.25rem  | 700     | foreground       |
| Sous-titre (h2)    | 1.5rem   | 600     | foreground       |
| Corps de texte (p) | 1rem     | 400     | foreground       |
| Texte secondaire   | 0.875rem | 400     | muted-foreground |
| Caption / label    | 0.75rem  | 500     | muted-foreground |

## Polices et dyslexie {#dyslexia}

Environ **10% de la population** est dyslexique. Certaines polices sont conçues pour réduire la confusion entre caractères similaires (b/d, p/q, n/u) :

- **Lexend** — réduit la charge cognitive, espacement amélioré
- **OpenDyslexic** — formes de caractères spécifiques pour ancrer l'orientation
- **Atkinson Hyperlegible** — conçue par la Lighthouse for the Blind Foundation

Proposer un **sélecteur de police** dans les paramètres d'accessibilité permet à l'utilisateur de choisir la police qui lui convient le mieux.

> **Note** : Il n'existe pas de police universellement meilleure pour tous les dyslexiques — les préférences varient d'une personne à l'autre. Proposer le choix est plus efficace qu'imposer une police "dyslexie".

## Pour aller plus loin {#next}

- [Couleurs et espaces colorimétriques](/help/design/colors) — contraste texte/fond, accessibilité
- [Accessibilité web](/help/design/accessibility) — WCAG, taille minimale de texte, zoom
- [Composants UI](/help/design/components) — application dans les variantes de composants