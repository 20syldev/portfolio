---
title: Introduction à pfSense
description: Présentation de pfSense, appliance firewall/routeur open source basée sur FreeBSD, cas d'usage et comparaison avec les alternatives.
category: pfsense
slug: introduction
order: 1
---

## Qu'est-ce que pfSense ? {#intro}

pfSense est une distribution open source basée sur **FreeBSD** qui transforme un ordinateur standard en un pare-feu et routeur complet. Développé depuis 2004, il offre des fonctionnalités de niveau entreprise via une interface web intuitive (WebGUI).

```
┌─────────────────────────────────────────────────────────────────────┐
│                             pfSense                                 │
│                                                                     │
│   ┌────────────┐  ┌───────────┐  ┌─────────────┐  ┌──────────────┐  │
│   │  Firewall  │  │  Routeur  │  │     VPN     │  │   Services   │  │
│   │  stateful  │  │    NAT    │  │  WireGuard  │  │  DHCP / DNS  │  │
│   └────────────┘  └───────────┘  └─────────────┘  └──────────────┘  │
│                                                                     │
│   Base : FreeBSD       Interface : WebGUI     Licence : Apache 2.0  │
└─────────────────────────────────────────────────────────────────────┘
```

pfSense est utilisé aussi bien dans les homelabs que dans les PME, grâce à sa fiabilité et sa flexibilité.

## Pourquoi choisir pfSense ? {#why}

- **Open source** — code source auditable, communauté active, documentation abondante
- **Gratuit** — l'édition Community (CE) est entièrement gratuite
- **Fonctionnalités enterprise** — VPN, haute disponibilité (CARP), multi-WAN, IDS/IPS
- **Interface web complète** — configuration, monitoring et logs depuis le navigateur
- **Extensible** — système de packages pour ajouter des fonctionnalités (pfBlockerNG, Suricata, ntopng)
- **Stable** — basé sur FreeBSD, reconnu pour sa robustesse réseau

## Fonctionnalités principales {#features}

| Fonctionnalité          | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| **Pare-feu stateful**   | Filtrage de paquets avec suivi des connexions                    |
| **NAT**                 | Port forwarding, 1:1 NAT, outbound NAT                           |
| **VPN**                 | WireGuard, OpenVPN, IPsec — tunnels site-à-site et accès distant |
| **DHCP / DNS**          | Serveur DHCP, DNS Resolver (Unbound), DNS Forwarder              |
| **Haute disponibilité** | Failover avec CARP, synchronisation de configuration             |
| **Multi-WAN**           | Load balancing et failover entre plusieurs connexions Internet   |
| **Traffic shaping**     | QoS, limiters, gestion de bande passante                         |
| **Monitoring**          | Logs en temps réel, graphiques, export syslog                    |
| **IDS/IPS**             | Détection et prévention d'intrusions via Suricata ou Snort       |

## Topologie typique {#topology}

Un déploiement classique avec pfSense comme passerelle entre Internet et le réseau local :

```
           ┌──────────────┐
           │   Internet   │
           └───────┬──────┘
                   │
               WAN (igb0)
                   │
      ┌────────────┴───────────┐
      │         pfSense        │
      │                        │
      │   Firewall / Routeur   │
      │    DHCP / DNS / VPN    │
      └───┬────────────────┬───┘
          │                │
      LAN (igb1)       OPT1 (igb2)
          │                │
   ┌──────┴──────┐  ┌──────┴─────┐
   │   Réseau    │  │  Serveurs  │
   │    local    │  │    DMZ     │
   │  192.168.1  │  │  10.0.0.0  │
   └─────────────┘  └────────────┘
```

- **WAN** — interface côté Internet (IP publique ou DHCP du FAI)
- **LAN** — réseau local pour les postes de travail
- **OPT / DMZ** — réseau isolé pour les serveurs exposés (optionnel)

## pfSense vs alternatives {#comparison}

| Critère              | pfSense CE       | OPNsense                   | Sophos XG (Home)   |
| -------------------- | ---------------- | -------------------------- | ------------------ |
| Base                 | FreeBSD          | FreeBSD (fork HardenedBSD) | Linux propriétaire |
| Licence              | Apache 2.0       | BSD 2-Clause               | Gratuit (limité)   |
| Interface            | WebGUI (PHP)     | WebGUI (Python/MVC)        | WebGUI             |
| WireGuard            | Via package      | Intégré nativement         | Non                |
| Packages             | Large écosystème | Large écosystème           | Limité             |
| Communauté           | Très large       | En croissance              | Moyenne            |
| API REST             | Limitée          | Complète                   | Oui                |
| Mises à jour         | Régulières       | Fréquentes                 | Automatiques       |
| Documentation        | Excellente       | Bonne                      | Bonne              |
| Courbe apprentissage | Moyenne          | Moyenne                    | Faible             |

> **Note :** OPNsense est un fork de pfSense (2015) avec une interface modernisée et une API REST plus complète. Le choix entre les deux dépend souvent des préférences personnelles. pfSense a l'avantage de la maturité et de la taille de sa communauté.

## Éditions pfSense {#editions}

| Édition            | Prix    | Usage                                        |
| ------------------ | ------- | -------------------------------------------- |
| **Community (CE)** | Gratuit | Homelab, usage personnel, PME                |
| **Plus**           | Payant  | Support commercial, fonctionnalités avancées |

L'édition CE est largement suffisante pour un usage personnel ou un homelab.

## Pour aller plus loin {#next}

- [Installation de pfSense](/help/pfsense/installation) — installer et configurer pfSense
- [Interfaces réseau](/help/pfsense/interfaces) — configurer WAN, LAN, VLANs
- [Introduction au réseau](/help/networking/introduction) — fondamentaux du réseau informatique
- [Pare-feu Linux](/help/hardening/firewall) — comparaison avec les pare-feu logiciels Linux