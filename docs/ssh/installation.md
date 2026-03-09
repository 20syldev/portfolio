---
title: Installation et configuration du serveur
description: Installer le client et le serveur OpenSSH sur Debian, Ubuntu, RHEL, Arch et macOS — et configurer sshd_config.
category: ssh
slug: installation
order: 2
---

## Client SSH {#client}

Le client SSH est généralement préinstallé. Vérifiez avec :

```bash
ssh -V
```

```
OpenSSH_9.6p1 Ubuntu-3ubuntu13, OpenSSL 3.0.13 30 Jan 2024
```

Si le client n'est pas installé :

```bash
# Debian / Ubuntu
sudo apt install openssh-client

# RHEL / Fedora
sudo dnf install openssh-clients

# Arch Linux
sudo pacman -S openssh

# macOS — préinstallé, mais pour la dernière version :
brew install openssh
```

## Serveur SSH (sshd) {#server}

Le serveur SSH permet à d'autres machines de se connecter à la vôtre.

```bash
# Debian / Ubuntu
sudo apt install openssh-server

# RHEL / Fedora
sudo dnf install openssh-server

# Arch Linux
sudo pacman -S openssh
```

### Activer et démarrer le service

```bash
# Activer au démarrage et démarrer immédiatement
sudo systemctl enable --now ssh      # Debian/Ubuntu
sudo systemctl enable --now sshd     # RHEL/Fedora/Arch

# Vérifier le statut
sudo systemctl status ssh
```

```
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/usr/lib/systemd/system/ssh.service; enabled)
     Active: active (running) since Mon 2026-03-09 10:00:00 CET; 2h ago
   Main PID: 1234 (sshd)
      Tasks: 1 (limit: 4915)
     Memory: 3.2M
```

### Vérifier que sshd écoute

```bash
ss -tlnp | grep 22
```

```
LISTEN  0  128  0.0.0.0:22  0.0.0.0:*  users:(("sshd",pid=1234,fd=3))
LISTEN  0  128     [::]:22     [::]:*  users:(("sshd",pid=1234,fd=4))
```

## Configuration de sshd {#sshd-config}

Le fichier de configuration principal est `/etc/ssh/sshd_config`. Voici les directives les plus importantes :

| Directive                | Défaut              | Recommandé       | Description                                            |
| ------------------------ | ------------------- | ---------------- | ------------------------------------------------------ |
| `Port`                   | `22`                | `22` (ou custom) | Port d'écoute du serveur                               |
| `PermitRootLogin`        | `prohibit-password` | `no`             | Interdire la connexion root                            |
| `PasswordAuthentication` | `yes`               | `no`             | Désactiver l'auth par mot de passe (préférer les clés) |
| `PubkeyAuthentication`   | `yes`               | `yes`            | Autoriser l'auth par clé publique                      |
| `AllowUsers`             | _(tous)_            | `user1 user2`    | Limiter les utilisateurs autorisés                     |
| `MaxAuthTries`           | `6`                 | `3`              | Nombre max de tentatives d'auth                        |
| `X11Forwarding`          | `no`                | `no`             | Forwarding X11 (désactiver si inutile)                 |
| `ClientAliveInterval`    | `0`                 | `300`            | Envoi keepalive toutes les N secondes                  |
| `ClientAliveCountMax`    | `3`                 | `2`              | Nombre de keepalive sans réponse avant déconnexion     |

### Appliquer les modifications

```bash
# Vérifier la syntaxe avant de redémarrer
sudo sshd -t

# Redémarrer le service
sudo systemctl restart ssh      # Debian/Ubuntu
sudo systemctl restart sshd     # RHEL/Fedora/Arch
```

> **Conseil sécurité :** Testez toujours la configuration avec `sshd -t` avant de redémarrer. Une erreur de syntaxe dans `sshd_config` peut rendre le serveur inaccessible. Gardez une session SSH ouverte pendant les modifications pour ne pas vous verrouiller.

## Pare-feu {#firewall}

```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw enable

# firewalld (RHEL/Fedora)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# Avec un port personnalisé (ex: 2222)
sudo ufw allow 2222/tcp
sudo firewall-cmd --permanent --add-port=2222/tcp
sudo firewall-cmd --reload
```

### Vérifier les règles

```bash
# UFW
sudo ufw status verbose

# firewalld
sudo firewall-cmd --list-all
```

## Pour aller plus loin {#next}

- [Gestion des clés](/help/ssh/keys) — générer et déployer des clés SSH
- [Sécurité](/help/ssh/security) — durcir la configuration sshd, Fail2Ban, audit