---
title: Bruteforce
description: Attaques par force brute offline et online — Hashcat avancé, John the Ripper, Hydra, génération de wordlists, benchmarks et protections.
category: hacking
slug: bruteforce
order: 6
---

## Offline vs online {#intro}

Le bruteforce se divise en deux grandes catégories :

```
Offline (hash cracking)                 Online (service distant)
────────────────────────                ────────────────────────
Cible : fichier de hashes               Cible : formulaire login, SSH, FTP
Vitesse : milliards/s (GPU)             Vitesse : limitée par le réseau
Détection : aucune (local)              Détection : logs, rate limiting
Outils : Hashcat, John                  Outils : Hydra, Medusa, CrackMapExec
```

> Pour les bases du hash cracking (identification, modes, exemples simples), voir la [documentation Hash cracking](/help/hacking/hashing).

## Hashcat avancé {#hashcat-advanced}

[Hashcat](https://hashcat.net/) exploite la puissance du GPU pour atteindre des vitesses de cracking massives. Au-delà des attaques basiques, son moteur de rules et ses modes combinés sont redoutables.

### Rules engine {#rules}

Les **rules** appliquent des mutations sur chaque mot d'une wordlist : capitalisation, ajout de chiffres, substitutions, inversions, etc. C'est souvent plus efficace qu'un bruteforce pur.

| Fichier de rules            | Mutations | Efficacité                                |
| --------------------------- | --------- | ----------------------------------------- |
| `best64.rule`               | 64        | Rapide, bon ratio résultats/temps         |
| `rockyou-30000.rule`        | 30 000    | Très complet, plus lent                   |
| `dive.rule`                 | 99 000+   | Exhaustif, attaque longue                 |
| `OneRuleToRuleThemAll.rule` | 51 000+   | Communautaire, excellent compromis        |
| `toggles5.rule`             | 31        | Toggle case sur les 5 premiers caractères |

```bash
# Dictionary attack with best64 rules
hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule

# Stack multiple rule files (each word passes through both)
hashcat -m 0 -a 0 hash.txt wordlist.txt \
  -r rules1.rule -r rules2.rule

# Generate rule candidates to stdout (preview mutations)
hashcat --stdout wordlist.txt -r /usr/share/hashcat/rules/best64.rule | head -20
```

### Syntaxe des rules

| Fonction           | Syntaxe | Exemple (`password`) |
| ------------------ | ------- | -------------------- |
| Rien               | `:`     | `password`           |
| Majuscule initiale | `c`     | `Password`           |
| Tout en majuscule  | `u`     | `PASSWORD`           |
| Inverser           | `r`     | `drowssap`           |
| Ajouter caractère  | `$X`    | `$1` → `password1`   |
| Préfixer caractère | `^X`    | `^@` → `@password`   |
| Substituer         | `sXY`   | `sa@` → `p@ssword`   |
| Dupliquer          | `d`     | `passwordpassword`   |
| Tronquer N chars   | `]`     | `passwor`            |

```bash
# Custom rule: capitalize, then append a digit and "!"
echo 'c $1 $!' > custom.rule
hashcat -m 0 -a 0 hash.txt wordlist.txt -r custom.rule
# "password" → "Password1!"
```

### Attaques par masque avancées {#masks}

Les masques permettent de cibler des patterns précis. Rappel des caractères :

| Caractère | Signification     |
| --------- | ----------------- |
| `?l`      | Minuscule (a-z)   |
| `?u`      | Majuscule (A-Z)   |
| `?d`      | Chiffre (0-9)     |
| `?s`      | Caractère spécial |
| `?a`      | Tout (`?l?u?d?s`) |

```bash
# Pattern: Mot de 5 lettres capitalisé + 2 chiffres + spécial
# Ex: "Admin42!" "Hello99#"
hashcat -m 0 -a 3 hash.txt '?u?l?l?l?l?d?d?s'

# Custom charset: only vowels in position 2 and 4
hashcat -m 0 -a 3 hash.txt -1 aeiou '?u?1?l?1?l?d?d'

# Incremental length (6 to 10 chars)
hashcat -m 0 -a 3 hash.txt --increment --increment-min 6 --increment-max 10 '?a?a?a?a?a?a?a?a?a?a'
```

### Attaques hybrides {#hybrid}

Combinent une wordlist avec un masque pour couvrir les patterns courants (mot + chiffres, préfixe + mot).

```bash
# Mode 6: wordlist + mask suffix
# "password" → "password01", "password99", "password2024"
hashcat -m 0 -a 6 hash.txt wordlist.txt '?d?d?d?d'

# Mode 7: mask prefix + wordlist
# "password" → "123password", "007password"
hashcat -m 0 -a 7 hash.txt '?d?d?d' wordlist.txt

# Combination attack: word1 + word2 from two lists
hashcat -m 0 -a 1 hash.txt list1.txt list2.txt
```

### PRINCE attack {#prince}

L'attaque **PRINCE** (PRobability INfinite Chained Elements) génère des combinaisons de mots en chaînant des éléments d'une wordlist, triés par probabilité.

```bash
# PRINCE attack (requires princeprocessor)
pp64 < wordlist.txt | hashcat -m 0 hash.txt
```

### Options utiles {#options}

```bash
# Show cracked passwords
hashcat -m 0 hash.txt --show

# Resume interrupted session
hashcat -m 0 hash.txt --restore

# Set workload profile (1=low, 2=default, 3=high, 4=nightmare)
hashcat -m 0 -a 0 hash.txt wordlist.txt -w 3

# Use specific GPU device
hashcat -m 0 -a 0 hash.txt wordlist.txt -d 1

# Benchmark all hash types
hashcat -b

# Benchmark a specific hash type
hashcat -b -m 1000
```

## John the Ripper avancé {#john-advanced}

[John the Ripper](https://www.openwall.com/john/) excelle sur le CPU et supporte un très grand nombre de formats grâce à ses modules `*2john`.

### Modes d'attaque

| Mode            | Description                                           |
| --------------- | ----------------------------------------------------- |
| `--wordlist`    | Attaque par dictionnaire                              |
| `--rules`       | Applique des mutations (similaire aux rules Hashcat)  |
| `--incremental` | Bruteforce pur (toutes combinaisons)                  |
| `--single`      | Utilise les informations du fichier (username, GECOS) |
| `--markov`      | Bruteforce guidé par les statistiques de Markov       |

```bash
# Wordlist with rules (John's built-in mutations)
john hash.txt --wordlist=rockyou.txt --rules=All

# Incremental with specific charset
john hash.txt --incremental=Digits

# Single crack mode (uses username as base)
john hash.txt --single

# Show supported formats
john --list=formats

# Show cracked passwords
john hash.txt --show
```

### Modules \*2john {#2john}

La force de John : convertir presque tout en hash crackable.

| Module           | Format cible       | Exemple                                 |
| ---------------- | ------------------ | --------------------------------------- |
| `zip2john`       | Fichiers ZIP       | `zip2john secret.zip > hash.txt`        |
| `rar2john`       | Fichiers RAR       | `rar2john archive.rar > hash.txt`       |
| `ssh2john`       | Clés SSH protégées | `ssh2john id_rsa > hash.txt`            |
| `pdf2john`       | Fichiers PDF       | `pdf2john document.pdf > hash.txt`      |
| `keepass2john`   | Bases KeePass      | `keepass2john database.kdbx > hash.txt` |
| `office2john`    | Documents Office   | `office2john document.docx > hash.txt`  |
| `gpg2john`       | Clés GPG protégées | `gpg2john private.key > hash.txt`       |
| `bitlocker2john` | Volumes BitLocker  | `bitlocker2john /dev/sda1 > hash.txt`   |
| `wpa2john`       | Handshakes Wi-Fi   | `wpa2john capture.pcap > hash.txt`      |

```bash
# Full workflow: crack a password-protected ZIP
zip2john protected.zip > zip_hash.txt
john zip_hash.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Crack an SSH private key passphrase
ssh2john ~/.ssh/id_rsa > ssh_hash.txt
john ssh_hash.txt --wordlist=rockyou.txt --rules=All
```

## Hashcat vs John {#comparison}

| Critère               | Hashcat                          | John the Ripper                 |
| --------------------- | -------------------------------- | ------------------------------- |
| **Accélération**      | GPU (OpenCL, CUDA)               | CPU (GPU limité)                |
| **Vitesse**           | Très rapide sur GPU              | Plus lent, mais polyvalent      |
| **Formats**           | 300+ types de hash               | 200+ formats + modules \*2john  |
| **Rules**             | Syntaxe propre, très flexible    | Compatible, syntaxe différente  |
| **Formats exotiques** | Limité                           | Excellent (ZIP, PDF, SSH, etc.) |
| **Session/restore**   | Oui                              | Oui                             |
| **Quand l'utiliser**  | Cracking massif de hashes connus | Formats spéciaux, pas de GPU    |

> **En résumé** : Hashcat pour la vitesse brute (MD5, NTLM, SHA), John pour les formats exotiques (ZIP, PDF, SSH, Wi-Fi).

## Benchmarks {#benchmarks}

Vitesses approximatives avec un GPU moderne (RTX 4090) :

| Algorithme        | Hashcat (GPU)    | John (CPU, 8 cores) |
| ----------------- | ---------------- | ------------------- |
| **MD5**           | ~160 milliards/s | ~200 millions/s     |
| **SHA-1**         | ~25 milliards/s  | ~100 millions/s     |
| **SHA-256**       | ~10 milliards/s  | ~50 millions/s      |
| **NTLM**          | ~130 milliards/s | ~150 millions/s     |
| **bcrypt ($2b$)** | ~180 000/s       | ~30 000/s           |
| **sha512crypt**   | ~2 millions/s    | ~500 000/s          |
| **argon2**        | ~5 000/s         | ~1 000/s            |

> La différence GPU vs CPU est colossale sur les algorithmes rapides (MD5, SHA). Sur les algorithmes lents (bcrypt, argon2), l'écart se réduit car ils sont conçus pour résister au parallélisme.

```bash
# Run your own benchmarks
hashcat -b
hashcat -b -m 0     # MD5 only
hashcat -b -m 1000  # NTLM only
john --test
```

## Bruteforce online {#online}

Le bruteforce online cible des services distants (SSH, FTP, HTTP, SMB). La vitesse est limitée par le réseau et les protections côté serveur.

### Hydra {#hydra}

**Hydra** est l'outil de référence pour le bruteforce en ligne. Il supporte plus de 50 protocoles.

```bash
# Brute force SSH
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10

# Brute force SSH with username list
hydra -L users.txt -P passwords.txt ssh://192.168.1.10

# Brute force FTP
hydra -l anonymous -P wordlist.txt ftp://192.168.1.10

# Brute force web login (POST form)
hydra -l admin -P rockyou.txt 192.168.1.10 http-post-form \
  "/login:user=^USER^&pass=^PASS^:Invalid credentials"

# Brute force HTTP Basic Auth
hydra -l admin -P wordlist.txt 192.168.1.10 http-get /admin

# Brute force RDP
hydra -l administrator -P wordlist.txt rdp://192.168.1.10

# Limit threads and add delay (avoid lockout)
hydra -l admin -P wordlist.txt ssh://192.168.1.10 -t 4 -W 3
```

### Options Hydra essentielles

| Option | Description                             |
| ------ | --------------------------------------- |
| `-l`   | Login unique                            |
| `-L`   | Fichier de logins                       |
| `-p`   | Mot de passe unique                     |
| `-P`   | Fichier de mots de passe                |
| `-t`   | Nombre de threads (défaut : 16)         |
| `-W`   | Délai entre chaque tentative (secondes) |
| `-s`   | Port personnalisé                       |
| `-f`   | Arrêter au premier résultat trouvé      |
| `-vV`  | Mode verbose                            |

### CrackMapExec {#cme}

**CrackMapExec** (CME) est spécialisé pour les environnements Active Directory et les protocoles Windows.

```bash
# Password spraying on SMB
crackmapexec smb 192.168.1.0/24 -u users.txt -p 'Summer2024!'

# Brute force SMB
crackmapexec smb 192.168.1.10 -u admin -p wordlist.txt

# Brute force WinRM
crackmapexec winrm 192.168.1.10 -u users.txt -p passwords.txt

# Check credentials across the network
crackmapexec smb 192.168.1.0/24 -u 'admin' -p 'Password123'
```

### Medusa {#medusa}

Alternative à Hydra, modulaire et parallèle.

```bash
# Brute force SSH
medusa -h 192.168.1.10 -u admin -P wordlist.txt -M ssh

# Brute force multiple hosts
medusa -H hosts.txt -u admin -P wordlist.txt -M ssh

# Brute force MySQL
medusa -h 192.168.1.10 -u root -P wordlist.txt -M mysql
```

## Génération de wordlists {#wordlists}

La qualité de la wordlist est souvent plus déterminante que la puissance de calcul.

### CeWL {#cewl}

**CeWL** (Custom Word List generator) scrape un site web pour extraire des mots-clés pertinents — idéal pour les attaques ciblées.

```bash
# Scrape a website for words (min 5 chars, depth 3)
cewl http://target.com -d 3 -m 5 -w cewl_wordlist.txt

# Include email addresses found
cewl http://target.com -d 3 -m 5 -e --email_file emails.txt -w words.txt

# Include metadata from documents
cewl http://target.com -d 3 -m 5 --meta --meta_file meta.txt -w words.txt
```

### CUPP {#cupp}

**CUPP** (Common User Passwords Profiler) génère une wordlist basée sur les informations personnelles de la cible (prénom, date de naissance, animal, etc.).

```bash
# Interactive mode: answer questions about the target
cupp -i

# Download default wordlists
cupp -l

# Example output for "John", born "1990", pet "rex":
# john1990, John1990!, john_rex, rex1990, 1990john...
```

### Crunch {#crunch}

**Crunch** génère des wordlists par combinaison de caractères.

```bash
# Generate all 6-char lowercase combinations (huge!)
crunch 6 6 abcdefghijklmnopqrstuvwxyz -o wordlist.txt

# Generate with pattern (@ = lowercase, , = uppercase, % = digit, ^ = special)
crunch 8 8 -t @@@@%%%% -o wordlist.txt
# Produces: aaaa0000, aaaa0001, ..., zzzz9999

# Charset from file
crunch 4 6 -f /usr/share/crunch/charset.lst mixalpha-numeric -o wordlist.txt
```

## Protections contre le bruteforce {#protections}

### Côté serveur (bruteforce online)

| Protection           | Mécanisme                                  | Contournement possible               |
| -------------------- | ------------------------------------------ | ------------------------------------ |
| **Rate limiting**    | Limiter le nombre de requêtes par IP/temps | IP rotation, proxies                 |
| **Account lockout**  | Verrouiller le compte après N échecs       | Password spraying (1 MDP, N comptes) |
| **CAPTCHA**          | Challenge humain après N échecs            | Difficile à contourner               |
| **fail2ban**         | Bannir l'IP après N échecs (iptables)      | IP rotation                          |
| **MFA**              | Second facteur requis                      | Rend le bruteforce inutile           |
| **Délai progressif** | Temps d'attente croissant entre tentatives | Très lent, souvent abandonné         |

### Côté algorithme (bruteforce offline)

| Protection            | Mécanisme                                              |
| --------------------- | ------------------------------------------------------ |
| **Sel (salt)**        | Empêche les rainbow tables et les attaques groupées    |
| **Algorithmes lents** | bcrypt, argon2, scrypt — quelques milliers/s max       |
| **Pepper**            | Secret côté serveur ajouté au hash (non stocké en BDD) |
| **Key stretching**    | Appliquer la fonction de hachage N fois (PBKDF2)       |

```bash
# fail2ban: example config for SSH
# /etc/fail2ban/jail.local
# [sshd]
# enabled = true
# port = ssh
# maxretry = 3
# bantime = 3600
# findtime = 600
```

## Pour aller plus loin {#next}

- [Hash cracking](/help/hacking/hashing) — identifier et casser des hashes (bases)
- [Mots de passe](/help/hacking/passwords) — stockage, types d'attaques et bonnes pratiques
- [Boîte à outils](/help/hacking/tools) — vue d'ensemble de tous les outils
- [Attaques réseau](/help/hacking/network) — MITM, sniffing et empoisonnement