---
title: Services pfSense
description: Configuration des services pfSense (DHCP Server, DNS Resolver, DNS Forwarder, NTP) et bonnes pratiques.
category: pfsense
slug: services
order: 5
---

## Vue d'ensemble {#overview}

pfSense intègre plusieurs services réseau essentiels qui évitent d'avoir à déployer des serveurs dédiés.

```
┌──────────────────────────────────────────────────────┐
│                      pfSense                         │
│                                                      │
│   ┌──────────┐   ┌─────────────┐   ┌─────────────┐   │
│   │   DHCP   │   │    DNS      │   │     NTP     │   │
│   │  Server  │   │  Resolver   │   │    Server   │   │
│   │          │   │  (Unbound)  │   │             │   │
│   └──────────┘   └─────────────┘   └─────────────┘   │
│                                                      │
│   Attribution      Résolution      Synchronisation   │
│  d'adresses IP      de noms            horaire       │
└──────────────────────────────────────────────────────┘
```

## DHCP Server {#dhcp}

Le serveur DHCP attribue automatiquement des adresses IP aux appareils du réseau. Il se configure par interface dans **Services > DHCP Server**.

### Configuration de base

| Paramètre       | Description                         | Exemple          |
| --------------- | ----------------------------------- | ---------------- |
| **Enable**      | Activer le DHCP sur cette interface | ✓                |
| **Range From**  | Début de la plage d'adresses        | 192.168.1.100    |
| **Range To**    | Fin de la plage d'adresses          | 192.168.1.200    |
| **DNS Servers** | Serveurs DNS distribués aux clients | (vide = pfSense) |
| **Gateway**     | Passerelle distribuée aux clients   | (vide = pfSense) |
| **Domain Name** | Domaine local                       | home.lan         |
| **Lease Time**  | Durée du bail DHCP (secondes)       | 86400 (24h)      |

> **Note :** Laisser les champs DNS et Gateway vides signifie que pfSense se propose lui-même. C'est le comportement recommandé — les clients utilisent pfSense comme DNS et passerelle.

### Plage d'adresses recommandée

Pour un réseau 192.168.1.0/24 :

| Plage       | Usage                                     |
| ----------- | ----------------------------------------- |
| .1          | pfSense (passerelle)                      |
| .2 - .49    | Réservé aux IPs statiques (serveurs)      |
| .50 - .99   | Réservé aux réservations DHCP             |
| .100 - .200 | Plage DHCP dynamique                      |
| .201 - .254 | Réservé (imprimantes, équipements réseau) |

### Réservations statiques (Static Mappings)

Les réservations DHCP attribuent toujours la même IP à un appareil identifié par son adresse MAC.

Dans **Services > DHCP Server > [Interface] > DHCP Static Mappings** :

| Paramètre       | Exemple                       |
| --------------- | ----------------------------- |
| **MAC Address** | `00:1a:2b:3c:4d:5e`           |
| **IP Address**  | 192.168.1.50                  |
| **Hostname**    | serveur-web                   |
| **Description** | Web server static reservation |

> **Conseil :** Préfère les réservations DHCP aux IPs statiques configurées directement sur les machines. Cela centralise la gestion des adresses dans pfSense.

### Voir les baux actifs

Dans **Status > DHCP Leases** :

```
┌────────────────────────────────────────────────────────────────┐
│  IP Address     │  MAC Address        │  Hostname  │  Status   │
│  ───────────────┼─────────────────────┼────────────┼─────────  │
│  192.168.1.101  │  00:1a:2b:3c:4d:5e  │  laptop    │  Active   │
│  192.168.1.102  │  aa:bb:cc:dd:ee:ff  │  phone     │  Active   │
│  192.168.1.103  │  11:22:33:44:55:66  │  desktop   │  Expired  │
└────────────────────────────────────────────────────────────────┘
```

## DNS Resolver vs DNS Forwarder {#dns}

pfSense propose deux services DNS mutuellement exclusifs.

| Critère             | DNS Resolver (Unbound)        | DNS Forwarder (dnsmasq)         |
| ------------------- | ----------------------------- | ------------------------------- |
| **Fonctionnement**  | Résolution récursive complète | Transfert vers des DNS upstream |
| **Performance**     | Plus lent (première requête)  | Plus rapide (cache + forward)   |
| **Confidentialité** | Meilleure (pas de tiers)      | Dépend des DNS upstream         |
| **DNS over TLS**    | Supporté nativement           | Non                             |
| **DNSSEC**          | Supporté                      | Non                             |
| **Cache**           | Oui                           | Oui                             |
| **Recommandé**      | Usage général                 | Réseaux simples, performance    |

> **Recommandation :** Le DNS Resolver (Unbound) est activé par défaut et recommandé. Il résout les noms directement auprès des serveurs racine sans dépendre d'un tiers.

### Configurer le DNS Resolver

Dans **Services > DNS Resolver** :

| Paramètre                | Valeur recommandée                   |
| ------------------------ | ------------------------------------ |
| **Enable**               | ✓                                    |
| **Listen Port**          | 53                                   |
| **Network Interfaces**   | All                                  |
| **DNSSEC**               | ✓ (valide les signatures DNS)        |
| **DNS Query Forwarding** | ☐ (désactivé = résolution récursive) |
| **TLS for forwarding**   | ✓ (si forwarding activé)             |

### DNS over TLS (forwarding mode)

Pour utiliser le DNS Resolver en mode forwarding avec chiffrement :

1. Activer **DNS Query Forwarding** et **Use SSL/TLS for outgoing DNS**
2. Configurer les serveurs upstream dans **System > General Setup** :

| Serveur    | IP      | Hostname TLS       |
| ---------- | ------- | ------------------ |
| Cloudflare | 1.1.1.1 | cloudflare-dns.com |
| Quad9      | 9.9.9.9 | dns.quad9.net      |
| Google     | 8.8.8.8 | dns.google         |

### Overrides (Host et Domain)

Les overrides permettent de résoudre des noms locaux sans serveur DNS dédié.

**Host Overrides** — associer un nom à une IP :

| Host    | Domain   | IP Address   | Description     |
| ------- | -------- | ------------ | --------------- |
| nas     | home.lan | 192.168.1.50 | NAS Synology    |
| printer | home.lan | 192.168.1.60 | Network printer |
| proxmox | home.lan | 192.168.1.10 | Hypervisor      |

Résultat : `nas.home.lan` résout vers `192.168.1.50`.

**Domain Overrides** — rediriger un domaine entier vers un autre serveur DNS :

| Domain     | IP du serveur DNS | Description                 |
| ---------- | ----------------- | --------------------------- |
| corp.local | 10.0.0.5          | Forward to Active Directory |

## NTP Server {#ntp}

pfSense fait office de serveur NTP pour synchroniser l'horloge de tous les appareils du réseau.

Dans **Services > NTP** :

| Paramètre       | Valeur recommandée              |
| --------------- | ------------------------------- |
| **Interface**   | LAN (et autres interfaces)      |
| **NTP Servers** | 0.pfsense.pool.ntp.org (défaut) |

> **Pourquoi c'est important :** Une horloge désynchronisée peut causer des échecs d'authentification (Kerberos, certificats TLS), des logs incohérents et des problèmes de VPN.

## Bonnes pratiques {#best-practices}

- **DHCP** — toujours réserver les IPs des serveurs et équipements réseau
- **DNS** — utiliser le DNS Resolver avec DNSSEC activé
- **NTP** — vérifier que pfSense est synchronisé (Status > NTP)
- **Nommage** — utiliser un domaine local cohérent (`.lan`, `.local`, `.home`)
- **Logs** — surveiller les baux DHCP pour détecter les appareils inconnus

## Pour aller plus loin {#next}

- [VPN WireGuard](/help/pfsense/vpn) — accès distant au réseau
- [Monitoring](/help/pfsense/monitoring) — surveiller les services
- [Protocoles réseau](/help/networking/protocols) — comprendre DNS, DHCP, NTP en détail