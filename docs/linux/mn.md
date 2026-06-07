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
curl -fsSL https://cdn.sylvain.sh/bash/mn@latest/install.sh | bash
```

L'installeur démarre un TUI interactif (sélecteurs fléchés) pour choisir la langue et l'éditeur — utiliser `| sh` fonctionne également mais affiche un menu numéroté à la place. Si exécuté depuis le dépôt source, les fichiers sont copiés localement au lieu d'être téléchargés. Un log d'installation est sauvegardé dans `/tmp/`.

### Installation manuelle depuis le dépôt local

```bash
./install.sh
```

## Mise à jour {#update}

```bash
mn update
```

Ou en relançant la commande d'installation — l'installeur détecte une installation existante et met à jour les fichiers sans toucher aux données :

```bash
curl -fsSL https://cdn.sylvain.sh/bash/mn@latest/install.sh | bash
```

## Désinstallation {#uninstall}

```bash
mn uninstall
```

Ou via `mn config` → **Uninstall**, ou via curl :

```bash
curl -fsSL https://cdn.sylvain.sh/bash/mn@latest/delete.sh | bash
```

Un menu checkbox permet de choisir ce qui est supprimé : **Core** (binaires, lib, modules), **Config** (langue, éditeur, CDN), **Data** (fichiers `.dat`) et/ou **Plugins**. Les composantes non cochées sont conservées.

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
mn plugin      # Gestionnaire de plugins
```

Les raccourcis courts sont également supportés : `mn r` (repos), `mn a` (alias), `mn f` (funcs), `mn d` (docs), `mn c` (config), `mn h` (help).

## Navigation {#navigation}

| Touche    | Action                          |
| --------- | ------------------------------- |
| `↑` / `k` | Monter dans le menu             |
| `↓` / `j` | Descendre dans le menu          |
| `←` / `→` | Page précédente / suivante      |
| `Entrée`  | Sélectionner / exécuter         |
| `Espace`  | Cocher / décocher (checkbox)    |
| `e`       | Modifier l'élément sélectionné  |
| `d`       | Supprimer l'élément sélectionné |
| `v`       | Voir les détails                |
| `r`       | Retour au menu principal        |
| `q`       | Quitter                         |

Les menus de choix (langue, éditeur, type de connexion) utilisent un sélecteur fléché — `↑`/`↓` pour naviguer, `Entrée` pour valider, `r`/`q` pour annuler. Les champs booléens utilisent `←`/`→` et `Espace` pour basculer.

## Fonctionnalités {#features}

- **Connexions SSH/Custom** — stocker des serveurs avec label, IP, type de connexion (SSH ou commande personnalisée) et mot de passe optionnel, puis s'y connecter en une touche (voir le [guide SSH](/help/ssh/usage#mn) pour plus de détails)
- **Repos GitHub** — créer des alias vers des répertoires locaux et les ouvrir dans l'éditeur configuré (VS Code, vim, nano...) directement (pour télécharger des releases GitHub depuis le terminal, voir [gft](/help/linux/gft))
- **Alias Bash** — ajouter, modifier, supprimer des alias avec synchronisation automatique vers `~/.bash_aliases`
- **Fonctions shell** — gérer des fonctions Bash complexes avec synchronisation vers `~/.bash_functions`
- **Documentation** — lire des fichiers Markdown internes directement dans le terminal
- **Configuration** — éditer les fichiers de configuration, recharger l'environnement et configurer le CDN source
- **Plugins** — installer, gérer et supprimer des plugins tiers via `mn plugin`
- **Complétion shell** — complétion Bash et zsh installées dans le répertoire système ou utilisateur
- **Interface multilingue** — français et anglais, sélectionnable à l'installation ou via `mn config`

## Structure des fichiers {#structure}

```
~/.config/mn/
├── mn                 # Point d'entrée principal
├── VERSION            # Version installée
├── manifest           # Liste des fichiers distribuables
├── .lang              # Langue configurée
├── .editor            # Éditeur configuré
├── .cdn               # Source CDN personnalisée (si modifiée)
├── lib/
│   ├── core.sh        # Config, couleurs, utilitaires
│   ├── crud.sh        # Moteur CRUD générique
│   ├── ui.sh          # Rendu du menu et gestion des entrées
│   ├── module.sh      # Registre des modules
│   ├── plugin.sh      # Gestionnaire de plugins
│   └── dat.sh         # Helpers pour les fichiers de données
├── modules/
│   ├── connexions.sh  # Module SSH/Custom
│   ├── repos.sh       # Module repos
│   ├── alias.sh       # Module alias
│   ├── funcs.sh       # Module fonctions
│   ├── docs.sh        # Module documentation
│   └── config.sh      # Module configuration
├── plugins/           # Plugins tiers (<name>/mn.sh)
├── completions/
│   ├── mn.bash        # Complétion Bash
│   └── _mn            # Complétion zsh
├── lang/
│   ├── fr.sh          # Langue française
│   └── en.sh          # English language
├── data/
│   ├── connexions.dat
│   ├── repos.dat
│   ├── aliases.dat
│   └── functions.dat
└── docs/              # Documentation Markdown interne
```

## Format des données {#format}

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

Choisir à l'installation, ou via `mn config` → **Change editor**. Presets disponibles : `vi`, `vim`, `nano`, `zed`, `code -n` ou une commande personnalisée. Le réglage est enregistré dans `~/.config/mn/.editor`.

### Changer la langue

Via `mn config` → **Change language**. Langues disponibles : **français** et **anglais**. Le système est piloté par les fichiers `lang/*.sh` — de nouvelles langues peuvent être publiées et récupérées via `mn update`.

### Changer la source CDN

Via `mn config` → **[C]**, ou en définissant la variable `MN_CDN`. Le réglage est enregistré dans `~/.config/mn/.cdn`. Par défaut : `https://cdn.sylvain.sh/bash`. Utilisé par `mn update` et `mn plugin install`.

### Modifier les couleurs

Les couleurs sont définies dans `~/.config/mn/lib/core.sh`.

### Ajouter de la documentation interne

Déposer un fichier Markdown dans `~/.config/mn/docs/` — il apparaîtra automatiquement dans le module `docs`.

## Plugins {#plugins}

Le gestionnaire de plugins permet d'étendre mn avec des modules tiers.

### Commandes

```bash
mn plugin list                        # Lister les plugins installés
mn plugin install <name>              # Installer depuis le CDN configuré
mn plugin install <name> <url|chemin> # Installer depuis une URL ou un fichier local
mn plugin remove <name>               # Désinstaller un plugin
mn plugin info <name>                 # Afficher les métadonnées d'un plugin
```

### Structure

Chaque plugin est un fichier Bash installé dans `~/.config/mn/plugins/<name>/mn.sh`. Il est sourcé au démarrage de mn — si le binaire requis (`PLUGIN_<name>_REQUIRES`) est absent, le plugin est silencieusement ignoré.

Pour créer un plugin, consulter le [guide développeur](https://github.com/20syldev/mn/blob/main/PLUGINS.md) sur GitHub.

## Fonctionnement {#internals}

mn stocke toutes les données dans `~/.config/mn/data/` sous forme de fichiers `.dat` séparés par `:::`, donc il :

- Ne nécessite **aucune base de données** (fichiers texte plats)
- Synchronise automatiquement les alias et fonctions dans `~/.bash_aliases` et `~/.bash_functions`
- Recharge l'environnement Bash à chaque fermeture du menu

Chaque module s'auto-enregistre avec des propriétés metadata (`TYPE`, `MENU_LABEL`, `PRIORITY`) — le menu principal est construit dynamiquement en triant les modules par priorité. Le routing CLI est unifié via `_route_module`, ce qui permet aux plugins de s'intégrer sans configuration supplémentaire.

Les plugins sont sourcés au démarrage et validés — un plugin dont le binaire requis est manquant est silencieusement ignoré.

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