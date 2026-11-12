---
name: tote
description: Lanceur en terminal pour connexions SSH, dépôts, alias et fonctions, successeur de mn.
longDescription: "Successeur de mn réécrit en Go avec Bubble Tea : un lanceur en terminal qui réunit connexions SSH, dépôts Git, alias et fonctions shell dans une interface plein écran avec palette de recherche, thèmes, plugins déclaratifs soumis à consentement, interface en anglais et en français et mises à jour vérifiées par signature minisign. La version 1.0.0 est la première version."
tags: ["Go", "Bubble Tea", "TUI"]
github: "https://github.com/totecli/tote"
---

## À propos {#about}

tote (« your terminal tools, in one bag ») rassemble dans une seule interface les outils du quotidien en terminal : connexions SSH, dépôts Git, alias et fonctions shell.
C'est le successeur de [mn](/projet/mn), réécrit en **Go** avec **Bubble Tea**, et le dépôt vit dans l'organisation GitHub [totecli](https://github.com/totecli/tote).

La **version 1.0.0** est la première version. Ce qui viendra ensuite est marqué comme prévu dans le README plutôt que promis : dépôt apt et PPA Ubuntu, plugins qui embarquent leur propre programme, exécution des lignes insérées au niveau du shell, le tout pour la 1.1.

![Accueil de tote, avec le cadre de bienvenue, les compteurs et le menu](/images/projects/tote/home)

## De mn à tote {#from-mn}

tote reprend les quatre domaines de mn et la même idée : retrouver une connexion ou un dépôt en quelques touches, sans quitter le terminal. Ce qui change :

- **un binaire Go statique** au lieu d'un programme Bash, pour Linux et macOS (amd64 et arm64)
- **une interface plein écran** avec des listes filtrables, un panneau de détail, une palette et la souris
- **des fichiers TOML** avec un schéma, lisibles et modifiables à la main, écrits de façon atomique, à la place des lignes séparées par `:::`
- **des plugins réécrits**, déclaratifs en 1.0, et rien ne s'exécute avant d'avoir lu les commandes exactes et donné son accord
- **des mises à jour signées**, vérifiées avant d'être installées

Il n'y a **aucune migration dans le programme** : tote ne lit jamais la configuration de mn. Un script Bash séparé, `scripts/import.sh`, importe les données de mn vers tote en les copiant, sans rien modifier dans mn. Il est fourni dans le dépôt seulement, fonctionne en simulation tant qu'on ne lui passe pas `--apply`, et demande bash 4 ou plus.

## Interface {#interface}

- **Accueil** — un cadre de bienvenue avec le nombre de connexions, de dépôts, d'alias et de fonctions, puis le menu des sections (Connexions, Dépôts, Alias, Fonctions, Plugins, Réglages), accessibles aussi par `1` à `4` (et `5` quand les plugins sont activés), et `,` pour les réglages
- **Listes filtrables** — les colonnes disparaissent par la droite quand le terminal se réduit, `/` filtre en plaçant en premier les noms qui commencent par le texte, et un panneau affiche la commande que Entrée lancerait (`ssh -l deploy -- staging.example.com`, les options de keepalive n'étant ajoutées qu'au lancement) ou le chemin d'un dépôt, sa branche Git apparaissant sur la ligne d'état
- **Palette** — `Ctrl+K` cherche dans tous les enregistrements et quelques actions, avec des préfixes pour restreindre : `c ` connexions, `r ` dépôts, `a ` alias, `d ` fonctions, `>` actions
- **Souris** — survol, clic, double clic, molette, et un clic sur une touche du pied de page l'actionne ; glisser sélectionne et copie, et `ui.mouse` coupe le tout
- **Thèmes** — `auto` (selon le fond du terminal), `dark`, `light` ou `mono`, avec des couleurs prévues pour chaque profil (truecolor, 256, 16 couleurs ou aucune) ; `TOTE_COLOR` et `NO_COLOR` sont respectés, et `--ascii` remplace les symboles par de l'ASCII
- **Adaptation à la taille** — sous 70 colonnes ou 20 lignes, le cadre d'accueil laisse place à un en-tête d'une ligne, et la largeur peut être plafonnée à 120 ou 160 colonnes
- **Langues** — anglais par défaut, français en seconde langue, choisie par `TOTE_LANG`, le réglage `lang`, puis l'environnement

![Liste des connexions, avec la commande SSH exacte affichée avant de se connecter](/images/projects/tote/connections)

## Intégration au shell {#shell}

Un programme ne peut ni changer le répertoire du shell qui l'a lancé, ni écrire sur son invite. tote le fait avec une petite fonction chargée une fois (`eval "$(tote init bash)"` ou `zsh`) :

- **Entrée sur un dépôt** change le répertoire du shell, **sur un alias ou une fonction** place la commande sur l'invite, prête à être lancée
- les alias deviennent de **vrais alias shell**, les fonctions de type `source` (le défaut) de **vraies fonctions shell**, et chaque dépôt devient un alias qui s'y rend
- la **complétion** des commandes, des noms de connexions et des identifiants de plugins fonctionne pour bash et pour zsh
- les modifications faites dans l'interface sont rechargées sans ouvrir un nouveau shell

Le fichier d'échange est privé (mode 0600), créé dans `$XDG_RUNTIME_DIR`, à défaut `$TMPDIR`, à défaut `/tmp`, et un chemin relatif renvoyé pour `cd` est rendu explicite (`./nom`) pour que `CDPATH` ne soit jamais consulté.

## Ligne de commande {#cli}

Chaque domaine s'utilise aussi sans l'interface, ce qui rend tote scriptable :

- `tote co` — lister, ouvrir, ajouter ou supprimer des connexions (`tote co db-primary` se connecte directement et un préfixe unique suffit ; `tote co add --via` enregistre la commande lancée à la place de `ssh` pour cette connexion, par exemple un rebond par un bastion)
- `tote repos`, `tote alias`, `tote funcs` — la même chose pour les dépôts, les alias et les fonctions
- `--format table|tsv|json` — chaque liste sort aussi en TSV ou en JSON, dont chaque document commence par `"schema": 1` et ne fait que gagner des champs
- `tote doctor` — plus de vingt vérifications (version, `PATH`, fichiers, conflits de noms, intégration au shell, `ssh` et `git`, couleurs, presse-papiers, tmux…), presque chaque avertissement donnant sa correction ; `--reset` restaure un terminal cassé
- `tote update` — cherche une nouvelle version et l'installe après avoir vérifié sa signature ; `--check` sert dans un script (code `10` quand une mise à jour existe)
- `tote uninstall` — retire tote en gardant les données, sauf avec `--purge`, et `--dry-run` affiche le plan sans rien supprimer

Les codes de sortie sont documentés et gardés compatibles dans toute la ligne 1.x. `ssh` est toujours lancé sous la forme `ssh -l utilisateur -- cible`, si bien qu'une cible ou un utilisateur commençant par `-` n'est jamais lu comme une option.

## Plugins {#plugins}

Un plugin ajoute des commandes à la palette et des actions aux lignes d'une liste. En 1.0, il est **déclaratif** : un dossier avec un `plugin.toml`, sans code propre. Le manifeste liste les programmes à lancer (par exemple `git`, `curl` ou `gft`), leurs arguments et le formulaire à remplir d'abord. tote construit lui-même chaque ligne de commande, un argument par élément, et ne passe jamais par un shell.

- **Consentement d'abord** — avant l'installation, tote affiche chaque commande en entier et ce que le plugin déclare (programmes, fichiers, réseau, variables, terminal), en distinguant ce que tote impose de ce qui n'est que déclaré
- **Intégrité** — un plugin dont les fichiers ont changé après l'accord est refusé, et une release s'installe avec le SHA-256 publié par son auteur
- **Pas de bac à sable** — les programmes listés tournent avec les droits de l'utilisateur, et seules les permissions d'exécution et d'environnement sont appliquées par tote ; les autres sont déclarées, et le texte venu d'un plugin est nettoyé de ses caractères de contrôle avant l'affichage
- **Désactivation immédiate** — `tote plugin disable` suffit, et `--no-plugins` coupe tout pour une exécution
- **gft** — le plugin livré dans le binaire s'appuie sur [gft](/projet/gft) et ajoute, sur un dépôt enregistré, la gestion des stashes (lister, afficher, supprimer), puis l'affichage de la dernière release, de ses assets et de ses notes quand le dépôt a un remote GitHub

## Installation et mises à jour signées {#install}

- **Script d'installation** — il télécharge l'archive du système depuis GitHub Releases, compare son SHA-256 au fichier de sommes signé, vérifie la signature minisign quand un vérificateur est disponible, installe dans `~/.local/bin` et note un reçu d'installation, sans jamais utiliser `sudo` ni modifier les fichiers de démarrage ; il est servi par [Dropr](/projet/dropr), le CDN personnel
- **Archives et paquet `.deb`** — archives pour Linux et macOS et paquet `.deb` pour Linux, en amd64 et arm64, avec le fichier de sommes et sa signature
- **`go install`** — avec Go 1.26 ou plus récent
- **Clés** — les releases sont signées avec minisign, une clé courante et une clé suivante gardée hors ligne, toutes deux publiées dans le README
- **Mise à jour** — `tote update` lit les releases du dépôt, vérifie la signature du fichier de sommes avec la clé intégrée au binaire, compare la somme de l'archive, contrôle que le nouveau binaire annonce la bonne version et remplace le binaire en cours de façon atomique ; le commentaire signé porte le projet, la version, le canal et l'horodatage, et le reçu d'installation sert à refuser une rétrogradation

Un tote installé par un gestionnaire de paquets ne se met jamais à jour ni ne se désinstalle seul : la commande à lancer est affichée à la place. En arrière-plan, une vérification a lieu au plus une fois par jour et n'installe rien.

## Stack technique {#tech}

tote est écrit en **Go**, avec **Bubble Tea v2**, **Lip Gloss v2** et quelques paquets **Bubbles** pour l'interface, et `colorprofile` pour détecter les couleurs du terminal.
Les données sont stockées en **TOML**, et `golang.org/x/crypto` (BLAKE2b) intervient dans la vérification des signatures minisign des mises à jour.

Le dépôt compte près de 2 000 tests et 20 cibles de fuzzing (scénarios, injection, durcissement, régressions, sorties de référence en anglais et en français), une vérification `golangci-lint`, et des workflows GitHub Actions pour l'intégration continue et le format des commits.
La publication passe par GoReleaser dans un environnement GitHub que le mainteneur doit approuver, avec des actions épinglées sur un commit, et la documentation comprend un contrat de compatibilité pour la ligne 1.x, le schéma JSON des manifestes de plugin et une déclaration de sécurité.
Huit modules directs seulement composent le projet, et ceux de l'interface restent confinés dans `internal/ui`.
Le projet est publié sous licence **MIT**.
