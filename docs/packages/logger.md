---
title: "Logger.ts"
description: "Module Node.js minimaliste pour générer, formater et servir des logs structurés en JSON."
category: packages
slug: logger
order: 1
---

## Installation {#install}

### Via npm

```bash
npm install @20syldev/logger.ts
```

### Import

```js
import { createLogger } from "@20syldev/logger.ts";
```

## Utilisation {#usage}

### Créer un logger

```js
const logger = createLogger({
    maxEntries: 500,
    order: "desc",
    theme: "detailed",
});
```

### Ajouter des entrées

```js
logger.log({
    method: "GET",
    url: "/api/users",
    status: 200,
    duration: "45ms",
});
```

### Loguer depuis un serveur HTTP natif

```js
import http from "node:http";

const logger = createLogger();

http.createServer((req, res) => {
    const start = Date.now();
    res.end("OK");
    logger.request(req, res, { duration: `${Date.now() - start}ms` });
}).listen(8080);
```

### Servir les logs en JSON

```js
logger.serve(3000);
// → http://127.0.0.1:3000 retourne un tableau JSON des logs
```

Paramètres de requête disponibles pour le filtrage et le tri :

```
GET /?order=desc&sort=timestamp
GET /?limit=50&status=200&method=GET
GET /?_group=auth
```

### Endpoint de santé

```
GET /health → { "ok": true, "count": 42 }
```

## Fonctionnalités {#features}

- **Logs structurés** — chaque entrée est horodatée et stockée au format JSON
- **Serveur HTTP intégré** — servez vos logs via une API JSON avec filtrage et tri
- **Thèmes console** — 4 thèmes intégrés et support de thèmes personnalisés
- **Groupes** — organisez vos logs par namespace
- **Événements** — écoutez les événements `log` et `clear` pour déclencher des actions
- **TTL automatique** — suppression automatique des anciennes entrées avec `maxAge`
- **Compatible HTTP natif** — loguez directement depuis les objets `req`/`res` de Node.js
- **Zéro dépendance** — aucune dépendance externe

## Options de configuration {#options}

| Option       | Défaut        | Description                                                                                                       |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `maxEntries` | `1000`        | Nombre maximum de logs en mémoire (éviction FIFO)                                                                 |
| `cors`       | `"*"`         | En-tête CORS origin pour `serve()`                                                                                |
| `order`      | `"asc"`       | Ordre de tri par défaut (`"asc"` ou `"desc"`)                                                                     |
| `sort`       | `"timestamp"` | Champ de tri par défaut                                                                                           |
| `console`    | `true`        | Afficher automatiquement dans la console à chaque `.log()`                                                        |
| `theme`      | `"colored"`   | Nom du thème, objet personnalisé, ou `false` pour désactiver                                                      |
| `maxAge`     | `null`        | TTL en secondes (supprime automatiquement les anciennes entrées)                                                  |
| `timeFormat` | `"time"`      | Format d'horodatage : `"time"`, `"iso"`, `"locale"`, `"date"`, `"datetime"`, `"utc"`, ou `(date: Date) => string` |

## Méthodes {#methods}

| Méthode                      | Description                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `.log(entry)`                | Ajoute une entrée structurée. Ajoute `timestamp` automatiquement si absent. Retourne l'entrée ou `null`. |
| `.request(req, res, extras)` | Logue depuis les objets HTTP natifs de Node.js. Retourne l'entrée ou `null`.                             |
| `.print(entry)`              | Affiche manuellement une entrée dans la console.                                                         |
| `.entries()`                 | Retourne tous les logs stockés (triés, filtrés par TTL).                                                 |
| `.clear()`                   | Supprime tous les logs stockés.                                                                          |
| `.serve(port)`               | Démarre un serveur HTTP servant les logs en JSON.                                                        |
| `.group(name)`               | Crée un sous-logger avec un namespace.                                                                   |
| `.on(event, cb)`             | Écoute un événement (`"log"`, `"clear"`).                                                                |
| `.off(event, cb)`            | Supprime un écouteur d'événement.                                                                        |

## Thèmes console {#themes}

Quatre thèmes intégrés sont disponibles : `minimal`, `colored` (par défaut), `detailed` et `plain`.

```js
// Utiliser un thème intégré
const logger = createLogger({ theme: "detailed" });

// Thème personnalisé
const logger = createLogger({
    theme: {
        format: "{time} {icon} {method} {url} → {status} ({duration})",
        colors: {
            timestamp: "\x1b[90m",
            method: "\x1b[36m",
            status2xx: "\x1b[32m",
            status5xx: "\x1b[31m",
        },
        icons: {
            success: "✓",
            serverError: "✗",
        },
    },
});

// Désactiver l'affichage console
const logger = createLogger({ console: false });

// Affichage manuel
logger.print(entry);
```

## Groupes {#groups}

Les groupes permettent d'organiser les logs par namespace :

```js
const auth = logger.group("auth");
auth.log({ method: "POST", url: "/login", status: 200 });
// Console : [auth] 12:34:56 ✓ POST /login → 200
// L'entrée inclut _group: "auth"
```

Les groupes sont filtrables via le paramètre `?_group=auth` sur le serveur HTTP.

## Événements {#events}

```js
logger.on("log", (entry) => {
    if (entry.status >= 500) sendAlert(entry);
});

logger.on("clear", () => console.log("Logs vidés"));
```

Deux événements sont disponibles : `"log"` (déclenché à chaque entrée) et `"clear"` (déclenché lors du vidage des logs).

## Exports publics {#exports}

Au-delà de `createLogger`, le module expose des utilitaires et types pour un usage avancé :

```js
import {
    createLogger,
    // Utilitaires de thèmes
    themes, // Record des thèmes intégrés
    resolveTheme, // Résoudre un nom ou config en objet Theme
    defaultColors, // Palette ANSI par défaut
    defaultIcons, // Icônes de statut par défaut
    // Bus d'événements
    createEventBus, // Émetteur d'événements autonome (utilisé en interne)
} from "@20syldev/logger.ts";
```

## Types TypeScript {#types}

```ts
import type {
    LogEntry,
    Logger,
    SubLogger,
    LoggerOptions,
    Theme,
    CustomTheme,
    ThemeColors,
    ThemeIcons,
    TimeFormat,
    LoggerEvent,
    EventCallback,
    EventBus,
    ServeContext,
} from "@20syldev/logger.ts";
```

## Prérequis {#prerequisites}

- Node.js (>= 18)
- Aucune dépendance externe

## Dépannage {#troubleshooting}

### Module introuvable après installation

- Vérifier que le package est bien installé : `npm ls @20syldev/logger.ts`
- S'assurer d'utiliser la bonne syntaxe d'import ESM

### Le serveur HTTP ne démarre pas

- Vérifier que le port n'est pas déjà utilisé
- S'assurer que `serve()` est appelé avec un numéro de port valide

### Les logs ne s'affichent pas dans la console

- Vérifier que l'option `console` n'est pas définie à `false`
- Vérifier que le thème n'est pas désactivé (`theme: false`)