---
title: Git pour les débutants
description: Comprendre et utiliser Git from scratch, sans jargon, avec des exemples concrets et des analogies du quotidien.
category: git
slug: start
order: 1
---

## C'est quoi Git, concrètement ? {#intro}

Imagine que tu travailles sur un roman. À chaque fois que tu termines un chapitre, tu fais une photocopie de tout le manuscrit et tu l'archives dans un classeur. Si tu te rates sur le chapitre suivant, tu n'as qu'à rouvrir la dernière archive et reprendre depuis là.

**Git, c'est exactement ça** — mais pour du code :

- Chaque "archive" s'appelle un **commit**
- Le "classeur" s'appelle un **dépôt** (ou _repository_, souvent abrégé _repo_)
- L'outil qui gère tout ça s'appelle **Git**
- Le site qui héberge ton classeur en ligne s'appelle **GitHub** (ou GitLab, Bitbucket...)

> Git ≠ GitHub. Git est l'outil installé sur ton ordinateur. GitHub est un site web qui stocke tes dépôts en ligne.

### Pourquoi ne pas juste faire des copies manuelles ?

| Copie manuelle                                                       | Git                                                |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| `projet_v1`, `projet_v2`, `projet_final`, `projet_vraiment_final`... | Un seul dossier, historique propre                 |
| Impossible de savoir ce qui a changé entre deux versions             | Chaque commit liste exactement les changements     |
| Collaborer = s'envoyer des zips par email                            | Tout le monde travaille sur le même dépôt en ligne |
| Pas de moyen de revenir à un état précis                             | Retour en arrière en une commande                  |

## Installation en 5 minutes {#install}

### Installer Git

```bash
# Linux (Debian/Ubuntu)
sudo apt install git

# macOS (avec Homebrew)
brew install git

# Windows : télécharger depuis https://git-scm.com/install
```

Vérifier que ça marche :

```bash
git --version
# git version 2.43.0
```

### Se présenter à Git (à faire une seule fois)

Git a besoin de savoir qui tu es pour signer tes commits :

```bash
git config --global user.name "Ton Prénom Nom"
git config --global user.email "ton@email.com"
```

> Ces informations apparaîtront dans chaque commit que tu feras. Utilise la même adresse email que ton compte GitHub.

## Ton premier projet Git {#project}

Voici un scénario complet, étape par étape. Imagine que tu crées un site web simple.

### Étape 1 — Créer le dépôt

```bash
mkdir mon-site
cd mon-site
git init
```

Ce que tu verras :

```
Initialized empty Git repository in /home/toi/mon-site/.git/
```

Git a créé un dossier caché `.git/` dans ton projet — c'est là qu'il stocke tout l'historique. Ne touche pas à ce dossier.

### Étape 2 — Créer un fichier

```bash
echo "<h1>Bonjour</h1>" > index.html
```

### Étape 3 — Vérifier l'état

```bash
git status
```

```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html

nothing added to commit but untracked files present
```

Git voit le fichier mais ne le suit pas encore. C'est ton "brouillon non archivé".

### Étape 4 — Ajouter le fichier à la zone de préparation

```bash
git add index.html
```

```bash
git status
```

```
On branch main

No commits yet

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   index.html
```

Le fichier est maintenant "prêt à être archivé" (dans la _staging area_).

### Étape 5 — Faire le commit (créer l'archive)

```bash
git commit -m "MINOR: app: Add index page"
```

```
[main (root-commit) a3f8c21] MINOR: app: Add index page
 1 file changed, 1 insertion(+)
 create mode 100644 index.html
```

Félicitations, tu as ton premier commit ! Git a créé une archive avec un identifiant unique (`a3f8c21`).

### Étape 6 — Voir l'historique

```bash
git log --oneline
```

```
a3f8c21 (HEAD -> main) MINOR: app: Add index page
```

## Les 3 commandes du quotidien {#daily}

90% du temps, tu n'utiliseras que ces 3 commandes :

```
[Tes fichiers]  --git add-->  [Zone de préparation]  --git commit-->  [Historique]
  (modifié)                     (prêt à archiver)                       (archivé)
```

### `git add` — "Je veux archiver ce fichier"

```bash
git add fichier.txt          # Un seul fichier
git add src/                 # Tout un dossier
git add .                    # Tout ce qui a changé (utiliser avec précaution)
```

> Analogie : `git add`, c'est comme mettre des papiers dans une enveloppe avant de l'envoyer. Tu choisis quoi mettre dedans avant de sceller.

### `git commit` — "J'archive maintenant"

```bash
git commit -m "MINOR: app: Description de ce que j'ai fait"
```

> Analogie : `git commit`, c'est sceller l'enveloppe et la mettre dans le classeur avec une étiquette. L'étiquette, c'est ton message de commit.

Le message doit expliquer **ce que tu as fait et pourquoi**, pas comment. Mauvais : `"modif"`. Bon : `"MINOR: auth: Fix login redirect after session expiry"`.

### `git push` — "J'envoie mon historique sur GitHub"

```bash
git push origin main
```

> Analogie : `git push`, c'est photocopier ton classeur et envoyer la copie dans un coffre-fort en ligne (GitHub). Même si ton ordinateur brûle, ton code est sauvegardé.

## Connecter ton projet à GitHub {#github}

### Créer le dépôt sur GitHub

1. Va sur [github.com](https://github.com) et connecte-toi
2. Clique sur **New repository** (bouton vert)
3. Donne-lui un nom, laisse tout le reste par défaut
4. **Ne coche pas** "Add a README file" si tu as déjà du code en local
5. Clique sur **Create repository**

### Relier ton dépôt local à GitHub

GitHub te donnera une commande à copier-coller. Elle ressemble à ça :

```bash
git remote add origin https://github.com/ton-pseudo/mon-site.git
git push -u origin main
```

Après ça, `git push` seul suffira pour tous les envois suivants.

## Récupérer un projet existant {#clone}

Si le projet est déjà sur GitHub (ou qu'un collègue t'a partagé un lien) :

```bash
git clone https://github.com/user/repo.git
cd repo
```

Git télécharge tout le projet **avec son historique complet**.

## Schémas visuels {#diagrams}

### Ce qui se passe quand tu travailles

```
   DISQUE DUR        ZONE DE PRÉPA       DÉPÔT LOCAL          GITHUB
   ──────────        ─────────────       ───────────          ──────

  ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
  │index.html│       │index.html│       │ commit 3 │       │ commit 3 │
  │style.css │       │style.css │       │ commit 2 │       │ commit 2 │
  │script.js │       │          │       │ commit 1 │       │ commit 1 │
  └──────────┘       └──────────┘       └──────────┘       └──────────┘
        │                  ▲                  ▲                  ▲
        └── git add ───────┘                  │                  │
                           └── git commit ────┘                  │
                                              └── git push ──────┘
```

### Le cycle classique

```
 1. Modifier un fichier
        │
        ▼
 2. git status    ← voir ce qui a changé
        │
        ▼
 3. git add .     ← sélectionner les changements
        │
        ▼
 4. git commit -m "message"   ← créer l'archive
        │
        ▼
 5. git push      ← envoyer sur GitHub
```

## Erreurs courantes et leur traduction {#errors}

### `not a git repository`

```
fatal: not a git repository (or any of the parent directories): .git
```

**Traduction** : Tu n'es pas dans un dossier géré par Git.

**Solution** : Vérifie avec `pwd` que tu es dans le bon dossier, puis lance `git init` si c'est un nouveau projet, ou `git clone url` si le projet est sur GitHub.

### `rejected — non-fast-forward`

```
! [rejected]   main -> main (non-fast-forward)
error: failed to push some refs to 'github.com:...'
hint: Updates were rejected because the tip of your current branch is behind
```

**Traduction** : Quelqu'un (ou toi depuis un autre ordinateur) a poussé des commits sur GitHub que tu n'as pas en local. GitHub refuse d'écraser ces commits.

**Solution** :

```bash
git pull --rebase origin main   # Récupérer les commits distants et remettre les tiens par-dessus
git push origin main            # Maintenant ça devrait passer
```

### `CONFLICT`

```
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

**Traduction** : Toi et quelqu'un d'autre avez modifié **la même ligne** du même fichier. Git ne sait pas quelle version garder.

**Solution** : Ouvrir le fichier en question. Tu verras des marqueurs comme ça :

```
<<<<<<< HEAD
<h1>Bonjour</h1>
=======
<h1>Hello World</h1>
>>>>>>> feature/translation
```

Choisir la version que tu veux garder (ou combiner les deux), supprimer les marqueurs `<<<<<<<`, `=======`, `>>>>>>>`, puis :

```bash
git add index.html
git commit
```

### `HEAD detached`

```
HEAD detached at a3f8c21
```

**Traduction** : Tu "regardes" un ancien commit directement, sans être sur une branche. C'est comme ouvrir une vieille archive en lecture seule — si tu fais des changements ici, ils risquent d'être perdus.

**Solution** :

```bash
git switch main    # Revenir sur la branche principale
```

Si tu as fait des modifications importantes en état "detached HEAD" et que tu veux les garder :

```bash
git switch -c ma-nouvelle-branche    # Créer une branche pour les sauvegarder
```

### `Please tell me who you are`

```
Author identity unknown

*** Please tell me who you are.

Run
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```

**Traduction** : Tu n'as jamais configuré ton identité Git.

**Solution** : Copier-coller les deux commandes que Git te donne, avec tes vraies informations.

## Pour aller plus loin {#next}

Maintenant que tu as les bases, tu peux explorer :

- [Bases de Git](/help/git/basics) — concepts fondamentaux et commandes essentielles
- [Workflow quotidien](/help/git/workflow) — dépôts distants et `.gitignore`
- [Branches et fusion](/help/git/branches) — travailler sur plusieurs fonctionnalités en parallèle
- [Corriger des erreurs](/help/git/corrections) — stash, annulation de commits, tags
- [Guide du style de commit](/help/git/commit) — conventions pour des messages de commit structurés