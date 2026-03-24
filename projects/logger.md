---
name: Logger.ts
description: Module Node.js minimaliste pour générer et servir des logs structurés en JSON.
longDescription: "Module NPM minimaliste pour Node.js permettant de générer, formater et servir des logs structurés en JSON, avec des thèmes personnalisables, un système de groupes et une API HTTP intégrée."
tags: ["Node.js", "TypeScript", "Module"]
github: "https://github.com/20syldev/logger.ts"
npm: "https://www.npmjs.com/package/@20syldev/logger.ts"
docs: "packages/logger"
---

## À propos {#about}

Logger.ts est un module NPM minimaliste pour Node.js qui permet de générer, formater et servir des logs structurés au format JSON.
Il est publié sur NPM sous le nom [@20syldev/logger.ts](https://www.npmjs.com/package/@20syldev/logger.ts) et ne possède aucune dépendance externe.

## Fonctionnalités {#features}

Logger.ts est conçu pour être simple à utiliser tout en offrant une grande flexibilité.

**Capacités principales :**

- **Logs structurés** : chaque entrée est horodatée et stockée au format JSON
- **Serveur HTTP intégré** : servez vos logs via une API JSON avec filtrage et tri par paramètres
- **Thèmes console** : 4 thèmes intégrés (`minimal`, `colored`, `detailed`, `plain`) et support de thèmes personnalisés
- **Groupes** : organisez vos logs par namespace pour mieux les catégoriser
- **Événements** : écoutez les événements `log` et `clear` pour déclencher des actions
- **TTL automatique** : suppression automatique des anciennes entrées avec l'option `maxAge`
- **Compatible HTTP natif** : loguez directement depuis les objets `req`/`res` de Node.js

## Installation {#installation}

```console
npm install @20syldev/logger.ts
```

## Utilisation {#usage}

Créez un logger, ajoutez des entrées et servez-les en quelques lignes :

```js
import { createLogger } from "@20syldev/logger.ts";

const logger = createLogger({ theme: "detailed", maxEntries: 500 });

logger.log({ method: "GET", url: "/api/users", status: 200, duration: "45ms" });

logger.serve(3000);
// → http://127.0.0.1:3000 retourne les logs au format JSON
```

Le serveur intégré supporte le filtrage via des paramètres de requête (`?status=200&method=GET&limit=50`) et expose un endpoint `/health` pour le monitoring.