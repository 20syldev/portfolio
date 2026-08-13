---
name: API
description: Un package Node.js/TypeScript qui embarque son API REST, à importer ou à héberger.
longDescription: Package NPM développé en TypeScript avec Node.js et Express, publié sous @20syldev/api. Il s'utilise comme une bibliothèque de plus de 40 modules ou se lance en tant que serveur REST complet. api.sylvain.sh en est mon propre déploiement, enrichi d'un plugin personnel.
tags: ["Node.js", "TypeScript", "Express"]
github: "https://github.com/20syldev/api"
demo: "https://api.sylvain.sh"
npm: "https://npmjs.com/@20syldev/api"
docs: "packages/api"
---

## À propos {#about}

`@20syldev/api` est avant tout un **package**, développé en **TypeScript** avec **Node.js** et publié sur [NPM](https://npmjs.com/package/@20syldev/api).
Il s'utilise de deux façons : comme une **bibliothèque** de plus de 40 modules que l'on importe à la carte, ou comme un **serveur REST complet** que l'on lance chez soi en une commande.
[api.sylvain.sh](https://api.sylvain.sh) n'est donc pas « l'API » : c'est **mon déploiement** de ce package, hébergé 24h/7j et ouvert à tous.
La documentation complète est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).

## Un package, pas une instance {#package}

Tout le code publié est **générique** : aucun endpoint ne dépend de mes domaines, de mes projets ou de mes données.
Ce qui m'est propre vit dans un **plugin séparé**, chargé au démarrage uniquement s'il est présent — et exclu de la distribution NPM.

Concrètement, il y a deux niveaux :

- **Le package** (branche `master`, publiée sur NPM) — les modules, les routes versionnées, les middlewares, les tests. C'est ce que vous installez.
- **Mon déploiement** (branche `deploy`) — exactement le même code, plus un dossier `src/plugins/` qui ajoute mes routes personnelles.

Installer le package ne vous donne donc jamais mes endpoints privés, et je n'ai aucun fork à maintenir : `deploy` se contente de suivre `master` avec un dossier en plus.

## Qu'est-ce qu'une API REST ? {#rest}

Une **API REST** permet à deux applications de communiquer en exposant des ressources via des URL fixes et des méthodes HTTP standards (`GET`, `POST`, `PATCH`, `DELETE`).
Ce style d'architecture rend l'intégration simple et accessible, sans nécessiter de configuration complexe côté client.

## Fonctionnalités {#features}

La v5 du package couvre un large spectre de domaines, chaque module étant utilisable aussi bien en import qu'en HTTP :

**Génération visuelle** — QR codes, codes-barres, avatars déterministes, captchas, placeholders SVG et graphiques (bar, line, pie, donut).

**Données fictives** — profils complets, cartes bancaires Luhn-valides, adresses postales pour 5 pays, noms d'utilisateur.

**Utilitaires réseau** — analyse de User-Agent, d'adresses IP (v4/v6), inspection des en-têtes HTTP, calcul de distance GPS (Haversine).

**Cryptographie** — chiffrement symétrique AES avec dérivation `scrypt`, chiffrement asymétrique RSA-OAEP, codes OTP conformes RFC 4226/6238, décodage de JWT, tokens via `crypto.randomInt`, mots de passe avec calcul d'entropie.

**Mathématiques & données** — évaluation d'expressions via un parser Pratt, opérations matricielles jusqu'à 20×20, encodage/décodage multi-formats, conversion de casse, hachage, statistiques descriptives, conversions d'unités.

**Temps réel** — chat privé temporaire et morpion jouables entièrement via l'API REST.

La liste complète des modules et leurs paramètres est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).

## Les deux usages {#usage}

Une seule installation, deux façons de s'en servir.

**En bibliothèque** — importez uniquement les modules dont vous avez besoin, sans jamais démarrer de serveur :

```bash
npm install @20syldev/api
```

```js
import { color, evaluate, symmetric } from "@20syldev/api/v5";

const { hex } = color();
const { result } = evaluate("sqrt(2) ^ 2 + pi", 4);
const { encrypted } = symmetric("encrypt", "aes-256-gcm", "clé", "texte");
```

**En serveur** — le même package embarque son application Express : une commande suffit pour retrouver tous les endpoints en local, avec le même rate limiting et les mêmes routes que sur mon instance.

```bash
npm run build && npm start
# API is running on http://localhost:3000
```

Le [guide d'intégration](/help/packages/api) liste tous les modules disponibles avec leurs exemples complets.

## Architecture {#architecture}

L'API v5 est développée en **TypeScript strict** avec une architecture modulaire :

- `src/modules/v5/` — un fichier TypeScript par endpoint
- `src/middleware/` — CORS, rate limiting, logging, error handler
- `src/routes/` — routeurs séparés `GET`, `POST`, `PATCH`, `DELETE`
- `src/config/` — plans tarifaires, versioning des routes, variables d'environnement
- `src/storage/` — stockage en mémoire pour le chat, le morpion et le rate limiter

La **v4 est désormais figée**, la **v5 en hérite intégralement** et évolue avec les nouveaux modules.
Le projet inclut une suite de **plus de 800 tests** (unitaires + intégration HTTP) via `node:test` natif.

Enfin, le préfixe `/latest` redirige vers la version courante avec un `307`, ce qui préserve la méthode et le corps de la requête — les appels `POST`, `PATCH` et `DELETE` sont donc redirigés correctement, pas seulement les `GET`.

## Le système de plugins {#plugins}

Au démarrage, `app.ts` tente d'importer `./plugins/index.js` : si le fichier existe, chaque routeur qu'il exporte est monté sur l'application ; sinon, l'API démarre normalement sans rien réclamer.

```ts
// src/plugins/index.ts — présent uniquement sur la branche deploy
import website from "./website.js";

const plugins: Router[] = [website];
export default plugins;
```

C'est ce mécanisme qui permet à n'importe qui d'**ajouter ses propres routes** sans toucher au cœur du projet, et à moi de garder les miennes hors du paquet publié — `dist/plugins/` est exclu via `.npmignore`.

## Mon déploiement {#deployment}

L'instance qui tourne sur [api.sylvain.sh](https://api.sylvain.sh) est construite depuis la branche `deploy`, qui n'ajoute qu'un seul plugin : `website`.
Il expose les données propres à ce portfolio — versions des projets, sous-domaines, statistiques, tag de release — lues depuis une variable d'environnement, ainsi qu'un proxy vers le graphe de contributions GitHub avec un cache de 10 minutes.

Tout le reste — les 40+ endpoints publics, le rate limiting, la documentation — vient du package tel qu'il est publié.
Vous pouvez donc reproduire exactement la même API chez vous, à ce plugin près.

## Sécurité {#security}

- **Rate limiting par palier** — `2000 req/heure` par IP en accès libre, jusqu'à `10 000` avec un token, protection anti-burst calibrée par offre (`50` à `200 req/10s`) et plafond global de `50 000 req/heure`
- **Authentification Bearer** — token optionnel dans le header `Authorization`, avec l'endpoint `GET /auth` pour vérifier son palier et ses limites
- **Headers de sécurité** — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- **Protection SSRF** — `/hyperplanning` force `HTTPS` et bloque les IP privées
- **Body limit** — `10 kb` pour `express.json()` et `express.urlencoded()`
- **Filtrage des erreurs** — paths et stack traces masqués dans les réponses d'erreur, endpoints inconnus renvoyés en `404` JSON structuré

## Commencez dès maintenant {#start}

1. Consultez la [documentation](https://docs.sylvain.sh) pour explorer tous les endpoints
2. Testez directement depuis votre terminal :

```bash
curl https://api.sylvain.sh/v5/color
curl https://api.sylvain.sh/v5/username
curl https://api.sylvain.sh/v5/token -X POST -H "Content-Type: application/json" -d '{"length": 32}'
```

Ou sans vous soucier du numéro de version, `/latest` pointe toujours vers la dernière :

```bash
curl https://api.sylvain.sh/latest/color
```

3. Ou installez le package pour l'importer dans votre code, ou le faire tourner sur votre propre serveur

## Limites d'utilisation {#limits}

Ces quotas concernent **mon instance publique** : chez vous, c'est votre serveur, donc vos règles.

[api.sylvain.sh](https://api.sylvain.sh) est **gratuite** avec un quota de **2000 requêtes par heure**, sans inscription ni token.
Des plans avec des limites plus élevées (jusqu'à 10 000 req/heure) sont disponibles sur la page [pricing](https://docs.sylvain.sh/pricing) de la documentation.
L'endpoint `GET /auth` permet de vérifier à tout moment le palier associé à un token et les limites qui s'y appliquent.