---
name: Wispen
description: Tableau blanc open source, sans compte, qui tourne entièrement dans le navigateur.
longDescription: "Tableau blanc libre et sans serveur, construit avec Next.js 16, React 19 et TypeScript : formes arrondies, flèches qui suivent les formes, pages multiples, sauvegarde locale dans IndexedDB et exports PNG, SVG, PDF, Excalidraw et draw.io. L'application est installable en PWA et fonctionne hors ligne."
tags: ["Next.js", "TypeScript", "Diagrams", "PWA"]
github: "https://github.com/20syldev/wispen"
demo: "https://wispen.sylvain.sh"
---

## À propos {#about}

Wispen est un tableau blanc **open source**, **simple** et **sans compte** : un espace de travail vierge, une grille en option, et c'est tout.
Il n'y a ni abonnement, ni site vitrine, ni serveur. L'application tourne entièrement dans le navigateur et les documents restent sur la machine de l'utilisateur.
Le projet s'appelait auparavant **whiteboard**. Sa première version stable, la **1.0.0**, est en ligne sur [wispen.sylvain.sh](https://wispen.sylvain.sh).
L'interface est disponible en français et en anglais, avec un mode clair et un mode sombre, automatique ou manuel, et un canevas blanc ou teinté.

## Fonctionnalités {#features}

L'éditeur couvre le dessin de schémas propres, de la forme à l'export :

- **Formes** — rectangle, ellipse, losange, triangle, hexagone, parallélogramme, cylindre, étoile, bulle, note adhésive, image, texte libre et crayon, avec un arrondi des coins réglable sur les formes à coins
- **Flèches et lignes** — droites, coudées ou courbes, accrochées aux formes, qu'elles suivent lorsque celles-ci sont déplacées, avec étiquettes et pointes au choix
- **Texte** — seize polices réparties en cinq familles (sans empattement, avec empattement, manuscrites, à chasse fixe et d'affichage), avec taille, gras, italique, souligné et alignements
- **Pages** — un document en contient plusieurs, renommables, dupliquables et réorganisables
- **Grille** — à points ou à lignes, avec magnétisme activable, alignement et répartition des éléments
- **Palette de commandes** — `Ctrl K` (ou `Cmd K` sur macOS) ouvre la palette de commandes, complétée par un menu contextuel et une fenêtre listant les raccourcis clavier

## Sauvegarde et exports {#storage}

Chaque modification est enregistrée automatiquement dans **IndexedDB** (via idb-keyval), avec plusieurs documents consultables depuis « Mes documents » : renommage, duplication, suppression et téléchargement.
Un document peut aussi être enregistré et rouvert comme fichier `.wispen`, un format que l'application déclare comme type de fichier de la PWA.

Les exports passent par une boîte de dialogue avec aperçu ; la portée proposée (sélection, page ou document entier) dépend du format :

- **PNG** — image matricielle de la sélection ou de la page, avec échelle, marge et arrière-plan réglables, téléchargeable ou copiable dans le presse-papiers
- **SVG** — image vectorielle de la sélection ou de la page, avec option d'intégration des polices pour un rendu identique partout, téléchargeable ou copiable sous forme de code SVG dans le presse-papiers
- **PDF** — une page PDF par page exportée (sélection, page active ou document entier), générée avec jsPDF
- **Excalidraw et draw.io** — Excalidraw s'exporte depuis la page ou la sélection, draw.io depuis la page ou le document entier (un diagramme par page, formes et connecteurs restant modifiables) ; l'import de fichiers `.excalidraw` ouvre un nouveau document
- **Fichier wispen** — le document complet, à rouvrir et modifier plus tard

## Un système de plugins {#plugins}

Le moteur est construit autour d'une API de plugins : un plugin est un objet `WispenPlugin` qui déclare ses formes, ses outils, ses commandes, ses exports et ses imports, puis s'enregistre dans `src/plugins/index.ts`.
Les formes de base passent elles-mêmes par cette API. Les notes adhésives, les formes de diagramme, le pont Excalidraw (import et export) et l'export draw.io sont autant de plugins distincts, et le guide `CONTRIBUTING.md` détaille l'écriture d'un nouveau plugin avec un exemple minimal.

## Installable et hors ligne {#pwa}

Wispen est une **PWA** : elle s'installe comme une application et s'utilise sans connexion grâce à un service worker écrit en TypeScript et compilé dans `public/sw.js`.
Quand une nouvelle version est publiée, l'application propose de recharger la page et rappelle que le travail est déjà enregistré.
Le manifeste est généré au build et tient compte d'un `BASE_PATH` éventuel, ce qui permet de servir le site dans un sous-dossier de GitHub Pages.

## Stack technique {#tech}

Construit avec **Next.js 16** (App Router, export statique), **React 19** et **TypeScript strict**, Wispen utilise **Tailwind CSS v4** et **shadcn/ui** (primitives Radix via le paquet unifié `radix-ui`).
S'y ajoutent next-intl pour les traductions, next-themes pour les thèmes, cmdk pour la palette de commandes, sonner pour les notifications, lucide-react pour les icônes et jsPDF pour l'export PDF.
Le déploiement sur GitHub Pages est automatisé par un workflow à chaque push sur `master`, et le projet est publié sous licence **BSD 3-Clause**.

## Pour le lancer {#usage}

Le workflow de déploiement utilise Node.js 24 et npm :

- `npm install` — installe les dépendances
- `npm run dev` — lance le serveur de développement sur `http://127.0.0.1:9456`
- `npm run build` — génère les icônes et le service worker, puis exporte le site statique dans `out/`
- `npm run start` — sert `out/` sur le port 9457 pour tester la version de production
- `npm run check` — vérifie le typage, ESLint et Prettier