---
title: Workflow quotidien
description: Les commandes Git du quotidien, la gestion des dépôts distants (GitHub), et le fichier .gitignore.
category: git
slug: workflow
order: 3
---

## Commandes essentielles {#essentials}

### Créer un dépôt

```bash
# Initialiser un nouveau dépôt dans le dossier courant
git init

# Initialiser dans un nouveau dossier
git init mon-projet
cd mon-projet

# Cloner un dépôt existant
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git nom-local   # avec un nom différent
```

### Cycle de travail quotidien

```bash
# 1. Vérifier l'état des fichiers
git status

# 2. Voir les modifications non stagées (dans le working directory)
git diff

# 3. Voir les modifications stagées (prêtes à être commitées)
git diff --staged

# 4. Ajouter des fichiers à la staging area
git add fichier.txt
git add src/
git add .                  # Tout ajouter (attention aux fichiers sensibles)

# 5. Commiter les changements
git commit -m "FEATURE/MINOR: auth: Add login form"

# 6. Voir l'historique
git log
git log --oneline
git log --oneline --graph --all
```

> **Astuce** : Consultez le [Guide du style de commit](/help/git/commit) pour adopter une convention de nommage structurée.

### Tableau récapitulatif des commandes de base

| Commande     | Description               | Exemple                   |
| ------------ | ------------------------- | ------------------------- |
| `git init`   | Créer un nouveau dépôt    | `git init mon-projet`     |
| `git clone`  | Copier un dépôt distant   | `git clone url`           |
| `git status` | État des fichiers         | `git status`              |
| `git add`    | Ajouter à la staging area | `git add fichier.txt`     |
| `git commit` | Enregistrer un snapshot   | `git commit -m "message"` |
| `git diff`   | Voir les différences      | `git diff --staged`       |
| `git log`    | Consulter l'historique    | `git log --oneline`       |
| `git show`   | Détails d'un commit       | `git show abc1234`        |

## Dépôts distants {#remotes}

Un dépôt distant (remote) est une version du projet hébergée sur un serveur (GitHub, GitLab, Bitbucket, etc.). GitHub permet par exemple d'[héberger gratuitement un site statique](/help/github/pages) directement depuis votre dépôt avec GitHub Pages.

### Protocoles d'accès

Git supporte plusieurs protocoles pour communiquer avec un dépôt distant :

| Protocole      | URL                                      | Usage                                                      |
| -------------- | ---------------------------------------- | ---------------------------------------------------------- |
| **HTTPS**      | `https://github.com/user/repo.git`       | Accès simple, authentification par token                   |
| **SSH**        | `git@github.com:user/repo.git`           | Authentification par clé, recommandé pour le développement |
| **ssh://**     | `ssh://git@github.com/user/repo.git`     | Forme explicite du protocole SSH                           |
| **git+ssh://** | `git+ssh://git@github.com/user/repo.git` | Alias de `ssh://`, parfois utilisé dans les scripts        |
| **Git**        | `git://github.com/user/repo.git`         | Lecture seule, non authentifié, non chiffré                |
| **Local**      | `/chemin/vers/repo.git`                  | Dépôt sur le même système de fichiers                      |

> **Conseil** : Privilégiez **SSH** pour vos projets personnels (pas de token à gérer) et **HTTPS** pour les environnements CI/CD ou quand SSH n'est pas disponible.

### Configurer l'accès SSH

```bash
# Générer une clé SSH (si vous n'en avez pas)
ssh-keygen -t ed25519 -C "votre@email.com"

# Démarrer l'agent SSH et ajouter la clé
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Tester la connexion
ssh -T git@github.com
```

Ajoutez ensuite la clé publique (`~/.ssh/id_ed25519.pub`) dans les paramètres SSH de votre plateforme (GitHub, GitLab, etc.).

### Changer de protocole sur un remote existant

```bash
# Passer de HTTPS à SSH
git remote set-url origin git@github.com:user/repo.git

# Passer de SSH à HTTPS
git remote set-url origin https://github.com/user/repo.git

# Utiliser la forme explicite ssh://
git remote set-url origin ssh://git@github.com/user/repo.git
```

### Gérer les remotes

```bash
# Lister les remotes configurés
git remote -v

# Ajouter un remote (HTTPS)
git remote add origin https://github.com/user/repo.git

# Ajouter un remote (SSH)
git remote add origin git@github.com:user/repo.git

# Renommer un remote
git remote rename origin upstream

# Supprimer un remote
git remote remove upstream

# Voir les détails d'un remote
git remote show origin
```

### Synchroniser avec le distant

```bash
# Récupérer les modifications sans les intégrer
git fetch origin

# Récupérer et intégrer les modifications
git pull origin main

# Envoyer les modifications locales
git push origin main

# Pousser une nouvelle branche et la tracker
git push -u origin feature/login

# Supprimer une branche distante
git push origin --delete feature/login
```

### Pull vs Fetch

| Action                | `git fetch`               | `git pull`            |
| --------------------- | ------------------------- | --------------------- |
| **Télécharge**        | Oui                       | Oui                   |
| **Intègre**           | Non                       | Oui (merge ou rebase) |
| **Risque de conflit** | Non                       | Oui                   |
| **Usage recommandé**  | Vérifier avant d'intégrer | Intégration rapide    |

> **Conseil** : Privilégiez `git fetch` suivi d'un `git merge` ou `git rebase` pour garder le contrôle sur l'intégration des changements.

```bash
# Approche recommandée
git fetch origin
git log --oneline origin/main..main    # Voir les différences
git merge origin/main                  # Intégrer si tout va bien
```

## Le fichier .gitignore {#gitignore}

Le fichier `.gitignore` indique à Git les fichiers et dossiers à ne **pas** suivre. Il se place à la racine du projet.

### Syntaxe des patterns

| Pattern          | Description                                         | Exemple                      |
| ---------------- | --------------------------------------------------- | ---------------------------- |
| `fichier.txt`    | Fichier spécifique                                  | `secret.env`                 |
| `*.log`          | Tous les fichiers `.log`                            | `error.log`, `debug.log`     |
| `dossier/`       | Un dossier entier                                   | `node_modules/`, `dist/`     |
| `**/logs`        | Dossier `logs` à tout niveau                        | `src/logs/`, `app/logs/`     |
| `!important.log` | Exception (ne pas ignorer)                          | Garder un fichier spécifique |
| `doc/*.txt`      | Fichiers `.txt` dans `doc/` (pas les sous-dossiers) | `doc/notes.txt`              |
| `doc/**/*.txt`   | Fichiers `.txt` dans `doc/` et ses sous-dossiers    | `doc/a/b/notes.txt`          |

### Exemple de .gitignore courant

```gitignore
# Dépendances
node_modules/
vendor/
.venv/

# Build et output
dist/
build/
out/
.next/

# Environnement et secrets
.env
.env.local
.env*.local

# IDE et éditeurs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Cache
.cache/
.turbo/
```

### .gitignore global

Pour ignorer des fichiers spécifiques à votre environnement sur tous vos projets :

```bash
# Créer un gitignore global
git config --global core.excludesFile ~/.gitignore_global
```

```gitignore
# ~/.gitignore_global
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
```

### Fichier déjà tracké

Si un fichier est déjà tracké par Git, l'ajouter au `.gitignore` ne suffira pas. Il faut d'abord le retirer du suivi :

```bash
# Retirer du suivi sans supprimer le fichier
git rm --cached fichier.txt

# Retirer un dossier entier du suivi
git rm -r --cached dossier/

# Puis commiter
git commit -m "CLEANUP/MINOR: config: Remove tracked files now in .gitignore"
```

## Pour aller plus loin {#next}

- [Branches et fusion](/help/git/branches) — travailler sur plusieurs fonctionnalités en parallèle
- [Corriger des erreurs](/help/git/corrections) — stash, annulation de commits, tags
- [Commandes avancées](/help/git/advanced) — cherry-pick, bisect, alias et workflows d'équipe