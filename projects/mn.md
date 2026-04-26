---
name: MN
description: Menu interactif en terminal pour connexions SSH, repos, alias et fonctions.
longDescription: Outil CLI interactif pour gérer les connexions SSH, dépôts GitHub, alias Bash et fonctions shell. Installation via curl, navigation intuitive avec raccourcis clavier.
tags: ["Bash", "CLI", "Shell"]
github: "https://github.com/20syldev/mn"
docs: "linux/mn"
---

## À propos {#about}

mn (**M**a**n**ual) est un menu interactif en terminal pour gérer les connexions SSH, dépôts GitHub, alias Bash, fonctions shell et documentation personnelle — le tout au même endroit.

## Installation {#install}

L'installation se fait en une seule commande via curl :

```bash
curl -fsSL https://cdn.sylvain.sh/bash/mn@latest/install.sh | sh
```

Vous pouvez aussi installer manuellement en exécutant `./install.sh` ou mettre à jour depuis le repo local avec `./update.sh`.

## Modules {#modules}

mn propose plusieurs modules accessibles directement depuis le menu principal ou via des raccourcis :

- `mn conn` — Connexions SSH et commandes personnalisées
- `mn repos` — Dépôts GitHub avec ouverture dans VS Code
- `mn alias` — Alias Bash avec synchronisation automatique vers `~/.bash_aliases`
- `mn funcs` — Fonctions shell avec synchronisation vers `~/.bash_functions`
- `mn docs` — Documentation interne en Markdown
- `mn config` — Configuration et rechargement de l'environnement
- `mn help` — Aide

Des alias courts sont aussi supportés : `mn r` (repos), `mn a` (alias), `mn f` (funcs), `mn d` (docs), `mn c` (config), `mn h` (help).

## Navigation {#navigation}

La navigation est conçue pour être rapide et intuitive :

- `↑` / `k` — Monter
- `↓` / `j` — Descendre
- `←` / `→` — Page précédente / suivante
- `Enter` — Sélectionner / exécuter
- `e` — Modifier l'entrée sélectionnée
- `d` — Supprimer l'entrée sélectionnée
- `v` — Voir les détails
- `r` — Retour / quitter

## Fonctionnalités {#features}

- **Connexions SSH/Custom** — stocker des serveurs avec label, IP, type (SSH ou commande personnalisée) et mot de passe optionnel
- **Dépôts GitHub** — créer des alias vers vos répertoires locaux et les ouvrir dans VS Code
- **Alias Bash** — ajouter, modifier, supprimer des alias avec synchronisation automatique vers `~/.bash_aliases`
- **Fonctions shell** — gérer des fonctions Bash complexes avec synchronisation vers `~/.bash_functions`
- **Documentation** — lire des fichiers Markdown internes directement dans le terminal
- **Configuration** — éditer les fichiers de configuration et recharger l'environnement à la volée

## Format de données {#data}

Toutes les données sont stockées dans `~/.config/mn/data/` dans des fichiers `.dat` avec `:::` comme séparateur.
Les fichiers sont triés alphabétiquement et peuvent être modifiés manuellement.