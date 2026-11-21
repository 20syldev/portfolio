---
title: Utilisation courante
description: Connexion distante, SCP, SFTP, tunnels SSH, port forwarding local et distant, SSHFS et exécution de commandes à distance.
category: ssh
slug: usage
order: 4
---

## Connexion à un serveur {#connect}

```bash
# Connexion basique
ssh user@192.168.1.10

# Avec un port personnalisé
ssh -p 2222 user@192.168.1.10

# Avec une clé spécifique
ssh -i ~/.ssh/id_ed25519_prod user@192.168.1.10
```

### Connexion rapide avec mn ou tote {#mn}

[mn](/help/linux/mn) permet de stocker ses serveurs et de s'y connecter en une touche via le module `mn conn`. [tote](/projet/tote) est son successeur, réécrit en Go, avec ses propres fichiers de données. Les deux outils lancent le vrai `ssh` : ils ne remplacent pas `~/.ssh/config`, ils le complètent.

```bash
# Ouvrir le gestionnaire de connexions
mn conn

# Se connecter sans le menu (nom ou alias)
mn co prod

# Se connecter avec un autre utilisateur, sans modifier l'entrée
mn co prod root
```

mn stocke les connexions dans `~/.config/mn/data/connexions.dat`, un enregistrement par ligne, au format :

```
name:::via:::target:::user:::aliases:::ip:::desc
prod:::ssh:::prod-web-01:::deploy:::web,p1:::192.168.1.10:::Serveur web de production
lab:::xe:::lab.internal::::::lb:::10.0.0.42:::Machine de labo derrière un bastion
```

| Champ     | Rôle                                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | Nom de l'entrée                                                                                                                                          |
| `via`     | Commande réellement lancée. Vide ou `ssh` : le client `ssh` natif. Sinon une commande, ou un modèle avec `{host}`, `{ip}`, `{name}`, `{user}`, `{user@}` |
| `target`  | Argument transmis tel quel à `ssh`. Idéalement le nom d'un bloc `Host` de `~/.ssh/config`                                                                |
| `user`    | Utilisateur par défaut (vide : `ssh_config` décide)                                                                                                      |
| `aliases` | Alias séparés par des virgules                                                                                                                           |
| `ip`      | Information seulement, jamais utilisée pour se connecter                                                                                                 |
| `desc`    | Description libre                                                                                                                                        |

> **Note :** Les anciennes lignes de mn 1.1 (`label:::user@host:::desc:::type:::password:::cmd`) ne sont pas converties par mn 1.3 : elles sont masquées du menu et ignorées par `mn co`. Il n'y a plus de mot de passe stocké, ni de type `custom` : une commande personnalisée se place dans le champ `via`.

Depuis le menu interactif, sélectionnez un serveur et appuyez sur `Entrée` pour lancer la connexion. La touche `/` filtre la liste et `u` change l'utilisateur de connexion.

Avec tote, les mêmes connexions s'ajoutent en ligne de commande et sont enregistrées dans `~/.config/tote/connections.toml` (une table `[[connection]]` par serveur) :

```bash
# Ajouter une connexion avec deux alias
tote co add web --target host1.example.org --user admin --alias w,www

# Passer par un bastion
tote co add jump --target 10.0.0.5 --via 'ssh -t admin@jump.example.org {user@}{host}'

# Se connecter (un préfixe unique du nom ou d'un alias suffit, 2 caractères au minimum par défaut)
tote co web

# Se connecter avec un autre utilisateur
tote co web deploy
```

Sans `via`, tote lance `ssh`, avec `-l user -- target` quand un utilisateur est défini. La commande `via` est découpée sur les espaces et exécutée sans shell : les guillemets sont refusés, donc les options comme `ProxyCommand` se placent dans `~/.ssh/config`.

## Commandes à distance {#remote-cmd}

Pas besoin d'ouvrir un shell interactif pour exécuter une commande ponctuelle :

```bash
# Exécuter une commande unique
ssh user@192.168.1.10 "df -h"
```

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   12G   36G  25% /
/dev/sdb1       500G  234G  241G  50% /data
```

```bash
# Enchaîner plusieurs commandes
ssh user@192.168.1.10 "cd /var/www && git pull && sudo systemctl restart app"

# Exécuter un script local sur le serveur distant
ssh user@192.168.1.10 < script.sh

# Avec sudo (nécessite un TTY)
ssh -t user@192.168.1.10 "sudo systemctl restart nginx"
```

L'option `-t` force l'allocation d'un pseudo-terminal, nécessaire pour `sudo` et les applications interactives.

## Transfert de fichiers avec SCP {#scp}

### Push — Envoyer vers un serveur

```bash
# Envoyer un fichier
scp fichier.txt user@192.168.1.10:/home/user/

# Envoyer un dossier (récursif)
scp -r /local/projet/ user@192.168.1.10:/var/www/

# Avec un port personnalisé
scp -P 2222 fichier.txt user@192.168.1.10:/home/user/
```

### Pull — Récupérer depuis un serveur

```bash
# Récupérer un fichier
scp user@192.168.1.10:/var/log/app.log ./

# Récupérer un dossier
scp -r user@192.168.1.10:/backup/2026-03/ ./backups/
```

> **Note :** Pour des transferts volumineux ou incrémentaux, [rsync over SSH](/help/rsync/remote) est plus performant que SCP — il ne transfère que les différences et supporte la reprise après interruption.

## Transfert interactif avec SFTP {#sftp}

SFTP fournit un shell interactif pour naviguer et transférer des fichiers :

```bash
sftp user@192.168.1.10
```

```
Connected to 192.168.1.10.
sftp>
```

| Commande | Description                  |
| -------- | ---------------------------- |
| `ls`     | Lister les fichiers distants |
| `lls`    | Lister les fichiers locaux   |
| `cd`     | Changer de dossier distant   |
| `lcd`    | Changer de dossier local     |
| `get`    | Télécharger un fichier       |
| `put`    | Envoyer un fichier           |
| `mkdir`  | Créer un dossier distant     |
| `rm`     | Supprimer un fichier distant |
| `exit`   | Quitter SFTP                 |

```bash
sftp> cd /var/www
sftp> get config.json
Fetching /var/www/config.json to config.json
config.json                          100% 1234     1.2KB/s   00:00
sftp> put index.html
Uploading index.html to /var/www/index.html
index.html                           100% 5678     5.5KB/s   00:00
```

## Tunnels SSH {#tunnels}

Les tunnels SSH permettent de rediriger du trafic réseau à travers une connexion SSH chiffrée. Trois types de tunnels existent.

### Port forwarding local {#local-forward}

Redirige un port local vers un service accessible depuis le serveur distant. Utile pour accéder à un service qui n'est pas exposé sur Internet.

```bash
# Syntaxe : ssh -L port_local:hôte_cible:port_cible user@serveur_ssh
ssh -L 5432:localhost:5432 user@192.168.1.10
```

Le port 5432 local est maintenant redirigé vers le PostgreSQL du serveur distant :

```bash
# Dans un autre terminal, se connecter à la base distante via le tunnel
psql -h localhost -p 5432 -U dbuser mydb
```

```
┌──────────┐                           ┌───────────┐        ┌──────────────┐
│  Client  │  ────  tunnel SSH  ────>  │  Serveur  │  ───>  │  PostgreSQL  │
│  local   │        port 5432          │    SSH    │        │  port 5432   │
└──────────┘                           └───────────┘        └──────────────┘
```

Autre exemple courant — accéder à une interface web d'administration :

```bash
# Accéder à un panel admin distant sur le port 8080
ssh -L 8080:localhost:8080 user@192.168.1.10
# Ouvrir http://localhost:8080 dans le navigateur
```

### Port forwarding distant (reverse) {#remote-forward}

Redirige un port du serveur distant vers un service local. Utile pour exposer un serveur de développement local.

```bash
# Syntaxe : ssh -R port_distant:hôte_local:port_local user@serveur_ssh
ssh -R 8080:localhost:3000 user@192.168.1.10
```

Le port 8080 du serveur distant redirige maintenant vers votre serveur local sur le port 3000 :

```
┌──────────┐                             ┌───────────┐
│  Client  │  <────  tunnel SSH  ──────  │  Serveur  │
│  :3000   │         port 8080           │    SSH    │
└──────────┘                             └───────────┘
```

> **Note :** Le serveur SSH doit avoir `GatewayPorts yes` dans `sshd_config` pour que le port soit accessible depuis d'autres machines que le serveur lui-même.

### Tunnel dynamique (proxy SOCKS) {#dynamic}

Crée un proxy SOCKS5 local qui route tout le trafic via le serveur SSH :

```bash
ssh -D 1080 user@192.168.1.10
```

Configurez votre navigateur pour utiliser le proxy SOCKS5 sur `localhost:1080`. Tout le trafic web passera par le serveur distant.

### Options utiles pour les tunnels

```bash
# -f : passer en arrière-plan après authentification
# -N : ne pas ouvrir de shell distant (tunnel uniquement)
ssh -f -N -L 5432:localhost:5432 user@192.168.1.10

# Fermer un tunnel en arrière-plan
pkill -f "ssh -f -N -L 5432"
```

## Multiplexage de connexions {#multiplex}

Le multiplexage réutilise une connexion SSH existante pour les nouvelles sessions, éliminant le temps de négociation :

```bash
# Première connexion (crée le socket)
ssh user@192.168.1.10

# Connexions suivantes — quasi-instantanées
ssh user@192.168.1.10
scp fichier.txt user@192.168.1.10:
```

La configuration complète du multiplexage est détaillée dans le [fichier de configuration SSH](/help/ssh/config#multiplex).

## Système de fichiers distant {#sshfs}

SSHFS permet de monter un répertoire distant comme un dossier local, via SSH.

### Installation

```bash
# Debian / Ubuntu
sudo apt install sshfs

# RHEL / Fedora
sudo dnf install fuse-sshfs

# Arch Linux
sudo pacman -S sshfs

# macOS
brew install macfuse sshfs
```

### Montage manuel

```bash
# Créer le point de montage
mkdir -p ~/mnt/serveur

# Monter le dossier distant
sshfs user@192.168.1.10:/var/www ~/mnt/serveur
```

```bash
# Vérifier le montage
df -h ~/mnt/serveur
```

```
Filesystem                       Size  Used Avail Use% Mounted on
user@192.168.1.10:/var/www        50G   12G   36G  25% /home/user/mnt/serveur
```

Les fichiers distants sont maintenant accessibles comme des fichiers locaux. Vous pouvez les ouvrir, les éditer et les enregistrer normalement.

### Options courantes

```bash
# Avec un port personnalisé
sshfs -p 2222 user@192.168.1.10:/data ~/mnt/data

# Avec une clé spécifique
sshfs -o IdentityFile=~/.ssh/id_ed25519_prod user@192.168.1.10:/var/www ~/mnt/serveur

# Autoriser l'accès aux autres utilisateurs locaux
sshfs -o allow_other user@192.168.1.10:/data ~/mnt/data

# Reconnexion automatique en cas de coupure
sshfs -o reconnect,ServerAliveInterval=15 user@192.168.1.10:/data ~/mnt/data
```

### Démontage

```bash
# Démontage propre
fusermount -u ~/mnt/serveur

# macOS
umount ~/mnt/serveur

# Forcer le démontage si le serveur ne répond plus
fusermount -uz ~/mnt/serveur
```

### Montage automatique via fstab

Pour monter automatiquement au démarrage, ajoutez dans `/etc/fstab` :

```
user@192.168.1.10:/var/www  /mnt/serveur  fuse.sshfs  defaults,_netdev,IdentityFile=/home/user/.ssh/id_ed25519,allow_other,reconnect  0  0
```

> **Note :** Le montage via fstab nécessite une clé SSH sans passphrase ou un agent SSH actif au démarrage.

## Pour aller plus loin {#next}

- [Fichier de configuration](/help/ssh/config) — alias d'hôtes, multiplexage complet, options avancées
- [Sécurité](/help/ssh/security) — durcir la configuration, restreindre les clés
- [Dépannage](/help/ssh/troubleshooting) — résoudre les erreurs de connexion
