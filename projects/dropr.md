---
name: Dropr
description: Serveur de CDN versionné, en ligne de commande et en bibliothèque, qui diffuse mes scripts, paquets et configurations.
longDescription: "Serveur de CDN versionné développé en TypeScript strict avec Node.js 24, publié sur npm et utilisé pour mon CDN personnel. Il sert des scripts Bash, des paquets NPM et des configurations partagées depuis un dossier de versions figées, avec leurs empreintes SHA-256, une archive .tar.gz reproductible et, en option, des pages pour les navigateurs, sans base de données."
tags: ["Node.js", "TypeScript", "CDN", "CLI"]
github: "https://github.com/20syldev/dropr"
demo: "https://dropr.sylvain.sh"
npm: "https://www.npmjs.com/package/dropr"
---

## À propos {#about}

Dropr est un serveur de CDN versionné, développé en **TypeScript** avec **Node.js** et publié sur npm sous le nom `dropr`. Mon CDN personnel en est l'instance de production, hébergée **24h/7j** sur [dropr.sylvain.sh](https://dropr.sylvain.sh).
Il stocke, versionne et sert mes scripts Bash, mes paquets NPM et mes fichiers de configuration partagés, pour les rendre accessibles partout, à tout moment.
Chaque version publiée est figée et servie telle quelle, avec ses empreintes **SHA-256** et une archive `.tar.gz`.
Le serveur lit le dossier des versions une seule fois au démarrage et n'a besoin d'aucune base de données.
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

- [`tote`](/projet/tote) — Successeur de mn écrit en Go : le script d'installation est publié ici, le binaire et sa signature restant sur GitHub Releases

```bash
curl -fsSL https://dropr.sylvain.sh/bash/tote@latest/install.sh | sh
```

**Paquets NPM :**

- [`@moxon/api`](https://npmjs.com/package/@moxon/api) — Paquet de [Moxon](/projet/moxon), servi sous `/npm/moxon`
- [`@20syldev/api`](https://npmjs.com/package/@20syldev/api) — Ancien nom de Moxon, conservé sous `/npm/api` et marqué comme obsolète au profit de `/npm/moxon` ([docs](/help/packages/api))
- [`@20syldev/logger.ts`](https://npmjs.com/package/@20syldev/logger.ts) — Logger minimaliste pour Node.js, aux logs structurés en JSON ([docs](/help/packages/logger))
- [`@20syldev/minify.js`](https://npmjs.com/package/@20syldev/minify.js) — Minificateur de code JavaScript à partir d'une chaîne, d'un fichier ou d'une URL ([docs](/help/packages/minify))
- [`wrkit`](https://npmjs.com/package/wrkit) — Bot Discord de travail, né pour le BTS SIO et en cours de refonte

**Fichiers de configuration :**

- [`tsconfig`](https://dropr.sylvain.sh/config/tsconfig@latest) — Configuration TypeScript partagée
- [`eslint`](https://dropr.sylvain.sh/config/eslint@latest) — Configuration ESLint (flat config) partagée
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
- **Requêtes conditionnelles** — un `ETag` fort (le SHA-256 des octets), les requêtes conditionnelles, `Range` et `HEAD` comme le décrit la RFC 9110
- **Vrais types de contenu** — chaque fichier est servi avec le type de son extension (`application/json`, `text/javascript`…) et `nosniff`, et en texte brut sinon, ce qui fait s'afficher les scripts sans extension dans le navigateur
- **Listings, empreintes et archives** — listings JSON de chaque type, projet, version et dossier avec la taille des fichiers, empreintes SHA-256 d'une version (`?checksums`) et archive `.tar.gz` (`?download` ou `/download/...`)
- **Changelog et recherche** — historique des versions d'un projet avec leurs dates de sortie, recherche par nom ou par type, description des routes (`/manifest`) et état du serveur (`/health`)
- **Projets obsolètes** — un projet remplacé (un fichier `.deprecated.json` à côté de ses versions) reste joignable à son ancienne adresse, avec toutes ses versions : chacune de ses réponses porte un en-tête `Deprecation` et un lien `Link` vers son successeur
- **Accès ouvert et limité** — CORS ouvert à toutes les origines, avec une limite par client et une limite globale (par défaut 100 requêtes par tranche de 10 secondes pour un client) qui répond `429` avec `Retry-After`
- **Une seule forme d'erreur** — chaque erreur que le serveur répond lui-même est un corps JSON (`status`, `error`, `message`)

## Pages pour les navigateurs {#pages}

Avec l'option `"ui": true`, un navigateur reçoit une page là où tout autre client reçoit le JSON, à la même adresse. Le serveur lit l'en-tête `Accept` : une page n'est envoyée que si `text/html` est demandé avec une qualité supérieure à `application/json`, si bien que `curl`, `fetch()` et les scripts gardent le JSON qu'ils ont toujours eu.

- **Pages** — les paquets par type, un projet avec ses versions, son mode d'emploi, son éventuelle dépréciation et le README de la dernière, une version avec ses fichiers, son archive et ses empreintes, et une recherche
- **Markdown maison** — le README d'une version est rendu par un lecteur Markdown écrit pour le projet, qui écrit le HTML brut comme du texte, retire les commentaires et ne suit que les liens `http`, `https` et `mailto`
- **Apparence** — un objet `ui` règle une couleur d'accent, un logo et un favicon ; l'accent colore les boutons et l'anneau de focus, et les liens reçoivent la teinte la plus proche qui reste lisible à 4,5:1 sur le thème clair comme sur le sombre
- **Sobriété** — chaque page est un seul document avec son style intégré, sans script ni police, et sa `Content-Security-Policy` ne laisse charger que son propre style, les images d'un README et le lien vers la recherche

## Ligne de commande et bibliothèque {#cli}

```bash
dropr serve [config] [--port 4000] [--packages ./packages] [--index file]
dropr check [config] [--packages ./packages]
dropr index [config] [--packages ./packages] [--out file]
```

- **`serve`** — indexe les paquets et écoute, ou sert un index déjà écrit avec `--index` (le serveur refuse alors de démarrer si un fichier de l'index manque ou a changé de taille)
- **`check`** — signale ce que le serveur ignorerait, sans écouter
- **`index`** — affiche l'index des paquets en JSON, ou l'écrit avec `--out`, avec les mêmes octets pour un même arbre
- **Bibliothèque** — `createApp` branche le serveur sur `node:http`, et `createHandler` répond à une `Request` `fetch` par une `Response`, ce qui permet de servir un worker ou de tester sans réseau
- **Sans Node** — `dropr/core` n'importe aucun module Node, vérifié par une configuration TypeScript dédiée et exécuté dans un contexte qui n'a que les globales du web : seuls l'analyse du dossier, la lecture des fichiers et la ligne de commande dépendent de Node

## Architecture {#architecture}

Dropr est développé en **TypeScript strict** (ESM) avec **Node.js 24** ou plus récent, et s'organise autour d'un index construit au démarrage :

- `packages/` — versions publiées, rangées sous `packages/<type>/<projet>/<version>/`, chaque projet portant un `.versions.json` avec la date de chaque version
- `src/lib/` — cœur sans API Node : routage, résolution des versions, empreintes, génération des archives tar, types MIME, réponses (dont le limiteur de débit de @moxon/limiter), pages et lecteur Markdown
- `src/` — ligne de commande et adaptateur Node : analyse des dossiers, lecture des fichiers, démarrage et configuration

Les fichiers ne sont servis que depuis leur dossier de version : un lien symbolique n'est suivi que si sa cible reste à l'intérieur.
Les archives sont générées en JavaScript, avec des entrées triées et datées de la sortie de la version : une même version produit donc exactement les mêmes octets à chaque déploiement.
Le projet n'a que deux dépendances, [@moxon/limiter](https://github.com/moxondev/limiter) et [@20syldev/logger.ts](https://github.com/20syldev/logger.ts), plus de 400 tests, et il est publié sous licence **BSD 3-Clause**.
