---
title: Introduction à la cryptographie
description: Fondamentaux de la cryptographie, histoire condensée, rôle dans la sécurité moderne et vue d'ensemble des concepts clés.
category: cryptography
slug: introduction
order: 1
---

## Qu'est-ce que la cryptographie ? {#intro}

La **cryptographie** (du grec _kryptós_ "caché" et _graphein_ "écrire") est la science qui protège l'information en la rendant illisible pour quiconque n'est pas autorisé à la lire. Elle est au cœur de la sécurité informatique moderne.

Chaque fois que tu te connectes à un site web, que tu envoies un message sur Signal, que tu signes un commit Git ou que tu te connectes en SSH à un serveur, la cryptographie est à l'œuvre.

### Les quatre piliers {#pillars}

La cryptographie garantit quatre propriétés fondamentales :

| Pilier               | Description                                           | Exemple concret                    |
| -------------------- | ----------------------------------------------------- | ---------------------------------- |
| **Confidentialité**  | Seul le destinataire autorisé peut lire le message    | Chiffrement d'un email avec GPG    |
| **Intégrité**        | Le message n'a pas été modifié en transit             | Vérification d'un checksum SHA-256 |
| **Authentification** | L'expéditeur est bien celui qu'il prétend être        | Signature GPG sur un commit Git    |
| **Non-répudiation**  | L'expéditeur ne peut pas nier avoir envoyé le message | Signature numérique d'un contrat   |

> **Note** : Tous les systèmes cryptographiques ne garantissent pas les quatre piliers. Le chiffrement assure la confidentialité, la signature assure l'authentification et la non-répudiation, le hachage assure l'intégrité.

## Bref historique {#history}

| Époque       | Avancée                             | Principe                                                  |
| ------------ | ----------------------------------- | --------------------------------------------------------- |
| ~50 av. J.-C | Chiffre de César                    | Décalage alphabétique (substitution simple)               |
| 1467         | Chiffre de Vigenère                 | Substitution polyalphabétique avec mot-clé                |
| 1918         | Machine Enigma                      | Chiffrement mécanique à rotors, cassé par Alan Turing     |
| 1976         | Diffie-Hellman                      | Premier échange de clés sans canal sécurisé préalable     |
| 1977         | RSA                                 | Premier algorithme à clé publique pratique                |
| 2001         | AES                                 | Standard de chiffrement symétrique moderne (remplace DES) |
| 2005         | Courbes elliptiques (ed25519)       | Clés plus courtes, plus rapides, aussi sûres que RSA      |
| 2024         | Cryptographie post-quantique (NIST) | Nouveaux standards résistants aux ordinateurs quantiques  |

La révolution majeure est arrivée en **1976** avec Diffie et Hellman : l'idée qu'on peut communiquer en sécurité **sans jamais partager de secret au préalable**. C'est la naissance de la cryptographie asymétrique, ou cryptographie à clé publique.

## Types de cryptographie {#types}

La cryptographie moderne repose sur trois familles complémentaires :

```
                                   Cryptographie
                                         │
            ┌────────────────────────────┼────────────────────────────┐
            │                            │                            │
        Symétrique                  Asymétrique                    Hachage
            │                            │                            │
    Une seule clé pour              Clé publique                  Pas de clé
  chiffrer et déchiffrer            + clé privée                 (sens unique)
            │                            │                            │
       AES, ChaCha                  RSA, ed25519               SHA-256, BLAKE3
```

| Type            | Principe                                        | Vitesse     | Usage principal                       |
| --------------- | ----------------------------------------------- | ----------- | ------------------------------------- |
| **Symétrique**  | Une clé unique, partagée entre les deux parties | Très rapide | Chiffrement de données volumineuses   |
| **Asymétrique** | Paire clé publique / clé privée                 | Lent        | Échange de clés, signatures, identité |
| **Hachage**     | Fonction à sens unique, pas de déchiffrement    | Rapide      | Intégrité, mots de passe, checksums   |

> **En pratique** : Les systèmes modernes combinent les trois. Par exemple, HTTPS utilise l'asymétrique pour l'échange de clés, le symétrique pour chiffrer les données, et le hachage pour vérifier l'intégrité.

## La cryptographie au quotidien {#daily}

Tu utilises la cryptographie sans le savoir, des dizaines de fois par jour :

- **HTTPS** — Chaque visite d'un site en `https://` utilise TLS : échange de clés asymétrique, puis chiffrement symétrique.
- **SSH** — Se connecter à un serveur distant utilise une paire de clés publique/privée pour l'authentification.
- **GPG** — Signer ses commits Git pour prouver l'authenticité du code avec une [signature GPG](/help/gpg/signing).
- **Messagerie chiffrée** — Signal, WhatsApp (protocole Signal) chiffrent chaque message de bout en bout.
- **Chiffrement de disque** — LUKS (Linux), FileVault (macOS), BitLocker (Windows) protègent les données au repos.
- **Gestionnaires de mots de passe** — Bitwarden, KeePass chiffrent ta base avec AES-256.
- **Wi-Fi** — WPA3 utilise le chiffrement pour protéger les communications sans fil.

## Pour aller plus loin {#next}

- [Chiffrement symétrique](/help/cryptography/symmetric) — une clé pour tout, le fondement du chiffrement rapide
- [Chiffrement asymétrique](/help/cryptography/asymmetric) — clé publique et clé privée, le cœur de cette documentation
- [Fonctions de hachage](/help/cryptography/hashing) — vérifier l'intégrité sans chiffrer