---
title: Fonctions de hachage
description: Fonctions de hachage cryptographiques — SHA-256, SHA-512, principes, propriétés, usages et différence avec le chiffrement.
category: cryptography
slug: hashing
order: 4
---

## Qu'est-ce qu'une fonction de hachage ? {#intro}

Une **fonction de hachage cryptographique** transforme n'importe quelle donnée (un fichier, un mot de passe, un commit Git) en une empreinte de taille fixe appelée **hash** ou **digest**.

```
   Entrée (taille variable)                         Sortie (taille fixe)
   ─────────────────────────                        ────────────────────

   "Bonjour"           ───────>  SHA-256  ───────>  7f4e4093...a3d2 (64 hex = 256 bits)
   "Bonjour le monde"  ───────>  SHA-256  ───────>  3b1c8e4f...9f21 (64 hex = 256 bits)
   Fichier de 4 Go     ───────>  SHA-256  ───────>  9c2a7d11...b8e5 (64 hex = 256 bits)
```

Quelle que soit la taille de l'entrée, le hash fait toujours la même longueur. Et surtout, il est **impossible** de retrouver l'entrée à partir du hash.

### Ce n'est pas du chiffrement {#not-encryption}

Une erreur courante : confondre hachage et chiffrement. Ce sont deux choses fondamentalement différentes :

| Critère              | Chiffrement                     | Hachage                      |
| -------------------- | ------------------------------- | ---------------------------- |
| **Réversible ?**     | Oui (avec la clé)               | Non (sens unique)            |
| **Clé nécessaire ?** | Oui                             | Non                          |
| **Objectif**         | Protéger la confidentialité     | Vérifier l'intégrité         |
| **Taille de sortie** | Variable (≈ taille de l'entrée) | Fixe (256 bits pour SHA-256) |
| **Exemple**          | AES, RSA                        | SHA-256, BLAKE3              |

> **En résumé** : Le chiffrement est un coffre-fort (on peut ouvrir et récupérer le contenu). Le hachage est une empreinte digitale (on ne peut pas reconstituer la personne à partir de l'empreinte).

## Propriétés essentielles {#properties}

Une bonne fonction de hachage cryptographique doit respecter cinq propriétés :

### 1. Déterministe {#deterministic}

La même entrée produit **toujours** le même hash. Sans exception.

### 2. Rapide à calculer {#fast}

Le calcul du hash doit être efficace, même pour de gros fichiers.

### 3. Effet avalanche {#avalanche}

Un changement minuscule dans l'entrée produit un hash **complètement différent** :

```bash
echo -n "Bonjour" | sha256sum
# 7f4e4093c4ce29abf3088643cbb1a721ab1b1fb8ef0f207a1e710c2d56bba3d2

echo -n "bonjour" | sha256sum
# e3544e0afdd8e72ef0ba41e6cc9de8e39a1b3c2a91b5f43e7f1dbdca8e4d9f21
```

Un seul caractère change (B → b), mais le hash est radicalement différent. Impossible de deviner la modification à partir du hash.

### 4. Résistance à la pré-image {#preimage}

Étant donné un hash `h`, il est **quasi impossible** de trouver un message `m` tel que `hash(m) = h`. C'est ce qui rend le hachage irréversible.

### 5. Résistance aux collisions {#collision}

Il est **quasi impossible** de trouver deux messages différents `m1` et `m2` tels que `hash(m1) = hash(m2)`. C'est crucial pour la sécurité des signatures numériques.

> **Quand une collision est trouvée** : L'algorithme est considéré comme cassé. C'est ce qui est arrivé à MD5 (2004) et SHA-1 (2017, projet SHAttered de Google).

## Algorithmes {#algorithms}

| Algorithme  | Taille de sortie | Statut     | Usage                                          |
| ----------- | ---------------- | ---------- | ---------------------------------------------- |
| **MD5**     | 128 bits         | Cassé      | Ne plus utiliser pour la sécurité              |
| **SHA-1**   | 160 bits         | Déprécié   | Legacy (Git l'utilise encore pour les commits) |
| **SHA-256** | 256 bits         | Recommandé | Standard : signatures, certificats, blockchain |
| **SHA-512** | 512 bits         | Recommandé | Quand on veut plus de marge de sécurité        |
| **SHA-3**   | 224-512 bits     | Recommandé | Alternative à SHA-2, design différent          |
| **BLAKE3**  | 256 bits         | Recommandé | Très rapide, moderne, parallélisable           |

### SHA-256 {#sha256}

SHA-256 (Secure Hash Algorithm, 256 bits) est le standard actuel. Il fait partie de la famille SHA-2, publiée par le NIST en 2001.

```bash
# Hash a string
echo -n "Hello World" | sha256sum
# a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

# Hash a file
sha256sum fichier.iso
# 9c2a7d11...b8e5  fichier.iso
```

### BLAKE3 {#blake3}

BLAKE3 est un algorithme récent (2020), extrêmement rapide et parallélisable. Il est utilisé par des outils modernes comme `b3sum` :

```bash
# Install b3sum
cargo install b3sum

# Hash a file (much faster than sha256sum on large files)
b3sum fichier.iso
```

## Cas d'usage {#usecases}

### Vérification d'intégrité {#integrity}

Après avoir téléchargé un fichier, tu peux vérifier qu'il n'a pas été corrompu ou modifié :

```bash
# Download a file and its checksum
wget https://example.com/ubuntu.iso
wget https://example.com/SHA256SUMS

# Verify integrity
sha256sum -c SHA256SUMS
# ubuntu.iso: OK
```

Si le hash ne correspond pas, le fichier a été modifié — ne l'utilise pas.

### Stockage de mots de passe {#passwords}

Les mots de passe ne sont **jamais** stockés en clair dans une base de données. On stocke leur hash :

```
   Inscription :
   "motdepasse123"  ──>  hash()  ──>  "a1b2c3d4..." (stocké en BDD)

   Connexion :
   "motdepasse123"  ──>  hash()  ──>  "a1b2c3d4..."  ──>  compare avec la BDD ✓
```

Pour contrer les attaques par rainbow table, on ajoute un **salt** (valeur aléatoire unique par utilisateur) :

```
   hash("motdepasse123" + "sel_aléatoire_unique") = hash totalement différent
```

Les algorithmes spécialisés pour les mots de passe (**bcrypt**, **argon2**, **scrypt**) sont volontairement lents pour rendre les attaques par force brute impraticables.

### Git {#git}

Git utilise SHA-1 pour identifier chaque objet (commit, arbre, blob) :

```bash
# Show the SHA-1 hash of the last commit
git rev-parse HEAD
# a3f8c21e5b7d4c9f2e1a0b8c7d6e5f4a3b2c1d0e
```

Chaque commit est identifié par le hash de son contenu. Si un seul octet change, le hash change — c'est ainsi que Git détecte les modifications.

> **Note** : Git migre progressivement vers SHA-256 pour plus de sécurité (SHA-1 a des collisions connues depuis 2017).

### Signatures numériques {#digital-signatures}

Les [signatures numériques](/help/cryptography/signatures) utilisent le hachage comme étape intermédiaire : on ne signe pas le message entier, mais son hash. C'est plus rapide et produit une signature de taille fixe.

## Pour aller plus loin {#next}

- [Signatures numériques](/help/cryptography/signatures) — comment hachage et clé privée se combinent pour signer
- [Chiffrement asymétrique](/help/cryptography/asymmetric) — les clés publiques et privées en détail
- [Certificats et PKI](/help/cryptography/certificates) — les hashes dans les certificats TLS