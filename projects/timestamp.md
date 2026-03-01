---
order: 11
name: Timestamp
description: Convertisseur de timestamps pour Discord.
longDescription: "Générateur de timestamps Discord dynamiques supportant les 7 formats officiels. Les timestamps s'adaptent automatiquement au fuseau horaire de chaque utilisateur."
tags: ["HTML", "CSS", "JS"]
github: "https://github.com/20syldev/timestamp"
demo: "https://timestamp.sylvain.sh"
---

## À propos {#about}

Une interface qui permet de facilement générer et customiser des timestamps Discord.
Créez des affichages de dates dynamiques pour vos messages Discord !

## Fonctionnalités {#features}

Le Générateur de Timestamp Discord est hébergé sur [timestamp.sylvain.sh](https://timestamp.sylvain.sh) et permet de créer facilement des timestamps Discord dynamiques.
Cette application web légère vous aide à générer des timestamps qui s'adaptent automatiquement au fuseau horaire de chaque utilisateur Discord.

L'interface intuitive vous permet de sélectionner une date et une heure, puis de choisir parmi différents formats d'affichage.
Il suffit ensuite de copier le code généré et de le coller dans votre message Discord pour un affichage automatique et personnalisé.

## Qu'est-ce qu'un timestamp Discord ? {#what}

Les timestamps Discord sont des codes spéciaux utilisant la syntaxe `<t:timestamp:format>` qui permettent d'afficher des dates et heures qui s'adaptent automatiquement au fuseau horaire local de chaque utilisateur.
Par exemple, un timestamp affiche "31 décembre 2021 à 18:00" pour un utilisateur français apparaîtra comme "December 31, 2021 at 12:00 PM" pour un utilisateur américain.

## Formats disponibles {#formats}

L'outil prend en charge tous les formats de timestamp Discord officiels :

- **Heure courte (t)** : 16:20
- **Heure longue (T)** : 16:20:30
- **Date courte (d)** : 20/04/2021
- **Date longue (D)** : 20 avril 2021
- **Date et heure courtes (f)** : 20 avril 2021 à 16:20
- **Date et heure longues (F)** : mardi 20 avril 2021 à 16:20
- **Temps relatif (R)** : il y a 2 mois / dans 3 heures

## Comment l'utiliser ? {#usage}

L'utilisation du générateur est simple et rapide :

1. Sélectionnez une **date** et une **heure** via les champs de saisie
2. Choisissez le **format** d'affichage souhaité parmi les 7 disponibles
3. Le code timestamp est généré automatiquement, par exemple `<t:1619000000:R>`
4. **Copiez** le code et collez-le directement dans votre message Discord

Le timestamp s'adaptera alors automatiquement au fuseau horaire de chaque personne qui le verra dans Discord.

## Pourquoi utiliser des timestamps ? {#why}

Les timestamps sont particulièrement utiles pour :

- **Organiser des événements** : chaque membre voit l'heure dans son propre fuseau
- **Fixer des deadlines** : affichage clair avec compte à rebours relatif
- **Communiquer à l'international** : plus besoin de préciser "heure de Paris" ou "EST"