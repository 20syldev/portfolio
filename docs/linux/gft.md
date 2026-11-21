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

### Via apt (Debian, Ubuntu) {#apt}

Depuis le [PPA Launchpad](https://launchpad.net/~20syldev/+archive/ubuntu/gft), pour Ubuntu 22.04, 24.04 et 26.04 et leurs dérivées :

```bash
sudo add-apt-repository ppa:20syldev/gft
sudo apt install gft
```

Il se met ensuite à jour comme n'importe quel autre paquet :

```bash
sudo apt update && sudo apt upgrade gft
```

Sous Debian, ou sans le PPA, utilisez le `.deb` joint à chaque [release GitHub](https://github.com/20syldev/gft/releases/latest) :

```bash
sudo apt install ./gft_<version>_all.deb
```

Le paquet s'appelle `gft` et est identique pour toutes les architectures. Il installe `/usr/bin/gft`, l'alias `gfv`, les complétions Bash et Zsh et la page de manuel. Il dépend de `curl` et de `mawk` ou `gawk`, recommande `git` (pour `gft stash`), `unzip` (pour les installations `.zip`) et `gh`, et suggère seulement `xdg-utils` (pour `--open`).

Chaque release fournit `gft_<version>_checksums.txt` (le SHA-256 du `.deb`) et sa signature minisign `gft_<version>_checksums.txt.minisig`. Pour vérifier un téléchargement, placez les trois fichiers dans un même dossier, récupérez la clé publique du dépôt au tag de la release, puis vérifiez :

```bash
curl -fsSLO https://raw.githubusercontent.com/20syldev/gft/<version>/packaging/minisign.pub
minisign -V -H -p minisign.pub -m gft_<version>_checksums.txt
sha256sum --strict -c gft_<version>_checksums.txt
```

`-H` fait refuser à minisign une signature ancienne qui n'est pas faite sur le hash du fichier ; celle de la release l'est, donc gardez-le.

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

`gft --check-update` compare les versions numériquement : une version plus ancienne signale une mise à jour, une version identique est à jour, et une version plus récente (un build de développement) est signalée comme telle et n'est jamais rétrogradée par `gft update`.

Un gft installé par apt est géré par apt :

- `gft update`, `gft --upgrade`, `gft delete` et `gft uninstall` ne changent rien : ils affichent la commande apt à lancer (`sudo apt update && sudo apt upgrade gft`, ou `sudo apt remove gft`) et sortent avec le code 1. Pour le `.deb` d'une release GitHub, l'indication est de télécharger le nouveau `.deb` depuis la page des releases puis de lancer `sudo apt install ./gft_<version>_all.deb`.
- `gft --check-update` fonctionne toujours et affiche cette même indication à la place de `gft --upgrade`.
- Ne mélangez pas `curl | sh` et apt : `install.sh`, `update.sh` et `delete.sh` refusent de s'exécuter tant que le paquet `gft` est installé, et affichent la commande apt.

Le paquet se signale par `/usr/share/gft/install-method`, que gft lit à côté du vrai script (`../share/gft/install-method`). Les installations faites avec `install.sh` ou à la main n'ont pas ce fichier et gardent leurs `gft update` et `gft delete` habituels.

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

# Télécharger un asset spécifique (--get prend un motif grep insensible à la casse)
gft cli/cli --get "linux-amd64.deb"

# Télécharger l'asset portant exactement ce nom (ni motif, ni menu)
gft cli/cli --asset=gh_2.104.0_linux_amd64.tar.gz

# Remplacer un fichier déjà présent (un téléchargement n'écrase jamais sinon)
gft cli/cli --get linux-amd64.tar.gz --force

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

# Installer dans ~/.local/bin (jamais /usr/local/bin)
gft cli/cli --install --user

# Une entrée par ligne pour les programmes (voir la section Scripts)
gft --releases --plain -- cli/cli
gft --assets --detect --plain -- cli/cli

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
- Vérification SHA-256 ou SHA-512 après téléchargement (`--checksum`), stricte : elle échoue quand elle ne peut pas conclure
- Téléchargement par nom de fichier exact (`--asset=NOM`), jamais par-dessus un fichier existant sans `--force`
- Installation pour l'utilisateur seul (`--install --user`)
- Sortie orientée lignes pour les programmes (`--plain`), avec des codes de sortie fixes
- Affichage des notes de release (`--notes`)
- Sortie JSON stable pour les scripts (`--json`), avec les mêmes clés, que `gh` soit connecté ou non
- Dossier de destination unique pour les téléchargements et le binaire installé (`--dir`)
- Commandes reconnues seulement en premier argument, `--` pour terminer les options
- Mode silencieux — juste la chaîne de version (`-q`)
- Comparaison de versions (`v1.0..v2.0`)
- Vérification des mises à jour (`--check-update`)
- Auto-mise à jour intégrée (`gft update`) et désinstallation (`gft delete`), laissées à apt quand gft est installé en paquet
- Ouverture de la page release dans le navigateur (`--open`)
- Cache local des réponses (`~/.config/gft/cache/`, dossier configurable via `GFT_CACHE_DIR`) avec TTL configurable via `GFT_CACHE_TTL`
- Fonctionne sans authentification GitHub
- Suit les dépôts renommés ou transférés et indique leur nouveau nom
- Lecture des données de release via le CLI `gh` quand il est installé et connecté, avec le même JSON dans les deux cas
- Indicateur de chargement sur les opérations réseau (`GFT_NO_SPINNER` pour le couper)
- Repli automatique en ASCII sur les terminaux non UTF-8 (`GFT_ASCII` pour le forcer)
- Respecte la convention `NO_COLOR` et la détection de pipe
- Paquet Debian (`.deb`) avec sommes de contrôle signées, et PPA Ubuntu
- Complétion Bash et Zsh
- Page de manuel (`man gft`)
- Gestion de stash Git (`gft stash list|show|drop|clean`)

## Fonctionnement {#internals}

gft récupère directement les pages de releases GitHub, donc il :

- Ne nécessite **aucune authentification** (pas de configuration de token)
- N'a **aucun problème de rate limit** sans `gh` (il lit des pages web, pas l'API)
- Fonctionne sur n'importe quelle machine avec `curl` et `bash`

Les réponses sont mises en cache localement dans `~/.config/gft/cache/` pour éviter les requêtes réseau répétées (TTL par défaut : 300 secondes, configurable via `GFT_CACHE_TTL` ; dossier configurable via `GFT_CACHE_DIR`). Utiliser `--no-cache` pour ignorer le cache ponctuellement, ou `--clear-cache` pour le vider : seules les entrées que gft a écrites sont supprimées, pas les autres fichiers du dossier.

gft suit aussi les dépôts renommés ou transférés : une redirection de GitHub est suivie, et le nouveau nom est utilisé (et rapporté dans le champ `repository` du JSON).

Lorsque le CLI `gh` est installé et authentifié, gft lit les données de release depuis l'API GitHub à travers lui ; le JSON a les mêmes clés dans les deux cas. Pour compléter cet outillage, [mn](/help/linux/mn) offre un menu interactif pour gérer vos connexions SSH, repos locaux et alias Bash depuis le terminal. Son successeur [tote](/help/linux/tote) livre un plugin qui s'appuie sur gft pour gérer les stashes d'un dépôt enregistré et afficher sa dernière release, ses assets et ses notes.

## Commandes {#commands}

| Commande             | Description                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `gft update`         | Mettre à jour gft vers la dernière version (affiche la commande apt à la place quand gft est installé par apt) |
| `gft delete`         | Désinstaller gft, alias : `uninstall` (affiche la commande apt à la place quand gft est installé par apt)      |
| `gft stash [action]` | Gérer les stash git (list, show, drop, clean)                                                                  |

Ces commandes ne sont reconnues qu'en premier argument : `gft user/update` ou `gft cli/cli stash` n'en lancent jamais.

## Options {#options}

| Option                 | Description                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--`                   | Fin des options : ce qui suit est un dépôt ou un tag                                                                         |
| `-h, --help`           | Afficher l'aide                                                                                                              |
| `-v, --version`        | Afficher la version                                                                                                          |
| `--check-update`       | Vérifier si une nouvelle version de gft est disponible (plus ancienne, à jour ou plus récente que la release)                |
| `--upgrade`            | Mettre à jour gft vers la dernière version                                                                                   |
| `--releases, --list`   | Lister les dernières releases (première page)                                                                                |
| `--assets`             | Lister les assets binaires de la release                                                                                     |
| `--detect`             | Détecter l'OS/arch, mettre en évidence l'asset idéal                                                                         |
| `--get <pattern>`      | Télécharger l'asset correspondant à une expression régulière basique (`grep -i`) ; plusieurs résultats demandent lequel      |
| `--asset <nom>`        | Télécharger l'asset portant exactement ce nom de fichier, ou l'installer avec `--install`                                    |
| `--install`            | Télécharger, extraire et installer le binaire dans le PATH                                                                   |
| `--user`               | Avec `--install` : installer dans `~/.local/bin` (jamais `/usr/local/bin`)                                                   |
| `--force`              | Remplacer un fichier existant ; les téléchargements refusent de le faire sinon                                               |
| `--plain`              | Avec `--releases` ou `--assets` : une entrée par ligne, rien d'autre                                                         |
| `--dir <dossier>`      | Y écrire les fichiers de `--get`, `--asset` et `--source`, le téléchargement interactif et le binaire de `--install`         |
| `--source zip\|tar`    | Télécharger l'archive source (non-interactif)                                                                                |
| `--checksum, --verify` | Vérifier le SHA-256 (ou SHA-512) d'un téléchargement avec le fichier de sommes de la release ; échoue quand c'est impossible |
| `--notes`              | Afficher les notes de release                                                                                                |
| `--json`               | Sortie au format JSON                                                                                                        |
| `-q, --quiet`          | Afficher uniquement le tag de version                                                                                        |
| `--pre, --prerelease`  | Inclure les pre-releases lors de la résolution du latest (avec `--releases --plain` : les lister)                            |
| `--open`               | Ouvrir la page de release dans le navigateur                                                                                 |
| `--no-color`           | Désactiver la sortie colorée                                                                                                 |
| `--no-cache`           | Ignorer le cache de réponses                                                                                                 |
| `--clear-cache`        | Vider le cache (seulement les entrées écrites par gft)                                                                       |
| `-y, --yes`            | Supprimer des stash sans confirmation (`gft stash`)                                                                          |

`--dir`, `--source` et `--asset` acceptent aussi la forme `--option=valeur`, et `--pre`, `--no-cache` et `--checksum` (alias `--verify`) acceptent `=true|false` (ainsi que `1`, `0`, `yes`, `no`, `on`, `off`, quelle que soit la casse). La dernière occurrence sur la ligne l'emporte, et une valeur invalide est une erreur d'usage (code de sortie 2). `--dir=~` et `--dir=~/dossier` développent eux-mêmes le tilde. `--dir` exige toujours un dossier existant et accessible en écriture.

## Scripts et codes de sortie {#scripting}

### Code de sortie {#exit-status}

| Code | Signification                                                                                                                                                                                   |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Succès, y compris une liste vide                                                                                                                                                                |
| 1    | Une erreur : dépôt ou release introuvable, erreur réseau, fichier déjà existant, téléchargement ou somme de contrôle en échec                                                                   |
| 2    | Une erreur d'usage : valeur ou combinaison d'options invalide, `--asset` qui n'est pas un nom de fichier simple ou qui désigne plusieurs assets, plusieurs résultats pour `--get` sans terminal |

Les formes séparées des options déjà existantes gardent le code 1 pour leurs erreurs d'usage (`--source rar`, `--dir` sans valeur, une option inconnue). Leurs formes `=` (`--source=rar`, `--dir=`) sont des erreurs d'usage de code 2, comme un booléen invalide.

### Sortie `--plain` {#plain}

`gft --releases --plain [--pre[=BOOL]] -- user/repo` et `gft --assets --plain [--detect] [--pre[=BOOL]] -- user/repo [tag]` affichent une entrée par ligne sur la sortie standard et rien d'autre : ni titre, ni astuce, ni indicateur de chargement, ni couleur. Les messages et les erreurs vont sur la sortie d'erreur, et l'entrée standard n'est jamais lue.

```
$ gft --releases --plain -- cli/cli
v2.104.0	2026-11-12
v2.103.3	2026-10-26

$ gft --assets --detect --plain -- cli/cli
gh_2.104.0_linux_amd64.tar.gz	recommended
gh_2.104.0_checksums.txt
gh_2.104.0_linux_386.deb
```

- `--releases --plain` : la première page de releases (dix au plus), de la plus récente à la plus ancienne, sous la forme `tag<TAB>AAAA-MM-JJ`, avec ` prerelease` après la date pour une pre-release. Les pre-releases n'apparaissent qu'avec `--pre`.
- `--assets --plain` : les noms de fichiers des assets, décodés et sans doublon. Avec `--detect`, ceux qui conviennent à ce système passent en premier, avec `recommended` en seconde colonne (les paquets, sommes de contrôle et signatures ne sont jamais recommandés, puisque `--install` ne les choisit jamais).
- Les mots `recommended` et `prerelease` sont fixes : ils ne sont pas traduits et ne dépendent pas de la locale.
- Les noms qui ne ressemblent pas à un nom de fichier ou de tag simple sont écartés : lignes vides, caractères de contrôle ou invisibles, octets UTF-8 invalides, tabulations, doublons, tags contenant `..`, tags `latest`, `main` et `master`, et, pour les assets, tout nom avec une barre oblique, une barre oblique inverse ou un point initial. Au plus 200 lignes sont affichées.
- Seules les pages publiques sont lues (jamais `gh`, jamais l'API) : rien n'est listé pour un dépôt privé.
- Toute l'exécution, requêtes comprises, a une seule limite de temps de 8 secondes (`GFT_PLAIN_TIMEOUT`, secondes entières de 1 à 9999). Si le temps s'écoule pendant la lecture d'une longue liste, la liste est coupée et un message va sur la sortie d'erreur.
- Code de sortie : 0 avec une sortie vide quand il n'y a rien à lister, 1 pour une erreur réseau ou un dépôt inexistant, 2 pour une erreur d'usage. `--plain` va avec `--releases` ou `--assets` (`--detect` compte) et avec aucun autre mode (`--json`, `-q`, `--get`, `--install`…) ; les options qui ne s'appliquent pas à une liste (`--force`, `--dir`, `--checksum`) sont acceptées et ignorées.

### Téléchargements {#downloads}

- `--asset=NOM` compare exactement le nom de fichier, après décodage de l'URL : ni motif, ni sous-chaîne, ni menu. Un nom qui n'est pas un nom de fichier simple (barre oblique, barre oblique inverse, point initial, caractère de contrôle) est refusé. Il fonctionne seul (téléchargement) et avec `--install`. Sans correspondance le code est 1, et quand deux assets se décodent en un même nom gft s'arrête avec le code 2 plutôt que d'en choisir un.
- `--get` prend une expression régulière basique pour `grep -i`, donc `.` correspond à n'importe quel caractère. Quand plusieurs assets correspondent et qu'il n'y a pas de terminal, gft les liste sur la sortie d'erreur et sort avec le code 2 au lieu d'attendre une réponse.
- Un téléchargement ne remplace jamais un fichier existant (`--get`, `--asset`, `--source`) : ajoutez `--force`. `--install` remplace toujours le binaire installé, c'est ainsi qu'une mise à jour fonctionne : le nouveau binaire est écrit à côté puis renommé par-dessus, si bien qu'un binaire en lecture seule ou en cours d'exécution et un lien symbolique sont remplacés et jamais écrits au travers. Un téléchargement échoué ou interrompu ne laisse rien, et une page d'erreur HTTP n'est jamais enregistrée comme fichier.
- `--source` nomme le fichier d'après le tag, rendu inoffensif : une barre oblique ou tout caractère hors lettres, chiffres et `._@+-` devient `_`, et les points initiaux sont retirés.
- `--install` sans `--asset` ni `--get` ne choisit qu'un `.tar.gz`, un `.tgz`, un `.zip` ou un binaire simple : jamais un paquet (`.deb`, `.rpm`, `.apk`, `.pkg`, `.msi`, `.dmg`, `.snap`…), un fichier de somme de contrôle, de signature ou de SBOM, ni une archive que gft ne sait pas extraire (`.tar.xz`, `.7z`…). Nommez un tel fichier avec `--asset` pour l'installer quand même.
- `--install --user` installe dans `~/.local/bin`, créé si besoin. Sans lui, gft garde son ordre : `/usr/local/bin` s'il est accessible en écriture, sinon `~/.local/bin`, sinon `~/bin`. `--user` et `--dir` ne se combinent pas.

### Sommes de contrôle {#checksums}

`--checksum` compare le téléchargement à un fichier de sommes de la même release, et échoue (code non nul) dès qu'il ne peut pas conclure : pas de fichier de sommes, fichier absent de la liste, aucun hash trouvé, hash ni SHA-256 ni SHA-512, ni `sha256sum` ni `shasum` (`sha512sum` pour du SHA-512), ou fichier de sommes impossible à télécharger. Le téléchargement est vérifié avant d'être mis en place : en cas d'écart ou de tout autre échec, il est supprimé, et un fichier qui existait avant (avec `--force`) est conservé. `--checksum` ne va pas avec `--source` (une archive source n'a pas de fichier de sommes) : c'est une erreur d'usage, code 2. Les noms de la liste sont comparés exactement (un `*` initial est ignoré), et un fichier qui ne contient qu'un seul hash ne vaut que pour le fichier dont il porte le nom (`app.tar.gz.sha256`). Cela prouve que le téléchargement est intact, pas qu'il est authentique : la liste vient de la même release.

### Autres comportements {#other}

- `-q` sur un dépôt sans aucune release affiche `No release found` sur la sortie d'erreur et sort avec le code 1, au lieu d'afficher `main`.
- `gft user/repo v1..v2` compare les tags décodés, donc les tags à portée comme `astro@7.0.0` sont trouvés.

## Variables d'environnement {#env}

| Variable            | Description                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NO_COLOR`          | Définir à n'importe quelle valeur pour désactiver les couleurs                                                                                   |
| `GITHUB_TOKEN`      | Lu par `gh` (s'il est installé) pour s'authentifier, pas par gft lui-même                                                                        |
| `GFT_CACHE_TTL`     | Durée du cache en secondes (défaut : 300)                                                                                                        |
| `GFT_CACHE_DIR`     | Dossier du cache des réponses (défaut : `~/.config/gft/cache`) ; `--clear-cache` ne supprime que les entrées de cache (`https_*`) qu'il contient |
| `GFT_PLAIN_TIMEOUT` | Limite de temps de `--plain` en secondes, pour toute l'exécution : 1 à 9999 (défaut : 8)                                                         |
| `GFT_NO_SPINNER`    | Définir à n'importe quelle valeur pour couper l'indicateur de chargement                                                                         |
| `GFT_ASCII`         | Définir à n'importe quelle valeur pour forcer les symboles ASCII                                                                                 |

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
| `repository`                                        | chaîne         | Tel que donné, ou son nom actuel s'il a été renommé ou transféré          |
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
| Dépendances                 | curl, bash, awk, grep  | Binaire Go (~50 Mo)              |
| Taille                      | ~90 Ko                 | ~50 Mo                           |

## Prérequis {#prerequisites}

- `curl` (pour les requêtes HTTP)
- `bash` (>= 4.0)
- Connexion internet
- `mawk` ou `gawk`, et `grep` GNU (présents sur Debian et Ubuntu ; le paquet apt dépend de `curl` et de `mawk | gawk`)
- Optionnel : CLI `gh`, connecté, pour lire les données de release depuis l'API (`--json`, `--releases --json`, `--notes`)

## Dépannage {#troubleshooting}

### Dépôt introuvable ou privé

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
