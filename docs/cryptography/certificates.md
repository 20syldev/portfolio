---
title: Certificats et PKI
description: Infrastructure à clé publique (PKI), certificats X.509, autorités de certification, chaîne de confiance et HTTPS.
category: cryptography
slug: certificates
order: 6
---

## Le problème de la confiance {#intro}

La [cryptographie asymétrique](/help/cryptography/asymmetric) résout le problème de l'échange de clés. Mais un nouveau problème apparaît : **comment savoir que la clé publique appartient bien à la bonne personne ?**

```
   Tu veux envoyer un message chiffré à Alice.
   Tu trouves une clé publique étiquetée "Alice" sur Internet.

   Mais est-ce vraiment la clé d'Alice ?
   Ou est-ce Eve qui prétend être Alice ?

   ┌─────────┐       clé publique     ┌───────┐
   │   Toi   │  <──────  ???  ──────  │  ???  │  Alice ou Eve ?
   └─────────┘                        └───────┘
```

Deux modèles répondent à cette question :

| Modèle                | Approche     | Utilisé par        |
| --------------------- | ------------ | ------------------ |
| **Web of Trust**      | Décentralisé | GPG                |
| **PKI (certificats)** | Centralisé   | HTTPS, TLS, S/MIME |

## Certificats X.509 {#x509}

Un **certificat numérique** est un document électronique qui lie une clé publique à une identité. Le standard le plus utilisé est **X.509** (utilisé par TLS/HTTPS).

### Structure d'un certificat {#structure}

| Champ                   | Description                                   | Exemple                            |
| ----------------------- | --------------------------------------------- | ---------------------------------- |
| **Subject**             | Identité du propriétaire                      | `CN=sylvain.sh`                    |
| **Issuer**              | Autorité qui a signé le certificat            | `CN=Let's Encrypt Authority X3`    |
| **Public Key**          | Clé publique du propriétaire                  | Clé RSA-2048 ou ECDSA              |
| **Serial Number**       | Identifiant unique du certificat              | `03:A1:B2:C3:...`                  |
| **Not Before**          | Date de début de validité                     | `2025-01-01 00:00:00 UTC`          |
| **Not After**           | Date d'expiration                             | `2025-04-01 00:00:00 UTC`          |
| **Signature Algorithm** | Algorithme utilisé par l'issuer pour signer   | `SHA256withRSA`, `SHA256withECDSA` |
| **Signature**           | Signature du certificat par l'issuer          | Données binaires                   |
| **SAN**                 | Subject Alternative Names (domaines couverts) | `sylvain.sh, *.sylvain.sh`         |

### Voir un certificat en pratique {#view}

```bash
# View a website's certificate
openssl s_client -connect sylvain.sh:443 < /dev/null 2>/dev/null | \
  openssl x509 -text -noout
```

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 03:a1:b2:c3:...
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = US, O = Let's Encrypt, CN = R3
        Validity
            Not Before: Jan  1 00:00:00 2025 GMT
            Not After : Apr  1 00:00:00 2025 GMT
        Subject: CN = sylvain.sh
        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)
```

## Autorités de certification (CA) {#ca}

Une **autorité de certification** (Certificate Authority, CA) est un tiers de confiance qui signe les certificats. Elle garantit : "j'ai vérifié que cette clé publique appartient bien à cette identité".

### Hiérarchie de confiance {#hierarchy}

Les CA s'organisent en arbre hiérarchique :

```
   ┌────────────────────────┐
   │    CA Racine (Root)    │  Préinstallée dans ton navigateur/OS
   │      Ex: DigiCert      │  Se signe elle-même (auto-signé)
   └────────────┬───────────┘
                │  signe
                ▼
   ┌────────────────────────┐
   │  CA Intermédiaire      │  Signée par la racine
   │  Ex: Let's Encrypt R3  │  Signe les certificats finaux
   └────────────┬───────────┘
                │  signe
                ▼
   ┌────────────────────────┐
   │    Certificat final    │  Le certificat de ton site
   │     Ex: sylvain.sh     │  Contient ta clé publique
   └────────────────────────┘
```

> **Pourquoi des intermédiaires ?** La clé privée de la CA racine est extrêmement sensible (stockée hors ligne dans un coffre-fort). Les CA intermédiaires permettent de signer des certificats au quotidien sans exposer la clé racine.

### CA racines de confiance {#root-cas}

Ton navigateur et ton système d'exploitation sont livrés avec une liste de **CA racines de confiance** (environ 100-150 selon l'OS). Tu leur fais confiance implicitement :

| CA Racine             | Utilisée par                       |
| --------------------- | ---------------------------------- |
| DigiCert              | Sites d'entreprise, banques        |
| Let's Encrypt (ISRG)  | ~50% des sites HTTPS dans le monde |
| Sectigo (ex-Comodo)   | Hébergeurs, sites commerciaux      |
| GlobalSign            | Services cloud, IoT                |
| Google Trust Services | Domaines Google, GCP               |

## Comment un navigateur vérifie un certificat {#browser}

Quand tu visites `https://sylvain.sh`, voici ce qui se passe :

```
   Navigateur                                   Serveur (sylvain.sh)
   ┌──────────┐                                ┌───────────────────┐
   │          │  ────  1. ClientHello  ─────>  │                   │
   │          │                                │                   │
   │          │  <────  2. Certificats  ─────  │                   │
   │          │         - sylvain.sh           │                   │
   │          │         - Intermédiaire R3     │                   │
   └──────────┘                                └───────────────────┘

   3. Vérifications du navigateur :
   ┌───────────────────────────────────────────────────────────────┐
   │  a. sylvain.sh signé par R3 ?        →  Clé publique R3    ✓  │
   │  b. R3 signé par ISRG Root X1 ?      →  Clé racine         ✓  │
   │  c. ISRG Root X1 dans les CA ?       →  Préinstallé        ✓  │
   │  d. Certificat expiré ?              →  Valide             ✓  │
   │  e. Domaine correspond au SAN ?      →  sylvain.sh ∈ SAN   ✓  │
   └───────────────────────────────────────────────────────────────┘

   4. Connexion sécurisée établie 🔒
```

Si une seule vérification échoue, le navigateur affiche un avertissement de sécurité.

## HTTPS et TLS {#tls}

**TLS** (Transport Layer Security) est le protocole qui sécurise HTTPS. Il combine tout ce qu'on a vu :

### Le handshake TLS simplifié {#handshake}

```
     Client                                                Serveur
   ┌────────┐                                            ┌────────┐
   │        │  ───────────  1. ClientHello  ──────────>  │        │
   │        │            Algorithmes supportés           │        │
   │        │                                            │        │
   │        │  <──────────  2. ServerHello  ───────────  │        │
   │        │            Certificat + algorithme         │        │
   │        │                                            │        │
   │        │          3. Vérification certificat        │        │
   │        │                                            │        │
   │        │  <──────────  4. Diffie-Hellman  ───────>  │        │
   │        │              Secret partagé créé           │        │
   └────────┘                                            └────────┘

   5. Communication chiffrée (AES-GCM / ChaCha20)
   ┌──────────┐  ═══════════════════════════════════  ┌───────────┐
   │  Client  │     Données chiffrées (symétrique)    │  Serveur  │
   └──────────┘  ═══════════════════════════════════  └───────────┘
```

**En résumé :**

1. **Asymétrique** (certificat) → Authentifier le serveur
2. **Échange de clés** (Diffie-Hellman) → Créer un secret partagé
3. **Symétrique** (AES-GCM) → Chiffrer toutes les données rapidement

> C'est la combinaison parfaite : l'asymétrique pour la confiance, le symétrique pour la performance.

## Let's Encrypt {#letsencrypt}

**Let's Encrypt** est une autorité de certification gratuite et automatisée, lancée en 2015 par l'ISRG (Internet Security Research Group). Elle a révolutionné HTTPS en le rendant accessible à tous.

- **Gratuit** — Pas besoin de payer pour un certificat TLS
- **Automatisé** — Le protocole ACME automatise la délivrance et le renouvellement
- **Ouvert** — Projet open source, transparent

```bash
# Get a certificate with certbot (Let's Encrypt client)
sudo certbot --nginx -d sylvain.sh -d www.sylvain.sh

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

Les certificats Let's Encrypt expirent après **90 jours**, encourageant le renouvellement automatique et limitant l'impact d'une éventuelle compromission.

## Web of Trust vs PKI {#wot-vs-pki}

| Critère                  | Web of Trust (GPG)                    | PKI (Certificats)                            |
| ------------------------ | ------------------------------------- | -------------------------------------------- |
| **Modèle**               | Décentralisé                          | Centralisé (hiérarchique)                    |
| **Confiance**            | Les utilisateurs se signent entre eux | Les CA signent les certificats               |
| **Validation**           | Par les pairs (connaissance directe)  | Par l'autorité (vérification admin)          |
| **Point de défaillance** | Aucun point unique                    | Si une CA est compromise, tout l'arbre l'est |
| **Révocation**           | Certificat de révocation GPG          | CRL / OCSP                                   |
| **Usage**                | Email, commits Git, fichiers          | HTTPS, TLS, S/MIME                           |
| **Scalabilité**          | Difficile à grande échelle            | Fonctionne pour tout Internet                |

→ Voir [GPG avancé — Web of Trust](/help/gpg/advanced) pour la mise en pratique

## Pour aller plus loin {#next}

- [Glossaire et ressources](/help/cryptography/glossary) — termes, algorithmes et références
- [Signatures numériques](/help/cryptography/signatures) — le mécanisme derrière les certificats
- [Chiffrement asymétrique](/help/cryptography/asymmetric) — les clés publiques et privées
- [GPG avancé](/help/gpg/advanced) — Web of Trust, signatures détachées