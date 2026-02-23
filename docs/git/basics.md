---
title: Bases de Git
description: Introduction à Git, installation, configuration et concepts fondamentaux — commits, HEAD, et les trois zones.
category: git
slug: basics
order: 2
---

## Introduction {#intro}

Git est un **système de contrôle de version distribué** (DVCS) créé en 2005 par Linus Torvalds pour le développement du noyau Linux. Il permet de suivre l'historique des modifications d'un projet, de collaborer efficacement et de revenir à n'importe quel état antérieur du code.

> **Nouveau sur Git ?** Commence par le [guide débutant](/help/git/start) qui explique les concepts avec des analogies simples avant de plonger dans les détails techniques de cette page.

### Pourquoi utiliser Git ?

- **Historique complet** : Chaque modification est enregistrée avec son auteur, sa date et son contexte
- **Travail parallèle** : Les branches permettent de développer plusieurs fonctionnalités simultanément
- **Collaboration** : Plusieurs développeurs peuvent travailler sur le même projet sans se gêner
- **Sécurité** : Chaque copie du dépôt est un backup complet du projet
- **Performance** : Les opérations locales sont quasi instantanées

### Distribué vs centralisé

| Aspect        | Centralisé (SVN)                       | Distribué (Git)                         |
| ------------- | -------------------------------------- | --------------------------------------- |
| **Dépôt**     | Un seul serveur central                | Chaque développeur a une copie complète |
| **Connexion** | Requise pour la plupart des opérations | Requise uniquement pour push/pull       |
| **Vitesse**   | Dépend du réseau                       | Opérations locales rapides              |
| **Backup**    | Point de défaillance unique            | Chaque clone est un backup              |
| **Branches**  | Lourdes et coûteuses                   | Légères et rapides                      |

## Installation et configuration {#install}

### Installation

```bash
# Linux (Debian/Ubuntu)
sudo apt install git

# Linux (Fedora)
sudo dnf install git

# macOS (avec Homebrew)
brew install git

# Windows : télécharger depuis https://git-scm.com/install
# Ou avec winget
winget install Git.Git
```

Vérifiez l'installation :

```bash
git --version
```

### Configuration initiale

Git utilise trois niveaux de configuration, du plus global au plus spécifique :

| Niveau     | Fichier          | Portée                              |
| ---------- | ---------------- | ----------------------------------- |
| `--system` | `/etc/gitconfig` | Tous les utilisateurs de la machine |
| `--global` | `~/.gitconfig`   | Tous les projets de l'utilisateur   |
| `--local`  | `.git/config`    | Le projet courant uniquement        |

> **Note** : Le niveau le plus spécifique l'emporte toujours.

```bash
# Identité (obligatoire)
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"

# Éditeur par défaut
git config --global core.editor "code --wait"

# Branche par défaut pour les nouveaux dépôts
git config --global init.defaultBranch main

# Gestion des fins de ligne
git config --global core.autocrlf input    # macOS/Linux
git config --global core.autocrlf true     # Windows

# Activer les couleurs
git config --global color.ui auto
```

Pour vérifier votre configuration :

```bash
git config --list
git config user.name
```

## Concepts fondamentaux {#concepts}

### Les trois zones de Git

Git organise les fichiers dans trois zones principales :

```
    Working Directory         Staging Area         Repository
 (Répertoire de travail)  (Zone de préparation)   (Dépôt .git/)
            |                       |                   |
            |        git add        |                   |
            |---------------------->|                   |
            |                       |    git commit     |
            |                       |------------------>|
            |                       |                   |
            |      git restore      |                   |
            |<----------------------|                   |
            |                                           |
            |      git restore --staged                 |
            |<------------------------------------------|
```

| Zone                     | Description                                        | Commandes associées               |
| ------------------------ | -------------------------------------------------- | --------------------------------- |
| **Working Directory**    | Les fichiers tels que vous les voyez sur le disque | `git status`, `git diff`          |
| **Staging Area (Index)** | Les modifications prêtes à être commitées          | `git add`, `git restore --staged` |
| **Repository**           | L'historique complet des commits                   | `git commit`, `git log`           |

**Pourquoi une zone intermédiaire (staging area) ?**

Elle te permet de choisir précisément quels changements inclure dans un commit. Par exemple, si tu as modifié 5 fichiers mais que seuls 2 sont liés à la même tâche, tu peux commiter uniquement ces 2 fichiers avec `git add`.

### Commits et SHA-1

Chaque commit est identifié par un **hash SHA-1** unique de 40 caractères (ex : `a1b2c3d4e5f6...`). En pratique, les 7 premiers caractères suffisent pour identifier un commit.

Un commit contient :

- Un **snapshot** de tous les fichiers du projet
- Une référence vers le ou les **commits parents**
- L'**auteur** et le **committer** (avec date)
- Un **message** décrivant le changement

```
commit a3f8c21
├── tree  (snapshot de tous les fichiers)
├── parent  a1b2c3d  (commit précédent)
├── author  "Ton Nom <email>" + date
└── message "MINOR: app: Add index page"
```

### HEAD et références

- **HEAD** : Pointeur vers le commit courant (généralement la branche active)
- **Branche** : Pointeur mobile vers un commit, qui avance automatiquement à chaque commit
- **Tag** : Pointeur fixe vers un commit spécifique (souvent une version de release)

```
main:  A --- B --- C --- D
                         ▲
                        HEAD  (tu es ici)
```

Quand tu fais un commit, `HEAD` et la branche avancent tous les deux vers le nouveau commit.

```bash
# Voir où pointe HEAD
git log --oneline -1

# Voir toutes les références
git show-ref
```

## Pour aller plus loin {#next}

- [Workflow quotidien](/help/git/workflow) — les commandes du quotidien, dépôts distants et `.gitignore`
- [Branches et fusion](/help/git/branches) — travailler sur plusieurs fonctionnalités en parallèle
- [Corriger des erreurs](/help/git/corrections) — stash, annulation de commits, tags
- [Commandes avancées](/help/git/advanced) — cherry-pick, bisect, alias et workflows d'équipe