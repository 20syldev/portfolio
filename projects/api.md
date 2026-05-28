---
name: API
description: Mon API TypeScript/Node.js, pour les développeurs et les utilisateurs.
longDescription: API REST complète développée en TypeScript avec Node.js et Express. Plus de 40 endpoints couvrant la génération d'images, les utilitaires réseau, les données fictives, la cryptographie et plus encore. Disponible aussi en tant que module NPM.
tags: ["Node.js", "TypeScript", "Express"]
github: "https://github.com/20syldev/api"
demo: "https://api.sylvain.sh"
npm: "https://npmjs.com/@20syldev/api"
docs: "packages/api"
---

## À propos {#about}

Voici mon API personnelle, développée en **TypeScript** avec **Node.js** et hébergée **24h/7j**.
Elle expose plus de **40 endpoints REST** disponibles directement sur [api.sylvain.sh](https://api.sylvain.sh), ou installables en tant que [module NPM](https://npmjs.com/package/@20syldev/api) pour une intégration dans vos propres projets.
La documentation complète est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).

## Qu'est-ce qu'une API REST ? {#rest}

Une **API REST** permet à deux applications de communiquer en exposant des ressources via des URL fixes et des méthodes HTTP standards (`GET`, `POST`, `PATCH`, `DELETE`).
Ce style d'architecture rend l'intégration simple et accessible, sans nécessiter de configuration complexe côté client.

## Fonctionnalités {#features}

L'API v5 couvre un large spectre de domaines, tous accessibles sans dépendances externes :

**Génération visuelle** — QR codes, codes-barres, avatars déterministes, captchas, placeholders SVG et graphiques (bar, line, pie, donut).

**Données fictives** — profils complets, cartes bancaires Luhn-valides, adresses postales pour 5 pays, noms d'utilisateur.

**Utilitaires réseau** — analyse de User-Agent, d'adresses IP (v4/v6), inspection des en-têtes HTTP, calcul de distance GPS (Haversine).

**Cryptographie** — chiffrement symétrique AES avec dérivation `scrypt`, chiffrement asymétrique RSA-OAEP, codes OTP conformes RFC 4226/6238, tokens via `crypto.randomInt`, mots de passe avec calcul d'entropie.

**Mathématiques & données** — évaluation d'expressions via un parser Pratt, opérations matricielles jusqu'à 20×20, encodage/décodage multi-formats, hachage, statistiques descriptives, conversions d'unités.

**Temps réel** — chat privé temporaire et morpion jouables entièrement via l'API REST.

La liste complète des modules et leurs paramètres est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).

## Utilisation en tant que module {#module}

L'API est publiée sur [NPM](https://npmjs.com/package/@20syldev/api) et s'importe directement dans vos projets Node.js :

```bash
npm install @20syldev/api
```

```js
import { color, evaluate, symmetric } from "@20syldev/api/v5";

const { hex } = color();
const { result } = evaluate("sqrt(2) ^ 2 + pi", 4);
const { encrypted } = symmetric("encrypt", "aes-256-gcm", "clé", "texte");
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
Le projet inclut une suite de **plus de 300 tests** (unitaires + intégration HTTP) via `node:test` natif.

## Sécurité {#security}

- **Rate limiting** — `2000 req/heure` par IP, protection anti-burst (`50 req/10s`)
- **Headers de sécurité** — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- **Protection SSRF** — `/hyperplanning` force `HTTPS` et bloque les IP privées
- **Body limit** — `10 kb` pour `express.json()` et `express.urlencoded()`
- **Filtrage des erreurs** — paths et stack traces masqués dans les réponses d'erreur

## Commencez dès maintenant {#start}

1. Consultez la [documentation](https://docs.sylvain.sh) pour explorer tous les endpoints
2. Testez directement depuis votre terminal :

```bash
curl https://api.sylvain.sh/v5/color
curl https://api.sylvain.sh/v5/username
curl https://api.sylvain.sh/v5/token -X POST -H "Content-Type: application/json" -d '{"length": 32}'
```

3. Ou installez le module NPM pour l'utiliser dans votre code

## Limites d'utilisation {#limits}

L'API est **gratuite** avec un quota de **2000 requêtes par heure**.
Des plans avec des limites plus élevées sont disponibles sur la page [pricing](https://docs.sylvain.sh/pricing) de la documentation.