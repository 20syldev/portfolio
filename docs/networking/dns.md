---
title: DNS en profondeur
description: Fonctionnement du DNS, hiérarchie, résolution récursive et itérative, types d'enregistrements et outils de diagnostic.
category: networking
slug: dns
order: 5
---

## Qu'est-ce que le DNS ? {#intro}

Le **DNS** (Domain Name System) est le système qui traduit les noms de domaine lisibles par l'humain (`google.com`) en [adresses IP](/help/networking/addressing) compréhensibles par les machines (`142.250.74.206`). Sans DNS, il faudrait mémoriser des adresses IP pour chaque site web.

Le DNS fonctionne sur le **port 53**, principalement en [UDP](/help/networking/protocols) pour les requêtes simples et en TCP pour les transferts de zone et les réponses volumineuses.

## Hiérarchie DNS {#hierarchy}

Le DNS est organisé en arborescence hiérarchique. Chaque niveau de la hiérarchie est géré par des serveurs différents.

```
                        ┌─────────┐
                        │  root   │     Serveurs racine (root)
                        └────┬────┘   13 ensembles dans le monde
             ┌───────────────┼───────────────┐
             │               │               │
        ┌────┴───┐       ┌───┴───┐       ┌───┴──┐
        │  .com  │       │  .fr  │       │ .org │      Serveurs TLD
        └────┬───┘       └───┬───┘       └──────┘   (Top-Level Domain)
        ┌────┴─────────┐     └──────────────────┐
  ┌─────┴────────┐   ┌─┴─────────────┐   ┌──────┴────────┐
  │  google.com  │   │  example.com  │   │  mon-site.fr  │   Serveurs autoritaires
  └──────────────┘   └───────────────┘   └───────────────┘      (Authoritative)
```

1. **Serveurs racine** — 13 ensembles de serveurs (A à M) répartis dans le monde. Ils connaissent les serveurs TLD.
2. **Serveurs TLD** — Gèrent les domaines de premier niveau (`.com`, `.fr`, `.org`). Ils connaissent les serveurs autoritaires.
3. **Serveurs autoritaires** — Détiennent les enregistrements DNS réels du domaine (adresses IP, serveurs mail, etc.).

## Résolution DNS {#resolution}

Quand tu tapes `www.example.com` dans ton navigateur, voici ce qui se passe :

```
 ┌──────────────┐                      ┌──────────────────────┐
 │    Client    │  ──  1. Requête  ─>  │  Résolveur récursif  │
 │  (navigat.)  │                      │      (FAI/local)     │
 └──────────────┘                      └───────────┬──────────┘
        ▲                                          │
        │                                          │      ┌────────────┐
        │           2. Qui gère .com ?             ├───>  │   Racine   │
        │           3. Voici le TLD                │  <───│   (root)   │
        │                                          │      └────────────┘
        │                                          │      ┌────────────┐
        │        4. Qui gère example.com ?         ├───>  │  TLD .com  │
        │        5. Voici le serveur auth          │  <───│            │
        │                                          │      └────────────┘
        │                                          │      ┌───────────────┐
        │       6. Quelle est l'IP de www ?        ├───>  │  Autoritaire  │
        │       7. 93.184.216.34                   │  <───│  example.com  │
        │                                          │      └───────────────┘
        │                                          │
        └──────────────  8. Réponse  ──────────────┘
```

### Récursif vs itératif

| Type         | Fonctionnement                                               | Qui fait le travail ?    |
| ------------ | ------------------------------------------------------------ | ------------------------ |
| **Récursif** | Le résolveur fait toutes les requêtes pour le client         | Le résolveur (FAI/local) |
| **Itératif** | Le serveur répond avec une référence vers le serveur suivant | Le client lui-même       |

En pratique, le client fait une requête **récursive** au résolveur, qui effectue ensuite des requêtes **itératives** auprès de la hiérarchie DNS.

## Types d'enregistrements {#records}

| Type      | Nom complet        | Rôle                                         | Exemple                                        |
| --------- | ------------------ | -------------------------------------------- | ---------------------------------------------- |
| **A**     | Address            | Associe un nom à une adresse IPv4            | `example.com → 93.184.216.34`                  |
| **AAAA**  | IPv6 Address       | Associe un nom à une adresse IPv6            | `example.com → 2606:2800:220:1:...`            |
| **CNAME** | Canonical Name     | Alias d'un nom vers un autre nom             | `www.example.com → example.com`                |
| **MX**    | Mail Exchange      | Serveur de messagerie du domaine             | `example.com → mail.example.com (priorité 10)` |
| **TXT**   | Text               | Données textuelles (SPF, DKIM, vérification) | `v=spf1 include:_spf.google.com ~all`          |
| **NS**    | Name Server        | Serveurs DNS autoritaires du domaine         | `example.com → ns1.example.com`                |
| **SOA**   | Start of Authority | Informations sur la zone DNS (admin, serial) | Numéro de série, TTL, email admin              |
| **PTR**   | Pointer            | Résolution inverse (IP → nom)                | `34.216.184.93 → example.com`                  |
| **SRV**   | Service            | Localisation d'un service (port, priorité)   | `_sip._tcp.example.com → sip.example.com:5060` |

## Cache DNS et TTL {#caching}

Pour éviter de parcourir toute la hiérarchie à chaque requête, les réponses DNS sont **mises en cache** à plusieurs niveaux :

1. **Cache du navigateur** — Chrome, Firefox gardent les résolutions en mémoire
2. **Cache du système** — `systemd-resolved` ou `dnsmasq` sous Linux
3. **Cache du résolveur** — Le serveur DNS du FAI ou de l'entreprise

Le **TTL** (Time To Live) indique combien de temps (en secondes) un enregistrement peut être mis en cache avant d'être re-vérifié.

```bash
# Check the TTL of a DNS record
dig example.com | grep -A1 "ANSWER SECTION"

# example.com.      3600    IN    A    93.184.216.34
#                    ^^^^
#                    TTL = 3600 secondes (1 heure)
```

> **Attention** : Un TTL trop élevé ralentit la propagation des changements DNS. Un TTL trop bas augmente la charge sur les serveurs DNS. Une valeur de 300-3600 secondes est courante.

## Commandes pratiques {#commands}

### `dig` (DNS Information Groper)

L'outil le plus complet pour interroger le DNS :

```bash
# Basic query (A record)
dig example.com

# Query a specific record type
dig example.com MX
dig example.com AAAA
dig example.com TXT

# Short output (just the answer)
dig +short example.com

# Query a specific DNS server
dig @8.8.8.8 example.com

# Trace the full resolution path
dig +trace example.com

# Reverse DNS lookup
dig -x 93.184.216.34
```

### `nslookup`

Plus simple que `dig`, disponible partout y compris sur Windows :

```bash
# Basic lookup
nslookup example.com

# Query a specific DNS server
nslookup example.com 8.8.8.8

# Query a specific record type
nslookup -type=MX example.com
```

### `host`

Le plus concis :

```bash
# Basic lookup
host example.com

# Reverse lookup
host 93.184.216.34

# Query specific record type
host -t MX example.com
```

## Sécurité DNS {#security}

Le DNS est un protocole ancien, conçu sans sécurité. Plusieurs attaques existent :

| Attaque                 | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| **DNS Spoofing**        | Injection de fausses réponses DNS pour rediriger vers un site pirate |
| **DNS Cache Poisoning** | Corruption du cache d'un résolveur avec de faux enregistrements      |
| **DNS Tunneling**       | Utilisation du DNS pour exfiltrer des données (canal caché)          |

Les contre-mesures incluent **DNSSEC** (signatures cryptographiques des enregistrements), **DNS over HTTPS** (DoH) et **DNS over TLS** (DoT) qui chiffrent les requêtes DNS.

## Pour aller plus loin {#next}

- [Protocoles essentiels](/help/networking/protocols) — TCP, UDP et les protocoles fondamentaux du réseau
- [Routage et NAT](/help/networking/routing) — comment les paquets trouvent leur chemin sur le réseau
- [Diagnostic réseau](/help/networking/diagnostics) — `dig`, `nslookup` et les autres outils de dépannage