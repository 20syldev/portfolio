---
title: Transferts distants
description: Transferts SSH (push, pull, clés, restriction), mode daemon rsyncd, tunnel SSH et comparaison SSH vs daemon.
category: rsync
slug: remote
order: 5
---

## Mode SSH (par défaut) {#ssh}

Le mode par défaut et le plus sécurisé. Le transport est chiffré via SSH, aucune configuration serveur spécifique n'est nécessaire — il suffit d'un accès SSH.

### Push — Envoyer des fichiers vers un serveur

```bash
# Envoyer un dossier vers un serveur distant
rsync -avhP /home/user/projet/ user@serveur.com:/var/www/projet/

# Avec un port SSH personnalisé
rsync -avhP -e "ssh -p 2222" /home/user/projet/ user@serveur.com:/var/www/projet/

# Avec une clé SSH spécifique
rsync -avhP -e "ssh -i ~/.ssh/id_deploy" /home/user/projet/ user@serveur.com:/var/www/projet/
```

```
sending incremental file list
index.html
         8,42K 100%    0,00kB/s    0:00:00 (xfr#1, to-chk=42/44)
app.js
     1,23M  67%  456,12kB/s    0:00:01
     1,84M 100%  523,44kB/s    0:00:03 (xfr#2, to-chk=41/44)
assets/logo.png
       124,5K 100%  412,33kB/s    0:00:00 (xfr#3, to-chk=40/44)

sent 3,21M bytes  received 2,14K bytes  654,22kB/s
total size is 12,45M  speedup is 3,87
```

`to-chk=40/44` — 40 fichiers restants à vérifier sur 44 au total. `xfr#3` — 3e fichier effectivement transféré (les autres étaient déjà à jour). `speedup is 3,87` — les fichiers inchangés ont évité 3× leur taille en transfert réseau.

### Pull — Récupérer des fichiers depuis un serveur

```bash
# Récupérer un dossier depuis un serveur distant
rsync -avhP user@serveur.com:/var/log/app/ /local/logs/

# Récupérer un fichier unique
rsync -avhP user@serveur.com:/backup/db-dump.sql.gz /local/backups/
```

## Configuration des clés SSH {#keys}

Pour automatiser les transferts (cron, scripts), configurez l'authentification par clé SSH afin d'éviter la saisie du mot de passe.

```bash
# 1. Générer une paire de clés (si pas déjà fait)
ssh-keygen -t ed25519 -C "rsync-backup" -f ~/.ssh/id_rsync

# 2. Copier la clé publique sur le serveur distant
ssh-copy-id -i ~/.ssh/id_rsync.pub user@serveur.com

# 3. Tester la connexion sans mot de passe
ssh -i ~/.ssh/id_rsync user@serveur.com echo "OK"

# 4. Utiliser cette clé avec rsync
rsync -avhP -e "ssh -i ~/.ssh/id_rsync" /source/ user@serveur.com:/dest/
```

> **Conseil sécurité** : Pour les sauvegardes automatiques, créez un utilisateur dédié sur le serveur avec des permissions restreintes. Vous pouvez limiter la clé SSH à rsync uniquement dans `~/.ssh/authorized_keys` avec un préfixe `command="..."`.

## Restreindre une clé SSH à rsync {#restrict}

```
# Limiter cette clé à rsync uniquement
command="rsync --server --sender -vlHogDtpre.iLsfxCIvu . /backup/",no-pty,no-agent-forwarding,no-port-forwarding ssh-ed25519 AAAAC3... rsync-backup
```

## Mode Daemon rsync {#daemon}

Le mode daemon tourne en service permanent sur le port 873/TCP. Il ne chiffre pas les données (sauf via un tunnel SSH) mais offre un contrôle fin des modules partagés, une authentification par fichier secrets, et ne nécessite pas de compte SSH.

### Configuration du serveur daemon

```ini
# /etc/rsyncd.conf

# Configuration globale
uid = nobody
gid = nogroup
use chroot = yes
max connections = 10
log file = /var/log/rsyncd.log
pid file = /var/run/rsyncd.pid

# Module "backup" — accessible en lecture/écriture
[backup]
    path = /srv/backup
    comment = Espace de sauvegarde
    read only = no
    auth users = backupuser
    secrets file = /etc/rsyncd.secrets
    hosts allow = 192.168.1.0/24
    hosts deny = *

# Module "public" — accessible en lecture seule
[public]
    path = /srv/public
    comment = Fichiers publics
    read only = yes
    list = yes
```

### Fichier de mots de passe

```bash
# Créer le fichier secrets (format user:password)
echo "backupuser:MotDePasseSecret123" | sudo tee /etc/rsyncd.secrets

# Permissions strictes obligatoires
sudo chmod 600 /etc/rsyncd.secrets
```

### Démarrer le daemon

```bash
# Via systemd (recommandé)
sudo systemctl enable --now rsync   # Debian/Ubuntu
sudo systemctl enable --now rsyncd  # RHEL/CentOS

# Ou manuellement
rsync --daemon --config=/etc/rsyncd.conf

# Vérifier que le daemon écoute
ss -tlnp | grep 873
```

### Utiliser le daemon (côté client)

```bash
# Syntaxe avec double-colon (::)
rsync -avhP /data/ backupuser@serveur::backup/

# Syntaxe URL (rsync://)
rsync -avhP /data/ rsync://backupuser@serveur/backup/

# Lister les modules disponibles sur un serveur
rsync rsync://serveur/

# Avec fichier de mot de passe (pour automatisation)
echo "MotDePasseSecret123" > ~/.rsync-password
chmod 600 ~/.rsync-password
rsync -avhP --password-file=~/.rsync-password /data/ backupuser@serveur::backup/
```

## Tunnel SSH vers un daemon rsync {#tunnel}

Pour utiliser le mode daemon (port 873) avec chiffrement, créez un tunnel SSH qui redirige un port local vers le port 873 du serveur. Toutes les données transitent alors par SSH.

```bash
# 1. Créer le tunnel SSH en arrière-plan
ssh -f -N -L 8873:localhost:873 user@serveur.com

# 2. Synchroniser via le tunnel (utiliser localhost avec le port redirigé)
rsync -avhP --port=8873 /data/ rsync://backupuser@localhost/backup/

# Ou en une seule commande (tunnel intégré à rsync)
rsync -avhP \
  -e "ssh -L 8873:localhost:873 -o ExitOnForwardFailure=yes" \
  /data/ rsync://backupuser@localhost/backup/

# Fermer le tunnel après usage
pkill -f "ssh -f -N -L 8873"
```

> **Cas d'usage spécifique** : Cette technique est utile uniquement si vous avez besoin des fonctionnalités du mode daemon (modules, authentification par secrets) sur un réseau non sécurisé. Dans la grande majorité des cas, le **mode SSH natif est plus simple et tout aussi sécurisé**.

## SSH vs Daemon : lequel choisir ? {#comparison}

| Critère | SSH | Daemon |
| --- | --- | --- |
| Chiffrement | Natif (SSH) | Non (sauf tunnel SSH) |
| Authentification | Clé SSH / mot de passe SSH | Fichier secrets dédié |
| Compte système | Nécessaire sur le serveur | Pas nécessaire |
| Performance | Légèrement plus lent (chiffrement) | Plus rapide (pas de chiffrement) |
| Port | 22 (SSH) | 873 (rsync) |
| Cas d'usage | Internet, WAN, partout | LAN, réseau de confiance |

## Configuration du pare-feu {#firewall}

```bash
# Pour le mode daemon, ouvrir le port 873
sudo ufw allow 873/tcp                    # UFW (Ubuntu)
sudo firewall-cmd --add-port=873/tcp --permanent  # firewalld (RHEL)
sudo firewall-cmd --reload

# Pour le mode SSH, le port 22 est généralement déjà ouvert
sudo ufw allow ssh
```

> **Recommandation** : Privilégiez le mode SSH pour les transferts sur Internet. Utilisez le mode daemon uniquement sur un réseau local de confiance ou à travers un tunnel SSH/VPN.

## Pour aller plus loin {#next}

- [Automatisation](/help/rsync/automation) — cron, systemd, scripts de sauvegarde avec SSH
- [Dépannage](/help/rsync/troubleshooting) — erreurs SSH courantes, auth daemon, optimisation
