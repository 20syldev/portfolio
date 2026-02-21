---
title: "Manuel dynamique terminal"
description: "Interface terminal interactive pour gérer connexions SSH, repos GitHub, alias et fonctions Bash depuis un menu navigable."
category: linux
slug: mn
order: 3
---

## Installation {#install}

### Via curl (recommandée)

```bash
curl -fsSL https://cdn.sylvain.pro/bash/mn@latest/install.sh | sh
```

### Installation manuelle depuis le dépôt local

```bash
./install.sh
```

## Mise à jour {#update}

### Via curl

```bash
curl -fsSL https://cdn.sylvain.pro/bash/mn@latest/install.sh | sh
```

L'installeur détecte une installation existante et met à jour les fichiers sans toucher aux données.

### Depuis le dépôt local

```bash
./update.sh
```

## Utilisation {#usage}

### Ouvrir le menu principal

```bash
mn
```

### Accès direct aux modules

```bash
mn conn        # Connexions SSH/Custom
mn repos       # Repos GitHub
mn alias       # Alias Bash
mn funcs       # Fonctions shell
mn docs        # Documentation interne
mn config      # Configuration
mn help        # Aide
```

Les raccourcis courts sont également supportés : `mn r` (repos), `mn a` (alias), `mn f` (funcs), `mn d` (docs), `mn c` (config), `mn h` (help).

## Navigation {#navigation}

| Touche    | Action                          |
| --------- | ------------------------------- |
| `↑` / `k` | Monter dans le menu             |
| `↓` / `j` | Descendre dans le menu          |
| `←` / `→` | Page précédente / suivante      |
| `Entrée`  | Sélectionner / exécuter         |
| `e`       | Modifier l'élément sélectionné  |
| `d`       | Supprimer l'élément sélectionné |
| `v`       | Voir les détails                |
| `r`       | Retour / quitter                |

## Fonctionnalités {#features}

- **Connexions SSH/Custom** — stocker des serveurs avec label, IP, type de connexion (SSH ou commande personnalisée) et mot de passe optionnel, puis s'y connecter en une touche
- **Repos GitHub** — créer des alias vers des répertoires locaux et les ouvrir dans VS Code directement
- **Alias Bash** — ajouter, modifier, supprimer des alias avec synchronisation automatique vers `~/.bash_aliases`
- **Fonctions shell** — gérer des fonctions Bash complexes avec synchronisation vers `~/.bash_functions`
- **Documentation** — lire des fichiers Markdown internes directement dans le terminal
- **Configuration** — éditer les fichiers de configuration et recharger l'environnement à la volée

## Structure des fichiers {#file-structure}

```
~/.config/mn/
├── mn              # Point d'entrée principal
├── lib/
│   ├── core.sh        # Config, couleurs, utilitaires
│   ├── crud.sh        # Moteur CRUD générique
│   ├── ui.sh          # Rendu du menu et gestion des entrées
│   ├── module.sh      # Registre des modules
│   └── dat.sh         # Helpers pour les fichiers de données
├── modules/
│   ├── connexions.sh  # Module SSH/Custom
│   ├── repos.sh       # Module repos
│   ├── alias.sh       # Module alias
│   ├── funcs.sh       # Module fonctions
│   ├── docs.sh        # Module documentation
│   └── config.sh      # Module configuration
├── data/
│   ├── connexions.dat
│   ├── repos.dat
│   ├── aliases.dat
│   └── functions.dat
└── docs/              # Documentation Markdown interne
```

## Format des données {#data-format}

Toutes les données sont stockées dans des fichiers `.dat` avec `:::` comme séparateur. Les fichiers sont triés alphabétiquement et peuvent être édités manuellement.

**connexions.dat**

```
label:::ip:::description:::type:::password:::cmd
prod:::user@192.168.1.10:::Serveur de production:::ssh:::
backup:::user@192.168.1.20:::Serveur de backup:::custom::::rsync -avz user@192.168.1.20:/data/ ~/backups/
```

**repos.dat**

```
name:::path:::description
myapp:::~/Projects/myapp:::Application principale
api:::~/Projects/api:::API REST
```

**aliases.dat**

```
name:::command:::description
c:::clear:::Effacer le terminal
ll:::ls -lah:::Listing détaillé
```

**functions.dat**

```
name:::code:::description
mkcd:::mkdir -p "$1" && cd "$1";:::Créer un dossier et y entrer
```

## Personnalisation {#customization}

### Changer l'éditeur par défaut

```bash
export EDITOR=vim   # ou code, nano, micro...
```

### Modifier les couleurs

Les couleurs sont définies dans `~/.config/mn/lib/core.sh`.

### Ajouter de la documentation interne

Déposer un fichier Markdown dans `~/.config/mn/docs/` — il apparaîtra automatiquement dans le module `docs`.

## Fonctionnement {#how-it-works}

mn stocke toutes les données dans `~/.config/mn/data/` sous forme de fichiers `.dat` séparés par `:::`, donc il :

- Ne nécessite **aucune base de données** (fichiers texte plats)
- Synchronise automatiquement les alias et fonctions dans `~/.bash_aliases` et `~/.bash_functions`
- Recharge l'environnement Bash à chaque fermeture du menu

L'architecture repose sur un moteur CRUD générique et un système de modules déclaratifs — chaque module (connexions, repos, alias...) est indépendant et extensible.

## Prérequis {#prerequisites}

- `bash` (>= 4.0)
- `curl` (pour l'installation)
- Connexion internet

## Dépannage {#troubleshooting}

### Commande mn introuvable

- Vérifier que `/usr/local/bin` ou `~/.local/bin` est dans le `$PATH`
- Relancer un terminal ou sourcer le fichier de configuration shell

### Les alias ne se rechargent pas

- Vérifier que `~/.bash_aliases` est sourcé dans `~/.bashrc`
- Utiliser CONFIG → Source tous les fichiers depuis le menu

### Données perdues après mise à jour

- Les fichiers `.dat` dans `~/.config/mn/data/` ne sont jamais modifiés par l'installeur