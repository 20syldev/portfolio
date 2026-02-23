---
title: Utilisation basique
description: Syntaxe fondamentale de rsync, options essentielles, décomposition de -a et exemples pratiques commentés.
category: rsync
slug: basics
order: 3
---

## Syntaxe fondamentale {#syntax}

```bash
rsync [OPTIONS] SOURCE... DESTINATION

# Exemples de syntaxe
rsync -av /source/ /destination/          # Local
rsync -av /source/ user@host:/dest/       # Vers un serveur distant
rsync -av user@host:/source/ /dest/       # Depuis un serveur distant
```

### Attention au slash final (trailing slash)

Le slash `/` à la fin du chemin source change complètement le comportement :

```bash
# AVEC slash final : copie le CONTENU du dossier
rsync -av /home/user/documents/ /backup/
# Résultat : /backup/fichier1.txt, /backup/fichier2.txt

# SANS slash final : copie le dossier LUI-MÊME
rsync -av /home/user/documents /backup/
# Résultat : /backup/documents/fichier1.txt, /backup/documents/fichier2.txt
```

## Options essentielles {#options}

| Option | Forme longue | Description |
| --- | --- | --- |
| `-a` | `--archive` | Mode archive : équivaut à `-rlptgoD`. Préserve récursivité, liens, permissions, timestamps, group, owner, devices. |
| `-v` | `--verbose` | Affiche les fichiers transférés. Doublez (`-vv`) pour plus de détails. |
| `-h` | `--human-readable` | Tailles en Ko/Mo/Go plutôt qu'en octets. |
| `-z` | `--compress` | Compresse les données pendant le transfert (utile pour les connexions lentes). |
| `-P` | `--partial --progress` | Affiche la progression et conserve les fichiers partiels (reprise de transfert). |
| `-n` | `--dry-run` | Simule l'exécution sans rien modifier. **Toujours tester d'abord !** |
| `-r` | `--recursive` | Copie récursive dans les sous-dossiers. Déjà inclus dans `-a`. |
| `--delete` | `--delete` | Supprime les fichiers dans la destination qui n'existent plus dans la source (miroir exact). |

## Décomposition de `-a` {#archive}

`-a` est un raccourci pour sept flags combinés. Voici ce que chacun fait :

| Flag | Forme longue | Ce qui est préservé |
| --- | --- | --- |
| `-r` | `--recursive` | Copie dans les sous-dossiers |
| `-l` | `--links` | Liens symboliques (copié tel quel, pas la cible) |
| `-p` | `--perms` | Permissions fichier (chmod — ex: 755, 644) |
| `-t` | `--times` | Date de modification (mtime) — critique pour les synchros suivantes |
| `-g` | `--group` | Groupe propriétaire (gid) |
| `-o` | `--owner` | Propriétaire (uid) — nécessite les droits root |
| `-D` | `--devices --specials` | Fichiers device spéciaux et sockets (root uniquement) |

> **Attention** : `-a` ne préserve **pas** les ACL (`-A`), les attributs étendus (`-X`), ni les hard links (`-H`). Pour une sauvegarde système complète, utilisez `-aAXH`.

## Exemples pratiques {#examples}

### Copie locale simple

```bash
rsync -avh /home/user/documents/ /mnt/backup/documents/
```

```
sending incremental file list
rapport.pdf
photos/
photos/vacances.jpg
photos/famille.png

sent 15,42M bytes  received 1,23K bytes  10,28M bytes/sec
total size is 15,42M  speedup is 1,00
```

- `sending incremental file list` — rsync construit sa liste à la volée (mode incrémental, défaut depuis rsync 3.0).
- Les lignes suivantes — chaque fichier transféré est affiché. Les dossiers se terminent par `/`.
- `speedup is 1,00` — ratio d'efficacité. Pour une copie initiale, tous les fichiers sont transférés : speedup = 1,00 (aucune économie delta). Lors des synchros suivantes, ce chiffre augmente.

### Deuxième exécution (aucun fichier modifié)

```bash
rsync -avh /home/user/documents/ /mnt/backup/documents/
```

```
sending incremental file list

sent 223 bytes  received 12 bytes  470,00 bytes/sec
total size is 15,42M  speedup is 65,99
```

Un `speedup` de 65,99 signifie que rsync n'a transféré que 1/66e de la taille totale des fichiers — uniquement les métadonnées pour vérifier que tout est à jour. Aucun contenu n'a été retransféré.

### Synchronisation miroir (avec suppression)

```bash
# WARNING: --delete supprime les fichiers dans /backup/ qui n'existent plus dans /source/
# TOUJOURS tester avec --dry-run d'abord !

# 1. Test à blanc
rsync -avhn --delete /home/user/projets/ /backup/projets/

# 2. Si le résultat est correct, exécuter pour de vrai
rsync -avh --delete /home/user/projets/ /backup/projets/
```

### Copie avec barre de progression

```bash
# -P = --partial + --progress
rsync -avhP /home/user/iso/ubuntu.iso /mnt/usb/

# Sortie :
# ubuntu.iso
#   2.85G  45%  125.50MB/s    0:00:12
```

### Exclure des fichiers

```bash
# Exclure un pattern
rsync -avh --exclude='*.log' /var/www/ /backup/www/

# Exclure plusieurs patterns
rsync -avh \
  --exclude='*.log' \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='__pycache__' \
  /home/user/projet/ /backup/projet/

# Exclure depuis un fichier
rsync -avh --exclude-from='exclude-list.txt' /source/ /dest/
```

> **Bonne pratique** : Utilisez toujours `-n` (dry-run) avant toute commande rsync impliquant `--delete`. Cela vous montre exactement ce qui sera modifié sans toucher aux fichiers.

## Pour aller plus loin {#next}

- [Options avancées](/help/rsync/advanced) — filtres complexes, compression, `--link-dest`, `-i`
- [Transferts distants](/help/rsync/remote) — SSH, daemon rsync
- [Automatisation](/help/rsync/automation) — cron, systemd, scripts de sauvegarde
