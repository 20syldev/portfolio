---
title: Services et processus
description: Auditer les services actifs, identifier les ports ouverts, désactiver l'inutile et surveiller les processus suspects.
category: hardening
slug: services
order: 5
---

## Pourquoi auditer les services ? {#why}

Chaque service actif est un point d'entrée potentiel. Un service qui écoute sur le réseau peut être exploité si une vulnérabilité est découverte. La règle est simple : **si tu n'en as pas besoin, désactive-le**.

Une installation Linux standard active souvent des services inutiles pour un serveur de production : CUPS (impression), Avahi (découverte réseau), Bluetooth, etc. Ces services augmentent la surface d'attaque sans apporter de valeur.

## Lister les services actifs {#list-services}

### Services en cours d'exécution

```bash
# List all running services
systemctl list-units --type=service --state=running
```

```
UNIT                        LOAD   ACTIVE SUB     DESCRIPTION
cron.service                loaded active running Regular background program processing
fail2ban.service            loaded active running Fail2Ban Service
networking.service          loaded active running Raise network interfaces
nginx.service               loaded active running A high performance web server
ssh.service                 loaded active running OpenBSD Secure Shell server
ufw.service                 loaded active running Uncomplicated firewall
```

### Services activés au démarrage

```bash
# List all enabled services (start at boot)
systemctl list-unit-files --type=service --state=enabled
```

C'est cette liste qui importe le plus : un service activé redémarrera automatiquement après un reboot, même si tu l'as arrêté manuellement.

### Informations détaillées sur un service

```bash
# Detailed status of a service
systemctl status nginx.service

# Check if a service is enabled
systemctl is-enabled cups.service

# Show all properties
systemctl show nginx.service
```

## Vérifier les ports ouverts {#open-ports}

Un port ouvert signifie qu'un processus écoute et attend des connexions. Identifie chaque port ouvert et vérifie s'il est légitime.

```bash
# List all listening TCP ports with process names
sudo ss -tlnp
```

```
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN  0       128     0.0.0.0:22          0.0.0.0:*          users:(("sshd",pid=1234))
LISTEN  0       511     0.0.0.0:80          0.0.0.0:*          users:(("nginx",pid=5678))
LISTEN  0       511     0.0.0.0:443         0.0.0.0:*          users:(("nginx",pid=5678))
LISTEN  0       128     127.0.0.1:3306      0.0.0.0:*          users:(("mysqld",pid=9012))
```

```bash
# List all listening ports (TCP and UDP)
sudo ss -tulnp

# Alternative with netstat
sudo netstat -tlnp
```

| Colonne          | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `Local Address`  | Adresse et port d'écoute                                     |
| `0.0.0.0:port`   | Écoute sur toutes les interfaces (accessible de l'extérieur) |
| `127.0.0.1:port` | Écoute uniquement en local (non accessible de l'extérieur)   |
| `Process`        | Nom et PID du processus                                      |

> **Point clé :** Un service qui écoute sur `0.0.0.0` est accessible depuis n'importe quelle interface réseau. Si le service n'a pas besoin d'être accessible de l'extérieur (comme MySQL), configure-le pour écouter sur `127.0.0.1` uniquement.

## Désactiver les services inutiles {#disable}

### Arrêter et désactiver

```bash
# Stop a service immediately
sudo systemctl stop cups.service

# Prevent it from starting at boot
sudo systemctl disable cups.service

# Both at once
sudo systemctl disable --now cups.service
```

### Masquer un service

`mask` va plus loin que `disable` : il empêche le service d'être démarré, même manuellement ou comme dépendance d'un autre service.

```bash
# Mask a service (strongest form of disable)
sudo systemctl mask cups.service

# Unmask if needed later
sudo systemctl unmask cups.service
```

| Action    | Effet                                                          |
| --------- | -------------------------------------------------------------- |
| `stop`    | Arrête le service maintenant (peut être redémarré)             |
| `disable` | N'est plus lancé au démarrage (peut être démarré manuellement) |
| `mask`    | Impossible à démarrer, même manuellement ou en dépendance      |

## Services couramment inutiles {#unnecessary}

Sur un serveur de production typique (web, base de données), ces services peuvent généralement être désactivés :

| Service             | Description                  | Pourquoi le désactiver                         |
| ------------------- | ---------------------------- | ---------------------------------------------- |
| `cups.service`      | Système d'impression         | Inutile sur un serveur                         |
| `avahi-daemon`      | Découverte réseau mDNS       | Inutile en production, expose des infos        |
| `bluetooth.service` | Stack Bluetooth              | Inutile sur un serveur                         |
| `ModemManager`      | Gestion des modems           | Inutile sans modem                             |
| `NetworkManager`    | Gestion réseau graphique     | Remplacé par `systemd-networkd` sur serveur    |
| `whoopsie`          | Rapport de crash Ubuntu      | Envoie des données à Canonical                 |
| `apport`            | Rapport de crash             | Inutile en production, consomme des ressources |
| `snapd`             | Gestionnaire de paquets Snap | Si tu n'utilises pas de snaps                  |
| `multipathd`        | Multipath I/O                | Inutile sans SAN                               |

```bash
# Disable all unnecessary services at once
for svc in cups avahi-daemon bluetooth ModemManager whoopsie apport; do
    sudo systemctl disable --now "$svc.service" 2>/dev/null
done
```

> **Attention :** Vérifie toujours qu'un service n'est pas une dépendance critique avant de le désactiver. Utilise `systemctl list-dependencies --reverse service.service` pour voir qui en dépend.

## Gestion des processus {#processes}

### Lister les processus

```bash
# List all processes with details
ps aux

# Interactive process viewer
htop

# Process tree (see parent/child relationships)
ps auxf
```

### Identifier les processus suspects

```bash
# Processes running as root
ps aux | grep "^root" | grep -v "\[.*\]"

# Processes consuming the most CPU
ps aux --sort=-%cpu | head -20

# Processes consuming the most memory
ps aux --sort=-%mem | head -20

# Processes with network connections
sudo ss -tlnp | awk '{print $NF}' | sort -u
```

Signaux d'alerte à surveiller :

- Processus avec des noms inhabituels ou aléatoires
- Processus root non identifiés
- Processus qui consomment anormalement des ressources
- Processus réseau sur des ports inattendus

### Terminer un processus

```bash
# Graceful termination
kill PID

# Force kill (use only if graceful fails)
kill -9 PID

# Kill by name
pkill process-name
```

## Cas pratique : audit post-install {#practical}

Voici une procédure d'audit complète pour un serveur Ubuntu/Debian :

```bash
# Step 1: List all running services
systemctl list-units --type=service --state=running

# Step 2: List all listening ports
sudo ss -tlnp

# Step 3: List enabled services
systemctl list-unit-files --type=service --state=enabled

# Step 4: Identify and disable unnecessary services
for svc in cups avahi-daemon bluetooth ModemManager whoopsie apport snapd; do
    if systemctl is-active "$svc.service" &>/dev/null; then
        echo "Disabling: $svc"
        sudo systemctl disable --now "$svc.service"
    fi
done

# Step 5: Verify ports again
sudo ss -tlnp

# Step 6: Check for services listening on 0.0.0.0 that should be local only
sudo ss -tlnp | grep "0.0.0.0"
```

### Ce qui doit rester actif (serveur web typique)

| Service               | Port    | Nécessaire ? | Note                                                        |
| --------------------- | ------- | ------------ | ----------------------------------------------------------- |
| `ssh`                 | 22      | Oui          | Accès distant (durci via [config SSH](/help/hardening/ssh)) |
| `nginx` / `apache2`   | 80, 443 | Oui          | Serveur web                                                 |
| `cron`                | —       | Oui          | Tâches planifiées                                           |
| `fail2ban`            | —       | Oui          | Protection brute-force                                      |
| `ufw`                 | —       | Oui          | [Pare-feu](/help/hardening/firewall)                        |
| `systemd-timesyncd`   | —       | Oui          | Synchronisation de l'heure                                  |
| `unattended-upgrades` | —       | Oui          | [Mises à jour auto](/help/hardening/updates)                |

Tout le reste doit être évalué et désactivé si non nécessaire.

## Pour aller plus loin {#next}

- [Pare-feu Linux](/help/hardening/firewall) — bloquer l'accès aux ports qui restent ouverts
- [Mises à jour et audit](/help/hardening/updates) — garder les services restants à jour et auditables
- [Sécurité avancée](/help/hardening/advanced) — AppArmor pour confiner les services restants