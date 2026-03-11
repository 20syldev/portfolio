---
title: Gestion des gros dépôts
description: Git LFS, shallow clones, sparse-checkout, maintenance et nettoyage d'historique pour les dépôts volumineux.
category: git
slug: large
order: 9
---

## Le problème des gros dépôts {#intro}

Git stocke l'intégralité de l'historique localement, ce qui pose problème quand :

- **Fichiers binaires** (images, vidéos, datasets) : chaque version est stockée en entier
- **Historique long** : des milliers de commits ralentissent les opérations
- **Mono-repos** : des dizaines de projets dans un seul dépôt rendent le checkout lent

## Git LFS {#lfs}

Git LFS stocke les fichiers volumineux sur un serveur séparé et ne garde que des pointeurs dans le dépôt.

```bash
# Installer LFS
git lfs install

# Suivre certains types de fichiers
git lfs track "*.psd" "*.mp4" "*.zip"

# Vérifier le .gitattributes généré
cat .gitattributes
# *.psd filter=lfs diff=lfs merge=lfs -text

# Lister les fichiers suivis par LFS
git lfs ls-files
```

| Critère         | Sans LFS                     | Avec LFS                             |
| --------------- | ---------------------------- | ------------------------------------ |
| Taille du dépôt | Grossit à chaque version     | Reste léger (pointeurs uniquement)   |
| Clone           | Télécharge tout l'historique | Pointeurs puis fichiers à la demande |
| Serveur requis  | Non                          | Oui (GitHub, GitLab, etc.)           |

## Shallow clones {#shallow}

Un shallow clone ne récupère qu'une partie de l'historique :

```bash
# Cloner uniquement les 10 derniers commits
git clone --depth 10 https://github.com/user/repo.git

# Cloner une seule branche, un seul commit
git clone --single-branch --branch main --depth 1 repo.git

# Approfondir l'historique plus tard
git fetch --deepen 50

# Convertir en clone complet
git fetch --unshallow
```

**Cas d'usage principal** : pipelines CI/CD — un shallow clone accélère considérablement le checkout.

> **Limitation** : on ne peut pas pousser depuis un shallow clone sans d'abord faire un `--unshallow`.

## Sparse-checkout {#sparse}

```bash
# Activer le sparse-checkout
git sparse-checkout init --cone

# Sélectionner les répertoires voulus
git sparse-checkout set src/frontend docs/

# Lister les chemins sélectionnés
git sparse-checkout list

# Désactiver (tout récupérer)
git sparse-checkout disable
```

## Nettoyage de l'historique {#cleanup}

`git filter-repo` (recommandé) permet de supprimer des fichiers de tout l'historique :

```bash
# Installer
pip install git-filter-repo

# Supprimer un fichier de tout l'historique
git filter-repo --path big-file.bin --invert-paths

# Supprimer un répertoire de tout l'historique
git filter-repo --path old-vendor/ --invert-paths
```

> **Attention** : cette opération réécrit l'historique. Elle nécessite un force push et tous les collaborateurs doivent re-cloner le dépôt.

**BFG Repo Cleaner** est une alternative plus simple pour les cas courants.

## Maintenance {#maintenance}

```bash
# Activer la maintenance planifiée (recommandé)
git maintenance start

# Garbage collection manuelle
git gc

# Compression agressive (lent, à utiliser rarement)
git gc --aggressive --prune=now

# Vérifier la santé du dépôt
git fsck
```

`git maintenance start` configure des tâches cron pour : **commit-graph**, **prefetch**, **loose-objects** et **incremental-repack**.

## Submodules vs subtrees {#submodules}

| Critère     | Submodules                       | Subtrees                 |
| ----------- | -------------------------------- | ------------------------ |
| Complexité  | Plus complexe                    | Plus simple              |
| Historique  | Séparé (pointeur vers un commit) | Fusionné dans le repo    |
| Clone       | Nécessite `--recurse-submodules` | Automatique              |
| Mise à jour | `git submodule update --remote`  | `git subtree pull`       |
| Cas d'usage | Dépendances externes             | Code partagé entre repos |

## Pour aller plus loin {#next}

- [Git internals](/help/git/internals) — comprendre les objets et packfiles
- [Commandes avancées](/help/git/advanced) — cherry-pick, bisect, workflows