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
curl -fsSL https://dropr.sylvain.sh/bash/gft@latest/install.sh | sh
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
gft [options] [--] <user/repo> [tag]
```

Les options peuvent précéder ou suivre le dépôt. Tout ce qui suit `--` est un dépôt ou un tag, jamais une option ni une commande.

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

# Choisir le dossier des téléchargements ou du binaire installé
gft cli/cli --get linux-amd64.tar.gz --dir ~/Downloads
gft junegunn/fzf --install --dir ~/.local/bin

# Sortie JSON (voir la section dédiée)
gft cli/cli --json
gft cli/cli --releases --json

# Terminer les options : ce qui suit est un dépôt ou un tag
gft -- <dépôt> <tag>

# Comparer deux releases
gft cli/cli v2.40.0..v2.50.0

# Lister les dernières releases (une dizaine)
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

### Gestion de stash Git {#stash}

```bash
# Lister les stash du repo courant
gft stash list

# Voir le diff d'un stash
gft stash show 1

# Supprimer un stash (avec confirmation)
gft stash drop 0

# Supprimer tous les stash sans confirmation
gft stash clean -y
```

## Alias {#alias}

`gfv` est disponible comme alias de `gft`.

## Fonctionnalités {#features}

- Détection automatique de la dernière release
- Listage des assets binaires (`--assets`)
- Listage des dernières releases (`--releases`, première page)
- Inclusion des pre-releases (`--pre`)
- Détection automatique de la plateforme (`--detect`) — trouve le bon binaire pour votre OS/arch
- Téléchargement direct par pattern (`--get`)
- Installation automatique de binaires dans le PATH (`--install`)
- Téléchargement d'archives source non-interactif (`--source zip|tar`)
- Vérification SHA256 après téléchargement (`--checksum`)
- Affichage des notes de release (`--notes`)
- Sortie JSON stable pour les scripts (`--json`), avec les mêmes clés, que `gh` soit connecté ou non
- Dossier de destination unique pour les téléchargements et le binaire installé (`--dir`)
- Commandes reconnues seulement en premier argument, `--` pour terminer les options
- Mode silencieux — juste la chaîne de version (`-q`)
- Comparaison de versions (`v1.0..v2.0`)
- Vérification des mises à jour (`--check-update`)
- Auto-mise à jour intégrée (`gft update`)
- Ouverture de la page release dans le navigateur (`--open`)
- Cache local des réponses (`~/.config/gft/cache/`) avec TTL configurable via `GFT_CACHE_TTL`
- Fonctionne sans authentification GitHub
- Lecture des données de release via le CLI `gh` quand il est installé et connecté, avec le même JSON dans les deux cas
- Indicateur de chargement sur les opérations réseau (`GFT_NO_SPINNER` pour le couper)
- Repli automatique en ASCII sur les terminaux non UTF-8 (`GFT_ASCII` pour le forcer)
- Respecte la convention `NO_COLOR` et la détection de pipe
- Complétion Bash et Zsh
- Page de manuel (`man gft`)
- Gestion de stash Git (`gft stash list|show|drop|clean`)

## Fonctionnement {#internals}

gft récupère directement les pages de releases GitHub, donc il :

- Ne nécessite **aucune authentification** (pas de configuration de token)
- N'a **aucun problème de rate limit** sans `gh` (il lit des pages web, pas l'API)
- Fonctionne sur n'importe quelle machine avec `curl` et `bash`

Les réponses sont mises en cache localement dans `~/.config/gft/cache/` pour éviter les requêtes réseau répétées (TTL par défaut : 300 secondes, configurable via `GFT_CACHE_TTL`). Utiliser `--no-cache` pour ignorer le cache ponctuellement, ou `--clear-cache` pour le vider entièrement.

Lorsque le CLI `gh` est installé et authentifié, gft lit les données de release depuis l'API GitHub à travers lui ; le JSON a les mêmes clés dans les deux cas. Pour compléter cet outillage, [mn](/help/linux/mn) offre un menu interactif pour gérer vos connexions SSH, repos locaux et alias Bash depuis le terminal.

## Commandes {#commands}

| Commande             | Description                                   |
| -------------------- | --------------------------------------------- |
| `gft update`         | Mettre à jour gft vers la dernière version    |
| `gft delete`         | Désinstaller gft (alias : `uninstall`)        |
| `gft stash [action]` | Gérer les stash git (list, show, drop, clean) |

Ces commandes ne sont reconnues qu'en premier argument : `gft user/update` ou `gft cli/cli stash` n'en lancent jamais.

## Options {#options}

| Option                 | Description                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `--`                   | Fin des options : ce qui suit est un dépôt ou un tag                                                      |
| `-h, --help`           | Afficher l'aide                                                                                           |
| `-v, --version`        | Afficher la version                                                                                       |
| `--check-update`       | Vérifier si une nouvelle version de gft est disponible                                                    |
| `--upgrade`            | Mettre à jour gft vers la dernière version                                                                |
| `--releases, --list`   | Lister les dernières releases (première page)                                                             |
| `--assets`             | Lister les assets binaires de la release                                                                  |
| `--detect`             | Détecter l'OS/arch, mettre en évidence l'asset idéal                                                      |
| `--get <pattern>`      | Télécharger l'asset correspondant au pattern                                                              |
| `--install`            | Télécharger, extraire et installer le binaire dans le PATH                                                |
| `--dir <dossier>`      | Y écrire les fichiers de `--get` et `--source`, le téléchargement interactif et le binaire de `--install` |
| `--source zip\|tar`    | Télécharger l'archive source (non-interactif)                                                             |
| `--checksum, --verify` | Vérifier l'intégrité SHA256 après téléchargement                                                          |
| `--notes`              | Afficher les notes de release                                                                             |
| `--json`               | Sortie au format JSON                                                                                     |
| `-q, --quiet`          | Afficher uniquement le tag de version                                                                     |
| `--pre, --prerelease`  | Inclure les pre-releases lors de la résolution du latest                                                  |
| `--open`               | Ouvrir la page de release dans le navigateur                                                              |
| `--no-color`           | Désactiver la sortie colorée                                                                              |
| `--no-cache`           | Ignorer le cache de réponses                                                                              |
| `--clear-cache`        | Vider tout le cache                                                                                       |
| `-y, --yes`            | Supprimer des stash sans confirmation (`gft stash`)                                                       |

## Variables d'environnement {#env}

| Variable         | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `NO_COLOR`       | Définir à n'importe quelle valeur pour désactiver les couleurs            |
| `GITHUB_TOKEN`   | Lu par `gh` (s'il est installé) pour s'authentifier, pas par gft lui-même |
| `GFT_CACHE_TTL`  | Durée du cache en secondes (défaut : 300)                                 |
| `GFT_NO_SPINNER` | Définir à n'importe quelle valeur pour couper l'indicateur de chargement  |
| `GFT_ASCII`      | Définir à n'importe quelle valeur pour forcer les symboles ASCII          |

## Sortie JSON {#json}

`gft <user/repo> [tag] --json` affiche un seul objet, avec les mêmes clés, que les données viennent de l'API GitHub (`gh` connecté) ou des pages web. La sortie est compacte sur une seule ligne quand la sortie standard n'est pas un terminal, et indentée sur un terminal.

```json
{
    "schema": 1,
    "repository": "cli/cli",
    "tag": "v2.104.0",
    "name": "GitHub CLI 2.104.0",
    "published_at": "2026-11-12T19:03:51Z",
    "prerelease": false,
    "release_url": "https://github.com/cli/cli/releases/tag/v2.104.0",
    "repo_url": "https://github.com/cli/cli",
    "zip_url": "https://github.com/cli/cli/archive/refs/tags/v2.104.0.zip",
    "tarball_url": "https://github.com/cli/cli/archive/refs/tags/v2.104.0.tar.gz",
    "source": "api",
    "assets": [
        {
            "name": "gh_2.104.0_checksums.txt",
            "url": "https://github.com/cli/cli/releases/download/v2.104.0/gh_2.104.0_checksums.txt",
            "digest": "sha256:180df77fb931591d5d65e33f02a76c9ade314d1c335569af73cc6c8fcb365d2c"
        }
    ]
}
```

| Clé                                                 | Type           | Remarques                                                                 |
| --------------------------------------------------- | -------------- | ------------------------------------------------------------------------- |
| `schema`                                            | entier         | `1`, augmenté seulement lors d'un changement incompatible                 |
| `repository`                                        | chaîne         | Tel que donné sur la ligne de commande                                    |
| `tag`                                               | chaîne         | Tag de la release                                                         |
| `name`                                              | chaîne         | Titre de la release, ou le tag si elle n'en a pas                         |
| `published_at`                                      | chaîne \| null | Date de publication, ISO 8601 en UTC                                      |
| `prerelease`                                        | booléen        |                                                                           |
| `release_url`, `repo_url`, `zip_url`, `tarball_url` | chaîne         |                                                                           |
| `source`                                            | chaîne         | `"api"` (via `gh`) ou `"web"` (pages GitHub)                              |
| `assets`                                            | tableau        | Trié par nom : `name`, `url` (chaînes), `digest` (`"sha256:..."` ou null) |

Quand la release est introuvable, rien n'est écrit sur la sortie standard : l'erreur va sur la sortie d'erreur et le code de sortie est 1.

`gft <user/repo> --releases --json` affiche un tableau des dix premières releases, de la plus récente à la plus ancienne, chacune avec `tag`, `name`, `published_at` et `prerelease` (typés comme ci-dessus), ou `[]` s'il n'y en a aucune.

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
| Taille                      | ~60 Ko                 | ~50 Mo                           |

## Prérequis {#prerequisites}

- `curl` (pour les requêtes HTTP)
- `bash` (>= 4.0)
- Connexion internet
- Optionnel : CLI `gh`, connecté, pour lire les données de release depuis l'API (`--json`, `--releases --json`, `--notes`)

## Dépannage {#troubleshooting}

### Dépôt introuvable

- Vérifier l'orthographe du nom d'utilisateur et du dépôt
- S'assurer que le dépôt est public : les dépôts privés ne sont pas pris en charge, même avec `gh`

### Aucune release trouvée

- Le dépôt n'a peut-être pas de releases
- Vérifier sur `https://github.com/username/repository/releases`

### Erreur de téléchargement

- Vérifier la connexion internet
- Le tag spécifié n'existe peut-être pas

## Limitations connues {#limitations}

- Dépôts publics uniquement : gft vérifie que le dépôt existe de façon anonyme sur github.com, donc un dépôt privé est refusé même si `gh` est connecté.
- Sans `--pre`, la résolution de la dernière release coupe à la barre oblique un tag qui en contient une. Il faut alors donner le tag explicitement (`gft owner/repo vscope/1.2.3`).
- Avec `--pre`, `-q` affiche le tag tel que GitHub l'encode dans la page (`core%4013.4.0`), alors que `--json` le décode (`core@13.4.0`).
- `--releases` et `--releases --json` ne couvrent que la première page de releases (une dizaine).
