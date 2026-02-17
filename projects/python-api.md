---
order: 25
name: API Python
description: Ancienne API Python précédant mon API Node.js.
longDescription: "Première version de l'API personnelle développée en Python avec Flask. Remplacée par l'API Node.js actuelle. Endpoints publics sans limitation."
tags: ["Python", "Flask"]
github: "https://github.com/20syldev/python-api"
archived: true
---

## À propos {#about}

Cette API Python était la première version de mon API personnelle, avant sa réécriture en Node.js.
Elle proposait des endpoints publics sans limitation d'utilisation et une disponibilité 24h/7j.

## Fonctionnalités {#features}

L'API était développée avec **Flask** et offrait plusieurs endpoints accessibles via des requêtes HTTP standards :

- Génération de tokens sécurisés
- Récupération de données diverses
- Tous les endpoints étaient publics et sans limitation de requêtes
- Hébergée 24h/7j avec une documentation sur [docs.sylvain.pro](https://docs.sylvain.pro)

## Exemples d'utilisation {#usage}

L'API pouvait être consommée depuis plusieurs langages :

- **Python** : avec la bibliothèque `requests`
- **JavaScript** : avec l'API `fetch` native
- **Node.js** : avec le module `https`

Le code source reste disponible sur [GitHub](https://github.com/20syldev/python-api) pour consultation et apprentissage.

## Pourquoi la migration vers Node.js ? {#migration}

L'API Python a été remplacée par une version Node.js pour plusieurs raisons :

- **Performances** : Node.js offre une meilleure gestion des requêtes concurrentes grâce à son modèle asynchrone
- **Écosystème NPM** : accès à un écosystème de modules plus large pour ajouter de nouvelles fonctionnalités
- **Limitation de requêtes** : la nouvelle version intègre un système de rate limiting (2000 requêtes/heure) pour une meilleure stabilité
- **Documentation** : migration vers VitePress pour une documentation plus complète et multilingue

La version actuelle est disponible sur [api.sylvain.pro](https://api.sylvain.pro) avec sa documentation sur [docs.sylvain.pro](https://docs.sylvain.pro).