---
name: Zenetys Website
description: Refonte du site zenetys.com, en grille bento et bilingue, notée 100 et 99 sur PageSpeed Insights.
longDescription: "Refonte complète du site de ZENETYS : un site Next.js 16 statique et bilingue (FR/EN) construit en grille bento, noté 100 sur ordinateur et 99 sur mobile par PageSpeed Insights. Un éditeur intégré, adossé à un backend Fastify et SQLite, gère pages, articles, médias, couleurs et redirections avant leur export au build."
tags: ["Next.js", "TypeScript", "Fastify", "CMS"]
demo: "https://www.zenetys.com"
work: true
---

## À propos {#about}

Le site de [ZENETYS](https://www.zenetys.com) présente l'entreprise, ses services, ses technologies, son équipe et ses articles, en français et en anglais.
J'en ai mené la refonte complète : le site public, construit en **grille bento**, et l'**éditeur** qui permet à l'équipe de le faire vivre sans toucher au code. Il remplace l'ancien site WordPress, dont les anciennes adresses sont toutes redirigées.

## Performances {#performance}

Le site obtient **100 sur ordinateur** et **99 sur mobile** sur [PageSpeed Insights](https://pagespeed.web.dev/), avec un score de **100** en bonnes pratiques et en référencement, et **0** de décalage de mise en page.
Ce score ne vient pas d'un site minimaliste : il vient d'un chemin critique qui ne dépend pas du JavaScript.

- **Tout est statique** — chaque page est rendue au build par l'export statique de Next.js et servie comme un simple fichier, sans rendu serveur ni appel d'API avant le premier affichage
- **Composants serveur par défaut** — seuls les éléments interactifs (diaporamas, menu, recherche, bandeau de cookies) sont des îlots côté client, et les fonctions rares (l'éditeur, l'index de recherche) sont des morceaux chargés à la demande
- **Un LCP en texte** — le titre du héros est le plus grand élément affiché, peint dès l'arrivée de sa police, sans attendre d'image
- **Polices auto-hébergées** — trois familles variables découpées par alphabet, dont seul le sous-ensemble latin est préchargé, avec `font-display: swap` et des polices de repli ajustées aux métriques (`size-adjust`, `ascent-override`) pour que rien ne bouge au chargement
- **Images préparées au build** — sharp produit sept largeurs WebP (128 à 1 920 px) de chaque média, et un loader `next/image` personnalisé les relie au `srcset` sans manifeste ni serveur d'images ; chaque image est différée et dimensionnée par `sizes`
- **Thème clair et sombre sans double téléchargement** — les deux versions d'une image sont présentes, mais celle du thème masqué n'est jamais chargée
- **Vidéos réservées aux grands écrans** — les vidéos décoratives passent par `<source media>` et `preload="none"`, si bien que les mobiles et les visiteurs qui limitent les animations n'en téléchargent aucune
- **Rien de caché au premier affichage** — les animations d'apparition ne touchent que les tuiles sous la ligne de flottaison, et la page reste entièrement visible sans JavaScript
- **Aucun tiers** — ni police distante, ni gestionnaire de balises, ni statistiques avant consentement : tout vient d'une seule origine, sur une seule connexion HTTP/2

## Site public {#site}

- **Grille bento** — chaque page est une suite de blocs (tuiles, piles, collections, diaporamas, carrousels, citations, logos, visages) assemblés dans l'éditeur
- **Bilingue** — français et anglais avec next-intl, `hreflang` et URL canoniques dans les pages comme dans le sitemap
- **Recherche plein texte** — Pagefind indexe le texte des pages et des articles au build ; la fenêtre de recherche met les titres en tête et montre le passage trouvé
- **Articles et flux RSS** — un blog avec un flux par langue
- **Formulaire de contact** — le site envoie lui-même le courriel de chaque message, gardé trois mois puis supprimé
- **Référencement** — métadonnées Open Graph et Twitter, données structurées JSON-LD sur les pages de détail, `robots.txt` et `security.txt`
- **Accessibilité** — lien d'évitement, titre `h1` sémantique, carrousels annoncés aux lecteurs d'écran, animations coupées sous `prefers-reduced-motion`, contrastes vérifiés dans l'éditeur de couleurs

## Éditeur {#editor}

Le contenu vit dans un backend **Fastify** et **SQLite**, exporté au build. L'éditeur intégré couvre tout le site :

- **Pages** — une structure en arbre où les blocs se déplacent à la souris comme au clavier, une source modifiable en YAML, l'import d'un fichier YAML après un essai à blanc, et une vue « Toutes les largeurs » qui montre la page sur quatre écrans à la fois
- **Publication** — chaque publication construit une version candidate, montrée page par page avec ses liens cassés, qui part en ligne seule ou attend une validation ; la version précédente revient en un clic, et pages et fiches se planifient
- **Couleurs du site** — un écran qui réunit les couleurs des tuiles, du fond, des liens et des boutons, indique le contraste de chacune et permet d'essayer la palette sur le vrai site avant de la publier
- **Médiathèque** — des dossiers sur trois niveaux sans que les adresses changent, le glisser-déposer, les actions groupées et « Où est-ce affiché ? » pour chaque fichier
- **Listes et fiches** — technologies, services, équipe, témoignages : chaque liste se trie, se filtre, s'exporte et s'importe en YAML, avec une corbeille de trente jours
- **Redirections** — un écran qui liste les anciennes adresses, signale les redirections cassées (cible absente, boucle, plus d'un saut) et les liens internes cassés du dernier build
- **Droits** — rôles d'administrateur et de responsable, connexion par authentification unique et compte de secours

## Stack technique {#tech}

Le site public repose sur **Next.js 16** (App Router, export statique), **React 19** et **TypeScript**, avec **Tailwind CSS v4**, les primitives **Radix**, next-intl et next-themes.
Le backend utilise **Fastify 5**, **better-sqlite3**, **sharp** pour les variantes d'images, **Zod** pour la validation des schémas partagés avec le site et **Pagefind** pour la recherche.
Le site est servi en fichiers statiques derrière un reverse proxy, avec HSTS et des en-têtes de sécurité stricts.