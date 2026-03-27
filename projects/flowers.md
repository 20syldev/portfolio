---
name: Flowers
description: Visualiseur de données en temps réel pour toute API JSON.
longDescription: "Visualiseur de données en temps réel développé avec Next.js 16, Tailwind CSS 4 et Radix UI. Détection automatique des types de données, filtrage avancé, presets, comparaison côte à côte et le tout sans serveur."
tags: ["Next.js", "Radix UI", "Tailwind CSS", "TS"]
github: "https://github.com/20syldev/flowers"
demo: "https://flowers.sylvain.sh"
---

## À propos {#about}

Flowers est un visualiseur de données en temps réel pour toute API JSON.
Entièrement réécrit en Next.js pour la v1.0.0, il est disponible sur [flowers.sylvain.sh](https://flowers.sylvain.sh) sans nécessiter de compte.
Toutes les données sont stockées localement dans votre navigateur.

## Fonctionnalités {#features}

Flowers est conçu pour être flexible et adaptable à vos besoins.

**Capacités principales :**

- **Détection automatique** des types de champs (status, méthode HTTP, URL, timestamp, durée, etc.)
- **Filtrage avancé** par codes de status, méthodes HTTP et recherche textuelle libre
- **Presets** : sauvegardez et rechargez vos configurations d'APIs
- **Temps réel** : polling automatique avec intervalle configurable
- **Comparaison** côte à côte de deux entrées pour visualiser les différences
- **Import/Export** de vos données pour les partager ou les sauvegarder
- **Internationalisation** : interface disponible en français et en anglais
- **Stockage local** : aucune donnée n'est envoyée à un serveur externe

**Technologies utilisées :** TypeScript, Lucide Icons, Lenis (smooth scroll), next-themes, TanStack Virtual.

## Comment l'utiliser ? {#usage}

L'utilisation est simple et ne nécessite aucune inscription :

1. Accédez à [flowers.sylvain.sh](https://flowers.sylvain.sh)
2. Ajoutez l'URL d'une API renvoyant du JSON
3. Flowers détecte automatiquement les types de données et génère l'affichage
4. Filtrez, comparez et exportez vos données selon vos besoins

Vous pouvez connecter plusieurs APIs simultanément et sauvegarder vos configurations en tant que presets.