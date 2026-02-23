---
title: Dépannage
description: Diagnostiquer les erreurs rsync courantes, décoder les codes de sortie, déboguer SSH et optimiser les performances LAN et WAN.
category: rsync
slug: troubleshooting
order: 7
---

## Simuler avant d'exécuter {#dryrun}

Toujours commencer par un dry-run pour vérifier ce qui sera modifié.

```bash
# Dry-run avec affichage détaillé
rsync -avhn --delete /source/ /dest/

# Dry-run avec itemize-changes pour un résumé codé
rsync -avhin --delete /source/ /dest/

# Dry-run avec stats complètes
rsync -avhn --delete --stats /source/ /dest/
```

## Niveaux de verbosité {#verbosity}

| Option | Détails affichés |
| --- | --- |
| `-v` | Liste des fichiers transférés |
| `-vv` | Fichiers ignorés et plus de détails |
| `-vvv` | Informations de débogage du protocole |
| `--progress` | Barre de progression par fichier |
| `--stats` | Statistiques globales en fin de transfert |
| `-i` | Résumé codé de chaque changement (itemize) |

## Erreurs courantes et solutions {#errors}

### `rsync: connection unexpectedly closed`

La connexion SSH a été interrompue. Causes possibles :

- Le serveur distant n'a pas rsync installé
- Le chemin distant n'existe pas
- Problème réseau ou timeout SSH
- Le disque distant est plein

```bash
# Vérifier la connexion SSH
ssh -vv user@serveur.com echo "OK"

# Vérifier que rsync est installé sur le serveur
ssh user@serveur.com "which rsync && rsync --version"
```

### `rsync error: some files/attrs were not transferred (code 23)`

Certains fichiers n'ont pas pu être lus ou écrits.

```bash
# Vérifier les permissions
ls -la /source/problematic-file

# Lancer avec sudo si nécessaire
sudo rsync -avh /source/ /dest/

# Ignorer les erreurs de permissions
rsync -avh --no-perms --no-owner --no-group /source/ /dest/
```

### `rsync error: some files vanished before they could be transferred (code 24)`

Des fichiers ont été supprimés ou renommés pendant le transfert. C'est généralement bénin (fichiers temporaires, logs en rotation).

```bash
# Ignorer cette erreur dans un script
rsync -avh /source/ /dest/
EXIT_CODE=$?
if [ $EXIT_CODE -eq 24 ]; then
    echo "Fichiers disparus pendant le transfert (normal)"
    exit 0
fi
exit $EXIT_CODE
```

### `failed to set times on "...": Operation not permitted`

Le système de fichiers de destination ne supporte pas la modification des timestamps (ex: FAT32, certains montages NFS/CIFS).

```bash
# Désactiver la préservation des timestamps
rsync -rlvh --no-times /source/ /dest/

# Ou ignorer les erreurs de timestamp
rsync -avh --modify-window=1 /source/ /dest/
```

### `@ERROR: auth failed on module`

Authentification échouée en mode daemon rsync.

```bash
# Vérifier les permissions du fichier secrets
ls -la /etc/rsyncd.secrets
# Doit être -rw------- (chmod 600)

# Vérifier le contenu (format user:password)
cat /etc/rsyncd.secrets

# Vérifier que le module existe dans rsyncd.conf
grep -A5 '\[backup\]' /etc/rsyncd.conf
```

### Continuer malgré les erreurs

Par défaut, rsync stoppe si trop d'erreurs surviennent. Ces options forcent la continuation :

```bash
# --ignore-errors : continuer même si des fichiers I/O échouent
# Utile quand certains fichiers sont verrouillés ou inaccessibles
rsync -avh --ignore-errors /source/ /dest/

# --ignore-missing-args : ne pas échouer si une source n'existe pas encore
rsync -avh --ignore-missing-args /source/optionnel/ /dest/

# Combinaison pour les sauvegardes tolérantes aux erreurs
rsync -avh --ignore-errors --ignore-missing-args \
  --exclude-from=/etc/rsync-excludes.txt \
  /home/ /backup/
EXIT_CODE=$?
# Codes 23 et 24 sont bénins — ne pas les traiter comme des erreurs
if [ $EXIT_CODE -ne 0 ] && [ $EXIT_CODE -ne 23 ] && [ $EXIT_CODE -ne 24 ]; then
    echo "Erreur fatale rsync : code $EXIT_CODE"
    exit $EXIT_CODE
fi
```

> **Attention** : `--ignore-errors` peut masquer des problèmes réels. Utilisez-le uniquement quand vous savez que certains fichiers seront inaccessibles (ex: fichiers verrouillés par une application active). Consultez toujours les logs.

## Déboguer les connexions SSH {#ssh}

```bash
# Connexion SSH avec debug verbose
ssh -vv user@serveur.com

# Tester rsync avec le debug SSH activé
rsync -avhP -e "ssh -vv" /source/ user@serveur.com:/dest/

# Vérifier le fingerprint du serveur
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

## Optimisation des performances {#performance}

### Transfert en LAN (réseau local)

```bash
# En LAN, désactiver la compression (CPU > réseau)
rsync -avh --whole-file /source/ user@serveur:/dest/
# --whole-file désactive l'algorithme delta (plus rapide en LAN)
```

**Pourquoi `--whole-file` est plus rapide en LAN :** l'algorithme delta de rsync doit lire chaque fichier de destination, calculer des checksums par blocs, puis comparer avec la source. Ce calcul coûte du temps CPU et I/O disque. Sur un LAN Gigabit (125 Mo/s), la bande passante réseau dépasse souvent le débit de lecture disque — il est alors plus rapide d'envoyer le fichier entier que de calculer les deltas. `--whole-file` est activé automatiquement pour les copies locales (même machine).

```bash
# Profil LAN optimal : pas de delta, pas de compression, cipher rapide
rsync -avh --whole-file \
  -e "ssh -o Compression=no -c aes128-gcm@openssh.com" \
  /source/ user@serveur-lan:/dest/
```

### Transfert sur WAN (Internet)

```bash
# Sur WAN, activer compression + limitation de bande passante
rsync -avhzP --bwlimit=5000 /source/ user@serveur:/dest/

# Avec zstd (rsync 3.2.3+) pour un meilleur ratio
rsync -avhP --compress-choice=zstd --bwlimit=5000 /source/ user@serveur:/dest/
```

### Beaucoup de petits fichiers

```bash
# Pour des millions de petits fichiers, désactiver les mises à jour incrémentielles
rsync -avh --no-inc-recursive /source/ /dest/

# Alternative : archiver d'abord, puis transférer
tar czf - /source/ | ssh user@serveur "tar xzf - -C /dest/"
```

## Codes de sortie rsync {#codes}

| Code | Signification | Cause fréquente / Action |
| --- | --- | --- |
| `0` | Succès | — |
| `1` | Erreur de syntaxe ou d'utilisation | Option inconnue ou chemin manquant |
| `2` | Incompatibilité de protocole | Versions rsync très différentes entre source et destination |
| `3` | Erreurs de sélection de fichiers/dossiers | Règles `--include`/`--exclude` mal configurées |
| `5` | Erreur de démarrage du protocole client-serveur | rsync non installé côté distant, ou chemin incorrect |
| `10` | Erreur I/O socket | Connexion réseau coupée ou timeout SSH |
| `11` | Erreur I/O fichier | Disque plein, permissions refusées en lecture/écriture |
| `12` | Erreur dans le flux de données du protocole | Message parasite sur stdout côté serveur (bashrc, motd) |
| `14` | Erreur IPC | Problème de communication inter-processus |
| `20` | Signal reçu (SIGUSR1, SIGINT) | Ctrl+C ou kill envoyé au processus |
| `23` | Transfert partiel — certains fichiers n'ont pas pu être transférés | Permissions manquantes → utiliser `--ignore-errors` si attendu |
| `24` | Fichiers disparus pendant le transfert (souvent bénin) | Fichiers temp/logs supprimés en cours de synchro — traiter comme succès dans les scripts |
| `30` | Timeout en envoi/réception de données | Connexion lente ou serveur surchargé — augmenter `--timeout` |

> Consultez `man rsync` pour la documentation complète, ou visitez [rsync.samba.org](https://rsync.samba.org) pour les dernières informations.

## Pour aller plus loin {#next}

- [Options avancées](/help/rsync/advanced) — `--itemize-changes`, `--checksum`, `--bwlimit`
- [Automatisation](/help/rsync/automation) — gestion des codes de sortie dans les scripts
