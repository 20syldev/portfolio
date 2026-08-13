---
name: CDN
description: Mon réseau de diffusion de données pour certains projets.
longDescription: "Réseau de stockage et de diffusion de fichiers personnel développé en TypeScript avec Node.js et Express. Stocke et sert les paquets NPM, scripts Bash, fichiers de configuration, images et autres ressources."
tags: ["Node.js", "TypeScript", "Express"]
github: "https://github.com/20syldev/cdn"
demo: "https://cdn.sylvain.sh"
---

## À propos {#about}

Voici mon CDN personnel, développé en **TypeScript** avec **Node.js** et hébergé **24h/7j** sur [cdn.sylvain.sh](https://cdn.sylvain.sh).
Il centralise l'ensemble de mes paquets, scripts et fichiers de configuration pour les rendre accessibles partout, à tout moment.

## Paquets hébergés {#packages}

**Scripts Bash :**

- [`gft`](https://github.com/20syldev/gft) — GitHub Fetch Tool, téléchargement de releases GitHub sans authentification ([docs](/help/linux/gft))

```bash
curl -fsSL https://cdn.sylvain.sh/bash/gft@latest/install.sh | sh
```

- [`mn`](https://github.com/20syldev/mn) — Menu interactif en terminal pour SSH, repos, alias et fonctions ([docs](/help/linux/mn))

```bash
curl -fsSL https://cdn.sylvain.sh/bash/mn@latest/install.sh | sh
```

**Paquets NPM :**

- [`@20syldev/api`](https://npmjs.com/package/@20syldev/api) — Une API REST complète, importable en tant que module ou hébergeable telle quelle ([docs](/help/packages/api))
- [`@20syldev/logger.ts`](https://npmjs.com/package/@20syldev/logger.ts) — Logger TypeScript structuré ([docs](/help/packages/logger))
- [`@20syldev/minify.js`](https://npmjs.com/package/@20syldev/minify.js) — Minificateur de fichiers HTML, CSS et JavaScript ([docs](/help/packages/minify))
- [`wrkit`](https://npmjs.com/package/wrkit) — Outil de gestion de projets en ligne de commande

**Fichiers de configuration :**

- [`tsconfig`](https://cdn.sylvain.sh/config/tsconfig@latest) — Configuration TypeScript partagée
- [`eslint`](https://cdn.sylvain.sh/config/eslint@latest) — Configuration ESLint v9 (flat config) partagée
- [`prettier`](https://cdn.sylvain.sh/config/prettier@latest) — Configuration Prettier partagée

## Utilisation {#usage}

Tous les paquets sont accessibles via leur URL sur [cdn.sylvain.sh](https://cdn.sylvain.sh) et régulièrement mis à jour.

**Avantages principaux :**

- **Résolution partielle** — accédez aux versions via des raccourcis comme `@4` ou `@4.9` sans spécifier la version complète
- **Mises à jour automatiques** — `@latest` pointe toujours vers la dernière version disponible
- **Intégration directe** — référencez les fichiers depuis n'importe quel projet sans configuration
- **Sans restriction** — utilisable pour des projets personnels ou professionnels

## Architecture {#architecture}

Le CDN est développé en **TypeScript strict** avec **Node.js** et **Express.js**, et structuré autour d'une logique de résolution sémantique des versions :

- `packages/bash/` — scripts Bash versionnés
- `packages/npm/` — paquets NPM archivés
- `packages/config/` — fichiers de configuration partagés
- `src/lib/` — logique de comparaison et résolution des versions (`compareVersions`)

La résolution partielle (`@3` → `@3.5.0`, `@1.0` → `@1.0.2`) est gérée côté serveur, ce qui permet d'utiliser des raccourcis stables dans vos scripts sans jamais modifier les liens.