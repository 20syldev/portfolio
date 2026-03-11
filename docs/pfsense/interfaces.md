---
title: Interfaces réseau
description: Configuration des interfaces pfSense (WAN, LAN, OPT), VLANs, bridges et topologies multi-interfaces.
category: pfsense
slug: interfaces
order: 3
---

## Types d'interfaces {#types}

pfSense attribue un rôle à chaque interface réseau physique ou virtuelle.

| Interface     | Rôle                                                   | Exemple       |
| ------------- | ------------------------------------------------------ | ------------- |
| **WAN**       | Connexion vers Internet (IP publique ou DHCP FAI)      | igb0          |
| **LAN**       | Réseau local principal                                 | igb1          |
| **OPTx**      | Interfaces optionnelles (DMZ, Wi-Fi, IoT, lab)         | igb2, igb3... |
| **VLAN**      | Interface virtuelle sur un trunk 802.1Q                | igb1.10       |
| **Bridge**    | Pont entre deux interfaces (même domaine de broadcast) | bridge0       |
| **WireGuard** | Interface tunnel VPN WireGuard                         | tun_wg0       |
| **OpenVPN**   | Interface tunnel VPN OpenVPN                           | ovpns1        |
| **Loopback**  | Interface virtuelle locale                             | lo0           |

## Assignation des interfaces {#assign}

Les interfaces se configurent dans **Interfaces > Assignments**.

```
┌────────────────────────────────────────────────────┐
│  Interface Assignments                             │
│                                                    │
│  Interface  │  Network port                        │
│  ───────────┼────────────────────────────────────  │
│  WAN        │  igb0 (00:1a:2b:3c:4d:5e)            │
│  LAN        │  igb1 (00:1a:2b:3c:4d:5f)            │
│  OPT1       │  igb2 (00:1a:2b:3c:4d:60)  [+ Add]   │
│                                                    │
│  Available network ports: igb3                     │
└────────────────────────────────────────────────────┘
```

Pour ajouter une interface :

1. Sélectionne le port réseau disponible dans le menu déroulant
2. Clique sur **+ Add**
3. L'interface apparaît comme **OPTx** — elle est désactivée par défaut
4. Clique sur le nom de l'interface pour la configurer et l'activer

## Configuration d'une interface {#config}

Chaque interface dispose des paramètres suivants :

| Paramètre                  | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| **Enable**                 | Active l'interface (désactivée par défaut pour OPT)     |
| **Description**            | Nom personnalisé (ex : DMZ, WIFI, LAB)                  |
| **IPv4 Configuration**     | Static, DHCP, PPPoE, ou None                            |
| **IPv4 Address**           | Adresse IP et masque (ex : 10.0.0.1/24)                 |
| **IPv4 Gateway**           | Passerelle (uniquement pour WAN en général)             |
| **Block private networks** | Bloque les RFC1918 sur cette interface (WAN uniquement) |
| **Block bogon networks**   | Bloque les IPs non routables (WAN uniquement)           |

### Exemple : configurer une DMZ

```
Interface : OPT1
  ├── Enable         : ✓
  ├── Description    : DMZ
  ├── IPv4 Type      : Static IPv4
  ├── IPv4 Address   : 10.0.0.1 / 24
  └── IPv4 Gateway   : None
```

Après la configuration, il faut créer des [règles de pare-feu](/help/pfsense/firewall) pour autoriser le trafic vers/depuis cette interface.

## Topologie multi-interfaces {#multi}

```
               Internet
                  │
              WAN (igb0)
             203.0.113.1
                  │
     ┌────────────┴────────────┐
     │         pfSense         │
     └──┬─────────┬─────────┬──┘
        │         │         │
    LAN (igb1)    │     OPT1 (igb2)
   192.168.1.1    │      10.0.0.1
        │         │         │
  ┌─────┴─────┐   │   ┌─────┴─────┐
  │  Postes   │   │   │    DMZ    │
  │     de    │   │   │  Serveur  │
  │  travail  │   │   │    web    │
  └───────────┘   │   └───────────┘
                  │
             OPT2 (igb3)
             172.16.0.1
                  │
           ┌──────┴──────┐
           │    IoT      │
           │   Caméras   │
           │  Domotique  │
           └─────────────┘
```

Chaque interface est un réseau isolé. Le trafic entre les interfaces est contrôlé par les règles de pare-feu — par défaut, seul le trafic depuis le LAN est autorisé.

## VLANs {#vlans}

Les VLANs permettent de segmenter un réseau sur une seule interface physique via le standard 802.1Q.

### Créer un VLAN

Dans **Interfaces > Assignments > VLANs** :

| Paramètre       | Exemple                         |
| --------------- | ------------------------------- |
| **Parent**      | igb1 (interface physique trunk) |
| **VLAN Tag**    | 10                              |
| **Priority**    | 0 (défaut)                      |
| **Description** | VLAN Management                 |

### Exemple de segmentation par VLAN

| VLAN | Tag | Réseau          | Usage         |
| ---- | --- | --------------- | ------------- |
| LAN  | -   | 192.168.1.0/24  | Postes admin  |
| 10   | 10  | 192.168.10.0/24 | Serveurs      |
| 20   | 20  | 192.168.20.0/24 | Wi-Fi invités |
| 30   | 30  | 192.168.30.0/24 | IoT           |

```
          pfSense
             │
        igb1 (trunk)
      ┌──────┼──────┐
      │      │      │
   VLAN 10   │   VLAN 30
  Serveurs   │     IoT
             │
          VLAN 20
           Wi-Fi
```

### Configurer le switch

Le switch connecté à l'interface trunk doit supporter 802.1Q et être configuré pour :

- Le port vers pfSense en mode **trunk** (tagged) avec les VLANs autorisés
- Les ports vers les appareils en mode **access** (untagged) sur le VLAN approprié

## Bridges {#bridges}

Un bridge relie deux interfaces dans le même domaine de broadcast, comme un switch virtuel.

### Créer un bridge

Dans **Interfaces > Assignments > Bridges** :

1. Sélectionne les interfaces membres (ex : LAN + OPT1)
2. Le bridge hérite des règles de pare-feu de l'interface membre qui porte l'IP

> **Attention :** Le bridging est rarement nécessaire. Dans la plupart des cas, le routage entre interfaces avec des règles de pare-feu est préférable. Le bridge est utile pour des cas spécifiques comme un pare-feu transparent.

## Bonnes pratiques {#best-practices}

- **Nommer les interfaces** — remplacer OPT1/OPT2 par des noms explicites (DMZ, WIFI, IOT)
- **Un réseau par interface** — éviter le bridging sauf besoin spécifique
- **Utiliser les VLANs** quand le nombre d'interfaces physiques est limité
- **Bloquer RFC1918 sur WAN** — empêche le spoofing d'adresses privées
- **Documenter la topologie** — schématiser les interfaces, VLANs et sous-réseaux

## Pour aller plus loin {#next}

- [Pare-feu pfSense](/help/pfsense/firewall) — règles de filtrage entre interfaces
- [Services pfSense](/help/pfsense/services) — DHCP et DNS par interface
- [Adressage IP](/help/networking/addressing) — comprendre les sous-réseaux et CIDR
- [VPN WireGuard](/help/pfsense/vpn) — ajouter une interface tunnel VPN