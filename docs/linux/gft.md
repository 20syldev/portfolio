---
title: "GitHub Fetch Tool"
description: "Outil CLI léger pour récupérer les releases GitHub, lister les assets binaires et les télécharger — sans authentification."
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
```

## Alias {#alias}

`gfv` est disponible comme alias de `gft`.

## Fonctionnalités {#features}

- Détection automatique de la dernière release
- Listage des assets binaires (`--assets`)
- Détection automatique de la plateforme (`--detect`) — trouve le bon binaire pour votre OS/arch
- Téléchargement direct par pattern (`--get`)
- Affichage des notes de release (`--notes`)
- Sortie JSON pour les scripts (`--json`)
- Mode silencieux — juste la chaîne de version (`-q`)
- Comparaison de versions (`v1.0..v2.0`)
- Vérification des mises à jour (`--check-update`)
- Fonctionne sans authentification GitHub
- Fallback transparent vers le CLI `gh` pour les dépôts privés (si disponible)
- Respecte la convention `NO_COLOR` et la détection de pipe
- Complétion Bash et Zsh

## Fonctionnement {#internals}

gft récupère directement les pages de releases GitHub, donc il :

- Ne nécessite **aucune authentification** (pas de configuration de token)
- N'a **aucun problème de rate limit** (scraping, pas API)
- Fonctionne sur n'importe quelle machine avec `curl` et `bash`

Lorsque le CLI `gh` est installé et authentifié, gft l'utilise en transparence comme fallback pour les dépôts privés et une sortie JSON plus riche. Pour compléter cet outillage, [mn](/help/linux/mn) offre un menu interactif pour gérer vos connexions SSH, repos locaux et alias Bash depuis le terminal.

## Options {#options}

| Option            | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `-h, --help`      | Afficher l'aide                                        |
| `-v, --version`   | Afficher la version                                    |
| `--check-update`  | Vérifier si une nouvelle version de gft est disponible |
| `--assets`        | Lister les assets binaires de la release               |
| `--detect`        | Détecter l'OS/arch, mettre en évidence l'asset idéal   |
| `--get <pattern>` | Télécharger l'asset correspondant au pattern           |
| `--notes`         | Afficher les notes de release                          |
| `--json`          | Sortie au format JSON                                  |
| `-q, --quiet`     | Afficher uniquement le tag de version                  |
| `--no-color`      | Désactiver la sortie colorée                           |

## Variables d'environnement {#env}

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `NO_COLOR`     | Définir à n'importe quelle valeur pour désactiver les couleurs |
| `GITHUB_TOKEN` | Pour augmenter les limites d'API (5000/h vs 60/h)              |

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