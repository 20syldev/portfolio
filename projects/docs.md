---
name: Moxon Docs
description: La documentation de Moxon, mon API, pour les développeurs.
longDescription: "Documentation de l'API Moxon construite avec Next.js : un panneau Try et un Playground qui appellent vraiment l'API, des exemples de code en quatre langages, une palette de recherche au clavier, les versions de la v1 à la v6 et une interface bilingue FR/EN avec thème clair, sombre ou système."
tags: ["Next.js", "TypeScript", "Tailwind CSS", "Playground"]
github: "https://github.com/moxondev/docs"
demo: "https://moxon.dev"
---

## À propos {#about}

Voici la documentation de [Moxon](/projet/moxon), mon API et package Node.js, disponible sur [moxon.dev](https://moxon.dev).
Elle couvre plus de 40 endpoints répartis en catégories, avec de quoi les tester en direct, des exemples de code et les pages des versions précédentes de l'API.

## Fonctionnalités {#features}

**Tester :**

- **Panneau Try** sur les endpoints des versions v4 à v6 (hors `hyperplanning` en v6, déprécié) : un formulaire construit à partir des paramètres envoie une vraie requête à [api.moxon.dev](https://api.moxon.dev) et affiche le statut, la durée, la taille, les en-têtes et la réponse (JSON coloré, texte ou image)
    - `Ctrl` + `Entrée` envoie la requête, et un champ obligatoire vide est signalé et reçoit le focus au clic, plutôt que de bloquer le bouton
    - le `Retry-After` d'une réponse `429` est lu et affiché sous la forme « Réessayez dans N s »
- **Playground** pour les versions v4 à v6, avec un sélecteur d'endpoint dont le choix est conservé dans l'adresse (`?endpoint=hash`) pour partager un lien direct
- **Exemples de code** en **cURL**, **JavaScript**, **Python** et **PHP**, générés dans le panneau Try et le Playground à partir de la requête qui part vraiment, et sur chaque page à partir d'un exemple de la documentation
- **Copie** en un clic d'un bloc de code, de l'URL de base ou, sur mobile, de la réponse, et « Copier en Markdown » pour reprendre une page entière depuis un ordinateur

**Naviguer :**

- **Palette de recherche** (`Ctrl` + `K` ou `/`) : un index MiniSearch par version et par langue, construit dans le navigateur, avec les filtres `post:` et `get:`, la recherche par route (`/uuid`) ou par code d'erreur HTTP (`429`), les cinq derniers résultats ouverts, une suggestion « vouliez-vous dire » et, sur ordinateur, un aperçu à côté des résultats
- **Barre latérale** : filtre d'endpoints, catégories repliables avec leur compteur, méthodes `GET` et `POST` et pictogrammes de statut (expérimental, déprécié)
- **Versions** de la v1 à la v6, avec un bandeau de migration sur la v5, un bandeau « version obsolète » sur la v4 et un bandeau « version retirée » sur les versions v1 à v3, qui ne sont plus servies par l'API
- **Bilingue** : anglais à la racine, français sous `/fr/`, la langue du navigateur étant détectée à la première visite de la page d'accueil
- **Thème** clair, sombre ou système, sans flash au chargement, avec des raccourcis clavier pour la langue, la version et le thème
- **Mobile** : un menu en feuille plein écran et une barre « Essayer la requête » qui ouvre le panneau Try dans une feuille
- **Anciennes adresses** : celles de l'ancien site redirigent vers les nouvelles, et la page 404 propose la recherche et une suggestion

## Des pages en données {#content}

Les pages ne sont plus écrites en Markdown : chaque page est un module TypeScript typé, composé de blocs (paragraphes, tableaux de paramètres et de champs, exemples, panneau Try, encarts) rendus par un jeu fixe de composants.
Chaque texte porte sa version anglaise et sa version française, et un script de vérification échoue si une traduction manque.
La navigation, la recherche, le Playground et les exemples de code sont tirés de ces mêmes modules, si bien que la route, la méthode et les paramètres d'un endpoint ne sont déclarés qu'une seule fois, sans registre séparé.

## Pourquoi Next.js {#why}

L'ancien site, construit avec VitePress, comptait près de 500 fichiers Markdown et un registre d'endpoints qui dupliquait les pages.
Passer à Next.js m'a permis de déclarer la route et les paramètres de chaque endpoint une seule fois et d'en dériver le reste.
Le revers, que je surveille avec un script qui mesure le poids du premier chargement, est qu'un runtime React pèse plus lourd qu'une page de texte.

## Stack technique {#tech}

Construit avec **Next.js 16** (App Router, export statique pour GitHub Pages), **React 19** et **TypeScript** en mode strict, le site utilise :

- **Tailwind CSS v4** et **shadcn/ui** (new-york, primitives Radix), avec une seule feuille de style globale et des tokens sémantiques
- **next-intl** pour les textes de l'interface, un fichier JSON par espace de noms avec une parité FR/EN vérifiée, et **next-themes** pour le thème
- **MiniSearch** pour la recherche, **cmdk** pour la palette, **vaul** pour les feuilles mobiles et **Lucide** pour les icônes
- une **coloration syntaxique maison**, appliquée côté serveur aux blocs de code des pages et chargée dans le navigateur seulement avec le panneau Try, plutôt qu'une bibliothèque tierce
- une identité encre et jaune (`#fde68a`), avec les polices Geist, Geist Mono et Bricolage Grotesque
- plus de 700 tests via le runner natif de Node.js, et une commande `check` qui enchaîne les types, le lint, les liens et les traductions

## Déploiement {#deploy}

Le site est exporté en statique et publié sur GitHub Pages à chaque push sur `master`.
Comme un export statique ne peut pas envoyer de redirection `301`, les anciennes adresses du site VitePress et leurs formes courtes sont des pages de redirection générées au build.