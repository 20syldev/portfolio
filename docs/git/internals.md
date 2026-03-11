---
title: Git internals
description: Fonctionnement interne de Git — objets blob, tree, commit et tag, structure du dossier .git, plumbing commands.
category: git
slug: internals
order: 8
---

## Plumbing vs porcelain {#plumbing}

- **Porcelain** : les commandes utilisateur (`add`, `commit`, `push`, `log`…) — conçues pour être simples
- **Plumbing** : les commandes bas niveau (`hash-object`, `cat-file`, `ls-tree`, `rev-parse`…) — utilisées en interne par les commandes porcelain

Comprendre le plumbing permet de débuguer des situations complexes et de comprendre ce que Git fait sous le capot.

## Les quatre types d'objets {#objects}

Tout dans Git repose sur quatre types d'objets, identifiés par un hash SHA-1 :

| Objet      | Description            | Contenu                                       |
| ---------- | ---------------------- | --------------------------------------------- |
| **blob**   | Contenu d'un fichier   | Données brutes (sans nom de fichier)          |
| **tree**   | Répertoire             | Liste de blobs et sous-trees avec leurs noms  |
| **commit** | Snapshot + métadonnées | Pointeur vers un tree, auteur, date, message  |
| **tag**    | Tag annoté             | Pointeur vers un commit, nom, message, auteur |

### Relations entre objets

```
commit  ──>  tree  ──>  blob (README.md)
  │            │
  │            └──>  tree (src/)  ──>  blob (index.ts)
  │
  └──>  parent commit
```

## Explorer les objets {#explore}

Les commandes plumbing permettent d'inspecter directement les objets :

```bash
# Afficher le type d'un objet
git cat-file -t HEAD

# Afficher le contenu d'un commit
git cat-file -p HEAD

# Afficher le contenu du tree racine
git cat-file -p HEAD^{tree}

# Hasher un fichier manuellement
echo "Hello" | git hash-object --stdin

# Lister les entrées d'un tree
git ls-tree HEAD

# Lister récursivement (sous-répertoires inclus)
git ls-tree -r HEAD
```

## Structure de .git/ {#dot-git}

```
.git/
├── HEAD            # Référence vers la branche courante
├── config          # Configuration du dépôt
├── objects/        # Tous les objets Git (blobs, trees, commits)
│   ├── pack/       # Objets compressés en packfiles
│   └── info/
├── refs/           # Pointeurs de branches et tags
│   ├── heads/      # Branches locales
│   ├── tags/       # Tags
│   └── remotes/    # Branches de suivi distant
├── hooks/          # Scripts de hooks Git
├── index           # Zone de staging (binaire)
└── logs/           # Données du reflog
```

## Refs et HEAD {#refs}

- **Refs** : simples fichiers texte contenant un hash SHA-1
- **HEAD** : ref symbolique pointant vers une branche — `ref: refs/heads/main`
- **Detached HEAD** : HEAD pointe directement vers un hash de commit
- **Reflog** : historique de toutes les positions de HEAD et des branches

```bash
# Voir la valeur de HEAD
cat .git/HEAD

# Voir vers quoi pointe une branche
cat .git/refs/heads/main

# Consulter le reflog
git reflog
```

## Packfiles et compression {#packfiles}

- **Objets loose** : un fichier par objet dans `objects/` (format initial)
- **Packfiles** : objets regroupés et compressés par delta (après `git gc`) — stockent les différences entre objets similaires

```bash
# Inspecter les packfiles
git verify-pack -v .git/objects/pack/*.idx

# Voir les statistiques du dépôt
git count-objects -vH
```

## Garbage collection {#gc}

```bash
# Lancer le garbage collector
git gc

# Compression agressive (lent, à utiliser rarement)
git gc --aggressive --prune=now

# Supprimer les objets inaccessibles immédiatement
git prune

# Vérifier l'intégrité du dépôt
git fsck
```

Le reflog protège les objets récents pendant **90 jours** par défaut, même s'ils ne sont plus référencés par aucune branche.

## Pour aller plus loin {#next}

- [Corrections](/help/git/corrections) — récupérer des objets perdus avec reflog
- [Commandes avancées](/help/git/advanced) — cherry-pick, bisect, alias
- [Gros dépôts](/help/git/large) — LFS, shallow clone, maintenance