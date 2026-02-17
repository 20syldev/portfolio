---
order: 10
name: Minify.js
description: Un module Node.js pour minifier ce que vous voulez.
longDescription: "Module NPM minimaliste pour minifier du code JavaScript à partir de chaînes de caractères, fichiers locaux ou URLs. Fonctionne en mode asynchrone."
tags: ["Node.js", "Module"]
github: "https://github.com/20syldev/minify.js"
npm: "https://npmjs.com/@20syldev/minify.js"
---

## À propos {#about}

Voici mon module NPM pour minifier n'importe quel fichier.
Il est développé avec Node.js et est accessible via votre terminal.

## Installation {#install}

Pour installer le module, exécutez la commande suivante :

```bash
npm install @20syldev/minify.js
```

## Fonctionnalités {#features}

Le module permet de compresser du code JavaScript via **trois sources différentes** :

- **Chaînes de caractères** : minification de code passé en texte brut
- **Fichiers locaux** : lecture et compression de fichiers JavaScript
- **URLs externes** : récupération et compression de scripts hébergés en ligne

**API disponible :**

- `minify(input)` : minifie le code et retourne une promesse contenant le code minifié
- `minifyTo(input, outputFile)` : minifie et enregistre directement le résultat dans un fichier

Le module fonctionne entièrement en mode asynchrone via les promesses, garantissant des performances optimales même avec de gros fichiers.