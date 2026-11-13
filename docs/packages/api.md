---
title: "Moxon"
description: "Package Node.js/TypeScript utilisable en bibliothèque ou en serveur REST, avec plus de 40 modules : images, données fictives, utilitaires réseau, cryptographie, temps réel et plus encore."
category: packages
slug: api
order: 3
---

## Fonctionnement {#internals}

`@moxon/api` est un **package** développé en **TypeScript strict** avec Node.js et Express, conçu pour être utilisable de deux façons :

- **En tant que bibliothèque** — importez uniquement les modules dont vous avez besoin
- **En tant que serveur** — le package embarque son application Express, tous les endpoints sont alors disponibles sur le port `3000`

[api.moxon.dev](https://api.moxon.dev) n'est qu'un **déploiement** de ce package parmi d'autres : le vôtre expose les mêmes routes publiques (à mon plugin personnel près, voir plus bas).

Le package s'appelait auparavant `@20syldev/api`. La dernière version de cet ancien nom est dépréciée. Pour migrer, exécutez `npm uninstall @20syldev/api && npm install @moxon/api`, puis renommez le package dans vos imports (`@20syldev/api/v5` devient `@moxon/api/v5`, les sous-chemins sont inchangés).

Les versions **v4, v5 et v6** sont servies côte à côte, la **v6** étant la version courante ; les versions v1 à v3 ont été retirées avec la 6.0.0, sortie sous l'ancien nom. Pour les retrouver, installez `@20syldev/api@5.9.0`.
Le projet inclut plus de **1 000 tests** (unitaires + intégration HTTP) via `node:test` natif.

## Plugins {#plugins}

Le package publié est **entièrement générique** : il ne contient aucun endpoint lié à mes projets ou à mes domaines.

Au démarrage, l'application tente d'importer `./plugins/index.js`. Si le fichier existe, chaque routeur Express qu'il exporte par défaut est monté ; sinon, l'API démarre normalement.

```ts
// src/plugins/index.ts
import { type Router } from "express";

import website from "./website.js";

const plugins: Router[] = [website];

export default plugins;
```

Chaque plugin est un `Router` Express classique, libre de déclarer ses propres routes et d'utiliser les utilitaires internes du projet. Le dossier compilé `dist/plugins/` est exclu de la distribution npm via `.npmignore`.

C'est ainsi que fonctionne mon instance : un dépôt privé reprend le code du package à l'identique et n'ajoute qu'un dossier `src/plugins/` contenant un plugin `website`, qui sert les métadonnées de mon portfolio. Rien de tout cela n'arrive dans le package que vous installez.

## Prérequis {#prerequisites}

- Node.js **>= 22.12.0**

## Installation {#install}

### Via npm

```bash
npm install @moxon/api
```

La bibliothèque se charge aussi bien avec `import` qu'avec `require()` (depuis Node.js 22.12).

## Utilisation {#usage}

### Option 1 : Importer des modules individuellement

```js
import { color, token, username } from "@moxon/api";

// Générer une couleur aléatoire
const couleur = color();
console.log(`HEX: ${couleur.hex}`);
console.log(`RGB: ${couleur.rgb}`);
console.log(`HSL: ${couleur.hsl}`);

// Générer un nom d'utilisateur aléatoire
const utilisateur = username();
console.log(`Utilisateur: ${utilisateur.username}`);

// Générer un jeton sécurisé
const jeton = token(16, "hex");
console.log(`Jeton: ${jeton}`);
```

### Option 2 : Démarrer votre propre serveur

Depuis le package installé, il suffit d'importer l'entrée serveur :

```js
// server.mjs
import "@moxon/api/server";
```

```bash
node server.mjs
```

```
API is running on
    - http://127.0.0.1:3000
    - http://localhost:3000
```

Depuis un clone du dépôt, `npm run build && npm start` fait la même chose, et `npm run dev` ajoute le rechargement automatique.

Tous les endpoints publics sont alors disponibles localement, comme sur [api.moxon.dev](https://api.moxon.dev) — c'est le même code, à l'exception du plugin `website` propre à mon instance.

### Option 3 : Lire le manifeste des endpoints

Le sous-chemin `@moxon/api/manifest` décrit des endpoints sous forme de données — nom, méthode, chemin, catégorie, paramètres et exemple de requête — plutôt que dans du code :

```js
import { manifest } from "@moxon/api/manifest";

const hash = manifest.find((entry) => entry.name === "hash");
console.log(hash.method, hash.path); // → post /hash
console.log(Object.keys(hash.params)); // → [ 'text', 'method', 'encoding' ]
console.log(hash.example); // → { text: 'hello', method: 'sha256' }
```

Le chemin est relatif à la version : `/hash` correspond à `POST /v6/hash`. Le type `ManifestEntry` est exporté pour TypeScript.

Ce manifeste est **expérimental** : seuls les endpoints déjà migrés vers une déclaration de données y figurent, soit `hash` pour l'instant, et sa forme peut changer dans une version mineure.

## Modules disponibles {#modules}

L'API v6 expose **plus de 40 endpoints**, en `GET` et en `POST`, couvrant la génération d'images, la cryptographie, les données fictives, les utilitaires réseau, les mathématiques et plus encore.

La plupart des modules s'importent comme des fonctions, mais `algorithms`, `chart`, `encode`, `matrix`, `text` et `validate` sont exportés en tant qu'**espaces de noms** — on appelle alors l'opération voulue (`matrix.multiply(...)`, `chart.bar(...)`).

La liste complète avec paramètres, exemples de requêtes et réponses est disponible sur [moxon.dev](https://moxon.dev) — ou consultez la [page de la documentation](/projet/docs) du portfolio pour en savoir plus sur l'outil.

## Exemples par module {#examples}

### Cartes bancaires fictives

```js
import { credit } from "@moxon/api";

const { cards } = credit("visa", 1, "full");
console.log(cards[0].formatted); // → "4532 9876 5432 1098"
console.log(cards[0].cvv); // → "847"
```

### Expressions cron

```js
import { cron } from "@moxon/api";

const { description, next } = cron("0 9 * * 1-5", 3);
console.log(description); // → "At 09:00, Monday through Friday"
console.log(next); // → ["2026-05-13T09:00:00.000Z", ...]
```

La description est renvoyée en anglais.

### Avatars

```js
import { avatar } from "@moxon/api";

const { body } = avatar({ seed: "john", format: "svg", size: 200 });
// body contient une chaîne SVG
```

### Distance de Levenshtein

```js
import { levenshtein } from "@moxon/api";

const { distance } = levenshtein("chat", "chien");
console.log(distance); // → 3
```

### Décodage de JWT

```js
import { jwt } from "@moxon/api";

const { header, payload, signature } = jwt(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc"
);
console.log(header); // → { alg: "HS256", typ: "JWT" }
console.log(payload); // → { sub: "1234567890" }
```

La signature n'est **pas vérifiée** : ce module sert à l'inspection, pas à la validation de sécurité.

### Conversion de casse

```js
import { caseConvert } from "@moxon/api";

const { result } = caseConvert("hello world", "snake");
console.log(result); // → "hello_world"
```

Cibles disponibles : `camel`, `pascal`, `snake`, `kebab`, `constant`, `title`, `sentence`, `upper`, `lower`.

### Évaluation d'expressions mathématiques

```js
import { evaluate } from "@moxon/api";

const { result } = evaluate("sqrt(2) ^ 2 + pi", 4);
console.log(result); // → 5.1416

const { result: r2 } = evaluate("min(3, 7) * (2 + 5)", 0);
console.log(r2); // → 21
```

### Opérations matricielles

```js
import { matrix } from "@moxon/api";

const { result } = matrix.multiply(
    [
        [1, 2],
        [3, 4],
    ],
    [
        [5, 6],
        [7, 8],
    ]
);
console.log(result); // → [[19, 22], [43, 50]]

const { result: det } = matrix.determinant([
    [1, 2],
    [3, 4],
]);
console.log(det); // → -2
```

Opérations disponibles : `add`, `subtract`, `multiply`, `scalar`, `transpose`, `determinant`, `inverse`, `identity`.

### Chiffrement symétrique

```js
import { symmetric } from "@moxon/api";

// symmetric(action, text, key, algorithm?) — aes-256-gcm par défaut
const { result: encrypted } = symmetric("encrypt", "texte à chiffrer", "ma-clé-secrète");
const { result: decrypted } = symmetric("decrypt", encrypted, "ma-clé-secrète");
console.log(decrypted); // → "texte à chiffrer"
```

Algorithmes acceptés : `aes-256-gcm`, `aes-256-cbc`, `aes-128-gcm`. La clé doit faire au moins 8 caractères.

### Chiffrement asymétrique

```js
import { asymmetric } from "@moxon/api";

// Générer une paire de clés RSA 2048 bits
const { publicKey, privateKey } = asymmetric("keygen", { modulusLength: 2048 });

// Chiffrer avec la clé publique
const { result: encrypted } = asymmetric("encrypt", { text: "texte secret", publicKey });

// Déchiffrer avec la clé privée
const { result: decrypted } = asymmetric("decrypt", { text: encrypted, privateKey });
console.log(decrypted); // → "texte secret"
```

`modulusLength` (`2048` ou `4096`) ne s'applique qu'à `keygen`. L'algorithme par défaut est `rsa-oaep-sha256`.

### Codes OTP

```js
import { otp } from "@moxon/api";

// Générer un secret TOTP avec URI otpauth://
const { secret, uri } = otp("secret", { label: "sylvain", issuer: "Portfolio" });

// Générer un code TOTP à partir du secret
const { code, remaining } = otp("generate", { secret });

// Vérifier un code
const { valid, drift } = otp("verify", { secret, code });
console.log(valid); // → true
```

Options disponibles : `algorithm` (`sha1` par défaut, `sha256` et `sha512` acceptés), `digits` (`6` par défaut, `8` accepté), `period` (`30` par défaut, `15` ou `60` acceptés) et `counter` pour le mode HOTP.

Gardez `sha1`, `6` chiffres et `30` secondes sauf si vous maîtrisez les deux extrémités : la plupart des applications d'authentification (Google Authenticator en tête) ignorent les champs `algorithm` et `period` de l'URI `otpauth://` (et `digits` sur Android) et calculent toujours en SHA-1, 6 chiffres, 30 secondes — les codes affichés ne correspondraient alors pas aux vôtres. Ce n'est pas une faiblesse pour autant : HMAC-SHA1 n'est pas concerné par les [collisions SHA-1](/help/cryptography/hashing#collision).

## API HTTP {#http}

L'API est aussi utilisable directement via des requêtes HTTP sur [api.moxon.dev](https://api.moxon.dev) ou sur votre serveur local :

```bash
# Générer une couleur aléatoire
curl https://api.moxon.dev/v6/color

# Générer un QR code
curl "https://api.moxon.dev/v6/qrcode?url=https://sylvain.sh"

# Générer un token
curl -X POST "https://api.moxon.dev/v6/token" \
     -H "Content-Type: application/json" \
     -d '{"len": 16, "type": "hex"}'

# Analyser une IP
curl "https://api.moxon.dev/v6/ip?address=8.8.8.8"

# Prochaines exécutions d'une expression cron
curl "https://api.moxon.dev/v6/cron?expr=0+9+*+*+1-5&count=3"

# Carte bancaire fictive
curl "https://api.moxon.dev/v6/credit?brand=visa&count=1&format=full"

# Évaluer une expression mathématique
curl "https://api.moxon.dev/v6/evaluate?expr=sqrt(2)%5E2%2Bpi&precision=4"

# Générer un graphique SVG
curl -X POST "https://api.moxon.dev/v6/chart" \
     -H "Content-Type: application/json" \
     -d '{"type": "bar", "data": {"labels": ["A", "B", "C"], "datasets": [
       {"label": "Valeurs", "values": [10, 20, 30]}
     ]}}'

# Chiffrement symétrique AES-256-GCM
curl -X POST "https://api.moxon.dev/v6/symmetric" \
     -H "Content-Type: application/json" \
     -d '{"action": "encrypt", "algorithm": "aes-256-gcm", "key": "ma-cle-secrete", "text": "bonjour"}'

# Générer un secret OTP
curl -X POST "https://api.moxon.dev/v6/otp" \
     -H "Content-Type: application/json" \
     -d '{"action": "secret"}'

# Décoder un JWT
curl -X POST "https://api.moxon.dev/v6/jwt" \
     -H "Content-Type: application/json" \
     -d '{"token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.abc"}'

# Convertir la casse d'une chaîne
curl "https://api.moxon.dev/v6/case?text=hello+world&to=snake"
```

### Raccourcis {#shortcuts}

Deux routes utilitaires publiques existent en dehors du versioning :

```bash
curl https://api.moxon.dev/health   # état, version, uptime, mémoire, connexions
curl https://api.moxon.dev/auth     # palier et limites du token fourni
```

Une troisième, `/logs`, est réservée à l'opérateur : elle reste fermée tant qu'aucun `LOGS_TOKEN` n'est configuré, puis exige le header `X-Logs-Token`.

Le préfixe `/latest` redirige vers la version courante en `307`, ce qui **préserve la méthode et le corps** de la requête : pour un client qui suit les redirections (`curl -L`, `fetch`), `POST /latest/token` fonctionne donc aussi bien que `GET /latest/color`, chemin imbriqué et query string compris.

## Authentification {#auth}

L'API est utilisable **sans compte** : sans token, les requêtes sont traitées avec les limites de l'offre gratuite.
Pour bénéficier d'une offre payante, transmettez votre clé dans le header `Authorization` :

```bash
curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/v6/infos
```

L'endpoint `GET /auth` indique à quel palier correspond un token et quelles limites s'y appliquent :

```bash
curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/auth
```

```json
{
    "authenticated": true,
    "tier": "pro",
    "limits": { "hourly": 6000, "burst": 120 }
}
```

Sans token, la réponse renvoie le palier `default` plutôt qu'une erreur. Un token invalide renvoie un `401`.

## Limites d'utilisation {#limits}

Ces paliers s'appliquent à **mon instance publique** [api.moxon.dev](https://api.moxon.dev). Sur votre propre déploiement, les valeurs se configurent par variables d'environnement, détaillées dans la section [Configuration](#config) (`DEFAULT_LIMIT`, `ADVANCED_LIMIT`, `PRO_LIMIT`, `BUSINESS_LIMIT`, `GLOBAL_LIMIT`, les variantes `*_BURST` et les `*_TOKEN_LIST`).

| Plan         | Prix       | Requêtes/heure | Burst/10s |
| ------------ | ---------- | -------------- | --------- |
| **Gratuit**  | Gratuit    | 2 000          | 50        |
| **Advanced** | 2.99€/mois | 3 500          | 80        |
| **Pro**      | 4.99€/mois | 6 000          | 120       |
| **Business** | 9.99€/mois | 10 000         | 200       |

La limite s'applique toujours par adresse IP : le token ne fait que choisir le palier appliqué à cette IP, avec une protection anti-burst propre à chaque palier.
Un plafond global de 50 000 req/heure protège l'instance dans son ensemble. Les réponses exposent les en-têtes `X-RateLimit-Limit`, `X-RateLimit-Remaining` et `X-RateLimit-Reset` (sauf les `401` de token invalide et les `429` de burst ou de plafond global) ; `Retry-After` n'est envoyé qu'avec les `429`.
Les offres payantes sont détaillées sur la page Tarification de la [documentation](https://moxon.dev).

## Configuration {#config}

Tous les réglages sont optionnels et lus dans l'environnement ; un fichier `.env` placé dans le répertoire depuis lequel vous lancez `node` est chargé automatiquement, sans écraser les variables déjà définies. Le serveur démarre sans aucun d'entre eux.

| Variable           | Défaut    | Rôle                                                                                                                                                      |
| ------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`             | `3000`    | Port d'écoute                                                                                                                                             |
| `DOCS_URL`         | —         | URL de la documentation, indiquée par `/`, `/:version` et `/:version/infos`                                                                               |
| `REPO_URL`         | —         | Dépôt source, indiqué par `/:version/infos`                                                                                                               |
| `INSTANCE_CREATED` | —         | Date de lancement, indiquée par `/:version/infos`                                                                                                         |
| `LOGS_TOKEN`       | —         | Valeur exigée dans le header `X-Logs-Token` pour lire `/logs`, qui reste fermée tant qu'elle est absente                                                  |
| `CHALLENGE_SECRET` | aléatoire | Clé de signature des tokens du captcha et de la preuve de travail, tirée au hasard à chaque démarrage tant qu'elle est absente                            |
| `TRUSTED_PROXIES`  | un saut   | Proxys approuvés pour lire `X-Forwarded-For` : blocs CIDR séparés par des espaces ou des virgules, ou raccourcis `loopback`, `linklocal` et `uniquelocal` |
| `GLOBAL_LIMIT`     | `50000`   | Requêtes par heure acceptées par l'instance entière                                                                                                       |
| `DEFAULT_LIMIT`    | `2000`    | Requêtes par heure et par client                                                                                                                          |
| `DEFAULT_BURST`    | `50`      | Requêtes par fenêtre de 10 secondes et par client                                                                                                         |

Les trois variables de métadonnées sont omises des réponses tant qu'elles ne sont pas définies : une instance n'annonce ainsi jamais la documentation ou le dépôt de quelqu'un d'autre.

Des quotas plus élevés peuvent être accordés par client : les variantes `ADVANCED_`, `PRO_` et `BUSINESS_` de `_LIMIT` et `_BURST` définissent les paliers, et les variables `*_TOKEN_LIST` associées contiennent les tokens Bearer correspondants, séparés par des espaces ou des virgules. `GET /auth` indique le palier et les limites d'un client.

Trois points demandent de l'attention en production.

- Les compteurs de limites et la liste des tokens déjà utilisés vivent dans la mémoire du processus : chaque instance d'un déploiement multi-instances compte donc séparément, et un même token peut être accepté une fois par instance.
- Tant que `CHALLENGE_SECRET` est absente, chaque processus invente sa propre clé, si bien que les tokens cessent d'être valides après un redémarrage et sont refusés par les autres instances : définissez-la explicitement dès que plusieurs processus tournent, avec une valeur à forte entropie comme `openssl rand -hex 32`.
- Sans proxy devant l'instance, définissez `TRUSTED_PROXIES` à une valeur qui n'inclut pas vos clients (par exemple `loopback`), sinon un client peut choisir son adresse IP, et donc son quota, avec l'en-tête `X-Forwarded-For`.

## Tester localement {#local}

### Depuis le dépôt GitHub

```bash
git clone https://github.com/moxondev/api.git
cd api
npm install
npm run dev
```

### Depuis le package npm

```bash
mkdir my-api && cd my-api
npm init -y
npm install @moxon/api
```

Puis créez `index.mjs` :

```js
import "@moxon/api/server";
```

```bash
node index.mjs
```

## Dépannage {#troubleshooting}

### ERR_REQUIRE_ESM / ERR_REQUIRE_ASYNC_MODULE

- Sans le flag `--experimental-require-module`, `require()` ne peut pas charger le package avant Node.js 22.12 : mettre Node.js à jour (>= 22.12.0) ou utiliser `import`
- L'entrée serveur ne se charge jamais avec `require()` : depuis du CommonJS, utiliser `import("@moxon/api/server")` (le `await` n'est permis que dans une fonction `async`)

### Cannot find module '../build/Release/canvas.node'

`canvas`, l'une des dépendances du package, installe un binaire natif lors de l'installation. Si les scripts d'installation ont été ignorés (`--ignore-scripts`, ou un gestionnaire de paquets qui les bloque par défaut), l'import du package, de `@moxon/api/v4`, `@moxon/api/v5`, `@moxon/api/v6` et de `@moxon/api/server` échoue avec cette erreur.

- Construire le binaire manquant : `npm rebuild canvas` (si `ignore-scripts=true` est défini dans votre configuration npm : `npm rebuild canvas --ignore-scripts=false`)
- Ou autoriser les scripts de `canvas` dans votre gestionnaire de paquets (avec pnpm : `pnpm approve-builds`), puis réinstaller

### Le serveur ne démarre pas

- Vérifier que le port `3000` n'est pas déjà utilisé, ou en choisir un autre avec la variable d'environnement `PORT` (par exemple `PORT=3001 node server.mjs`)
- Vérifier la version de Node.js : `node --version` (>= 22.12 requis)
- Installer les dépendances : `npm install`

### Module introuvable après installation

- Vérifier que le package est installé : `npm ls @moxon/api`
- Vérifier la version de Node.js (>= 22.12.0)
