---
title: Automatisation
description: Planifier des sauvegardes rsync avec cron et systemd, écrire des scripts robustes avec --link-dest, rétention et gestion des codes de sortie.
category: rsync
slug: automation
order: 6
---

## Planification avec cron {#cron}

```bash
# Éditer la crontab
crontab -e
```

```crontab
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /usr/bin/rsync -avh --delete /home/user/data/ /backup/daily/ >> /var/log/rsync-daily.log 2>&1

# Sauvegarde hebdomadaire le dimanche à 3h
0 3 * * 0 /usr/bin/rsync -avh --delete /home/user/ /backup/weekly/ >> /var/log/rsync-weekly.log 2>&1

# Synchronisation toutes les 6 heures vers un serveur distant
0 */6 * * * /usr/bin/rsync -avhz -e "ssh -i /home/user/.ssh/id_rsync" /var/www/ user@backup.srv:/backup/www/ >> /var/log/rsync-www.log 2>&1
```

> Utilisez toujours le chemin complet vers rsync (`/usr/bin/rsync`) dans les crontabs. Redirigez stdout et stderr vers un fichier de log pour le diagnostic.

## Planification systemd timer {#systemd}

Alternative moderne à cron avec journalisation intégrée, gestion des dépendances, et rattrapage des exécutions manquées.

### Fichier service

```ini
# /etc/systemd/system/rsync-backup.service
[Unit]
Description=Sauvegarde rsync quotidienne
After=network-online.target
Wants=network-online.target
OnFailure=rsync-backup-notify@%n.service

[Service]
Type=oneshot
User=root
ExecStart=/usr/bin/rsync -avh --delete \
    --exclude-from=/etc/rsync-excludes.txt \
    -e "ssh -i /root/.ssh/id_rsync" \
    /home/ backupuser@backup.srv:/backup/homes/
StandardOutput=journal
StandardError=journal
```

### Service de notification (template unit)

```ini
# /etc/systemd/system/rsync-backup-notify@.service
[Unit]
Description=Notification d'échec sauvegarde rsync
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'echo "Le service %i a échoué" | mail -s "Backup rsync FAILED" admin@example.com'
```

> **Pourquoi `OnFailure=` et pas `ExecStartPost=` ?** Pour un service `Type=oneshot`, `ExecStartPost=` ne voit pas le code de sortie de `ExecStart=` — la variable `$EXIT_STATUS` n'existe pas dans ce contexte. `OnFailure=` est la seule approche fiable pour déclencher une action uniquement en cas d'échec.

### Fichier timer

```ini
# /etc/systemd/system/rsync-backup.timer
[Unit]
Description=Timer pour sauvegarde rsync quotidienne

[Timer]
# Tous les jours à 2h du matin
OnCalendar=*-*-* 02:00:00
# Rattraper les exécutions manquées (machine éteinte)
Persistent=true
# Ajouter un délai aléatoire pour éviter les pics (0-30 min)
RandomizedDelaySec=1800

[Install]
WantedBy=timers.target
```

### Activation et gestion

```bash
# Recharger la configuration systemd
sudo systemctl daemon-reload

# Activer et démarrer le timer
sudo systemctl enable --now rsync-backup.timer

# Vérifier l'état du timer
systemctl status rsync-backup.timer
systemctl list-timers | grep rsync

# Voir les logs
journalctl -u rsync-backup.service --since today

# Lancer manuellement (pour tester)
sudo systemctl start rsync-backup.service
```

## Script de sauvegarde {#script}

Ce script crée des sauvegardes incrémentales quotidiennes avec rotation automatique. Grâce à `--link-dest`, chaque snapshot apparaît complet mais ne consomme que l'espace des fichiers modifiés.

```bash
#!/bin/bash
set -euo pipefail

# ============================================================
# Configuration
# ============================================================
SOURCE="/home/"
BACKUP_BASE="/backup/snapshots"
EXCLUDE_FILE="/etc/rsync-excludes.txt"
LOG_FILE="/var/log/rsync-backup.log"
RETENTION_DAYS=30          # Nombre de jours de rétention
DATE=$(date +%F_%H-%M)     # 2026-02-07_02-00
SSH_KEY="/root/.ssh/id_rsync"

# ============================================================
# Fonctions
# ============================================================
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

cleanup() {
    log "Nettoyage des sauvegardes de plus de $RETENTION_DAYS jours..."
    find "$BACKUP_BASE" -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
    log "Nettoyage terminé."
}

# ============================================================
# Exécution
# ============================================================
log "=== Début de la sauvegarde ==="
log "Source : $SOURCE"
log "Destination : $BACKUP_BASE/$DATE"

# Créer le dossier de base si nécessaire
mkdir -p "$BACKUP_BASE"

# Trouver le snapshot le plus récent pour --link-dest
LATEST=$(find "$BACKUP_BASE" -maxdepth 1 -type d -not -name "$(basename $BACKUP_BASE)" | sort -r | head -1)

LINK_DEST_OPT=""
if [ -n "$LATEST" ] && [ -d "$LATEST" ]; then
    LINK_DEST_OPT="--link-dest=$LATEST"
    log "Link-dest : $LATEST"
else
    log "Pas de sauvegarde précédente trouvée (backup complet)"
fi

# Lancer rsync
rsync -avh --delete \
    --exclude-from="$EXCLUDE_FILE" \
    $LINK_DEST_OPT \
    "$SOURCE" "$BACKUP_BASE/$DATE/" \
    >> "$LOG_FILE" 2>&1

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    log "SUCCESS: Sauvegarde réussie : $BACKUP_BASE/$DATE"
elif [ $EXIT_CODE -eq 24 ]; then
    log "WARNING: Sauvegarde terminée avec des fichiers disparus (code 24 — normal)"
else
    log "ERROR: Erreur rsync (code $EXIT_CODE)"
    exit $EXIT_CODE
fi

# Rotation des anciennes sauvegardes
cleanup

log "=== Fin de la sauvegarde ==="
```

```bash
# Rendre le script exécutable
chmod +x /usr/local/bin/backup.sh

# Tester manuellement
sudo /usr/local/bin/backup.sh

# Vérifier les snapshots créés
ls -la /backup/snapshots/
# 2026-02-05_02-00/
# 2026-02-06_02-00/
# 2026-02-07_02-00/

# Vérifier l'espace disque utilisé (grâce aux hardlinks)
du -sh /backup/snapshots/*/
# 15G   /backup/snapshots/2026-02-05_02-00/  ← backup complet
# 200M  /backup/snapshots/2026-02-06_02-00/  ← seulement les diffs
# 150M  /backup/snapshots/2026-02-07_02-00/  ← seulement les diffs
```

## Sauvegarde distante {#remote}

Adaptation du script précédent pour sauvegarder vers un serveur SSH distant en conservant les snapshots incrémentaux. Les hard links sont créés côté serveur.

```bash
#!/bin/bash
set -euo pipefail

SOURCE="/home/"
REMOTE_USER="backupuser"
REMOTE_HOST="backup.srv"
REMOTE_BASE="/backup/snapshots"
SSH_KEY="/root/.ssh/id_rsync"
EXCLUDE_FILE="/etc/rsync-excludes.txt"
LOG_FILE="/var/log/rsync-remote.log"
DATE=$(date +%F_%H-%M)

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# Trouver le dernier snapshot sur le serveur DISTANT
LATEST=$(ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" \
    "ls -dt ${REMOTE_BASE}/*/ 2>/dev/null | head -1" || true)

LINK_DEST_OPT=""
if [ -n "$LATEST" ]; then
    LINK_DEST_OPT="--link-dest=$LATEST"
    log "Link-dest distant : $LATEST"
else
    log "Pas de snapshot précédent (backup complet)"
fi

log "=== Début sauvegarde distante ==="
rsync -avhz --delete \
    --exclude-from="$EXCLUDE_FILE" \
    -e "ssh -i $SSH_KEY" \
    $LINK_DEST_OPT \
    "$SOURCE" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_BASE/$DATE/" \
    >> "$LOG_FILE" 2>&1

EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ] || [ $EXIT_CODE -eq 24 ]; then
    log "SUCCESS: $REMOTE_BASE/$DATE"
else
    log "ERROR: rsync a échoué (code $EXIT_CODE)"
    exit $EXIT_CODE
fi
```

> **Important** : Avec `--link-dest` vers un serveur distant, les hard links sont créés côté serveur — rsync ne transfère que les blocs modifiés, mais chaque snapshot reste consultable comme une copie complète. Les hard links ne fonctionnent qu'au sein du même système de fichiers sur le serveur.

## Fichier d'exclusion {#excludes}

```
# /etc/rsync-excludes.txt

# Fichiers temporaires et caches
*.tmp
*.swp
*~
.cache/
.thumbnails/

# Node.js / Python / Dev
node_modules/
__pycache__/
.venv/
.tox/
dist/
build/

# Système
/proc/
/sys/
/dev/
/run/
/tmp/
/mnt/
/media/
lost+found/

# Logs volumineux (sauvegardés séparément si nécessaire)
*.log

# Corbeille
.Trash-*/
.local/share/Trash/
```

## Rotation des logs {#logrotate}

```
# /etc/logrotate.d/rsync-backup
/var/log/rsync-backup.log {
    weekly
    rotate 12
    compress
    delaycompress
    missingok
    notifempty
    create 640 root root
}
```

> **Architecture recommandée** : Combinez le script `backup.sh` avec un timer systemd pour une solution robuste. Le timer gère la planification et le rattrapage, le script gère la logique de sauvegarde et rotation, et journald conserve les logs.

## Pour aller plus loin {#next}

- [Options avancées](/help/rsync/advanced) — `--link-dest`, `--bwlimit`, compression pour les transferts distants
- [Dépannage](/help/rsync/troubleshooting) — codes de sortie, erreurs SSH, optimisation des performances
