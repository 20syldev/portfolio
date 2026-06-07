---
name: MN
description: Menu interactif en terminal pour connexions SSH, repos, alias, fonctions et plugins.
longDescription: Outil CLI interactif pour gérer les connexions SSH, dépôts GitHub, alias Bash et fonctions shell. Système de plugins extensible, complétion Bash/zsh, installation via curl avec TUI interactif.
tags: ["Bash", "CLI", "Shell"]
github: "https://github.com/20syldev/mn"
docs: "linux/mn"
---

## À propos {#about}

mn (**M**a**n**ual) est un menu interactif en terminal pour gérer les connexions SSH, dépôts GitHub, alias Bash, fonctions shell et documentation personnelle — le tout au même endroit.

## Installation {#install}

L'installation se fait en une seule commande via curl :

```bash
curl -fsSL https://cdn.sylvain.sh/bash/mn@latest/install.sh | bash
```

La commande ouvre un menu interactif pour configurer la langue et l'éditeur (compatible `| sh`, affiche alors un menu numéroté). Vous pouvez aussi installer manuellement via `./install.sh`. Relancer la même commande met à jour une installation existante.

## Modules {#modules}

mn propose plusieurs modules accessibles directement depuis le menu principal ou via des raccourcis :

- `mn conn` — Connexions SSH et commandes personnalisées
- `mn repos` — Dépôts GitHub avec ouverture dans l'éditeur configuré
- `mn alias` — Alias Bash avec synchronisation automatique vers `~/.bash_aliases`
- `mn funcs` — Fonctions shell avec synchronisation vers `~/.bash_functions`
- `mn docs` — Documentation interne en Markdown
- `mn config` — Configuration : éditeur, langue, CDN et rechargement de l'environnement
- `mn help` — Aide
- `mn plugin` — Gestionnaire de plugins (`list`, `install`, `remove`, `info`)

Des alias courts sont aussi supportés : `mn r` (repos), `mn a` (alias), `mn f` (funcs), `mn d` (docs), `mn c` (config), `mn h` (help).

## Navigation {#navigation}

La navigation est conçue pour être rapide et intuitive :

- `↑` / `k` — Monter
- `↓` / `j` — Descendre
- `←` / `→` — Page précédente / suivante
- `Enter` — Sélectionner / exécuter
- `Espace` — Cocher / décocher (menus checkbox)
- `e` — Modifier l'entrée sélectionnée
- `d` — Supprimer l'entrée sélectionnée
- `v` — Voir les détails
- `r` — Retour au menu principal
- `q` — Quitter

Les menus de choix (langue, éditeur, type de connexion) utilisent la même navigation fléchée — `↑`/`↓` pour sélectionner, `Entrée` pour valider.

## Fonctionnalités {#features}

- **Connexions SSH/Custom** — stocker des serveurs avec label, IP, type (SSH ou commande personnalisée) et mot de passe optionnel
- **Dépôts GitHub** — créer des alias vers vos répertoires locaux et les ouvrir dans l'éditeur configuré (VS Code, vim, nano...)
- **Alias Bash** — ajouter, modifier, supprimer des alias avec synchronisation automatique vers `~/.bash_aliases`
- **Fonctions shell** — gérer des fonctions Bash complexes avec synchronisation vers `~/.bash_functions`
- **Documentation** — lire des fichiers Markdown internes directement dans le terminal
- **Configuration** — éditer les fichiers de configuration et recharger l'environnement à la volée
- **Plugins** — installer, gérer et supprimer des plugins tiers via `mn plugin`
- **Complétion shell** — complétion Bash et zsh pour toutes les commandes et sous-commandes
- **CDN configurable** — source de téléchargement configurable via `mn config` → `[C]`
- **Éditeur configurable** — vi, vim, nano, zed, VS Code ou personnalisé, choix à l'install ou via `mn config`
- **Interface multilingue** — français et anglais, choisis à l'installation ou via `mn config`
- **Modules auto-enregistrés** — menu principal construit dynamiquement par priorité, extensible via plugins

## Format de données {#data}

Toutes les données sont stockées dans `~/.config/mn/data/` dans des fichiers `.dat` avec `:::` comme séparateur.
Les fichiers sont triés alphabétiquement et peuvent être modifiés manuellement.