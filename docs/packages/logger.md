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

### Niveaux de log {#levels}

Chaque entrée peut porter un niveau : `debug`, `info`, `warn` ou `error`. Utilisez les méthodes dédiées, ou renseignez `level` directement dans l'entrée.

```js
logger.debug({ method: "GET", url: "/debug/query", status: 200 });
logger.info({ method: "GET", url: "/api/users", status: 200 });
logger.warn({ method: "POST", url: "/api/upload", status: 413 });
logger.error({ method: "DELETE", url: "/api/data", status: 500 });
```

L'option `level` fixe un niveau minimum : tout ce qui est moins sévère est ignoré (la méthode retourne `null` et rien n'est stocké). Une entrée passée à `.log()` sans `level` compte comme `info` pour ce filtre, mais elle est stockée sans champ `level`.

```js
const logger = createLogger({ level: "warn" });

logger.info({ url: "/noisy" }); // → null, non stocké
logger.error({ url: "/boom" }); // → stocké
```

Le niveau n'est affiché que si le thème contient le placeholder `{level}`, ce que fait le thème `detailed` (voir [Thèmes console](#themes)).

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
GET /?level=warn
```

`level` est un minimum, pas une égalité : `?level=warn` retourne les entrées `warn` et `error`. Les entrées sans champ `level` sont traitées comme `info`.

### Endpoint de santé

```
GET /health → { "ok": true, "count": 42 }
```

## Fonctionnalités {#features}

- **Logs structurés** — chaque entrée est horodatée et stockée au format JSON
- **Serveur HTTP intégré** — servez vos logs via une API JSON avec filtrage et tri
- **Thèmes console** — 4 thèmes intégrés et support de thèmes personnalisés
- **Niveaux de log** — `debug`, `info`, `warn`, `error`, avec niveau minimum configurable et filtre `?level=`
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
| `level`      | `"debug"`     | Niveau minimum stocké : `"debug"`, `"info"`, `"warn"` ou `"error"`                                                |
| `timeFormat` | `"time"`      | Format d'horodatage : `"time"`, `"iso"`, `"locale"`, `"date"`, `"datetime"`, `"utc"`, ou `(date: Date) => string` |

## Méthodes {#methods}

| Méthode                      | Description                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `.log(entry)`                | Ajoute une entrée structurée. Ajoute `timestamp` automatiquement si absent. Retourne l'entrée ou `null`. |
| `.request(req, res, extras)` | Logue depuis les objets HTTP natifs de Node.js. Retourne l'entrée ou `null`.                             |
| `.debug(entry)`              | Comme `.log()`, avec le niveau `debug`. Idem pour `.info()`, `.warn()` et `.error()`.                    |
| `.print(entry)`              | Affiche manuellement une entrée dans la console.                                                         |
| `.entries()`                 | Retourne tous les logs stockés (triés, filtrés par TTL).                                                 |
| `.clear()`                   | Supprime tous les logs stockés.                                                                          |
| `.serve(port)`               | Démarre un serveur HTTP servant les logs en JSON.                                                        |
| `.group(name)`               | Crée un sous-logger avec un namespace.                                                                   |
| `.on(event, cb)`             | Écoute un événement (`"log"`, `"clear"`).                                                                |
| `.off(event, cb)`            | Supprime un écouteur d'événement.                                                                        |

## Thèmes console {#themes}

Quatre thèmes intégrés sont disponibles : `minimal`, `colored` (par défaut), `detailed` et `plain`. Parmi eux, seul `detailed` affiche le niveau (`{level}`, en majuscules) et les icônes de statut.

Le format d'un thème accepte les placeholders `{time}`, `{level}`, `{method}`, `{url}`, `{status}`, `{duration}` et `{icon}`. Le niveau est coloré par `levelDebug` (gris), `levelInfo` (cyan), `levelWarn` (jaune) et `levelError` (rouge) dans `colors`.

```js
// Utiliser un thème intégré
const logger = createLogger({ theme: "detailed" });

// Thème personnalisé
const logger = createLogger({
    theme: {
        format: "{time} {level} {icon} {method} {url} → {status} ({duration})",
        colors: {
            timestamp: "\x1b[90m",
            levelError: "\x1b[41m",
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
// Console (thème par défaut) : [auth] 12:34:56 POST /login 200
// L'entrée inclut _group: "auth"
```

Avec le thème `detailed`, la même ligne affiche l'icône et la flèche, et le niveau pour les entrées qui en ont un :

```js
const logger = createLogger({ theme: "detailed" });
const auth = logger.group("auth");

auth.info({ method: "POST", url: "/login", status: 200 });
// Console : [auth] 12:34:56 INFO ✓ POST /login → 200
```

Un groupe expose les mêmes méthodes que le logger : `.log()`, `.debug()`, `.info()`, `.warn()`, `.error()`, `.request()` et `.print()`.

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
    getLevelColor, // Résoudre la couleur ANSI d'un niveau de log
    // Niveaux
    LOG_LEVELS, // Tuple des niveaux, du moins au plus sévère
    LEVEL_PRIORITY, // Record associant chaque niveau à sa priorité numérique
    // Bus d'événements
    createEventBus, // Émetteur d'événements autonome (utilisé en interne)
} from "@20syldev/logger.ts";
```

## Types TypeScript {#types}

```ts
import type {
    LogEntry,
    LogLevel,
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
