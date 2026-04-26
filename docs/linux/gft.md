---
title: "GitHub Fetch Tool"
description: "Outil CLI léger pour récupérer les releases GitHub, lister et installer les assets binaires, avec cache local et auto-mise à jour — sans authentification."
category: linux
slug: gft
order: 2
---

## Installation {#install}

### Via curl (recommandée)

```bash
curl -fsSL https://cdn.sylvain.sh/bash/gft@latest/install.sh | sh
```

### Installation manuelle

```bash
# Télécharger et lancer l'installeur
./install.sh

# Ou manuellement :
cp gft /usr/local/bin/
chmod +x /usr/local/bin/gft
```

### Mise à jour et désinstallation

```bash
# Mettre à jour gft vers la dernière version
gft update

# Désinstaller gft
gft delete

# Vérifier si une mise à jour est disponible
gft --check-update
```

## Utilisation {#usage}

### Syntaxe de base

```bash
gft <user/repo> [tag] [options]
```

### Exemples rapides

```bash
# Obtenir les infos de la dernière release
gft cli/cli

# Obtenir une version spécifique
gft nodejs/node v22.0.0

# Lister tous les assets binaires
gft cli/cli --assets

# Détecter automatiquement le bon binaire pour votre OS
gft cli/cli --detect

# Télécharger un asset spécifique
gft cli/cli --get "linux-amd64.deb"

# Obtenir uniquement le numéro de version (pour les scripts)
VERSION=$(gft nodejs/node -q)

# Afficher les notes de release
gft cli/cli --notes

# Sortie JSON
gft cli/cli --json

# Comparer deux releases
gft cli/cli v2.40.0..v2.50.0

# Lister toutes les releases disponibles
gft cli/cli --releases

# Inclure les pre-releases dans la résolution du latest
gft cli/cli --pre

# Installer automatiquement le binaire dans le PATH
gft cli/cli --install

# Télécharger l'archive source (non-interactif, pour les scripts)
gft cli/cli --source zip

# Télécharger et vérifier l'intégrité SHA256
gft cli/cli --get linux-amd64 --checksum

# Ouvrir la page de release dans le navigateur
gft cli/cli --open

# Mettre à jour gft
gft update

# Désinstaller gft
gft delete
```

## Alias {#alias}

`gfv` est disponible comme alias de `gft`.

## Fonctionnalités {#features}

- Détection automatique de la dernière release
- Listage des assets binaires (`--assets`)
- Listage de toutes les releases disponibles (`--releases`)
- Inclusion des pre-releases (`--pre`)
- Détection automatique de la plateforme (`--detect`) — trouve le bon binaire pour votre OS/arch
- Téléchargement direct par pattern (`--get`)
- Installation automatique de binaires dans le PATH (`--install`)
- Téléchargement d'archives source non-interactif (`--source zip|tar`)
- Vérification SHA256 après téléchargement (`--checksum`)
- Affichage des notes de release (`--notes`)
- Sortie JSON pour les scripts (`--json`)
- Mode silencieux — juste la chaîne de version (`-q`)
- Comparaison de versions (`v1.0..v2.0`)
- Vérification des mises à jour (`--check-update`)
- Auto-mise à jour intégrée (`gft update`)
- Ouverture de la page release dans le navigateur (`--open`)
- Cache local des réponses (`~/.config/gft/cache/`) avec TTL configurable via `GFT_CACHE_TTL`
- Fonctionne sans authentification GitHub
- Fallback transparent vers le CLI `gh` pour les dépôts privés (si disponible)
- Respecte la convention `NO_COLOR` et la détection de pipe
- Complétion Bash et Zsh
- Page de manuel (`man gft`)

## Fonctionnement {#internals}

gft récupère directement les pages de releases GitHub, donc il :

- Ne nécessite **aucune authentification** (pas de configuration de token)
- N'a **aucun problème de rate limit** (scraping, pas API)
- Fonctionne sur n'importe quelle machine avec `curl` et `bash`

Les réponses sont mises en cache localement dans `~/.config/gft/cache/` pour éviter les requêtes réseau répétées (TTL par défaut : 300 secondes, configurable via `GFT_CACHE_TTL`). Utiliser `--no-cache` pour ignorer le cache ponctuellement, ou `--clear-cache` pour le vider entièrement.

Lorsque le CLI `gh` est installé et authentifié, gft l'utilise en transparence comme fallback pour les dépôts privés et une sortie JSON plus riche. Pour compléter cet outillage, [mn](/help/linux/mn) offre un menu interactif pour gérer vos connexions SSH, repos locaux et alias Bash depuis le terminal.

## Commandes {#commands}

| Commande     | Description                                |
| ------------ | ------------------------------------------ |
| `gft update` | Mettre à jour gft vers la dernière version |
| `gft delete` | Désinstaller gft                           |

## Options {#options}

| Option                 | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `-h, --help`           | Afficher l'aide                                            |
| `-v, --version`        | Afficher la version                                        |
| `--check-update`       | Vérifier si une nouvelle version de gft est disponible     |
| `--upgrade`            | Mettre à jour gft vers la dernière version                 |
| `--releases, --list`   | Lister toutes les releases disponibles                     |
| `--assets`             | Lister les assets binaires de la release                   |
| `--detect`             | Détecter l'OS/arch, mettre en évidence l'asset idéal       |
| `--get <pattern>`      | Télécharger l'asset correspondant au pattern               |
| `--install`            | Télécharger, extraire et installer le binaire dans le PATH |
| `--source zip\|tar`    | Télécharger l'archive source (non-interactif)              |
| `--checksum, --verify` | Vérifier l'intégrité SHA256 après téléchargement           |
| `--notes`              | Afficher les notes de release                              |
| `--json`               | Sortie au format JSON                                      |
| `-q, --quiet`          | Afficher uniquement le tag de version                      |
| `--pre, --prerelease`  | Inclure les pre-releases lors de la résolution du latest   |
| `--open`               | Ouvrir la page de release dans le navigateur               |
| `--no-color`           | Désactiver la sortie colorée                               |
| `--no-cache`           | Ignorer le cache de réponses                               |
| `--clear-cache`        | Vider tout le cache                                        |

## Variables d'environnement {#env}

| Variable        | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `NO_COLOR`      | Définir à n'importe quelle valeur pour désactiver les couleurs |
| `GITHUB_TOKEN`  | Pour augmenter les limites d'API (5000/h vs 60/h)              |
| `GFT_CACHE_TTL` | Durée du cache en secondes (défaut : 300)                      |

## Exemple de sortie {#output}

```
→ Looking up user/repo (latest)...

✓ Latest release: vX.Y.Z

- Repository:  user/repo
- Tag:         vX.Y.Z

> Links
  ├─ Repository:   https://github.com/user/repo
  ├─ Releases:     https://github.com/user/repo/releases
  └─ This release: https://github.com/user/repo/releases/tag/vX.Y.Z

> Source Archives
  ├─ ZIP:    https://github.com/user/repo/archive/refs/tags/vX.Y.Z.zip
  └─ TAR.GZ: https://github.com/user/repo/archive/refs/tags/vX.Y.Z.tar.gz

> Quick Commands
  ├─ curl -LO "https://github.com/user/repo/archive/refs/tags/vX.Y.Z.zip"
  ├─ curl -LO "https://github.com/user/repo/archive/refs/tags/vX.Y.Z.tar.gz"
  └─ git clone --depth 1 --branch vX.Y.Z https://github.com/user/repo.git

→ Download? (z)ip, (t)ar.gz, (n)o [n]:
```

## Pourquoi gft plutôt que gh cli ? {#comparison}

|                             | gft                    | gh cli                           |
| --------------------------- | ---------------------- | -------------------------------- |
| Authentification requise    | Non                    | Oui                              |
| Configuration nécessaire    | Aucune                 | `gh auth login`                  |
| Listage des assets binaires | `--assets` (sans auth) | `gh release view` (auth requise) |
| Détection de plateforme     | `--detect`             | Non disponible                   |
| Téléchargement par pattern  | `--get pattern`        | URL manuelle                     |
| Dépendances                 | curl, bash             | Binaire Go (~50 Mo)              |
| Taille                      | ~15 Ko                 | ~50 Mo                           |

## Prérequis {#prerequisites}

- `curl` (pour les requêtes HTTP)
- `bash` (>= 4.0)
- Connexion internet
- Optionnel : CLI `gh` pour les dépôts privés et des données plus riches

## Dépannage {#troubleshooting}

### Dépôt introuvable

- Vérifier l'orthographe du nom d'utilisateur et du dépôt
- S'assurer que le dépôt est public (ou utiliser `gh auth login` pour les dépôts privés)

### Aucune release trouvée

- Le dépôt n'a peut-être pas de releases
- Vérifier sur `https://github.com/username/repository/releases`

### Erreur de téléchargement

- Vérifier la connexion internet
- Le tag spécifié n'existe peut-être pas