---
title: Adressage IP et sous-réseaux
description: Adresses IPv4 et IPv6, plages privées et publiques, notation CIDR, masques de sous-réseau et calcul de plages.
category: networking
slug: addressing
order: 4
---

## Structure d'une adresse IPv4 {#ipv4}

Une adresse IPv4 est composée de **4 octets** (32 bits), écrits en notation décimale pointée. Chaque octet va de 0 à 255.

```
   192   .   168   .    1   .   10
    │         │         │        │
 octet 1   octet 2   octet 3   octet 4

 En binaire : 11000000.10101000.00000001.00001010
```

Une adresse IP se divise en deux parties :

- **Partie réseau** — identifie le réseau (les bits de gauche)
- **Partie hôte** — identifie l'appareil sur ce réseau (les bits de droite)

Le **masque de sous-réseau** détermine où se fait la séparation.

## Adresses privées vs publiques {#private-public}

Les adresses privées sont réservées aux réseaux locaux et ne sont **pas routables** sur Internet. Le [NAT](/help/networking/routing) se charge de la traduction vers une adresse publique.

| Plage                             | Notation CIDR    | Nombre d'adresses | Classe historique |
| --------------------------------- | ---------------- | ----------------- | ----------------- |
| `10.0.0.0` – `10.255.255.255`     | `10.0.0.0/8`     | 16 777 216        | Classe A          |
| `172.16.0.0` – `172.31.255.255`   | `172.16.0.0/12`  | 1 048 576         | Classe B          |
| `192.168.0.0` – `192.168.255.255` | `192.168.0.0/16` | 65 536            | Classe C          |

### Adresses spéciales

| Adresse           | Rôle                                                |
| ----------------- | --------------------------------------------------- |
| `127.0.0.1`       | Loopback (localhost), la machine elle-même          |
| `0.0.0.0`         | Route par défaut / écoute sur toutes les interfaces |
| `255.255.255.255` | Broadcast limité (envoi à tous sur le réseau local) |
| `169.254.x.x`     | APIPA (auto-attribué quand DHCP échoue)             |

## IPv6 {#ipv6}

IPv6 utilise des adresses de **128 bits**, écrites en hexadécimal par groupes de 4 caractères séparés par `:`.

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334

// Simplified notation (remove leading zeros and compress :: for consecutive 0 groups)
2001:db8:85a3::8a2e:370:7334
```

| Critère           | IPv4                     | IPv6                                    |
| ----------------- | ------------------------ | --------------------------------------- |
| Taille            | 32 bits                  | 128 bits                                |
| Nombre d'adresses | ~4,3 milliards           | ~3,4 × 10³⁸                             |
| Notation          | Décimale pointée         | Hexadécimale avec `:`                   |
| NAT nécessaire    | Oui (pénurie d'adresses) | Non (chaque appareil a une IP publique) |
| Exemple           | `192.168.1.10`           | `2001:db8::1`                           |

> **Note** : IPv6 a été conçu pour résoudre la pénurie d'adresses IPv4. L'adoption progresse mais IPv4 reste dominant grâce au NAT.

## Notation CIDR {#cidr}

La notation **CIDR** (Classless Inter-Domain Routing) indique combien de bits sont réservés à la partie réseau. Elle s'écrit avec un `/` suivi du nombre de bits réseau.

```
192.168.1.0/24

192.168.1.0        =  adresse réseau
/24                =  24 bits pour le réseau, 8 bits pour les hôtes
Masque             =  255.255.255.0
Hôtes disponibles  =  2⁸ - 2 = 254
```

On soustrait 2 car l'adresse réseau (tous les bits hôte à 0) et l'adresse de broadcast (tous les bits hôte à 1) ne sont pas assignables.

### Masques courants

| CIDR  | Masque            | Nombre d'hôtes | Usage courant                    |
| ----- | ----------------- | -------------- | -------------------------------- |
| `/8`  | `255.0.0.0`       | 16 777 214     | Très grands réseaux              |
| `/16` | `255.255.0.0`     | 65 534         | Réseaux d'entreprise             |
| `/24` | `255.255.255.0`   | 254            | Réseau domestique / petit bureau |
| `/25` | `255.255.255.128` | 126            | Sous-réseau moyen                |
| `/26` | `255.255.255.192` | 62             | Petit sous-réseau                |
| `/30` | `255.255.255.252` | 2              | Liaison point-à-point            |
| `/32` | `255.255.255.255` | 1              | Hôte unique (loopback, route)    |

## Calcul de sous-réseau {#subnetting}

Pour un réseau donné, on peut calculer :

- **Adresse réseau** — Première adresse (bits hôte à 0)
- **Adresse de broadcast** — Dernière adresse (bits hôte à 1)
- **Plage d'hôtes** — Toutes les adresses entre les deux
- **Nombre d'hôtes** — 2^(bits hôte) - 2

### Exemple : `192.168.1.0/26`

```
Masque : /26 = 255.255.255.192
Bits hôte : 32 - 26 = 6
Nombre d'hôtes : 2⁶ - 2 = 62

Adresse réseau    :  192.168.1.0
Première adresse  :  192.168.1.1
Dernière adresse  :  192.168.1.62
Broadcast         :  192.168.1.63
Prochain réseau   :  192.168.1.64/26
```

### Exercice

> **Question** : Soit le réseau `10.0.0.0/20`. Combien d'hôtes utilisables ?

<details>
<summary>Réponse</summary>

Bits hôte = 32 - 20 = 12. Nombre d'hôtes = 2¹² - 2 = **4094**.

Plage : `10.0.0.1` à `10.0.15.254`. Broadcast : `10.0.15.255`.

</details>

## Commandes pratiques {#commands}

```bash
# Display IP addresses of all interfaces
ip addr show

# Show only IPv4 addresses
ip -4 addr show

# Show only IPv6 addresses
ip -6 addr show

# Legacy command (deprecated but still common)
ifconfig

# Assign a temporary IP address to an interface
sudo ip addr add 192.168.1.100/24 dev eth0

# Remove an IP address from an interface
sudo ip addr del 192.168.1.100/24 dev eth0
```

```bash
# Quick check: what is my public IP?
curl -s ifconfig.me

# What is my private IP?
hostname -I
```

## Pour aller plus loin {#next}

- [DNS en profondeur](/help/networking/dns) — comment les noms de domaine sont traduits en adresses IP
- [Routage et NAT](/help/networking/routing) — comment les paquets circulent entre les réseaux
- [Diagnostic réseau](/help/networking/diagnostics) — vérifier la configuration IP avec `ip addr`, `ping` et plus