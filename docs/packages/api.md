---
title: "API"
description: "API REST TypeScript/Node.js avec plus de 40 modules : images, données fictives, utilitaires réseau, cryptographie, temps réel et plus encore."
category: packages
slug: api
order: 3
---

## Fonctionnement {#internals}

L'API repose sur une architecture REST développée en **TypeScript strict** avec Node.js et Express. Elle est conçue pour être utilisable de deux façons :

- **En tant que serveur** — tous les endpoints sont disponibles sur le port `3000`
- **En tant que bibliothèque** — importez uniquement les modules dont vous avez besoin

La **v4 est désormais figée**, la **v5 en hérite intégralement** et évolue avec les nouveaux modules.
Le projet inclut plus de **300 tests** (unitaires + intégration HTTP) via `node:test` natif.

## Prérequis {#prerequisites}

- Node.js **>= 22.0.0**
- `"type": "module"` dans `package.json`

## Installation {#install}

### Via npm

```bash
npm install @20syldev/api
```

## Utilisation {#usage}

### Option 1 : Démarrer un serveur local

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

Tous les endpoints sont alors disponibles localement, comme sur [api.sylvain.sh](https://api.sylvain.sh).

### Option 2 : Importer des modules individuellement

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

## Modules disponibles {#modules}

L'API v5 expose plus de **40 modules** couvrant la génération d'images, la cryptographie, les données fictives, les utilitaires réseau, les mathématiques et plus encore.

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

const distance = levenshtein("chat", "chien");
console.log(distance); // → 4
```

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

const { result } = matrix(
    "multiply",
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

const { result: det } = matrix("determinant", [
    [1, 2],
    [3, 4],
]);
console.log(det); // → -2
```

### Chiffrement symétrique

```js
import { symmetric } from "@20syldev/api/v5";

const { encrypted } = symmetric("encrypt", "aes-256-gcm", "ma-clé-secrète", "texte à chiffrer");
const { decrypted } = symmetric("decrypt", "aes-256-gcm", "ma-clé-secrète", encrypted);
console.log(decrypted); // → "texte à chiffrer"
```

### Chiffrement asymétrique

```js
import { asymmetric } from "@20syldev/api/v5";

// Générer une paire de clés RSA 2048 bits
const { publicKey, privateKey } = asymmetric("keygen", "rsa-oaep-sha256", null, null, 2048);

// Chiffrer avec la clé publique
const { encrypted } = asymmetric("encrypt", "rsa-oaep-sha256", publicKey, "texte secret");

// Déchiffrer avec la clé privée
const { decrypted } = asymmetric("decrypt", "rsa-oaep-sha256", privateKey, encrypted);
console.log(decrypted); // → "texte secret"
```

### Codes OTP

```js
import { otp } from "@20syldev/api/v5";

// Générer un secret TOTP avec URI otpauth://
const { secret, uri } = otp("secret", "sha1", 6, 30);

// Générer un code TOTP à partir du secret
const { code } = otp("generate", "sha1", 6, 30, secret);

// Vérifier un code
const { valid } = otp("verify", "sha1", 6, 30, secret, code);
console.log(valid); // → true
```

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
```

## Limites d'utilisation {#limits}

| Plan         | Prix        | Requêtes/heure |
| ------------ | ----------- | -------------- |
| **Gratuit**  | Gratuit     | 2 000          |
| **Advanced** | 0.99€/mois  | 3 500          |
| **Pro**      | 9.99€/mois  | 6 000          |
| **Business** | 19.99€/mois | 10 000         |

La limite s'applique par adresse IP, avec une protection anti-burst de 50 req/10s.
Les offres payantes sont disponibles sur la page [pricing](https://docs.sylvain.sh/pricing).

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