---
title: Signatures numériques
description: Fonctionnement des signatures numériques, processus de signature et vérification, applications concrètes avec GPG et SSH.
category: cryptography
slug: signatures
order: 5
---

## Qu'est-ce qu'une signature numérique ? {#intro}

Une **signature numérique** est l'équivalent électronique d'une signature manuscrite, mais en infiniment plus sûr. Elle combine deux concepts vus précédemment :

- Le [hachage](/help/cryptography/hashing) — pour créer une empreinte unique du message
- La [cryptographie asymétrique](/help/cryptography/asymmetric) — pour lier cette empreinte à ton identité

Une signature numérique garantit trois choses :

| Garantie             | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **Authentification** | Le message vient bien de l'auteur déclaré                        |
| **Intégrité**        | Le message n'a pas été modifié depuis la signature               |
| **Non-répudiation**  | L'auteur ne peut pas nier avoir signé (lui seul a la clé privée) |

## Comment ça marche ? {#how}

### Étape par étape {#steps}

Le processus de signature se déroule en deux phases :

**Phase 1 — Signature (par l'auteur)**

```
   AUTEUR
   ──────

   ┌────────────┐
   │  Message   │  ────┐
   │  original  │      │
   └────────────┘      ▼
                  ┌────────┐
                  │  Hash  │  ──>  empreinte (ex: SHA-256)
                  │  (SHA) │       "a3f8c21e..."
                  └────────┘
                       │
                       ▼
            ┌────────────────────┐
            │  Chiffrer le hash  │  ──>  SIGNATURE
            │  avec clé privée   │       "x7k9m2p4..."
            └────────────────────┘

   Résultat envoyé : Message original + Signature
```

**Phase 2 — Vérification (par le destinataire)**

```
   VÉRIFICATEUR
   ────────────

   ┌───────────┐                            ┌───────────┐
   │  Message  │  ────>  Hash (SHA)  ────>  │    Hash   │
   │   reçu    │                            │  calculé  │───┐
   └───────────┘                            └───────────┘   │
                                                            │  Comparer
   ┌───────────┐                            ┌────────────┐  │
   │ Signature │  ────>  Déchiffrer  ────>  │    Hash    │──┘
   │ reçue     │     avec clé publique      │  original  │
   └───────────┘        de l'auteur         └────────────┘

                                          ✓ Identiques = Signature valide
                                          ✗ Différents = Falsifié ou corrompu
```

> **Pourquoi hacher d'abord ?** Chiffrer un message entier avec une clé asymétrique serait très lent. En hachant d'abord, on obtient une empreinte de taille fixe (256 bits pour SHA-256), rapide à chiffrer. La signature fait toujours la même taille, quel que soit le message.

## Signature vs chiffrement {#vs-encryption}

La signature et le chiffrement utilisent tous deux des paires de clés, mais dans des directions opposées :

| Critère              | Signature                       | Chiffrement                       |
| -------------------- | ------------------------------- | --------------------------------- |
| **Clé utilisée**     | Clé **privée** de l'auteur      | Clé **publique** du destinataire  |
| **Vérification**     | Clé **publique** de l'auteur    | Clé **privée** du destinataire    |
| **Confidentialité**  | Non (le message est lisible)    | Oui (le message est illisible)    |
| **Authentification** | Oui (prouve l'identité)         | Non (n'importe qui peut chiffrer) |
| **Intégrité**        | Oui (détecte les modifications) | Dépend du mode (AEAD)             |

```
   SIGNER                                    CHIFFRER
   ──────                                    ────────

   Clé privée ──> signer                    Clé publique ──> chiffrer
   Clé publique ──> vérifier                Clé privée ──> déchiffrer

   Tout le monde peut vérifier              Seul le destinataire peut lire
   Un seul peut signer                      Tout le monde peut chiffrer
```

## Applications pratiques {#applications}

### Signature de commits Git {#git-signing}

C'est l'application la plus courante pour un développeur. GPG signe chaque commit avec ta clé privée, et GitHub vérifie la signature avec ta clé publique.

```bash
# Sign a commit
git commit -S -m "MINOR: app: Add feature"

# Verify a commit signature
git verify-commit HEAD
```

```
gpg: Signature made Fri 07 Feb 2025 10:30:00 AM CET
gpg:                using EDDSA key 5FBB894614830FC9687C90D5850ECFDDBC39312E
gpg: Good signature from "20syldev <git@sylvain.sh>" [ultimate]
```

→ Voir le guide complet : [Signer ses commits Git avec GPG](/help/gpg/signing)

### Signature de tags et releases {#tags}

Les tags signés garantissent l'authenticité des releases :

```bash
# Create a signed tag
git tag -s v1.0.0 -m "Release 1.0.0"

# Verify a signed tag
git verify-tag v1.0.0
```

→ Voir [Signer ses commits — Tags](/help/gpg/signing#tags)

### Signature de paquets logiciels {#packages}

Les gestionnaires de paquets vérifient les signatures pour s'assurer que les logiciels n'ont pas été altérés :

```bash
# APT verifies GPG signatures automatically
sudo apt update
# Hit:1 https://deb.debian.org/debian bookworm InRelease
#                                              ^^^^^^^^
#                              InRelease = signed with GPG
```

- **APT** (Debian/Ubuntu) — Chaque dépôt est signé avec une clé GPG
- **RPM** (Fedora/RHEL) — Les paquets `.rpm` contiennent une signature GPG
- **npm/pip/cargo** — Vérifient les checksums (intégrité) mais rarement les signatures

### Signature de documents {#documents}

GPG permet de signer des fichiers ou documents pour prouver leur authenticité :

```bash
# Sign a document (detached signature)
gpg --detach-sign document.pdf
# Creates document.pdf.sig

# Verify the signature
gpg --verify document.pdf.sig document.pdf
```

→ Voir [GPG avancé](/help/gpg/advanced) pour les signatures détachées et en clair

### Vérification d'hôtes SSH {#ssh-host}

Quand tu te connectes à un serveur SSH pour la première fois, le serveur présente sa clé publique. SSH te demande de vérifier l'empreinte :

```
The authenticity of host 'serveur.com' can't be established.
ED25519 key fingerprint is SHA256:xR8wFv3J5K2pG...dN7mQ.
Are you sure you want to continue connecting (yes/no)?
```

→ Voir [Introduction à SSH](/help/ssh/introduction) pour comprendre ce mécanisme

## Modèles de confiance {#trust}

Une signature n'a de valeur que si tu fais confiance à la clé publique qui la vérifie. Deux modèles existent :

### Web of Trust (GPG) {#wot}

Modèle **décentralisé** : les utilisateurs se signent mutuellement les clés pour établir la confiance.

```
   Alice signe la clé de Bob ──> "Je confirme que cette clé appartient à Bob"
   Bob signe la clé de Charlie ──> "Je confirme que cette clé appartient à Charlie"

   Alice fait confiance à Bob, qui fait confiance à Charlie
   ──> Alice peut faire confiance à la clé de Charlie (transitivité)
```

→ Voir [GPG avancé — Web of Trust](/help/gpg/advanced)

### PKI / Autorités de certification (TLS) {#pki}

Modèle **centralisé** : des autorités de confiance (CA) signent les certificats des sites web.

```
   Autorité racine (ex: DigiCert)
         │
         ├──  signe  ──>  Autorité intermédiaire
         │                    │
         │                    ├──  signe  ──>  Certificat de sylvain.sh
         │                    │
         │                    └──  signe  ──>  Certificat de github.com
```

Ton navigateur fait confiance aux autorités racines préinstallées, et par extension à tous les certificats qu'elles ont signés.

→ Voir [Certificats et PKI](/help/cryptography/certificates) pour le détail

## Pour aller plus loin {#next}

- [Signer ses commits Git](/help/gpg/signing) — guide pratique pour signer avec GPG
- [Certificats et PKI](/help/cryptography/certificates) — la chaîne de confiance en détail
- [Chiffrement asymétrique](/help/cryptography/asymmetric) — les clés publiques et privées
- [GPG avancé](/help/gpg/advanced) — signatures détachées, en clair, Web of Trust