---
title: Chiffrement symétrique
description: Principe du chiffrement symétrique, algorithmes AES et ChaCha20, modes d'opération et cas d'usage concrets.
category: cryptography
slug: symmetric
order: 2
---

## Principe du chiffrement symétrique {#intro}

Le chiffrement symétrique est le type de cryptographie le plus ancien et le plus intuitif : **une seule clé** sert à la fois à chiffrer et à déchiffrer les données.

```
      ALICE                                                 BOB
      ─────                                                 ───

  ┌───────────┐         Clé secrète partagée           ┌───────────┐
  │  Message  │  ──────      🔑 même clé     ───────>  │  Message  │
  │  en clair │          = message chiffré             │  chiffré  │
  └───────────┘                                        └─────┬─────┘
                                                             │
                                                         🔑 même clé
                                                             │
                                                       ┌─────┴─────┐
                                                       │  Message  │
                                                       │  en clair │
                                                       └───────────┘
```

C'est comme un coffre-fort avec une seule clé : celui qui verrouille et celui qui déverrouille utilisent la même clé. Simple, rapide, efficace — mais il faut trouver un moyen sûr de partager cette clé.

## Algorithmes principaux {#algorithms}

| Algorithme   | Type            | Taille de clé | Statut     | Usage                             |
| ------------ | --------------- | ------------- | ---------- | --------------------------------- |
| **AES-128**  | Bloc (128 bits) | 128 bits      | Recommandé | Standard universel                |
| **AES-256**  | Bloc (128 bits) | 256 bits      | Recommandé | Données sensibles, post-quantique |
| **ChaCha20** | Flux            | 256 bits      | Recommandé | Mobile, TLS 1.3, WireGuard        |
| **3DES**     | Bloc (64 bits)  | 168 bits      | Déprécié   | Systèmes legacy uniquement        |
| **Blowfish** | Bloc (64 bits)  | 32-448 bits   | Obsolète   | Remplacé par AES                  |
| **DES**      | Bloc (64 bits)  | 56 bits       | Cassé      | Ne plus utiliser                  |

### AES (Advanced Encryption Standard) {#aes}

AES est **le** standard de chiffrement symétrique depuis 2001, adopté par le NIST après un concours international. Il est utilisé partout : HTTPS, SSH, VPN, chiffrement de disque, gestionnaires de mots de passe.

- **Chiffrement par bloc** : traite les données par blocs de 128 bits
- **Trois tailles de clé** : 128, 192 ou 256 bits
- **Accélération matérielle** : la plupart des processeurs modernes ont des instructions AES-NI dédiées

```bash
# Encrypt a file with AES-256
gpg --symmetric --cipher-algo AES256 fichier.txt

# OpenSSL equivalent
openssl enc -aes-256-cbc -salt -in fichier.txt -out fichier.enc
```

### ChaCha20 {#chacha20}

ChaCha20 est un **chiffrement par flux** conçu par Daniel J. Bernstein. Combiné avec Poly1305 (authentification), il forme **ChaCha20-Poly1305**, utilisé par :

- **TLS 1.3** — Alternative à AES-GCM, particulièrement sur mobile
- **WireGuard** — VPN moderne qui l'utilise exclusivement
- **SSH** — `chacha20-poly1305@openssh.com` est un des chiffrements les plus utilisés

Son avantage : il est très rapide sur les appareils **sans** accélération matérielle AES (smartphones, appareils embarqués).

## Modes d'opération {#modes}

Un algorithme de bloc comme AES chiffre un bloc à la fois (128 bits = 16 octets). Pour chiffrer des données plus longues, on utilise un **mode d'opération** qui définit comment enchaîner les blocs.

| Mode    | Nom complet           | Sécurité  | Authentifié | Usage recommandé            |
| ------- | --------------------- | --------- | ----------- | --------------------------- |
| **ECB** | Electronic Codebook   | Dangereux | Non         | Jamais                      |
| **CBC** | Cipher Block Chaining | Correct   | Non         | Legacy, avec HMAC           |
| **CTR** | Counter               | Bon       | Non         | Avec HMAC séparé            |
| **GCM** | Galois/Counter Mode   | Excellent | Oui         | Standard moderne (TLS, SSH) |

### Pourquoi ECB est dangereux {#ecb}

En mode ECB, chaque bloc est chiffré indépendamment. Deux blocs identiques en clair produisent deux blocs chiffrés identiques, ce qui révèle des motifs dans les données :

```
   Mode ECB (dangereux)             Mode CBC/GCM (sûr)
   ────────────────────             ──────────────────

   Bloc A ──> Chiffré X             Bloc A ──> Chiffré X
   Bloc B ──> Chiffré Y             Bloc B ──> Chiffré Z  (différent !)
   Bloc A ──> Chiffré X  (même !)   Bloc A ──> Chiffré W  (différent !)
   Bloc C ──> Chiffré Z             Bloc C ──> Chiffré V

   Les motifs sont visibles         Aucun motif visible
```

> **Règle d'or** : Utilise toujours **AES-GCM** ou **ChaCha20-Poly1305**. Ils assurent à la fois le chiffrement et l'authentification (AEAD — Authenticated Encryption with Associated Data).

## Le problème de l'échange de clés {#key-exchange}

Le chiffrement symétrique a un problème fondamental : **comment partager la clé secrète en toute sécurité ?**

```
        Alice                                                Bob
        ─────                                                ───

   "J'ai un secret à te dire"
   "Mais d'abord, il faut qu'on partage une clé..."

   ┌─────────────┐              Internet               ┌─────────────┐
   │ Clé secrète │  ────────  canal non sûr  ───────>  │     ???     │
   └─────────────┘           (espionnable !)           └─────────────┘

   Si Eve intercepte la clé, elle peut tout déchiffrer.
```

Trois solutions existent :

1. **Échange physique** — Se rencontrer en personne (pas pratique sur Internet)
2. **Diffie-Hellman** — Un protocole mathématique qui permet à deux parties de créer un secret partagé sur un canal non sécurisé, sans jamais transmettre le secret lui-même
3. **Cryptographie asymétrique** — Utiliser une paire clé publique/privée pour chiffrer et transmettre la clé symétrique

C'est cette limitation qui a motivé l'invention de la [cryptographie asymétrique](/help/cryptography/asymmetric) en 1976.

> **En pratique** : Les protocoles modernes (TLS, SSH) utilisent l'asymétrique uniquement pour échanger une clé symétrique, puis chiffrent toutes les données avec cette clé symétrique — c'est le meilleur des deux mondes.

## Cas d'usage {#usecases}

- **Chiffrement de disque** — LUKS (Linux), FileVault (macOS) et BitLocker (Windows) utilisent AES-256 pour protéger le disque entier.
- **VPN** — WireGuard utilise ChaCha20-Poly1305, OpenVPN utilise AES-256-GCM.
- **HTTPS** — Après le handshake TLS (asymétrique), toutes les données sont chiffrées en AES-GCM ou ChaCha20-Poly1305.
- **SSH** — Les sessions SSH chiffrent les données avec `chacha20-poly1305` ou `aes256-gcm`.
- **Chiffrement de fichiers** — `gpg --symmetric` utilise AES-256 pour chiffrer un fichier avec une passphrase (voir [GPG avancé](/help/gpg/advanced)).
- **Bases de données** — Le chiffrement au repos (encryption at rest) protège les données stockées.

## Pour aller plus loin {#next}

- [Chiffrement asymétrique](/help/cryptography/asymmetric) — résoudre le problème de l'échange de clés avec une paire de clés
- [Fonctions de hachage](/help/cryptography/hashing) — vérifier l'intégrité des données
- [GPG avancé](/help/gpg/advanced) — chiffrement symétrique avec GPG en pratique