---
title: Pare-feu Linux
description: Configuration UFW et iptables, filtrage de paquets, règles entrantes et sortantes, sécurisation réseau d'un serveur.
category: hardening
slug: firewall
order: 4
---

## Rôle d'un pare-feu {#role}

Un pare-feu filtre le trafic réseau entrant et sortant selon des règles définies. Sans pare-feu, tous les services qui écoutent sur le réseau sont accessibles depuis l'extérieur.

```
   Internet                         Serveur
      │                                │
      │      ┌──────────────────┐      │
      ├───>  │     Pare-feu     │───>  │  Port 22  (SSH)      ✓ Autorisé
      │      │                  │      │
      ├───>  │    Règles de     │───>  │  Port 80  (HTTP)     ✓ Autorisé
      │      │    filtrage      │      │
      ├───>  │                  │──X   │  Port 3306 (MySQL)   ✗ Bloqué
      │      │                  │      │
      ├───>  │                  │──X   │  Port 6379 (Redis)   ✗ Bloqué
      │      └──────────────────┘      │
```

Le pare-feu agit comme un gardien : seul le trafic explicitement autorisé passe.

## Architecture Netfilter {#netfilter}

Sous Linux, le filtrage de paquets est géré par **Netfilter**, un framework intégré au noyau. Les outils en espace utilisateur (`iptables`, `nftables`, `ufw`) sont des interfaces pour configurer Netfilter.

```
    Paquet entrant
         │
         ▼
    ┌─────────┐         ┌─────────────┐         ┌──────────┐
    │  INPUT  │  ────>  │  Processus  │  ────>  │  OUTPUT  │  ────>  Paquet sortant
    └─────────┘         │    local    │         └──────────┘
         │              └─────────────┘
         │
         ▼
   ┌───────────┐
   │  FORWARD  │  ───>  Paquet routé (vers un autre réseau)
   └───────────┘
```

| Chaîne    | Rôle                                         |
| --------- | -------------------------------------------- |
| `INPUT`   | Paquets destinés au serveur lui-même         |
| `OUTPUT`  | Paquets émis par le serveur                  |
| `FORWARD` | Paquets traversant le serveur (routage, NAT) |

## UFW — Uncomplicated Firewall {#ufw}

UFW est l'interface simplifiée recommandée pour gérer le pare-feu sur Debian/Ubuntu. Il génère les règles iptables correspondantes automatiquement.

### Activation et statut

```bash
# Enable the firewall
sudo ufw enable

# Check status and rules
sudo ufw status verbose

# Disable (not recommended in production)
sudo ufw disable
```

> **Attention :** Avant d'activer UFW, assure-toi d'autoriser SSH, sinon tu seras verrouillé hors du serveur : `sudo ufw allow 22/tcp` puis `sudo ufw enable`.

### Politique par défaut

```bash
# Deny all incoming traffic by default
sudo ufw default deny incoming

# Allow all outgoing traffic by default
sudo ufw default allow outgoing
```

C'est la base d'un pare-feu sain : tout bloquer en entrée, puis ouvrir uniquement ce qui est nécessaire.

### Autoriser du trafic

```bash
# Allow by port number
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow by service name
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Allow from a specific IP only
sudo ufw allow from 192.168.1.100 to any port 22

# Allow from a subnet
sudo ufw allow from 192.168.1.0/24 to any port 3306

# Allow a port range
sudo ufw allow 6000:6100/tcp
```

### Bloquer du trafic

```bash
# Deny a specific port
sudo ufw deny 23/tcp

# Deny from a specific IP
sudo ufw deny from 203.0.113.42

# Reject (sends a response instead of silently dropping)
sudo ufw reject 25/tcp
```

| Action   | Comportement                                          |
| -------- | ----------------------------------------------------- |
| `deny`   | Ignore le paquet silencieusement (drop)               |
| `reject` | Refuse le paquet et envoie une réponse à l'expéditeur |
| `allow`  | Autorise le paquet                                    |

> **Note :** `deny` est préférable à `reject` pour les connexions depuis Internet. Un `reject` confirme à l'attaquant que le port existe mais est protégé, tandis qu'un `deny` ne révèle rien.

### Supprimer des règles

```bash
# List rules with numbers
sudo ufw status numbered

# Delete by number
sudo ufw delete 3

# Delete by rule specification
sudo ufw delete allow 80/tcp
```

### Logs UFW

```bash
# Enable logging
sudo ufw logging on

# Set log level (low, medium, high, full)
sudo ufw logging medium

# View firewall logs
sudo journalctl -f | grep UFW
```

## Correspondance UFW / iptables {#ufw-vs-iptables}

| Action                          | UFW                                          | iptables                                                        |
| ------------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| Autoriser SSH                   | `ufw allow 22/tcp`                           | `iptables -A INPUT -p tcp --dport 22 -j ACCEPT`                 |
| Bloquer une IP                  | `ufw deny from 1.2.3.4`                      | `iptables -A INPUT -s 1.2.3.4 -j DROP`                          |
| Autoriser depuis un sous-réseau | `ufw allow from 10.0.0.0/8 to any port 3306` | `iptables -A INPUT -s 10.0.0.0/8 -p tcp --dport 3306 -j ACCEPT` |
| Politique par défaut deny       | `ufw default deny incoming`                  | `iptables -P INPUT DROP`                                        |
| Lister les règles               | `ufw status numbered`                        | `iptables -L -n --line-numbers`                                 |
| Supprimer une règle             | `ufw delete 3`                               | `iptables -D INPUT 3`                                           |

## Bases d'iptables {#iptables}

Pour les cas où UFW ne suffit pas, iptables offre un contrôle granulaire complet.

### Structure d'une règle

```bash
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT
#         │   │    │        │        │                 │
#         │ Chain  │       Port   Source IP          Target
#     Append      Protocol
```

### Targets (actions)

| Target   | Description                                                 |
| -------- | ----------------------------------------------------------- |
| `ACCEPT` | Autorise le paquet                                          |
| `DROP`   | Ignore le paquet silencieusement                            |
| `REJECT` | Refuse le paquet avec un message ICMP                       |
| `LOG`    | Journalise le paquet (puis continue vers la règle suivante) |

### Exemples courants

```bash
# Allow established connections (essential!)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow SSH from specific subnet
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop everything else
iptables -A INPUT -j DROP

# Save rules (Debian/Ubuntu)
sudo iptables-save > /etc/iptables/rules.v4
```

> **Important :** Les règles iptables sont évaluées dans l'ordre. La première règle qui correspond est appliquée. Place les règles les plus spécifiques en premier.

## nftables — le successeur {#nftables}

**nftables** remplace progressivement iptables depuis le noyau Linux 3.13. Il offre une syntaxe unifiée et de meilleures performances.

```bash
# Check if nftables is available
nft --version

# List current rules
sudo nft list ruleset
```

Sur les distributions récentes (Debian 11+, Ubuntu 22.04+), iptables est souvent un wrapper vers nftables (`iptables-nft`). UFW continue de fonctionner avec les deux backends.

> **Conseil :** Si tu utilises UFW, le passage à nftables est transparent. UFW gère l'abstraction pour toi.

## Cas pratique : serveur web {#practical}

Un serveur web typique n'a besoin que de trois ports ouverts :

```bash
# Reset to clean state
sudo ufw reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (from admin network only if possible)
sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp

# Allow HTTP and HTTPS from anywhere
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Verify
sudo ufw status verbose
```

```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    192.168.1.0/24
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

Tout le reste (MySQL 3306, Redis 6379, etc.) est automatiquement bloqué par la politique `deny incoming`.

## Pour aller plus loin {#next}

- [Services et processus](/help/hardening/services) — identifier quels ports doivent rester ouverts
- [Sécuriser SSH](/help/hardening/ssh) — durcir le service qui écoute sur le port 22
- [Sécurité SSH](/help/ssh/security) — Fail2Ban et restrictions d'accès SSH
- [Pare-feu pfSense](/help/pfsense/firewall) — filtrage de paquets sur une appliance dédiée