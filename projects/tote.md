---
name: tote
description: Lanceur en terminal pour connexions SSH, dépôts, alias et fonctions, successeur de mn.
longDescription: "Successeur de mn réécrit en Go avec Bubble Tea : un lanceur en terminal qui réunit connexions SSH, dépôts Git, alias et fonctions shell dans une interface plein écran, avec thèmes clair et sombre, interface en anglais et en français et mises à jour signées. En cours de développement, la première version publiée sera la 1.0.0."
tags: ["Go", "Bubble Tea", "TUI"]
---

## À propos {#about}

tote (« your terminal tools, in one bag ») rassemble dans une seule interface les outils du quotidien en terminal : connexions SSH, dépôts Git, alias et fonctions shell.
C'est le successeur de [mn](/projet/mn), réécrit en **Go** avec **Bubble Tea**.

Le projet est **en cours de développement** : rien n'est encore publié, et la première version sera la **1.0.0**.

![Accueil de tote, avec le cadre de bienvenue, les compteurs et le menu](/images/projects/tote/home)

## De mn à tote {#from-mn}

tote reprend les quatre domaines de mn et la même idée : retrouver une connexion ou un dépôt en quelques touches, sans quitter le terminal. Ce qui change :

- **un binaire Go unique** au lieu d'un ensemble de scripts Bash
- **une interface plein écran** avec des listes filtrables et des thèmes
- **des fichiers TOML** lisibles et modifiables à la main, à la place des fichiers `.dat`
- **des mises à jour signées**, vérifiées avant d'être installées

La reprise des données de mn passera par un **script séparé**, documenté à la sortie de la 1.0.0. tote lui-même ne lit jamais la configuration de mn.

## Interface {#interface}

- **Accueil** — un cadre de bienvenue avec le nombre de connexions, de dépôts, d'alias et de fonctions, puis le menu des sections, accessibles aussi par `1` à `5`
- **Listes filtrables** — `/` filtre la liste en cours, et la commande exacte (`ssh -o … -l deploy -- staging.example.com`) s'affiche avant de se connecter
- **Thèmes** — clair, sombre, monochrome ou automatique selon le fond du terminal, avec des couleurs prévues pour chaque profil (truecolor, 256, 16 couleurs ou aucune) et un titre en dégradé en truecolor ; `TOTE_COLOR` et `NO_COLOR` sont respectés, et `--ascii` remplace les symboles par de l'ASCII
- **Langues** — anglais par défaut, français en seconde langue

![Liste des connexions, avec la commande SSH exacte affichée avant de se connecter](/images/projects/tote/connections)

## Ligne de commande {#cli}

Chaque domaine s'utilise aussi sans l'interface, ce qui rend tote scriptable :

- `tote co` — lister, ouvrir, ajouter ou supprimer des connexions (`tote co db-primary` se connecte directement)
- `tote repos`, `tote alias`, `tote funcs` — la même chose pour les dépôts, les alias et les fonctions
- `--format table|tsv|json` — chaque liste sort aussi en TSV ou en JSON
- `tote init bash|zsh` — l'intégration au shell
- `tote doctor` — vérifie l'installation, et `--reset` restaure un terminal cassé
- `tote update` — cherche une nouvelle version et l'installe après avoir vérifié sa signature ; `--check` sert dans un script (code `10` quand une mise à jour existe)
- `tote uninstall` — retire tote de la machine

## Stack technique {#tech}

tote est écrit en **Go**, avec **Bubble Tea v2**, **Lip Gloss v2** et quelques paquets **Bubbles** pour l'interface, et `colorprofile` pour détecter les couleurs du terminal.
Les données sont stockées en **TOML**, et `golang.org/x/crypto` (BLAKE2b) vérifie la signature des mises à jour. Le projet est publié sous licence **MIT**.