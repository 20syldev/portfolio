---
name: GFT
description: Outil CLI pour récupérer les infos de releases GitHub sans authentification.
longDescription: Outil en ligne de commande léger pour récupérer les informations de releases, lister les assets et télécharger depuis n'importe quel projet GitHub — sans authentification requise.
tags: ["Bash", "CLI", "Shell"]
github: "https://github.com/20syldev/gft"
docs: "linux/gft"
---

## À propos {#about}

GFT (**G**itHub **F**etch **T**ool) est un outil en ligne de commande léger pour récupérer les informations de releases, lister les assets binaires et télécharger depuis n'importe quel projet GitHub — sans authentification requise.

## Installation {#install}

L'installation se fait en une seule commande via curl :

```bash
curl -fsSL https://cdn.sylvain.sh/bash/gft@latest/install.sh | sh
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
- `gft cli/cli --releases` — Lister toutes les releases
- `gft cli/cli --assets` — Lister les assets binaires
- `gft cli/cli --detect` — Auto-détecter le binaire pour votre OS
- `gft cli/cli --get "linux-amd64.deb"` — Télécharger un asset
- `gft cli/cli --get linux-amd64 --checksum` — Télécharger et vérifier SHA256
- `gft cli/cli --install` — Installer automatiquement le binaire
- `gft cli/cli --source zip` — Télécharger l'archive source (non-interactif)
- `gft cli/cli --notes` — Notes de release
- `gft cli/cli --json` — Sortie JSON
- `gft cli/cli --pre` — Inclure les pre-releases
- `gft cli/cli v2.40.0..v2.50.0` — Comparer deux releases
- `gft update` — Mettre à jour gft
- `gft delete` — Désinstaller gft

## Fonctionnalités {#features}

- **Détection automatique** de la dernière release
- **Listing des assets binaires** sans authentification — `--assets`
- **Listing de toutes les releases** — `--releases`
- **Auto-détection de plateforme** — trouve le bon binaire pour votre OS/architecture
- **Téléchargement par pattern** — `--get pattern`
- **Installation automatique** du binaire dans le PATH — `--install`
- **Archive source non-interactive** pour les scripts — `--source zip|tar`
- **Vérification SHA256** après téléchargement — `--checksum`
- **Notes de release** — `--notes`
- **Sortie JSON** pour le scripting
- **Mode silencieux** — juste le numéro de version avec `-q`
- **Comparaison de versions** — `v1.0..v2.0`
- **Pre-releases** — `--pre`
- **Ouverture dans le navigateur** — `--open`
- **Cache local** des réponses avec TTL configurable (`GFT_CACHE_TTL`)
- **Auto-mise à jour** intégrée — `gft update`
- **Fallback gh CLI** transparent pour les repos privés
- **Complétion Bash et Zsh** + page man intégrées

## Pourquoi gft ? {#why}

gft se distingue du gh CLI sur plusieurs points :

- **Pas d'authentification** requise (scraping, pas d'API)
- **Aucune configuration** nécessaire
- **Listing et installation** des assets sans token
- **Auto-détection de plateforme** intégrée
- **Téléchargement par pattern** avec vérification d'intégrité
- **Cache local** pour éviter les requêtes réseau répétées
- **Ultra-léger** — ~15KB contre ~50MB pour gh
- **Dépendances minimales** — curl et bash uniquement