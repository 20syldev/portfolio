---
title: Routage et NAT
description: Tables de routage, passerelle par défaut, routage statique et dynamique, NAT/PAT et outils de diagnostic.
category: networking
slug: routing
order: 6
---

## Qu'est-ce que le routage ? {#intro}

Le **routage** est le processus qui détermine le chemin qu'un paquet doit emprunter pour atteindre sa destination. Quand tu envoies un paquet vers une [adresse IP](/help/networking/addressing) qui n'est pas sur ton réseau local, ton système le transmet au **routeur**, qui le fait avancer de proche en proche jusqu'à la destination.

Chaque routeur sur le chemin consulte sa **table de routage** pour décider vers quel routeur suivant (next hop) envoyer le paquet.

## Passerelle par défaut {#gateway}

La **passerelle par défaut** (default gateway) est le routeur vers lequel ton système envoie tout paquet destiné à un réseau qu'il ne connaît pas. C'est la "sortie" de ton réseau local vers Internet.

```
┌────────────────┐          ┌───────────────┐          ┌────────────┐
│     Ton PC     │  ─────>  │    Routeur    │  ─────>  │  Internet  │
│  192.168.1.10  │          │  192.168.1.1  │          └────────────┘
└────────────────┘          │   (gateway)   │
                            └───────────────┘
```

```bash
# Display default gateway
ip route | grep default

# Example output
# default via 192.168.1.1 dev eth0 proto dhcp metric 100
```

## Table de routage {#routing-table}

La table de routage contient les règles qui indiquent au système où envoyer chaque paquet en fonction de sa destination.

```bash
# Display the routing table
ip route show
```

```
default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1
```

| Colonne      | Signification                                               |
| ------------ | ----------------------------------------------------------- |
| `default`    | Route par défaut (tout ce qui ne correspond à rien d'autre) |
| `via`        | Adresse du routeur suivant (next hop)                       |
| `dev`        | Interface réseau utilisée                                   |
| `proto`      | Origine de la route (dhcp, kernel, static)                  |
| `scope link` | Réseau directement connecté (pas besoin de routeur)         |
| `src`        | Adresse source utilisée pour les paquets sortants           |
| `metric`     | Priorité de la route (plus bas = priorité plus haute)       |

### Lecture de la table

Pour décider où envoyer un paquet, le système suit cet algorithme :

1. Parcourir toutes les routes, du préfixe le plus spécifique au moins spécifique
2. La première route dont le réseau correspond à l'adresse de destination est utilisée
3. Si aucune route ne correspond, utiliser la route `default`

> **Exemple** : Un paquet vers `172.17.0.5` empruntera la route `172.17.0.0/16 dev docker0`, car c'est la correspondance la plus spécifique. Un paquet vers `8.8.8.8` empruntera la route `default via 192.168.1.1`.

## Routage statique vs dynamique {#static-dynamic}

| Type          | Description                                          | Usage                              |
| ------------- | ---------------------------------------------------- | ---------------------------------- |
| **Statique**  | Routes configurées manuellement par l'administrateur | Petits réseaux, routes fixes       |
| **Dynamique** | Routes apprises automatiquement via des protocoles   | Grands réseaux, topologie variable |

### Protocoles de routage dynamique

| Protocole | Type            | Usage                                   |
| --------- | --------------- | --------------------------------------- |
| **RIP**   | Distance-vector | Petits réseaux (max 15 sauts), obsolète |
| **OSPF**  | Link-state      | Réseaux d'entreprise                    |
| **BGP**   | Path-vector     | Routage inter-opérateurs (Internet)     |

> **BGP** (Border Gateway Protocol) est le protocole qui fait fonctionner Internet. Il gère le routage entre les systèmes autonomes (AS) des différents fournisseurs.

```bash
# Add a static route
sudo ip route add 10.0.0.0/24 via 192.168.1.254

# Delete a static route
sudo ip route del 10.0.0.0/24

# Add a default gateway
sudo ip route add default via 192.168.1.1
```

## NAT (Network Address Translation) {#nat}

Le **NAT** permet à plusieurs appareils d'un réseau privé de partager une seule adresse IP publique pour accéder à Internet. C'est la raison pour laquelle ton réseau domestique fonctionne avec des [adresses privées](/help/networking/addressing) (`192.168.x.x`) alors qu'il n'a qu'une seule IP publique attribuée par le FAI.

```
         Réseau privé                    Internet
  ┌────────────────────────┐       ┌────────────────────────┐
  │                        │       │                        │
  │   PC A: 192.168.1.10   │       │                        │
  │   PC B: 192.168.1.11   ├───────┤      IP publique       │
  │   PC C: 192.168.1.12   │  NAT  │      203.0.113.45      │
  │                        │       │                        │
  │  Routeur: 192.168.1.1  │       │    ───> Serveur web    │
  └────────────────────────┘       └────────────────────────┘

  PC A (192.168.1.10:54321) ─ NAT ─>  203.0.113.45:54321  ──>  google.com
  PC B (192.168.1.11:49876) ─ NAT ─>  203.0.113.45:49876  ──>  google.com
```

Le routeur maintient une **table de traduction NAT** qui associe chaque connexion interne (IP privée + port) à un port sur l'IP publique.

## PAT (Port Address Translation) {#pat}

Le **PAT** (aussi appelé NAT overload) est la forme la plus courante de NAT. Il utilise les **numéros de port** pour différencier les connexions de plusieurs appareils qui partagent la même IP publique.

| IP source (interne) | Port source | IP traduite (publique) | Port traduit |
| ------------------- | ----------- | ---------------------- | ------------ |
| `192.168.1.10`      | 54321       | `203.0.113.45`         | 54321        |
| `192.168.1.11`      | 54321       | `203.0.113.45`         | 61042        |
| `192.168.1.12`      | 80          | `203.0.113.45`         | 33501        |

> **Pourquoi le NAT existe** : IPv4 ne fournit que ~4,3 milliards d'adresses, insuffisant pour tous les appareils connectés. Le NAT permet de pallier cette pénurie. [IPv6](/help/networking/addressing) résout ce problème en offrant un espace d'adressage quasi illimité.

## Traceroute {#traceroute}

`traceroute` (ou `tracepath`) permet de visualiser le chemin emprunté par un paquet pour atteindre sa destination. Il exploite le champ **TTL** (Time To Live) de l'en-tête IP.

```bash
# Trace the path to a destination
traceroute google.com
```

```
traceroute to google.com (142.250.74.206), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)       1.234 ms  1.102 ms  1.045 ms
 2  10.0.0.1 (10.0.0.1)             5.678 ms  5.432 ms  5.321 ms
 3  isp-router.example.net          12.345 ms  12.234 ms  12.123 ms
 4  * * *
 5  par21s17-in-f14.1e100.net       18.765 ms  18.654 ms  18.543 ms
```

- Chaque ligne = un **saut** (hop), c'est-à-dire un routeur traversé
- `* * *` = le routeur ne répond pas (ICMP filtré par un pare-feu)
- Les temps indiquent la latence aller-retour vers ce routeur

```bash
# Alternative that doesn't require root
tracepath google.com

# UDP-based traceroute (default on Linux)
traceroute google.com

# ICMP-based traceroute (like Windows tracert)
sudo traceroute -I google.com
```

## Pour aller plus loin {#next}

- [Adressage IP](/help/networking/addressing) — adresses IPv4/IPv6, sous-réseaux et notation CIDR
- [Diagnostic réseau](/help/networking/diagnostics) — boîte à outils complète pour le dépannage réseau
- [Introduction au réseau](/help/networking/introduction) — vocabulaire et concepts fondamentaux