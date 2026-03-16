---
title: Hash cracking
description: Identifier et casser des hashes avec Hashcat et John the Ripper — types de hashes, wordlists, rainbow tables, salting et algorithmes modernes.
category: hacking
slug: hashing
order: 5
---

## Pourquoi le hash cracking ? {#intro}

Le **hash cracking** consiste à retrouver le texte en clair à partir d'un hash. C'est une compétence essentielle en pentest :

- **Bases de données fuitées** — Des millions de hashes circulent après des compromissions
- **Fichiers /etc/shadow** — Après avoir accédé à un système Linux, casser les mots de passe des utilisateurs
- **Hashes NTLM** — Extraits de machines Windows (SAM, LSASS)
- **Hashes applicatifs** — WordPress, Joomla, bases de données web

> Pour la théorie des fonctions de hachage (propriétés, algorithmes, usages), voir la [documentation cryptographie](/help/cryptography/hashing).

## Identifier un hash {#identify}

Avant de casser un hash, il faut identifier son **type**. La longueur et le format donnent des indices :

| Type        | Longueur | Format                     | Exemple                                     |
| ----------- | -------- | -------------------------- | ------------------------------------------- |
| **MD5**     | 32 hex   | `[a-f0-9]{32}`             | `5f4dcc3b5aa765d61d8327deb882cf99`          |
| **SHA-1**   | 40 hex   | `[a-f0-9]{40}`             | `5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8`  |
| **SHA-256** | 64 hex   | `[a-f0-9]{64}`             | `5e884898da28047151d0e56f8dc629...`         |
| **SHA-512** | 128 hex  | `[a-f0-9]{128}`            | `b109f3bbbc244eb82441917ed06d...`           |
| **bcrypt**  | 60 chars | `$2b$XX$...`               | `$2b$12$LJ3m4ys3Hzf...`                     |
| **NTLM**    | 32 hex   | `[a-f0-9]{32}` (comme MD5) | `a4f49c406510bdcab6824ee7c30fd852`          |
| **MySQL 5** | 40 hex   | `*` + `[A-F0-9]{40}`       | `*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9` |

### Outils d'identification

```bash
# Identify hash type with hashid
hashid '5f4dcc3b5aa765d61d8327deb882cf99'
# [+] MD5
# [+] MD4
# [+] NTLM

# Identify with hash-identifier
hash-identifier
# > 5f4dcc3b5aa765d61d8327deb882cf99
# Possible Hashs:
# [+] MD5

# Identify with name-that-hash (modern alternative)
nth --text '5f4dcc3b5aa765d61d8327deb882cf99'
```

> **MD5 vs NTLM** : Les deux font 32 caractères hexadécimaux. Le contexte aide à différencier (fichier Windows → NTLM, application web → souvent MD5).

## Hashcat {#hashcat}

**Hashcat** est l'outil de cracking le plus rapide grâce à son utilisation du GPU. Il supporte plus de 300 types de hashes.

### Modes de hash (-m)

| Mode    | Type                | Exemple                            |
| ------- | ------------------- | ---------------------------------- |
| `0`     | MD5                 | `5f4dcc3b5aa765d61d8327deb882cf99` |
| `100`   | SHA-1               | `5baa61e4c9b93...`                 |
| `1400`  | SHA-256             | `5e884898da280...`                 |
| `1800`  | sha512crypt ($6$)   | Linux /etc/shadow                  |
| `1000`  | NTLM                | Windows                            |
| `3200`  | bcrypt              | `$2b$12$...`                       |
| `400`   | WordPress (phpass)  | `$P$B...`                          |
| `13100` | Kerberoasting (TGS) | `$krb5tgs$23$...`                  |

### Types d'attaque (-a)

| Mode | Type            | Description                            |
| ---- | --------------- | -------------------------------------- |
| `0`  | Dictionnaire    | Teste chaque mot d'une wordlist        |
| `1`  | Combinaison     | Combine des mots de deux wordlists     |
| `3`  | Brute force     | Teste toutes les combinaisons (masque) |
| `6`  | Hybride WL+mask | Wordlist + suffixe par masque          |
| `7`  | Hybride mask+WL | Préfixe par masque + wordlist          |

### Exemples pratiques

```bash
# Dictionary attack on MD5 hash
hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt

# Dictionary attack with rules (mutations: capitalize, add numbers, etc.)
hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Brute force with mask (8 chars, lowercase + digits)
hashcat -m 0 -a 3 hash.txt '?l?l?l?l?l?d?d?d'

# Crack NTLM hashes from Windows
hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt

# Crack Linux shadow hashes (SHA-512)
hashcat -m 1800 -a 0 shadow_hashes.txt /usr/share/wordlists/rockyou.txt

# Show cracked passwords
hashcat -m 0 hash.txt --show
```

### Masques

| Caractère | Signification     |
| --------- | ----------------- |
| `?l`      | Minuscule (a-z)   |
| `?u`      | Majuscule (A-Z)   |
| `?d`      | Chiffre (0-9)     |
| `?s`      | Caractère spécial |
| `?a`      | Tout (`?l?u?d?s`) |

```bash
# 8-character password: uppercase + 6 lowercase + digit
hashcat -m 0 -a 3 hash.txt '?u?l?l?l?l?l?l?d'
```

## John the Ripper {#john}

**John the Ripper** (souvent appelé « John ») est un outil de cracking polyvalent, particulièrement bon pour les hashes Linux et les formats spéciaux.

```bash
# Basic dictionary attack (auto-detect hash format)
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Specify hash format explicitly
john hash.txt --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt

# Crack /etc/shadow (combine with /etc/passwd first)
unshadow /etc/passwd /etc/shadow > unshadowed.txt
john unshadowed.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Crack ZIP file password
zip2john protected.zip > zip_hash.txt
john zip_hash.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Crack SSH private key passphrase
ssh2john id_rsa > ssh_hash.txt
john ssh_hash.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Show cracked passwords
john hash.txt --show

# Incremental mode (brute force)
john hash.txt --incremental
```

### Formats utiles de John

| Commande       | Format cible          |
| -------------- | --------------------- |
| `zip2john`     | Fichiers ZIP protégés |
| `rar2john`     | Fichiers RAR protégés |
| `ssh2john`     | Clés SSH protégées    |
| `pdf2john`     | Fichiers PDF protégés |
| `keepass2john` | Bases KeePass         |
| `office2john`  | Documents Office      |

## Rainbow tables {#rainbow}

Les **rainbow tables** sont des tables de hashes précalculés. Au lieu de calculer le hash en temps réel, on cherche directement dans la table.

```
Sans rainbow table :               Avec rainbow table :
"password" → hash() → compare      hash → lookup dans la table → "password"
(calcul à chaque tentative)        (recherche instantanée)
```

### Pourquoi le sel les rend inutiles

Un **sel** (salt) est une valeur aléatoire ajoutée au mot de passe avant le hachage. Chaque utilisateur a un sel différent, donc il faudrait une rainbow table distincte par sel — rendant l'approche impraticable.

```
Sans sel :  hash("password")           = abc123 (même hash pour tout le monde)
Avec sel :  hash("password" + "x7k2m") = def456 (hash unique par utilisateur)
            hash("password" + "p9w3r") = ghi789 (hash différent, même mot de passe)
```

> Les algorithmes modernes (bcrypt, argon2) intègrent le sel automatiquement.

## Wordlists {#wordlists}

La qualité de la wordlist est souvent plus importante que la puissance de calcul.

### Wordlists populaires

| Wordlist               | Taille      | Contenu                             |
| ---------------------- | ----------- | ----------------------------------- |
| **rockyou.txt**        | ~14 M mots  | Fuites de données réelles           |
| **SecLists**           | Variable    | Collection de listes par catégorie  |
| **CrackStation**       | ~1.5 G mots | Compilation massive de fuites       |
| **Probable-Wordlists** | Variable    | Classées par fréquence d'apparition |

```bash
# rockyou.txt is included in Kali Linux
ls /usr/share/wordlists/rockyou.txt

# SecLists (install if not present)
sudo apt install seclists
ls /usr/share/seclists/Passwords/
```

### Générer des wordlists personnalisées

```bash
# Generate custom wordlist with crunch (min 6, max 8, charset)
crunch 6 8 abcdefghijklmnopqrstuvwxyz0123456789 -o custom.txt

# Scrape website for keywords (useful for targeted attacks)
cewl http://target.com -d 3 -m 5 -w cewl_wordlist.txt

# Generate variations with rules
hashcat --stdout /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule > mutated.txt
```

## Algorithmes modernes et résistance {#modern}

Les algorithmes conçus pour le stockage de mots de passe sont **volontairement lents** :

| Algorithme  | Vitesse (GPU)   | Résistance au cracking | Paramétrable                 |
| ----------- | --------------- | ---------------------- | ---------------------------- |
| **MD5**     | ~50 milliards/s | Très faible            | Non                          |
| **SHA-256** | ~5 milliards/s  | Faible                 | Non                          |
| **bcrypt**  | ~30 000/s       | Forte                  | Coût (rounds)                |
| **scrypt**  | ~10 000/s       | Très forte             | CPU + mémoire                |
| **argon2**  | ~5 000/s        | Maximale               | CPU + mémoire + parallélisme |

> **La différence est colossale** : on passe de milliards de tentatives par seconde (MD5) à quelques milliers (argon2). Un mot de passe de 8 caractères en MD5 se casse en minutes, en argon2 il faut des années.

## Pour aller plus loin {#next}

- [Bruteforce](/help/hacking/bruteforce) — Hashcat avancé, rules engine, bruteforce online et génération de wordlists
- [Mots de passe et authentification](/help/hacking/passwords) — stockage, attaques et bonnes pratiques
- [Fonctions de hachage](/help/cryptography/hashing) — théorie des fonctions de hachage cryptographiques
- [Escalade de privilèges](/help/hacking/privesc) — utiliser les hashes crackés pour élever ses privilèges