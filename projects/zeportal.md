---
name: Zenetys Tools
description: Portail centralisant les outils et démos web de ZENETYS, avec visionneuse intégrée.
longDescription: "Portail Next.js centralisant les outils et démos web de ZENETYS. Chaque outil s'ouvre dans une visionneuse iframe intégrée ou dans un nouvel onglet selon son type, avec un registre configurable en JSON, une interface bilingue FR/EN et un thème clair/sombre."
tags: ["Next.js", "TypeScript", "JSON", "Hub"]
demo: "https://tools.zenetys.com"
---

## À propos {#about}

Zenetys Tools est le portail qui centralise les outils et démos web de [ZENETYS](https://www.zenetys.com), disponible sur [tools.zenetys.com](https://tools.zenetys.com).
Il regroupe au même endroit les applications maison — ZPKI, HYOAI et d'autres. Chaque outil s'ouvre dans une visionneuse intégrée au portail ou dans un nouvel onglet, selon son type.
J'ai entièrement reconstruit son interface en la migrant de **Vue.js vers Next.js**.

## La refonte {#rework}

La version historique du portail reposait sur Vue.js. Je l'ai reprise de zéro pour la reconstruire sur une base **Next.js** moderne :

- migration complète de l'outillage de build de Vue vers Next.js
- nouvelle interface développée avec l'App Router, shadcn/ui et Tailwind CSS v4
- export entièrement statique, servi derrière un reverse proxy sur la même origine que les outils

L'objectif était d'obtenir un portail rapide, cohérent visuellement avec les autres projets, et facile à faire évoluer.

## Registre d'outils {#registry}

Les outils sont déclarés dans un fichier `config.json` servi tel quel à la racine du site.
Chaque entrée décrit un outil :

- **`name`** et **`icon`** — le nom affiché et une icône issue du registre interne
- **`url`** et **`type`** — la cible et le mode d'ouverture (`iframe` ou `window`)
- **`description`** localisée (`fr` / `en`), avec une **`longDescription`** optionnelle révélée au survol prolongé ou à l'appui long sur mobile
- **`tags`** — pour catégoriser l'outil

Le fichier est récupéré au runtime : modifier un outil existant se reflète **sans rebuild**. L'ajout d'un nouvel outil `iframe` nécessite en revanche un rebuild, car sa page de visionneuse `/tool/<slug>` est pré-rendue au build.

## Visionneuse intégrée {#viewer}

Deux modes d'ouverture cohabitent selon le `type` de l'outil :

- **`iframe`** — l'outil s'affiche dans une **visionneuse intégrée** au portail (`/tool/<slug>`), avec le panneau de navigation sur la gauche, sans quitter le site. C'est le cas de ZPKI ou HYOAI, servis sur la même origine.
- **`window`** — l'outil s'ouvre simplement dans un **nouvel onglet**.

## Interface {#ui}

L'interface est **bilingue** (français / anglais) via next-intl côté client, avec un thème **clair, sombre ou système** géré par next-themes.
Les interactions sont soignées : détection d'intention au survol (hover-intent), appui long sur écran tactile, mode plein écran, et des composants shadcn/ui accessibles construits sur les primitives Radix.

## Stack technique {#tech}

Construit avec **Next.js 16** (App Router, export statique), **React 19** et **TypeScript strict**, le portail utilise **Tailwind CSS v4** (tokens sémantiques dans `globals.css`), **shadcn/ui** (new-york, primitives Radix), lucide-react, next-intl et next-themes.