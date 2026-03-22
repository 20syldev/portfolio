---
name: StadiumCompany
description: "Application de gestion de questionnaires en double plateforme."
longDescription: "Application complète de gestion de questionnaires développée en C# (Avalonia UI) et PHP (Laravel), partageant une base PostgreSQL. Projet réalisé dans le cadre du PPE BTS SIO SLAM."
tags: ["C#", "PHP", "PostgreSQL", "Avalonia", "Laravel"]
github: "https://github.com/20syldev/stadiumcompany"
---

## À propos {#about}

StadiumCompany est mon Projet Personnel Encadré (PPE) réalisé dans le cadre du BTS SIO option SLAM en 2ème année.
Il s'agit d'une application de gestion de questionnaires d'évaluation développée en double plateforme : une application desktop en C# et une interface web en Laravel, partageant la même base de données PostgreSQL.

La gestion de questionnaires dans un contexte pédagogique ou évaluatif repose souvent sur des outils en ligne peu adaptés à un usage hors-connexion ou à une personnalisation avancée.
Le besoin identifié était de disposer d'une application cross-platform permettant de créer, administrer et passer des questionnaires, avec persistance des données et accessibilité depuis un navigateur comme depuis un poste de travail.

Le projet a été conduit en autonomie selon une approche itérative inspirée de la méthode Agile, de décembre 2025 à mars 2026.

## Fonctionnalités {#features}

L'application couvre l'ensemble du cycle de vie d'un questionnaire, de sa création jusqu'au passage et à l'analyse des résultats.

**Principales fonctionnalités :**

- **Authentification** : inscription et connexion sur les deux plateformes
- **Gestion CRUD** : création, modification et suppression de questionnaires, questions et réponses
- **Types de questions** : vrai/faux ou choix multiples avec pondération
- **Publication et fork** : partage et duplication de questionnaires entre utilisateurs
- **Mode joueur** : passage interactif des quiz avec scoring en temps réel
- **Génération PDF** : export des questionnaires au format PDF
- **Thème clair/sombre** : personnalisation de l'interface sur les deux plateformes
- **Internationalisation** : disponible en français et en anglais

## Stack technique {#stack}

Le projet repose sur deux plateformes distinctes partageant la même base de données :

| Composant       | Technologie                         |
| --------------- | ----------------------------------- |
| Base de données | PostgreSQL                          |
| Desktop         | C# / .NET 8.0, Avalonia UI 11       |
| Web             | PHP 8.2, Laravel 12, Tailwind CSS 4 |

## Base de données {#database}

Les deux applications partagent une base de données PostgreSQL commune. Le schéma relationnel relie les entités suivantes :

```
users (0,n)              ────   crée         ────  (1,1) questionnaires
themes (0,n)             ────   catégorise   ────  (1,1) questionnaires
questionnaires (1,1)     ────   contient     ────  (0,n) questions
questions (1,1)          ────   propose      ────  (0,n) answers
users (1,1)              ────   possède      ────  (0,1) user_preferences
users (0,n)              ────   soumet       ────  (1,1) quiz_submissions
questionnaires (0,n)     ────   évalue       ────  (1,1) quiz_submissions
quiz_submissions (1,1)   ────   détaille     ────  (0,n) quiz_answers
users (0,n)              ────   rédige       ────  (1,1) question_feedbacks
questions (0,n)          ────   reçoit       ────  (1,1) question_feedbacks
users (0,n)              ────   génère       ────  (1,1) activity_logs
```

Les scripts SQL de création du schéma (`schema.sql`) et d'insertion des données initiales (`insert.sql`) sont disponibles à la racine du projet.

## Application Desktop {#desktop}

### Présentation

L'application desktop est développée en C# avec Avalonia UI, un framework cross-platform compatible Windows, Linux et macOS.
Elle a été conçue pour offrir une expérience complète de gestion et de passage de questionnaires sans nécessiter de connexion internet, en communiquant directement avec la base PostgreSQL.

### Architecture

Le projet suit une architecture MVC avec une couche d'accès aux données (DAL) basée sur le pattern Repository :

```
desktop/
├── Models/          # Entités (User, Questionnaire, Question, Answer, Theme, UserPreferences, ActivityLog)
├── DAL/             # Repositories + Database.cs
├── Views/           # Vues Avalonia (AXAML)
├── Services/        # LocalizationManager, PdfGenerator, ActivityLogger
└── Resources/       # Fichiers de traduction (fr/en)
```

### Interface utilisateur

L'interface a été conçue from scratch avec Avalonia UI et le pattern MVVM, garantissant une séparation claire entre la logique métier et la présentation.
La navigation s'organise entre les vues principales : liste des questionnaires, création, passage guidé et résultats.
Les formulaires sont dynamiques et s'adaptent au nombre et au type de questions.

### Gestion des questionnaires

Le module de gestion permet le CRUD complet des questionnaires : création avec titre, description et questions (QCM ou vrai/faux), modification et suppression.
Le passage guidé des questionnaires enregistre les réponses en temps réel, avec un calcul automatique du score et affichage du résultat en fin de session.

### Statistiques et historique

L'application affiche les résultats détaillés de chaque session : score obtenu, taux de réussite, et réponses correctes ou incorrectes.
L'historique des sessions est consultable par questionnaire, avec un stockage persistant en base PostgreSQL.

### Technologies détaillées

| Composant      | Version   |
| -------------- | --------- |
| .NET           | 8.0       |
| Avalonia UI    | 11.2.5    |
| FluentAvalonia | 2.4.1     |
| Npgsql         | 8.0.5     |
| BCrypt.Net     | 4.0.3     |
| QuestPDF       | 2025.12.3 |

### Installation Desktop

**Prérequis :** [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) et PostgreSQL configuré (voir [Installation complète](#install)).

1. Configurer la chaîne de connexion PostgreSQL dans `DAL/Database.cs`
2. Restaurer les dépendances et lancer l'application :

```bash
cd desktop
dotnet restore
dotnet run
```

Pour le développement avec hot-reload :

```bash
dotnet watch
```

## Application Web {#web}

### Présentation

L'interface web est construite avec Laravel 12 et Tailwind CSS, offrant un accès distant aux questionnaires depuis n'importe quel navigateur moderne.
Elle complète l'application desktop en fournissant une vue centralisée des résultats et en exposant une API REST consommée par la partie C#.

### Architecture

Le projet suit une architecture MVC avec une couche service pour la logique métier :

```
web/
├── app/
│   ├── Http/
│   │   ├── Controllers/    # Dashboard, Questionnaire, Quiz, Pdf, Theme, UserPreferences
│   │   └── Requests/       # Form Request validation
│   ├── Models/             # Modèles Eloquent
│   ├── Services/           # QuestionnaireService, QuizService, QuizScoringService, ActivityLogService, QuestionFeedbackService
│   ├── Enums/              # Enums de types
│   └── Policies/           # Politiques d'autorisation
├── resources/views/        # Templates Blade
├── routes/                 # web.php, auth.php
└── database/migrations/    # Migrations
```

### Authentification

Le système d'authentification repose sur Laravel Breeze, offrant inscription, connexion et déconnexion.
Les routes sont protégées par middleware, limitant l'accès aux utilisateurs connectés.
Les mots de passe sont hachés avec bcrypt et les formulaires sont protégés contre les attaques CSRF.

### Interface web

L'interface utilise le moteur de templates Blade avec Tailwind CSS et Alpine.js pour l'interactivité côté client.
La navigation sécurisée s'organise entre les pages principales : login, tableau de bord, détail des questionnaires et résultats.
Les formulaires sont validés côté serveur via les Form Requests de Laravel.

### API REST et interopérabilité

L'application expose une API REST sécurisée via Laravel Sanctum (authentification par token).
Les endpoints permettent la lecture et l'écriture des questionnaires et résultats, assurant l'interopérabilité entre la partie web et l'application desktop C#.
La base de données PostgreSQL est partagée entre les deux composantes du projet.

### Statistiques et résultats

Le tableau de bord centralise les résultats de tous les questionnaires : scores, taux de réussite et historique par utilisateur.
Les requêtes sont optimisées via Eloquent ORM pour agréger les données efficacement.

### Technologies détaillées

| Composant      | Version |
| -------------- | ------- |
| PHP            | 8.2+    |
| Laravel        | 12      |
| Tailwind CSS   | 4.1     |
| Alpine.js      | 3.4     |
| Vite           | 7.0     |
| DomPDF         | 3.1     |
| Laravel Breeze | 2.3     |

### Installation Web

**Prérequis :** [PHP 8.2+](https://www.php.net/), [Composer](https://getcomposer.org/), [Node.js](https://nodejs.org/) et PostgreSQL configuré (voir [Installation complète](#install)).

1. Configurer la connexion PostgreSQL dans le fichier `.env` (`DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `DB_PORT`)
2. Lancer l'installation complète (composer install, .env, key:generate, migrations, npm install, npm build) :

```bash
cd web
composer setup
```

Pour démarrer le serveur de développement (Laravel, queue, logs et Vite en parallèle) :

```bash
composer dev
```

Pour lancer les tests :

```bash
composer test
```

## Installation complète {#install}

**Prérequis globaux :**

- [PostgreSQL](https://www.postgresql.org/) installé et démarré
- [Git](https://git-scm.com/) pour cloner le dépôt
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) pour l'application desktop
- [PHP 8.2+](https://www.php.net/), [Composer](https://getcomposer.org/) et [Node.js](https://nodejs.org/) pour l'application web

**1. Cloner le projet :**

```bash
git clone https://github.com/20syldev/stadiumcompany.git
cd stadiumcompany
```

**2. Créer l'utilisateur et la base de données PostgreSQL :**

```sql
CREATE USER stadiumcompany WITH PASSWORD 'stadiumcompany';
CREATE DATABASE stadiumcompany OWNER stadiumcompany;
```

**3. Exécuter les scripts SQL situés à la racine du projet :**

```bash
psql -U stadiumcompany -d stadiumcompany -f schema.sql
psql -U stadiumcompany -d stadiumcompany -f insert.sql
```

**4. Lancer l'application souhaitée :**

- **Desktop** : configurer `DAL/Database.cs`, puis `cd desktop && dotnet restore && dotnet run`
- **Web** : configurer le `.env`, puis `cd web && composer setup && composer dev`

Le détail de chaque installation est disponible dans les sections [Application Desktop](#desktop) et [Application Web](#web).

## Déroulement du projet {#timeline}

Le développement s'est déroulé en quatre phases, de décembre 2025 à mars 2026 :

| Phase              | Période       | Travaux réalisés                                                                                                    |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Conception         | Décembre 2025 | Analyse du besoin, maquettes, architecture technique, modélisation BDD, initialisation Git                          |
| Développement Core | Janvier 2026  | Projet Avalonia + Laravel, connexion PostgreSQL, CRUD questionnaires, module de passage, authentification, API REST |
| Résultats et Stats | Février 2026  | Module de résultats, statistiques, historique, ergonomie, dashboard web, optimisation Eloquent                      |
| Finitions          | Mars 2026     | Tests fonctionnels, correction d'anomalies, optimisation des requêtes, documentation, interopérabilité C# ↔ Laravel |

Le projet a été conduit en autonomie complète selon une approche itérative inspirée de la méthode Agile. Chaque fonctionnalité a été découpée en tâches précises, avec des bilans réguliers permettant d'ajuster les priorités.