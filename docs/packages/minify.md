---
title: "Minify.js"
description: "Module Node.js minimaliste pour minifier du code JavaScript à partir de chaînes, fichiers ou URLs."
category: packages
slug: minify
order: 2
---

## Installation {#install}

### Via npm

```bash
npm install @20syldev/minify.js
```

### Import

```js
import { minify, minifyTo } from "@20syldev/minify.js";
```

## Utilisation {#usage}

### Minifier une chaîne de caractères

Passez directement du code JavaScript en tant que texte brut :

```js
const result = await minify(`
    for (let i = 0; i < 10; i++) {
        console.log(i);
    }
`);
console.log(result);
// → "for(let i=0;i<10;i++)console.log(i);"
```

### Minifier un fichier local

Passez le chemin relatif ou absolu d'un fichier JavaScript :

```js
const result = await minify("./app.js");
console.log(result);
```

### Minifier depuis une URL

Passez l'URL d'un script hébergé en ligne :

```js
const result = await minify("https://example.com/script.js");
console.log(result);
```

### Minifier et enregistrer dans un fichier

La fonction `minifyTo` combine la minification et l'écriture dans un fichier de sortie :

```js
// Depuis un fichier local
await minifyTo("./app.js", "app.min.js");

// Depuis une URL
await minifyTo("https://example.com/script.js", "script.min.js");

// Depuis une chaîne de caractères
await minifyTo("const x = 1;", "output.min.js");
```

## Fonctionnalités {#features}

- **Trois sources d'entrée** — chaînes de caractères, fichiers locaux ou URLs externes
- **Écriture directe** — enregistrement du résultat dans un fichier avec `minifyTo`
- **Asynchrone** — toutes les opérations retournent des promesses
- **Détection automatique** — le module identifie automatiquement le type d'entrée (chaîne, chemin de fichier ou URL)
- **Zéro dépendance** — aucune dépendance externe
- **Léger** — ~6 Ko décompressé

## API {#api}

### `minify(input)`

Minifie du code JavaScript et retourne une promesse contenant le code minifié.

| Paramètre | Type     | Description                                                            |
| --------- | -------- | ---------------------------------------------------------------------- |
| `input`   | `string` | Code JavaScript brut, chemin vers un fichier local, ou URL d'un script |

**Retour :** `Promise<string>` — le code minifié

**Détection du type d'entrée :**

- Si `input` commence par `http://` ou `https://` → traité comme une URL
- Si `input` correspond à un chemin de fichier existant → lu depuis le disque
- Sinon → traité comme du code JavaScript brut

```js
// Les trois cas sont gérés automatiquement
await minify("const x = 1;"); // chaîne
await minify("./src/app.js"); // fichier
await minify("https://cdn.example.com/lib.js"); // URL
```

### `minifyTo(input, outputFile)`

Minifie du code JavaScript et enregistre le résultat directement dans un fichier.

| Paramètre    | Type     | Description                                                            |
| ------------ | -------- | ---------------------------------------------------------------------- |
| `input`      | `string` | Code JavaScript brut, chemin vers un fichier local, ou URL d'un script |
| `outputFile` | `string` | Chemin du fichier de sortie                                            |

**Retour :** `Promise<void>`

```js
await minifyTo("./src/app.js", "./dist/app.min.js");
```

## Exemples d'intégration {#examples}

### Script de build

```js
import { minifyTo } from "@20syldev/minify.js";

const files = ["./src/app.js", "./src/utils.js", "./src/main.js"];

for (const file of files) {
    const output = file.replace("./src/", "./dist/").replace(".js", ".min.js");
    await minifyTo(file, output);
    console.log(`✓ ${file} → ${output}`);
}
```

### Minification à la volée dans un serveur

```js
import http from "node:http";
import { minify } from "@20syldev/minify.js";

http.createServer(async (req, res) => {
    if (req.url === "/app.min.js") {
        const code = await minify("./src/app.js");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(code);
    }
}).listen(3000);
```

## Fonctionnement {#internals}

Le module supprime les espaces inutiles, les commentaires et les retours à la ligne pour réduire la taille du code JavaScript. Il fonctionne entièrement en mode asynchrone via les promesses, garantissant des performances optimales même avec de gros fichiers.

Pour les URLs, le module effectue une requête HTTP pour récupérer le contenu du script avant de le minifier. Pour les fichiers locaux, il utilise le système de fichiers Node.js (`fs`).

## Prérequis {#prerequisites}

- Node.js (>= 18)
- Aucune dépendance externe

## Dépannage {#troubleshooting}

### Module introuvable après installation

- Vérifier que le package est bien installé : `npm ls @20syldev/minify.js`
- S'assurer d'utiliser la syntaxe d'import ESM (`import` et non `require`)
- Vérifier que `"type": "module"` est défini dans votre `package.json`

### Erreur lors de la minification d'un fichier

- Vérifier que le chemin du fichier est correct et que le fichier existe
- S'assurer que le fichier est accessible en lecture

### Erreur lors de la minification d'une URL

- Vérifier que l'URL est accessible et retourne du JavaScript valide
- S'assurer que le serveur distant autorise les requêtes (pas de CORS côté serveur)
- Vérifier la connexion internet