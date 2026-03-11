---
title: Configuration avancée
description: Haute disponibilité CARP, multi-WAN, traffic shaping, hardening pfSense, backup et commandes shell utiles.
category: pfsense
slug: advanced
order: 8
---

## Haute disponibilité avec CARP {#carp}

CARP (Common Address Redundancy Protocol) permet de configurer deux pfSense en failover : si le primaire tombe, le secondaire prend le relais automatiquement.

```
             Internet
                │
           ┌────┴─────┐
           │  Switch  │
           └─┬─────┬──┘
             │     │
  ┌──────────┴─┐ ┌─┴────────────┐
  │  pfSense   │ │   pfSense    │
  │  Primaire  │ │  Secondaire  │
  │  MASTER    │ │   BACKUP     │
  └──────┬─────┘ └───────┬──────┘
         │               │
 VIP: 192.168.1.1     (CARP)
         │
   ┌─────┴─────┐
   │   Réseau  │
   │   local   │
   └───────────┘
```

### Principes

| Concept              | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **VIP (Virtual IP)** | Adresse IP partagée entre les deux pfSense (CARP)                |
| **MASTER**           | pfSense actif qui répond au trafic                               |
| **BACKUP**           | pfSense en veille, prend le relais si le MASTER est indisponible |
| **pfsync**           | Synchronisation de la table d'états entre les deux nœuds         |
| **XMLRPC Sync**      | Synchronisation de la configuration (règles, NAT, DHCP, etc.)    |

### Configuration de base

1. **Interfaces dédiées** — connecter les deux pfSense via une interface directe pour pfsync
2. **Virtual IPs** — créer des VIP CARP sur chaque interface (WAN et LAN)
3. **Sync** — configurer pfsync et XMLRPC sur le MASTER

> **Note :** La haute disponibilité nécessite du matériel identique (ou très similaire) et une planification réseau rigoureuse. Elle est surtout pertinente en environnement de production.

## Multi-WAN {#multi-wan}

Connecter pfSense à plusieurs fournisseurs Internet pour la redondance ou le load balancing.

```
    FAI 1                    FAI 2
      │                        │
 WAN1 (igb0)               WAN2 (igb2)
      │                        │
      └───────────┬────────────┘
                  │
            ┌─────┴─────┐
            │  pfSense  │
            └─────┬─────┘
                  │
              LAN (igb1)
```

### Gateway Groups

Dans **System > Routing > Gateway Groups** :

| Mode             | Configuration                        | Usage                              |
| ---------------- | ------------------------------------ | ---------------------------------- |
| **Failover**     | WAN1 Tier 1, WAN2 Tier 2             | WAN2 prend le relais si WAN1 tombe |
| **Load Balance** | WAN1 Tier 1, WAN2 Tier 1             | Trafic réparti entre les deux      |
| **Mixte**        | WAN1 Tier 1 (x2 weight), WAN2 Tier 1 | Répartition pondérée               |

### Appliquer le gateway group

1. Créer le gateway group dans **System > Routing > Gateway Groups**
2. Modifier les règles LAN : dans **Firewall > Rules > LAN**, éditer la règle "allow all"
3. Dans **Advanced Options > Gateway**, sélectionner le gateway group au lieu de "Default"

> **Attention :** Certains services (banking, sessions persistantes) ne fonctionnent pas bien avec le load balancing car l'IP source change. Utilise des règles spécifiques pour forcer ces services sur un seul WAN.

## Traffic shaping / QoS {#qos}

Le traffic shaping permet de prioriser certains types de trafic (VoIP, jeux, visio) et de limiter d'autres (téléchargements, torrents).

### Limiters

Les limiters imposent des limites de bande passante. Dans **Firewall > Traffic Shaper > Limiters** :

| Paramètre     | Exemple                       |
| ------------- | ----------------------------- |
| **Name**      | Download_Limit                |
| **Bandwidth** | 50 Mbit/s                     |
| **Mask**      | Source addresses (par client) |

Puis assigner le limiter dans une règle de pare-feu via **Advanced Options > In/Out pipe**.

### Wizard

pfSense inclut un assistant de traffic shaping dans **Firewall > Traffic Shaper > Wizards** :

| Wizard             | Usage                                     |
| ------------------ | ----------------------------------------- |
| **Traffic Shaper** | Configuration guidée des queues et règles |
| **HFSC**           | Hierarchical Fair Service Curve (avancé)  |

## Hardening pfSense {#hardening}

Mesures de sécurité pour durcir l'installation pfSense.

### Checklist de sécurité

| Mesure                                   | Où configurer                         | Priorité |
| ---------------------------------------- | ------------------------------------- | -------- |
| Changer le mot de passe admin            | System > User Manager                 | Critique |
| Désactiver le WebGUI sur WAN             | Vérifié par défaut (aucune règle WAN) | Critique |
| Forcer HTTPS pour le WebGUI              | System > Advanced > Admin Access      | Haute    |
| Changer le port du WebGUI (443 → custom) | System > Advanced > Admin Access      | Moyenne  |
| Désactiver SSH (ou restreindre par IP)   | System > Advanced > Admin Access      | Haute    |
| Activer la protection anti-lockout       | System > Advanced > Admin Access      | Haute    |
| Bloquer les réseaux RFC1918 sur WAN      | Interfaces > WAN                      | Haute    |
| Bloquer les réseaux bogon sur WAN        | Interfaces > WAN                      | Haute    |
| Configurer les DNS en DoT/DoH            | Services > DNS Resolver               | Moyenne  |
| Activer DNSSEC                           | Services > DNS Resolver               | Moyenne  |
| Mettre à jour régulièrement              | System > Update                       | Critique |
| Planifier les sauvegardes                | Diagnostics > Backup & Restore        | Haute    |

### Restreindre l'accès SSH

Si SSH est nécessaire, dans **System > Advanced > Admin Access** :

```
SSH:
  ├── Enable          : ✓
  ├── Auth Method     : Public Key Only
  ├── SSH Port        : 2222 (port personnalisé)
  └── Allowed IPs     : Restreindre via règle firewall
```

Puis dans **Firewall > Rules > LAN** :

```
Action      : Pass
Protocol    : TCP
Source      : 192.168.1.10 (admin PC only)
Destination : LAN address
Dest. Port  : 2222
Description : Allow SSH to pfSense from admin
```

### Créer des utilisateurs supplémentaires

Éviter d'utiliser le compte `admin` au quotidien. Dans **System > User Manager** :

| Paramètre       | Recommandation                    |
| --------------- | --------------------------------- |
| **Username**    | Nom personnalisé (pas "admin")    |
| **Group**       | admins (pour accès complet)       |
| **Certificate** | Générer un certificat utilisateur |

## Backup et restauration {#backup}

### Sauvegarder la configuration

Dans **Diagnostics > Backup & Restore** :

| Option            | Description                                          |
| ----------------- | ---------------------------------------------------- |
| **Backup Area**   | ALL (configuration complète)                         |
| **Skip RRD data** | ✓ (réduit la taille, les graphiques sont optionnels) |
| **Encrypt**       | ✓ (chiffrer le fichier de backup)                    |

Le fichier exporté est un XML (`config-pfSense-YYYYMMDDHHMMSS.xml`).

> **Important :** Sauvegarde régulièrement ta configuration, surtout avant les mises à jour. Stocke les backups en dehors de pfSense (NAS, cloud, machine distante).

### Restaurer

1. **Diagnostics > Backup & Restore > Restore**
2. Sélectionner le fichier XML
3. pfSense applique la configuration et redémarre les services

### AutoConfigBackup (ACB)

pfSense Plus inclut un service de backup automatique dans le cloud Netgate. Pour pfSense CE, automatise les backups via cron ou un script.

## Commandes shell utiles {#shell}

Accessibles via le menu console (option 8) ou SSH.

### pf (Packet Filter)

```bash
# View loaded firewall rules
pfctl -sr

# View NAT rules
pfctl -sn

# View active states (connections)
pfctl -ss

# View state table statistics
pfctl -si

# Clear all states (drops all connections — use with caution)
pfctl -F state

# View specific states for an IP
pfctl -ss | grep 192.168.1.50
```

### Réseau

```bash
# View interface configuration
ifconfig

# View routing table
netstat -rn

# DNS lookup using pfSense resolver
drill google.com @127.0.0.1

# ARP table (MAC to IP mappings)
arp -a

# View DHCP leases
cat /var/dhcpd/var/db/dhcpd.leases
```

### Système

```bash
# System information
uname -a

# Disk usage
df -h

# Memory usage
top -b -n 1 | head -5

# View running services
sockstat -4 -l

# Restart a service
/etc/rc.restart_webgui
```

### pfSense PHP shell

```bash
# Launch pfSense PHP shell (option 12 in console)
# Useful for advanced operations

# Example: reload all firewall rules
pfSsh.php playback svc restart pf

# Example: reload DNS resolver
pfSsh.php playback svc restart unbound
```

## Mises à jour {#updates}

### Vérifier les mises à jour

Dans **System > Update** :

- pfSense vérifie automatiquement la disponibilité des mises à jour
- Toujours **sauvegarder la configuration avant** de mettre à jour
- Lire les release notes pour identifier les breaking changes

### Bonnes pratiques de mise à jour

1. Sauvegarder la configuration (Diagnostics > Backup & Restore)
2. Lire les release notes
3. Planifier la maintenance (downtime possible)
4. Appliquer la mise à jour (System > Update)
5. Vérifier les services après le reboot
6. Tester la connectivité depuis chaque réseau

## Pour aller plus loin {#next}

- [Introduction à pfSense](/help/pfsense/introduction) — revenir aux fondamentaux
- [Pare-feu pfSense](/help/pfsense/firewall) — règles avancées et floating rules
- [Monitoring](/help/pfsense/monitoring) — surveiller la santé du système
- [Sécuriser SSH](/help/hardening/ssh) — bonnes pratiques SSH en général