---
order: 10
name: Minify.js
description: Un module Node.js pour minifier ce que vous voulez.
tags: ["Node.js", "Module"]
github: "https://github.com/20syldev/minify.js"
npm: "https://npmjs.com/@20syldev/minify.js"
---

## À propos {#about}

Voici mon module NPM pour minifier n'importe quel fichier.
Il est développé avec Node.js et est accessible via votre terminal.

## À propos du module {#features}

Le module permet de compresser du code JavaScript via **trois sources différentes** :

- **Chaînes de caractères** : minification de code passé en texte brut
- **Fichiers locaux** : lecture et compression de fichiers JavaScript
- **URLs externes** : récupération et compression de scripts hébergés en ligne

**API disponible :**

- `minify(input)` : minifie le code et retourne une promesse
- `minifyTo(input, outputFile)` : minifie et enregistre directement dans un fichier

Le module fonctionne entièrement en mode asynchrone via les promesses.