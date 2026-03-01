---
order: 12
name: Planning
description: Interface de planning HyperPlanning.
longDescription: Interface personnalisée pour consulter les emplois du temps HyperPlanning. Navigation fluide jour/semaine avec sauvegarde des préférences.
tags: ["HTML", "CSS", "JS"]
github: "https://github.com/20syldev/planning"
demo: "https://planning.sylvain.sh"
---

## À propos {#about}

Cette interface web est un planning pour les SLAM et SISR de Ensitech.
Elle est disponible sur [planning.sylvain.sh](https://planning.sylvain.sh).

## Fonctionnalités {#features}

J'ai conçu cette interface dans le but de simplifier la consultation des emplois du temps pour les étudiants.
Le planning récupère les données directement depuis HyperPlanning et les affiche de manière claire et organisée.
L'interface se veut moderne et intuitive, permettant de naviguer facilement entre les jours et les semaines.

- **Navigation fluide** entre les jours via le swipe sur mobile ou le scroll et les flèches sur PC
- **Vue par semaine** pour afficher les cours groupés sur une semaine complète
- **Indicateur en temps réel** qui met en évidence le cours actuel
- **Détection automatique** de la pause déjeuner
- **Détails des cours** en mode déroulant (professeur, salle, classes, notes)
- **Sauvegarde locale** de vos préférences de spécialité et de vue
- **Rafraîchissement automatique** toutes les 5 minutes
- **Optimisé** pour mobile et PC

## Configuration {#config}

Le planning est configuré via un fichier `config.json` qui contient les URLs des flux ICS HyperPlanning pour chaque spécialité (SLAM et SISR).
Cette approche permet de mettre à jour facilement les sources de données sans modifier le code de l'application.