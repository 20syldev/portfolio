---
name: API
description: Mon API TypeScript/Node.js, pour les développeurs et les utilisateurs.
longDescription: API REST complète développée en TypeScript avec Node.js et Express. Plus de 30 endpoints couvrant la génération d'images, les utilitaires réseau, les données fictives, le texte, la sécurité et plus encore. Disponible aussi en tant que module NPM.
tags: ["Node.js", "TypeScript", "Express"]
github: "https://github.com/20syldev/api"
demo: "https://api.sylvain.sh"
npm: "https://npmjs.com/@20syldev/api"
docs: "packages/api"
---

## À propos {#about}

Voici mon API personnelle, développée en **TypeScript** avec **Node.js** et hébergée **24h/7j**.
Elle expose plus de **30 endpoints REST** disponibles directement sur [api.sylvain.sh](https://api.sylvain.sh), ou installables en tant que [module NPM](https://npmjs.com/package/@20syldev/api) pour une intégration dans vos propres projets.
La documentation complète est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).

## Fonctionnalités {#features}

L'API propose de nombreux modules accessibles sous `/v4/`, couvrant des domaines variés :

**Génération d'images :**

- `QR codes` personnalisables (taille, couleurs, icône overlay)
- `Avatars` déterministes à partir d'un seed — identicon ou pixel-art, PNG ou SVG
- `Codes-barres` (Code128, EAN-13, EAN-8, UPC-A, Code39)
- `Captchas` et `placeholders` SVG animés

**Données fictives :**

- `Profils` complets avec nom, adresse et carte bancaire Luhn-valide
- `Cartes bancaires` fictives (Visa, Mastercard, Amex, Discover)
- `Adresses` postales pour FR, US, UK, DE et ES
- `Noms d'utilisateur` aléatoires

**Utilitaires réseau :**

- Analyse de `User-Agent` (navigateur, OS, appareil, détection bot)
- Analyse d'adresses `IP` (IPv4 / IPv6 : type, portée, version)
- Inspection des `en-têtes HTTP` avec filtrage par nom
- Calcul de distance GPS avec la formule **Haversine**

**Manipulation de données :**

- Encodage/décodage : `base64`, `URL`, `Morse`, `ROT-13`, `César`, `binaire`
- Hachage : `SHA-256`, `SHA-512`, `MD5` — sortie hex ou base64
- Conversions d'unités : longueur, poids, données, vitesse, température
- Couleurs aléatoires et palettes harmonieuses (`complementary`, `triadic`…)

**Outils texte & cryptographie :**

- `Slug`, statistiques de texte, `Lorem Ipsum`, nombre → lettres (FR/EN)
- Test d'expressions régulières avec index, groupes capturants et nommés
- Tokens sécurisés via `crypto.randomInt` (UUID, hex, alphanumérique…)
- Mots de passe avec jeux de caractères personnalisables et calcul d'**entropie**

**Utilitaires divers :**

- Parseur d'expressions `cron` 5 champs + prochaines exécutions (timezones IANA)
- Lanceur de dés en notation RPG (`2d6+3`)
- Statistiques descriptives : moyenne, médiane, écart-type, quartiles
- Validation de numéros **Luhn**, **IBAN** et adresses **email**

**Temps réel :**

- Chat privé temporaire (création, lecture, suppression par token)
- Morpion jouable entièrement via `GET` / `POST` / `PATCH` / `DELETE`

La liste complète des endpoints et leurs paramètres est disponible sur [docs.sylvain.sh/v4](https://docs.sylvain.sh/v4).

## Utilisation en tant que module {#module}

L'API est publiée sur [NPM](https://npmjs.com/package/@20syldev/api), ce qui permet d'importer directement les modules dans vos projets Node.js :

```bash
npm install @20syldev/api
```

```js
import { color, token, credit, cron, avatar } from "@20syldev/api/v4";

// Couleur aléatoire
const { hex, rgb, hsl } = color();

// Token sécurisé
const tok = token(16, "hex");

// Carte bancaire fictive Luhn-valide
const { cards } = credit("visa", 1, "full");
console.log(cards[0].formatted); // "4532 9876 5432 1098"
console.log(cards[0].cvv); // "847"

// Prochaines exécutions d'une expression cron
const { next } = cron("0 9 * * 1-5", 3);

// Avatar déterministe en SVG
const { body } = avatar({ seed: "john", format: "svg", size: 200 });
```

> Pensez à configurer `"type": "module"` dans votre `package.json`.

## Architecture {#architecture}

L'API v4 est entièrement réécrite en **TypeScript strict** avec une architecture modulaire :

- `src/modules/v4/` — un fichier TypeScript par endpoint
- `src/middleware/` — CORS, rate limiting, logging, error handler
- `src/routes/` — routeurs séparés `GET`, `POST`, `PATCH`, `DELETE`
- `src/config/` — plans tarifaires, versioning des routes, variables d'environnement
- `src/storage/` — stockage en mémoire pour le chat, le morpion et le rate limiter

La **v3** reste disponible en JavaScript (figée), la **v4** évolue en TypeScript.
Le projet inclut une suite de **plus de 300 tests** (unitaires + intégration HTTP) via `node:test` natif.

## Sécurité {#security}

- **Rate limiting** — `2000 req/heure` par IP, protection anti-burst (`50 req/10s`)
- **Headers de sécurité** — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- **Protection SSRF** — `/hyperplanning` force `HTTPS` et bloque les IP privées
- **Body limit** — `10 kb` pour `express.json()` et `express.urlencoded()`
- **Filtrage des erreurs** — paths et stack traces masqués dans les réponses d'erreur

## Qu'est-ce qu'une API REST ? {#rest}

Une **API REST** permet à deux applications de communiquer en exposant des ressources via des URL fixes et des méthodes HTTP standards (`GET`, `POST`, `PATCH`, `DELETE`).
Ce style d'architecture rend l'intégration simple et accessible, sans nécessiter de configuration complexe côté client.

## Commencez dès maintenant {#start}

1. Consultez la [documentation](https://docs.sylvain.sh) pour explorer tous les endpoints
2. Testez directement depuis votre terminal :

```bash
curl https://api.sylvain.sh/v4/color
curl https://api.sylvain.sh/v4/username
curl https://api.sylvain.sh/v4/token -X POST -H "Content-Type: application/json" -d '{"length": 32}'
```

3. Ou installez le module NPM pour l'utiliser dans votre code

## Limites d'utilisation {#limits}

L'API est **gratuite** avec un quota de **2000 requêtes par heure**.
Des plans avec des limites plus élevées sont disponibles sur la page [pricing](https://docs.sylvain.sh/latest/pricing) de la documentation.