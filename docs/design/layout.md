---
title: Layout et responsive design
description: Flexbox, CSS Grid, breakpoints, conteneurs, scroll, viewport units et stratégies de mise en page pour des interfaces adaptatives.
category: design
slug: layout
order: 6
---

## Les modèles de mise en page CSS {#intro}

Pendant longtemps, le layout en CSS s'est fait avec des `float` et des `table` détournés de leur usage. Depuis 2015–2020, deux modèles dédiés dominent : **Flexbox** pour les layouts 1D (une ligne ou une colonne) et **CSS Grid** pour les layouts 2D (lignes et colonnes simultanément).

## Flexbox {#flexbox}

Flexbox est idéal pour disposer des éléments **sur un seul axe** — une barre de navigation, une rangée de cartes, un groupe de boutons.

```css
.container {
    display: flex;
    flex-direction: row; /* ou column */
    justify-content: space-between; /* alignement sur l'axe principal */
    align-items: center; /* alignement sur l'axe secondaire */
    flex-wrap: wrap; /* retour à la ligne si débordement */
    gap: 1rem; /* espacement entre éléments */
}
```

### Cheat sheet Flexbox

| Propriété         | Valeurs courantes                                       | Effet                           |
| ----------------- | ------------------------------------------------------- | ------------------------------- |
| `flex-direction`  | `row`, `column`, `row-reverse`                          | Direction de l'axe principal    |
| `justify-content` | `flex-start`, `center`, `space-between`, `space-around` | Alignement sur l'axe principal  |
| `align-items`     | `stretch`, `center`, `flex-start`, `flex-end`           | Alignement sur l'axe secondaire |
| `flex-wrap`       | `nowrap`, `wrap`                                        | Retour à la ligne               |
| `gap`             | `1rem`, `8px 16px`                                      | Espacement entre éléments       |
| `flex-grow`       | `0`, `1`                                                | Expansion pour remplir l'espace |
| `flex-shrink`     | `0`, `1`                                                | Réduction en cas de débordement |
| `flex-basis`      | `auto`, `200px`, `50%`                                  | Taille de base avant flex       |

```css
/* Raccourci flex : grow shrink basis */
.item {
    flex: 1 1 0; /* grandit, rétrécit, base 0 */
}
.item {
    flex: 0 0 200px; /* taille fixe 200px, ne change pas */
}
.item {
    flex: 1; /* grandit pour remplir l'espace */
}
```

## CSS Grid {#grid}

CSS Grid est idéal pour les **layouts 2D** — une page entière avec header/sidebar/contenu/footer, une galerie de photos, une grille de cartes avec alignement précis.

```css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 colonnes égales */
    gap: 1.5rem;
}

/* Grille classique header/sidebar/main/footer */
.page {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
}

.header {
    grid-area: header;
}
.sidebar {
    grid-area: sidebar;
}
.main {
    grid-area: main;
}
.footer {
    grid-area: footer;
}
```

### Fonctions utiles de Grid

```css
/* repeat() — répéter des colonnes */
grid-template-columns: repeat(4, 1fr);

/* minmax() — taille entre un min et un max */
grid-template-columns: repeat(3, minmax(200px, 1fr));

/* auto-fill vs auto-fit — nombre de colonnes auto */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* auto-fill laisse des colonnes vides, auto-fit les étire */
```

## Breakpoints et responsive design {#breakpoints}

Le **responsive design** consiste à adapter la mise en page selon la taille de l'écran. Les **breakpoints** sont les seuils auxquels la mise en page change.

### Breakpoints standards (Tailwind CSS)

| Nom        | Seuil    | Cibles typiques                        |
| ---------- | -------- | -------------------------------------- |
| _(mobile)_ | 0–639px  | Smartphones portrait                   |
| `sm`       | ≥ 640px  | Smartphones paysage, petites tablettes |
| `md`       | ≥ 768px  | Tablettes portrait                     |
| `lg`       | ≥ 1024px | Tablettes paysage, petits ordinateurs  |
| `xl`       | ≥ 1280px | Ordinateurs de bureau                  |
| `2xl`      | ≥ 1536px | Grands écrans                          |

### Mobile-first vs desktop-first

**Mobile-first** : écrire le CSS de base pour mobile, puis ajouter des adaptations pour les grands écrans avec des media queries `min-width`. C'est l'approche recommandée.

```css
/* Mobile-first (recommandé) */
.grid {
    grid-template-columns: 1fr; /* mobile : 1 colonne */
}

@media (min-width: 768px) {
    .grid {
        grid-template-columns: 1fr 1fr; /* tablette : 2 colonnes */
    }
}

@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(4, 1fr); /* desktop : 4 colonnes */
    }
}
```

En Tailwind CSS, le préfixe de breakpoint s'applique à `min-width` par défaut :

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"></div>
```

> **En pratique** : Concevoir en mobile-first force à hiérarchiser le contenu. Ce qui tient dans 320px de large est ce qui est vraiment essentiel. Les fonctionnalités secondaires peuvent être ajoutées pour les grands écrans.

## Viewport units {#viewport}

Les unités de viewport sont relatives à la taille de la fenêtre du navigateur :

| Unité  | Signification                | Particularité                         |
| ------ | ---------------------------- | ------------------------------------- |
| `vw`   | 1% de la largeur du viewport | —                                     |
| `vh`   | 1% de la hauteur du viewport | Instable sur mobile (barre d'adresse) |
| `svh`  | Small viewport height        | Hauteur minimale (barre visible)      |
| `lvh`  | Large viewport height        | Hauteur maximale (barre cachée)       |
| `dvh`  | Dynamic viewport height      | S'adapte dynamiquement                |
| `vmin` | 1% du plus petit (vw, vh)    | —                                     |
| `vmax` | 1% du plus grand (vw, vh)    | —                                     |

Sur mobile, `100vh` est une source classique de bugs : la barre d'adresse occupe une partie de l'écran et peut apparaître ou disparaître pendant le scroll. `100dvh` règle ce problème.

```css
/* Peut déborder sur mobile (barre d'adresse) */
.hero {
    height: 100vh;
}

/* S'adapte à la hauteur réelle disponible */
.hero {
    height: 100dvh;
}
```

## Containers et max-width {#containers}

Limiter la largeur du contenu améliore la lisibilité sur les grands écrans (lignes trop longues = fatigue de lecture) :

```css
.container {
    margin: 0 auto; /* centrage horizontal */
    padding: 0 1rem; /* marge sur mobile */
    max-width: 1200px;
    width: 100%;
}

@media (min-width: 768px) {
    .container {
        padding: 0 2rem;
    }
}
```

Tailwind CSS simplifie ça avec la classe `container` + `mx-auto`. Des largeurs max courantes selon le contexte :

| Contexte                  | Largeur recommandée       |
| ------------------------- | ------------------------- |
| Corps de texte (articles) | `max-w-prose` (65ch)      |
| Pages de contenu          | `max-w-3xl` – `max-w-4xl` |
| Pages d'application       | `max-w-5xl` – `max-w-6xl` |
| Grilles larges            | `max-w-7xl`               |

## Safe areas (encoche mobile) {#safe}

Les appareils modernes avec encoche (iPhone, Android) ont des zones non-affichables aux coins et en bas. L'API CSS `env()` expose ces zones :

```css
/* Padding minimal + zone sécurisée (prend le plus grand) */
.fixed-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

/* Pour les éléments fixés en haut */
.fixed-header {
    top: env(safe-area-inset-top);
}
```

## Scroll et overflow {#scroll}

### Contrôle du scroll

```css
/* Cacher la barre de scroll tout en gardant le scroll */
.container {
    -ms-overflow-style: none; /* IE */
    scrollbar-width: none; /* Firefox */
    overflow: auto;
}
.container::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Edge */
}
```

### CSS scroll snap

La propriété native `scroll-snap-type` permet de créer des carousels et des layouts "page par page" sans JavaScript :

```css
/* Carousel horizontal */
.carousel {
    scroll-snap-type: x mandatory;
    overflow-x: auto;
    display: flex;
    gap: 1rem;
}

.carousel-item {
    scroll-snap-align: start;
    min-width: 80%;
}
```

> **En pratique** : `scroll-snap-type: x mandatory` force l'arrêt exact sur chaque élément. `proximity` laisse le navigateur décider si le snap est pertinent selon la vitesse de scroll.

### Scroll-margin pour les ancres

Quand on utilise des liens d'ancre (`#section`), un header fixe peut masquer la cible :

```css
/* Décalage égal à la hauteur du header */
[id] {
    scroll-margin-top: 80px;
}
```

## Z-index et stacking context {#zindex}

Le **z-index** contrôle l'ordre d'empilement des éléments. Un **stacking context** se crée par `position: relative/absolute/fixed/sticky` combiné à un `z-index` non-auto, ou par certaines propriétés CSS (`transform`, `opacity < 1`, `filter`…).

```css
/* Système de z-index par paliers — évite les valeurs arbitraires */
:root {
    --z-below: -1;
    --z-base: 0;
    --z-raised: 10;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-overlay: 300;
    --z-modal: 400;
    --z-toast: 500;
}
```

> **Note** : Un z-index élevé dans un stacking context enfant ne "percera" jamais un stacking context parent. Si un élément avec `z-index: 9999` reste sous un autre, c'est presque toujours un problème de stacking context, pas de valeur insuffisante.

## Pour aller plus loin {#next}

- [Animations et transitions CSS](/help/design/animations) — scroll fluide, transitions
- [Composants UI](/help/design/components) — layout dans les composants Flexbox/Grid
- [Accessibilité web](/help/design/accessibility) — ordre de tabulation, skip links
- [Interactions utilisateur](/help/design/interactions) — drag-to-scroll, carousel, patterns