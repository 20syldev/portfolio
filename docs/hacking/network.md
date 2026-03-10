---
title: Attaques réseau
description: ARP spoofing, Man-in-the-Middle, DNS poisoning — comprendre les attaques réseau et s'en défendre avec Wireshark, Ettercap et Bettercap.
category: hacking
slug: network
order: 7
---

## Vue d'ensemble {#intro}

Les attaques réseau exploitent les faiblesses des protocoles de communication pour intercepter, modifier ou bloquer le trafic. La plupart ciblent les couches basses du modèle OSI (couches 2 et 3), où les protocoles ont été conçus sans mécanismes d'authentification.

> **Rappel** : Ces techniques nécessitent une autorisation explicite. Les utiliser sur un réseau sans autorisation est un délit pénal.

| Attaque         | Couche OSI  | Protocole ciblé | Impact                          |
| --------------- | ----------- | --------------- | ------------------------------- |
| ARP spoofing    | 2 (Liaison) | ARP             | Interception du trafic LAN      |
| MITM            | 2-7         | Divers          | Écoute, modification de données |
| DNS poisoning   | 7 (App.)    | DNS             | Redirection vers un faux site   |
| LLMNR/NBT-NS    | 2-3         | LLMNR, NetBIOS  | Capture de hashes NTLMv2        |
| DHCP starvation | 2           | DHCP            | Déni de service réseau          |

## ARP spoofing {#arp}

### Comment fonctionne ARP

Le protocole **ARP** (Address Resolution Protocol) associe une adresse IP à une adresse MAC sur un réseau local. Il fonctionne par diffusion et **ne comporte aucune authentification**. Voir aussi la [documentation sur les protocoles réseau](/help/networking/protocols).

```
Résolution ARP normale :
────────────────────────

┌────────────┐         "Qui a 192.168.1.1 ?"         ┌────────────┐
│   Client   │  ────  ARP Request (broadcast)  ───>  │   Routeur  │
│   .1.100   │                                       │    .1.1    │
│  AA:AA:AA  │  <─────  ARP Reply (unicast)  ──────  │  BB:BB:BB  │
└────────────┘      "192.168.1.1 est BB:BB:BB"       └────────────┘
```

### ARP cache poisoning

L'attaquant envoie de fausses réponses ARP pour associer son adresse MAC à l'IP de la passerelle, interceptant ainsi tout le trafic.

```
ARP Spoofing :
──────────────

┌────────────┐                         ┌────────────┐
│   Client   │                         │   Routeur  │
│   .1.100   │                         │   .1.1     │
│  AA:AA:AA  │                         │  BB:BB:BB  │
└─────┬──────┘                         └──────┬─────┘
      │                                       │
      │  "192.168.1.1 est CC:CC:CC"           │  "192.168.1.100 est CC:CC:CC"
      │  (faux ARP reply)                     │  (faux ARP reply)
      │                                       │
      │            ┌─────────────┐            │
      └─────────>  │  Attaquant  │  <─────────┘
                   │    .1.50    │
                   │   CC:CC:CC  │
                   └─────────────┘
             (intercepte tout le trafic)
```

Après l'attaque, le trafic entre le client et le routeur transite par la machine de l'attaquant, qui peut le lire, le modifier ou le bloquer.

## Man-in-the-Middle (MITM) {#mitm}

Une attaque **MITM** place l'attaquant entre deux parties qui communiquent. L'ARP spoofing est le vecteur le plus courant sur un réseau local, mais ce n'est pas le seul.

### Ce que l'attaquant peut voir

| Protocole      | Données accessibles                         | Protégé par TLS ? |
| -------------- | ------------------------------------------- | ----------------- |
| HTTP           | URLs, formulaires, cookies, contenu complet | Non               |
| FTP            | Identifiants, fichiers transférés           | Non               |
| Telnet         | Tout (y compris mots de passe)              | Non               |
| SMTP (non TLS) | Contenu des emails                          | Non               |
| HTTPS          | Domaine (SNI) uniquement                    | Oui               |
| SSH            | Rien (chiffré de bout en bout)              | Oui               |

> **Le chiffrement TLS/SSL protège** contre le MITM passif (écoute). Mais un attaquant peut tenter un **SSL stripping** pour forcer une connexion HTTP non chiffrée.

## DNS poisoning {#dns}

Le **DNS poisoning** (ou DNS spoofing) consiste à falsifier les réponses DNS pour rediriger un utilisateur vers une fausse adresse IP.

```
   DNS normal :                             DNS poisoning :
   ──────────────                           ─────────────────

   Client  ──>  DNS  ──>  93.184.216.34     Client  ──>  DNS empoisonné  ──>  10.0.0.50
                          (IP légitime)                                       (IP de l'attaquant)
   Client  ──>  93.184.216.34               Client  ──>  10.0.0.50
                (vrai site)                              (faux site identique)
```

**Vecteurs d'attaque :**

- Compromission du serveur DNS
- Empoisonnement du cache DNS
- Modification du fichier `/etc/hosts` ou des paramètres DNS du poste
- DHCP spoofing (fournir un faux serveur DNS)

## Outils {#tools}

### Ettercap {#ettercap}

**Ettercap** est un outil classique pour les attaques MITM via ARP spoofing.

```bash
# ARP spoofing between a target and the gateway (text mode)
sudo ettercap -T -q -i eth0 -M arp:remote /192.168.1.100// /192.168.1.1//

# With graphical interface
sudo ettercap -G

# Sniff passwords on the network
sudo ettercap -T -q -i eth0
```

### Bettercap {#bettercap}

**Bettercap** est l'alternative moderne à Ettercap, avec une interface web et des modules extensibles.

```bash
# Start bettercap on the local network
sudo bettercap -iface eth0

# Inside bettercap interactive console:
# Discover hosts on the network
net.probe on

# Start ARP spoofing (full duplex)
set arp.spoof.fullduplex true
set arp.spoof.targets 192.168.1.100
arp.spoof on

# Sniff network traffic
net.sniff on

# DNS spoofing
set dns.spoof.domains example.com
set dns.spoof.address 10.0.0.50
dns.spoof on
```

### Wireshark {#wireshark}

**Wireshark** est l'analyseur de paquets de référence. Il capture et décode le trafic réseau en temps réel.

```bash
# Capture packets on an interface (CLI alternative: tshark)
sudo wireshark

# CLI capture with tshark
sudo tshark -i eth0 -w capture.pcap
```

### Filtres Wireshark utiles

| Filtre                          | Description                          |
| ------------------------------- | ------------------------------------ |
| `http`                          | Trafic HTTP uniquement               |
| `dns`                           | Requêtes et réponses DNS             |
| `tcp.port == 80`                | Trafic sur le port 80                |
| `ip.addr == 192.168.1.100`      | Trafic depuis/vers une IP spécifique |
| `http.request.method == "POST"` | Requêtes POST (formulaires, login)   |
| `tcp.flags.syn == 1`            | Paquets SYN (début de connexion)     |
| `arp`                           | Trafic ARP (détecter le spoofing)    |
| `frame contains "password"`     | Chercher un mot dans les paquets     |

**Suivre un flux TCP** : Clic droit sur un paquet → Follow → TCP Stream. Permet de reconstituer une conversation complète (requêtes HTTP, emails, etc.).

### Responder {#responder}

**Responder** exploite les protocoles de résolution de noms Windows (LLMNR, NBT-NS, mDNS) pour capturer des hashes NTLMv2.

```bash
# Start Responder to capture NTLMv2 hashes
sudo responder -I eth0 -rdw

# Captured hashes are saved in /usr/share/responder/logs/
# Then crack them with hashcat
hashcat -m 5600 ntlmv2_hash.txt /usr/share/wordlists/rockyou.txt
```

Quand une machine Windows ne peut pas résoudre un nom DNS, elle tombe sur LLMNR/NBT-NS. Responder répond à ces requêtes et capture les hashes d'authentification.

## Défenses {#defenses}

| Attaque         | Défense                                                  |
| --------------- | -------------------------------------------------------- |
| ARP spoofing    | ARP statique, Dynamic ARP Inspection (DAI), 802.1X       |
| MITM            | TLS/HTTPS partout, HSTS, certificate pinning             |
| DNS poisoning   | DNSSEC, DNS over HTTPS (DoH), DNS over TLS (DoT)         |
| LLMNR/NBT-NS    | Désactiver LLMNR et NBT-NS via GPO                       |
| Sniffing passif | Chiffrement de bout en bout, VPN sur les réseaux publics |
| DHCP starvation | DHCP snooping, port security                             |

## Pratique : détecter l'ARP spoofing {#practice}

```bash
# Display ARP table
arp -a

# Look for duplicate MAC addresses (sign of ARP spoofing)
# If two IPs share the same MAC, something is wrong
arp -a | sort -t ' ' -k 4

# Example of normal ARP table:
# 192.168.1.1    at aa:bb:cc:dd:ee:ff [ether] on eth0
# 192.168.1.100  at 11:22:33:44:55:66 [ether] on eth0

# Example of ARP spoofing detected:
# 192.168.1.1    at cc:cc:cc:cc:cc:cc [ether] on eth0    ← same MAC!
# 192.168.1.50   at cc:cc:cc:cc:cc:cc [ether] on eth0    ← attacker

# Monitor ARP changes in real time
sudo arpwatch -i eth0
```

## Pour aller plus loin {#next}

- [Reconnaissance](/help/hacking/reconnaissance) — collecter des informations réseau sur la cible
- [Escalade de privilèges](/help/hacking/privesc) — après un accès initial, élever ses privilèges
- [Boîte à outils](/help/hacking/tools) — Wireshark, Bettercap et autres outils réseau