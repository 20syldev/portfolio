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
- `gft cli/cli --assets` — Lister les assets binaires
- `gft cli/cli --detect` — Auto-détecter le binaire pour votre OS
- `gft cli/cli --get "linux-amd64.deb"` — Télécharger un asset
- `gft cli/cli --notes` — Notes de release
- `gft cli/cli --json` — Sortie JSON
- `gft cli/cli v2.40.0..v2.50.0` — Comparer deux releases

## Fonctionnalités {#features}

- **Détection automatique** de la dernière release
- **Listing des assets binaires** sans authentification
- **Auto-détection de plateforme** — trouve le bon binaire pour votre OS/architecture
- **Téléchargement par pattern** — `--get pattern`
- **Notes de release** — `--notes`
- **Sortie JSON** pour le scripting
- **Mode silencieux** — juste le numéro de version avec `-q`
- **Comparaison de versions** — `v1.0..v2.0`
- **Auto-update** — `--check-update`
- **Fallback gh CLI** transparent pour les repos privés
- **Complétion Bash et Zsh** intégrée

## Pourquoi gft ? {#why}

gft se distingue du gh CLI sur plusieurs points :

- **Pas d'authentification** requise (scraping, pas d'API)
- **Aucune configuration** nécessaire
- **Listing des assets** sans token
- **Auto-détection de plateforme** intégrée
- **Téléchargement par pattern** natif
- **Ultra-léger** — ~15KB contre ~50MB pour gh
- **Dépendances minimales** — curl et bash uniquement