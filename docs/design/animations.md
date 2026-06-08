---
title: Animations et transitions CSS
description: Principes du motion design web, keyframes CSS, transitions, performances, smooth scrolling, prefers-reduced-motion et bibliothèques d'animation.
category: design
slug: animations
order: 5
---

## Pourquoi animer une interface {#intro}

Une animation bien conçue n'est pas décorative — elle **communique**. Elle aide l'utilisateur à comprendre ce qui vient de se passer, ce qui va se passer, et comment les éléments sont liés entre eux.

Les animations servent à :

- **Donner du feedback** — un bouton qui s'enfonce montre qu'il a été cliqué
- **Orienter l'attention** — une notification qui glisse depuis le bord attire le regard sans interruption brutale
- **Montrer les relations** — un élément qui "vole" d'une liste vers un panier montre le lien entre les deux
- **Réduire la surprise** — un dialog qui apparaît en fondu semble moins agressif qu'une apparition instantanée

> **Note** : La règle d'or : **si tu dois expliquer l'animation, c'est qu'elle ne fonctionne pas**. Une bonne animation est naturelle et transparente.

## Transitions CSS {#transitions}

Les **transitions** animent un élément d'un état à un autre lorsqu'une propriété change (hover, focus, ajout de classe...).

```css
/* Syntaxe */
transition: propriété durée easing délai;

/* Exemples */
.card {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}
.card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
}

/* Transitions multiples */
.button {
    transition:
        background-color 0.15s ease,
        transform 0.1s ease,
        color 0.15s ease;
}
```

### Propriétés à animer (et à éviter)

Le navigateur peut animer certaines propriétés sans recalculer tout le layout (**composite-only**), ce qui est beaucoup plus performant :

| Propriété                              | Coût           | Recommandation              |
| -------------------------------------- | -------------- | --------------------------- |
| `transform` (translate, scale, rotate) | Très faible    | Préférer                    |
| `opacity`                              | Très faible    | Préférer                    |
| `filter`                               | Faible         | Acceptable                  |
| `background-color`, `color`            | Moyen (paint)  | Limiter                     |
| `width`, `height`, `padding`           | Élevé (layout) | Éviter si possible          |
| `top`, `left`, `margin`                | Élevé (layout) | Éviter — utiliser transform |

```css
/* Coûteux — déclenche un recalcul de layout */
.menu {
    transition: height 0.3s ease;
}

/* Performant — composite uniquement */
.menu {
    transform: scaleY(0);
    transform-origin: top;
    transition:
        transform 0.3s ease,
        opacity 0.3s ease;
}
.menu.open {
    transform: scaleY(1);
    opacity: 1;
}
```

## Keyframes CSS {#keyframes}

Les **animations keyframes** définissent une séquence d'états par lesquels l'élément passe. Contrairement aux transitions, elles se déclenchent automatiquement et peuvent boucler.

```css
@keyframes fade-in {
    from {
        transform: translateY(10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

/* Application */
.notification {
    animation: fade-in 0.4s ease forwards;
}

.badge-loading {
    animation: pulse 1.5s ease-in-out infinite;
}
```

### Paramètres d'animation

```css
animation: nom-keyframe /* @keyframes à utiliser */ durée /* combien de temps */ easing
    /* courbe de vitesse */ délai /* délai avant le départ */ itérations
    /* nombre de répétitions (infinite) */ direction /* normal, reverse, alternate */ fill-mode
    /* forwards, backwards, both */ play-state; /* running, paused */
```

`fill-mode: forwards` est crucial pour les animations d'entrée : sans lui, l'élément retourne à son état initial à la fin de l'animation.

## Courbes d'easing {#easing}

L'**easing** (courbe d'accélération) est ce qui différencie une animation naturelle d'une animation mécanique. En physique, rien ne démarre ou s'arrête instantanément.

| Easing              | Description                    | Usage typique                              |
| ------------------- | ------------------------------ | ------------------------------------------ |
| `linear`            | Vitesse constante              | Rotations continues, barres de progression |
| `ease`              | Démarre vite, freine doucement | Transitions générales                      |
| `ease-in`           | Démarre lentement, accélère    | Éléments qui quittent l'écran              |
| `ease-out`          | Démarre vite, freine           | Éléments qui entrent à l'écran             |
| `ease-in-out`       | Lent au départ et à l'arrivée  | Transitions symétriques                    |
| `cubic-bezier(...)` | Courbe personnalisée           | Effets spring, rebonds                     |

```css
/* Spring effect — démarre vite et freine progressivement */
transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

/* Bounce effect */
transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
```

Le site **cubic-bezier.com** permet de visualiser et créer des courbes personnalisées.

## Animations d'entrée et de sortie {#transitions}

Les entrées et sorties de composants UI (dialogs, tooltips, notifications) suivent un pattern classique :

```
Entrée : opacity 0 + translateY(8px)  →  opacity 1 + translateY(0)
Sortie : opacity 1 + translateY(0)    →  opacity 0 + translateY(8px)
```

Des bibliothèques comme **tw-animate-css** ou **Framer Motion** proposent ces animations en classes utilitaires :

```html
<!-- tw-animate-css -->
<div class="animate-in fade-in-0 slide-in-from-bottom-2 duration-200">Contenu du dialog</div>
```

### Stagger — entrées en cascade

Le **stagger** (décalage) applique un délai progressif sur des éléments d'une liste, créant un effet d'entrée en cascade qui est plus lisible qu'une apparition simultanée :

```css
/* CSS pur — délai par nth-child */
.list-item {
    animation: fade-in 0.4s ease forwards;
    opacity: 0;
}
.list-item:nth-child(1) {
    animation-delay: 0.05s;
}
.list-item:nth-child(2) {
    animation-delay: 0.1s;
}
.list-item:nth-child(3) {
    animation-delay: 0.15s;
}
/* ... */
```

En JavaScript, on peut le calculer dynamiquement :

```typescript
items.forEach((item, index) => {
    item.style.animationDelay = `${index * 50}ms`;
    item.classList.add("animate-in");
});
```

## Smooth scrolling {#scroll}

Le scroll fluide remplace le saut instantané du scroll natif par une animation douce. En CSS, c'est une ligne :

```css
html {
    scroll-behavior: smooth;
}
```

Pour plus de contrôle (easing personnalisé, support du clavier, gestion des touches de navigation), des bibliothèques JavaScript sont disponibles :

**Lenis** est une option populaire, légère et respectueuse du scroll natif :

```typescript
import Lenis from "lenis";

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

> **En pratique** : Le scroll fluide améliore la sensation d'une page, mais il peut interférer avec l'accessibilité si mal configuré. Toujours vérifier que la navigation clavier reste fonctionnelle.

## Animations de chargement {#loading}

Les états de chargement ont besoin d'animations pour montrer que l'interface est active :

**Skeleton screens** — afficher la structure de la page pendant le chargement des données, plutôt qu'un spinner générique :

```html
<!-- Skeleton d'une carte -->
<div class="card">
    <div class="skeleton h-4 w-3/4 rounded"></div>
    <div class="skeleton h-3 w-full rounded mt-2"></div>
    <div class="skeleton h-3 w-5/6 rounded mt-1"></div>
</div>
```

```css
.skeleton {
    background: linear-gradient(90deg, var(--muted) 25%, oklch(0.9 0 0) 50%, var(--muted) 75%);
    animation: shimmer 1.5s infinite;
    background-size: 200% 100%;
}

@keyframes shimmer {
    from {
        background-position: 200% center;
    }
    to {
        background-position: -200% center;
    }
}
```

## Prefers-reduced-motion {#motion}

Certains utilisateurs (épilepsie, vertiges, migraines) sont sensibles aux animations. Le navigateur expose la préférence système :

```css
/* Désactiver les animations selon la préférence */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-iteration-count: 1 !important;
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

La bonne approche est de **concevoir avec les animations d'abord**, puis de les réduire ou supprimer :

```css
/* Défaut : animation complète */
.dialog-overlay {
    animation: fade-in 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
    /* Réduction : garder la visibilité, enlever le mouvement */
    .dialog-overlay {
        animation: none;
        opacity: 1;
    }
}
```

## Bibliothèques d'animation {#libraries}

| Bibliothèque       | Approche          | Usage                              |
| ------------------ | ----------------- | ---------------------------------- |
| **CSS keyframes**  | CSS pur           | Animations simples et répétitives  |
| **tw-animate-css** | Classes Tailwind  | Entrées/sorties de composants UI   |
| **Framer Motion**  | React, déclaratif | Animations complexes, drag, layout |
| **GSAP**           | JavaScript        | Animations avancées, timelines     |
| **Lenis**          | JavaScript        | Smooth scroll uniquement           |
| **AutoAnimate**    | Attribut HTML     | Animations de liste automatiques   |

> **Note** : Commencer par CSS pur et ne passer à une bibliothèque JS que si les animations ne peuvent pas être exprimées en CSS. Les animations CSS sont généralement plus performantes car elles s'exécutent sur le thread compositor, hors du thread principal JavaScript.

## Pour aller plus loin {#next}

- [Layout et responsive](/help/design/layout) — scroll, containers, breakpoints
- [Accessibilité web](/help/design/accessibility#motion) — prefers-reduced-motion
- [Interactions utilisateur](/help/design/interactions) — feedback, hover, microinteractions
- [Composants UI](/help/design/components) — animations dans les variantes de composants