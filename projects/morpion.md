---
order: 17
name: Morpion
description: "Un jeu de Morpion en ligne, ou contre l'ordinateur."
longDescription: "Jeu du morpion multijoueur en ligne, en local ou contre une IA avec 3 niveaux de difficulté. Les parties en ligne sont stockées via l'API pendant 1 heure."
tags: ["HTML", "CSS", "JS"]
github: "https://github.com/20syldev/morpion"
demo: "https://morpion.sylvain.sh"
---

## À propos {#about}

Sur ce site, vous pouvez jouer au jeu du morpion en ligne contre un autre joueur ou face à une IA.
Vous pouvez rejoindre une partie ou en héberger une pour jouer en ligne !

## Fonctionnalités {#features}

Le jeu propose **trois modes** différents :

- **Mode en ligne** : utilise mon API pour stocker les parties pendant 1 heure, permettant des sessions rapides avec un ami
- **Mode solo** : trois niveaux de difficulté disponibles pour jouer contre l'IA
- **Mode multijoueur local** : pour jouer à plusieurs sur le même appareil

Un code est généré pour chaque partie en ligne, que vous pouvez partager pour jouer avec un ami.
Vous pouvez entrer un nom d'utilisateur ou devenir spectateur d'une partie en cours.

## Un design moderne {#design}

Le site propose un mode clair et sombre, que vous pouvez choisir manuellement ou activer automatiquement en fonction des préférences de votre appareil.
Des animations ont été intégrées pour rendre l'expérience plus dynamique et agréable.
Il est dans mon style, avec la réutilisation de certains de mes scripts.

## Une rapidité de jeu {#speed}

Le site est optimisé pour une rapidité de jeu maximale, vous pouvez donc jouer rapidement et sans latence.
Les parties en ligne sont gérées en temps réel via mon [API](https://api.sylvain.sh) sur l'endpoint `/latest`, qui stocke les données de chaque partie pendant 1 heure.

## Comment jouer en ligne ? {#online}

Pour lancer une partie en ligne :

1. Cliquez sur **Mode en ligne** et choisissez un nom d'utilisateur
2. Un **code de partie** unique est généré automatiquement
3. Partagez ce code avec votre adversaire pour qu'il puisse rejoindre
4. Vous pouvez également rejoindre une partie existante en entrant son code
5. Les spectateurs peuvent aussi observer une partie en cours sans y participer

## L'IA en mode solo {#ai}

Le mode solo propose **trois niveaux de difficulté** pour jouer contre l'ordinateur :

- **Facile** : l'IA joue de manière aléatoire
- **Moyen** : l'IA bloque vos coups gagnants
- **Difficile** : l'IA utilise une stratégie optimale, quasiment imbattable