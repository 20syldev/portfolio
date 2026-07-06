---
name: Docs
description: La documentation de mon API, pour les développeurs.
longDescription: "Documentation complète de l'API construite avec VitePress (Vue.js). Interface moderne avec Playground interactif, panneaux Try paramétrés, snippets multi-langages, support multi-versions (v1–v5) et bilingue."
tags: ["Vue.js", "VitePress", "TypeScript", "CSS", "MD"]
github: "https://github.com/20syldev/docs"
demo: "https://docs.sylvain.sh"
---

## À propos {#about}

Voici la documentation de mon [API personnelle](https://api.sylvain.sh), disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).
Elle couvre l'intégralité des endpoints avec des exemples interactifs, des snippets multi-langages et des guides d'intégration.

## Fonctionnalités {#features}

**Interface :**

- **Playground** interactif pour tester chaque endpoint directement depuis la documentation, filtré selon la version active
- **Panneau Try** par endpoint avec paramètres, validation et affichage des réponses (JSON, PNG, SVG)
    - URL de l'endpoint cliquable vers la page de documentation
    - Support des **paramètres de chemin** (ex. `:country`) résolus dynamiquement
    - Inputs avec **placeholder contextuel** et bouton d'envoi désactivé tant que les champs requis sont vides
- **Snippets multi-langages** générés automatiquement via `useCodeSnippets` — corps POST en **JSON**
- **Changelog** par version avec séparation changements API / documentation

**Navigation :**

- **Support multi-versions** : `v1`, `v2`, `v3`, `v4`, `v5` — chaque version reste accessible
- **Sélecteur de version** dérivé automatiquement des fichiers sidebar — sans maintenance manuelle
- **Bilingue** : interface disponible en `fr` et `en` via un système i18n à clés imbriquées
- **Thème sombre** : mode clair et sombre intégré
- **Recherche locale** : recherche instantanée dans toute la documentation
- Sidebar avec **scroll automatique** vers le lien actif

## Stack technique {#tech}

Construit avec **VitePress** (Vue.js) et **TypeScript**, le site utilise :

- `useVersion` — composable pour la gestion des chemins selon la version courante
- `useCodeSnippets` — génération dynamique des exemples de requêtes (cURL, JS, Python)
- Registre centralisé des **métadonnées d'endpoints** (Playground, Try, Features)
- Système **i18n** avec clés imbriquées typées (`nav.home`, `features.geo`...)
- Icônes **Lucide** avec classe utilitaire `.icon-inline` partagée
- CSS organisé en `base` / `components` / `layout`, responsive **mobile-first**

## Composants personnalisés {#components}

La documentation utilise des composants Vue.js pour une meilleure présentation :

- `<Endpoint>` — affichage formaté d'un endpoint avec méthode et URL
- `<Method>` — badge coloré pour les méthodes HTTP (`GET`, `POST`, `PATCH`, `DELETE`)
- `<Try>` — panneau interactif pour tester un endpoint avec ses paramètres
- `<Examples>` — snippets de requête multi-langages générés dynamiquement
- `<Playground>` — interface complète de test avec sélecteur d'endpoint
- `<Terminal>` — simulation de terminal pour les exemples en ligne de commande
- `<Features>` — cartes d'endpoints aléatoires sur la page d'accueil
- `<Banner>` — bannières de migration sur les anciennes versions
- `<Lang>` / `<Version>` — sélecteurs de langue et de version