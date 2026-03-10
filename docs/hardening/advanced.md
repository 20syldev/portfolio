---
title: Sécurité avancée
description: AppArmor, SELinux, durcissement noyau via sysctl, monitoring des logs, login.defs et checklist de production.
category: hardening
slug: advanced
order: 8
---

## AppArmor vs SELinux {#mac}

Les contrôles d'accès obligatoires (MAC) ajoutent une couche de sécurité au-dessus des permissions Unix classiques. Même si un processus tourne en root, le MAC peut l'empêcher d'accéder à certains fichiers ou ressources.

| Critère       | AppArmor                          | SELinux                                |
| ------------- | --------------------------------- | -------------------------------------- |
| Approche      | Basé sur les chemins (path-based) | Basé sur les labels (label-based)      |
| Distributions | Ubuntu, Debian, SUSE              | RHEL, Fedora, CentOS, Rocky            |
| Complexité    | Simple à configurer               | Complexe, courbe d'apprentissage raide |
| Profils       | Par application (fichier texte)   | Politique globale compilée             |
| Modes         | Enforce, Complain                 | Enforcing, Permissive, Disabled        |
| Granularité   | Bonne                             | Très fine                              |
| Apprentissage | Rapide (jours)                    | Long (semaines)                        |

> **Recommandation :** Sur Debian/Ubuntu, utilise AppArmor. Sur RHEL/Fedora, utilise SELinux. Ne désactive jamais le MAC sans raison valable.

## AppArmor {#apparmor}

### Vérifier le statut

```bash
# Check AppArmor status
sudo aa-status
```

```
apparmor module is loaded.
38 profiles are loaded.
36 profiles are in enforce mode.
   /usr/bin/evince
   /usr/sbin/cups-browsed
   /usr/sbin/cupsd
   /usr/sbin/ntpd
   ...
2 profiles are in complain mode.
   /usr/bin/firefox
```

### Modes de fonctionnement

| Mode       | Comportement                                        |
| ---------- | --------------------------------------------------- |
| `enforce`  | Bloque les actions non autorisées et les journalise |
| `complain` | Autorise tout mais journalise les violations        |
| `disabled` | Profil désactivé                                    |

```bash
# Switch a profile to complain mode (for testing)
sudo aa-complain /etc/apparmor.d/usr.sbin.nginx

# Switch back to enforce mode
sudo aa-enforce /etc/apparmor.d/usr.sbin.nginx

# Disable a profile
sudo aa-disable /etc/apparmor.d/usr.sbin.nginx
```

### Gérer les profils

```bash
# Install additional utilities
sudo apt install apparmor-utils

# List all profiles and their modes
sudo aa-status

# Reload all profiles
sudo systemctl reload apparmor

# Generate a new profile for a program
sudo aa-genprof /usr/sbin/nginx
```

> **Conseil :** Quand tu configures un nouveau service, passe d'abord le profil en mode `complain`, utilise le service normalement pendant quelques jours, puis passe en `enforce` une fois que le profil est affiné.

## Chroot jails {#chroot}

Un **chroot** isole un processus dans un sous-répertoire du système de fichiers. Le processus ne peut pas accéder aux fichiers en dehors de sa "prison".

```
Système de fichiers réel         Chroot jail
/                                /srv/jail/
├── bin/                         ├── bin/
├── etc/                         ├── etc/
├── home/                        ├── lib/
├── srv/                         └── (rien d'autre)
│   └── jail/  <──  racine vue par le processus
└── ...
```

```bash
# Create a minimal chroot environment
sudo mkdir -p /srv/jail/{bin,lib,lib64,etc}

# Copy necessary binaries and libraries
sudo cp /bin/bash /srv/jail/bin/
sudo cp /lib/x86_64-linux-gnu/libc.so.6 /srv/jail/lib/
sudo cp /lib64/ld-linux-x86-64.so.2 /srv/jail/lib64/

# Enter the chroot
sudo chroot /srv/jail /bin/bash
```

> **Note :** Le chroot seul n'est pas une mesure de sécurité suffisante. Un processus root peut s'en échapper. Pour une vraie isolation, combine avec AppArmor ou utilise des conteneurs (LXC, Docker).

## Durcissement du noyau {#sysctl}

Le fichier `/etc/sysctl.conf` (ou `/etc/sysctl.d/*.conf`) permet de modifier les paramètres du noyau au runtime. Plusieurs paramètres renforcent la sécurité réseau et système.

### Paramètres réseau

```bash
# /etc/sysctl.d/99-hardening.conf

# Disable IP forwarding (unless the server is a router)
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Disable ICMP redirects (prevent MITM attacks)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# Enable SYN cookies (protect against SYN flood attacks)
net.ipv4.tcp_syncookies = 1

# Ignore ICMP broadcast requests (prevent smurf attacks)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Log suspicious packets (martians)
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Disable source routing (prevent IP spoofing)
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Enable reverse path filtering (anti-spoofing)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
```

### Paramètres système

```bash
# Restrict access to kernel logs
kernel.dmesg_restrict = 1

# Restrict access to kernel pointers
kernel.kptr_restrict = 2

# Disable magic SysRq key (prevents keyboard-based exploits on physical access)
kernel.sysrq = 0

# Restrict ptrace (process tracing) to parent processes only
kernel.yama.ptrace_scope = 1

# Randomize memory layout (ASLR)
kernel.randomize_va_space = 2
```

### Appliquer les changements

```bash
# Apply all sysctl parameters
sudo sysctl -p /etc/sysctl.d/99-hardening.conf

# Verify a specific parameter
sysctl net.ipv4.ip_forward
```

## Logging et monitoring {#logging}

### journalctl

`journalctl` est l'interface pour lire les logs systemd :

```bash
# Follow logs in real time
sudo journalctl -f

# Logs for a specific service
sudo journalctl -u ssh.service

# Logs since last boot
sudo journalctl -b

# Logs from the last hour
sudo journalctl --since "1 hour ago"

# Logs with priority error or higher
sudo journalctl -p err

# Disk usage of journal
sudo journalctl --disk-usage
```

### Configurer la rétention des logs

```bash
# /etc/systemd/journald.conf
[Journal]
SystemMaxUse=500M
MaxRetentionSec=3month
```

```bash
# Apply changes
sudo systemctl restart systemd-journald
```

### rsyslog

Pour les logs traditionnels dans `/var/log/` :

```bash
# Authentication logs
sudo tail -f /var/log/auth.log

# System logs
sudo tail -f /var/log/syslog

# Kernel messages
sudo tail -f /var/log/kern.log
```

### Que surveiller ?

| Log                      | Contenu                             | Chercher                           |
| ------------------------ | ----------------------------------- | ---------------------------------- |
| `/var/log/auth.log`      | Authentification (SSH, sudo, login) | Failed password, invalid user      |
| `/var/log/syslog`        | Messages système généraux           | Erreurs, services qui crashent     |
| `/var/log/kern.log`      | Messages du noyau                   | Erreurs matérielles, AppArmor deny |
| `journalctl -u ssh`      | Logs SSH                            | Connexions, déconnexions, échecs   |
| `journalctl -u fail2ban` | Logs Fail2Ban                       | IP bannies, débannissements        |

## Politique de mots de passe {#login-defs}

### /etc/login.defs

Ce fichier contrôle la politique de mots de passe pour les comptes locaux :

```bash
# /etc/login.defs

# Password aging
PASS_MAX_DAYS   90
PASS_MIN_DAYS   7
PASS_WARN_AGE   14
PASS_MIN_LEN    12

# UID/GID ranges
UID_MIN         1000
UID_MAX         60000

# Encryption method for passwords
ENCRYPT_METHOD  SHA512

# umask for new home directories
UMASK           027
```

| Directive        | Recommandation | Explication                             |
| ---------------- | -------------- | --------------------------------------- |
| `PASS_MAX_DAYS`  | 90             | Forcer le changement tous les 90 jours  |
| `PASS_MIN_DAYS`  | 7              | Empêcher les changements trop fréquents |
| `PASS_WARN_AGE`  | 14             | Prévenir 14 jours avant l'expiration    |
| `PASS_MIN_LEN`   | 12             | Longueur minimale (12+ caractères)      |
| `ENCRYPT_METHOD` | SHA512         | Hachage fort pour les mots de passe     |

```bash
# Check password policy for a specific user
sudo chage -l deployer

# Force password change on next login
sudo chage -d 0 deployer
```

## Bannières de connexion {#banners}

### /etc/issue (avant connexion)

Affiché avant l'authentification sur les terminaux locaux et SSH :

```bash
# /etc/issue
Authorized access only. All activity is monitored and logged.
Unauthorized access is prohibited and will be prosecuted.
```

### /etc/issue.net (SSH)

Spécifique aux connexions SSH :

```bash
# /etc/issue.net
*********************************************
*  Authorized access only.                  *
*  All sessions are monitored and logged.   *
*********************************************
```

```bash
# Enable in sshd_config
# /etc/ssh/sshd_config
Banner /etc/issue.net
```

### /etc/motd (après connexion)

Affiché après une connexion réussie :

```bash
# /etc/motd
System: production-web-01
Last security audit: 2026-03-01
Contact: admin@example.com
```

> **Note légale :** Dans certaines juridictions, une bannière d'avertissement est un prérequis légal pour poursuivre un accès non autorisé. Même si tu ne poursuis personne, c'est une bonne pratique.

## Checklist serveur de production {#checklist}

Résumé des mesures de durcissement à appliquer sur un serveur de production :

```bash
# Quick verification script
echo "=== SSH ==="
sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication|allowgroups'

echo "=== Firewall ==="
sudo ufw status

echo "=== Services ==="
systemctl list-units --type=service --state=running --no-pager

echo "=== Ports ==="
sudo ss -tlnp

echo "=== Sysctl ==="
sysctl net.ipv4.ip_forward net.ipv4.tcp_syncookies kernel.randomize_va_space

echo "=== Updates ==="
apt list --upgradable 2>/dev/null | wc -l

echo "=== AppArmor ==="
sudo aa-status | head -5

echo "=== SUID files ==="
sudo find / -perm -4000 -type f 2>/dev/null | wc -l
```

| Catégorie    | Mesure                                | Doc associée                                |
| ------------ | ------------------------------------- | ------------------------------------------- |
| Accès        | Root SSH désactivé, clés uniquement   | [SSH](/help/hardening/ssh)                  |
| Accès        | Fail2Ban actif                        | [SSH sécurité](/help/ssh/security#fail2ban) |
| Réseau       | UFW activé, deny par défaut           | [Pare-feu](/help/hardening/firewall)        |
| Services     | Seuls les services nécessaires actifs | [Services](/help/hardening/services)        |
| Mises à jour | unattended-upgrades configuré         | [Mises à jour](/help/hardening/updates)     |
| Noyau        | sysctl durci                          | [Sysctl](#sysctl)                           |
| Permissions  | umask 027, SUID audité                | [Utilisateurs](/help/hardening/users)       |
| MAC          | AppArmor en enforce                   | [AppArmor](#apparmor)                       |
| Audit        | Lynis score 80+                       | [Lynis](/help/hardening/updates#lynis)      |
| Logs         | Journaux centralisés et surveillés    | [Logging](#logging)                         |

## Pour aller plus loin {#next}

- [Introduction au hardening](/help/hardening/introduction) — revenir aux fondamentaux
- [Mises à jour et audit](/help/hardening/updates) — Lynis pour mesurer le niveau de durcissement
- [Introduction à la cryptographie](/help/cryptography/introduction) — comprendre les algorithmes qui protègent les communications