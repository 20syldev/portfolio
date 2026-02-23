---
title: Corriger des erreurs
description: Mettre du travail de côté avec le stash, annuler des commits, et versionner avec les tags.
category: git
slug: corrections
order: 5
---

## Le stash {#stash}

Le stash permet de **mettre de côté temporairement** des modifications en cours pour travailler sur autre chose, sans avoir besoin de créer un commit.

> **Analogie** : Le stash, c'est un tiroir. Tu ranges rapidement ton travail en cours, tu règles un truc urgent, puis tu rouvres le tiroir et tu reprends où tu en étais.

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

**Règle simple** :

- Changements **non commités** → `git restore`
- Commit **non encore poussé** → `git reset`
- Commit **déjà poussé sur GitHub** → `git revert` (crée un nouveau commit qui annule)

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
# Créer un nouveau commit qui annule le commit spécifié (safe pour branches partagées)
git revert abc1234

# Annuler le dernier commit (garder les changements stagés)
git reset --soft HEAD~1

# Annuler le dernier commit (garder les changements non stagés)
git reset --mixed HEAD~1

# Annuler le dernier commit (supprimer les changements)
git reset --hard HEAD~1
```

> **Attention** : `git reset --hard` supprime définitivement les modifications non commitées. Utilisez-le avec précaution. Privilégiez `git revert` pour les commits déjà poussés, car il ne réécrit pas l'historique.

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

> **Analogie** : Un tag, c'est comme un post-it collé sur un commit précis. À la différence d'une branche qui avance à chaque commit, le tag reste fixé sur ce commit pour toujours.

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

## Pour aller plus loin {#next}

- [Commandes avancées](/help/git/advanced) — cherry-pick, bisect, alias et workflows d'équipe
- [Guide du style de commit](/help/git/commit) — conventions pour des messages de commit structurés