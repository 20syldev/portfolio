---
name: GFT
description: Outil CLI pour récupérer les infos de releases GitHub sans authentification.
longDescription: Outil en ligne de commande léger pour récupérer les informations de releases, lister les assets et télécharger depuis n'importe quel projet GitHub public — sans authentification requise.
tags: ["Bash", "CLI", "Shell"]
github: "https://github.com/20syldev/gft"
docs: "linux/gft"
---

## À propos {#about}

GFT (**G**itHub **F**etch **T**ool) est un outil en ligne de commande léger pour récupérer les informations de releases, lister les assets binaires et télécharger depuis n'importe quel projet GitHub public — sans authentification requise.

## Installation {#install}

L'installation se fait en une seule commande via curl :

```bash
curl -fsSL https://dropr.sylvain.sh/bash/gft@latest/install.sh | sh
```

Vous pouvez aussi installer manuellement en copiant le script dans `/usr/local/bin/`.

## Utilisation {#usage}

La syntaxe de base est simple :

```bash
gft <user/repo> [tag] [options]
```

Exemples rapides :

- `gft cli/cli` — Dernière release
- `gft nodejs/node v22.0.0` — Version spécifique
- `gft cli/cli --releases` — Lister les dernières releases
- `gft cli/cli --assets` — Lister les assets binaires
- `gft cli/cli --detect` — Auto-détecter le binaire pour votre OS
- `gft cli/cli --get "linux-amd64.deb"` — Télécharger un asset
- `gft cli/cli --get linux-amd64 --checksum` — Télécharger et vérifier SHA256
- `gft cli/cli --install` — Installer automatiquement le binaire
- `gft cli/cli --get linux-amd64 --dir ~/Downloads` — Choisir le dossier de destination
- `gft cli/cli --source zip` — Télécharger l'archive source (non-interactif)
- `gft cli/cli --notes` — Notes de release
- `gft cli/cli --json` — Sortie JSON au format stable
- `gft -- <dépôt> <tag>` — Terminer les options : ce qui suit est un dépôt ou un tag
- `gft cli/cli --pre` — Inclure les pre-releases
- `gft cli/cli v2.40.0..v2.50.0` — Comparer deux releases
- `gft stash list` — Lister les stash git du repo courant
- `gft stash show 1` — Voir le diff d'un stash
- `gft stash drop 0` — Supprimer un stash (avec confirmation)
- `gft stash clean -y` — Tout supprimer sans confirmation
- `gft update` — Mettre à jour gft
- `gft delete` — Désinstaller gft

## Fonctionnalités {#features}

- **Détection automatique** de la dernière release
- **Listing des assets binaires** sans authentification — `--assets`
- **Listing des dernières releases** (première page) — `--releases`
- **Auto-détection de plateforme** — trouve le bon binaire pour votre OS/architecture
- **Téléchargement par pattern** — `--get pattern`
- **Installation automatique** du binaire dans le PATH — `--install`
- **Archive source non-interactive** pour les scripts — `--source zip|tar`
- **Vérification SHA256** après téléchargement — `--checksum`
- **Notes de release** — `--notes`
- **Sortie JSON stable** pour le scripting — `--json`, mêmes clés avec ou sans `gh`, et `schema: 1` pour détecter un changement incompatible
- **Dossier de destination unique** — `--dir` pour les téléchargements et le binaire installé
- **Commandes sans ambiguïté** — `update`, `delete` et `stash` ne sont des commandes qu'en premier argument, et `--` termine les options
- **Indicateur de chargement** sur les opérations réseau (`GFT_NO_SPINNER` pour le couper) et repli automatique en ASCII quand la locale n'est pas UTF-8 (`GFT_ASCII` pour le forcer)
- **Mode silencieux** — juste le numéro de version avec `-q`
- **Comparaison de versions** — `v1.0..v2.0`
- **Pre-releases** — `--pre`
- **Ouverture dans le navigateur** — `--open`
- **Cache local** des réponses avec TTL configurable (`GFT_CACHE_TTL`)
- **Auto-mise à jour** intégrée — `gft update`
- **Lecture via `gh`** quand il est installé et connecté, avec les mêmes clés JSON (le champ `source` indique l'origine)
- **Complétion Bash et Zsh** + page man intégrées
- **Gestion de stash Git** — `gft stash list|show|drop|clean`
- **Mode non-interactif** — `-y`/`--yes` pour supprimer des stash sans confirmation

## Pourquoi gft ? {#why}

gft se distingue du gh CLI sur plusieurs points :

- **Pas d'authentification** requise (scraping, pas d'API)
- **Aucune configuration** nécessaire
- **Listing et installation** des assets sans token
- **Auto-détection de plateforme** intégrée
- **Téléchargement par pattern** avec vérification d'intégrité
- **Cache local** pour éviter les requêtes réseau répétées
- **Ultra-léger** — environ 60 Ko contre ~50 Mo pour gh
- **Dépendances minimales** — curl et bash uniquement
