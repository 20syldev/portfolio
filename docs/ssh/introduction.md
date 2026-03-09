---
title: Introduction à SSH
description: Présentation du protocole SSH, cas d'usage, architecture client-serveur et première connexion commentée.
category: ssh
slug: introduction
order: 1
---

## Qu'est-ce que SSH ? {#intro}

**SSH** (Secure Shell) est un protocole réseau cryptographique qui permet de se connecter à une machine distante de manière sécurisée. Il remplace les anciens protocoles non chiffrés comme Telnet et rlogin, utilisés avant les années 2000.

**OpenSSH** est l'implémentation standard, préinstallée sur la quasi-totalité des distributions Linux et macOS. Sous Windows, elle est disponible via WSL ou le client OpenSSH intégré depuis Windows 10.

### Fonctionnalités clés

- **Connexion chiffrée** — Toutes les communications transitent dans un tunnel chiffré (AES, ChaCha20), protégeant contre l'écoute réseau.
- **Authentification par clé** — Connexion sans mot de passe grâce à une paire de clés publique/privée, plus sécurisée et automatisable.
- **Transfert de fichiers** — SCP et SFTP permettent de copier des fichiers entre machines via SSH.
- **Tunnels et port forwarding** — Rediriger des ports distants ou locaux à travers un tunnel chiffré pour accéder à des services autrement inaccessibles.
- **Agent forwarding** — Transmettre son identité SSH à travers plusieurs serveurs sans copier sa clé privée.

### Pourquoi SSH ?

| Critère            | SSH                         | Telnet                | FTP                     |
| ------------------ | --------------------------- | --------------------- | ----------------------- |
| Chiffrement        | Oui (AES, ChaCha20)         | Non                   | Non (sauf FTPS)         |
| Authentification   | Clé publique / mot de passe | Mot de passe en clair | Mot de passe en clair   |
| Port par défaut    | 22                          | 23                    | 21                      |
| Transfert fichiers | SCP, SFTP                   | Non                   | Oui                     |
| Tunneling          | Oui                         | Non                   | Non                     |
| Usage moderne      | Standard partout            | Obsolète              | Remplacé par SFTP/rsync |

## Architecture client-serveur {#architecture}

SSH fonctionne en mode client-serveur :

1. Le **serveur** (`sshd`) écoute sur le port 22 et attend les connexions entrantes
2. Le **client** (`ssh`) initie la connexion et s'authentifie
3. Une fois authentifié, le client obtient un shell distant ou exécute une commande

```
┌──────────┐                            ┌───────────┐
│  Client  │  ────  TCP port 22  ────>  │  Serveur  │
│  (ssh)   │                            │  (sshd)   │
│          │  1. Échange de clés        │           │
│          │  2. Authentification       │           │
│          │  3. Session chiffrée       │           │
│          │                            │           │
│          │  <───────────────────────  │           │
└──────────┘                            └───────────┘
```

L'échange de clés initial (Diffie-Hellman) établit un secret partagé sans jamais le transmettre sur le réseau. Ensuite, toute la session est chiffrée symétriquement.

## Votre première connexion SSH {#example}

```bash
ssh user@192.168.1.10
```

```
The authenticity of host '192.168.1.10 (192.168.1.10)' can't be established.
ED25519 key fingerprint is SHA256:xR8wFv3J5K2pG...dN7mQ.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.1.10' (ED25519) to the list of known hosts.
user@192.168.1.10's password:
Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-45-generic x86_64)

user@serveur:~$
```

- `The authenticity of host...` — Lors de la première connexion, SSH affiche l'empreinte du serveur. Vérifiez-la auprès de l'administrateur pour vous assurer que vous vous connectez au bon serveur (protection contre les attaques MITM).
- `Permanently added...` — L'empreinte est stockée dans `~/.ssh/known_hosts` pour les connexions futures.
- `user@serveur:~$` — Vous êtes connecté au serveur distant avec un shell interactif.

> **Note :** Lors des connexions suivantes, SSH vérifie automatiquement l'empreinte stockée. Si elle change (réinstallation du serveur, attaque MITM), SSH refuse la connexion et affiche un avertissement.

## Cas d'usage courants {#usecases}

- **Administration système** — Gérer des serveurs distants (Linux, routeurs, NAS)
- **Déploiement** — Pousser du code vers un serveur de production
- **Transfert sécurisé** — Copier des fichiers via SCP, SFTP ou [rsync over SSH](/help/rsync/remote)
- **Git** — Cloner et pousser des dépôts via le [protocole SSH](/help/git/workflow)
- **Gestion centralisée** — Stocker et organiser ses connexions SSH avec [mn](/help/linux/mn) (`mn conn`)

## Pour aller plus loin {#next}

- [Installation](/help/ssh/installation) — installer et configurer le client et le serveur OpenSSH
- [Gestion des clés](/help/ssh/keys) — générer des clés, agent SSH, multi-clés
- [Utilisation courante](/help/ssh/usage) — connexions, SCP, tunnels, SSHFS