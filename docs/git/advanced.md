---
title: Commandes avancées
description: Workflows d'équipe, cherry-pick, bisect, alias, et résolution de problèmes courants.
category: git
slug: advanced
order: 6
---

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
               \     /     \     /
feature:        D---E       J---K
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

Appliquer un commit spécifique sur la branche courante, sans merger toute la branche :

```bash
# Appliquer un commit
git cherry-pick abc1234

# Appliquer sans commiter (garder en staging)
git cherry-pick --no-commit abc1234

# Appliquer plusieurs commits
git cherry-pick abc1234 def5678
```

**Cas d'usage** : Un correctif de bug est sur une branche feature, mais tu as besoin de l'appliquer sur `main` immédiatement sans merger toute la feature.

### Bisect

Trouver le commit qui a introduit un bug par recherche binaire automatique :

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

Git divise l'historique en deux à chaque étape. Sur 1000 commits, il trouve le coupable en ~10 étapes.

### Reflog

L'historique de **toutes les actions locales** (même les commits "perdus") :

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

Voir qui a modifié chaque ligne d'un fichier et quand :

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

# Ajouter au .gitignore pour éviter que ça se reproduise
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

## Pour aller plus loin {#next}

- [Guide du style de commit](/help/git/commit) — conventions pour des messages de commit structurés
- [GitHub Pages](/help/github/pages) — héberger un site statique directement depuis votre dépôt Git