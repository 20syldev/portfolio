---
name: WrkIT
description: Bot Discord de la classe de BTS SIO.
longDescription: "Bot Discord pour le serveur BTS SIO, hébergé 24h/7j. Gestion du planning, des événements et des embeds avec un statut dynamique. Développé en TypeScript avec Discord.js."
tags: ["Node.js", "Discord.js", "TypeScript"]
github: "https://github.com/20syldev/WrkIT"
demo: "https://wrkit.sylvain.sh"
npm: "https://npmjs.com/wrkit"
---

## À propos {#about}

WrkIT est un bot pour améliorer l'expérience sur le serveur Discord du BTS SIO.
Il offre quelques fonctionnalités utiles permettant d'automatiser certaines tâches et simplifier la gestion.

Le bot est **privé** : il ne peut pas être invité sur d'autres serveurs, mais le code source est disponible sur GitHub pour s'en inspirer.

## Fonctionnalités {#features}

WrkIT est un bot Discord hébergé 24h/7j qui permet de gérer plusieurs fonctionnalités utiles pour le serveur du BTS SIO.

**Commandes disponibles :**

- `/planning` : affiche l'emploi du temps de la semaine et les cours en cours/à venir
- `/embed` : création et personnalisation d'embeds, envoyés dans le salon de votre choix
- `/clear` : suppression de messages en masse ou jusqu'à un message spécifique
- `/event-add` : création d'événements serveur personnalisables
- `/event-edit` : modification d'événements existants
- `/event-delete` : suppression d'événements

Le bot affiche aussi un **statut dynamique** avec les informations du serveur en temps réel.

## Création {#creation}

WrkIT a été créé pour automatiser certaines tâches sur le serveur Discord du BTS SIO.
Il a été conçu pour être modulable, permettant ainsi d'ajouter de nouvelles fonctionnalités facilement.

Le bot est développé en **TypeScript** et utilise la bibliothèque **Discord.js** pour communiquer avec l'API de Discord.
Il utilise aussi mon **API personnelle** pour récupérer les données de l'emploi du temps.
Il est hébergé sur un serveur dédié pour garantir une disponibilité constante.

```bash
npm run dev    # Lancer en mode développement (tsx --watch)
npm run build  # Compiler le TypeScript
npm start      # Lancer en production (dist/)
```