---
title: Accessibilité web
description: Standards WCAG, HTML sémantique, attributs ARIA, navigation clavier, mouvement réduit et outils de test pour des interfaces inclusives.
category: design
slug: accessibility
order: 4
---

## Qu'est-ce que l'accessibilité web ? {#intro}

L'**accessibilité web** (souvent abrégée **a11y** — 11 lettres entre le "a" et le "y") désigne la capacité d'un site à être utilisé par tous, y compris les personnes qui :

- Naviguent **au clavier** uniquement (pas de souris)
- Utilisent un **lecteur d'écran** (NVDA, VoiceOver, JAWS)
- Ont une **déficience visuelle** (daltonisme, faible acuité)
- Sont sensibles aux **animations** et mouvements à l'écran
- Utilisent un **zoom** navigateur ou des **polices agrandies**

En France, la loi impose aux sites publics de respecter le **RGAA** (Référentiel Général d'Amélioration de l'Accessibilité), lui-même basé sur les WCAG. Pour les sites privés, c'est une bonne pratique et souvent une obligation légale progressive.

## Le standard WCAG {#wcag}

Le **WCAG** (Web Content Accessibility Guidelines), publié par le W3C, définit des critères d'accessibilité organisés autour de quatre principes (acronyme **POUR**) :

| Principe           | Description                                                                   | Exemples                                                      |
| ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Perceptible**    | L'information est présentée de manière à être perçue par tous                 | Textes alternatifs sur les images, sous-titres sur les vidéos |
| **Utilisable**     | L'interface peut être utilisée sans souris                                    | Navigation clavier, focus visible, pas de pièges à clavier    |
| **Compréhensible** | Le contenu et le comportement sont prévisibles                                | Labels explicites, messages d'erreur clairs, langue déclarée  |
| **Robuste**        | Le contenu fonctionne avec les technologies d'assistance actuelles et futures | HTML valide, ARIA bien utilisé                                |

Trois niveaux de conformité existent : **A** (minimum), **AA** (recommandé), **AAA** (optimal). La plupart des organisations visent le niveau AA.

## HTML sémantique {#semantic}

La première règle de l'accessibilité : **utiliser les bons éléments HTML**. Un élément sémantique communique son rôle aux technologies d'assistance sans configuration supplémentaire.

```html
<!-- Non sémantique — le lecteur d'écran ne sait pas que c'est un bouton -->
<div class="btn" onclick="submit()">Envoyer</div>

<!-- Sémantique — nativement focusable, activable avec Espace/Entrée -->
<button type="submit">Envoyer</button>
```

Les éléments de structure de page à utiliser :

| Élément         | Rôle sémantique                                 |
| --------------- | ----------------------------------------------- |
| `<header>`      | En-tête de page ou de section                   |
| `<nav>`         | Zone de navigation principale                   |
| `<main>`        | Contenu principal (unique par page)             |
| `<article>`     | Contenu autonome et réutilisable                |
| `<section>`     | Section thématique avec un titre                |
| `<aside>`       | Contenu complémentaire                          |
| `<footer>`      | Pied de page                                    |
| `<h1>` – `<h6>` | Titres hiérarchiques (ne pas sauter de niveaux) |

> **Note** : Un lecteur d'écran peut générer un résumé de la page à partir des éléments sémantiques : "Page avec 3 zones de navigation, 1 zone principale, 12 sections". Sans HTML sémantique, c'est impossible.

## La langue de la page {#lang}

L'attribut `lang` sur l'élément `<html>` est obligatoire. Il permet aux lecteurs d'écran de sélectionner la bonne voix de synthèse :

```html
<html lang="fr">
    <html lang="en">
        <html lang="fr-CA">
            <!-- Français canadien -->
        </html>
    </html>
</html>
```

Si une portion de page est dans une autre langue, on peut la déclarer localement :

```html
<p>Le terme anglais <span lang="en">design system</span> désigne...</p>
```

## Attributs ARIA {#aria}

**ARIA** (Accessible Rich Internet Applications) est un ensemble d'attributs HTML qui complètent la sémantique native pour les composants complexes. Règle d'or : **utiliser ARIA seulement quand HTML natif ne suffit pas**.

### Les attributs les plus courants

```html
<!-- aria-label — texte alternatif quand le label visible est insuffisant -->
<button aria-label="Fermer la boîte de dialogue">
    <svg>...</svg>
</button>

<!-- aria-labelledby — associer un label existant dans la page -->
<section aria-labelledby="section-titre">
    <h2 id="section-titre">Mes projets</h2>
</section>

<!-- aria-describedby — description complémentaire -->
<input aria-describedby="mdp-aide" />
<p id="mdp-aide">Le mot de passe doit contenir au moins 8 caractères.</p>

<!-- aria-hidden — masquer aux lecteurs d'écran (décoratif) -->
<span aria-hidden="true">★</span>

<!-- aria-live — annoncer les changements dynamiques -->
<div aria-live="polite" aria-atomic="true">Résultats de recherche mis à jour : 42 éléments</div>

<!-- aria-expanded — état d'un élément dépliable -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>
    ...
</ul>
```

### Rôles ARIA

Quand on crée un composant custom qui imite un élément natif :

```html
<!-- Onglets custom -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel-1">Onglet 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel-2">Onglet 2</button>
</div>
<div role="tabpanel" id="panel-1">Contenu de l'onglet 1</div>
```

> **Note** : Les bibliothèques comme Radix UI implémentent correctement tous ces attributs ARIA dans leurs primitives. C'est l'un des avantages majeurs d'utiliser des composants accessibles plutôt que de créer les siens depuis zéro.

## Textes pour lecteurs d'écran {#sr}

Certains éléments visuels ont besoin d'un label textuel pour les lecteurs d'écran, sans que ce texte ne soit visible à l'écran. La classe `sr-only` (screen-reader only) positionne le texte hors de l'écran :

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

```html
<!-- Bouton icône sans texte visible -->
<button>
    <svg aria-hidden="true"><!-- icône --></svg>
    <span class="sr-only">Supprimer cet élément</span>
</button>
```

Ne jamais utiliser `display: none` ou `visibility: hidden` pour du contenu destiné aux lecteurs d'écran — ces propriétés le masquent aussi aux technologies d'assistance.

## Navigation clavier {#keyboard}

### Focus visible

Tout élément interactif doit être **focusable** et afficher un **indicateur de focus visible**. La suppression de l'outline par défaut sans remplacement est une erreur d'accessibilité fréquente :

```css
/* À ne jamais faire */
*:focus {
    outline: none;
}

/* Personnaliser l'outline sans le supprimer */
*:focus-visible {
    outline: 3px solid oklch(0.6 0.2 280);
    outline-offset: 2px;
    border-radius: 4px;
}
```

La pseudo-classe `:focus-visible` n'affiche l'outline qu'en navigation clavier (pas au clic), ce qui évite les outlines visuellement gênants à la souris tout en maintenant l'accessibilité clavier.

### Ordre de tabulation

L'ordre de focus doit suivre l'**ordre visuel et logique** du contenu. CSS Flexbox et Grid peuvent créer un ordre visuel différent de l'ordre DOM — s'assurer qu'ils coïncident ou utiliser `tabindex` avec précaution.

```html
<!-- tabindex="0" — rend un élément focusable dans l'ordre naturel -->
<div tabindex="0" role="button">Élément custom cliquable</div>

<!-- tabindex="-1" — focusable programmatiquement mais pas au clavier -->
<div tabindex="-1" id="dialog-title">Titre du dialog</div>
```

> **En pratique** : éviter `tabindex` positif (`tabindex="1"`, `tabindex="2"`...) — cela crée un ordre de focus artificiel difficile à maintenir.

### Pièges à clavier (keyboard traps)

Un composant **modal** (dialog, drawer) doit **piéger le focus** à l'intérieur pendant qu'il est ouvert — l'utilisateur ne doit pas pouvoir tabber vers le contenu derrière la modal. À la fermeture, le focus doit revenir à l'élément qui a ouvert la modal.

Radix UI gère ce comportement automatiquement dans ses primitives Dialog et Popover.

## Mouvement réduit {#reducedMotion}

Certains utilisateurs sont sensibles aux animations — vertiges, épilepsie, migraines. Le système d'exploitation expose une préférence `prefers-reduced-motion` que CSS peut lire :

```css
/* Par défaut : animations actives */
.card {
    transition: transform 0.3s ease;
}

/* Mouvement réduit : désactiver ou simplifier les animations */
@media (prefers-reduced-motion: reduce) {
    .card {
        transition: none;
    }

    /* Ou plutôt : remplacer par une animation minimale */
    .card {
        transition: opacity 0.1s;
    }
}
```

> **Note** : La recommandation n'est pas de **tout supprimer** quand le mouvement est réduit, mais de remplacer les animations de déplacement (translate, scale) par de simples fades (opacity). Le mouvement est ce qui dérange, pas les transitions en général.

En JavaScript, on peut lire cette préférence :

```typescript
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

## Données structurées {#schema}

Les **données structurées** (JSON-LD, Schema.org) permettent aux moteurs de recherche et technologies d'assistance de comprendre le contenu de la page :

> **Note** : Les valeurs `@id` avec fragment (`#website`, `#person`) sont des identifiants d'entité internes au graphe JSON-LD — ils n'ont pas à correspondre à des ancres HTML dans le DOM. Ils servent uniquement à relier les nœuds entre eux et à permettre à Google d'identifier les mêmes entités sur plusieurs pages du site.

```html
<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://exemple.fr/#website",
                "url": "https://exemple.fr",
                "name": "Prénom Nom",
                "description": "Description du site.",
                "inLanguage": "fr-FR",
                "author": { "@id": "https://exemple.fr/#person" }
            },
            {
                "@type": "Person",
                "@id": "https://exemple.fr/#person",
                "name": "Prénom Nom",
                "url": "https://exemple.fr",
                "email": "contact@exemple.fr",
                "jobTitle": "Développeur Full Stack",
                "worksFor": { "@type": "Organization", "name": "Entreprise" },
                "alumniOf": { "@type": "EducationalOrganization", "name": "École" },
                "knowsAbout": ["Développement web", "Front-end", "Back-end"],
                "sameAs": ["https://github.com/pseudo", "https://linkedin.com/in/pseudo"]
            }
        ]
    }
</script>
```

## Outils de test {#tools}

| Outil                       | Type                 | Utilisation                                       |
| --------------------------- | -------------------- | ------------------------------------------------- |
| **axe DevTools**            | Extension navigateur | Audit automatique des erreurs ARIA                |
| **Lighthouse**              | Chrome DevTools      | Score d'accessibilité avec recommandations        |
| **NVDA** (Windows)          | Lecteur d'écran      | Test réel en navigation clavier + synthèse vocale |
| **VoiceOver** (macOS/iOS)   | Lecteur d'écran      | Test sur Apple (Cmd+F5)                           |
| **Wave**                    | Extension navigateur | Visualisation des erreurs et alertes              |
| **Colour Contrast Checker** | En ligne             | Vérification des ratios WCAG                      |
| **Tab key**                 | Clavier              | Naviguer dans sa propre interface au clavier      |

Le dernier outil (la touche Tab) est le plus simple et souvent le plus révélateur : naviguer sur son propre site sans souris révèle immédiatement les problèmes de focus trap, d'ordre de tabulation et d'affordances manquantes.

## Pour aller plus loin {#next}

- [Typographie web](/help/design/typography) — taille de texte, polices pour la dyslexie
- [Couleurs et espaces colorimétriques](/help/design/colors) — ratios de contraste WCAG
- [Animations et transitions](/help/design/animations) — prefers-reduced-motion
- [Interactions utilisateur](/help/design/interactions) — raccourcis clavier, feedback