---
title: Branches et fusion
description: Créer et gérer des branches, fusionner avec merge ou rebase, résoudre les conflits.
category: git
slug: branches
order: 4
---

## Les branches {#branches}

Les branches sont l'une des fonctionnalités les plus puissantes de Git. Elles permettent de travailler sur des fonctionnalités isolées sans affecter la branche principale.

> **Analogie** : Une branche, c'est comme une copie parallèle de ton projet où tu peux expérimenter librement. Si ça marche, tu fusionnes dans le projet principal. Si ça rate, tu supprimes la branche sans aucune conséquence.

### Schéma de branches

```
main:      A---B---C-------G---H
                \         /
feature:         D---E---F
```

Dans cet exemple, la branche `feature` a été créée à partir du commit `B`, développée indépendamment (`D`, `E`, `F`), puis fusionnée dans `main` avec le commit `G`.

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

## Fusion et résolution de conflits {#merge}

### Types de merge

#### Fast-forward

Quand la branche cible n'a pas divergé depuis que la feature branch a été créée, Git avance simplement le pointeur — pas de commit de merge créé :

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

Quand les deux branches ont divergé (main a avancé pendant que tu travaillais sur feature), Git crée un commit de merge dédié :

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

Quand Git ne peut pas fusionner automatiquement (deux personnes ont modifié la même ligne), il signale un conflit :

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

- Tout ce qui est entre `<<<<<<< HEAD` et `=======` vient de **ta branche** (la branche courante)
- Tout ce qui est entre `=======` et `>>>>>>> feature/login` vient de **la branche qu'on fusionne**

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

Le rebase permet de **réécrire l'historique** en déplaçant une branche sur une nouvelle base. Résultat : un historique linéaire et propre.

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

Les commits `C` et `D` sont **recréés** (nouveaux SHA) par-dessus `E`. L'historique est linéaire comme si tu avais commencé ta feature depuis le dernier commit de main.

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

- `squash` : Fusionner plusieurs petits commits "WIP" en un seul commit propre
- `reword` : Corriger un message de commit mal rédigé
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

> **Règle d'or du rebase** : Ne faites **jamais** de rebase sur une branche partagée avec d'autres développeurs. La réécriture d'historique crée des conflits pour tous ceux qui ont basé leur travail sur les anciens commits.

## Pour aller plus loin {#next}

- [Corriger des erreurs](/help/git/corrections) — stash, annulation de commits, tags
- [Commandes avancées](/help/git/advanced) — cherry-pick, workflows d'équipe et alias