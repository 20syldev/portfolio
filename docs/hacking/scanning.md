---
title: Scanning et énumération
description: Scanning de ports avec Nmap et Masscan, énumération de services, NSE scripts, découverte de répertoires web avec Gobuster et ffuf.
category: hacking
slug: scanning
order: 3
---

## Objectif du scanning {#intro}

Le scanning est la **deuxième phase** d'un pentest. Après la reconnaissance, on interagit directement avec la cible pour découvrir :

- Les **ports ouverts** (quels services sont accessibles)
- Les **versions** des services (pour chercher des vulnérabilités connues)
- Le **système d'exploitation**
- Les **répertoires et fichiers** exposés sur un serveur web

> **Rappel** : Le scanning de ports nécessite une **autorisation écrite**. Scanner un système sans autorisation est illégal (article 323-1 du Code pénal).

## Nmap {#nmap}

**Nmap** (Network Mapper) est l'outil de scanning de référence. Il est préinstallé sur Kali Linux et disponible sur toutes les plateformes.

### Types de scan

| Type        | Flag  | Description                                      | Privilèges | Discrétion |
| ----------- | ----- | ------------------------------------------------ | ---------- | ---------- |
| TCP Connect | `-sT` | Connexion TCP complète (3-way handshake)         | Aucun      | Faible     |
| SYN Stealth | `-sS` | Envoie SYN, analyse la réponse, ne complète pas  | Root       | Moyen      |
| UDP         | `-sU` | Scan UDP (plus lent, souvent filtré)             | Root       | Moyen      |
| Version     | `-sV` | Détection de la version des services             | Aucun      | Faible     |
| OS          | `-O`  | Détection du système d'exploitation              | Root       | Faible     |
| ACK         | `-sA` | Déterminer si un port est filtré par un firewall | Root       | Moyen      |
| NULL        | `-sN` | Aucun flag TCP (contourner certains firewalls)   | Root       | Élevé      |
| FIN         | `-sF` | Flag FIN uniquement                              | Root       | Élevé      |
| Xmas        | `-sX` | Flags FIN, PSH, URG                              | Root       | Élevé      |

```
SYN Stealth Scan (-sS) — Le plus courant
────────────────────────────────────────

Port ouvert :                                 Port fermé :
Client  ──────  SYN  ─────>  Serveur          Client  ───  SYN  ──>  Serveur
Client  <──  SYN / ACK  ───  Serveur          Client  <──  RST  ───  Serveur
Client  ──────  RST  ─────>  Serveur          (pas de service)
(connexion non établie)
```

### Options courantes

| Flag          | Description                                    | Exemple                       |
| ------------- | ---------------------------------------------- | ----------------------------- |
| `-p`          | Ports spécifiques                              | `-p 22,80,443` ou `-p 1-1000` |
| `-p-`         | Tous les 65535 ports                           | `-p-`                         |
| `--top-ports` | Les N ports les plus courants                  | `--top-ports 1000`            |
| `-A`          | Agressif (OS + version + scripts + traceroute) | `-A`                          |
| `-T`          | Vitesse (0=lent/discret, 5=rapide)             | `-T4`                         |
| `-oN`         | Sortie texte                                   | `-oN scan.txt`                |
| `-oX`         | Sortie XML                                     | `-oX scan.xml`                |
| `-oG`         | Sortie grepable                                | `-oG scan.gnmap`              |
| `-v` / `-vv`  | Verbosité                                      | `-vv`                         |
| `--open`      | Afficher uniquement les ports ouverts          | `--open`                      |
| `-Pn`         | Ne pas faire de ping (considérer l'hôte up)    | `-Pn`                         |

### Exemples pratiques

```bash
# Quick scan of the top 1000 ports
nmap 192.168.1.10

# SYN stealth scan with version detection on all ports
sudo nmap -sS -sV -p- 192.168.1.10

# Aggressive scan with OS detection
sudo nmap -A -T4 192.168.1.10

# Scan a subnet for live hosts
nmap -sn 192.168.1.0/24

# Scan specific ports and save output
nmap -sV -p 22,80,443,8080 -oN results.txt 192.168.1.10

# UDP scan (slow but important — DNS, SNMP, TFTP)
sudo nmap -sU --top-ports 100 192.168.1.10
```

Exemple de sortie :

```
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
443/tcp  open  ssl     OpenSSL 3.0.2
3306/tcp open  mysql   MySQL 8.0.35
```

### NSE Scripts {#nse}

Le **Nmap Scripting Engine** (NSE) permet d'exécuter des scripts pour détecter des vulnérabilités, énumérer des services ou collecter des informations.

```bash
# Run vulnerability detection scripts
nmap --script vuln 192.168.1.10

# Enumerate HTTP directories and files
nmap --script http-enum 192.168.1.10

# Check for SMB vulnerabilities (EternalBlue, etc.)
nmap --script smb-vuln* -p 445 192.168.1.10

# Brute force SSH login
nmap --script ssh-brute -p 22 192.168.1.10

# Get HTTP headers and title
nmap --script http-headers,http-title -p 80 192.168.1.10

# List all available scripts
ls /usr/share/nmap/scripts/

# Search for scripts by keyword
nmap --script-help "*smb*"
```

Catégories de scripts utiles : `vuln`, `auth`, `brute`, `discovery`, `exploit`, `safe`.

## Masscan {#masscan}

**Masscan** est un scanner de ports extrêmement rapide, capable de scanner tout Internet en quelques minutes. Il sacrifie la précision pour la vitesse.

```bash
# Scan ports 80 and 443 on a subnet at 10000 packets/sec
masscan 192.168.1.0/24 -p 80,443 --rate=10000

# Scan top ports
masscan 192.168.1.0/24 --top-ports 100

# Save output in Nmap-compatible format
masscan 192.168.1.0/24 -p 1-65535 --rate=1000 -oG masscan.gnmap
```

> **Workflow courant** : Utiliser Masscan pour un premier scan rapide, puis Nmap pour un scan détaillé sur les ports découverts.

## Énumération de services {#enumeration}

### Banner grabbing {#banner}

Récupérer les bannières des services pour identifier les versions :

```bash
# Grab banner with netcat
nc -nv 192.168.1.10 80
# Then type: HEAD / HTTP/1.1

# Grab banner with telnet
telnet 192.168.1.10 25

# Grab SSH banner
nc -nv 192.168.1.10 22
# SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4
```

### Énumération SMB {#smb}

SMB (Server Message Block) est souvent une source riche d'informations sur les systèmes Windows :

```bash
# Enumerate SMB shares, users, groups
enum4linux -a 192.168.1.10

# List SMB shares
smbclient -L //192.168.1.10 -N

# Connect to a share
smbclient //192.168.1.10/share -N

# Enumerate with crackmapexec
crackmapexec smb 192.168.1.10 --shares
```

### Énumération SNMP {#snmp}

```bash
# Enumerate SNMP with default community string
snmpwalk -v2c -c public 192.168.1.10

# Brute force community strings
onesixtyone -c /usr/share/wordlists/community.txt 192.168.1.10
```

## Découverte de répertoires web {#directories}

### Gobuster {#gobuster}

**Gobuster** brute-force les répertoires et fichiers d'un serveur web à partir d'une wordlist.

```bash
# Directory brute force
gobuster dir -u http://192.168.1.10 -w /usr/share/wordlists/dirb/common.txt

# With file extensions
gobuster dir -u http://192.168.1.10 -w /usr/share/wordlists/dirb/common.txt -x php,html,txt

# With more threads and status code filter
gobuster dir -u http://192.168.1.10 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -t 50 -b 404

# Subdomain enumeration (vhost mode)
gobuster vhost -u http://example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
```

### ffuf {#ffuf}

**ffuf** (Fuzz Faster U Fool) est une alternative rapide et flexible :

```bash
# Directory fuzzing
ffuf -u http://192.168.1.10/FUZZ -w /usr/share/wordlists/dirb/common.txt

# File extension fuzzing
ffuf -u http://192.168.1.10/FUZZ -w /usr/share/wordlists/dirb/common.txt -e .php,.html,.txt

# Filter by response size (remove noise)
ffuf -u http://192.168.1.10/FUZZ -w /usr/share/wordlists/dirb/common.txt -fs 0

# Parameter fuzzing
ffuf -u http://192.168.1.10/page?FUZZ=test -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt
```

## Pratique : scanner une cible {#practice}

Méthodologie de scanning étape par étape (sur une cible autorisée) :

```bash
# 1. Discover live hosts on the network
nmap -sn 192.168.1.0/24

# 2. Quick scan of common ports on a target
nmap --top-ports 1000 192.168.1.10

# 3. Full port scan with version detection
sudo nmap -sS -sV -p- -T4 192.168.1.10 -oN full_scan.txt

# 4. Run vulnerability scripts on discovered services
nmap --script vuln -p 22,80,443,3306 192.168.1.10

# 5. Enumerate web directories
gobuster dir -u http://192.168.1.10 -w /usr/share/wordlists/dirb/common.txt -x php,html

# 6. Grab banners for manual analysis
nc -nv 192.168.1.10 80
```

## Pour aller plus loin {#next}

- [Reconnaissance](/help/hacking/reconnaissance) — la phase précédente : collecte d'informations
- [Vulnérabilités web](/help/hacking/web) — exploiter les services web découverts
- [Boîte à outils](/help/hacking/tools) — tous les outils de scanning en détail