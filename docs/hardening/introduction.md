---
title: Introduction au hardening
description: Fondamentaux du durcissement système Linux, surface d'attaque, défense en profondeur et principe du moindre privilège.
category: hardening
slug: introduction
order: 1
---

## Qu'est-ce que le hardening ? {#intro}

Le **hardening** (durcissement) consiste à réduire la surface d'attaque d'un système en supprimant tout ce qui n'est pas strictement nécessaire à son fonctionnement. L'objectif est simple : moins un système expose de services, de ports et de permissions, moins il offre de points d'entrée à un attaquant.

Un serveur Linux fraîchement installé est rarement sécurisé par défaut. Il embarque des services inutiles, des configurations permissives et des comptes avec des privilèges excessifs. Le hardening corrige ça.

### La surface d'attaque {#attack-surface}

La surface d'attaque, c'est l'ensemble des points par lesquels un attaquant peut interagir avec ton système :

```
                                          Surface d'attaque
                                                  │
       ┌──────────────────┬───────────────────────┼───────────────────────┬──────────────────┐
       │                  │                       │                       │                  │
     Ports             Services              Utilisateurs             Logiciels          Fichiers
    ouverts             actifs              et permissions            installés          exposés
       │                  │                       │                       │                  │
  22, 80, 443,       Apache, cron,         root actif, sudo        gcc, wget, curl,    passwd, shadow
  3306, 8080...    cups, postfix...     permissif, SUID mal géré    netcat, nmap...   clés SSH, history
                                             umask 000...
```

Chaque élément est un vecteur d'attaque potentiel. Le hardening consiste à réduire chaque branche de cet arbre au strict minimum.

## Pourquoi durcir un système ? {#why}

| Risque                      | Conséquence sans hardening                                          |
| --------------------------- | ------------------------------------------------------------------- |
| Service inutile exposé      | Vulnérabilité exploitable à distance (RCE)                          |
| Mots de passe SSH autorisés | Attaque par brute-force sur le port 22                              |
| Root accessible en SSH      | Compromission totale en une seule étape                             |
| Pas de pare-feu             | Tous les ports ouverts, services internes accessibles               |
| Logiciels non mis à jour    | Exploitation de CVE connues et documentées                          |
| Permissions trop larges     | Escalade de privilèges via un fichier SUID ou un cron mal configuré |

## Défense en profondeur {#defense-in-depth}

Le hardening ne repose jamais sur une seule mesure. Le principe de **défense en profondeur** consiste à empiler plusieurs couches de sécurité indépendantes :

```
┌─────────────────────────────────────────────────┐
│             Pare-feu (UFW/iptables)             <───  Couche réseau
│   ┌─────────────────────────────────────────┐   │
│   │       SSH durci (clés, Fail2Ban)        <───────  Couche accès
│   │   ┌─────────────────────────────────┐   │   │
│   │   │   Permissions et utilisateurs   <───────────  Couche système
│   │   │   ┌─────────────────────────┐   │   │   │
│   │   │   │    AppArmor / SELinux   <───────────────  Couche application
│   │   │   │   ┌─────────────────┐   │   │   │   │
│   │   │   │   │  Audit et logs  <───────────────────  Couche surveillance
│   │   │   │   └─────────────────┘   │   │   │   │
│   │   │   └─────────────────────────┘   │   │   │
│   │   └─────────────────────────────────┘   │   │
│   └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

Si une couche est contournée, la suivante prend le relais. Un attaquant qui passe le pare-feu doit encore affronter SSH, puis les permissions, puis les contrôles d'accès, etc.

## Principe du moindre privilège {#least-privilege}

Chaque utilisateur, processus et service ne doit disposer que des **permissions minimales** nécessaires à son fonctionnement :

- Un serveur web n'a pas besoin d'accès root
- Un script de backup n'a pas besoin d'un shell interactif
- Un développeur n'a pas besoin de `sudo` sur un serveur de production

> **Règle d'or :** Ne jamais donner plus de droits que nécessaire. Si un service peut fonctionner sans root, il **doit** fonctionner sans root.

## Par défaut vs durci {#comparison}

| Aspect               | Installation par défaut      | Système durci                         |
| -------------------- | ---------------------------- | ------------------------------------- |
| Accès SSH            | Mot de passe autorisé        | Clés uniquement, root désactivé       |
| Pare-feu             | Aucun ou permissif           | UFW activé, politique deny par défaut |
| Services             | Nombreux activés par défaut  | Seuls les services nécessaires actifs |
| Mises à jour         | Manuelles, irrégulières      | Automatiques pour les patchs sécurité |
| Utilisateurs         | Compte root utilisable       | Comptes dédiés, sudo restreint        |
| Monitoring           | Aucun                        | Fail2Ban, logs centralisés, audit     |
| Permissions fichiers | Défaut système (souvent 755) | Ajustées au minimum nécessaire        |
| Noyau                | Configuration par défaut     | Paramètres sysctl durcis              |

## CIS Benchmarks {#cis}

Les **CIS Benchmarks** (Center for Internet Security) sont des guides de durcissement reconnus par l'industrie. Ils fournissent des recommandations précises pour chaque distribution Linux (Ubuntu, Debian, RHEL, etc.) avec deux niveaux :

- **Level 1** — Mesures essentielles, faible impact sur la fonctionnalité
- **Level 2** — Mesures renforcées, peuvent limiter certaines fonctionnalités

Ces benchmarks sont une excellente base pour construire une politique de hardening. Ils sont disponibles gratuitement sur [cisecurity.org](https://www.cisecurity.org/cis-benchmarks).

## L'approche mentale {#mindset}

La question n'est pas "qu'est-ce que je peux ajouter pour sécuriser mon système ?" mais plutôt :

> **"Qu'est-ce que je peux désactiver, supprimer ou restreindre ?"**

Un système durci commence par tout bloquer, puis ouvre uniquement ce qui est nécessaire. C'est l'inverse de l'approche par défaut qui laisse tout ouvert et essaie de bloquer les menaces connues.

```bash
# Check what is currently running
systemctl list-units --type=service --state=running

# Check what is listening on the network
ss -tlnp

# Check who has sudo access
getent group sudo
```

Pour chaque service actif, pose-toi la question : "est-ce que j'en ai besoin ?" Si la réponse est non, désactive-le.

## Ce que couvre cette documentation {#overview}

Cette série de guides couvre le durcissement pas à pas :

1. **Utilisateurs et permissions** — Gestion des comptes, sudo, droits fichiers → [voir le guide](/help/hardening/users)
2. **Sécuriser SSH** — Checklist rapide et audit des algorithmes → [voir le guide](/help/hardening/ssh)
3. **Pare-feu Linux** — UFW, iptables, filtrage réseau → [voir le guide](/help/hardening/firewall)
4. **Services et processus** — Auditer et désactiver l'inutile → [voir le guide](/help/hardening/services)
5. **Mises à jour et audit** — Patchs automatiques, Lynis, CVE → [voir le guide](/help/hardening/updates)
6. **Sécurité avancée** — AppArmor, noyau, monitoring → [voir le guide](/help/hardening/advanced)

## Pour aller plus loin {#next}

- [Utilisateurs et permissions](/help/hardening/users) — premier pas du durcissement : contrôler qui a accès à quoi
- [Sécuriser SSH](/help/ssh/security) — la documentation complète sur la sécurisation SSH
- [Introduction à la cryptographie](/help/cryptography/introduction) — comprendre les mécanismes de chiffrement sous-jacents