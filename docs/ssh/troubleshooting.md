---
title: Dépannage SSH
description: Diagnostiquer les erreurs de connexion SSH, déboguer avec -vvv, résoudre les problèmes de permissions et de clés.
category: ssh
slug: troubleshooting
order: 7
---

## Mode debug {#debug}

L'option `-v` augmente la verbosité de SSH. Utilisez `-vvv` pour le maximum de détail :

```bash
ssh -vvv user@192.168.1.10
```

```
OpenSSH_9.6p1, OpenSSL 3.0.13
debug1: Reading configuration data /home/user/.ssh/config
debug1: /home/user/.ssh/config line 5: Applying options for prod
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: Connecting to 192.168.1.10 [192.168.1.10] port 22.
debug1: Connection established.
debug1: identity file /home/user/.ssh/id_ed25519_prod type 3
debug1: Authenticating to 192.168.1.10:22 as 'deployer'
debug1: Offering public key: /home/user/.ssh/id_ed25519_prod ED25519
debug1: Server accepts key: /home/user/.ssh/id_ed25519_prod ED25519
Authenticated to 192.168.1.10 ([192.168.1.10]:22) using "publickey".
```

Lignes clés à surveiller :

| Ligne                           | Signification                                |
| ------------------------------- | -------------------------------------------- |
| `Reading configuration data`    | Fichiers de config lus et options appliquées |
| `Connecting to ... port 22`     | Tentative de connexion TCP                   |
| `Connection established`        | Connexion TCP réussie                        |
| `identity file ... type 3`      | Clé privée trouvée et chargée                |
| `Offering public key`           | Clé proposée au serveur                      |
| `Server accepts key`            | Le serveur accepte la clé                    |
| `Authenticated ... "publickey"` | Authentification réussie par clé             |

## Erreurs courantes et solutions {#errors}

### Permission denied (publickey) {#permission-denied}

```
user@192.168.1.10: Permission denied (publickey).
```

**Causes possibles :**

1. **Clé non déployée** — La clé publique n'est pas dans `~/.ssh/authorized_keys` sur le serveur

```bash
# Déployer la clé
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.10
```

2. **Mauvaises permissions** — SSH refuse les clés si les permissions sont trop ouvertes

```bash
# Sur le serveur
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# En local
chmod 600 ~/.ssh/id_ed25519
```

3. **Mauvaise clé utilisée** — SSH essaie toutes les clés de l'agent, pas forcément la bonne

```bash
# Spécifier la clé explicitement
ssh -i ~/.ssh/id_ed25519_prod user@192.168.1.10

# Ou dans ~/.ssh/config
# IdentityFile ~/.ssh/id_ed25519_prod
# IdentitiesOnly yes
```

4. **Agent SSH non actif** — La clé n'est pas chargée

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Connection refused {#connection-refused}

```
ssh: connect to host 192.168.1.10 port 22: Connection refused
```

**Causes possibles :**

- **sshd n'est pas démarré** sur le serveur

```bash
# Sur le serveur
sudo systemctl status ssh
sudo systemctl start ssh
```

- **Mauvais port** — sshd écoute sur un port différent

```bash
# Vérifier le port d'écoute sur le serveur
sudo ss -tlnp | grep sshd

# Se connecter sur le bon port
ssh -p 2222 user@192.168.1.10
```

- **Pare-feu bloque le port** — Vérifier les règles

```bash
# Sur le serveur
sudo ufw status
sudo firewall-cmd --list-all
```

### Connection timed out {#connection-timed}

```
ssh: connect to host 192.168.1.10 port 22: Connection timed out
```

**Causes possibles :**

- Machine distante éteinte ou inaccessible
- Mauvaise adresse IP
- Routage réseau incorrect
- Pare-feu DROP (pas REJECT) — le paquet est silencieusement ignoré

```bash
# Tester la connectivité réseau
ping 192.168.1.10

# Tester si le port est ouvert
nc -zv 192.168.1.10 22
```

### Host key verification failed {#host-key-changed}

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
...
Host key verification failed.
```

Ce message apparaît quand l'empreinte du serveur a changé depuis la dernière connexion. Cela arrive après une réinstallation du serveur, un changement d'IP, ou (rarement) une attaque MITM.

```bash
# Supprimer l'ancienne empreinte
ssh-keygen -R 192.168.1.10

# Se reconnecter — une nouvelle empreinte sera proposée
ssh user@192.168.1.10
```

> **Conseil sécurité :** Avant de supprimer l'ancienne empreinte, vérifiez auprès de l'administrateur que le serveur a bien été réinstallé ou modifié. Si le changement est inattendu, il peut s'agir d'une attaque man-in-the-middle.

### Too many authentication failures {#too-many-auth}

```
Received disconnect from 192.168.1.10 port 22:2: Too many authentication failures
```

SSH essaie toutes les clés de l'agent avant la bonne. Si le serveur a un `MaxAuthTries` bas, la limite est atteinte.

```bash
# Solution 1 : Spécifier la clé et désactiver l'agent
ssh -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519_prod user@192.168.1.10

# Solution 2 : Configurer dans ~/.ssh/config
# Host prod
#     IdentityFile ~/.ssh/id_ed25519_prod
#     IdentitiesOnly yes
```

### Broken pipe / Write failed {#broken-pipe}

```
client_loop: send disconnect: Broken pipe
```

La connexion a été interrompue par inactivité. Le serveur a fermé la session.

```bash
# Solution : ajouter des keepalives dans ~/.ssh/config
# Host *
#     ServerAliveInterval 60
#     ServerAliveCountMax 3
```

Cela envoie un signal toutes les 60 secondes. Après 3 signaux sans réponse (180s), SSH ferme proprement la connexion.

## Permissions requises {#permissions}

SSH vérifie strictement les permissions. Des permissions trop ouvertes entraînent un refus silencieux.

| Fichier/Dossier                 | Permission | Commande                           |
| ------------------------------- | ---------- | ---------------------------------- |
| `~/.ssh/`                       | `700`      | `chmod 700 ~/.ssh`                 |
| `~/.ssh/authorized_keys`        | `600`      | `chmod 600 ~/.ssh/authorized_keys` |
| `~/.ssh/config`                 | `600`      | `chmod 600 ~/.ssh/config`          |
| Clé privée (`id_ed25519`)       | `600`      | `chmod 600 ~/.ssh/id_ed25519`      |
| Clé publique (`id_ed25519.pub`) | `644`      | `chmod 644 ~/.ssh/id_ed25519.pub`  |
| `~/.ssh/known_hosts`            | `644`      | `chmod 644 ~/.ssh/known_hosts`     |
| Dossier home de l'utilisateur   | `755` max  | `chmod 755 ~`                      |

```bash
# Corriger toutes les permissions d'un coup
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_* ~/.ssh/authorized_keys ~/.ssh/config 2>/dev/null
chmod 644 ~/.ssh/*.pub ~/.ssh/known_hosts 2>/dev/null
```

## Vérifier la configuration sshd {#sshd-test}

```bash
# Tester la syntaxe du fichier de configuration
sudo sshd -t
```

Si aucune erreur n'est affichée, la configuration est valide.

```bash
# Afficher la configuration effective (avec toutes les valeurs par défaut)
sudo sshd -T
```

```bash
# Afficher la configuration effective pour un utilisateur spécifique
sudo sshd -T -C user=deployer,host=192.168.1.100,addr=192.168.1.100
```

## Logs serveur {#logs}

```bash
# Journald (systemd)
sudo journalctl -u ssh --since "1 hour ago"

# Fichier de log (Debian/Ubuntu)
sudo tail -50 /var/log/auth.log

# Fichier de log (RHEL/Fedora)
sudo tail -50 /var/log/secure
```

### Filtres utiles

```bash
# Connexions réussies
sudo grep "Accepted" /var/log/auth.log

# Connexions échouées
sudo grep "Failed" /var/log/auth.log

# Sessions fermées
sudo grep "Disconnected" /var/log/auth.log
```

Pour un diagnostic plus poussé des erreurs SSH liées à rsync, consultez le [guide de dépannage rsync](/help/rsync/troubleshooting).

## Pour aller plus loin {#next}

- [Sécurité](/help/ssh/security) — durcir la configuration pour réduire les problèmes
- [Fichier de configuration](/help/ssh/config) — centraliser les options et éviter les erreurs de saisie
- [Gestion des clés](/help/ssh/keys) — bien gérer ses clés pour éviter les problèmes d'authentification