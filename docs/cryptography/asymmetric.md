---
title: Chiffrement asymétrique
description: Cryptographie à clé publique et clé privée — principe, algorithmes RSA et courbes elliptiques, signature et chiffrement.
category: cryptography
slug: asymmetric
order: 3
---

## Principe de la cryptographie asymétrique {#intro}

La cryptographie asymétrique (ou **cryptographie à clé publique**) repose sur une idée révolutionnaire : au lieu d'une seule clé partagée, chaque personne possède **deux clés** liées mathématiquement.

- La **clé publique** — Tu la distribues à tout le monde. Elle est publique, comme ton adresse email.
- La **clé privée** — Tu la gardes secrète, comme ton mot de passe. Elle ne quitte jamais ta machine.

Ces deux clés fonctionnent en tandem : ce qui est chiffré avec l'une ne peut être déchiffré qu'avec l'autre.

### Pourquoi deux clés ? {#why}

Le [chiffrement symétrique](/help/cryptography/symmetric) a un problème : il faut partager la clé secrète. Avec l'asymétrique, ce problème disparaît — tu n'as qu'à partager ta clé publique, ce que tout le monde peut voir sans risque.

```
          SYMÉTRIQUE                               ASYMÉTRIQUE
          ──────────                               ───────────

   Alice et Bob doivent d'abord            Alice publie sa clé publique.
   se mettre d'accord sur une              Bob l'utilise pour chiffrer.
   clé secrète commune.                    Seule Alice peut déchiffrer
                                           (avec sa clé privée).

       🔑 ← même clé → 🔑                    🔓 clé publique (ouverte)
                                             🔑 clé privée (secrète)
```

## Chiffrement {#encryption}

Pour envoyer un message confidentiel à quelqu'un, tu chiffres avec **sa clé publique**. Seul lui peut le déchiffrer avec **sa clé privée**.

```
   EXPÉDITEUR (Bob)                           DESTINATAIRE (Alice)
   ────────────────                           ──────────────────

    ┌───────────┐         Chiffrement           ┌───────────┐
    │  Message  │ ────  + clé publique  ──────> │  Message  │
    │  en clair │           d'Alice             │  chiffré  │
    └───────────┘                               └─────┬─────┘
                                                      │
                                                  clé privée
                                                   d'Alice
                                                      │
                                                ┌─────┴─────┐
                                                │  Message  │
                                                │  en clair │
                                                └───────────┘
```

**Propriétés :**

- Seule Alice peut lire le message (confidentialité)
- Même Bob ne peut pas déchiffrer son propre message une fois chiffré
- Si Eve intercepte le message chiffré, elle ne peut rien en faire sans la clé privée d'Alice

## Signature numérique {#signing}

Pour prouver que tu es l'auteur d'un message, tu signes avec **ta clé privée**. N'importe qui peut vérifier ta signature avec **ta clé publique**.

```
   AUTEUR (Alice)                             VÉRIFICATEUR (Bob)
   ──────────────                             ──────────────────

    ┌──────────┐           Signature             ┌───────────┐
    │ Message  │ ──────  + clé privée  ───────>  │  Message  │
    │          │            d'Alice              │ + signat. │
    └──────────┘          = signature            └─────┬─────┘
                                                       │
                                                   clé publique
                                                     d'Alice
                                                       │
                                                 ✓ Authentique
                                              ou   ✗ Modifié / Faux
```

**Propriétés :**

- Le message n'est **pas** chiffré — tout le monde peut le lire
- La signature prouve que le message vient d'Alice (authentification)
- Si le message a été modifié après signature, la vérification échoue (intégrité)

> **Application concrète** : C'est exactement ce que fait GPG quand tu [signes tes commits Git](/help/gpg/signing). Ta clé privée signe le commit, et GitHub vérifie la signature avec ta clé publique pour afficher le badge "Verified".

## Signature + chiffrement {#both}

On peut combiner les deux opérations pour obtenir confidentialité **et** authentification :

```
              Alice                                           Bob
              ─────                                           ───

   1. Signe avec sa clé privée
   2. Chiffre avec la clé publique     ────>     3. Déchiffre avec sa clé privée
      de Bob                                     4. Vérifie la signature avec
                                                    la clé publique d'Alice

   Résultat : seul Bob peut lire le message, et il sait qu'il vient bien d'Alice.
```

## Algorithmes {#algorithms}

| Algorithme  | Base mathématique                        | Taille de clé typique | Vitesse     | Usage principal                  |
| ----------- | ---------------------------------------- | --------------------- | ----------- | -------------------------------- |
| **RSA**     | Factorisation de grands nombres premiers | 2048-4096 bits        | Lent        | TLS, chiffrement, signatures     |
| **DSA**     | Logarithme discret                       | 2048-3072 bits        | Moyen       | Déprécié (remplacé par ECDSA)    |
| **ECDSA**   | Courbes elliptiques                      | 256-384 bits          | Rapide      | TLS, Bitcoin, signatures         |
| **ed25519** | Courbe Edwards 25519                     | 256 bits              | Très rapide | SSH, GPG, signatures modernes    |
| **X25519**  | Courbe Curve25519                        | 256 bits              | Très rapide | Échange de clés (TLS, WireGuard) |
| **cv25519** | Courbe Curve25519                        | 256 bits              | Très rapide | Chiffrement (GPG)                |

### RSA {#rsa}

Inventé en 1977 par Rivest, Shamir et Adleman, RSA est le plus ancien algorithme à clé publique encore utilisé. Il repose sur la difficulté de factoriser le produit de deux grands nombres premiers.

```
   Clé publique  = (n, e)     où n = p × q   (p et q sont premiers)
   Clé privée    = (n, d)     d est l'inverse modulaire de e

   Chiffrer   : c = m^e mod n
   Déchiffrer : m = c^d mod n
```

RSA est sûr tant que la factorisation de `n` reste difficile. Avec les ordinateurs actuels, il faut des clés d'au moins **2048 bits** (3072 bits recommandés).

> **Limitation** : Les clés RSA sont volumineuses. Une clé RSA-4096 fait 512 octets, contre 32 octets pour une clé ed25519.

### Courbes elliptiques (ECC) {#ecc}

La cryptographie sur courbes elliptiques (ECC) utilise les propriétés géométriques des courbes elliptiques sur des corps finis. Elle offre le même niveau de sécurité que RSA avec des clés beaucoup plus courtes.

```
   On choisit un point P sur une courbe elliptique.
   On le multiplie par un nombre secret k pour obtenir Q.

           clé privée (k)
                 │
                 ▼
      P  ────  k × P  ────>  Q
   (connu)              (clé publique)

   P → Q : facile (multiplication scalaire)
   Q → k : quasi impossible (logarithme discret)
```

**ed25519** est l'algorithme de courbe elliptique recommandé pour les signatures (SSH, GPG). Il est :

- **Rapide** — Signature et vérification très performantes
- **Sûr** — Aucune attaque connue, résistant aux attaques par canaux auxiliaires
- **Compact** — Clé de 32 octets, signature de 64 octets

```bash
# Generate an ed25519 SSH key
ssh-keygen -t ed25519 -C "git@sylvain.sh"

# Generate an ed25519 GPG key
gpg --quick-gen-key "20syldev <git@sylvain.sh>" ed25519
```

### Comparaison des tailles de clé {#key-sizes}

Pour un même niveau de sécurité :

| Sécurité (bits) | RSA         | ECC (ed25519/ECDSA) | AES (symétrique) |
| --------------- | ----------- | ------------------- | ---------------- |
| 128 bits        | 3 072 bits  | 256 bits            | 128 bits         |
| 192 bits        | 7 680 bits  | 384 bits            | 192 bits         |
| 256 bits        | 15 360 bits | 512 bits            | 256 bits         |

Une clé **ed25519 de 256 bits** offre autant de sécurité qu'une clé **RSA de 3 072 bits**. C'est pourquoi les clés ECC sont aujourd'hui préférées.

> **Post-quantique** : RSA et ECC seront tous deux vulnérables aux ordinateurs quantiques (algorithme de Shor). Le NIST a standardisé de nouveaux algorithmes résistants en 2024 (ML-KEM, ML-DSA), mais ils ne sont pas encore largement déployés.

## En pratique {#practice}

Les paires de clés publique/privée sont utilisées partout :

### Clés SSH {#ssh-keys}

```bash
# Generate a key pair
ssh-keygen -t ed25519

# View public key (to share)
cat ~/.ssh/id_ed25519.pub

# Private key (never share!)
# ~/.ssh/id_ed25519
```

La clé publique est copiée sur le serveur distant. Lors de la connexion, le serveur vérifie que tu possèdes la clé privée correspondante — sans jamais la voir.

→ Voir [Gestion des clés SSH](/help/ssh/keys) pour le guide complet.

### Clés GPG {#gpg-keys}

```bash
# Generate a key pair
gpg --full-gen-key

# List public keys
gpg --list-keys

# Export public key (to share)
gpg --armor --export git@sylvain.sh

# Private key stays in ~/.gnupg/
```

La clé publique est publiée sur GitHub ou un serveur de clés. Elle permet à quiconque de vérifier tes signatures.

→ Voir [Génération des clés GPG](/help/gpg/keys) pour le guide complet.

### Certificats TLS {#tls-keys}

Les sites HTTPS utilisent aussi une paire de clés. Le certificat TLS contient la clé publique du serveur, signée par une autorité de certification.

→ Voir [Certificats et PKI](/help/cryptography/certificates) pour comprendre la chaîne de confiance.

## Pour aller plus loin {#next}

- [Fonctions de hachage](/help/cryptography/hashing) — complément essentiel pour les signatures numériques
- [Signatures numériques](/help/cryptography/signatures) — comment hachage et asymétrique se combinent
- [Signer ses commits Git](/help/gpg/signing) — application concrète avec GPG
- [Gestion des clés SSH](/help/ssh/keys) — paires de clés SSH en pratique
- [Gestion des clés GPG](/help/gpg/keys) — paires de clés GPG en pratique