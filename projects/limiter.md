---
name: Limiter
description: "Un petit limiteur de débit à fenêtre glissante par clé et plafond global, dont l'appelant donne l'horloge."
longDescription: "Paquet npm écrit en TypeScript, sans aucune dépendance, qui décide si une requête passe ou non : une fenêtre glissante par clé, un plafond global optionnel et une limite propre à chaque appel. Il ne lit aucune heure et ne lance aucun minuteur, car l'appelant lui donne l'horloge, si bien qu'il tourne sur n'importe quel moteur JavaScript et se teste sans attendre."
tags: ["TypeScript", "JavaScript", "ESM", "Rate limiting"]
github: "https://github.com/moxondev/limiter"
npm: "https://www.npmjs.com/package/@moxon/limiter"
---

## À propos {#about}

**Limiter** (`@moxon/limiter`) est un petit limiteur de débit : à chaque requête, on lui demande si elle peut passer, et il répond oui ou non avec de quoi remplir les en-têtes `Retry-After` et `X-RateLimit-*`.
Il compte chaque clé, par exemple une adresse IP, sur une fenêtre glissante, et peut y ajouter un plafond global qui limite toutes les clés ensemble.
Il est publié sur [NPM](https://www.npmjs.com/package/@moxon/limiter), le code est sur [github.com/moxondev/limiter](https://github.com/moxondev/limiter), et il est livré avec ses types TypeScript, sans aucune dépendance.

Son idée tient en une phrase : **l'appelant donne l'horloge**. Le paquet ne lit aucune heure et ne lance aucun minuteur, ce qui le rend utilisable sur n'importe quel moteur JavaScript, puisque le code n'utilise aucune API de Node, et très simple à tester.

## Utilisation {#usage}

```bash
npm install @moxon/limiter
```

```js
import { createLimiter } from "@moxon/limiter";

const limiter = createLimiter({
    window: 10_000, // Longueur de la fenêtre en millisecondes
    client: 100, // Requêtes qu'une clé peut faire sur n'importe quelle fenêtre
    global: 1000, // Requêtes que toutes les clés peuvent faire ensemble, aucune limite si absent
});

const decision = limiter.check(ip, Date.now());

if (decision.ok) {
    // Laisser passer : decision.remaining requêtes restent, la plus ancienne sort de la fenêtre dans decision.reset secondes
} else {
    // Refuser : decision.scope vaut "client" ou "global", decision.retryAfter est le nombre de secondes à attendre
}
```

Une requête qui passe est comptée, une requête refusée ne compte nulle part : un client qui insiste est de nouveau accepté dès que sa fenêtre se vide.

## Les réponses {#answers}

- **Acceptée** — `{ ok: true, limit, remaining, reset }` : `remaining` requêtes restent et la plus ancienne quitte la fenêtre dans `reset` secondes
- **Clé au plafond** — `{ ok: false, scope: "client", limit, retryAfter }`
- **Plafond global atteint** — `{ ok: false, scope: "global", limit, retryAfter }`, regardé en premier

`reset` et `retryAfter` sont des secondes entières, d'au moins 1 et d'au plus la fenêtre arrondie à la seconde, prêtes pour un en-tête `Retry-After` ou `X-RateLimit-Reset`. Aucun message n'est fabriqué : le texte d'un refus appartient à l'appelant.

## Les cas d'usage {#recipes}

- **Une limite par appel** — un troisième argument remplace le plafond de la clé pour cet appel, par exemple pour un forfait par jeton : `limiter.check(ip, Date.now(), plan.perWindow)`
- **Avec `node:http`** — l'adresse de la connexion désigne le client, un refus répond `429` avec `Retry-After`, et un succès pose `X-RateLimit-Limit` et `X-RateLimit-Remaining`
- **Avec un gestionnaire `fetch`** — derrière un proxy qui réécrit un en-tête avec l'adresse du client, le même contrôle renvoie une `Response` de statut `429`
- **Plusieurs limiteurs** — un limiteur n'a qu'une fenêtre, donc une limite de rafale et une limite horaire sont deux limiteurs vérifiés l'un après l'autre, et une requête ne compte dans un limiteur que s'il la laisse passer
- **Un test sans minuteur** — l'horloge est un nombre qu'on donne : `check("a", 0)` passe, `check("a", 999)` est refusé avec `retryAfter` à 1, et `check("a", 1000)` repasse, car la première requête a une fenêtre entière

```js
const burst = createLimiter({ window: 10_000, client: 20 });
const hourly = createLimiter({ window: 3_600_000, client: 1000 });

const now = Date.now();
const decision = burst.check(ip, now);
const answer = decision.ok ? hourly.check(ip, now) : decision;
```

## Comment ça marche {#how}

Une clé est comptée sur une **fenêtre glissante** : une requête reste comptée tant qu'elle n'a pas `window` millisecondes. Avec `window: 10_000` et `client: 3`, des requêtes à 0, 2000 et 4000 remplissent le plafond, une requête à 5000 est refusée avec `retryAfter: 5`, et une requête à 10 000 passe car la première est sortie.

Le plafond global se compte au contraire sur une **fenêtre fixe** : elle s'ouvre à la première vérification, puis de nouveau à la première vérification qui suit sa fin, et toute requête qui passe y est comptée.
Les clés inactives sont balayées par les vérifications elles-mêmes, une fois par fenêtre, si bien qu'aucun minuteur ne tourne.

## Garanties {#guarantees}

- **Valeurs vérifiées** — chaque valeur est un entier d'au moins 1, sinon une `RangeError` est levée, comme pour un `now` qui n'est pas fini ou une `limit` invalide
- **Toute chaîne est une clé** — `__proto__` compris
- **Un refus ne coûte rien** — ni à sa clé, ni au plafond global
- **Une limite abaissée** — une requête qui passe avec une `limit` plus basse que le contenu de la fenêtre reçoit un `retryAfter` qui attend que assez de requêtes sortent
- **Mémoire bornée par le plafond** — une clé garde une heure par requête de la fenêtre, donc un plafond de 100 retient au plus 100 heures par clé ; sans plafond global, le nombre de clés d'une fenêtre n'est borné que par ce que l'appelant envoie

## Stack technique {#tech}

Le paquet est écrit en **TypeScript** et publié en **ESM** seulement, avec ses types, pour **Node.js** 22.12 ou plus ou tout moteur qui exécute des modules ES2022. Il n'a aucune dépendance à l'exécution et ne déclare aucun effet de bord.
Les tests tournent avec le lanceur intégré de Node (`node --test`), et le projet est contrôlé par ESLint et Prettier. L'intégration continue vérifie le code à chaque poussée, et chaque release GitHub publie le paquet sur npm en contrôlant que le tag correspond à la version du `package.json`.
Le projet est publié sous licence **BSD-3-Clause**.
