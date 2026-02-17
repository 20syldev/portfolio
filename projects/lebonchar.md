---
order: 5
name: LeBonChar
description: "Mon site web de vente de véhicules d'occasion."
longDescription: "Plateforme de vente de véhicules d'occasion inspirée de LeBonCoin, développée en PHP/MySQL avec architecture MVC. Projet de BTS SIO avec Docker."
tags: ["Docker", "PHP", "MySQL", "HTML", "CSS", "JS"]
github: "https://github.com/20syldev/LeBonChar"
demo: "https://lebonchar.site"
---

## À propos {#about}

LeBonChar est un site web que j'ai créé en vue de mon projet MVC, qui sera à présenter lors de mon examen de BTS SIO.
Il s'agit d'une plateforme de vente de véhicules d'occasion, inspirée du célèbre site LeBonCoin.

## Fonctionnalités {#features}

LeBonChar est un site web qui a été créé en utilisant PHP, MySQL, HTML, CSS et JavaScript.
Il est disponible sur toutes les plateformes et est entièrement responsive, offrant une expérience utilisateur optimale sur mobile et desktop.

## Un projet MVC ? {#mvc}

Oui, LeBonChar est un projet basé sur le modèle MVC (Modèle-Vue-Contrôleur).
Cela signifie que la logique de l'application est séparée de la présentation, ce qui facilite la maintenance et l'évolution du code.

## Pourquoi ce projet ? {#why}

J'ai créé LeBonChar dans le cadre de mon projet de fin d'études pour mon BTS SIO.
L'objectif était de démontrer mes compétences en développement web et de créer une application fonctionnelle et esthétique.

## Comment l'utiliser ? {#usage}

Pour utiliser LeBonChar, il vous suffit de vous rendre sur la page d'accueil et de naviguer à travers les différentes sections.
Vous pouvez consulter les annonces de véhicules, créer un compte pour publier vos propres annonces, et le personnaliser selon vos préférences.

## Technologies utilisées {#stack}

LeBonChar est un site web qui a été créé en utilisant PHP, MySQL, HTML, CSS et JavaScript.
Une documentation simple est disponible sur la page [GitHub](https://github.com/20syldev/LeBonChar) du projet.
Pour voir un aperçu du site, vous pouvez consulter le [site web](https://lebonchar.site) directement !

## Installation locale {#install}

Pour lancer le projet en local, il faut avoir **PHP** et **MySQL** installés. Les étapes sont les suivantes :

1. Créer la base de données `lebonchar` et importer le schéma SQL fourni
2. Configurer le fichier `.env` avec les variables `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` et `DB_PORT`
3. Lancer le serveur avec `php -S 0.0.0.0:8000 -t public`