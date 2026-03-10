---
title: Sécuriser SSH
description: Checklist de durcissement SSH, audit des algorithmes avec ssh-audit et suppression des chiffrements faibles.
category: hardening
slug: ssh
order: 3
---

## Checklist rapide {#checklist}

La documentation SSH complète couvre en détail chaque mesure de sécurisation. Voici un résumé avec les liens vers les sections correspondantes :

| Mesure                             | Priorité  | Documentation détaillée                                             |
| ---------------------------------- | --------- | ------------------------------------------------------------------- |
| Désactiver les mots de passe       | Critique  | [Désactiver les mots de passe](/help/ssh/security#disable-password) |
| Désactiver le login root           | Critique  | [Désactiver root](/help/ssh/security#disable-root)                  |
| Limiter les utilisateurs autorisés | Haute     | [AllowUsers/AllowGroups](/help/ssh/security#allowusers)             |
| Installer Fail2Ban                 | Haute     | [Configuration Fail2Ban](/help/ssh/security#fail2ban)               |
| Changer le port SSH                | Moyenne   | [Changer le port](/help/ssh/security#port)                          |
| Utiliser des clés ed25519          | Haute     | [Gestion des clés](/help/ssh/keys)                                  |
| Restreindre les clés par commande  | Moyenne   | [Restriction de clé](/help/ssh/security#restrict-key)               |
| Activer le 2FA                     | Optionnel | [Authentification 2FA](/help/ssh/security#2fa)                      |

> **Rappel :** Avant toute modification de `sshd_config`, garde une session SSH ouverte. Teste la syntaxe avec `sudo sshd -t` avant de redémarrer le service.

## Configuration sshd recommandée {#sshd-config}

Voici un récapitulatif des directives essentielles à appliquer dans `/etc/ssh/sshd_config` :

```bash
# --- Authentication ---
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM no
MaxAuthTries 3
PubkeyAuthentication yes

# --- Access control ---
AllowGroups ssh-users
LoginGraceTime 30

# --- Session ---
ClientAliveInterval 300
ClientAliveCountMax 2
MaxSessions 3

# --- Security ---
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
PermitTunnel no
```

```bash
# Validate syntax and restart
sudo sshd -t && sudo systemctl restart ssh
```

| Directive             | Valeur recommandée | Explication                                             |
| --------------------- | ------------------ | ------------------------------------------------------- |
| `MaxAuthTries`        | 3                  | Limite les tentatives d'authentification                |
| `LoginGraceTime`      | 30                 | Secondes avant déconnexion si pas authentifié           |
| `ClientAliveInterval` | 300                | Ping toutes les 5 min pour détecter les sessions mortes |
| `ClientAliveCountMax` | 2                  | Déconnecte après 2 pings sans réponse (10 min)          |
| `X11Forwarding`       | no                 | Désactive le forwarding graphique (inutile sur serveur) |
| `AllowTcpForwarding`  | no                 | Empêche l'utilisation du serveur comme proxy            |

## Auditer SSH avec ssh-audit {#ssh-audit}

[ssh-audit](https://github.com/jtesta/ssh-audit) est un outil qui analyse la configuration de ton serveur SSH et identifie les algorithmes faibles, obsolètes ou vulnérables.

### Installation

```bash
# Debian / Ubuntu
sudo apt install ssh-audit

# Via pip (alternative)
pip install ssh-audit

# Docker (no install needed)
docker run --rm -it positronsecurity/ssh-audit target-server
```

### Lancer un audit

```bash
# Audit a remote server
ssh-audit 192.168.1.10

# Audit the local server
ssh-audit localhost

# Audit a server on a custom port
ssh-audit -p 2222 192.168.1.10
```

### Lire les résultats

```
# ssh-audit output example
(gen) banner: SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13
(gen) software: OpenSSH 9.6p1
(gen) compatibility: OpenSSH 8.5+, Dropbear SSH 2020.79+

(kex) curve25519-sha256                     -- [info] available since OpenSSH 7.4
(kex) diffie-hellman-group14-sha256         -- [info] available since OpenSSH 7.0
(kex) diffie-hellman-group1-sha1            -- [fail] removed (weak algorithm)

(key) ssh-ed25519                           -- [info] available since OpenSSH 6.5
(key) ssh-rsa                               -- [fail] using weak hashing algorithm

(mac) hmac-sha2-256-etm@openssh.com         -- [info] available since OpenSSH 6.2
(mac) hmac-sha1                             -- [warn] using weak hashing algorithm
```

| Indicateur | Signification                             | Action                  |
| ---------- | ----------------------------------------- | ----------------------- |
| `[info]`   | Algorithme sûr et supporté                | Rien à faire            |
| `[warn]`   | Algorithme vieillissant mais pas critique | Planifier le retrait    |
| `[fail]`   | Algorithme faible ou vulnérable           | Supprimer immédiatement |

## Supprimer les algorithmes faibles {#weak-algorithms}

Après un audit, il faut retirer les algorithmes marqués `[fail]` ou `[warn]` dans `/etc/ssh/sshd_config`.

### KexAlgorithms (échange de clés)

```bash
# /etc/ssh/sshd_config
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
```

Algorithmes à **supprimer** :

| Algorithme                    | Raison du retrait                       |
| ----------------------------- | --------------------------------------- |
| `diffie-hellman-group1-sha1`  | Clé DH 1024 bits, SHA-1 cassé           |
| `diffie-hellman-group14-sha1` | SHA-1 cassé                             |
| `ecdh-sha2-nistp*`            | Courbes NIST, suspicion de backdoor NSA |

### Ciphers (chiffrement)

```bash
# /etc/ssh/sshd_config
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
```

Algorithmes à **supprimer** :

| Algorithme | Raison du retrait                               |
| ---------- | ----------------------------------------------- |
| `3des-cbc` | Triple DES obsolète, lent et vulnérable         |
| `aes*-cbc` | Mode CBC vulnérable aux attaques padding oracle |
| `arcfour*` | RC4, cassé depuis des années                    |

### MACs (intégrité)

```bash
# /etc/ssh/sshd_config
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,umac-128-etm@openssh.com
```

Algorithmes à **supprimer** :

| Algorithme       | Raison du retrait                       |
| ---------------- | --------------------------------------- |
| `hmac-sha1`      | SHA-1 cassé                             |
| `hmac-md5`       | MD5 cassé depuis longtemps              |
| `umac-64*`       | Tag trop court (64 bits)                |
| `*-etm` manquant | Préférer les variantes Encrypt-then-MAC |

### HostKeyAlgorithms

```bash
# /etc/ssh/sshd_config
HostKeyAlgorithms ssh-ed25519,ssh-ed25519-cert-v01@openssh.com,rsa-sha2-512,rsa-sha2-256
```

> **Important :** Ne supprime pas `rsa-sha2-*` si des clients ne supportent pas encore ed25519. Vérifie la compatibilité avant de restreindre.

## Régénérer les clés hôte {#host-keys}

Si ssh-audit signale des clés hôte faibles (DSA, ECDSA, RSA < 3072 bits) :

```bash
# Remove weak host keys
sudo rm /etc/ssh/ssh_host_dsa_key*
sudo rm /etc/ssh/ssh_host_ecdsa_key*

# Regenerate only ed25519 and RSA 4096
sudo ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N ""
sudo ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N ""

# Restrict which host keys sshd uses
# /etc/ssh/sshd_config
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key
```

```bash
# Restart and verify
sudo sshd -t && sudo systemctl restart ssh
ssh-audit localhost
```

> **Note :** Après la régénération des clés hôte, les clients verront un avertissement "host key has changed". C'est normal — ils devront accepter la nouvelle clé. Préviens les utilisateurs avant de procéder.

## Vérification post-audit {#verify}

Après avoir appliqué les changements, relance ssh-audit pour confirmer :

```bash
# Full audit
ssh-audit 192.168.1.10

# Policy check against a hardening standard
ssh-audit --policy /path/to/policy.txt 192.168.1.10
```

L'objectif est d'obtenir zéro `[fail]` et idéalement zéro `[warn]`.

```bash
# Quick check: list enabled algorithms on the server
sudo sshd -T | grep -E '^(kex|cipher|mac|hostkeyalgorithms)'
```

## Pour aller plus loin {#next}

- [Sécurité SSH complète](/help/ssh/security) — guide détaillé avec Fail2Ban, restrictions de clés et 2FA
- [Gestion des clés SSH](/help/ssh/keys) — génération et déploiement de clés ed25519
- [Pare-feu Linux](/help/hardening/firewall) — filtrer le trafic réseau en amont de SSH