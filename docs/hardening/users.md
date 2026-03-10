---
title: Utilisateurs et permissions
description: Gestion des comptes Linux, configuration sudo, permissions fichiers, SUID/SGID et bonnes pratiques de sécurité.
category: hardening
slug: users
order: 2
---

## Gestion des utilisateurs {#user-management}

Chaque personne ou service qui interagit avec le système doit avoir son propre compte. Pas de comptes partagés, pas de connexion directe en root.

### Créer un utilisateur

```bash
# Create a user with home directory and default shell
sudo useradd -m -s /bin/bash deployer

# Set the password
sudo passwd deployer
```

### Modifier un utilisateur

```bash
# Change the default shell
sudo usermod -s /bin/zsh deployer

# Lock an account (disable login without deleting)
sudo usermod -L deployer

# Unlock an account
sudo usermod -U deployer
```

### Supprimer un utilisateur

```bash
# Delete user and home directory
sudo userdel -r ancien-employe

# Delete user only (keep home directory for audit)
sudo userdel ancien-employe
```

> **Bonne pratique :** Avant de supprimer un compte, vérifie ses fichiers et ses tâches cron. Utilise `sudo crontab -u utilisateur -l` et `find / -user utilisateur 2>/dev/null` pour un audit rapide.

## Comprendre passwd et shadow {#passwd-shadow}

```bash
# /etc/passwd — visible by all users (no passwords here)
deployer:x:1001:1001:Deployer Account:/home/deployer:/bin/bash
```

| Champ    | Valeur             | Description               |
| -------- | ------------------ | ------------------------- |
| Login    | `deployer`         | Nom d'utilisateur         |
| Password | `x`                | Renvoi vers /etc/shadow   |
| UID      | `1001`             | Identifiant numérique     |
| GID      | `1001`             | Groupe principal          |
| GECOS    | `Deployer Account` | Commentaire (nom complet) |
| Home     | `/home/deployer`   | Répertoire personnel      |
| Shell    | `/bin/bash`        | Shell par défaut          |

```bash
# /etc/shadow — readable by root only (hashed passwords)
deployer:$6$rounds=5000$salt$hash...:19500:0:99999:7:::
```

Le fichier `/etc/shadow` contient les mots de passe hachés. Il ne doit **jamais** être lisible par un utilisateur standard :

```bash
# Verify permissions on shadow file
ls -l /etc/shadow
# Expected: -rw-r----- 1 root shadow
```

## Groupes {#groups}

Les groupes permettent de gérer les permissions de manière collective plutôt qu'individuelle.

```bash
# Create a group
sudo groupadd ssh-users

# Add a user to a supplementary group
sudo usermod -aG ssh-users deployer

# List groups for a user
groups deployer

# List all members of a group
getent group ssh-users
```

> **Attention :** Utilise toujours `-aG` (append + group). Sans le `-a`, `usermod -G` **remplace** tous les groupes secondaires de l'utilisateur au lieu d'en ajouter un.

## Configuration sudo {#sudo}

### Le fichier /etc/sudoers

Ne modifie **jamais** `/etc/sudoers` directement. Utilise toujours `visudo` qui vérifie la syntaxe avant de sauvegarder :

```bash
sudo visudo
```

### Limiter l'accès sudo

```bash
# Allow a user to run all commands
deployer ALL=(ALL:ALL) ALL

# Allow a user to run specific commands only
backup ALL=(ALL) NOPASSWD: /usr/bin/rsync, /usr/bin/systemctl restart backup.service

# Allow a group to run commands
%ssh-users ALL=(ALL:ALL) ALL
```

| Directive           | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `ALL=(ALL:ALL) ALL` | Toutes les commandes, tous les hôtes, tous les users         |
| `NOPASSWD:`         | Pas de mot de passe demandé (à limiter au strict nécessaire) |
| `%groupe`           | Applique la règle à un groupe entier                         |

### Bonnes pratiques sudo

```bash
# Create a dedicated file for custom rules (cleaner than editing sudoers)
sudo visudo -f /etc/sudoers.d/deployer
```

```bash
# Verify who has sudo access
getent group sudo

# Check sudo configuration for a user
sudo -l -U deployer
```

> **Sécurité :** Évite `NOPASSWD: ALL`. Si un attaquant compromet un compte avec cette configuration, il obtient un accès root complet sans aucun mot de passe.

## Permissions fichiers {#permissions}

### Comprendre rwx

Chaque fichier a trois niveaux de permissions pour trois catégories :

```
    -rwxr-xr--  1  deployer  www-data  4096  Mar 9  10:00  script.sh
    │├┬┤├┬┤├┬┤        │         │
    │ │  │  │      Owner      Group
    │ │  │  └───── Others (r--)   : read only
    │ │  └──────── Group  (r-x)   : read + execute
    │ └─────────── Owner  (rwx)   : read + write + execute
    └───────────── Type   (-)     : regular file
```

| Permission  | Fichier         | Répertoire                   | Valeur octale |
| ----------- | --------------- | ---------------------------- | ------------- |
| `r` (read)  | Lire le contenu | Lister le contenu            | 4             |
| `w` (write) | Modifier        | Créer/supprimer des fichiers | 2             |
| `x` (exec)  | Exécuter        | Accéder (cd)                 | 1             |

### chmod, chown, chgrp

```bash
# Change permissions (octal)
chmod 750 script.sh    # rwxr-x---

# Change permissions (symbolic)
chmod u+x script.sh    # Add execute for owner
chmod go-w config.txt  # Remove write for group and others

# Change owner
sudo chown deployer:www-data /var/www/site

# Change owner recursively
sudo chown -R deployer:www-data /var/www/site

# Change group only
sudo chgrp www-data /var/www/site/uploads
```

### umask {#umask}

Le `umask` définit les permissions **retirées** par défaut lors de la création de fichiers et répertoires :

```bash
# Check current umask
umask
# 0022 (default on most systems)

# Files: 666 - 022 = 644 (rw-r--r--)
# Dirs:  777 - 022 = 755 (rwxr-xr-x)
```

| umask | Permissions fichiers | Permissions répertoires | Usage              |
| ----- | -------------------- | ----------------------- | ------------------ |
| 0022  | 644 (rw-r--r--)      | 755 (rwxr-xr-x)         | Défaut système     |
| 0027  | 640 (rw-r-----)      | 750 (rwxr-x---)         | Recommandé serveur |
| 0077  | 600 (rw-------)      | 700 (rwx------)         | Maximum restrictif |

Pour rendre le changement permanent, ajoute `umask 0027` dans `/etc/profile` ou `~/.bashrc`.

## Permissions spéciales {#special-permissions}

### SUID, SGID et sticky bit

| Permission | Octal | Sur un fichier                            | Sur un répertoire                    | Exemple           |
| ---------- | ----- | ----------------------------------------- | ------------------------------------ | ----------------- |
| **SUID**   | 4000  | S'exécute avec les droits du propriétaire | —                                    | `/usr/bin/passwd` |
| **SGID**   | 2000  | S'exécute avec les droits du groupe       | Nouveaux fichiers héritent du groupe | `/usr/bin/wall`   |
| **Sticky** | 1000  | —                                         | Seul le propriétaire peut supprimer  | `/tmp`            |

```bash
# Set SUID
chmod u+s /usr/local/bin/program    # or chmod 4755

# Set SGID on a directory
chmod g+s /var/www/shared           # or chmod 2755

# Set sticky bit
chmod +t /tmp                       # or chmod 1777
```

### Trouver les fichiers SUID {#find-suid}

Les fichiers SUID sont un vecteur d'escalade de privilèges classique. Audite-les régulièrement :

```bash
# Find all SUID files on the system
sudo find / -perm -4000 -type f 2>/dev/null

# Find all SGID files
sudo find / -perm -2000 -type f 2>/dev/null

# Find world-writable files (potential security risk)
sudo find / -perm -o+w -type f 2>/dev/null | grep -v /proc
```

Les fichiers SUID légitimes typiques : `passwd`, `sudo`, `ping`, `mount`. Tout autre fichier SUID doit être examiné.

## Vérifications pratiques {#audit}

Checklist de sécurité à exécuter régulièrement :

```bash
# List users with UID 0 (should only be root)
awk -F: '$3 == 0 {print $1}' /etc/passwd

# List users with empty passwords
sudo awk -F: '$2 == "" {print $1}' /etc/shadow

# List users with a valid shell (exclude nologin/false)
grep -v -E '(/nologin|/false)$' /etc/passwd

# Check for unauthorized sudo access
getent group sudo

# Find files with no owner (orphaned files)
sudo find / -nouser -o -nogroup 2>/dev/null | head -20

# Check permissions on sensitive files
ls -la /etc/shadow /etc/passwd /etc/sudoers /etc/ssh/sshd_config
```

> **Conseil :** Automatise ces vérifications avec un script cron hebdomadaire. Ou mieux, utilise un outil comme [Lynis](/help/hardening/updates#lynis) qui fait tout ça et plus encore.

## Pour aller plus loin {#next}

- [Sécuriser SSH](/help/hardening/ssh) — restreindre l'accès distant au système
- [Services et processus](/help/hardening/services) — auditer ce qui tourne sur le système
- [Sécurité avancée](/help/hardening/advanced) — AppArmor, paramètres noyau et monitoring