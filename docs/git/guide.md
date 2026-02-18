---
title: Guide complet de Git
description: Maîtriser Git de l'installation aux commandes avancées, en passant par les workflows et la résolution de problèmes.
category: git
slug: guide
order: 2
---

## Introduction {#intro}

Git est un **système de contrôle de version distribué** (DVCS) créé en 2005 par Linus Torvalds pour le développement du noyau Linux. Il permet de suivre l'historique des modifications d'un projet, de collaborer efficacement et de revenir à n'importe quel état antérieur du code.

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

# Windows : télécharger depuis https://git-scm.com/downloads
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
 Working Directory    Staging Area     Repository
 (Répertoire de     (Zone de         (Dépôt .git/)
  travail)           préparation)
       |                  |                |
       |   git add        |                |
       |----------------->|                |
       |                  |  git commit    |
       |                  |--------------->|
       |                  |                |
       |            git restore            |
       |<-----------------|                |
       |                                   |
       |         git restore --staged      |
       |<----------------------------------|
```

| Zone                     | Description                                        | Commandes associées               |
| ------------------------ | -------------------------------------------------- | --------------------------------- |
| **Working Directory**    | Les fichiers tels que vous les voyez sur le disque | `git status`, `git diff`          |
| **Staging Area (Index)** | Les modifications prêtes à être commitées          | `git add`, `git restore --staged` |
| **Repository**           | L'historique complet des commits                   | `git commit`, `git log`           |

### Commits et SHA-1

Chaque commit est identifié par un **hash SHA-1** unique de 40 caractères (ex : `a1b2c3d4e5f6...`). En pratique, les 7 premiers caractères suffisent pour identifier un commit.

Un commit contient :

- Un **snapshot** de tous les fichiers du projet
- Une référence vers le ou les **commits parents**
- L'**auteur** et le **committer** (avec date)
- Un **message** décrivant le changement

### HEAD et références

- **HEAD** : Pointeur vers le commit courant (généralement la branche active)
- **Branche** : Pointeur mobile vers un commit, qui avance automatiquement
- **Tag** : Pointeur fixe vers un commit spécifique

```bash
# Voir où pointe HEAD
git log --oneline -1

# Voir toutes les références
git show-ref
```

## Commandes essentielles {#essentials}

### Créer un dépôt

```bash
# Initialiser un nouveau dépôt
git init mon-projet
cd mon-projet

# Cloner un dépôt existant
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git nom-local
```

### Cycle de travail quotidien

```bash
# 1. Vérifier l'état des fichiers
git status

# 2. Voir les modifications non stagées
git diff

# 3. Voir les modifications stagées
git diff --staged

# 4. Ajouter des fichiers à la staging area
git add fichier.txt
git add src/
git add .                  # Tout ajouter (attention)

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

## Les branches {#branches}

Les branches sont l'une des fonctionnalités les plus puissantes de Git. Elles permettent de travailler sur des fonctionnalités isolées sans affecter la branche principale.

### Gérer les branches

```bash
# Lister les branches locales
git branch

# Lister toutes les branches (locales + distantes)
git branch -a

# Créer une nouvelle branche
git branch feature/login

# Créer et basculer sur une nouvelle branche
git switch -c feature/login
# Ancienne syntaxe (fonctionne toujours)
git checkout -b feature/login

# Basculer sur une branche existante
git switch main
git checkout main

# Renommer une branche
git branch -m ancien-nom nouveau-nom

# Supprimer une branche (mergée)
git branch -d feature/login

# Supprimer une branche (non mergée, forcer)
git branch -D feature/login
```

> **Note** : Préférez `git switch` à `git checkout` pour changer de branche. `switch` est plus explicite et évite les confusions avec d'autres usages de `checkout`.

### Visualiser les branches

```bash
# Arbre des branches avec les derniers commits
git log --oneline --graph --all

# Branches mergées dans la branche courante
git branch --merged

# Branches non mergées
git branch --no-merged
```

### Schéma de branches

```
main:      A---B---C-------G---H
                \         /
feature:         D---E---F
```

Dans cet exemple, la branche `feature` a été créée à partir du commit `B`, puis fusionnée dans `main` avec le commit de merge `G`.

## Dépôts distants {#remotes}

Un dépôt distant (remote) est une version du projet hébergée sur un serveur (GitHub, GitLab, Bitbucket, etc.).

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

## Fusion et résolution de conflits {#merge}

### Types de merge

#### Fast-forward

Quand la branche cible n'a pas divergé, Git avance simplement le pointeur :

```
# Avant merge
main:      A---B
                \
feature:         C---D

# Après merge (fast-forward)
main:      A---B---C---D
```

```bash
git switch main
git merge feature/login
```

#### Merge à trois voies (3-way merge)

Quand les deux branches ont divergé, Git crée un commit de merge :

```
# Avant merge
main:      A---B---E
                \
feature:         C---D

# Après merge (3-way)
main:      A---B---E---F
                \     /
feature:         C---D
```

```bash
git switch main
git merge feature/login
```

### Résoudre un conflit

Quand Git ne peut pas fusionner automatiquement, il signale un conflit :

```bash
$ git merge feature/login
Auto-merging src/app.tsx
CONFLICT (content): Merge conflict in src/app.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

**Étapes pour résoudre :**

1. **Identifier les fichiers en conflit** :

```bash
git status
```

2. **Ouvrir le fichier** et chercher les marqueurs de conflit :

```
<<<<<<< HEAD
const title = "Page d'accueil";
=======
const title = "Dashboard";
>>>>>>> feature/login
```

3. **Choisir la version souhaitée** (ou combiner les deux) et supprimer les marqueurs

4. **Marquer le conflit comme résolu** :

```bash
git add src/app.tsx
```

5. **Finaliser le merge** :

```bash
git commit
```

> **Astuce** : Utilisez un outil de merge visuel pour les conflits complexes :
>
> ```bash
> git mergetool
> ```

### Annuler un merge en cours

```bash
# Annuler le merge avant de commiter
git merge --abort
```

## Rebase {#rebase}

Le rebase permet de **réécrire l'historique** en déplaçant une branche sur une nouvelle base.

### Rebase simple

```bash
# Avant rebase
main:      A---B---E
                \
feature:         C---D

# Commande
git switch feature
git rebase main

# Après rebase
main:      A---B---E
                    \
feature:             C'---D'
```

Les commits `C` et `D` sont recréés (nouveaux SHA) par-dessus `E`.

### Rebase interactif

Le rebase interactif permet de modifier, réordonner, fusionner ou supprimer des commits :

```bash
# Modifier les 3 derniers commits
git rebase -i HEAD~3
```

L'éditeur affiche :

```
pick abc1234 Add login form
pick def5678 Fix typo in login
pick ghi9012 Add validation

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the message
# e, edit = use commit, but stop for amending
# s, squash = meld into previous commit
# f, fixup = like squash, but discard this commit's log message
# d, drop = remove commit
```

**Cas d'usage courants :**

- `squash` : Fusionner plusieurs petits commits en un seul
- `reword` : Corriger un message de commit
- `drop` : Supprimer un commit inutile
- `edit` : Modifier le contenu d'un commit

### Rebase vs Merge

| Aspect            | Merge                            | Rebase                               |
| ----------------- | -------------------------------- | ------------------------------------ |
| **Historique**    | Préserve l'historique réel       | Crée un historique linéaire          |
| **Commits**       | Ajoute un commit de merge        | Réécrit les commits existants        |
| **Sécurité**      | Non destructif                   | Réécrit l'historique                 |
| **Lisibilité**    | Branches visibles dans le graphe | Historique linéaire et propre        |
| **Collaboration** | Sûr pour les branches partagées  | Dangereux sur les branches partagées |

> **Attention** : Ne faites **jamais** de rebase sur une branche partagée avec d'autres développeurs. La réécriture d'historique crée des conflits pour tous ceux qui ont basé leur travail sur les anciens commits. C'est la **règle d'or du rebase**.

## Le stash {#stash}

Le stash permet de **mettre de côté temporairement** des modifications en cours pour travailler sur autre chose.

### Commandes de base

```bash
# Sauvegarder les modifications en cours
git stash

# Sauvegarder avec un message descriptif
git stash push -m "WIP: login form validation"

# Inclure les fichiers non-trackés
git stash push -u -m "WIP: new config files"

# Lister les stashs
git stash list
# stash@{0}: On feature/login: WIP: login form validation
# stash@{1}: On main: WIP: refactoring utils

# Restaurer le dernier stash (et le supprimer de la liste)
git stash pop

# Restaurer un stash spécifique (sans le supprimer)
git stash apply stash@{1}

# Voir le contenu d'un stash
git stash show -p stash@{0}

# Supprimer un stash
git stash drop stash@{0}

# Supprimer tous les stashs
git stash clear
```

### Cas d'usage

- **Changement de branche urgent** : Vous travaillez sur une feature, mais un bug critique arrive
- **Pull sans conflits** : Stasher vos modifications avant un pull, puis les réappliquer
- **Expérimentation** : Sauvegarder l'état actuel avant de tester une approche différente

```bash
# Scénario typique : bug urgent pendant une feature
git stash push -m "WIP: feature en cours"
git switch main
# ... corriger le bug, commiter ...
git switch feature/login
git stash pop
```

## Annuler des changements {#undo}

Git offre plusieurs commandes pour revenir en arrière, chacune adaptée à un cas différent.

### Tableau comparatif

| Commande               | Portée               | Modifie l'historique | Usage                                                        |
| ---------------------- | -------------------- | -------------------- | ------------------------------------------------------------ |
| `git restore`          | Working directory    | Non                  | Annuler des modifications non commitées                      |
| `git restore --staged` | Staging area         | Non                  | Désindexer des fichiers                                      |
| `git revert`           | Commit               | Non (nouveau commit) | Annuler un commit publié                                     |
| `git reset --soft`     | HEAD                 | Oui                  | Défaire le dernier commit, garder les changements stagés     |
| `git reset --mixed`    | HEAD + Index         | Oui                  | Défaire le dernier commit, garder les changements non stagés |
| `git reset --hard`     | Tout                 | Oui                  | Supprimer tout, revenir à un état précédent                  |
| `git clean`            | Fichiers non-trackés | Non                  | Supprimer les fichiers non suivis                            |

### Annuler des modifications locales

```bash
# Annuler les modifications d'un fichier (non stagé)
git restore fichier.txt

# Annuler toutes les modifications non stagées
git restore .

# Désindexer un fichier (le retirer de la staging area)
git restore --staged fichier.txt
```

### Annuler un commit

```bash
# Créer un nouveau commit qui annule le commit spécifié
git revert abc1234

# Annuler le dernier commit (garder les changements stagés)
git reset --soft HEAD~1

# Annuler le dernier commit (garder les changements non stagés)
git reset --mixed HEAD~1

# Annuler le dernier commit (supprimer les changements)
git reset --hard HEAD~1
```

> **Attention** : `git reset --hard` supprime définitivement les modifications. Utilisez-le avec précaution. Privilégiez `git revert` pour les commits déjà poussés.

### Nettoyer les fichiers non-trackés

```bash
# Voir ce qui serait supprimé (dry run)
git clean -n

# Supprimer les fichiers non-trackés
git clean -f

# Supprimer fichiers et dossiers non-trackés
git clean -fd

# Supprimer aussi les fichiers ignorés par .gitignore
git clean -fdx
```

## Tags et versioning {#tags}

Les tags permettent de marquer des points spécifiques de l'historique, typiquement pour les versions de release.

### Types de tags

| Type       | Contenu                                   | Usage                  |
| ---------- | ----------------------------------------- | ---------------------- |
| **Léger**  | Simple pointeur vers un commit            | Marquer temporairement |
| **Annoté** | Objet Git complet (auteur, date, message) | Releases officielles   |

```bash
# Créer un tag léger
git tag v1.0.0

# Créer un tag annoté (recommandé pour les releases)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Taguer un commit passé
git tag -a v0.9.0 -m "Release v0.9.0" abc1234

# Lister les tags
git tag
git tag -l "v1.*"

# Voir les détails d'un tag
git show v1.0.0

# Pousser un tag vers le remote
git push origin v1.0.0

# Pousser tous les tags
git push origin --tags

# Supprimer un tag local
git tag -d v1.0.0

# Supprimer un tag distant
git push origin --delete v1.0.0
```

### Versionnage sémantique (SemVer)

Le standard **SemVer** suit le format `MAJOR.MINOR.PATCH` :

| Composant | Incrémentation                            | Exemple           |
| --------- | ----------------------------------------- | ----------------- |
| **MAJOR** | Changement incompatible (breaking change) | `1.0.0` → `2.0.0` |
| **MINOR** | Nouvelle fonctionnalité rétrocompatible   | `1.0.0` → `1.1.0` |
| **PATCH** | Correction de bug rétrocompatible         | `1.0.0` → `1.0.1` |

> **Conseil** : Combinez les tags Git avec le versionnage sémantique pour un suivi clair des releases.

## Le fichier .gitignore {#gitignore}

Le fichier `.gitignore` indique à Git les fichiers et dossiers à ne **pas** suivre.

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

## Workflows Git {#workflows}

Un workflow Git définit comment une équipe utilise les branches pour organiser le développement.

### Git Flow

Le workflow le plus structuré, adapté aux projets avec des cycles de release planifiés.

**Branches :**

- `main` : Code en production
- `develop` : Branche d'intégration
- `feature/*` : Nouvelles fonctionnalités
- `release/*` : Préparation d'une release
- `hotfix/*` : Corrections urgentes en production

```
main:       A-----------G-----------M
             \         / \         /
develop:      B---C---F   H---I---L
               \   /         \  /
feature:        D-E           J-K
```

### GitHub Flow

Un workflow simple et léger, idéal pour le déploiement continu.

**Principe :**

1. Créer une branche depuis `main`
2. Ajouter des commits
3. Ouvrir une Pull Request
4. Review et discussion
5. Merger dans `main`
6. Déployer

```bash
git switch -c feature/new-button
# ... développer et commiter ...
git push -u origin feature/new-button
# Ouvrir une Pull Request sur GitHub
```

### Trunk-based development

Tout le monde travaille directement sur `main` avec des branches très courtes (< 1 jour).

**Principe :**

- Branches de très courte durée
- Intégration fréquente dans `main`
- Feature flags pour le code incomplet
- Adapté aux équipes expérimentées avec CI/CD robuste

### Comparaison des workflows

| Aspect         | Git Flow              | GitHub Flow       | Trunk-based             |
| -------------- | --------------------- | ----------------- | ----------------------- |
| **Complexité** | Élevée                | Faible            | Faible                  |
| **Branches**   | Multiples permanentes | `main` uniquement | `main` uniquement       |
| **Releases**   | Planifiées            | Continues         | Continues               |
| **Équipe**     | Grande, structurée    | Petite à moyenne  | Expérimentée            |
| **CI/CD**      | Optionnel             | Recommandé        | Obligatoire             |
| **Idéal pour** | Logiciels versionnés  | SaaS, web apps    | Startups, DevOps mature |

## Commandes avancées {#advanced}

### Cherry-pick

Appliquer un commit spécifique sur la branche courante :

```bash
# Appliquer un commit
git cherry-pick abc1234

# Appliquer sans commiter (garder en staging)
git cherry-pick --no-commit abc1234

# Appliquer plusieurs commits
git cherry-pick abc1234 def5678
```

### Bisect

Trouver le commit qui a introduit un bug par recherche binaire :

```bash
# Démarrer la recherche
git bisect start

# Marquer le commit courant comme mauvais
git bisect bad

# Marquer un commit connu comme bon
git bisect good abc1234

# Git checkout un commit intermédiaire
# Tester, puis marquer :
git bisect good    # si le bug n'est pas présent
git bisect bad     # si le bug est présent

# Répéter jusqu'à trouver le commit coupable

# Terminer la recherche
git bisect reset
```

### Reflog

L'historique de toutes les actions locales (même les commits "perdus") :

```bash
# Voir le reflog
git reflog

# Récupérer un commit après un reset --hard
git reflog
# Trouver le SHA du commit perdu
git reset --hard abc1234
```

> **Astuce** : Le reflog est votre filet de sécurité. Même après un `reset --hard`, les commits restent accessibles via le reflog pendant 90 jours par défaut.

### Blame

Voir qui a modifié chaque ligne d'un fichier :

```bash
# Annoter un fichier
git blame fichier.txt

# Annoter une plage de lignes
git blame -L 10,20 fichier.txt

# Ignorer les changements de whitespace
git blame -w fichier.txt
```

### Log avancé

```bash
# Rechercher dans les messages de commit
git log --grep="login"

# Rechercher dans le contenu modifié
git log -S "functionName"

# Commits d'un auteur spécifique
git log --author="Nom"

# Commits entre deux dates
git log --after="2024-01-01" --before="2024-12-31"

# Commits touchant un fichier
git log -- src/app.tsx

# Format personnalisé
git log --pretty=format:"%h %an %s" --graph

# Résumé des contributions
git shortlog -sn
```

## Alias et productivité {#aliases}

Les alias Git permettent de créer des raccourcis pour les commandes fréquentes.

### Configurer des alias

```bash
# Alias simples
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.sw switch
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.df diff

# Alias avec options
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.last "log -1 --oneline"
git config --global alias.unstage "restore --staged"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.amend "commit --amend --no-edit"

# Alias pour voir les branches mergées/non mergées
git config --global alias.merged "branch --merged"
git config --global alias.unmerged "branch --no-merged"
```

### Utilisation

```bash
git st          # git status
git lg          # log graphique complet
git last        # dernier commit
git unstage .   # désindexer tout
git undo        # annuler le dernier commit
```

> **Conseil** : Vous pouvez aussi éditer directement le fichier `~/.gitconfig` :
>
> ```ini
> [alias]
>     st = status
>     lg = log --oneline --graph --all --decorate
>     last = log -1 --oneline
> ```

## Résolution de problèmes {#troubleshooting}

### Detached HEAD

**Symptôme** : Git indique `HEAD detached at abc1234`.

**Cause** : Vous avez fait un checkout sur un commit au lieu d'une branche.

**Solution** :

```bash
# Créer une branche à partir de la position actuelle
git switch -c ma-branche

# Ou revenir sur une branche existante
git switch main
```

### Push rejeté (non fast-forward)

**Symptôme** : `! [rejected] main -> main (non-fast-forward)`

**Cause** : Le remote contient des commits que vous n'avez pas en local.

**Solution** :

```bash
# Récupérer et intégrer les changements distants
git pull --rebase origin main

# Puis pousser
git push origin main
```

### Commit sur la mauvaise branche

**Symptôme** : Vous avez commité sur `main` au lieu de votre feature branch.

**Solution** :

```bash
# Créer la branche feature au commit courant
git branch feature/ma-feature

# Revenir au commit précédent sur main
git reset --hard HEAD~1

# Basculer sur la feature branch
git switch feature/ma-feature
```

### Fichier trop gros poussé par erreur

**Symptôme** : Un fichier volumineux a été commité et bloque le push.

**Solution** :

```bash
# Supprimer le fichier du dernier commit
git reset --soft HEAD~1
git restore --staged gros-fichier.bin
git commit -m "FEATURE: scope: Description sans le gros fichier"

# Ajouter au .gitignore
echo "gros-fichier.bin" >> .gitignore
```

### Récupérer des modifications perdues

```bash
# Vérifier le reflog pour retrouver le commit
git reflog

# Restaurer à partir du reflog
git reset --hard HEAD@{2}

# Ou cherry-pick un commit spécifique
git cherry-pick abc1234
```

### Annuler un rebase en cours

```bash
git rebase --abort
```

### Modifier le dernier message de commit

```bash
# Si le commit n'est pas encore poussé
git commit --amend -m "Nouveau message"

# Si le commit est déjà poussé (attention : force push nécessaire)
git commit --amend -m "Nouveau message"
git push --force-with-lease origin ma-branche
```

> **Note** : Utilisez `--force-with-lease` au lieu de `--force`. Cette option vérifie que personne n'a poussé de nouveaux commits entre-temps, évitant ainsi d'écraser le travail d'un collègue.

---

Ce guide couvre les aspects essentiels de Git. Pour les conventions de messages de commit, consultez le [Guide du style de commit](/help/git/commit).