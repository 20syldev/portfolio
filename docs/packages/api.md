---
title: "API"
description: "API REST Node.js avec de nombreux modules : couleurs, QR codes, tokens, chat, morpion, et plus encore."
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

## Utilisation {#usage}

### Option 1 : Démarrer un serveur local

Créez un fichier JavaScript et importez le module pour lancer tous les endpoints :

```js
import "@20syldev/api";
```

Puis démarrez le serveur :

```bash
node index.js
```

```
API is running on
    - http://127.0.0.1:3000
    - http://localhost:3000
```

Tous les endpoints de l'API sont alors disponibles localement, comme sur [api.sylvain.sh](https://api.sylvain.sh).

### Option 2 : Importer des modules individuellement

Vous pouvez importer uniquement les modules dont vous avez besoin :

```js
import { color, token, username } from "@20syldev/api/v3";

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

L'API v3 expose les modules suivants, tous importables depuis `@20syldev/api/v3` :

| Module          | Description                                       |
| --------------- | ------------------------------------------------- |
| `algorithms`    | Fonctions algorithmiques diverses                 |
| `captcha`       | Génération d'images captcha                       |
| `chat`          | Système de chat temporaire                        |
| `color`         | Génération de couleurs aléatoires (HEX, RGB, HSL) |
| `convert`       | Conversions d'unités                              |
| `domain`        | Informations de domaine aléatoires                |
| `hash`          | Hachage de texte                                  |
| `hyperplanning` | Analyse de calendriers                            |
| `levenshtein`   | Distance entre chaînes de caractères              |
| `personal`      | Informations personnelles aléatoires              |
| `qrcode`        | Génération de QR codes                            |
| `tic_tac_toe`   | Jeu de morpion                                    |
| `time`          | Informations temporelles                          |
| `token`         | Génération de jetons sécurisés                    |
| `username`      | Génération de noms d'utilisateur                  |

```js
import {
    algorithms,
    captcha,
    chat,
    color,
    convert,
    domain,
    hash,
    hyperplanning,
    levenshtein,
    personal,
    qrcode,
    tic_tac_toe,
    time,
    token,
    username,
} from "@20syldev/api/v3";
```

## Exemples par module {#examples}

### Couleurs

```js
import { color } from "@20syldev/api/v3";

const c = color();
console.log(c.hex); // → "#a3f29c"
console.log(c.rgb); // → "rgb(163, 242, 156)"
console.log(c.hsl); // → "hsl(115, 82%, 78%)"
```

### Tokens sécurisés

```js
import { token } from "@20syldev/api/v3";

// Token hexadécimal de 16 caractères
const hex = token(16, "hex");

// Token base64 de 32 caractères
const b64 = token(32, "base64");
```

### QR Codes

```js
import { qrcode } from "@20syldev/api/v3";

const qr = await qrcode("https://sylvain.sh");
// → Retourne une image QR code
```

### Noms d'utilisateur

```js
import { username } from "@20syldev/api/v3";

const user = username();
console.log(user.username); // → "SkyWalker42"
```

### Hachage

```js
import { hash } from "@20syldev/api/v3";

const h = hash("mon texte", "sha256");
console.log(h);
```

### Distance de Levenshtein

```js
import { levenshtein } from "@20syldev/api/v3";

const distance = levenshtein("chat", "chien");
console.log(distance); // → 4
```

## API HTTP {#http}

L'API est aussi utilisable directement via des requêtes HTTP sur [api.sylvain.sh](https://api.sylvain.sh) ou sur votre serveur local :

```bash
# Générer une couleur aléatoire
curl https://api.sylvain.sh/v3/color

# Générer un QR code
curl "https://api.sylvain.sh/v3/qrcode?text=https://sylvain.sh"

# Générer un token
curl "https://api.sylvain.sh/v3/token?length=16&type=hex"

# Générer un nom d'utilisateur
curl https://api.sylvain.sh/v3/username
```

## Limites d'utilisation {#limits}

| Plan                 | Prix        | Requêtes/heure | Requêtes/jour | Requêtes/semaine | Requêtes/mois |
| -------------------- | ----------- | -------------- | ------------- | ---------------- | ------------- |
| **Gratuit**          | Gratuit     | 2 000          | 48 000        | 336 000          | ~1.4M         |
| **Advanced**         | 0.99€/mois  | 3 500          | 84 000        | 588 000          | ~2.5M         |
| **Pro** (recommandé) | 9.99€/mois  | 6 000          | 144 000       | 1 008 000        | ~4.2M         |
| **Business**         | 19.99€/mois | 10 000         | 240 000       | 1 680 000        | ~7M           |

La limite s'applique par adresse IP. Certains endpoints nécessitant plus de ressources peuvent avoir des limites spécifiques. Les offres payantes sont disponibles sur la page [pricing](https://docs.sylvain.sh/v3/fr/pricing).

## Fonctionnement {#internals}

L'API repose sur une architecture REST développée avec Node.js et Express. Elle est conçue pour être utilisable de deux façons :

- **En tant que serveur** — importez le module et tous les endpoints sont disponibles sur le port 3000
- **En tant que bibliothèque** — importez uniquement les modules dont vous avez besoin directement dans votre code

L'API est hébergée 24h/7j sur [api.sylvain.sh](https://api.sylvain.sh) et la documentation complète est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).

## Prérequis {#prerequisites}

- Node.js (>= 18)
- `"type": "module"` dans `package.json`
- Dépendances : canvas, cors, dotenv, express, ical.js, node-fetch, qrcode, random, uuid

## Tester localement {#local}

### Depuis le dépôt GitHub

```bash
# Cloner le dépôt
git clone https://github.com/20syldev/api.git
cd api

# Installer les dépendances et démarrer
npm run build
```

### Depuis le package npm

```bash
# Créer un projet
mkdir my-api && cd my-api
npm init -y

# Installer et configurer
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

La documentation complète de tous les endpoints avec exemples de requêtes et réponses est disponible sur [docs.sylvain.sh](https://docs.sylvain.sh).

## Dépannage {#troubleshooting}

### ERR_REQUIRE_ESM

- S'assurer que `"type": "module"` est défini dans votre `package.json`
- Utiliser `import` au lieu de `require`

### Le serveur ne démarre pas

- Vérifier que le port 3000 n'est pas déjà utilisé
- Vérifier que toutes les dépendances sont installées : `npm install`

### Module introuvable après installation

- Vérifier que le package est bien installé : `npm ls @20syldev/api`
- S'assurer d'utiliser la bonne version de Node.js (>= 18)

### Erreur CORS

- Si vous utilisez l'API depuis un navigateur, les en-têtes CORS sont configurés par défaut
- Pour un serveur local, vérifier que le module `cors` est bien installé