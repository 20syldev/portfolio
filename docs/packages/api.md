---
title: "API"
description: "Package Node.js/TypeScript utilisable en bibliothèque ou en serveur REST, avec plus de 40 modules : images, données fictives, utilitaires réseau, cryptographie, temps réel et plus encore."
category: packages
slug: api
order: 3
---

## Fonctionnement {#internals}

`@20syldev/api` est un **package** développé en **TypeScript strict** avec Node.js et Express, conçu pour être utilisable de deux façons :

- **En tant que bibliothèque** — importez uniquement les modules dont vous avez besoin
- **En tant que serveur** — le package embarque son application Express, tous les endpoints sont alors disponibles sur le port `3000`

[api.sylvain.sh](https://api.sylvain.sh) n'est qu'un **déploiement** de ce package parmi d'autres : le vôtre expose exactement les mêmes routes.

La **v4 est désormais figée**, la **v5 en hérite intégralement** et évolue avec les nouveaux modules.
Le projet inclut plus de **800 tests** (unitaires + intégration HTTP) via `node:test` natif.

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

C'est ainsi que fonctionne mon instance : la branche `deploy` du dépôt reprend `master` à l'identique et n'ajoute qu'un dossier `src/plugins/` contenant un plugin `website`, qui sert les métadonnées de mon portfolio. Rien de tout cela n'arrive dans le package que vous installez.

## Prérequis {#prerequisites}

- Node.js **>= 22.0.0**
- `"type": "module"` dans `package.json`

## Installation {#install}

### Via npm

```bash
npm install @20syldev/api
```

## Utilisation {#usage}

### Option 1 : Importer des modules individuellement

```js
import { color, token, username } from "@20syldev/api/v5";

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

```bash
npm run build && npm start
```

```
API is running on
    - http://127.0.0.1:3000
    - http://localhost:3000
```

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

Tous les endpoints sont alors disponibles localement, exactement comme sur [api.sylvain.sh](https://api.sylvain.sh) — c'est le même code.

## Modules disponibles {#modules}

L'API v5 expose **46 endpoints** (32 `GET`, 11 `POST`, 1 `PATCH`, 2 `DELETE`) couvrant la génération d'images, la cryptographie, les données fictives, les utilitaires réseau, les mathématiques et plus encore.

La plupart des modules s'importent comme des fonctions, mais `algorithms`, `chart`, `matrix` et `text` sont exportés en tant qu'**espaces de noms** — on appelle alors l'opération voulue (`matrix.multiply(...)`, `chart.bar(...)`).

La liste complète avec paramètres, exemples de requêtes et réponses est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh) — ou consultez la [page de la documentation](/projet/docs) du portfolio pour en savoir plus sur l'outil.

## Exemples par module {#examples}

### Cartes bancaires fictives

```js
import { credit } from "@20syldev/api/v5";

const { cards } = credit("visa", 1, "full");
console.log(cards[0].formatted); // → "4532 9876 5432 1098"
console.log(cards[0].cvv); // → "847"
```

### Expressions cron

```js
import { cron } from "@20syldev/api/v5";

const { description, next } = cron("0 9 * * 1-5", 3);
console.log(description); // → "À 09:00, du lundi au vendredi"
console.log(next); // → ["2026-05-13T09:00:00.000Z", ...]
```

### Avatars

```js
import { avatar } from "@20syldev/api/v5";

const { body } = avatar({ seed: "john", format: "svg", size: 200 });
// body contient une chaîne SVG
```

### Distance de Levenshtein

```js
import { levenshtein } from "@20syldev/api/v5";

const { distance } = levenshtein("chat", "chien");
console.log(distance); // → 3
```

### Décodage de JWT

```js
import { jwt } from "@20syldev/api/v5";

const { header, payload, signature } = jwt(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc"
);
console.log(header); // → { alg: "HS256", typ: "JWT" }
console.log(payload); // → { sub: "1234567890" }
```

La signature n'est **pas vérifiée** : ce module sert à l'inspection, pas à la validation de sécurité.

### Conversion de casse

```js
import { caseConvert } from "@20syldev/api/v5";

const { result } = caseConvert("hello world", "snake");
console.log(result); // → "hello_world"
```

Cibles disponibles : `camel`, `pascal`, `snake`, `kebab`, `constant`, `title`, `sentence`, `upper`, `lower`.

### Évaluation d'expressions mathématiques

```js
import { evaluate } from "@20syldev/api/v5";

const { result } = evaluate("sqrt(2) ^ 2 + pi", 4);
console.log(result); // → 5.1416

const { result: r2 } = evaluate("min(3, 7) * (2 + 5)", 0);
console.log(r2); // → 21
```

### Opérations matricielles

```js
import { matrix } from "@20syldev/api/v5";

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
import { symmetric } from "@20syldev/api/v5";

// symmetric(action, text, key, algorithm?) — aes-256-gcm par défaut
const { result: encrypted } = symmetric("encrypt", "texte à chiffrer", "ma-clé-secrète");
const { result: decrypted } = symmetric("decrypt", encrypted, "ma-clé-secrète");
console.log(decrypted); // → "texte à chiffrer"
```

Algorithmes acceptés : `aes-256-gcm`, `aes-256-cbc`, `aes-128-gcm`. La clé doit faire au moins 8 caractères.

### Chiffrement asymétrique

```js
import { asymmetric } from "@20syldev/api/v5";

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
import { otp } from "@20syldev/api/v5";

// Générer un secret TOTP avec URI otpauth://
const { secret, uri } = otp("secret", { label: "sylvain", issuer: "Portfolio" });

// Générer un code TOTP à partir du secret
const { code, remaining } = otp("generate", { secret });

// Vérifier un code
const { valid, drift } = otp("verify", { secret, code });
console.log(valid); // → true
```

Options disponibles : `algorithm` (`sha1` par défaut), `digits` (`6`), `period` (`30`) et `counter` pour le mode HOTP.

## API HTTP {#http}

L'API est aussi utilisable directement via des requêtes HTTP sur [api.sylvain.sh](https://api.sylvain.sh) ou sur votre serveur local :

```bash
# Générer une couleur aléatoire
curl https://api.sylvain.sh/v5/color

# Générer un QR code
curl "https://api.sylvain.sh/v5/qrcode?text=https://sylvain.sh"

# Générer un token
curl -X POST "https://api.sylvain.sh/v5/token" \
     -H "Content-Type: application/json" \
     -d '{"length": 16, "type": "hex"}'

# Analyser une IP
curl https://api.sylvain.sh/v5/ip?address=8.8.8.8

# Prochaines exécutions d'une expression cron
curl "https://api.sylvain.sh/v5/cron?expr=0+9+*+*+1-5&count=3"

# Carte bancaire fictive
curl "https://api.sylvain.sh/v5/credit?brand=visa&count=1&format=full"

# Évaluer une expression mathématique
curl "https://api.sylvain.sh/v5/evaluate?expr=sqrt(2)%5E2%2Bpi&precision=4"

# Générer un graphique SVG
curl -X POST "https://api.sylvain.sh/v5/chart" \
     -H "Content-Type: application/json" \
     -d '{"type": "bar", "data": {"labels": ["A", "B", "C"], "datasets": [
       {"label": "Valeurs", "values": [10, 20, 30]}
     ]}}'

# Chiffrement symétrique AES-256-GCM
curl -X POST "https://api.sylvain.sh/v5/symmetric" \
     -H "Content-Type: application/json" \
     -d '{"action": "encrypt", "algorithm": "aes-256-gcm", "key": "ma-cle-secrete", "text": "bonjour"}'

# Générer un secret OTP
curl -X POST "https://api.sylvain.sh/v5/otp" \
     -H "Content-Type: application/json" \
     -d '{"action": "secret"}'

# Décoder un JWT
curl -X POST "https://api.sylvain.sh/v5/jwt" \
     -H "Content-Type: application/json" \
     -d '{"token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.abc"}'

# Convertir la casse d'une chaîne
curl "https://api.sylvain.sh/v5/case?text=hello+world&to=snake"
```

### Raccourcis {#shortcuts}

Trois routes utilitaires existent en dehors du versioning :

```bash
curl https://api.sylvain.sh/health   # état, uptime, mémoire, connexions
curl https://api.sylvain.sh/logs     # journal des requêtes récentes
curl https://api.sylvain.sh/auth     # palier et limites du token fourni
```

Le préfixe `/latest` redirige vers la version courante en `307`, ce qui **préserve la méthode et le corps** de la requête — `POST /latest/token` fonctionne donc aussi bien que `GET /latest/color`, chemin imbriqué et query string compris.

## Authentification {#auth}

L'API est utilisable **sans compte** : sans token, les requêtes sont traitées avec les limites de l'offre gratuite.
Pour bénéficier d'une offre payante, transmettez votre clé dans le header `Authorization` :

```bash
curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.sylvain.sh/v5/infos
```

L'endpoint `GET /auth` indique à quel palier correspond un token et quelles limites s'y appliquent :

```bash
curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.sylvain.sh/auth
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

Ces paliers s'appliquent à **mon instance publique** [api.sylvain.sh](https://api.sylvain.sh). Sur votre propre déploiement, les valeurs se configurent dans `src/config/plans.ts`.

| Plan         | Prix        | Requêtes/heure | Burst/10s |
| ------------ | ----------- | -------------- | --------- |
| **Gratuit**  | Gratuit     | 2 000          | 50        |
| **Advanced** | 0.99€/mois  | 3 500          | 80        |
| **Pro**      | 9.99€/mois  | 6 000          | 120       |
| **Business** | 19.99€/mois | 10 000         | 200       |

La limite s'applique par adresse IP (ou par token si vous êtes authentifié), avec une protection anti-burst propre à chaque palier.
Un plafond global de 50 000 req/heure protège l'instance dans son ensemble. Les offres payantes sont disponibles sur la page [pricing](https://docs.sylvain.sh/pricing).

## Tester localement {#local}

### Depuis le dépôt GitHub

```bash
git clone https://github.com/20syldev/api.git
cd api
npm install
npm run dev
```

### Depuis le package npm

```bash
mkdir my-api && cd my-api
npm init -y
npm install @20syldev/api
```

Ajoutez `"type": "module"` dans `package.json`, puis créez `index.js` :

```js
import "@20syldev/api";
```

```bash
node index.js
```

## Dépannage {#troubleshooting}

### ERR_REQUIRE_ESM

- S'assurer que `"type": "module"` est défini dans `package.json`
- Utiliser `import` au lieu de `require`

### Le serveur ne démarre pas

- Vérifier que le port `3000` n'est pas déjà utilisé
- Vérifier la version de Node.js : `node --version` (>= 22 requis)
- Installer les dépendances : `npm install`

### Module introuvable après installation

- Vérifier que le package est installé : `npm ls @20syldev/api`
- Vérifier la version de Node.js (>= 22.0.0)