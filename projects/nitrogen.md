---
order: 24
name: NitroGen
description: Bot Discord de génération de code Nitro aléatoires.
longDescription: "Bot Discord générant des codes Nitro aléatoires avec un système de rôles par tiers et détection de statut VIP. Développé avec Discord.js."
tags: ["Discord.js"]
github: "https://github.com/20syldev/NitroGen"
archived: true
---

## À propos {#about}

NitroGen est un bot Discord qui génère des codes Nitro aléatoires grâce à une suite de caractères aléatoires.
Le bot fonctionne avec un système de chance pour obtenir des codes Nitro gratuits.
Les codes générés suivent le format officiel Discord Nitro avec une suite de caractères alphanumériques aléatoires.

## Fonctionnalités {#features}

Le bot inclut un système de rôles avec différents niveaux de cooldown :

- **Tier 1** : 60 secondes d'intervalle entre les générations
- **Tier 2** : 30 secondes d'intervalle entre les générations
- **Tier 3** : 10 secondes d'intervalle entre les générations

Le bot détecte aussi les statuts Discord personnalisés et peut attribuer un rôle VIP aux utilisateurs ayant un statut spécifique.

## Technique {#tech}

Le bot est développé en JavaScript avec la bibliothèque **Discord.js** pour interagir avec l'API Discord.
Pour tester le bot en local, il suffit d'exécuter `npm run build` après avoir configuré le token Discord.