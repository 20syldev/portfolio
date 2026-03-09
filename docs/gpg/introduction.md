---
title: Introduction à GPG
description: Présentation de GPG, concepts de cryptographie asymétrique, cas d'usage et terminologie essentielle.
category: gpg
slug: introduction
order: 1
---

## Qu'est-ce que GPG ? {#intro}

**GnuPG** (GNU Privacy Guard, abrégé **GPG**) est un outil libre de cryptographie qui implémente le standard **OpenPGP** (RFC 4880). Il permet de signer, chiffrer et vérifier des données — du code source aux emails en passant par des fichiers sensibles.

GPG est utilisé quotidiennement par des millions de développeurs pour prouver l'authenticité de leurs commits sur GitHub, signer des paquets logiciels ou chiffrer des communications.

### Cryptographie asymétrique

GPG repose sur la **cryptographie asymétrique** : chaque utilisateur possède une paire de clés liées mathématiquement.

Imagine un cadenas spécial :

- La **clé publique**, c'est le cadenas ouvert que tu distribues à tout le monde. N'importe qui peut l'utiliser pour fermer (chiffrer) un message ou vérifier ta signature.
- La **clé privée**, c'est la seule clé qui ouvre ce cadenas. Tu la gardes secrète sur ta machine.

```
 Toi                                          Destinataire
 ───                                          ────────────
 Clé privée (secrète)                         Ta clé publique (partagée)
     │                                              │
     ├── Signer ──────────────────────────────> Vérifier ✓
     │                                              │
     └── Déchiffrer <──────────────────────── Chiffrer
```

Ce qui est chiffré avec la clé publique ne peut être déchiffré qu'avec la clé privée, et vice-versa. C'est ce principe qui rend la signature et le chiffrement possibles.

### Cas d'usage

- **Signer ses commits Git** — Prouver que c'est bien toi qui as écrit le code. GitHub affiche un badge "Verified" à côté de chaque commit signé.
- **Signer des paquets et releases** — Les gestionnaires de paquets (APT, RPM) utilisent GPG pour vérifier l'intégrité des logiciels.
- **Signer des documents officiels** — Certaines organisations demandent une signature GPG (ex : signer le Ubuntu Code of Conduct avec `gpg --clearsign`).
- **Chiffrer des fichiers** — Protéger des fichiers sensibles (clés API, backups, documents confidentiels).
- **Chiffrer des emails** — Envoyer des messages que seul le destinataire peut lire (avec des clients comme Thunderbird + Enigmail).

### GPG vs SSH

Les deux utilisent la cryptographie asymétrique, mais pour des usages différents :

| Critère                   | GPG                                 | SSH                                   |
| ------------------------- | ----------------------------------- | ------------------------------------- |
| Usage principal           | Signature et chiffrement            | Authentification et tunnels sécurisés |
| Format de clé             | OpenPGP (avec identité, expiration) | Clé brute (pas de métadonnées)        |
| Identité                  | Liée à un nom + email (UID)         | Pas d'identité intégrée               |
| Expiration                | Configurable (recommandé)           | Pas de mécanisme natif                |
| Révocation                | Certificat de révocation dédié      | Supprimer la clé du serveur           |
| Signer des commits        | ✓ Standard et reconnu par GitHub    | ✓ Supporté depuis Git 2.34            |
| Chiffrer des fichiers     | ✓ Natif                             | ✗ Pas conçu pour ça                   |
| Se connecter à un serveur | ✗ Pas conçu pour ça                 | ✓ Standard                            |

> **En résumé** : SSH sert à **se connecter** à des machines distantes. GPG sert à **prouver son identité** et **protéger des données**. Les deux sont complémentaires.

## Terminologie {#terms}

| Terme                 | Définition                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Clé publique**      | La partie de ta clé que tu partages. Sert à vérifier tes signatures et à chiffrer des messages pour toi.             |
| **Clé privée**        | La partie secrète que tu ne partages jamais. Sert à signer et à déchiffrer.                                          |
| **Paire de clés**     | L'ensemble clé publique + clé privée.                                                                                |
| **UID** (User ID)     | L'identité associée à ta clé : nom + email (ex : `Alice <alice@example.com>`).                                       |
| **Fingerprint**       | L'empreinte unique de ta clé, 40 caractères hexadécimaux (ex : `3AA5 C343 B0D2 4DF1 2E89 0C72 6E4F 9B11 A847 5F3D`). |
| **Key ID**            | Les 8 ou 16 derniers caractères du fingerprint, souvent utilisés comme raccourci.                                    |
| **Keyring**           | Le trousseau de clés stocké dans `~/.gnupg/`. Contient tes clés et celles des autres.                                |
| **Sous-clé** (subkey) | Clé secondaire rattachée à ta clé principale. Permet de séparer les usages (signature, chiffrement).                 |
| **Révocation**        | Déclaration publique qu'une clé n'est plus valide (compromise, perdue, remplacée).                                   |
| **Serveur de clés**   | Annuaire public où l'on publie et récupère des clés (ex : `hkps://keyserver.ubuntu.com`).                            |
| **Web of Trust**      | Modèle de confiance décentralisé où les utilisateurs signent les clés des autres pour les valider.                   |

## Comment ça marche ? {#how}

### Signature et vérification

```
   AUTEUR                                    VÉRIFICATEUR
   ──────                                    ────────────

  ┌──────────┐      Signature           ┌──────────┐
  │  Fichier │ ─── + clé privée ──────> │ Fichier  │
  │          │      = signature          │ + signat.│
  └──────────┘                           └────┬─────┘
                                              │
                                    clé publique de l'auteur
                                              │
                                         ✓ Authentique
                                    ou   ✗ Modifié / Faux
```

La signature prouve deux choses :

1. **L'authenticité** — Le fichier vient bien de l'auteur (seul lui possède la clé privée).
2. **L'intégrité** — Le fichier n'a pas été modifié après la signature.

### Chiffrement et déchiffrement

```
   EXPÉDITEUR                                DESTINATAIRE
   ──────────                                ────────────

  ┌──────────┐    Chiffrement           ┌──────────┐
  │ Message  │ ── + clé publique ─────> │ Message  │
  │ en clair │    du destinataire       │ chiffré  │
  └──────────┘                           └────┬─────┘
                                              │
                                    clé privée du destinataire
                                              │
                                        ┌──────────┐
                                        │ Message  │
                                        │ en clair │
                                        └──────────┘
```

Seul le destinataire peut déchiffrer le message, car lui seul possède sa clé privée.

## Pour aller plus loin {#next}

- [Installation](/help/gpg/installation) — installer GPG sur votre OS
- [Génération des clés](/help/gpg/keys) — créer et gérer vos clés GPG
- [Signer ses commits](/help/gpg/signing) — configurer Git pour la signature automatique