---
name: Dropr
description: Mon CDN personnel pour versionner et diffuser scripts, paquets et configurations.
longDescription: "CDN personnel développé en TypeScript strict avec Node.js et Express 5, qui stocke, versionne et sert des scripts Bash, des paquets NPM et des configurations partagées. Chaque version publiée est figée et servie telle quelle, avec ses empreintes SHA-256 et une archive .tar.gz."
tags: ["Node.js", "TypeScript", "Express", "CDN"]
github: "https://github.com/20syldev/dropr"
demo: "https://dropr.sylvain.sh"
---

## À propos {#about}

Dropr est mon CDN personnel, développé en **TypeScript** avec **Node.js** et hébergé **24h/7j** sur [dropr.sylvain.sh](https://dropr.sylvain.sh).
Il stocke, versionne et sert mes scripts Bash, mes paquets NPM et mes fichiers de configuration partagés, pour les rendre accessibles partout, à tout moment.
Chaque version publiée est figée et servie telle quelle, avec ses empreintes **SHA-256** et une archive `.tar.gz`.
Le projet s'appelait auparavant **CDN** : l'ancienne adresse cdn.sylvain.sh redirige désormais vers dropr.sylvain.sh.

## Paquets hébergés {#packages}

**Scripts Bash :**

- [`gft`](https://github.com/20syldev/gft) — GitHub Fetch Tool, téléchargement de releases GitHub sans authentification ([docs](/help/linux/gft))

```bash
curl -fsSL https://dropr.sylvain.sh/bash/gft@latest/install.sh | bash
```

- [`mn`](https://github.com/20syldev/mn) — Menu interactif en terminal pour SSH, repos, alias et fonctions ([docs](/help/linux/mn))

```bash
curl -fsSL https://dropr.sylvain.sh/bash/mn@latest/install.sh | bash
```

**Paquets NPM :**

- [`@moxon/api`](https://npmjs.com/package/@moxon/api) — Paquet de [Moxon](/projet/moxon), servi sous `/npm/moxon`
- [`@20syldev/api`](https://npmjs.com/package/@20syldev/api) — Ancien nom de Moxon, conservé sous `/npm/api` et marqué comme obsolète au profit de `/npm/moxon` ([docs](/help/packages/api))
- [`@20syldev/logger.ts`](https://npmjs.com/package/@20syldev/logger.ts) — Logger TypeScript structuré ([docs](/help/packages/logger))
- [`@20syldev/minify.js`](https://npmjs.com/package/@20syldev/minify.js) — Minificateur de fichiers HTML, CSS et JavaScript ([docs](/help/packages/minify))
- [`wrkit`](https://npmjs.com/package/wrkit) — Bot Discord de travail générique, en cours de refonte

**Fichiers de configuration :**

- [`tsconfig`](https://dropr.sylvain.sh/config/tsconfig@latest) — Configuration TypeScript partagée
- [`eslint`](https://dropr.sylvain.sh/config/eslint@latest) — Configuration ESLint v9 (flat config) partagée
- [`prettier`](https://dropr.sylvain.sh/config/prettier@latest) — Configuration Prettier partagée

## Utilisation {#usage}

Chaque fichier est accessible via une URL versionnée de la forme `/<type>/<projet>@<version>/<fichier>` :

```bash
curl -O https://dropr.sylvain.sh/bash/gft@latest/gft              # un fichier
curl https://dropr.sylvain.sh/bash/gft@1.0.6                      # les fichiers d'une version, avec leur taille
curl "https://dropr.sylvain.sh/bash/gft@1.0.6?checksums"          # leurs empreintes SHA-256
curl -OJ https://dropr.sylvain.sh/download/bash/gft@1.0.6         # la version entière, en gft-1.0.6.tar.gz
```

**Fonctionnalités principales :**

- **Résolution partielle** — `@latest` et les versions partielles comme `@6` ou `@6.1` pointent vers la dernière version stable ; une pré-version n'est choisie que si aucune version stable ne correspond, ou par son numéro exact (`@6.0.0-pre`)
- **Cache adapté** — les fichiers d'une version exacte sont mis en cache un an comme immuables, ceux atteints via `@latest` ou une version partielle seulement 5 minutes, puisqu'ils suivent la prochaine release
- **Vrais types de contenu** — chaque fichier est servi avec son type réel (`application/json`, `text/javascript`…) ; les scripts sans extension s'affichent en texte brut dans le navigateur
- **Listings, empreintes et archives** — listings JSON de chaque type, projet, version et dossier avec la taille des fichiers, empreintes SHA-256 d'une version (`?checksums`) et archive `.tar.gz` (`?download` ou `/download/...`)
- **Changelog et recherche** — historique des versions d'un projet avec leurs dates de sortie, recherche par nom ou par type, description des routes (`/manifest`) et état du serveur (`/health`)
- **Projets obsolètes** — un projet remplacé reste joignable à son ancienne adresse, figé à sa dernière version : ses réponses portent un en-tête `Deprecation` et un lien `Link` vers son successeur
- **Accès ouvert** — CORS ouvert à toutes les origines, avec une limite de 100 requêtes par tranche de 10 secondes par client

## Architecture {#architecture}

Dropr est développé en **TypeScript strict** (ESM) avec **Node.js** et **Express 5**, et s'organise autour d'un index construit au démarrage :

- `packages/` — versions publiées, rangées sous `packages/<type>/<projet>/<version>/`
- `src/scan.ts` — index de `packages/` au démarrage : dossiers, fichiers, tailles, dates de sortie, dépréciations et empreintes SHA-256
- `src/lib/` — cœur sans API Node : routage, résolution des versions, empreintes, génération des archives tar, types MIME et limiteur de débit
- `scripts/fetch.sh` — publication d'une version depuis une release GitHub ou depuis l'archive publiée sur npm

Les archives sont générées en JavaScript, avec des entrées triées et datées de la sortie de la version : une même version produit donc exactement les mêmes octets à chaque déploiement.