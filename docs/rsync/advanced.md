---
title: Options avancées
description: Filtres include/exclude, variantes de --delete, compression zstd/lz4, --checksum, --itemize-changes, --bwlimit et snapshots incrémentaux avec --link-dest.
category: rsync
slug: advanced
order: 4
---

## Filtrage avancé {#filters}

Les règles de filtrage sont évaluées dans l'ordre. La première règle qui correspond l'emporte.

```bash
# Inclure UNIQUEMENT les fichiers .php et .html, exclure tout le reste
rsync -avh \
  --include='*.php' \
  --include='*.html' \
  --exclude='*' \
  /var/www/ /backup/www/

# Utiliser un fichier de filtres pour des règles complexes
rsync -avh --filter='merge /etc/rsync-filters.txt' /source/ /dest/
```

```
# Fichiers temporaires
*.tmp
*.swp
*~

# Dossiers de build
node_modules/
__pycache__/
.cache/
dist/
build/

# Fichiers de version control
.git/
.svn/

# Logs
*.log
logs/
```

## Variantes de --delete {#delete}

| Option | Comportement |
| --- | --- |
| `--delete` | Supprime les fichiers absents de la source (par défaut : avant le transfert). |
| `--delete-before` | Supprime d'abord, puis transfère. Libère de l'espace disque avant la copie. |
| `--delete-during` | Supprime au fur et à mesure du scan. Plus rapide pour les grands ensembles de fichiers. |
| `--delete-after` | Transfère d'abord, supprime ensuite. Plus sûr car les fichiers sont copiés avant suppression. |
| `--delete-excluded` | Supprime aussi les fichiers exclus par `--exclude` dans la destination. |

> **Danger** : `--delete` supprime définitivement des fichiers ! Testez **toujours** avec `--dry-run` avant.

## Sauvegardes avec --backup {#backup}

```bash
# Conserver les anciennes versions dans un dossier de backup
rsync -avh --backup --backup-dir=/backup/old/$(date +%F) \
  --delete /home/user/data/ /backup/data/

# Les fichiers modifiés ou supprimés sont déplacés vers
# /backup/old/2026-02-07/ avant d'être écrasés
```

## Reprise de transfert {#resume}

```bash
# --partial conserve les fichiers partiellement transférés
# --partial-dir stocke les partiels dans un dossier dédié (plus propre)
rsync -avhP --partial-dir=.rsync-partial \
  user@serveur:/data/gros-fichier.tar.gz /local/

# Si le transfert est interrompu, relancez la même commande :
# rsync reprendra automatiquement là où il s'est arrêté
```

## Compression {#compression}

```bash
# Compression standard (zlib)
rsync -avz /source/ user@serveur:/dest/

# Compression zstd (rsync 3.2.3+) — plus rapide et meilleur ratio
rsync -avz --compress-choice=zstd /source/ user@serveur:/dest/

# Compression lz4 (rsync 3.2.3+) — ultra-rapide, ratio moindre
rsync -avz --compress-choice=lz4 /source/ user@serveur:/dest/

# Désactiver la compression pour les fichiers déjà compressés
rsync -av --no-compress /source/*.gz user@serveur:/dest/
```

`rsync 3.2.3+` — Les algorithmes zstd et lz4 nécessitent rsync 3.2.3+ sur les deux machines.

### Quel algorithme choisir ?

| Algorithme | Vitesse | Ratio | Cas d'usage |
| --- | --- | --- | --- |
| **zlib** (défaut) | Moyen | Bon | Compatibilité maximale (rsync < 3.2 côté serveur) |
| **zstd** | Rapide | Meilleur | WAN avec rsync 3.2.3+ des deux côtés — recommandé |
| **lz4** | Très rapide | Moyen | LAN rapide où la vitesse CPU prime sur le ratio |
| **aucune** | N/A | N/A | LAN Gigabit, ou fichiers déjà compressés (.gz, .zip, .jpg, .mp4) |

> **Astuce** : N'utilisez jamais `-z` sur des fichiers déjà compressés — la compression ne fera que consommer du CPU sans gain. Utilisez `--skip-compress` pour les exclure :
>
> ```bash
> rsync -avhz --compress-choice=zstd \
>   --skip-compress=gz/bz2/xz/zip/jpg/jpeg/png/mp4/mkv \
>   /source/ user@serveur:/dest/
> ```

## Checksum {#checksum}

Par défaut, rsync décide de transférer un fichier si sa **taille ou sa date de modification diffèrent**. Si les deux sont identiques, rsync suppose que le fichier est inchangé et ne lit pas son contenu. `--checksum` (`-c`) force rsync à calculer un hash pour chaque fichier afin de comparer le contenu réel. C'est 10 à 50× plus lent sur de grands ensembles, mais détecte les corruptions silencieuses.

```bash
# Cas 1 : après une copie depuis FAT/NTFS (timestamps peu fiables)
rsync -avhc /mnt/windows/data/ /backup/

# Cas 2 : audit d'intégrité — vérifier sans rien modifier
rsync -avhcn /home/user/ /backup/user/
# Le dry-run avec --checksum liste les fichiers corrompus sans les retransférer

# Cas 3 : timestamps artificiels (touch, tar --preserve-permissions)
# --size-only ignore les timestamps et compare seulement la taille
rsync -avh --size-only /archive/ /dest/
```

## Itemize changes {#itemize}

```bash
# Affiche un résumé codé de chaque changement (format : YXcstpoguax)
rsync -avhi /source/ /dest/
```

Chaque ligne commence par un code de 11 caractères. Voici comment le lire :

| Position | Valeurs possibles | Signification |
| --- | --- | --- |
| **Y — Action** | `<` `>` `c` `h` `.` `*` | `<` envoyé vers dest, `>` reçu depuis dest, `c` créé localement, `h` hard link, `.` pas de transfert (métadonnée seulement), `*` message système |
| **X — Type** | `f` `d` `L` `D` `S` | `f` fichier régulier, `d` dossier, `L` lien symbolique, `D` device, `S` socket |
| **c** | `c` `.` | Checksum différent (contenu modifié) |
| **s** | `s` `.` | Taille (size) différente |
| **t** | `t` `.` | Timestamp (mtime) différent |
| **p** | `p` `.` | Permissions différentes |
| **o** | `o` `.` | Owner (propriétaire uid) différent |
| **g** | `g` `.` | Group (gid) différent |
| **a x** | `a` `x` `.` | ACL ou attributs étendus (xattr) différents |

```
>f.st......  fichier envoyé, taille (s) et timestamp (t) changés
>f..t......  fichier envoyé, timestamp seulement changé
.d..t......  dossier non transféré, timestamp mis à jour localement
cL.........  lien symbolique créé
*deleting    fichier supprimé (avec --delete)
hf.........  hard link créé (avec --hard-links / -H)
>f.st...og.  fichier envoyé, taille+timestamp+owner+group changés
```

> **Lecture rapide** : Un point `.` signifie "inchangé" pour cet attribut. Une ligne entière de points comme `.d.........` signifie que le dossier existe déjà à l'identique — rien à faire.

## Bande passante {#bandwidth}

```bash
# Limiter à 5 Mo/s (valeur en Ko/s)
rsync -avhP --bwlimit=5000 /source/ user@serveur:/dest/

# Limiter à 1 Mo/s
rsync -avhP --bwlimit=1000 /source/ user@serveur:/dest/

# Utile pour ne pas saturer la connexion réseau
# pendant les heures de bureau par exemple
```

## Sauvegardes incrémentales {#snapshots}

`--link-dest` crée des hard links vers les fichiers inchangés d'une sauvegarde précédente. Chaque snapshot apparaît complet mais ne consomme que l'espace des fichiers modifiés.

```bash
# Créer un snapshot incrémental
LATEST=$(ls -td /backup/daily/*/ | head -1)
rsync -avh --delete \
  --link-dest="$LATEST" \
  /home/user/ /backup/daily/$(date +%F)/

# Résultat : chaque dossier /backup/daily/2026-02-07/ contient
# une copie "complète" mais les fichiers inchangés sont des
# hard links → presque aucun espace disque supplémentaire
```

### Vérifier l'espace réellement utilisé

```bash
# Apparence : chaque snapshot semble occuper 1,2G
du -sh /backup/daily/*/
# 1,2G    /backup/daily/2026-02-05/
# 1,2G    /backup/daily/2026-02-06/
# 1,2G    /backup/daily/2026-02-07/

# Réalité : le dossier parent n'utilise que 1,4G au total
du -sh /backup/daily/
# 1,4G    /backup/daily/      ← au lieu de 3,6G (3 × 1,2G) !

# Preuve : vérifier qu'un fichier inchangé est partagé par 3 snapshots
stat /backup/daily/2026-02-07/home/user/rapport.pdf | grep Nlink
# Nlink: 3   ← 3 répertoires partagent le même inode
```

> **Limite importante** : les hard links ne fonctionnent qu'au sein du **même système de fichiers**. Si `--link-dest` pointe vers une partition montée différente (ex: `/mnt/nas/`), rsync copiera chaque fichier entièrement sans créer de hard links.

> **Récapitulatif** : La combinaison la plus courante pour une sauvegarde efficace est `rsync -avhP --delete --exclude-from=excludes.txt`. Ajoutez `--link-dest` pour les sauvegardes incrémentales et `-z` pour les transferts distants.

## Pour aller plus loin {#next}

- [Transferts distants](/help/rsync/remote) — SSH, daemon rsync, tunnel
- [Automatisation](/help/rsync/automation) — scripts de sauvegarde, cron, systemd
- [Dépannage](/help/rsync/troubleshooting) — erreurs courantes, codes de sortie
