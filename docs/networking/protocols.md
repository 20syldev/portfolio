---
title: Protocoles essentiels
description: TCP, UDP, HTTP, DNS, DHCP, ARP et ICMP — rôle, fonctionnement et commandes pratiques pour chaque protocole.
category: networking
slug: protocols
order: 3
---

## TCP vs UDP {#tcp-udp}

Les deux protocoles de la couche Transport sont **TCP** (Transmission Control Protocol) et **UDP** (User Datagram Protocol). Ils ont des philosophies opposées.

| Critère           | TCP                                       | UDP                              |
| ----------------- | ----------------------------------------- | -------------------------------- |
| Fiabilité         | Oui (accusé de réception, retransmission) | Non (best-effort)                |
| Connexion         | Orienté connexion (handshake)             | Sans connexion                   |
| Ordre des paquets | Garanti                                   | Non garanti                      |
| Overhead          | Élevé (en-tête 20-60 octets)              | Faible (en-tête 8 octets)        |
| Contrôle de flux  | Oui (fenêtre glissante)                   | Non                              |
| Usage typique     | Web (HTTP), email, SSH, FTP               | Streaming, DNS, VoIP, jeux vidéo |

> **En résumé** : TCP quand la fiabilité est critique, UDP quand la vitesse prime sur la fiabilité.

## Le 3-way handshake TCP {#handshake}

Avant tout échange de données, TCP établit une connexion en trois étapes :

```
 ┌──────────┐                                   ┌───────────┐
 │  Client  │                                   │  Serveur  │
 └────┬─────┘                                   └─────┬─────┘
      │                                               │
      │  ───────────  1. SYN (seq=100)  ───────────>  │
      │                                               │
      │  <────  2. SYN-ACK (seq=300, ack=101)  ─────  │
      │                                               │
      │  ───────  3. ACK (seq=101, ack=301)  ──────>  │
      │                                               │
      │               Connexion établie               │
      │  <═══════════════  Données  ═══════════════>  │
```

1. **SYN** — Le client envoie un segment avec le flag SYN et un numéro de séquence initial
2. **SYN-ACK** — Le serveur répond avec SYN + ACK, son propre numéro de séquence et l'accusé de réception
3. **ACK** — Le client confirme. La connexion est établie, les données peuvent circuler

La fermeture de connexion utilise un processus similaire avec les flags **FIN** et **ACK** (4-way teardown).

## Protocoles clés {#key-protocols}

### HTTP / HTTPS (couche Application) {#http}

| Propriété  | Valeur                                        |
| ---------- | --------------------------------------------- |
| Port       | 80 (HTTP) / 443 (HTTPS)                       |
| Couche OSI | 7 — Application                               |
| Transport  | TCP                                           |
| Rôle       | Protocole de transfert hypertexte pour le Web |

HTTP est le protocole du Web. HTTPS ajoute une couche de chiffrement [TLS](/help/cryptography/introduction) pour protéger les données en transit. Chaque requête contient une méthode (`GET`, `POST`, `PUT`, `DELETE`), un chemin et des en-têtes.

### DNS (couche Application) {#dns}

| Propriété  | Valeur                                            |
| ---------- | ------------------------------------------------- |
| Port       | 53                                                |
| Couche OSI | 7 — Application                                   |
| Transport  | UDP (requêtes simples) / TCP (transferts de zone) |
| Rôle       | Résolution de noms de domaine en adresses IP      |

Le DNS traduit `google.com` en `142.250.74.206`. C'est l'annuaire d'Internet. Voir [DNS en profondeur](/help/networking/dns) pour plus de détails.

### DHCP (couche Application) {#dhcp}

| Propriété  | Valeur                                          |
| ---------- | ----------------------------------------------- |
| Port       | 67 (serveur) / 68 (client)                      |
| Couche OSI | 7 — Application                                 |
| Transport  | UDP                                             |
| Rôle       | Attribution automatique d'adresses IP aux hôtes |

DHCP attribue automatiquement une adresse IP, un masque de sous-réseau, une passerelle par défaut et un serveur DNS à chaque appareil qui se connecte au réseau. Le processus suit quatre étapes : **DORA** (Discover, Offer, Request, Acknowledge).

### ARP (couche Réseau) {#arp}

| Propriété  | Valeur                                   |
| ---------- | ---------------------------------------- |
| Port       | Aucun (protocole de couche 2/3)          |
| Couche OSI | 3 — Réseau                               |
| Transport  | Directement sur Ethernet                 |
| Rôle       | Résolution d'adresses IP en adresses MAC |

ARP (Address Resolution Protocol) permet de trouver l'adresse MAC associée à une adresse IP sur un réseau local. L'hôte envoie un broadcast ARP : "Qui a l'IP 192.168.1.1 ?", et le propriétaire répond avec son adresse MAC.

```bash
# Display the ARP cache
arp -a

# Send an ARP request manually
arping 192.168.1.1
```

### ICMP (couche Réseau) {#icmp}

| Propriété  | Valeur                                  |
| ---------- | --------------------------------------- |
| Port       | Aucun (encapsulé dans IP)               |
| Couche OSI | 3 — Réseau                              |
| Transport  | Directement dans IP                     |
| Rôle       | Messages de contrôle et d'erreur réseau |

ICMP est utilisé par `ping` (Echo Request / Echo Reply) et `traceroute` (TTL exceeded). Ce n'est pas un protocole de transport, mais un protocole de **diagnostic**.

```bash
# Test connectivity to a host
ping -c 4 192.168.1.1

# Trace the route to a destination
traceroute google.com
```

## Ports bien connus {#ports}

| Port  | Protocole | Service                       |
| ----- | --------- | ----------------------------- |
| 20/21 | TCP       | FTP (données / contrôle)      |
| 22    | TCP       | [SSH](/help/ssh/introduction) |
| 23    | TCP       | Telnet (obsolète)             |
| 25    | TCP       | SMTP (envoi d'emails)         |
| 53    | UDP/TCP   | [DNS](/help/networking/dns)   |
| 67/68 | UDP       | DHCP (serveur / client)       |
| 80    | TCP       | HTTP                          |
| 110   | TCP       | POP3 (réception d'emails)     |
| 143   | TCP       | IMAP (réception d'emails)     |
| 443   | TCP       | HTTPS                         |
| 993   | TCP       | IMAPS (IMAP sécurisé)         |
| 3306  | TCP       | MySQL                         |
| 5432  | TCP       | PostgreSQL                    |
| 8080  | TCP       | HTTP alternatif (proxy, dev)  |

> **Plages de ports** : 0-1023 = ports bien connus (réservés), 1024-49151 = ports enregistrés, 49152-65535 = ports dynamiques/éphémères.

## Commandes pratiques {#commands}

```bash
# Observe active TCP connections
ss -tuln

# Capture HTTP traffic on port 80
sudo tcpdump -i any port 80 -n

# Show which process uses a specific port
ss -tlnp | grep :443

# Test an HTTP endpoint
curl -I https://example.com

# Display DNS resolution
dig example.com
```

## Pour aller plus loin {#next}

- [DNS en profondeur](/help/networking/dns) — hiérarchie DNS, types d'enregistrements, résolution récursive
- [Adressage IP](/help/networking/addressing) — adresses IPv4/IPv6, sous-réseaux et CIDR
- [Diagnostic réseau](/help/networking/diagnostics) — boîte à outils complète pour le dépannage réseau