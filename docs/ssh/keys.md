---
title: Gestion des clés SSH
description: Générer des clés ed25519 et RSA, ssh-copy-id, agent SSH, déploiement multi-clés et bonnes pratiques de stockage.
category: ssh
slug: keys
order: 3
---

## Générer une paire de clés {#generate}

```bash
ssh-keygen -t ed25519 -C "user@machine"
```

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/user/.ssh/id_ed25519
Your public key has been saved in /home/user/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:xR8wFv3J5K2pGhN7dQ... user@machine
The key's randomart image is:
+--[ED25519 256]--+
|        .o+*Bo.  |
|       . .oO+=   |
|        o =.*.o  |
|       . + o.=.  |
|        S . o..  |
|         . o.o   |
|          +.o.   |
|         .E=o    |
|          o=+.   |
+----[SHA256]-----+
```

- **Passphrase** — Fortement recommandée. Elle protège la clé privée en cas de vol du fichier. L'[agent SSH](#agent) évite de la retaper à chaque connexion.
- **Fichier** — Par défaut `~/.ssh/id_ed25519`. Utilisez un nom descriptif pour [gérer plusieurs clés](#multi).

### Fallback RSA (systèmes anciens)

Certains serveurs ou équipements réseau ne supportent pas ed25519. Dans ce cas :

```bash
ssh-keygen -t rsa -b 4096 -C "user@machine"
```

### Algorithmes disponibles

| Algorithme | Taille de clé | Sécurité   | Compatibilité | Recommandation            |
| ---------- | ------------- | ---------- | ------------- | ------------------------- |
| ed25519    | 256 bits      | Excellente | Moderne       | Recommandé par défaut     |
| RSA        | 4096 bits     | Très bonne | Universelle   | Fallback si nécessaire    |
| ECDSA      | 256/384 bits  | Bonne      | Bonne         | Éviter (courbes NIST)     |
| DSA        | 1024 bits     | Faible     | Legacy        | Obsolète, ne pas utiliser |

## Déployer la clé publique {#deploy}

### Avec ssh-copy-id (recommandé)

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.10
```

```
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/user/.ssh/id_ed25519.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s)
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
user@192.168.1.10's password:

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'user@192.168.1.10'"
and check to make sure that only the key(s) you wanted were added.
```

### Méthode manuelle

Si `ssh-copy-id` n'est pas disponible :

```bash
cat ~/.ssh/id_ed25519.pub | ssh user@192.168.1.10 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

### Vérifier la connexion par clé

```bash
ssh -i ~/.ssh/id_ed25519 user@192.168.1.10
```

Si la passphrase est demandée (celle de la clé, pas le mot de passe du serveur), la clé est bien déployée.

### Permissions requises

Les permissions doivent être strictes, sinon SSH refuse la clé :

| Fichier/Dossier          | Permission | Commande                           |
| ------------------------ | ---------- | ---------------------------------- |
| `~/.ssh/`                | `700`      | `chmod 700 ~/.ssh`                 |
| `~/.ssh/authorized_keys` | `600`      | `chmod 600 ~/.ssh/authorized_keys` |
| Clé privée               | `600`      | `chmod 600 ~/.ssh/id_ed25519`      |
| Clé publique             | `644`      | `chmod 644 ~/.ssh/id_ed25519.pub`  |
| `~/.ssh/config`          | `600`      | `chmod 600 ~/.ssh/config`          |

## Agent SSH {#agent}

L'agent SSH stocke les clés déchiffrées en mémoire pour éviter de retaper la passphrase à chaque connexion.

```bash
# Démarrer l'agent (si pas déjà lancé)
eval "$(ssh-agent -s)"
```

```
Agent pid 12345
```

```bash
# Ajouter une clé à l'agent
ssh-add ~/.ssh/id_ed25519
```

```
Enter passphrase for /home/user/.ssh/id_ed25519:
Identity added: /home/user/.ssh/id_ed25519 (user@machine)
```

```bash
# Lister les clés chargées
ssh-add -l
```

```
256 SHA256:xR8wFv3J5K2pGhN7dQ... user@machine (ED25519)
```

### Persistence de l'agent

Par défaut, l'agent se ferme avec le terminal. Pour le rendre persistant, ajoutez dans `~/.bashrc` :

```bash
# Start SSH agent if not running
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -s)" > /dev/null
fi
```

> **Note :** Sur les distributions modernes avec un environnement de bureau (GNOME, KDE), un agent SSH est souvent déjà actif via `gnome-keyring` ou `kwallet`.

## Gérer plusieurs clés {#multi}

Pour des serveurs ou services différents, créez des clés dédiées avec des noms explicites :

```bash
# Clé pour GitHub
ssh-keygen -t ed25519 -C "github" -f ~/.ssh/id_ed25519_github

# Clé pour le serveur de production
ssh-keygen -t ed25519 -C "production" -f ~/.ssh/id_ed25519_prod

# Clé pour les backups rsync
ssh-keygen -t ed25519 -C "rsync-backup" -f ~/.ssh/id_rsync
```

Associez chaque clé à son hôte dans [~/.ssh/config](/help/ssh/config) :

```
Host github.com
    IdentityFile ~/.ssh/id_ed25519_github

Host prod
    HostName 192.168.1.10
    User deployer
    IdentityFile ~/.ssh/id_ed25519_prod
```

## Supprimer ou révoquer une clé {#revoke}

### Retirer une clé d'un serveur distant

```bash
# Éditer le fichier authorized_keys sur le serveur
ssh user@192.168.1.10 "nano ~/.ssh/authorized_keys"
```

Supprimez la ligne correspondant à la clé publique à révoquer. Chaque ligne contient le type de clé, la clé, et le commentaire :

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... user@machine
```

### Supprimer une clé locale

```bash
# Retirer de l'agent
ssh-add -d ~/.ssh/id_ed25519

# Supprimer les fichiers
rm ~/.ssh/id_ed25519 ~/.ssh/id_ed25519.pub
```

> **Conseil sécurité :** Ne partagez jamais votre clé privée. Si elle est compromise, révoquez-la immédiatement sur tous les serveurs où elle est déployée et générez une nouvelle paire.

## Pour aller plus loin {#next}

- [Fichier de configuration](/help/ssh/config) — gérer les alias d'hôtes et les clés par serveur
- [Sécurité](/help/ssh/security) — restreindre une clé SSH à une commande spécifique
- [Transferts distants avec rsync](/help/rsync/remote) — utilisation des clés SSH pour rsync