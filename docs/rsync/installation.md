---
title: Installation de rsync
description: Installer rsync sur Debian, Ubuntu, RHEL, Arch, macOS et Windows — et choisir la bonne version.
category: rsync
slug: installation
order: 2
---

## Installation {#install}

Rsync est préinstallé sur la plupart des distributions Linux et macOS. Voici comment l'installer ou le mettre à jour.

### Debian / Ubuntu

```bash
# Installer rsync
sudo apt update
sudo apt install rsync

# Vérifier l'installation
rsync --version
```

### RHEL / CentOS / Fedora / AlmaLinux

```bash
# Fedora / RHEL 9+
sudo dnf install rsync

# CentOS 7 / RHEL 7
sudo yum install rsync

# Vérifier l'installation
rsync --version
```

### Arch Linux

```bash
sudo pacman -S rsync
```

### macOS

```bash
# Rsync est préinstallé sur macOS mais souvent en version ancienne (2.6.x)
# Pour obtenir la dernière version (3.2+) :
brew install rsync

# Vérifier la version
rsync --version
```

### Windows (WSL)

```bash
# Dans WSL (Windows Subsystem for Linux)
sudo apt install rsync

# Ou via Cygwin / MSYS2 sous Windows natif
```

## Versions et fonctionnalités {#versions}

| Version   | Nouveautés clés                                                                           |
| --------- | ----------------------------------------------------------------------------------------- |
| **3.0.x** | Protocole incrémental, ACL et xattr support                                               |
| **3.1.x** | Transfert incrémental récursif, options `--info` et `--debug`                             |
| **3.2.x** | Compression zstd et lz4 (`--compress-choice`), checksum xxhash, améliorations de sécurité |
| **3.3.x** | Optimisation des performances, correctifs de sécurité, support renforcé des liens         |

> **Conseil** : Vérifiez votre version avec `rsync --version`. Pour profiter de la compression zstd et des checksums xxhash, vous avez besoin de rsync **3.2.3 ou supérieur sur les deux machines** (source et destination).

## Pour aller plus loin {#next}

- [Utilisation basique](/help/rsync/basics) — options essentielles et premiers exemples
- [Transferts distants](/help/rsync/remote) — configurer SSH et le mode daemon