---
name: Moxon
description: Un package Node.js/TypeScript qui embarque son API REST, à importer ou à héberger.
longDescription: "Package NPM développé en TypeScript avec Node.js et Express, publié sous @moxon/api (anciennement @20syldev/api). Il s'utilise comme une bibliothèque de plus de 40 modules ou se lance en tant que serveur REST complet. api.moxon.dev en est mon propre déploiement, enrichi d'un plugin personnel."
tags: ["Node.js", "TypeScript", "Express"]
github: "https://github.com/moxondev/api"
demo: "https://api.moxon.dev"
npm: "https://www.npmjs.com/package/@moxon/api"
docs: "packages/api"
---

## À propos {#about}

**Moxon** (`@moxon/api`) est avant tout un **package**, développé en **TypeScript** avec **Node.js** et publié sur [NPM](https://www.npmjs.com/package/@moxon/api).
Il s'appelait auparavant `@20syldev/api`, dont la dernière version est dépréciée : pour migrer, il suffit de lancer `npm uninstall @20syldev/api && npm install @moxon/api`, puis de renommer le package dans vos imports (les sous-chemins existants sont conservés, et `@moxon/api/manifest` s'y ajoute depuis la 6.1.0).
Il s'utilise de deux façons : comme une **bibliothèque** de plus de 40 modules que l'on importe à la carte, ou comme un **serveur REST complet** que l'on lance chez soi.
[api.moxon.dev](https://api.moxon.dev) n'est donc pas Moxon lui-même : c'est **mon déploiement** de ce package, hébergé 24h/7j et ouvert à tous.
La documentation complète est disponible sur [moxon.dev](https://moxon.dev).

## Un package, pas une instance {#package}

Tout le code publié est **générique** : aucun endpoint ne dépend de mes domaines, de mes projets ou de mes données.
Ce qui m'est propre vit dans un **plugin séparé**, chargé au démarrage uniquement s'il est présent — et exclu de la distribution NPM.

Concrètement, il y a deux niveaux :

- **Le package** ([`moxondev/api`](https://github.com/moxondev/api), publié sur NPM) — les modules, les routes versionnées et les middlewares, compilés dans `dist/`. C'est ce que vous installez ; les tests restent dans le dépôt.
- **Mon déploiement** (un dépôt privé) — exactement le même code, plus un dossier `src/plugins/` qui ajoute mes routes personnelles.

Installer le package ne vous donne donc jamais mes endpoints privés, et je n'ai qu'un dossier de plus à maintenir : mon déploiement se contente de suivre la branche `master` du package avec ce dossier en plus.

## Qu'est-ce qu'une API REST ? {#rest}

Une **API REST** permet à deux applications de communiquer en exposant des ressources via des URL fixes et des méthodes HTTP standards (`GET`, `POST`, `PATCH`, `DELETE`).
Ce style d'architecture rend l'intégration simple et accessible, sans nécessiter de configuration complexe côté client.

## Fonctionnalités {#features}

Le package couvre un large spectre de domaines, presque tous les modules étant utilisables aussi bien en import qu'en HTTP :

**Génération visuelle** — QR codes, codes-barres, avatars déterministes, captchas, placeholders SVG et graphiques (bar, line, pie, donut).

**Données fictives** — profils complets, cartes bancaires Luhn-valides, adresses postales pour 5 pays, noms d'utilisateur.

**Utilitaires réseau** — analyse de User-Agent, d'adresses IP (v4/v6), inspection des en-têtes HTTP, calcul de distance GPS (Haversine).

**Cryptographie** — chiffrement symétrique AES avec dérivation `scrypt`, chiffrement asymétrique RSA-OAEP, codes OTP conformes RFC 4226/6238, décodage de JWT, tokens cryptographiquement aléatoires (`crypto.randomInt` et `randomBytes`), mots de passe avec calcul d'entropie, défis de preuve de travail.

**Mathématiques & données** — évaluation d'expressions via un parser Pratt, opérations matricielles jusqu'à 20×20, encodage/décodage multi-formats, conversion de casse, hachage, statistiques descriptives, conversions d'unités.

**Temps réel** — chat privé temporaire et morpion jouables entièrement via l'API REST.

La liste complète des modules et leurs paramètres est disponible sur [moxon.dev](https://moxon.dev).

## Les deux usages {#usage}

Une seule installation, deux façons de s'en servir.

**En bibliothèque** — importez uniquement les modules dont vous avez besoin, sans jamais démarrer de serveur :

```bash
npm install @moxon/api
```

Le package demande Node.js 22.12 ou plus.

```js
import { color, evaluate, symmetric } from "@moxon/api";

const { hex } = color();
const { result } = evaluate("sqrt(2) ^ 2 + pi", 4);
const { result: encrypted } = symmetric("encrypt", "texte", "une-cle-solide");
```

**En serveur** — le même package embarque son application Express : il suffit de l'importer pour retrouver tous les endpoints en local, avec le même rate limiting et les mêmes routes publiques que sur mon instance.

```js
// server.mjs
import "@moxon/api/server";
```

```bash
node server.mjs
# API is running on
#     - http://127.0.0.1:3000
#     - http://localhost:3000
```

Depuis un clone du dépôt, `npm run build && npm start` fait la même chose.

Le [guide d'intégration](/help/packages/api) présente l'installation, les deux usages et des exemples complets pour les principaux modules.

## Architecture {#architecture}

L'API est développée en **TypeScript strict** avec une architecture modulaire :

- `src/modules/` — un fichier TypeScript par endpoint, rangé par version (`v4/`, `v5/`), la `v6` réutilisant les modules de la `v5`
- `src/endpoints/` — les endpoints déclarés comme des contrats de données (paramètres, exemple de requête), dont sont tirés la route HTTP et le manifeste expérimental `@moxon/api/manifest` ; `hash` est le premier à l'avoir été
- `src/middleware/` — CORS, rate limiting, logging, error handler
- `src/routes/` — routeurs séparés par méthode HTTP
- `src/config/` — plans tarifaires, versioning des routes, variables d'environnement
- `src/storage/` — stockage en mémoire pour le chat, le morpion et le rate limiter

Les versions **v4, v5 et v6** sont servies côte à côte, la **v6** étant la version courante ; les versions v1 à v3 ont été retirées avec la 6.0.0, sortie sous l'ancien nom `@20syldev/api`.
La v6 garde les mêmes modules que la v5 mais change le contrat HTTP : captcha en mode défi par défaut, `levenshtein` en `POST`, identifiants du chat et du morpion passés dans le corps de la requête, et plus aucune route `PATCH` ni `DELETE`.
Le projet inclut une suite de **plus de 1 000 tests** (unitaires + intégration HTTP) via `node:test` natif.

Enfin, le préfixe `/latest` redirige vers la version courante avec un `307`, ce qui préserve la méthode et le corps de la requête — les appels `POST` sont donc redirigés correctement, pas seulement les `GET`.

## Le système de plugins {#plugins}

Au démarrage, `app.ts` tente d'importer `./plugins/index.js` : si le fichier existe, chaque routeur qu'il exporte est monté sur l'application ; sinon, l'API démarre normalement sans rien réclamer.

```ts
// src/plugins/index.ts — présent uniquement dans mon déploiement
import { type Router } from "express";

import website from "./website.js";

const plugins: Router[] = [website];
export default plugins;
```

C'est ce mécanisme qui permet, depuis un clone ou un fork du dépôt, d'**ajouter ses propres routes** sans toucher aux modules du projet, et à moi de garder les miennes hors du package publié — `dist/plugins/` est exclu via `.npmignore`.

## Mon déploiement {#deployment}

L'instance qui tourne sur [api.moxon.dev](https://api.moxon.dev) est construite depuis un dépôt privé qui reprend le code du package et n'y ajoute qu'un seul plugin : `website`.
Il expose, depuis une variable d'environnement, les données propres à ce portfolio — versions et statuts des projets, message de la bannière de notification — et ajoute à la même réponse le graphe de contributions GitHub, mis en cache pendant 10 minutes.
Cette instance répond aussi sur `api.sylvain.sh`, mon domaine personnel, qui pointe vers le même serveur.

Tout le reste — les plus de 40 endpoints publics et le rate limiting — vient du code du dépôt `moxondev/api`, sans modification ; la documentation, elle, a son propre projet ([Moxon Docs](/projet/docs)).
Vous pouvez donc faire tourner chez vous la même API, à ce plugin près.

## Sécurité {#security}

- **Rate limiting par palier** — `2 000 req/heure` par IP en accès libre, des paliers plus élevés (jusqu'à `10 000`) avec un token, toujours comptés par IP, protection anti-burst calibrée par offre (`50` à `200 req/10s`) et plafond global de `50 000 req/heure`
- **Authentification Bearer** — token optionnel dans le header `Authorization`, avec l'endpoint `GET /auth` pour vérifier son palier et ses limites
- **Headers de sécurité** — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- **Hôtes externes** — `/hyperplanning` (déprécié) exige `HTTPS` et refuse `localhost` et les adresses IPv4 privées usuelles, sans résolution DNS ni contrôle des redirections
- **Journal protégé** — `/logs` reste fermé tant qu'aucun token n'est configuré, et les valeurs des paramètres sont retirées des requêtes journalisées
- **Body limit** — `10 kb` pour `express.json()` et `express.urlencoded()`
- **Filtrage des erreurs** — paths et stack traces masqués dans les réponses d'erreur, endpoints inconnus renvoyés en `404` JSON structuré

## Commencez dès maintenant {#start}

1. Consultez la [documentation](https://moxon.dev) pour explorer tous les endpoints
2. Testez directement depuis votre terminal :

```bash
curl https://api.moxon.dev/v6/color
curl https://api.moxon.dev/v6/username
curl https://api.moxon.dev/v6/token -X POST -H "Content-Type: application/json" -d '{"len": 32}'
```

Ou sans vous soucier du numéro de version, `/latest` pointe toujours vers la dernière :

```bash
curl -L https://api.moxon.dev/latest/color
```

3. Ou installez le package pour l'importer dans votre code, ou le faire tourner sur votre propre serveur

## Limites d'utilisation {#limits}

Ces quotas concernent **mon instance publique** : chez vous, c'est votre serveur, donc vos règles.

[api.moxon.dev](https://api.moxon.dev) est **gratuite** avec un quota de **2 000 requêtes par heure** et par adresse IP, sans inscription ni token.
Des plans avec des limites plus élevées (jusqu'à 10 000 req/heure) sont détaillés sur la page Tarification de la [documentation](https://moxon.dev).
L'endpoint `GET /auth` permet de vérifier à tout moment le palier associé à un token et les limites qui s'y appliquent.
