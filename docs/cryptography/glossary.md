---
title: Glossaire et ressources
description: Glossaire des termes cryptographiques, tableau récapitulatif des algorithmes et ressources pour approfondir.
category: cryptography
slug: glossary
order: 7
---

## Glossaire {#glossary}

| Terme                              | Définition                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AEAD**                           | Authenticated Encryption with Associated Data — chiffrement qui assure à la fois confidentialité et intégrité (ex : AES-GCM, ChaCha20-Poly1305). |
| **AES**                            | Advanced Encryption Standard — algorithme de chiffrement symétrique par bloc, standard depuis 2001.                                              |
| **Asymétrique (cryptographie)**    | Système à deux clés (publique + privée). Aussi appelé cryptographie à clé publique.                                                              |
| **Autorité de certification (CA)** | Tiers de confiance qui signe des certificats numériques pour lier une clé publique à une identité.                                               |
| **BLAKE3**                         | Fonction de hachage moderne (2020), très rapide et parallélisable.                                                                               |
| **Bloc (chiffrement par)**         | Algorithme qui chiffre les données par blocs de taille fixe (ex : AES = 128 bits).                                                               |
| **Certificat numérique**           | Document électronique (X.509) qui lie une clé publique à une identité, signé par une CA.                                                         |
| **ChaCha20**                       | Algorithme de chiffrement symétrique par flux, alternative à AES. Utilisé par WireGuard et TLS 1.3.                                              |
| **Chiffrement**                    | Transformation réversible des données pour les rendre illisibles sans la clé.                                                                    |
| **Clé privée**                     | Partie secrète d'une paire de clés asymétrique. Sert à signer et à déchiffrer. Ne doit jamais être partagée.                                     |
| **Clé publique**                   | Partie partageable d'une paire de clés asymétrique. Sert à vérifier les signatures et à chiffrer.                                                |
| **Collision**                      | Deux entrées différentes qui produisent le même hash. Signe qu'un algorithme de hachage est cassé.                                               |
| **Courbe elliptique (ECC)**        | Base mathématique de certains algorithmes asymétriques (ed25519, ECDSA, X25519). Offre des clés plus courtes que RSA.                            |
| **CRL**                            | Certificate Revocation List — liste des certificats révoqués publiée par une CA.                                                                 |
| **Déchiffrement**                  | Opération inverse du chiffrement : retrouver le message original à partir du message chiffré et de la clé.                                       |
| **Diffie-Hellman**                 | Protocole d'échange de clés qui permet de créer un secret partagé sur un canal non sécurisé (1976).                                              |
| **Digest**                         | Résultat d'une fonction de hachage. Synonyme de hash ou empreinte.                                                                               |
| **DSA**                            | Digital Signature Algorithm — algorithme de signature déprécié, remplacé par ECDSA et ed25519.                                                   |
| **ECDSA**                          | Elliptic Curve Digital Signature Algorithm — algorithme de signature basé sur les courbes elliptiques.                                           |
| **ed25519**                        | Algorithme de signature sur courbe Edwards 25519. Rapide, sûr, clés de 32 octets. Recommandé pour SSH et GPG.                                    |
| **Empreinte (fingerprint)**        | Hash d'une clé publique, utilisé comme identifiant court (ex : fingerprint GPG de 40 hex).                                                       |
| **Flux (chiffrement par)**         | Algorithme qui chiffre les données bit par bit ou octet par octet (ex : ChaCha20).                                                               |
| **GCM**                            | Galois/Counter Mode — mode d'opération pour chiffrement par bloc avec authentification intégrée.                                                 |
| **GPG (GnuPG)**                    | Implémentation libre du standard OpenPGP. Utilisé pour signer, chiffrer et vérifier des données.                                                 |
| **Hachage**                        | Transformation irréversible des données en empreinte de taille fixe. Pas un chiffrement.                                                         |
| **HMAC**                           | Hash-based Message Authentication Code — code d'authentification utilisant une clé secrète et une fonction de hachage.                           |
| **IV (vecteur d'initialisation)**  | Valeur aléatoire ajoutée au début du chiffrement pour que deux messages identiques produisent des résultats différents.                          |
| **Keyring**                        | Trousseau de clés — ensemble des clés stockées (ex : `~/.gnupg/` pour GPG).                                                                      |
| **Let's Encrypt**                  | Autorité de certification gratuite et automatisée (ISRG). Protocole ACME.                                                                        |
| **MD5**                            | Fonction de hachage cassée (128 bits). Ne plus utiliser pour la sécurité.                                                                        |
| **Nonce**                          | Number used once — valeur aléatoire unique utilisée une seule fois pour éviter les attaques par rejeu.                                           |
| **Non-répudiation**                | Garantie que l'auteur ne peut pas nier avoir signé un message.                                                                                   |
| **OCSP**                           | Online Certificate Status Protocol — vérification en temps réel du statut de révocation d'un certificat.                                         |
| **OpenPGP**                        | Standard ouvert de cryptographie (RFC 4880) implémenté par GPG.                                                                                  |
| **Paire de clés**                  | Ensemble clé publique + clé privée, liées mathématiquement.                                                                                      |
| **PBKDF2**                         | Password-Based Key Derivation Function 2 — dérive une clé de chiffrement à partir d'un mot de passe.                                             |
| **Pinentry**                       | Programme qui affiche le prompt de saisie de passphrase pour GPG.                                                                                |
| **PKI**                            | Public Key Infrastructure — système hiérarchique de certificats et d'autorités de certification.                                                 |
| **Post-quantique**                 | Algorithmes résistants aux attaques par ordinateur quantique (ML-KEM, ML-DSA, standardisés par le NIST en 2024).                                 |
| **Pré-image (résistance)**         | Impossibilité de retrouver l'entrée à partir d'un hash donné.                                                                                    |
| **RSA**                            | Algorithme asymétrique basé sur la factorisation de grands nombres premiers (1977). Clés de 2048-4096 bits.                                      |
| **Salt**                           | Valeur aléatoire ajoutée avant le hachage d'un mot de passe pour contrer les rainbow tables.                                                     |
| **SHA-1**                          | Secure Hash Algorithm (160 bits). Déprécié depuis 2017 (collision trouvée). Encore utilisé par Git.                                              |
| **SHA-256**                        | Secure Hash Algorithm (256 bits). Standard actuel pour les signatures et certificats.                                                            |
| **Signature numérique**            | Preuve cryptographique d'authenticité et d'intégrité : hash du message chiffré avec la clé privée.                                               |
| **Sous-clé (subkey)**              | Clé secondaire rattachée à une clé principale GPG. Permet de séparer les usages (signature, chiffrement).                                        |
| **Symétrique (cryptographie)**     | Système à une seule clé partagée entre les deux parties (ex : AES, ChaCha20).                                                                    |
| **TLS**                            | Transport Layer Security — protocole qui sécurise HTTPS. Combine asymétrique, échange de clés et symétrique.                                     |
| **UID**                            | User ID — identité associée à une clé GPG (nom + email).                                                                                         |
| **Web of Trust**                   | Modèle de confiance décentralisé (GPG) où les utilisateurs signent mutuellement leurs clés.                                                      |
| **X.509**                          | Standard de certificats numériques utilisé par TLS/HTTPS.                                                                                        |
| **X25519**                         | Algorithme d'échange de clés sur Curve25519. Utilisé par TLS 1.3 et WireGuard.                                                                   |

## Récapitulatif des algorithmes {#algorithms}

| Algorithme        | Type           | Taille de clé/sortie | Statut     | Usage principal                       |
| ----------------- | -------------- | -------------------- | ---------- | ------------------------------------- |
| AES-128           | Symétrique     | 128 bits             | Recommandé | Chiffrement standard                  |
| AES-256           | Symétrique     | 256 bits             | Recommandé | Données sensibles                     |
| ChaCha20-Poly1305 | Symétrique     | 256 bits             | Recommandé | TLS, VPN, mobile                      |
| 3DES              | Symétrique     | 168 bits             | Déprécié   | Legacy                                |
| DES               | Symétrique     | 56 bits              | Cassé      | Ne plus utiliser                      |
| RSA               | Asymétrique    | 2048-4096 bits       | Acceptable | TLS, signatures, chiffrement          |
| ECDSA             | Asymétrique    | 256-384 bits         | Recommandé | Signatures, TLS                       |
| ed25519           | Asymétrique    | 256 bits             | Recommandé | SSH, GPG, signatures modernes         |
| X25519            | Asymétrique    | 256 bits             | Recommandé | Échange de clés                       |
| Diffie-Hellman    | Échange        | 2048+ bits           | Acceptable | Échange de clés (préférer ECDH)       |
| MD5               | Hachage        | 128 bits             | Cassé      | Ne plus utiliser                      |
| SHA-1             | Hachage        | 160 bits             | Déprécié   | Legacy (Git)                          |
| SHA-256           | Hachage        | 256 bits             | Recommandé | Standard universel                    |
| SHA-512           | Hachage        | 512 bits             | Recommandé | Haute sécurité                        |
| SHA-3             | Hachage        | 256-512 bits         | Recommandé | Alternative à SHA-2                   |
| BLAKE3            | Hachage        | 256 bits             | Recommandé | Haute performance                     |
| bcrypt            | Hachage MDP    | 184 bits             | Recommandé | Mots de passe                         |
| argon2            | Hachage MDP    | Variable             | Recommandé | Mots de passe (état de l'art)         |
| ML-KEM            | Post-quantique | Variable             | Nouveau    | Échange de clés (résistant quantique) |
| ML-DSA            | Post-quantique | Variable             | Nouveau    | Signatures (résistant quantique)      |

## Guides pratiques {#practice}

Cette documentation couvre la **théorie**. Pour la mise en pratique, consulte les guides dédiés :

### GPG {#gpg-guides}

- [Introduction à GPG](/help/gpg/introduction) — présentation et concepts
- [Installation de GPG](/help/gpg/installation) — installer GPG sur ton système
- [Génération des clés GPG](/help/gpg/keys) — créer ta paire de clés
- [Signer ses commits Git](/help/gpg/signing) — configurer la signature automatique
- [Intégration GitHub](/help/gpg/github) — badge "Verified" sur tes commits
- [GPG avancé](/help/gpg/advanced) — sous-clés, Web of Trust, chiffrement
- [Dépannage GPG](/help/gpg/troubleshooting) — résoudre les erreurs courantes

### SSH {#ssh-guides}

- [Introduction à SSH](/help/ssh/introduction) — présentation du protocole
- [Installation de SSH](/help/ssh/installation) — configurer client et serveur
- [Gestion des clés SSH](/help/ssh/keys) — générer et gérer tes clés
- [Utilisation SSH](/help/ssh/usage) — connexions, SCP, tunnels
- [Configuration SSH](/help/ssh/config) — fichier `~/.ssh/config`
- [Sécurité SSH](/help/ssh/security) — durcir la configuration
- [Dépannage SSH](/help/ssh/troubleshooting) — résoudre les erreurs courantes

## Ressources externes {#resources}

- **Serious Cryptography** — Livre de Jean-Philippe Aumasson, référence accessible sur la cryptographie moderne
- **NIST Cryptographic Standards** — Standards officiels (AES, SHA, post-quantique)
- **Mozilla SSL Configuration Generator** — Générateur de configuration TLS recommandée
- **Let's Encrypt Documentation** — Guide officiel pour les certificats gratuits
- **GnuPG Manual** — Documentation officielle de GPG

## Pour aller plus loin {#next}

- [Introduction à la cryptographie](/help/cryptography/introduction) — retour aux fondamentaux
- [Introduction à GPG](/help/gpg/introduction) — cryptographie asymétrique en pratique
- [Introduction à SSH](/help/ssh/introduction) — connexions sécurisées en pratique