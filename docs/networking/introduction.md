---
title: Introduction au réseau
description: Fondamentaux du réseau informatique, vocabulaire essentiel, types de réseaux, topologies et modèle client-serveur.
category: networking
slug: introduction
order: 1
---

## Pourquoi comprendre le réseau ? {#why}

Le réseau est le socle invisible de toute infrastructure informatique. Chaque requête web, chaque transfert de fichier, chaque connexion [SSH](/help/ssh/introduction) ou chaque `git push` repose sur des mécanismes réseau. Comprendre ces mécanismes permet de diagnostiquer des problèmes, sécuriser ses systèmes et concevoir des architectures fiables.

Que tu sois développeur, administrateur système ou passionné de cybersécurité, le réseau est une compétence fondamentale.

## Vocabulaire de base {#vocabulary}

Avant d'aller plus loin, voici les termes essentiels à maîtriser :

| Terme           | Définition                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Hôte**        | Tout appareil connecté au réseau (ordinateur, serveur, smartphone, imprimante)              |
| **Paquet**      | Unité de données transmise sur le réseau, contenant un en-tête et une charge utile          |
| **Protocole**   | Ensemble de règles qui définissent comment les données sont échangées (TCP, HTTP, DNS, etc) |
| **Port**        | Numéro logique (0-65535) qui identifie un service sur une machine (ex : 80 pour HTTP)       |
| **Interface**   | Point de connexion réseau d'un hôte (carte Ethernet `eth0`, Wi-Fi `wlan0`, loopback `lo`)   |
| **Adresse IP**  | Identifiant unique d'un hôte sur un réseau (ex : `192.168.1.10` en IPv4)                    |
| **Adresse MAC** | Identifiant physique unique d'une interface réseau, gravé dans le matériel (48 bits)        |
| **Routeur**     | Équipement qui interconnecte des réseaux et achemine les paquets entre eux                  |
| **Switch**      | Équipement qui connecte les hôtes au sein d'un même réseau local (LAN)                      |

## Bref historique {#history}

| Année | Événement                        | Impact                                                   |
| ----- | -------------------------------- | -------------------------------------------------------- |
| 1969  | ARPANET                          | Premier réseau à commutation de paquets (4 nœuds)        |
| 1974  | TCP/IP (Cerf & Kahn)             | Protocole universel qui unifie les réseaux hétérogènes   |
| 1983  | Passage d'ARPANET à TCP/IP       | Naissance d'Internet tel qu'on le connaît                |
| 1989  | World Wide Web (Tim Berners-Lee) | HTTP et HTML rendent Internet accessible au grand public |
| 1995  | Explosion commerciale d'Internet | FAI grand public, e-commerce, premiers navigateurs       |
| 2000s | Wi-Fi, haut débit, cloud         | Connectivité permanente, services distribués             |
| 2010s | IPv6, IoT, 4G/5G                 | Explosion du nombre d'appareils connectés                |

L'idée fondatrice d'ARPANET était de créer un réseau **décentralisé** capable de survivre à la perte de nœuds individuels, grâce à la commutation de paquets.

## Types de réseaux {#types}

Les réseaux sont classés par leur portée géographique :

| Type    | Nom complet               | Portée                   | Exemple                                 |
| ------- | ------------------------- | ------------------------ | --------------------------------------- |
| **PAN** | Personal Area Network     | Quelques mètres          | Bluetooth entre téléphone et écouteurs  |
| **LAN** | Local Area Network        | Bâtiment / campus        | Réseau d'entreprise, réseau domestique  |
| **MAN** | Metropolitan Area Network | Ville / agglomération    | Réseau d'un campus universitaire étendu |
| **WAN** | Wide Area Network         | Pays / continent / monde | Internet, réseau d'une multinationale   |

> **Note** : Internet est le plus grand WAN au monde. C'est un réseau de réseaux interconnectés par des routeurs.

## Topologies réseau {#topologies}

La topologie décrit l'organisation physique ou logique des connexions entre les hôtes.

| Topologie   | Avantages                          | Inconvénients                           |
| ----------- | ---------------------------------- | --------------------------------------- |
| **Étoile**  | Facile à gérer, panne isolée       | Dépend du nœud central (switch/hub)     |
| **Bus**     | Simple, peu de câblage             | Panne du câble = réseau entier en panne |
| **Anneau**  | Débit prévisible, pas de collision | Panne d'un nœud = coupure de l'anneau   |
| **Maillée** | Très résiliente, chemins multiples | Coûteuse, complexe à gérer              |

### Topologie en étoile (la plus courante)

```
                ┌───────────┐
                │   Switch  │
                └─────┬─────┘
        ┌─────────────┼─────────────┐
        │             │             │
  ┌─────┴────┐  ┌─────┴────┐  ┌─────┴────┐
  │  Hôte A  │  │  Hôte B  │  │  Hôte C  │
  └──────────┘  └──────────┘  └──────────┘
```

Dans un réseau en étoile, chaque hôte est relié à un **switch central**. Si un hôte tombe en panne, les autres continuent de communiquer. En revanche, si le switch tombe, tout le réseau est coupé.

### Topologie maillée

```
  ┌──────────┐         ┌──────────┐
  │  Hôte A  ├─────────┤  Hôte B  │
  └────┬───┬─┘         └───┬───┬──┘
       │   └───────┐    ┌──┘   │
       │           │    │      │
  ┌────┴─────┐  ┌──┴────┴──┐   │
  │  Hôte D  ├──┤  Hôte C  ├───┘
  └──────────┘  └──────────┘
```

Chaque nœud est connecté à plusieurs autres, offrant des **chemins redondants**. C'est le principe fondamental d'Internet.

## Flux de données {#dataflow}

### Client-serveur

Le modèle dominant sur Internet. Un **client** (navigateur, application) envoie une requête à un **serveur** qui traite et répond.

```
┌───────────┐      Requête HTTP     ┌───────────┐
│   Client  │  ──────────────────>  │  Serveur  │
│  (Chrome) │  <──────────────────  │  (Nginx)  │
└───────────┘      Réponse HTML     └───────────┘
```

Exemples : navigation web, requêtes DNS, [connexion SSH](/help/ssh/introduction), API REST.

### Peer-to-peer (P2P)

Chaque nœud est à la fois client et serveur. Il n'y a pas de point central.

```
┌──────────┐            ┌──────────┐
│  Pair A  │  <──────>  │  Pair B  │
└────┬─────┘            └─────┬────┘
     │                        │
     │      ┌──────────┐      │
     └───>  │  Pair C  │  <───┘
            └──────────┘
```

Exemples : BitTorrent, blockchain, certains protocoles de messagerie décentralisés.

> **En pratique** : La majorité des services modernes utilisent le modèle client-serveur. Le P2P est surtout utilisé pour le partage de fichiers et les systèmes décentralisés.

## Pour aller plus loin {#next}

- [Modèles OSI et TCP/IP](/help/networking/models) — les couches qui structurent les communications réseau
- [Protocoles essentiels](/help/networking/protocols) — TCP, UDP, HTTP, DNS et les protocoles fondamentaux
- [Adressage IP](/help/networking/addressing) — comprendre les adresses IP, sous-réseaux et CIDR