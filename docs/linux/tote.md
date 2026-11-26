---
title: "Lanceur terminal tote"
description: "Lanceur en terminal pour connexions SSH, dépôts Git, alias et fonctions shell, avec interface plein écran, palette, plugins soumis à consentement et mises à jour signées."
category: linux
slug: tote
order: 4
---

> **Version documentée : tote 1.2.0.** tote est le successeur de [mn](/help/linux/mn) : les mêmes domaines (connexions, dépôts, alias, fonctions), réécrits en Go. Les deux outils coexistent ; mn reste installable et fonctionne comme avant. Voir [Reprendre ses données de mn](#from-mn).

## Installation {#install}

| Canal              | Notes                                                                      |
| ------------------ | -------------------------------------------------------------------------- |
| Script             | Installe dans `~/.local/bin`, sans `sudo` (voir ci-dessous)                |
| PPA Ubuntu         | `ppa:totecli/tote`, nouveau dans la 1.1.0, mis à jour par `apt`            |
| `.deb`             | Joint à chaque release GitHub, sans source `apt`                           |
| Archives           | `tote_<version>_<os>_<arch>.tar.gz` pour Linux et macOS, en amd64 et arm64 |
| `go install`       | Demande Go 1.26 ou plus récent                                             |
| Depuis les sources | Dans un clone du dépôt, avec `make build`                                  |

### Via curl (recommandée) {#curl}

```bash
curl -fsSL https://dropr.sylvain.sh/bash/tote@latest/install.sh | sh
```

Pour une version précise :

```bash
curl -fsSL https://dropr.sylvain.sh/bash/tote@latest/install.sh | sh -s -- 1.2.0
```

Le script télécharge l'archive de votre système depuis GitHub Releases, compare son SHA-256 au fichier de sommes signé, vérifie la signature minisign quand un vérificateur est disponible (`minisign`, sinon OpenSSL 3), installe tote dans `~/.local/bin` et écrit un reçu d'installation. Il n'utilise jamais `sudo` et ne modifie jamais vos fichiers de démarrage : l'[intégration au shell](#shell) reste à ajouter vous-même.

Sur Ubuntu, pour une version stable, le script rappelle d'abord l'existence du PPA et, sur un terminal, demande s'il doit installer tote lui-même (répondre `n` n'installe rien). `TOTE_INSTALL_YES=1` supprime la question. Si tote est déjà installé par `apt`, le script le dit et s'arrête : retirez d'abord le paquet (`sudo apt remove tote`) ou passez `TOTE_INSTALL_FORCE=1`.

### Via apt (Ubuntu) {#apt}

Depuis le [PPA Launchpad](https://launchpad.net/~totecli/+archive/ubuntu/tote), pour Ubuntu 22.04, 24.04 et 26.04 en amd64 et arm64 (Linux Mint 22 utilise les paquets de 24.04) :

```bash
sudo add-apt-repository ppa:totecli/tote
sudo apt install tote
```

Il se met ensuite à jour comme n'importe quel autre paquet :

```bash
sudo apt update && sudo apt upgrade tote
```

Le PPA ne reçoit que les versions stables, jamais les bêtas. Il n'existe pas de dépôt `apt` pour Debian : utilisez le `.deb`.

### Paquet .deb {#deb}

Le fichier `tote_<version>_linux_<arch>.deb` est joint à chaque [release GitHub](https://github.com/totecli/tote/releases/latest). Il n'est lié à aucune source `apt` et tote ne se met jamais à jour seul : pour mettre à jour, téléchargez le nouveau fichier et relancez l'installation.

```bash
sudo apt install ./tote_<version>_linux_<arch>.deb
```

### Via go install {#go}

```bash
go install github.com/totecli/tote/cmd/tote@latest
```

### Depuis les sources {#source}

```bash
git clone https://github.com/totecli/tote.git && cd tote
make build VERSION=1.2.0-local        # writes bin/tote
```

Un tote compilé depuis les sources ou installé par `go install` n'a pas de clé de release : `tote update` refuse d'installer quoi que ce soit (`tote update --check` cherche quand même une release et, dans le dossier bin de Go, affiche la commande `go install`) et [`tote doctor`](#doctor) avertit. C'est normal.

### Vérifier un téléchargement {#verify}

Chaque release fournit `tote_<version>_checksums.txt` et sa signature minisign. Les clés publiques des releases sont une clé courante et une clé suivante gardée hors ligne :

```bash
# current: RWTTj50yYWk72oCPtVJZ8hrpENxKKpQHDtQl3l1JkOxauemhwepIFON3
# next (kept offline): RWS7eI0zAwZGD3nDouKjNMVgt3opeJ9Lf3K3RNRKeNYIV1Hm9L0UirQT
sha256sum -c tote_1.2.0_checksums.txt --ignore-missing      # macOS: shasum -a 256 -c
minisign -V -H -P <public key> -m tote_1.2.0_checksums.txt  # reads the .minisig next to it
```

## Intégration au shell {#shell}

Un programme ne peut ni changer le répertoire du shell qui l'a lancé, ni écrire sur son invite. tote le fait avec une petite fonction chargée une fois.

Pour bash, ajoutez cette ligne à `~/.bashrc` :

```bash
eval "$(tote init bash)"
```

Pour zsh, ajoutez celle-ci à `~/.zshrc` :

```bash
eval "$(tote init zsh)"
```

`tote init <bash|zsh>` affiche le code et n'écrit rien. Il apporte :

- **Une fonction `tote`** autour du binaire. Elle lui confie un fichier temporaire privé (`TOTE_HANDOFF`), puis fait ce que le binaire y a laissé : `cd` vers un dépôt, mettre une commande sur l'invite (`read -e -i` en bash, `print -z` en zsh), recharger les définitions ou quitter. C'est pourquoi Entrée sur un dépôt change votre répertoire.
- **Vos alias et fonctions** comme de vrais alias et fonctions shell. Chaque dépôt devient aussi un alias qui lance `tote repo open <nom>` : taper son nom y mène.
- **Le dossier `bin`** du répertoire de données ajouté à votre `PATH`.
- **La complétion** des commandes, des noms de connexions, des identifiants de plugins et des principales options, pour bash et pour zsh (quand `compinit` est chargé).
- **Un rechargement** après chaque modification faite dans l'interface : les nouveaux alias fonctionnent sans ouvrir un nouveau shell.

`tote init <shell> --defs` n'affiche que les définitions (alias, fonctions, ligne `PATH` et complétion), ce que lance le rechargement. Sans l'intégration, le programme fonctionne mais `cd` est impossible : `tote repos open` affiche alors seulement le chemin. `tote doctor` indique si la ligne est en place.

Les noms dont le shell ou tote ont besoin (`tote`, `source`, `eval`, les mots-clés...) sont refusés pour un enregistrement. Pour définir aussi une fonction nommée `mn`, voir le réglage `shell.compat_mn` dans la [configuration](#config).

Le fichier d'échange est créé dans `$XDG_RUNTIME_DIR`, à défaut `$TMPDIR`, à défaut `/tmp`. Si aucun n'est utilisable, la fonction le dit une fois et lance le binaire sans `cd` ni commande sur l'invite. Un chemin relatif renvoyé pour `cd` est rendu explicite (`./nom`) pour que `CDPATH` ne soit jamais consulté.

## Les quatre domaines {#records}

tote garde quatre sortes d'enregistrements, chacun dans un fichier TOML lisible :

| Sorte      | Ce que fait Entrée dans l'interface                                        |
| ---------- | -------------------------------------------------------------------------- |
| Connexions | Ouvre une session `ssh`, éventuellement par une commande `via` (un rebond) |
| Dépôts     | Change le répertoire de votre shell vers le dépôt                          |
| Alias      | Met la commande sur l'invite, prête à être lancée                          |
| Fonctions  | Met le nom de la fonction sur l'invite, prêt à être lancé                  |

Un nom est unique parmi les alias, les dépôts et les fonctions, puisque chacun devient un mot de votre shell.

## Interface {#usage}

`tote` sans argument, dans un terminal, ouvre l'interface plein écran ; dans un tube ou un script, il affiche l'aide. `tote co`, `tote repos`, `tote alias` et `tote funcs` sans argument l'ouvrent sur la liste correspondante (depuis la 1.2 pour les trois dernières), et `tote config` sur les réglages. L'option `--ascii` remplace les symboles par de l'ASCII.

L'accueil est un cadre de bienvenue avec le nombre d'enregistrements de chaque sorte et un menu : Connexions, Dépôts, Alias, Fonctions, Plugins, Réglages. Une liste montre une sorte, triée par nom sans tenir compte de la casse (depuis la 1.2, voir `ui.sort`), en colonnes qui disparaissent par la droite quand le terminal se réduit, avec une ligne de filtre et un panneau affichant la commande exacte que Entrée lancerait (ou le chemin d'un dépôt et sa branche Git). La palette cherche dans tous les enregistrements depuis n'importe où, les réglages se changent sur place et sont enregistrés aussitôt, l'écran Plugins liste les plugins installés et livrés avec leur état, et `?` liste toutes les touches qui s'appliquent.

### Touches {#keys}

| Touche                                       | Où                                 | Action                                                                                                                     |
| -------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `1` à `4`, et `5` si les plugins sont actifs | Accueil                            | Ouvrir la sorte ou Plugins, dans l'ordre du menu. Les réglages n'ont pas de chiffre : utilisez `,`                         |
| `↑` `↓` `k` `j`                              | Partout                            | Se déplacer. `h` et `l` (ou `←` et `→`) changent de sorte dans une liste                                                   |
| `Entrée`                                     | Listes                             | Utiliser l'enregistrement : se connecter, aller au dépôt, mettre la commande sur l'invite                                  |
| `/`                                          | Listes                             | Filtrer : les noms et alias qui commencent par le texte passent en premier. `Entrée` applique le filtre ; `Échap` l'efface |
| `n` `e` `d` `v` `C`                          | Listes                             | Nouveau, modifier, supprimer (après confirmation), détails, copier. Sur l'écran Plugins, `d` supprime                      |
| `v`                                          | Réglages                           | Description complète, valeurs et note du réglage choisi (le panneau sous les lignes coupe les textes longs)                |
| `u` `U` `c`                                  | Connexions                         | Utilisateur suivant, choisir un utilisateur, mettre la commande `ssh` sur l'invite                                         |
| `o`                                          | Dépôts                             | Ouvrir le dépôt dans l'éditeur                                                                                             |
| `Tab`                                        | Dépôts, Plugins                    | Menu d'actions de la ligne (Dépôts : les actions ajoutées par les plugins)                                                 |
| `Ctrl+K`                                     | Partout                            | Palette de commandes                                                                                                       |
| `,`                                          | Partout                            | Réglages                                                                                                                   |
| `?` `F1`                                     | Partout                            | Aide                                                                                                                       |
| `Ctrl+R`                                     | Accueil, listes, Réglages, Plugins | Recharger les fichiers depuis le disque                                                                                    |
| `u` `U`                                      | Accueil, Réglages                  | Afficher l'avis de mise à jour, chercher une mise à jour maintenant                                                        |
| `Espace`                                     | Plugins                            | Activer ou désactiver le plugin                                                                                            |
| `a` `s` `i` `d` `c`                          | Plugins                            | Autoriser (consentement), réglages, installer, supprimer, vérifier                                                         |
| `Ctrl+L`                                     | Champ texte avec suggestions       | Formulaires de plugin (depuis la 1.1) : lister les valeurs que suggère le programme du plugin, puis en choisir une         |
| `Entrée` `Ctrl+S`                            | Champ texte de plusieurs lignes    | Formulaires de plugin (depuis la 1.2) : `Entrée` commence une nouvelle ligne, `Ctrl+S` envoie le formulaire                |
| `Échap`                                      | Partout                            | Revenir en arrière, fermer une fenêtre                                                                                     |
| `q`                                          | Partout                            | Quitter (pas pendant la saisie dans un champ)                                                                              |
| `Ctrl+C`                                     | Partout                            | Revenir en arrière, ne quitte jamais d'un coup (deux fois sur l'accueil pour quitter)                                      |
| `Ctrl+D` `Ctrl+Z`                            | Partout                            | Quitter, suspendre                                                                                                         |

Dans les formulaires, `Tab` passe au champ suivant, `Ctrl+S` enregistre et `Échap` annule. Sur la liste des connexions, `Entrée` après un filtre place le curseur sur la ligne dont le nom ou l'alias est exactement le texte tapé, et un second `Entrée` utilise l'enregistrement.

Sur un champ de formulaire de plugin qui propose des suggestions (`choices_from`, depuis la 1.1), `Ctrl+L` lance le programme qui les liste : rien ne démarre avant cette touche, vous pouvez toujours taper une valeur à la place, et `Échap` arrête le listage en gardant le formulaire. Une boîte de chargement affiche la commande lancée et les secondes écoulées.

Un champ texte de plusieurs lignes (`multiline`, depuis la 1.2) s'affiche comme une boîte : `Entrée` y commence une nouvelle ligne, `Tab` passe toujours au champ suivant et `Ctrl+S` envoie le formulaire.

### Souris {#mouse}

Le survol met en surbrillance, un clic sélectionne, un double clic ouvre, la molette fait défiler et un clic sur une touche du pied de page l'actionne. Glisser sélectionne du texte et le copie au relâchement ; `Maj`+glisser (`Option`+glisser dans iTerm2) laisse le terminal sélectionner à la place. Le réglage `ui.mouse` coupe le tout.

### Thèmes, taille et langue {#looks}

- **Thème** — `auto` (suit le fond du terminal), `dark` (pour un terminal sombre), `light` (pour un terminal clair) ou `mono`. tote ne peint aucun fond : un thème réglé à l'encontre du terminal peut être illisible, et l'écran Réglages le signale quand le terminal a dit quel est son fond (`d` revient à `auto`).
- **Couleurs** — détectées (truecolor, 256, 16 ou aucune) ; `TOTE_COLOR` et `NO_COLOR` sont respectées.
- **Accueil** — `box`, `compact` ou `off`. Sous 70 colonnes ou 20 lignes, le cadre est remplacé par un en-tête d'une ligne, et la largeur peut être plafonnée à 120 ou 160 colonnes.
- **Langue** — anglais par défaut, français en seconde langue, choisie par `TOTE_LANG`, puis le réglage `lang`, puis `LC_ALL`, `LC_MESSAGES` et `LANG`.

## Palette {#palette}

`Ctrl+K` ouvre la palette depuis n'importe quel écran. Elle cherche dans tous les enregistrements et dans quelques actions. Des préfixes la restreignent :

| Préfixe | Cherche dans |
| ------- | ------------ |
| `c `    | Connexions   |
| `r `    | Dépôts       |
| `a `    | Alias        |
| `d `    | Fonctions    |
| `>`     | Actions      |

Les plugins y ajoutent leurs commandes, accessibles par `>` (voir [Plugins](#plugins)). La palette et les listes de choix grandissent avec un terminal large ou haut, jusqu'à environ 60 % de sa taille, pour que les noms et les commandes longs soient moins coupés.

## Ligne de commande {#cli}

Chaque domaine s'utilise aussi sans l'interface. `tote help` liste les commandes et `tote help <commande>` affiche l'usage. Les commandes qui listent des enregistrements affichent un tableau dans un terminal et des lignes séparées par des tabulations dans un tube ; `--format table|tsv|json` choisit, et `--json` équivaut à `--format json`. Depuis la 1.2, le tableau suit `ui.sort` (par nom, sauf si le réglage vaut `"file"`), alors que `--format tsv` et `--format json` gardent toujours l'ordre du fichier. Les colonnes TSV sont positionnelles et une version ultérieure n'en ajoute qu'à la fin ; chaque document JSON commence par `"schema": 1` et ne fait que gagner des champs.

Les commandes sont `co` (aussi `connections`), `alias` (`a`), `repos` (`repo`, `r`), `funcs` (`f`), `plugin` (`plugins`), `config`, `doctor`, `update`, `uninstall`, `init`, `version` et `help`. `--no-plugins`, placé avant la commande, coupe tous les plugins pour une exécution (comme `TOTE_NO_PLUGINS=1`).

### Connexions : co {#co}

```bash
tote co -l [--format table|tsv|json | --json]
tote co <name|alias> [user]
tote co add <name> --target <host> [--via <command>] [--user <user>] [--alias <a,b>] [--ip <ip>] [--desc <text>]
tote co rm <name> [--yes]
```

`tote co <nom>` remplace tote par `ssh`. Un préfixe unique d'un nom ou d'un alias suffit dès qu'il compte `connect.prefix_min` caractères (2 par défaut), et un second argument change l'utilisateur de connexion.

`ssh` est toujours lancé sous la forme `ssh -l utilisateur -- cible` : une cible ou un utilisateur qui commence par `-` n'est jamais lu comme une option. Un `ssh` simple reçoit des options de keepalive, sauf si votre configuration ssh définit les siennes.

`--via` est une commande qui peut utiliser `{user@}`, `{user}`, `{host}`, `{ip}` et `{name}` ; vide, elle équivaut à un `ssh` simple. Elle est découpée sur les espaces et lancée sans shell : les guillemets ne sont pas interprétés (et sont refusés), donc mettez les options comme `ProxyCommand` dans `~/.ssh/config`. Son premier mot est un nom de commande cherché dans le `PATH` : un chemin absolu (`/usr/bin/ssh`) ou `./ssh` est refusé. `tote doctor` avertit quand ce programme est introuvable.

```bash
tote co add jump --target 10.0.0.5 --desc "behind the bastion" \
    --via 'ssh -t admin@jump.example.org {user@}{host}'
tote co add web --target host1.example.org --user admin --alias w,www
tote co web deploy      # same connection, other login user
```

### Alias : alias {#alias}

```bash
tote alias [list] [--format table|tsv|json | --json]
tote alias add <name> [--desc <text>] <command>
tote alias rm <name> [--yes]
```

```bash
tote alias add ll --desc "long listing" "ls -la"
```

### Dépôts : repos {#repos}

```bash
tote repos [list] [--format table|tsv|json | --json]
tote repos open <name>
tote repos add <name> <path> [--desc <text>]
tote repos rm <name> [--yes]
```

Un `<path>` est absolu ou commence par `~/` ; un chemin relatif comme `work/app` est cherché sous `repos_root` et utilisé si ce dossier y existe. `tote repos open` change le répertoire (avec l'intégration au shell) ou affiche le chemin. Dans l'interface, `o` ouvre le dépôt dans `editor` (à défaut `$VISUAL`, `$EDITOR`, `vim`) et `repos.after_open` décide de la suite : `return` à la liste, `quit` ou `cd`.

```bash
tote repos add app ~/work/app --desc "main application"
```

### Fonctions : funcs {#funcs}

```bash
tote funcs [list] [--format table|tsv|json | --json]
tote funcs add <name> --script <path> [--kind exec|source] [--desc <text>] [--managed]
tote funcs rm <name> [--yes]
```

`--kind source` (le défaut) définit une fonction shell qui exécute le script avec `source`, donc capable de modifier votre shell. `--kind exec` ne fait que réserver le nom : tote le liste et ne définit rien, le programme lui-même se trouvant dans le dossier `bin` du répertoire de données ou dans le `PATH`. `add` ne vérifie pas que le script existe ; `tote doctor` avertit d'une fonction `source` dont le script manque. Un nom de fonction peut contenir `-`, mais bash en mode POSIX (`bash --posix`, `sh` lié à bash) le refuse : n'utilisez alors que des lettres, des chiffres et `_`. `--managed` enregistre que le script appartient à tote ; le drapeau est conservé et affiché, mais rien ne supprime ni ne déplace le fichier.

```bash
tote funcs add deploy --script ~/scripts/deploy.sh --desc "push to production"
```

### Les autres commandes {#others}

```bash
tote config                       # opens the settings on a terminal
tote config path                  # the directory of config.toml and the record files
tote doctor [--json]              # checks, with a fix for each warning
tote doctor --reset               # restores a broken terminal, nothing else
tote update [--check] [--json] [--beta] [--force]
tote uninstall [--yes] [--shell] [--purge] [--dry-run]
tote init <bash|zsh> [--defs]
tote version [--json]
tote help [command]
```

### Codes de sortie {#exit-codes}

Les codes de sortie sont documentés et gardent leur sens dans toute la ligne 1.x ; un script les compare plutôt que de lire les messages.

| Code  | Sens                                                                                     |
| ----- | ---------------------------------------------------------------------------------------- |
| `0`   | Fait                                                                                     |
| `1`   | Échec                                                                                    |
| `2`   | Usage, ou un drapeau est nécessaire                                                      |
| `3`   | Authentification requise                                                                 |
| `4`   | Refusé (état, politique, `--grant` différent)                                            |
| `5`   | Intégrité (somme, archive, arbre)                                                        |
| `10`  | `tote update --check` : une release est disponible                                       |
| `127` | Un programme n'a pas pu être démarré                                                     |
| `130` | Interruption (`Ctrl+C` ou SIGTERM, aussi pendant un téléchargement ; rien n'est modifié) |

Les codes 6 à 9 et 11 et plus sont réservés aux versions suivantes. `tote co <nom>` remplace tote par la commande de connexion : son code est alors celui de la commande.

## Plugins {#plugins}

Un plugin ajoute des commandes à la palette et des actions aux lignes d'une liste. Dans la ligne 1.x, un plugin est **déclaratif** : un dossier avec un `plugin.toml` et des traductions facultatives, sans code propre. Le manifeste liste les programmes à lancer (`git`, `curl`, `gft`...), leurs arguments et le formulaire à remplir d'abord. tote construit lui-même chaque ligne de commande, un argument par élément, et ne passe jamais par un shell. Un plugin qui embarque son propre programme est réservé à une version ultérieure : un manifeste qui le demande est refusé et `tote plugin run` n'existe pas en 1.x.

### Consentement {#consent}

Avant l'installation d'un plugin, ou quand une mise à jour demande davantage, tote affiche chaque commande en entier et ce que le plugin déclare (programmes, fichiers, réseau, variables d'environnement, terminal), en distinguant ce que tote **impose** de ce qui est seulement **déclaré**. Rien ne s'exécute avant votre accord, un plugin dont les fichiers ont changé après l'accord est refusé, et tout plugin se coupe avec une commande. Les programmes nommés par un plugin tournent toujours avec vos droits : lisez la liste. Il n'y a pas de bac à sable.

Depuis la 1.1, un plugin peut aussi suggérer des valeurs pour un champ texte avec un programme que vous lancez avec `Ctrl+L` ; sa ligne de commande est montrée au consentement et une mise à jour qui en ajoute une redemande l'accord.

Depuis la 1.2, un champ texte peut aussi tenir sur plusieurs lignes (`multiline = true`, de 2 à 8 lignes affichées, 4 par défaut), pour le corps d'un rappel, une note ou un message. Les lignes arrivent au programme telles qu'elles sont tapées, séparées par des sauts de ligne (visibles sous la forme `\n` dans la commande affichée et dans `plugin check --argv`), et seulement dans un argument de `run`. Un plugin qui en utilise déclare `requires_features = ["field.multiline"]` et `tote = ">=1.2.0, <2"` : tote 1.1 le liste comme incompatible, et une mise à jour qui rend un champ multiligne redemande l'accord.

### Le plugin gft {#gft}

Le plugin livré avec tote est **gft**. Il est embarqué dans le binaire, listé comme `available` tant qu'il n'est pas installé, et demande le programme [gft](/help/linux/gft) (releases GitHub et stashes Git). Sur un dépôt enregistré qui a un remote GitHub (`Tab` sur la ligne), il ajoute :

- afficher la dernière release, ses assets et ses notes
- lister, afficher, supprimer un stash, ou tous les supprimer (avec confirmation)

Dans la palette (`>`), il ajoute : afficher une release GitHub, ouvrir sa page, télécharger un asset et installer le binaire d'une release.

La copie livrée avec tote 1.2 reste le plugin gft 1.0.0 ; la 1.1.0 du plugin vient de son propre dépôt, et la mise à jour depuis la copie livrée redemande l'accord.

Pour le lire avant de rien changer :

```bash
tote plugin                           # list: gft is "available"
tote plugin install gft --dry-run     # read what it asks for
tote plugin check gft                 # the commands it would run, and any problem
```

L'écran de consentement de gft ressemble à ceci (extrait) :

```
Installer le plugin gft 1.0.0 ?

Origine : livré avec tote
Somme de contrôle : sha256 f56d20b069f5, couverte par la signature de cette version de tote
Aucun code propre : tote ne lance que les programmes listés ci-dessous.

Commandes qu'il lancera :
  $ commande get : gft '{slug}' '{tag?}' --get '{pattern}' '{verify?}'
  $ commande install : gft '{slug}' '{tag?}' --install
  $ action d'élément stash-list : gft stash list
  ...

Ce plugin pourra :
  ! prendre le contrôle du terminal pendant certaines actions [imposé]
  - lancer le programme gft [imposé]
  - contacter api.github.com (déclaré ; tote ne peut pas le bloquer) [déclaré]
  ! lire la variable d'environnement GITHUB_TOKEN (peut contenir un secret) [imposé]
  ...
    imposé : tote refuse lui-même tout le reste
    déclaré seulement : le plugin l'annonce, tote ne peut pas l'imposer
```

Puis, un geste à la fois :

```bash
tote plugin install gft               # asks on the terminal
tote plugin disable gft               # settings and consent are kept
tote plugin remove gft --purge        # also delete its settings and data
```

`remove` oublie aussi le `enabled = false` d'un plugin que vous aviez coupé, si bien qu'une installation ultérieure démarre activée ; `--purge` ajoute les réglages, l'état, le cache et les données.

### Autres sources et sans terminal {#plugin-sources}

Depuis une autre source, avec la somme que son auteur a publiée :

```bash
tote plugin install example/demo@1.0.0 --sha256 <64 hex digits>
```

Une release est une URL de release `github.com` ou `owner/repo@tag` et demande le SHA-256 publié par son auteur ; un dossier de votre machine (`./mon-plugin`) n'est pas vérifié du tout. Sans terminal, le consentement est un jeton : `--dry-run` affiche la valeur `--grant` à passer à `install`, qui échoue si le plugin demande autre chose.

### Commandes et états {#plugin-commands}

```bash
tote plugin [list] [--format table|tsv|json | --json]
tote plugin info <id> [--json]
tote plugin install <source> [--sha256 <hex>] [--grant <token>] [--dry-run] [--force] [--json]
tote plugin update <id> [<source>] [--sha256 <hex>] [--grant <token>] [--dry-run] [--force] [--json]
tote plugin enable <id> [--grant <token>] [--json]
tote plugin disable <id> [--json]
tote plugin remove <id> [--yes] [--purge] [--json]
tote plugin check [<id|dir|archive>] [--strict] [--official] [--argv [--set <field=value>] [--repo <name>]] [--json]
```

Les états sont `enabled`, `disabled`, `needs-consent`, `missing-dependency`, `incompatible`, `broken`, `quarantined` et `available`. La quarantaine coupe un plugin après des échecs ; un plugin déclaratif n'en compte jamais, elle ne se produit donc pas encore, et `tote plugin enable` la lève.

Pour écrire un plugin, consultez le [guide de rédaction](https://github.com/totecli/tote/blob/v1.2.0/docs/plugins/AUTHORING.md) et la [référence de l'API 1](https://github.com/totecli/tote/blob/v1.2.0/docs/plugins/API1.md).

## Mises à jour signées {#update}

```bash
tote update              # look for a new release and install it
tote update --check      # only look: exit 0 when up to date, 10 when a release is available
```

`tote update` lit les releases de `totecli/tote` en https, télécharge l'archive de votre système, la compare au fichier de sommes, vérifie la signature minisign de ce fichier avec les clés de release intégrées au binaire, contrôle que le nouveau binaire annonce la bonne version et remplace le binaire en cours de façon atomique. Une signature qui ne se vérifie pas est toujours une erreur.

- Les versions suivent SemVer ; le canal stable est le défaut, et les pré-releases (`1.1.0-beta.1`) ne sont proposées qu'avec `--beta`. `--force` installe même une release plus ancienne ou identique.
- Un **reçu d'installation** (`install.json`, dans le dossier d'état) note comment tote a été installé, la version, le canal et l'horodatage signé de la release ; il sert à refuser une rétrogradation.
- Avec `--json`, une erreur est un objet `{"schema": 1, "ok": false, "status": "error", "error": {"code", "message", "exit"}}` sur la sortie standard, dont `code` vaut `offline`, `rate_limited`, `no_release`, `bad_signature`, `unknown_key`, `bad_checksum`, `bad_key`, `interrupted`, `usage`...

Un tote installé par un gestionnaire de paquets (`apt`, Homebrew, `go install`) ne se met jamais à jour ni ne se désinstalle seul : la commande à lancer est affichée à la place.

```
$ tote update --check
tote is managed by apt, so it does not update itself; to update it, run: sudo apt update && sudo apt upgrade tote
```

Avec le réglage `update.check` activé, tote cherche une release en arrière-plan au plus une fois par jour, et `u` sur l'accueil affiche l'avis ; rien n'est installé sans `tote update`.

## Diagnostic {#doctor}

```bash
tote doctor
```

`tote doctor` lance plus de vingt vérifications : version, reçu d'installation, `PATH`, dossiers et fichiers, conflits de noms, intégration au shell, `ssh` et `git`, `TERM`, locale, couleurs, souris, presse-papiers, taille, tmux et clé de mise à jour. Chaque ligne est `OK`, `WARN` (`ALERTE` en français) ou `FAIL` (`ÉCHEC`), et presque chaque avertissement affiche sa correction :

```
OK    ssh               ssh: /usr/bin/ssh
OK    git               git: /usr/bin/git
WARN  shell             ~/.bashrc:156 loads tote, but this shell did not run it, or tote was started with command
                        fix: open a new terminal, or run: exec bash, and type tote doctor without command
```

Le code de sortie est `0` quand aucune vérification n'a échoué et `1` dans le cas contraire ; les avertissements ne le changent pas. `tote doctor --json` produit le même résultat en JSON (`"schema": 1`, un résumé et la liste des vérifications).

Si un programme a laissé votre terminal dans un mauvais état (plus d'écho, caractères parasites après un plantage), lancez `tote doctor --reset` : il restaure le terminal et ne fait rien d'autre, et demande un terminal sur la sortie standard.

## Configuration et données {#config}

Les dossiers suivent les règles XDG ; une variable `TOTE_*_DIR` en remplace un et doit être absolue.

| Rôle                                                | Variable          | Puis                    | Défaut                |
| --------------------------------------------------- | ----------------- | ----------------------- | --------------------- |
| Configuration : enregistrements et réglages         | `TOTE_CONFIG_DIR` | `$XDG_CONFIG_HOME/tote` | `~/.config/tote`      |
| Données : plugins, dossier `bin` ajouté au `PATH`   | `TOTE_DATA_DIR`   | `$XDG_DATA_HOME/tote`   | `~/.local/share/tote` |
| État : reçu d'installation, verrou des plugins      | `TOTE_STATE_DIR`  | `$XDG_STATE_HOME/tote`  | `~/.local/state/tote` |
| Cache : recherche de mise à jour, caches de plugins | `TOTE_CACHE_DIR`  | `$XDG_CACHE_HOME/tote`  | `~/.cache/tote`       |

`tote config path` affiche le dossier de configuration.

### Fichiers {#config-files}

Le dossier de configuration contient `config.toml` (les réglages), `connections.toml`, `repos.toml`, `aliases.toml`, `funcs.toml` et `plugins/<id>.toml` (les réglages d'un plugin). Chaque fichier écrit par tote commence par `schema = 1`, est du texte brut et peut être modifié à la main tant que tote n'écrit pas ; un fichier `.lock` à côté sérialise les écritures. Un enregistrement est une table `[[connection]]` (ou `[[repo]]`, `[[alias]]`, `[[func]]`) :

```toml
schema = 1

[[connection]]
name = "web"
target = "host1.example.org"
user = "admin"
aliases = ["w", "www"]
desc = "Web host"
```

Un fichier d'enregistrements qui ne se lit pas, ou qui porte un autre schéma, passe en lecture seule ; `tote doctor` signale la ligne et la colonne. `config.toml` est plus tolérant : une clé inconnue ou une valeur invalide est signalée sur l'erreur standard avec sa ligne et la valeur par défaut s'applique ; seule une erreur de syntaxe ou un schéma autre que 1 met tout le fichier de côté. Les formats restent compatibles dans toute la ligne 1.x.

### Réglages {#settings}

`config.toml` avec chaque réglage à sa valeur par défaut (tout est facultatif) :

```toml
schema = 1
lang = ""                   # "en", "fr", or empty to follow the environment
editor = ""                 # empty: $VISUAL, then $EDITOR, then vim
repos_root = ""             # folder offered for a new repository, base of relative paths
[connect]
prefix_min = 2              # characters needed before a prefix connects
after_disconnect = "menu"   # "menu" or "exit"
keepalive = true
[repos]
after_open = "return"       # "return", "quit" or "cd"
[shell]
compat_mn = false           # also define a function named mn
extra_names = []            # more function names to expose
[update]
check = true                # look for a release in the background, at most once a day
[ui]
sort = "name"               # "name" (by name, ignoring case) or "file": how lists are shown
theme = "auto"              # "auto", "dark", "light" or "mono"
welcome = "box"             # "box", "compact" or "off"
compact = "auto"            # "auto", "always" or "never"
width = "auto"              # "auto", "120" or "160": caps the page at that many columns
mouse = true
```

### Variables d'environnement {#env}

| Variable                                                               | Effet                                                                                                                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `TOTE_CONFIG_DIR`, `TOTE_DATA_DIR`, `TOTE_STATE_DIR`, `TOTE_CACHE_DIR` | Remplacent les dossiers                                                                                                                  |
| `TOTE_LANG`                                                            | Langue de l'interface (`en` ou `fr`), avant le réglage `lang`                                                                            |
| `TOTE_COLOR`                                                           | `truecolor`, `256`, `16`, `none` (aussi `never`, `off`), `always` ou `auto`                                                              |
| `NO_COLOR`                                                             | Toute valeur non vide coupe les couleurs ; `TOTE_COLOR` l'emporte                                                                        |
| `TOTE_NO_PLUGINS`                                                      | Toute valeur autre que vide, `0`, `false`, `no` ou `off` coupe tous les plugins pour l'exécution                                         |
| `TOTE_PLUGIN_<ID>_<SETTING>`                                           | Valeur d'un réglage de plugin (chaque tiret de l'identifiant devient deux soulignés : `my-tool` et `x` donnent `TOTE_PLUGIN_MY__TOOL_X`) |
| `TOTE_UPDATE_BASE`, `TOTE_UPDATE_PUBKEY`                               | Lisent les releases depuis un miroir (`https://` ou `file://`) ; pour les tests                                                          |

`TOTE_HANDOFF` et `TOTE_SHELL` sont posées par la fonction shell et ne se règlent pas à la main.

## Désinstallation {#uninstall}

```bash
tote uninstall --dry-run     # print the plan and remove nothing
tote uninstall               # remove the program, keep your data
```

`tote uninstall` retire le programme et garde vos données. `--purge` supprime aussi les données, c'est-à-dire les fichiers d'enregistrements, `config.toml`, les plugins avec leur consentement et leurs réglages, le verrou des plugins, le reçu d'installation et le cache de mise à jour, et rien d'autre (un dossier à vous, ou une sauvegarde à côté des fichiers, reste). `--shell` retire aussi la ligne qui charge tote dans vos fichiers de démarrage, `--yes` passe les questions et `--dry-run` affiche le plan sans rien supprimer.

Sans `--shell`, la ligne d'intégration est conservée et la commande l'indique. Un tote installé par `apt` ne se retire pas seul : `tote uninstall` affiche `sudo apt remove tote`.

## Reprendre ses données de mn {#from-mn}

Le programme n'a aucune commande d'import : tote ne lit jamais la configuration de mn. Un script Bash séparé (bash 4 ou plus), `scripts/import.sh`, copie vos données. Il est dans le dépôt seulement, pas dans les archives ni les paquets : clonez `https://github.com/totecli/tote.git`, ou téléchargez `scripts/import.sh` au tag de votre version (`https://raw.githubusercontent.com/totecli/tote/v1.2.0/scripts/import.sh`). C'est une simulation tant que vous ne passez pas `--apply` :

```bash
bash scripts/import.sh                  # dry run: shows what would be imported, writes nothing
bash scripts/import.sh --apply          # import for real
```

La simulation affiche un compte par sorte et le détail de chaque ligne :

```
tote import from mn: dry run

  connections  read 1    import 1    same 0    conflict 0    skipped 0
  aliases      read 1    import 1    same 0    conflict 0    skipped 0
  repos        read 1    import 1    same 0    conflict 0    skipped 0
  funcs        read 0    import 0    same 0    conflict 0    skipped 0

  KIND   NAME                     STATUS    DETAIL
  co     web                      import    admin@host1.example.org
  alias  ll                       import    ls -lah
  repo   app                      import    ~/work/app

Dry run: nothing written. Use --apply to import 3 entries.
```

- **Ce qui est repris** — les connexions, les alias, les dépôts et les fonctions. Les fichiers de langue et d'éditeur, la racine des dépôts, les plugins, la documentation et les fichiers générés par mn restent volontairement de côté. Une fonction n'est référencée que par son script (`.local/bin/NOM`, sinon `/usr/local/bin/NOM`), qui n'est jamais déplacé, copié ni géré.
- **Format des connexions** — le script lit les lignes à sept champs de mn 1.2 et suivants (`name:::via:::target:::user:::aliases:::ip:::desc`) ; les anciennes dispositions sont ignorées.
- **Validation** — chaque valeur est contrôlée avec les règles de tote. Un enregistrement qui échoue est ignoré avec sa raison, et le code de sortie vaut `1` si quelque chose a été ignoré. Les alias, dépôts et fonctions partagent un seul espace de noms dans tote : en cas de conflit de nom, le premier gagne, dans cet ordre.
- **Sécurité** — il n'écrit jamais sous le dossier de mn, ne modifie jamais un enregistrement existant de tote, peut être relancé sans rien importer deux fois et refuse de tourner en root.
- **Sauvegardes** — avec `--apply`, chaque fichier tote modifié est d'abord copié vers `FICHIER.bak-<date>-<heure>`.

`--from DIR` et `--to DIR` choisissent d'autres emplacements ; `--home DIR`, `--system-bin DIR`, `--verbose` et `--help` complètent. Lisez d'abord la simulation, puis vérifiez le résultat avec `tote co -l`, `tote repos`, etc.

## Prérequis {#prerequisites}

- Un terminal d'au moins 24 colonnes sur 7 lignes ; en dessous, l'interface demande un terminal plus grand. La disposition complète demande environ 70 sur 20, les terminaux plus petits reçoivent la disposition compacte
- Une locale UTF-8 pour les symboles ; avec une autre locale, sur la console Linux ou avec `--ascii`, tote dessine en ASCII et sans accents
- `ssh` pour les connexions et `git` pour les dépôts (vérifiés par `tote doctor`)
- Un presse-papiers pour la copie : tote essaie `wl-copy` (Wayland), `xclip`, puis `xsel` (X11), et sinon envoie une séquence OSC 52 au terminal

## Dépannage {#troubleshooting}

Commencez par `tote doctor` : chaque avertissement affiche sa correction.

### Entrée sur un dépôt ne change pas de répertoire

- L'intégration au shell n'est pas chargée : ajoutez `eval "$(tote init bash)"` (ou `zsh`) à `~/.bashrc` ou `~/.zshrc`, puis ouvrez un nouveau terminal
- Dans un shell où la fonction `tote` est définie, ne lancez pas `command tote` : `tote doctor` ne verrait pas l'intégration

### Commande tote introuvable

- Vérifiez que `~/.local/bin` (script) est dans le `$PATH`
- `tote doctor` avertit aussi quand le `PATH` trouve un autre `tote` avant celui qui tourne

### La copie ne marche pas

- Les terminaux basés sur VTE (GNOME Terminal) ignorent OSC 52 : installez `xclip`, `xsel` ou `wl-clipboard`, ou sélectionnez avec `Maj`+glisser et copiez avec `Ctrl+Maj+C`
- Dans tmux, OSC 52 demande `set -g set-clipboard on`
- Sur macOS, il n'y a pas de chemin `pbcopy` : utilisez un terminal qui gère OSC 52 (iTerm2, kitty, WezTerm, Ghostty) ou sélectionnez avec `Option`+glisser

### L'interface s'affiche mal

- Essayez `tote --ascii`, `TOTE_COLOR=none tote` ou le thème `mono`
- Pour écarter un plugin, lancez `tote --no-plugins`
- `tote config path` montre où sont vos fichiers

### Un enregistrement est refusé ou invalide

- Un `via` qui contient un guillemet, ou un champ texte de plus de 4096 octets, est refusé par `add` et par les formulaires ; déjà présent dans un fichier, l'enregistrement est chargé comme _invalide_ : le fichier reste utilisable, `tote doctor` nomme la ligne, le shell ignore l'enregistrement et `tote co <nom>` le refuse jusqu'à ce que vous le corrigiez
- Un nom utilisé deux fois (alias, dépôt ou fonction) est signalé par `tote doctor`, et le shell garde le premier

### Limites connues {#limits}

- La ligne que tote met sur votre invite s'exécute dans la fonction `tote` : un `declare` ou un `typeset` placé au début y est donc local à la fonction. Les affectations, `export`, `cd` et le reste fonctionnent normalement
- Quelques messages restent en anglais : le texte libre d'une erreur de syntaxe TOML, une erreur d'entrée-sortie du système et certains détails de `tote doctor`
- La fermeture du terminal (SIGHUP) arrête le processus aussitôt ; ce qu'il a laissé dans le dossier `.staging` des plugins est supprimé par une installation ultérieure, après une heure
