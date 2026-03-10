---
title: Reconnaissance
description: Techniques de reconnaissance passive et active — OSINT, WHOIS, DNS, Google dorks, Shodan et theHarvester pour la collecte d'informations.
category: hacking
slug: reconnaissance
order: 2
---

## Pourquoi la reconnaissance ? {#intro}

La reconnaissance est la **première phase** d'un test d'intrusion. Plus on collecte d'informations sur la cible, plus les phases suivantes seront efficaces. Un pentester qui néglige cette étape risque de passer à côté de surfaces d'attaque importantes.

> **Rappel** : Ces techniques doivent être utilisées uniquement dans un cadre autorisé. La reconnaissance passive est généralement légale (informations publiques), mais la reconnaissance active nécessite une autorisation.

### Passive vs active

| Critère          | Reconnaissance passive           | Reconnaissance active             |
| ---------------- | -------------------------------- | --------------------------------- |
| **Interaction**  | Aucune interaction directe       | Interaction directe avec la cible |
| **Détectable ?** | Non                              | Oui (logs, IDS)                   |
| **Sources**      | Informations publiques           | Réponses du système cible         |
| **Exemples**     | WHOIS, DNS, Google dorks, Shodan | Scan de ports, ping sweep         |
| **Légalité**     | Généralement légal               | Nécessite une autorisation        |

## OSINT {#osint}

L'**OSINT** (Open Source Intelligence) désigne la collecte d'informations à partir de sources publiques. C'est la base de toute reconnaissance passive.

Sources courantes :

- **Sites web** de la cible (pages, code source, commentaires HTML)
- **Réseaux sociaux** (LinkedIn, Twitter, GitHub — employés, technologies utilisées)
- **Registres publics** (WHOIS, registres d'entreprises)
- **Moteurs de recherche** (Google, Bing, DuckDuckGo)
- **Archives** (Wayback Machine — versions passées des sites)
- **Bases de données de fuites** (Have I Been Pwned — vérifier si des identifiants ont fuité)

## WHOIS {#whois}

WHOIS permet d'obtenir des informations sur le propriétaire d'un nom de domaine : nom, organisation, email, serveurs DNS, dates d'enregistrement.

```bash
# Query domain registration information
whois example.com
```

```
Domain Name: EXAMPLE.COM
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar: ICANN
Creation Date: 1995-08-14T04:00:00Z
Registrar Abuse Contact Email: abuse@icann.org
Name Server: A.IANA-SERVERS.NET
Name Server: B.IANA-SERVERS.NET
```

> **Note** : Beaucoup de domaines utilisent un service de **privacy protection** (WHOIS Guard) qui masque les informations du propriétaire. Les données RGPD ont aussi réduit les informations accessibles.

## Énumération DNS {#dns}

Le DNS est une mine d'informations : sous-domaines, serveurs mail, adresses IP. Voir aussi la [documentation DNS](/help/networking/dns) pour la théorie.

```bash
# Retrieve DNS records for a domain
dig example.com ANY

# Find name servers
dig example.com NS

# Find mail servers
dig example.com MX

# Reverse DNS lookup (IP to hostname)
dig -x 93.184.216.34

# Query a specific DNS server
dig @8.8.8.8 example.com A
```

### Découverte de sous-domaines

```bash
# Enumerate subdomains with host
host -t A www.example.com
host -t A mail.example.com
host -t A vpn.example.com

# Automated DNS enumeration
dnsenum example.com

# Brute force subdomains with a wordlist
dnsenum --enum -f /usr/share/wordlists/subdomains.txt example.com
```

Les sous-domaines révèlent souvent des services internes : `dev.`, `staging.`, `admin.`, `vpn.`, `mail.`, `internal.`.

### Transfert de zone {#zone-transfer}

Un transfert de zone DNS mal configuré peut exposer **tous** les enregistrements d'un domaine :

```bash
# Attempt a zone transfer (often blocked, but worth trying)
dig axfr @ns1.example.com example.com
```

## Google dorks {#dorks}

Les **Google dorks** utilisent des opérateurs de recherche avancés pour trouver des informations spécifiques indexées par Google.

| Opérateur   | Usage                               | Exemple                 |
| ----------- | ----------------------------------- | ----------------------- |
| `site:`     | Restreindre à un domaine            | `site:example.com`      |
| `inurl:`    | Chercher dans l'URL                 | `inurl:admin`           |
| `intitle:`  | Chercher dans le titre de la page   | `intitle:"index of"`    |
| `filetype:` | Chercher un type de fichier         | `filetype:pdf`          |
| `ext:`      | Chercher par extension              | `ext:sql`               |
| `intext:`   | Chercher dans le contenu de la page | `intext:"mot de passe"` |
| `-`         | Exclure un terme                    | `site:example.com -www` |

### Exemples pratiques

```
# Find login pages on a domain
site:example.com inurl:login OR inurl:admin

# Find exposed configuration files
site:example.com filetype:env OR filetype:xml OR filetype:conf

# Find directory listings
site:example.com intitle:"index of"

# Find exposed documents
site:example.com filetype:pdf OR filetype:xlsx OR filetype:docx

# Find Git repositories accidentally exposed
inurl:".git" intitle:"index of"

# Find exposed databases
filetype:sql "INSERT INTO" site:example.com
```

> **Base de données** : [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database) référence des milliers de dorks classés par catégorie.

## Shodan {#shodan}

**Shodan** est un moteur de recherche qui scanne Internet et indexe les services exposés (ports ouverts, bannières, versions). Contrairement à Google qui indexe le contenu web, Shodan indexe les **services réseau**.

```bash
# Install Shodan CLI
pip install shodan

# Initialize with API key
shodan init YOUR_API_KEY

# Search for Apache servers in France
shodan search "apache country:FR"

# Get information about a specific IP
shodan host 93.184.216.34

# Count results for a query
shodan count "port:22 country:FR"
```

### Filtres Shodan utiles

| Filtre      | Description            | Exemple                |
| ----------- | ---------------------- | ---------------------- |
| `port:`     | Port spécifique        | `port:3389` (RDP)      |
| `country:`  | Pays (code ISO)        | `country:FR`           |
| `org:`      | Organisation           | `org:"OVH SAS"`        |
| `product:`  | Logiciel/service       | `product:nginx`        |
| `version:`  | Version du service     | `version:7.4`          |
| `os:`       | Système d'exploitation | `os:linux`             |
| `hostname:` | Nom d'hôte             | `hostname:example.com` |

## theHarvester {#theharvester}

**theHarvester** collecte des emails, sous-domaines, noms d'hôtes et adresses IP à partir de sources publiques (moteurs de recherche, DNS, certificats).

```bash
# Search for emails and subdomains from multiple sources
theHarvester -d example.com -b google,bing,crtsh,dnsdumpster

# Limit results
theHarvester -d example.com -b google -l 200

# Export results to XML
theHarvester -d example.com -b all -f results.xml
```

Les sources les plus utiles : `crtsh` (certificats SSL), `dnsdumpster`, `google`, `bing`, `linkedin`.

## OSINT sur les réseaux sociaux {#social}

Les réseaux sociaux professionnels sont précieux pour la reconnaissance :

- **LinkedIn** — Identifier les employés, les technologies utilisées, les postes ouverts (qui révèlent la stack technique)
- **GitHub** — Dépôts publics d'employés (code source, clés API oubliées dans l'historique, `.env` exposés)
- **Twitter/X** — Communications techniques, annonces de vulnérabilités
- **Glassdoor** — Stack technique mentionnée dans les offres d'emploi

```bash
# Search GitHub for accidentally committed secrets
# (Use tools like truffleHog or GitLeaks)
trufflehog github --org=example-org
```

## Reconnaissance active : aperçu {#active}

La reconnaissance active implique une **interaction directe** avec les systèmes cibles. Elle nécessite une autorisation.

### Ping sweep

Identifier les hôtes actifs sur un réseau :

```bash
# Discover live hosts on a subnet (ICMP ping sweep)
nmap -sn 192.168.1.0/24

# Ping sweep with ARP (more reliable on local networks)
nmap -sn -PR 192.168.1.0/24
```

### Scan de ports (aperçu)

Le scan de ports est détaillé dans la documentation [Scanning et énumération](/help/hacking/scanning). Aperçu rapide :

```bash
# Quick scan of the most common ports
nmap -F 192.168.1.10

# Scan specific ports
nmap -p 22,80,443 192.168.1.10
```

## Pratique : investiguer un domaine {#practice}

Méthodologie étape par étape pour la reconnaissance d'un domaine (dans un cadre autorisé) :

1. **WHOIS** — `whois example.com` → propriétaire, registrar, serveurs DNS
2. **DNS** — `dig example.com ANY` → enregistrements A, MX, TXT, NS
3. **Sous-domaines** — `dnsenum example.com` + `theHarvester -d example.com -b crtsh`
4. **Google dorks** — `site:example.com filetype:pdf`, `site:example.com inurl:admin`
5. **Shodan** — `shodan host <IP>` → services exposés, bannières
6. **Réseaux sociaux** — LinkedIn, GitHub → employés, stack technique
7. **Wayback Machine** — `web.archive.org` → versions passées du site, pages supprimées
8. **Synthèse** — Compiler les informations dans un document structuré

## Pour aller plus loin {#next}

- [Scanning et énumération](/help/hacking/scanning) — scanner les ports et identifier les services en détail
- [Vulnérabilités web](/help/hacking/web) — exploiter les informations collectées sur des applications web
- [Attaques réseau](/help/hacking/network) — techniques d'attaque au niveau réseau