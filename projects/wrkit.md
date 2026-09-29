---
name: WrkIT
description: Bot Discord de travail générique, en cours de refonte.
longDescription: "Bot Discord de travail générique, hébergé 24h/7j et en cours de refonte. Création d'embeds, gestion des événements et des messages, avec un statut dynamique. Développé en TypeScript avec Discord.js."
tags: ["Node.js", "Discord.js", "TypeScript"]
github: "https://github.com/20syldev/WrkIT"
demo: "https://wrkit.sylvain.sh"
npm: "https://npmjs.com/wrkit"
---

## À propos {#about}

WrkIT est un bot Discord pensé pour le travail : il automatise les tâches récurrentes d'un serveur et simplifie sa gestion au quotidien.
Il est actuellement **en cours de refonte** pour devenir un bot générique, et de nouvelles fonctionnalités arriveront au fil des versions.

Pour l'instant, le bot est **privé** : il ne peut pas être invité sur d'autres serveurs, mais le code source est disponible sur GitHub pour s'en inspirer.

## Fonctionnalités {#features}

WrkIT est un bot Discord hébergé 24h/7j qui regroupe plusieurs commandes utiles pour gérer un serveur.

**Commandes disponibles :**

- `/embed` : création et personnalisation d'embeds, envoyés dans le salon de votre choix
- `/clear` : suppression de messages en masse ou jusqu'à un message spécifique
- `/event-add` : création d'événements serveur personnalisables
- `/event-edit` : modification d'événements existants
- `/event-delete` : suppression d'événements

Le bot affiche aussi un **statut dynamique** avec les informations du serveur en temps réel.

## Création {#creation}

WrkIT a été créé pour automatiser les tâches répétitives d'un serveur Discord.
Il a été conçu pour être modulable, ce qui permet d'ajouter facilement de nouvelles commandes : c'est sur cette base que s'appuie la refonte.

Le bot est développé en **TypeScript** et utilise la bibliothèque **Discord.js** pour communiquer avec l'API de Discord.
Il est hébergé sur un serveur dédié pour garantir une disponibilité constante.

```bash
npm run dev    # Lancer en mode développement (tsx --watch)
npm run build  # Compiler le TypeScript
npm start      # Lancer en production (dist/)
```