---
title: Installation de GPG
description: Installer GnuPG sur Debian, Ubuntu, Arch, macOS et Windows — vérifier la version et configurer les options recommandées.
category: gpg
slug: installation
order: 2
---

## Installation {#install}

GnuPG est disponible sur tous les systèmes d'exploitation majeurs. La plupart des distributions Linux l'incluent par défaut.

### Debian / Ubuntu

```bash
sudo apt update && sudo apt install gnupg
```

GPG est généralement déjà installé. Cette commande met à jour vers la dernière version disponible.

### Fedora / RHEL / CentOS

```bash
sudo dnf install gnupg2
```

### Arch Linux

```bash
sudo pacman -S gnupg
```

### macOS

```bash
# With Homebrew
brew install gnupg

# Recommended: install a graphical pinentry for the passphrase prompt
brew install pinentry-mac
```

Après l'installation de `pinentry-mac`, configurer GPG pour l'utiliser :

```bash
echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
```

### Windows

Deux options :

- **WSL** (recommandé) — Installer via ta distribution Linux dans WSL (voir Debian/Ubuntu ci-dessus)
- **Gpg4win** — Télécharger depuis [gpg4win.org](https://gpg4win.org/) pour un environnement natif Windows avec interface graphique (Kleopatra)

### Vérifier l'installation

```bash
gpg --version
```

```
gpg (GnuPG) 2.4.4
libgcrypt 1.10.3
```

> **Bonne pratique** : Assure-toi d'avoir au minimum **GPG 2.2** pour bénéficier du support ed25519 et des fonctionnalités modernes.

## Versions et fonctionnalités {#versions}

| Fonctionnalité               | GPG 2.2.x (LTS)      | GPG 2.4.x (stable)   |
| ---------------------------- | -------------------- | -------------------- |
| Algorithme ed25519           | ✓                    | ✓                    |
| Courbe cv25519 (chiffrement) | ✓                    | ✓                    |
| AEAD (chiffrement moderne)   | Expérimental         | ✓ Natif              |
| Keybox (nouveau format)      | ✗                    | ✓                    |
| TPM support                  | ✗                    | ✓                    |
| Support natif                | Debian 11, Ubuntu 22 | Debian 12, Ubuntu 24 |

Les deux versions sont parfaitement compatibles avec GitHub et la signature de commits. Si ton système fournit GPG 2.2, il n'est pas nécessaire de passer à 2.4.

## Configuration initiale {#config}

Le fichier de configuration principal se trouve dans `~/.gnupg/gpg.conf`. Voici les options recommandées :

```bash
# Create the directory if it doesn't exist
mkdir -p ~/.gnupg
chmod 700 ~/.gnupg
```

Ajouter dans `~/.gnupg/gpg.conf` :

```ini
# Display long key IDs (16 chars) instead of short (8 chars)
keyid-format 0xlong

# Display full fingerprint
with-fingerprint

# Prefer strong algorithms
personal-digest-preferences SHA512 SHA384 SHA256
personal-cipher-preferences AES256 AES192 AES
personal-compress-preferences ZLIB BZIP2 ZIP Uncompressed

# Use SHA512 for signatures
cert-digest-algo SHA512
default-preference-list SHA512 SHA384 SHA256 AES256 AES192 AES ZLIB BZIP2 ZIP Uncompressed

# Default keyserver
keyserver hkps://keyserver.ubuntu.com

# Auto-retrieve keys when verifying signatures
auto-key-retrieve
```

> **Note** : Les permissions du dossier `~/.gnupg/` doivent être `700` (lecture/écriture/exécution uniquement pour le propriétaire). GPG refusera de fonctionner si les permissions sont trop ouvertes.

### Configuration de l'agent GPG

Le fichier `~/.gnupg/gpg-agent.conf` contrôle le cache des passphrases :

```ini
# Cache the passphrase for 1 hour (3600 seconds)
default-cache-ttl 3600

# Maximum cache time: 4 hours
max-cache-ttl 14400
```

Après modification, redémarrer l'agent :

```bash
gpgconf --kill gpg-agent
```

## Pour aller plus loin {#next}

- [Génération des clés](/help/gpg/keys) — créer votre première paire de clés GPG
- [Signer ses commits](/help/gpg/signing) — configurer Git pour signer automatiquement
- [Dépannage](/help/gpg/troubleshooting) — résoudre les problèmes d'installation courants