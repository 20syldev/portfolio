---
title: Fichier de configuration SSH
description: Maîtriser ~/.ssh/config pour gérer des alias d'hôtes, les clés par serveur, les options de connexion et le multiplexage.
category: ssh
slug: config
order: 5
---

## Pourquoi utiliser ~/.ssh/config ? {#intro}

Sans fichier de configuration :

```bash
ssh -i ~/.ssh/id_ed25519_prod -p 2222 deployer@192.168.1.10
```

Avec un alias configuré :

```bash
ssh prod
```

Le fichier `~/.ssh/config` centralise les options de connexion par hôte. Tous les outils SSH (ssh, scp, sftp, rsync, git) l'utilisent automatiquement.

## Structure du fichier {#structure}

```bash
# ~/.ssh/config

# Configuration globale (s'applique à tous les hôtes)
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes

# Serveur de production
Host prod
    HostName 192.168.1.10
    User deployer
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_prod

# Serveur de staging
Host staging
    HostName 192.168.1.20
    User deployer
    IdentityFile ~/.ssh/id_ed25519_prod
```

Chaque bloc `Host` définit un alias. Les directives sont lues de haut en bas — la première correspondance gagne, sauf pour `Host *` qui s'applique partout.

## Blocs Host courants {#examples}

### Serveur de production

```bash
Host prod
    HostName 192.168.1.10
    User deployer
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_prod
    IdentitiesOnly yes
```

```bash
# Utilisation
ssh prod
scp fichier.txt prod:/var/www/
rsync -avhP /local/ prod:/var/www/
```

### GitHub SSH

```bash
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes
```

```bash
# Tester la connexion
ssh -T github.com
```

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### Bastion / Jump host

Pour accéder à un serveur accessible uniquement via un bastion :

```bash
# Le bastion (accessible depuis Internet)
Host bastion
    HostName bastion.exemple.com
    User admin
    IdentityFile ~/.ssh/id_ed25519

# Le serveur interne (accessible uniquement via le bastion)
Host interne
    HostName 10.0.0.50
    User deployer
    ProxyJump bastion
```

```bash
# Connexion directe — SSH passe automatiquement par le bastion
ssh interne
```

```
┌──────────┐                ┌───────────┐                ┌─────────────┐
│  Client  │  ──  SSH  ──>  │  Bastion  │  ──  SSH  ──>  │   Interne   │
│  local   │                │  public   │                │  10.0.0.50  │
└──────────┘                └───────────┘                └─────────────┘
```

### Wildcard — Plusieurs serveurs similaires

```bash
# Tous les serveurs du réseau dev
Host *.dev.internal
    User developer
    IdentityFile ~/.ssh/id_ed25519
    ProxyJump bastion

Host db.dev.internal
    LocalForward 5432 localhost:5432
```

```bash
ssh app.dev.internal
ssh db.dev.internal    # + tunnel PostgreSQL automatique
```

## Options utiles {#options}

| Directive             | Description                                               | Exemple                  |
| --------------------- | --------------------------------------------------------- | ------------------------ |
| `HostName`            | Adresse IP ou nom DNS du serveur                          | `192.168.1.10`           |
| `User`                | Utilisateur distant par défaut                            | `deployer`               |
| `Port`                | Port SSH du serveur                                       | `2222`                   |
| `IdentityFile`        | Chemin de la clé privée                                   | `~/.ssh/id_ed25519_prod` |
| `IdentitiesOnly`      | N'utiliser que la clé spécifiée (pas les clés de l'agent) | `yes`                    |
| `ProxyJump`           | Passer par un bastion                                     | `bastion`                |
| `ServerAliveInterval` | Envoyer un keepalive toutes les N secondes                | `60`                     |
| `ServerAliveCountMax` | Nombre de keepalive sans réponse avant déconnexion        | `3`                      |
| `ForwardAgent`        | Transmettre l'agent SSH au serveur distant                | `yes`                    |
| `AddKeysToAgent`      | Ajouter automatiquement les clés à l'agent                | `yes`                    |
| `Compression`         | Activer la compression (utile sur connexions lentes)      | `yes`                    |
| `LocalForward`        | Tunnel local permanent                                    | `5432 localhost:5432`    |
| `RequestTTY`          | Forcer/empêcher l'allocation de TTY                       | `force` / `no`           |

## Multiplexage de connexions {#multiplex}

Le multiplexage réutilise une connexion SSH existante pour les sessions suivantes, évitant le temps de négociation et d'authentification.

```bash
# ~/.ssh/config

Host *
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600
```

```bash
# Créer le dossier pour les sockets
mkdir -p ~/.ssh/sockets
```

| Directive            | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `ControlMaster auto` | Crée un socket maître si aucun n'existe, sinon le réutilise                 |
| `ControlPath`        | Chemin du socket (`%r` = user, `%h` = host, `%p` = port)                    |
| `ControlPersist`     | Durée de vie du socket après fermeture de la dernière session (en secondes) |

### Comparaison avec et sans multiplexage

```bash
# Sans multiplexage — chaque connexion négocie de zéro
time ssh prod "echo ok"    # ~0.8s

# Avec multiplexage — réutilise la connexion existante
time ssh prod "echo ok"    # ~0.05s
```

### Gérer les connexions multiplexées

```bash
# Vérifier l'état d'une connexion maître
ssh -O check prod

# Fermer proprement une connexion maître
ssh -O exit prod

# Forcer la fermeture
ssh -O stop prod
```

## MN vs ~/.ssh/config {#mn-vs-config}

[mn](/help/linux/mn) et `~/.ssh/config` gèrent tous deux les connexions SSH, mais de manière complémentaire :

| Critère          | ~/.ssh/config                              | mn conn                                    |
| ---------------- | ------------------------------------------ | ------------------------------------------ |
| Interface        | Fichier texte, édition manuelle            | Menu interactif (TUI)                      |
| Utilisé par      | Tous les outils SSH (ssh, scp, rsync, git) | mn uniquement                              |
| Stockage         | `~/.ssh/config`                            | `~/.config/mn/data/connexions.dat`         |
| Options avancées | Toutes les directives SSH                  | Label, IP, description, mot de passe       |
| Commandes custom | Non                                        | Oui (type `custom`)                        |
| Recherche rapide | `ssh <alias>` en mémoire                   | Navigation par menu                        |
| Cas d'usage      | Configuration technique permanente         | Accès rapide interactif, inventaire visuel |

**Recommandation :** Utilisez `~/.ssh/config` pour la configuration technique (clés, ports, options avancées) et [mn](/help/linux/mn) pour naviguer rapidement entre vos serveurs depuis le terminal.

## Pour aller plus loin {#next}

- [Sécurité](/help/ssh/security) — durcir la configuration, Fail2Ban
- [Dépannage](/help/ssh/troubleshooting) — résoudre les erreurs de connexion