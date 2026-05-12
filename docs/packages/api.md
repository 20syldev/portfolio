---
title: "API"
description: "API REST TypeScript/Node.js avec plus de 30 modules : images, données fictives, utilitaires réseau, cryptographie, temps réel et plus encore."
category: packages
slug: api
order: 3
---

## Installation {#install}

### Via npm

```bash
npm install @20syldev/api
```

### Configuration requise

Assurez-vous que `"type": "module"` est défini dans votre `package.json` :

```json
{
    "type": "module"
}
```

Node.js **>= 22.0.0** requis.

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
import { color, token, username } from "@20syldev/api/v4";

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

L'API v4 expose les modules suivants, tous importables depuis `@20syldev/api/v4` :

| Module        | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `address`     | Adresses postales aléatoires (FR, US, UK, DE, ES)            |
| `agent`       | Analyse de User-Agent (navigateur, OS, appareil, bot)        |
| `algorithms`  | Tri, fibonacci, factorielle, chiffres romains                |
| `avatar`      | Avatars déterministes identicon ou pixel-art, PNG ou SVG     |
| `barcode`     | Codes-barres Code128, EAN-13/8, UPC-A, Code39                |
| `captcha`     | Images captcha                                               |
| `chat`        | Système de chat privé temporaire                             |
| `color`       | Couleurs aléatoires (HEX, RGB, HSL, HSV)                     |
| `convert`     | Conversions d'unités (longueur, poids, données, vitesse…)    |
| `credit`      | Cartes bancaires fictives Luhn-valides                       |
| `cron`        | Parseur d'expressions cron + prochaines exécutions           |
| `dice`        | Lanceur de dés en notation RPG (`2d6+3`)                     |
| `domain`      | Informations de domaine aléatoires                           |
| `encode`      | Encodage/décodage base64, URL, Morse, ROT-13, César, binaire |
| `geo`         | Distance et cap GPS (Haversine)                              |
| `hash`        | Hachage SHA-256/512/MD5                                      |
| `ip`          | Analyse IPv4/IPv6                                            |
| `levenshtein` | Distance entre chaînes de caractères                         |
| `palette`     | Palettes de couleurs harmonieuses                            |
| `password`    | Mots de passe sécurisés avec calcul d'entropie               |
| `personal`    | Profil fictif complet                                        |
| `placeholder` | Placeholders SVG (image ou skeleton animé)                   |
| `qrcode`      | QR codes PNG personnalisables                                |
| `regex`       | Test d'expressions régulières                                |
| `statistics`  | Statistiques descriptives                                    |
| `text`        | Slug, Lorem Ipsum, stats de texte, nombre → lettres          |
| `tic_tac_toe` | Jeu de morpion via API REST                                  |
| `time`        | Informations temporelles et countdown                        |
| `token`       | Tokens sécurisés via `crypto.randomInt`                      |
| `username`    | Noms d'utilisateur aléatoires                                |
| `validate`    | Validation Luhn, IBAN, email                                 |

## Exemples par module {#examples}

### Couleurs

```js
import { color } from "@20syldev/api/v4";

const c = color();
console.log(c.hex); // → "#a3f29c"
console.log(c.rgb); // → "rgb(163, 242, 156)"
console.log(c.hsl); // → "hsl(115, 82%, 78%)"
```

### Tokens sécurisés

```js
import { token } from "@20syldev/api/v4";

// Token hexadécimal de 16 caractères
const hex = token(16, "hex");

// UUID
const id = token(0, "uuid");
```

### Cartes bancaires fictives

```js
import { credit } from "@20syldev/api/v4";

const { cards } = credit("visa", 1, "full");
console.log(cards[0].formatted); // → "4532 9876 5432 1098"
console.log(cards[0].cvv); // → "847"
```

### Expressions cron

```js
import { cron } from "@20syldev/api/v4";

const { description, next } = cron("0 9 * * 1-5", 3);
console.log(description); // → "À 09:00, du lundi au vendredi"
console.log(next); // → ["2026-05-13T09:00:00.000Z", ...]
```

### Avatars

```js
import { avatar } from "@20syldev/api/v4";

const { body } = avatar({ seed: "john", format: "svg", size: 200 });
// body contient une chaîne SVG
```

### Noms d'utilisateur

```js
import { username } from "@20syldev/api/v4";

const user = username();
console.log(user.username); // → "SkyWalker42"
```

### Distance de Levenshtein

```js
import { levenshtein } from "@20syldev/api/v4";

const distance = levenshtein("chat", "chien");
console.log(distance); // → 4
```

## API HTTP {#http}

L'API est aussi utilisable directement via des requêtes HTTP sur [api.sylvain.sh](https://api.sylvain.sh) ou sur votre serveur local :

```bash
# Générer une couleur aléatoire
curl https://api.sylvain.sh/v4/color

# Générer un QR code
curl "https://api.sylvain.sh/v4/qrcode?text=https://sylvain.sh"

# Générer un token
curl -X POST "https://api.sylvain.sh/v4/token" \
     -H "Content-Type: application/json" \
     -d '{"length": 16, "type": "hex"}'

# Analyser une IP
curl https://api.sylvain.sh/v4/ip?address=8.8.8.8

# Prochaines exécutions d'une expression cron
curl "https://api.sylvain.sh/v4/cron?expression=0+9+*+*+1-5&count=3"

# Carte bancaire fictive
curl "https://api.sylvain.sh/v4/credit?brand=visa&count=1&format=full"
```

## Limites d'utilisation {#limits}

| Plan         | Prix        | Requêtes/heure |
| ------------ | ----------- | -------------- |
| **Gratuit**  | Gratuit     | 2 000          |
| **Advanced** | 0.99€/mois  | 3 500          |
| **Pro**      | 9.99€/mois  | 6 000          |
| **Business** | 19.99€/mois | 10 000         |

La limite s'applique par adresse IP, avec une protection anti-burst de 50 req/10s.
Les offres payantes sont disponibles sur la page [pricing](https://docs.sylvain.sh/latest/pricing).

## Fonctionnement {#internals}

L'API repose sur une architecture REST développée en **TypeScript strict** avec Node.js et Express. Elle est conçue pour être utilisable de deux façons :

- **En tant que serveur** — tous les endpoints sont disponibles sur le port `3000`
- **En tant que bibliothèque** — importez uniquement les modules dont vous avez besoin

La **v3** reste disponible en JavaScript (figée), la **v4** évolue en TypeScript.
Le projet inclut plus de **300 tests** (unitaires + intégration HTTP) via `node:test` natif.

## Prérequis {#prerequisites}

- Node.js **>= 22.0.0**
- `"type": "module"` dans `package.json`

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

## Documentation externe {#docs}

La documentation complète de tous les endpoints avec exemples de requêtes et réponses est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh/latest).

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