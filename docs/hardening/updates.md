---
title: Mises à jour et audit
description: Gestion des mises à jour sécurité, unattended-upgrades, audit Lynis, vérification CVE et intégrité des paquets.
category: hardening
slug: updates
order: 6
---

## Importance des mises à jour {#why}

Chaque jour, de nouvelles vulnérabilités (CVE) sont découvertes dans les logiciels installés sur ton serveur. Une vulnérabilité non corrigée est une porte ouverte pour un attaquant. Les mises à jour de sécurité corrigent ces failles, souvent dans les heures qui suivent leur publication.

```
  Vulnérabilité    Publication        Patch       Mise à jour
   découverte        du CVE         disponible     appliquée
       │                │               │              │
       ▼                ▼               ▼              ▼
   ────●────────────────●───────────────●──────────────●────────
       │                                               │
       └────────  Fenêtre de vulnérabilité  ───────────┘
                  (à minimiser absolument)
```

L'objectif est de réduire la **fenêtre de vulnérabilité** entre la publication d'un patch et son application sur ton système.

## Mises à jour manuelles {#manual}

### Debian / Ubuntu (apt)

```bash
# Update package lists
sudo apt update

# List upgradable packages
apt list --upgradable

# Upgrade all packages
sudo apt upgrade

# Full upgrade (handles dependency changes)
sudo apt full-upgrade

# Security-only updates
sudo apt upgrade -o Dir::Etc::SourceList=/etc/apt/sources.list -o Dir::Etc::SourceParts=/dev/null
```

### RHEL / Fedora (dnf)

```bash
# Check for updates
sudo dnf check-update

# Apply all updates
sudo dnf update

# Security-only updates
sudo dnf update --security

# List security advisories
sudo dnf updateinfo list security
```

### Vérifier les paquets avec des CVE connues

```bash
# Debian/Ubuntu: check which installed packages have security updates
apt list --upgradable 2>/dev/null | grep -i security

# Show details about a specific package update
apt changelog package-name | head -30
```

## Mises à jour automatiques {#unattended}

### unattended-upgrades (Debian/Ubuntu)

Le paquet `unattended-upgrades` applique automatiquement les mises à jour de sécurité sans intervention manuelle.

```bash
# Install
sudo apt install unattended-upgrades apt-listchanges

# Enable
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Configuration

```bash
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

```
// Automatically upgrade these origins
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};

// Remove unused dependencies after upgrade
Unattended-Upgrade::Remove-Unused-Dependencies "true";

// Automatic reboot if required (careful with this)
Unattended-Upgrade::Automatic-Reboot "false";

// Email notifications
Unattended-Upgrade::Mail "admin@example.com";
Unattended-Upgrade::MailReport "on-change";

// Packages to never update automatically
Unattended-Upgrade::Package-Blacklist {
    // "linux-image*";
};
```

| Directive                    | Recommandation      | Explication                                |
| ---------------------------- | ------------------- | ------------------------------------------ |
| `Allowed-Origins`            | Security uniquement | Ne pas activer les mises à jour classiques |
| `Remove-Unused-Dependencies` | `true`              | Nettoie les dépendances orphelines         |
| `Automatic-Reboot`           | `false`             | Planifier les reboots manuellement         |
| `Mail`                       | Ton email           | Être notifié des mises à jour appliquées   |

### Fréquence des vérifications

```bash
sudo nano /etc/apt/apt.conf.d/20auto-upgrades
```

```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
```

| Paramètre                       | Valeur | Description                           |
| ------------------------------- | ------ | ------------------------------------- |
| `Update-Package-Lists`          | 1      | Mise à jour des listes tous les jours |
| `Unattended-Upgrade`            | 1      | Vérification quotidienne              |
| `Download-Upgradeable-Packages` | 1      | Téléchargement anticipé               |
| `AutocleanInterval`             | 7      | Nettoyage du cache tous les 7 jours   |

### Vérifier que ça fonctionne

```bash
# Dry run (simulate without applying)
sudo unattended-upgrades --dry-run --debug

# Check logs
cat /var/log/unattended-upgrades/unattended-upgrades.log

# Last run timestamp
ls -la /var/lib/apt/periodic/
```

## Lynis — audit de sécurité {#lynis}

[Lynis](https://cisofy.com/lynis/) est un outil d'audit de sécurité open source. Il analyse ton système et produit un rapport avec des recommandations concrètes.

### Installation

```bash
# Debian / Ubuntu
sudo apt install lynis

# RHEL / Fedora
sudo dnf install lynis

# From source (latest version)
git clone https://github.com/CISOfy/lynis.git
cd lynis && sudo ./lynis audit system
```

### Lancer un audit

```bash
# Full system audit
sudo lynis audit system

# Quick scan (less verbose)
sudo lynis audit system --quick
```

### Lire les résultats

Lynis produit un rapport structuré avec un score de durcissement :

```
  Hardening index : 67 [#############       ]
  Tests performed : 256
  Plugins enabled : 2
```

| Section           | Description                                 |
| ----------------- | ------------------------------------------- |
| `[WARNING]`       | Problèmes de sécurité importants à corriger |
| `[SUGGESTION]`    | Améliorations recommandées                  |
| `Hardening index` | Score global sur 100 (viser 80+)            |

```bash
# View only warnings
sudo grep -E "warning\[" /var/log/lynis.log

# View suggestions
sudo grep -E "suggestion\[" /var/log/lynis.log

# Full report
cat /var/log/lynis-report.dat
```

> **Conseil :** Lance Lynis après chaque session de hardening pour mesurer les progrès. Le score devrait augmenter à chaque passage.

### Exemples de recommandations Lynis

```
[WARNING] Found 2 SUID files that could be reviewed
[SUGGESTION] Consider hardening SSH configuration [SSH-7408]
[SUGGESTION] Install a file integrity tool (AIDE, Tripwire) [FINT-4350]
[SUGGESTION] Enable sysstat to collect accounting [ACCT-9626]
```

Chaque suggestion inclut un identifiant (ex: `SSH-7408`) que tu peux rechercher pour obtenir les détails.

## Intégrité des paquets {#integrity}

### Vérification GPG des dépôts

Les paquets Debian/Ubuntu sont signés avec des clés GPG. Le gestionnaire de paquets vérifie automatiquement ces signatures.

```bash
# List trusted repository keys
apt-key list

# On newer systems (apt-key is deprecated)
ls /etc/apt/trusted.gpg.d/
ls /usr/share/keyrings/
```

Pour en savoir plus sur le fonctionnement des signatures GPG, consulte la [documentation GPG](/help/gpg/introduction).

### Vérifier l'intégrité d'un paquet installé

```bash
# Check if package files have been modified
dpkg --verify package-name

# Check all installed packages (can take a while)
dpkg --verify

# Show package checksums
dpkg -V openssh-server
```

```
??5??????   /etc/ssh/sshd_config
```

Un `5` dans la sortie indique que le fichier a été modifié par rapport à la version du paquet. C'est normal pour les fichiers de configuration.

### Vérifier manuellement un CVE

```bash
# Search for a specific CVE
apt changelog openssh-server | grep -i CVE

# Check the Debian security tracker
# https://security-tracker.debian.org/tracker/

# Check Ubuntu security notices
# https://ubuntu.com/security/notices
```

## Cas pratique : mises à jour auto {#practical}

Procédure complète pour un serveur Debian/Ubuntu :

```bash
# Step 1: Update everything first
sudo apt update && sudo apt full-upgrade -y

# Step 2: Install unattended-upgrades
sudo apt install unattended-upgrades apt-listchanges -y

# Step 3: Enable automatic upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Step 4: Verify configuration
cat /etc/apt/apt.conf.d/20auto-upgrades

# Step 5: Test with dry run
sudo unattended-upgrades --dry-run --debug

# Step 6: Install and run Lynis for baseline audit
sudo apt install lynis -y
sudo lynis audit system

# Step 7: Check if a reboot is required
[ -f /var/run/reboot-required ] && echo "Reboot required" || echo "No reboot needed"
```

> **Note :** Après une mise à jour du noyau, un reboot est nécessaire pour appliquer les changements. Planifie des fenêtres de maintenance régulières.

## Pour aller plus loin {#next}

- [Sécurité avancée](/help/hardening/advanced) — AppArmor, paramètres noyau et monitoring des logs
- [Services et processus](/help/hardening/services) — vérifier que les services mis à jour sont toujours nécessaires
- [Introduction GPG](/help/gpg/introduction) — comprendre les signatures qui protègent les paquets