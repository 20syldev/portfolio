---
title: Sécurité SSH
description: Durcir la configuration sshd, désactiver les mots de passe, Fail2Ban, limitation d'accès et audit des connexions.
category: ssh
slug: security
order: 6
---

## Checklist de sécurisation {#checklist}

1. Désactiver les mots de passe → [voir ci-dessous](#disable-password)
2. Désactiver le login root → [voir ci-dessous](#disable-root)
3. Limiter les utilisateurs autorisés → [voir ci-dessous](#allowusers)
4. Installer Fail2Ban → [voir ci-dessous](#fail2ban)
5. Maintenir OpenSSH à jour → `sudo apt update && sudo apt upgrade openssh-server`
6. Utiliser des clés ed25519 avec passphrase → [gestion des clés](/help/ssh/keys)
7. Restreindre les clés par commande si nécessaire → [voir ci-dessous](#restrict-key)

## Désactiver les mots de passe {#disable-password}

Prérequis : avoir déployé sa [clé SSH](/help/ssh/keys#deploy) et vérifié qu'elle fonctionne.

```bash
sudo nano /etc/ssh/sshd_config
```

```bash
# Désactiver les mots de passe
PasswordAuthentication no

# Désactiver aussi les méthodes liées
ChallengeResponseAuthentication no
UsePAM no
```

```bash
# Vérifier la syntaxe et redémarrer
sudo sshd -t && sudo systemctl restart ssh
```

> **Conseil sécurité :** Avant de redémarrer sshd, gardez une session SSH ouverte. Si la configuration est incorrecte, vous pourrez corriger sans vous verrouiller.

### Vérifier que les mots de passe sont bien désactivés

```bash
# Depuis une autre machine, tenter une connexion par mot de passe
ssh -o PubkeyAuthentication=no user@192.168.1.10
```

```
user@192.168.1.10: Permission denied (publickey).
```

Si vous voyez `Permission denied (publickey)`, les mots de passe sont bien désactivés.

## Désactiver le login root {#disable-root}

```bash
# /etc/ssh/sshd_config
PermitRootLogin no
```

Alternatives :

| Valeur                 | Comportement                                            |
| ---------------------- | ------------------------------------------------------- |
| `no`                   | Root ne peut pas se connecter en SSH (recommandé)       |
| `prohibit-password`    | Root peut se connecter uniquement par clé               |
| `forced-commands-only` | Root uniquement si la clé est restreinte à une commande |
| `yes`                  | Root peut se connecter (déconseillé)                    |

## Changer le port SSH {#port}

Changer le port par défaut réduit le bruit des scans automatisés. Ce n'est **pas** une mesure de sécurité en soi, mais ça allège les logs.

```bash
# /etc/ssh/sshd_config
Port 2222
```

```bash
# Adapter le pare-feu
sudo ufw deny 22/tcp
sudo ufw allow 2222/tcp

# Vérifier et redémarrer
sudo sshd -t && sudo systemctl restart ssh
```

> **Note :** N'oubliez pas de mettre à jour vos alias dans [~/.ssh/config](/help/ssh/config) et vos connexions dans [mn](/help/linux/mn) si vous changez le port.

## Limiter les utilisateurs autorisés {#allowusers}

```bash
# /etc/ssh/sshd_config

# Par utilisateur
AllowUsers deployer admin

# Par groupe
AllowGroups ssh-users
```

Seuls les utilisateurs ou groupes listés pourront se connecter. Tous les autres seront refusés, même avec un mot de passe ou une clé valide.

```bash
# Créer un groupe dédié et y ajouter les utilisateurs autorisés
sudo groupadd ssh-users
sudo usermod -aG ssh-users deployer
sudo usermod -aG ssh-users admin
```

## Fail2Ban {#fail2ban}

Fail2Ban surveille les logs d'authentification et bannit temporairement les IP qui échouent trop de tentatives.

### Installation

```bash
# Debian / Ubuntu
sudo apt install fail2ban

# RHEL / Fedora
sudo dnf install fail2ban
```

### Configuration

```bash
# Créer une configuration locale (ne pas modifier jail.conf directement)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 3600
ignoreip = 127.0.0.1/8 192.168.1.0/24
```

| Directive  | Description                                         |
| ---------- | --------------------------------------------------- |
| `maxretry` | Nombre de tentatives avant bannissement             |
| `findtime` | Fenêtre de temps pour compter les tentatives (600s) |
| `bantime`  | Durée du bannissement (3600s = 1h)                  |
| `ignoreip` | IP à ne jamais bannir (réseau local, VPN)           |

```bash
# Démarrer Fail2Ban
sudo systemctl enable --now fail2ban
```

### Vérifier le statut

```bash
sudo fail2ban-client status sshd
```

```
Status for the jail: sshd
|- Filter
|  |- Currently failed: 2
|  |- Total failed:     47
|  `- File list:        /var/log/auth.log
`- Actions
   |- Currently banned: 1
   |- Total banned:     12
   `- Banned IP list:   203.0.113.42
```

```bash
# Débannir une IP manuellement
sudo fail2ban-client set sshd unbanip 203.0.113.42
```

## Restreindre une clé SSH {#restrict-key}

Vous pouvez limiter ce qu'une clé SSH peut faire en ajoutant des options dans `~/.ssh/authorized_keys` sur le serveur :

```bash
command="/usr/local/bin/backup.sh",no-pty,no-agent-forwarding,no-port-forwarding,no-X11-forwarding ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... backup-key
```

| Option                  | Description                             |
| ----------------------- | --------------------------------------- |
| `command="..."`         | Seule cette commande peut être exécutée |
| `no-pty`                | Pas de terminal interactif              |
| `no-agent-forwarding`   | Pas de transmission de l'agent SSH      |
| `no-port-forwarding`    | Pas de tunnels                          |
| `no-X11-forwarding`     | Pas de forwarding X11                   |
| `from="192.168.1.0/24"` | Limiter les IP sources autorisées       |

Pour un exemple concret de restriction de clé pour rsync, consultez la [section dédiée dans la documentation rsync](/help/rsync/remote#restrict).

## Auditer les connexions {#audit}

### Logs en temps réel

```bash
# Suivre les connexions en direct
sudo journalctl -fu ssh

# Ou via le fichier de log
sudo tail -f /var/log/auth.log
```

### Historique des connexions

```bash
# Dernières connexions réussies
last -n 20
```

```
deployer pts/0  192.168.1.100  Mon Mar  9 10:00   still logged in
admin    pts/1  192.168.1.101  Mon Mar  9 09:30 - 09:45  (00:15)
deployer pts/0  192.168.1.100  Sun Mar  8 18:00 - 18:30  (00:30)
```

```bash
# Dernière connexion de chaque utilisateur
lastlog

# Sessions actuellement ouvertes
who
```

### Rechercher des tentatives échouées

```bash
# Tentatives échouées dans les logs
sudo grep "Failed password" /var/log/auth.log | tail -20

# Tentatives de clés refusées
sudo grep "Connection closed by authenticating user" /var/log/auth.log | tail -20
```

## Authentification deux facteurs {#2fa}

Pour une sécurité renforcée, vous pouvez ajouter un second facteur (TOTP) à l'authentification SSH :

```bash
# Installation
sudo apt install libpam-google-authenticator

# Configuration par utilisateur
google-authenticator
```

Le module `google-authenticator` génère un QR code à scanner avec une application TOTP (Google Authenticator, Authy, etc.). Après configuration, chaque connexion SSH demandera le code TOTP en plus de la clé.

> **Note :** La configuration complète du 2FA nécessite de modifier `/etc/pam.d/sshd` et d'activer `ChallengeResponseAuthentication yes` dans `sshd_config`. Testez toujours dans une session séparée avant de fermer votre session active.

## Pour aller plus loin {#next}

- [Dépannage](/help/ssh/troubleshooting) — diagnostiquer les erreurs de connexion
- [Fichier de configuration](/help/ssh/config) — centraliser les options de connexion