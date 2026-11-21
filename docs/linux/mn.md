---
title: "Manuel dynamique terminal"
description: "Interface terminal interactive pour gérer connexions SSH, repos GitHub, alias et fonctions Bash depuis un menu navigable."
category: linux
slug: mn
order: 3
---

> **mn évolue en tote** : mêmes domaines, réécrit en Go. mn reste installable et fonctionne comme avant ; il est en mode maintenance depuis la version 1.3.0 et ne reçoit plus que des correctifs de régression et de sécurité. Voir [mn devient tote](#tote).

## Installation {#install}

### Via curl (recommandée)

```bash
curl -fsSL https://dropr.sylvain.sh/bash/mn@latest/install.sh | bash
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

`mn update` charge un programme de mise à jour (`lib/update.sh`) qui télécharge d'abord tous les fichiers dans un dossier temporaire et ne touche à l'installation qu'une fois chacun vérifié ; il refuse de remplacer une version par une plus ancienne.

Ou en relançant la commande d'installation — l'installeur détecte une installation existante et met à jour les fichiers sans toucher aux données :

```bash
curl -fsSL https://dropr.sylvain.sh/bash/mn@latest/install.sh | bash
```

## Désinstallation {#uninstall}

```bash
mn uninstall
```

Ou via `mn config` → **Uninstall**, ou via curl :

```bash
curl -fsSL https://dropr.sylvain.sh/bash/mn@latest/delete.sh | bash
```

Un menu checkbox permet de choisir ce qui est supprimé : **Core** (binaires, lib, modules), **Config** (langue, éditeur, CDN), **Data** (fichiers `.dat`) et/ou **Plugins**. Les composantes non cochées sont conservées.

## Utilisation {#usage}

### Ouvrir le menu principal

```bash
mn
```

### Accès direct aux modules

```bash
mn conn        # Connexions SSH/Custom (ou mn co)
mn repos       # Repos GitHub
mn alias       # Alias Bash
mn funcs       # Fonctions shell
mn docs        # Documentation interne
mn config      # Configuration
mn help        # Aide
mn plugin      # Gestionnaire de plugins
mn update      # Mettre à jour mn
mn uninstall   # Désinstaller mn
```

Les raccourcis courts sont également supportés : `mn co` (connexions), `mn r` (repos), `mn a` (alias), `mn f` (funcs), `mn d` (docs), `mn c` (config), `mn h` (help).

### Se connecter sans l'interface {#co}

`mn co` accepte un nom ou un alias de connexion et se connecte directement, sans ouvrir le menu :

```bash
mn co web          # se connecter avec n'importe quel nom ou alias
mn co web root     # se connecter avec un autre utilisateur, sans modifier l'entrée
mn co -l           # liste à plat, exploitable dans un script
```

## Navigation {#navigation}

| Touche    | Action                                       |
| --------- | -------------------------------------------- |
| `↑` / `k` | Monter dans le menu                          |
| `↓` / `j` | Descendre dans le menu                       |
| `←` / `→` | Page précédente / suivante                   |
| `Entrée`  | Sélectionner / exécuter                      |
| `Espace`  | Cocher / décocher (checkbox)                 |
| `e`       | Modifier l'élément sélectionné               |
| `d`       | Supprimer l'élément sélectionné              |
| `v`       | Voir les détails                             |
| `/`       | Filtrer la liste (connexions)                |
| `u` / `U` | Changer / choisir l'utilisateur de connexion |
| `c`       | Renvoyer la ligne de commande au terminal    |
| `r`       | Retour au menu principal                     |
| `q`       | Quitter                                      |

Les menus de choix (langue, éditeur, type de connexion) utilisent un sélecteur fléché — `↑`/`↓` pour naviguer, `Entrée` pour valider, `r`/`q` pour annuler. Les champs booléens utilisent `←`/`→` et `Espace` pour basculer.

## Fonctionnalités {#features}

- **Connexions SSH/Custom** — stocker des serveurs avec la commande réellement exécutée, plusieurs alias par hôte, une IP en cache et un utilisateur choisi au moment de la connexion, filtrer la liste avec `/`, puis s'y connecter en une touche ou avec `mn co` (voir le [guide SSH](/help/ssh/usage#mn) pour plus de détails)
- **Repos GitHub** — créer des alias vers des répertoires locaux, avec un dossier racine configurable, et les ouvrir dans l'éditeur configuré (VS Code, vim, nano...) directement (pour télécharger des releases GitHub depuis le terminal, voir [gft](/help/linux/gft))
- **Alias Bash** — ajouter, modifier, supprimer des alias avec synchronisation automatique vers un bloc balisé de `~/.bash_aliases`
- **Fonctions shell** — gérer des fonctions Bash complexes avec synchronisation vers un bloc balisé de `~/.bash_functions`
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
├── .repos             # Dossier racine des repos
├── lib/
│   ├── core.sh        # Config, couleurs, utilitaires
│   ├── crud.sh        # Moteur CRUD générique
│   ├── ui.sh          # Rendu du menu et gestion des entrées
│   ├── module.sh      # Registre des modules
│   ├── plugin.sh      # Gestionnaire de plugins
│   ├── update.sh      # Mise à jour par étapes (chargé à la demande)
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
│   ├── en.sh          # English language
│   └── index          # Liste des langues disponibles
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
name:::via:::target:::user:::aliases:::ip:::desc
prod:::ssh:::prod-web-01:::deploy:::web,p1:::192.0.2.10:::Serveur de production
lab:::xe:::lab.example.com::::::lb:::198.51.100.42:::Hôte de labo atteint via le bastion xe
```

| Champ     | Rôle                                                                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | Clé de l'entrée, affichée dans la colonne NAME                                                                                                                             |
| `via`     | Commande réellement exécutée. Vide ou `ssh` : ssh natif ; sinon un verbe (`xe`) ou un modèle (`telnet {host} 23`). Variables : `{host}` `{ip}` `{name}` `{user}` `{user@}` |
| `target`  | Argument exact transmis à `ssh` ou au verbe. Le mieux est le nom du bloc `Host` de `~/.ssh/config` : ssh compare la chaîne telle quelle, jamais une adresse résolue        |
| `user`    | Utilisateur par défaut. Vide : `ssh_config` ou l'enveloppe distante décide                                                                                                 |
| `aliases` | Séparés par des virgules. Le plus court parmi le nom et les alias devient le badge affiché                                                                                 |
| `ip`      | Cache informatif, jamais utilisé pour se connecter                                                                                                                         |
| `desc`    | Texte libre                                                                                                                                                                |

Ce format est celui de mn 1.2 et 1.3. Les lignes de l'ancien format (`label:::user@host:::desc:::type:::password:::cmd`, version 1.1) ne sont **pas converties** : elles sont masquées du menu, ignorées par `mn co` et par la complétion, et mn affiche un avertissement. Rien n'est supprimé. Le champ mot de passe n'existe plus : mn ne s'en servait pas pour se connecter. Voir [Migrer depuis la 1.1](#migration).

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
name:::desc:::func_type
mkcd:::Créer un dossier et y entrer:::shell
```

Le script lui-même n'est pas dans le `.dat` : il vit dans `~/.local/bin/<name>` (ou `/usr/local/bin/<name>`). Le champ `func_type` vaut `shell` pour une fonction sourcée dans le terminal (qui peut donc faire `cd` ou `exit`) ; vide, c'est un script normal exécuté comme une commande.

### Migrer depuis la 1.1 {#migration}

Pour reprendre d'anciennes lignes de `connexions.dat`, le plus simple est de les corriger avec `e` dans le menu, ou de les convertir en une fois :

| Champ 1.1               | Champ 1.3                                                     |
| ----------------------- | ------------------------------------------------------------- |
| `label`                 | `name`                                                        |
| `user@host`             | `user` et `target` (un `host` seul donne un utilisateur vide) |
| `desc`                  | `desc`                                                        |
| type `ssh`              | `via` = `ssh`                                                 |
| type `custom` et sa cmd | `via` = cette commande (l'hôte lui est transmis comme avant)  |
| `password`              | abandonné                                                     |

```bash
cd ~/.config/mn/data
# Keep a copy of the old file (it still holds the old passwords)
cp connexions.dat connexions.dat.1.1-bak
awk -F':::' 'BEGIN { OFS = ":::" }
    /^#/ || NF < 2 { print; next }
    NF == 7        { print; next }
    {
        host = $2; user = ""
        if (i = index(host, "@")) { user = substr(host, 1, i - 1); host = substr(host, i + 1) }
        via = "ssh"
        if ($4 == "custom" && $6 != "") via = $6
        print $1, via, host, user, "", "", $3
    }' connexions.dat.1.1-bak > connexions.dat.new &&
    mv connexions.dat.new connexions.dat && chmod 600 connexions.dat
mn co -l
```

Les noms doivent commencer par une lettre ou un chiffre ; `ip` et `aliases` restent vides, à compléter avec `e`. Supprimer `connexions.dat.1.1-bak` une fois le résultat vérifié. Les lignes qui ont déjà 7 champs sont recopiées telles quelles : la commande peut être relancée.

## Personnalisation {#customization}

### Changer l'éditeur par défaut

Choisir à l'installation, ou via `mn config` → **Change editor**. Presets disponibles : `vi`, `vim`, `nano`, `zed`, `code -n` ou une commande personnalisée. Le réglage est enregistré dans `~/.config/mn/.editor`.

### Changer le dossier des repos {#repos-root}

Via `mn config` → **Change the repos folder** (l'installeur le demande aussi). C'est la racine sous laquelle un nom de repo _seul_ est complété : avec la racine `~/code`, ajouter un repo `myapp` avec un chemin vide enregistre `~/code/myapp`. Un chemin absolu ou en `~` saisi dans le champ _Path_ est toujours conservé tel quel. Par défaut la racine est `~`. Le réglage est enregistré dans `~/.config/mn/.repos`.

### Changer la langue

Via `mn config` → **Change language**. Langues disponibles : **français** et **anglais**. Le système est piloté par les fichiers `lang/*.sh` — de nouvelles langues peuvent être publiées et récupérées via `mn update`.

### Changer la source CDN

Via `mn config` → **[C]**, ou en définissant la variable `MN_CDN`. Le réglage est enregistré dans `~/.config/mn/.cdn`. Par défaut : `https://dropr.sylvain.sh/bash`. Utilisé par `mn update` et `mn plugin install`.

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
mn plugin install <name>@1.2          # Installer une version donnée depuis le CDN
mn plugin install <name> <url|chemin> # Installer depuis une URL ou un fichier local
mn plugin update <name>               # Mettre à jour un plugin installé
mn plugin remove <name>               # Désinstaller un plugin
mn plugin info <name>                 # Afficher les métadonnées d'un plugin
```

Un nom de plugin ne contient que des minuscules, des chiffres, `_` et `-`. La version est `latest` (par défaut), `1`, `1.2` ou `1.2.3`, avec un seul `@`, et uniquement pour un plugin venant du CDN : elle ne se combine pas avec une URL ou un chemin. `update` accepte le même `<name>[@version]`, alors que `remove` et `info` prennent le nom seul. Aucun plugin officiel n'est publié pour l'instant : on installe depuis un fichier ou une URL.

### Structure

Chaque plugin est un fichier Bash installé dans `~/.config/mn/plugins/<name>/mn.sh`. Il est sourcé au démarrage de mn — si le binaire requis (`PLUGIN_<name>_REQUIRES`) est absent, le plugin est silencieusement ignoré.

Pour créer un plugin, consulter le [guide développeur](https://github.com/20syldev/mn/blob/main/PLUGINS.md) sur GitHub.

## Fonctionnement {#internals}

mn stocke toutes les données dans `~/.config/mn/data/` sous forme de fichiers `.dat` séparés par `:::`, donc il :

- Ne nécessite **aucune base de données** (fichiers texte plats)
- Synchronise automatiquement les alias et fonctions dans `~/.bash_aliases` et `~/.bash_functions`, uniquement entre deux lignes repères (voir ci-dessous)
- Recharge l'environnement Bash à chaque fermeture du menu

Chaque module s'auto-enregistre avec des propriétés metadata (`TYPE`, `MENU_LABEL`, `PRIORITY`) — le menu principal est construit dynamiquement en triant les modules par priorité. Le routing CLI est unifié via `_route_module`, ce qui permet aux plugins de s'intégrer sans configuration supplémentaire.

Les plugins sont sourcés au démarrage et validés — un plugin dont le binaire requis est manquant est silencieusement ignoré.

### Fichiers shell et bloc généré {#shell-files}

`~/.bash_aliases` et `~/.bash_functions` restent à vous : mn n'écrit qu'entre deux lignes repères et conserve toutes les autres lignes telles quelles.

```bash
# >>> mn >>>
# Generated by mn. Changes inside this block are overwritten.
alias ll='ls -lah'
# <<< mn <<<
```

- La première fois que mn rencontre un fichier sans repères, il en garde une copie unique à côté (`~/.bash_aliases.mn-bak`, `~/.bash_functions.mn-bak`) et ne retire que les lignes générées par mn 1.1.x. Vos propres alias et lignes restent.
- Un nom qui ne peut pas être écrit sans risque est ignoré et listé à l'écran plutôt que de corrompre le fichier. Les noms d'alias et de repo acceptent `..`, `...` et les noms numériques ; un nom de fonction doit aussi être un nom de fichier valide. `mn` est réservé.
- Ne pas modifier l'intérieur du bloc : la prochaine sauvegarde le régénère. Mettre ses propres lignes au-dessus ou en dessous.
- Une commande que mn renvoie au terminal (`c` dans les connexions) passe par un fichier temporaire privé créé par l'enveloppe `mn()`, jamais par un chemin fixe dans `/tmp`.

## mn devient tote {#tote}

mn évolue en [tote](/help/linux/tote) : les mêmes domaines (connexions, dépôts, alias, fonctions), réécrits en Go. mn reste installable et fonctionne comme avant. Il est en mode maintenance depuis la version 1.3.0 : il ne reçoit plus que des correctifs de régression et de sécurité, sans nouvelle fonctionnalité. Si quelque chose qui fonctionnait dans une version précédente cesse de fonctionner, ou en cas de problème de sécurité, ouvrir une issue sur le dépôt.

## Prérequis {#prerequisites}

- `bash` (>= 4.1)
- `curl` (pour l'installation)
- Connexion internet

## Dépannage {#troubleshooting}

### Commande mn introuvable

- Vérifier que `/usr/local/bin` ou `~/.local/bin` est dans le `$PATH`
- Relancer un terminal ou sourcer le fichier de configuration shell

### Les alias ne se rechargent pas

- Vérifier que `~/.bash_aliases` est sourcé dans `~/.bashrc`
- Utiliser CONFIG → Source tous les fichiers depuis le menu
- Les alias et fonctions générés par mn se trouvent entre `# >>> mn >>>` et `# <<< mn <<<` : une modification faite à la main dans ce bloc est écrasée à la sauvegarde suivante
- La copie unique faite à la première synchronisation avec mn 1.2.1 ou plus récent est gardée dans `~/.bash_aliases.mn-bak` et `~/.bash_functions.mn-bak`

### Une connexion n'apparaît pas

- Une ligne à l'ancien format (1.1, six champs) est masquée du menu et de `mn co` : voir [Migrer depuis la 1.1](#migration)

### Données perdues après mise à jour

- Les fichiers `.dat` dans `~/.config/mn/data/` ne sont jamais modifiés par l'installeur
