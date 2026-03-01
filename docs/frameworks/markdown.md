---
title: Modules Markdown pour présenter du contenu
description: Vue d'ensemble des outils pour transformer du Markdown en interfaces riches — React Markdown et VitePress.
category: frameworks
slug: markdown
order: 2
---

## Introduction {#intro}

Le Markdown est un format de texte simple qui se transforme facilement en HTML. Plutôt que d'écrire du HTML ou du JSX directement, vous écrivez du contenu en Markdown et un **module** le convertit automatiquement en composants rendus à l'écran.

### Pourquoi cette approche ?

- **Maintenabilité** : Le contenu est séparé du code — pas besoin de toucher aux composants pour modifier un texte
- **Lisibilité** : Le Markdown est lisible même sans rendu, contrairement au HTML
- **Productivité** : Écrire en Markdown est beaucoup plus rapide qu'écrire du JSX
- **Portabilité** : Les fichiers `.md` fonctionnent partout (GitHub, VS Code, éditeurs)
- **Collaboration** : N'importe qui peut éditer du Markdown, même sans connaître React

### Deux approches, deux outils

| Outil              | Écosystème | Cas d'usage                        | Exemple         |
| ------------------ | ---------- | ---------------------------------- | --------------- |
| **React Markdown** | React      | Contenu intégré dans une app React | Ce portfolio    |
| **VitePress**      | Vue.js     | Site de documentation dédié        | docs.sylvain.sh |

## Comparaison {#comparison}

### Quand utiliser quoi ?

| Critère              | React Markdown               | VitePress                   |
| -------------------- | ---------------------------- | --------------------------- |
| **Type de projet**   | App React/Next.js existante  | Site de documentation dédié |
| **Framework**        | React                        | Vue.js                      |
| **Setup**            | `npm install react-markdown` | `npm init vitepress`        |
| **Personnalisation** | Composants React custom      | Thème Vue + config          |
| **Recherche**        | À implémenter                | Intégrée                    |
| **Navigation**       | À implémenter                | Auto-générée                |
| **Build séparé**     | Non (intégré à l'app)        | Oui (site autonome)         |
| **Hébergement**      | Avec l'app                   | Site statique indépendant   |

### Choix recommandé

- **[React Markdown](/help/frameworks/react)** si vous avez déjà une app React/Next.js et voulez y intégrer du contenu Markdown (portfolio, blog intégré, fiches projet, section d'aide)

- **[VitePress](/help/frameworks/vitepress)** si vous voulez créer un site de documentation dédié, séparé de votre app principale (documentation technique, wiki, guides)

## Cas d'usage concrets {#usecase}

- **Ce portfolio** utilise React Markdown pour afficher les docs, projets et articles de veille
- **docs.sylvain.sh** utilise VitePress pour une documentation technique dédiée

### Présenter un projet

Utilisez [React Markdown](/help/frameworks/react) pour afficher une fiche projet avec du contenu riche. Le script de génération compile le Markdown en JSON, et un composant React l'affiche avec le style du site.

### Créer de la documentation

Utilisez [VitePress](/help/frameworks/vitepress) pour un site de documentation autonome :

1. Créer le projet : `npm init vitepress`
2. Écrire les pages en Markdown dans `src/`
3. Configurer la sidebar dans `config.ts`
4. Déployer avec un [workflow GitHub Actions](/help/github/workflows/vitepress)

## Résumé {#summary}

| Aspect               | React Markdown                    | VitePress                      |
| -------------------- | --------------------------------- | ------------------------------ |
| **Intégration**      | Dans une app React existante      | Site autonome                  |
| **Complexité setup** | Faible (1 package)                | Faible (assistant)             |
| **Personnalisation** | Composants React                  | Thème Vue + config             |
| **Maintenabilité**   | Contenu séparé du code            | Contenu séparé du code         |
| **Idéal pour**       | Portfolio, blog, app avec contenu | Documentation technique dédiée |