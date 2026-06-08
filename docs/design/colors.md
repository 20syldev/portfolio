---
title: Couleurs et espaces colorimétriques
description: Théorie de la couleur, espaces colorimétriques modernes, palettes accessibles, gestion du thème clair/sombre et tokens sémantiques.
category: design
slug: colors
order: 2
---

## Pourquoi les couleurs sont complexes {#intro}

La couleur en CSS est plus compliquée qu'elle n'en a l'air. Taper `#3b82f6` dans un fichier CSS, c'est demander au navigateur d'afficher une valeur RGB sur un écran — mais **quel écran ?** Un iPhone dernière génération couvre le gamut P3 (plus large que sRGB), un vieux moniteur TN reste dans sRGB strict. Et `#ff0000` ne ressemble pas au "même rouge" perceptuellement que `#00ff00` en vert, même si les valeurs hexadécimales sont symétriques.

Les espaces colorimétriques modernes (`oklch`, `oklab`, `display-p3`) ont été conçus pour résoudre ces problèmes.

## Espaces colorimétriques {#spaces}

### sRGB et ses limites

Le format historique (`hex`, `rgb()`, `hsl()`) travaille dans l'espace **sRGB**, qui couvre environ 35% des couleurs visibles par l'œil humain. C'est suffisant pour la plupart des cas, mais les écrans modernes peuvent afficher plus.

`hsl()` est souvent présenté comme "intuitif" (teinte, saturation, luminosité), mais sa luminosité (`l`) n'est **pas perceptuellement uniforme** : un jaune à `hsl(60 100% 50%)` paraît beaucoup plus lumineux qu'un bleu à `hsl(240 100% 50%)`, bien que les deux aient `l = 50%`.

### oklch — l'espace moderne

**oklch** est aujourd'hui l'espace recommandé pour les design systems. Il définit les couleurs par trois axes :

| Axe | Nom       | Signification           | Plage                    |
| --- | --------- | ----------------------- | ------------------------ |
| `L` | Lightness | Luminosité perceptuelle | 0 (noir) → 1 (blanc)     |
| `C` | Chroma    | Intensité / saturation  | 0 (gris) → ~0.4 (saturé) |
| `H` | Hue       | Angle de teinte         | 0° → 360°                |

```css
/* Syntaxe oklch */
oklch(0.623 0.214 259)       /* bleu vif */
oklch(0.97 0 0)              /* gris très clair (C=0 = gris neutre) */
oklch(0.577 0.245 27.325)    /* rouge */
oklch(0.6 0.2 280)           /* violet */
oklch(1 0 0 / 10%)           /* blanc avec 10% d'opacité */
```

L'avantage principal : deux couleurs avec la **même valeur de `L`** ont réellement la même luminosité perçue par l'œil, quelle que soit leur teinte. Cela facilite énormément la création de palettes cohérentes et accessibles.

```
Même L = 0.6 dans hsl vs oklch :

hsl(60 100% 50%)  ← jaune vif, perçu comme très lumineux
hsl(240 100% 50%) ← bleu vif, perçu comme beaucoup plus sombre
  → Même valeur L, luminosité perçue très différente

oklch(0.6 0.2 60)  ← jaune, perçu à luminosité 0.6
oklch(0.6 0.2 240) ← bleu, perçu à luminosité 0.6
  → Même valeur L, même luminosité perçue ✓
```

> **Note** : oklch est supporté par tous les navigateurs modernes (Chrome 111+, Firefox 113+, Safari 15.4+). Pour les navigateurs plus anciens, les navigateurs ignorent les valeurs inconnues et appliquent une valeur de fallback.

## Tokens sémantiques {#tokens}

La bonne pratique est de définir les couleurs en deux couches : **primitives** (valeurs brutes) et **sémantiques** (intentions d'usage).

### Tokens primitifs

```css
:root {
    /* Neutres */
    --neutral-0: oklch(1 0 0); /* blanc */
    --neutral-100: oklch(0.97 0 0); /* gris très clair */
    --neutral-400: oklch(0.708 0 0); /* gris moyen */
    --neutral-900: oklch(0.145 0 0); /* quasi-noir */

    /* Accents */
    --violet-400: oklch(0.6 0.2 280);
    --red-500: oklch(0.577 0.245 27.325);
    --green-500: oklch(0.723 0.2 152);
}
```

### Tokens sémantiques

```css
:root {
    /* Interface */
    --background: var(--neutral-0);
    --foreground: var(--neutral-900);
    --muted: var(--neutral-100);
    --muted-foreground: var(--neutral-400);
    --primary: var(--neutral-900);
    --border: var(--neutral-100);
    --destructive: var(--red-500);
}
```

Le nom sémantique exprime **l'intention**, pas la valeur. `--background` peut être blanc ou sombre selon le thème — les composants n'ont pas à savoir quelle valeur exacte est utilisée.

## Thème clair et sombre {#themes}

Le thème sombre consiste à **redéfinir les tokens sémantiques** dans un contexte différent, sans modifier les composants.

```css
/* Thème clair — défaut */
:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --border: oklch(0.922 0 0);
}

/* Thème sombre — classe .dark sur <html> */
.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --border: oklch(1 0 0 / 10%);
}
```

Avec Tailwind CSS v4, la variante `dark:` est configurée pour cibler les éléments dans un contexte `.dark` :

```css
@custom-variant dark (&:is(.dark *));
```

En React, la bibliothèque **next-themes** gère automatiquement l'ajout/retrait de la classe `.dark` sur `<html>` selon la préférence système (`prefers-color-scheme`) ou le choix de l'utilisateur.

> **En pratique** : Quand tu construis un composant, utilise toujours les tokens sémantiques (`bg-background`, `text-foreground`) et jamais des couleurs brutes (`bg-white`, `text-black`). Ton composant fonctionnera automatiquement en mode clair et sombre.

## Contraste et accessibilité {#contrast}

Le standard **WCAG 2.1** définit des ratios de contraste minimaux entre le texte et son fond :

| Niveau               | Texte normal | Texte grand (18px+) | Composants UI |
| -------------------- | ------------ | ------------------- | ------------- |
| **AA** (minimum)     | 4.5:1        | 3:1                 | 3:1           |
| **AAA** (recommandé) | 7:1          | 4.5:1               | —             |

oklch facilite le contrôle du contraste car l'axe `L` est directement proportionnel à la luminosité perçue. Pour assurer AA entre un fond clair (`L=0.97`) et un texte foncé (`L=0.145`), le ratio est largement dépassé.

Les outils en ligne comme **Colour Contrast Checker** (coolors.co) ou l'onglet Accessibilité dans les DevTools Chrome permettent de vérifier les ratios en temps réel.

## Palettes et échelles {#scales}

Une bonne palette de couleurs est une **échelle régulière** de nuances d'une même teinte. En oklch, il suffit de varier `L` de manière linéaire en gardant `C` et `H` fixes :

```css
/* Palette verte générée en oklch */
--green-100: oklch(0.95 0.05 152);
--green-200: oklch(0.87 0.1 152);
--green-300: oklch(0.78 0.14 152);
--green-400: oklch(0.68 0.18 152);
--green-500: oklch(0.58 0.2 152); /* couleur de base */
--green-600: oklch(0.48 0.18 152);
--green-700: oklch(0.38 0.15 152);
--green-800: oklch(0.28 0.1 152);
--green-900: oklch(0.18 0.06 152);
```

> **Note** : La chroma (`C`) diminue naturellement vers les extrêmes de luminosité (blanc et noir), car les couleurs très claires ou très sombres ne peuvent pas être très saturées. C'est normal et attendu — oklch le gère de manière fluide.

## Couleurs de sélection et d'accent {#accent}

La couleur de sélection de texte (surlignage au curseur) est souvent oubliée mais fait partie de l'expérience :

```css
::selection {
    background: oklch(0.6 0.2 280); /* violet */
    color: white;
}
```

Un accent unique (ici violet H=280) utilisé de façon cohérente — sélection de texte, focus ring, particules d'animation — crée une identité visuelle discrète mais reconnaissable.

## Pour aller plus loin {#next}

- [Typographie web](/help/design/typography) — polices, échelles, lisibilité
- [Accessibilité web](/help/design/accessibility) — contraste WCAG, ARIA, lecteurs d'écran
- [Animations et transitions](/help/design/animations) — couleurs en mouvement
- [Composants UI](/help/design/components) — utilisation des tokens dans les variantes CVA