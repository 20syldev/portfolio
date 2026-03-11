---
title: Modèles OSI et TCP/IP
description: Les modèles en couches OSI et TCP/IP, encapsulation des données et correspondance entre les couches.
category: networking
slug: models
order: 2
---

## Pourquoi des modèles en couches ? {#why}

Les réseaux sont complexes : matériel, câbles, signaux électriques, protocoles, applications. Pour gérer cette complexité, on découpe la communication en **couches indépendantes**, chacune avec un rôle précis. Chaque couche communique avec la couche directement au-dessus et en dessous, sans se soucier des détails des autres.

Deux modèles coexistent : le modèle **OSI** (théorique, 7 couches) et le modèle **TCP/IP** (pratique, 4 couches).

## Le modèle OSI {#osi}

Le modèle OSI (Open Systems Interconnection) est un modèle de référence créé par l'ISO en 1984. Il comporte **7 couches** :

| #   | Couche       | Rôle                                                  | Protocoles / exemples    | PDU (unité de données)           |
| --- | ------------ | ----------------------------------------------------- | ------------------------ | -------------------------------- |
| 7   | Application  | Interface avec l'utilisateur                          | HTTP, FTP, SMTP, DNS     | Données                          |
| 6   | Présentation | Format des données, chiffrement, compression          | TLS/SSL, JPEG, ASCII     | Données                          |
| 5   | Session      | Gestion des sessions (ouverture, maintien, fermeture) | NetBIOS, RPC             | Données                          |
| 4   | Transport    | Fiabilité de la transmission, contrôle de flux        | TCP, UDP                 | Segment (TCP) / Datagramme (UDP) |
| 3   | Réseau       | Adressage logique et routage                          | IP, ICMP, ARP            | Paquet                           |
| 2   | Liaison      | Adressage physique, accès au média                    | Ethernet, Wi-Fi (802.11) | Trame                            |
| 1   | Physique     | Transmission des bits bruts sur le support            | Câbles, signaux, fibre   | Bits                             |

> **Astuce mnémotechnique** (de haut en bas) : **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing — Application, Présentation, Session, Transport, Network, Data Link, Physical.

### Détail des couches

**Couche 7 — Application** : c'est la couche la plus proche de l'utilisateur. Elle ne désigne pas l'application elle-même (Chrome, Firefox) mais le protocole qu'elle utilise (HTTP, DNS, SMTP).

**Couche 4 — Transport** : assure la livraison des données de bout en bout. [TCP](/help/networking/protocols) garantit la fiabilité (retransmission, ordre), [UDP](/help/networking/protocols) privilégie la vitesse.

**Couche 3 — Réseau** : gère l'[adressage IP](/help/networking/addressing) et le [routage](/help/networking/routing) des paquets entre réseaux différents.

**Couche 2 — Liaison** : gère la communication au sein d'un même réseau local via les adresses MAC.

## Le modèle TCP/IP {#tcpip}

Le modèle TCP/IP (aussi appelé modèle Internet) est le modèle réellement utilisé. Il comporte **4 couches** :

| #   | Couche       | Rôle                             | Protocoles                |
| --- | ------------ | -------------------------------- | ------------------------- |
| 4   | Application  | Protocoles applicatifs           | HTTP, DNS, SSH, FTP, SMTP |
| 3   | Transport    | Communication de bout en bout    | TCP, UDP                  |
| 2   | Internet     | Adressage et routage             | IP, ICMP, ARP             |
| 1   | Accès réseau | Transmission physique et liaison | Ethernet, Wi-Fi, PPP      |

Le modèle TCP/IP fusionne les couches 5, 6 et 7 d'OSI en une seule couche Application, et les couches 1 et 2 en une seule couche Accès réseau.

## Correspondance OSI / TCP/IP {#comparison}

```
          OSI                             TCP/IP
  ┌─────────────────┐
  │   Application   │
  ├─────────────────┤             ┌─────────────────┐
  │  Présentation   │  ────────>  │   Application   │
  ├─────────────────┤             └─────────────────┘
  │     Session     │
  ├─────────────────┤             ┌─────────────────┐
  │    Transport    │  ────────>  │    Transport    │
  ├─────────────────┤             └─────────────────┘
  │     Réseau      │             ┌─────────────────┐
  │                 │  ────────>  │     Internet    │
  ├─────────────────┤             └─────────────────┘
  │     Liaison     │             ┌─────────────────┐
  ├─────────────────┤  ────────>  │   Accès réseau  │
  │    Physique     │             └─────────────────┘
  └─────────────────┘
```

| Critère            | OSI                   | TCP/IP                           |
| ------------------ | --------------------- | -------------------------------- |
| Nombre de couches  | 7                     | 4                                |
| Origine            | ISO (théorique, 1984) | DARPA (pratique, 1970s)          |
| Usage              | Référence pédagogique | Implémentation réelle            |
| Couches fusionnées | —                     | 5+6+7 → Application, 1+2 → Accès |
| Flexibilité        | Plus détaillé         | Plus simple et pragmatique       |

## Encapsulation {#encapsulation}

Quand une application envoie des données, chaque couche **enveloppe** les données de la couche supérieure avec son propre en-tête. C'est l'**encapsulation**.

```
Couche Application    │  Données                                                          │
                      └───────────────────────────────────────────────────────────────────┘

Couche Transport      │  En-tête TCP  │  Données                                          │
                      └───────────────┴───────────────────────────────────────────────────┘

Couche Réseau         │  En-tête IP   │  En-tête TCP  │  Données                          │
                      └───────────────┴───────────────┴───────────────────────────────────┘

Couche Liaison        │  En-tête ETH  │  En-tête IP   │  En-tête TCP  │  Données  │  FCS  │
                      └───────────────┴───────────────┴───────────────┴───────────┴───────┘
```

- Chaque couche ajoute son **en-tête** (header) contenant les informations nécessaires à son fonctionnement
- La couche Liaison ajoute aussi un **FCS** (Frame Check Sequence) à la fin pour vérifier l'intégrité de la trame
- À la réception, le processus inverse s'opère : c'est la **désencapsulation**

## Désencapsulation {#decapsulation}

À la réception, chaque couche lit son en-tête, le retire, et transmet les données à la couche supérieure. Chaque couche ne traite que les informations qui la concernent.

```
Réception d'une trame Ethernet
  →  Couche Liaison : vérifie le FCS, lit l'adresse MAC, retire l'en-tête Ethernet
  →  Couche Réseau : lit l'adresse IP, retire l'en-tête IP
  →  Couche Transport : lit le port, retire l'en-tête TCP
  →  Couche Application : reçoit les données brutes
```

## En pratique {#practice}

À quelle couche travaillent ces outils et protocoles ?

| Outil / Protocole             | Couche OSI       | Couche TCP/IP |
| ----------------------------- | ---------------- | ------------- |
| `ping` (ICMP)                 | 3 — Réseau       | Internet      |
| HTTP / HTTPS                  | 7 — Application  | Application   |
| ARP                           | 3 — Réseau       | Internet      |
| TCP                           | 4 — Transport    | Transport     |
| Câble Ethernet                | 1 — Physique     | Accès réseau  |
| Switch                        | 2 — Liaison      | Accès réseau  |
| Routeur                       | 3 — Réseau       | Internet      |
| [SSH](/help/ssh/introduction) | 7 — Application  | Application   |
| [DNS](/help/networking/dns)   | 7 — Application  | Application   |
| TLS                           | 6 — Présentation | Application   |

## Pour aller plus loin {#next}

- [Protocoles essentiels](/help/networking/protocols) — TCP, UDP, HTTP, DNS et les protocoles clés du réseau
- [Adressage IP](/help/networking/addressing) — adresses IPv4/IPv6, sous-réseaux et notation CIDR
- [Diagnostic réseau](/help/networking/diagnostics) — outils pratiques pour analyser chaque couche