---
title: Génération et gestion des clés
description: Créer une paire de clés GPG, choisir l'algorithme, gérer les sous-clés, lister et supprimer des clés.
category: gpg
slug: keys
order: 3
---

## Générer une clé GPG {#generate}

### Génération rapide

La commande interactive te guide à travers chaque choix :

```bash
gpg --full-generate-key
```

```
Please select what kind of key you want:
   (1) RSA and RSA
   (9) ECC (sign and encrypt) *default*
   (10) ECC (sign only)
Your selection? 9

Please select which elliptic curve you want:
   (1) Curve 25519 *default*
Your selection? 1

Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? 2y

Real name: Alice Dupont
Email address: alice@example.com
Comment:
```

GPG génère alors ta paire de clés (clé principale ed25519 pour la signature, sous-clé cv25519 pour le chiffrement) et te demande une passphrase.

> **Bonne pratique** : Choisis une passphrase forte. Elle protège ta clé privée même si quelqu'un accède à ton disque.

### Choix de l'algorithme

| Algorithme        | Taille de clé | Sécurité    | Vitesse     | Recommandation     |
| ----------------- | ------------- | ----------- | ----------- | ------------------ |
| **ed25519** (ECC) | 256 bits      | Très élevée | Très rapide | ✓ Recommandé       |
| RSA               | 4096 bits     | Élevée      | Lent        | Compatible partout |
| RSA               | 2048 bits     | Suffisante  | Moyen       | Minimum acceptable |

**ed25519** est le choix par défaut depuis GPG 2.3. Il offre une meilleure sécurité avec des clés beaucoup plus courtes et des opérations plus rapides. GitHub, GitLab et la quasi-totalité des outils modernes le supportent.

> **Note** : Si tu dois interagir avec des systèmes anciens qui ne supportent pas ed25519, utilise RSA 4096.

### Date d'expiration

Il est **fortement recommandé** de définir une date d'expiration (1 à 3 ans). Pourquoi ?

- Si ta clé est compromise et que tu perds ton certificat de révocation, elle finira par expirer naturellement
- Ça prouve que la clé est activement maintenue
- Tu peux toujours prolonger l'expiration avant qu'elle n'arrive à terme

```bash
# Extend the expiration of an existing key
gpg --edit-key alice@example.com
gpg> expire
# Choose a new expiration date
gpg> save
```

## Lister et inspecter ses clés {#list}

### Lister les clés publiques

```bash
gpg --list-keys
```

```
/home/alice/.gnupg/pubring.kbx
--------------------------------
pub   ed25519 2025-02-07 [SC]
      3AA5C343B0D24DF12E890C726E4F9B11A8475F3D
uid           [ultimate] Alice Dupont <alice@example.com>
sub   cv25519 2025-02-07 [E]
```

Décryptage de la sortie :

| Élément               | Signification                                               |
| --------------------- | ----------------------------------------------------------- |
| `pub`                 | Clé publique principale                                     |
| `ed25519`             | Algorithme utilisé                                          |
| `2025-02-07`          | Date de création                                            |
| `[SC]`                | Capacités : **S**ign + **C**ertify                          |
| `3AA5C343...A8475F3D` | Fingerprint complet (40 caractères)                         |
| `uid [ultimate]`      | Identité, niveau de confiance maximal (c'est ta propre clé) |
| `sub cv25519 [E]`     | Sous-clé de chiffrement (**E**ncrypt)                       |

### Lister les clés privées

```bash
gpg --list-secret-keys --keyid-format=long
```

```
/home/alice/.gnupg/pubring.kbx
--------------------------------
sec   ed25519/6E4F9B11A8475F3D 2025-02-07 [SC]
      3AA5C343B0D24DF12E890C726E4F9B11A8475F3D
uid                 [ultimate] Alice Dupont <alice@example.com>
ssb   cv25519/XXXXXXXXXXXXXXXX 2025-02-07 [E]
```

- `sec` = **sec**ret key (clé privée principale)
- `ssb` = **s**ecret **s**u**b**key (sous-clé privée)
- `6E4F9B11A8475F3D` = Key ID long (16 derniers caractères du fingerprint)

> C'est ce **Key ID** que tu utiliseras pour configurer Git (`user.signingkey`).

## Sous-clés (subkeys) {#subkeys}

Ta clé principale (master key) possède les capacités **Sign** et **Certify**. La sous-clé générée automatiquement gère le chiffrement (**Encrypt**).

### Pourquoi utiliser des sous-clés ?

- **Sécurité** — Si une sous-clé est compromise, tu peux la révoquer sans perdre ta clé principale et toute ta chaîne de confiance
- **Séparation des usages** — Une sous-clé par machine ou par usage
- **Clé principale hors-ligne** — Tu peux stocker ta clé principale sur un support déconnecté et n'utiliser que les sous-clés au quotidien

### Ajouter une sous-clé de signature

```bash
gpg --edit-key alice@example.com
gpg> addkey
# Select: (10) ECC (sign only)
# Select: Curve 25519
# Set expiration
gpg> save
```

## Modifier une clé {#edit}

La commande `gpg --edit-key` ouvre un mode interactif pour modifier une clé existante :

```bash
gpg --edit-key alice@example.com
```

### Commandes disponibles

| Commande | Action                                      |
| -------- | ------------------------------------------- |
| `expire` | Modifier la date d'expiration               |
| `adduid` | Ajouter une nouvelle identité (nom + email) |
| `deluid` | Supprimer une identité                      |
| `addkey` | Ajouter une sous-clé                        |
| `trust`  | Définir le niveau de confiance              |
| `passwd` | Changer la passphrase                       |
| `save`   | Sauvegarder et quitter                      |
| `quit`   | Quitter sans sauvegarder                    |

### Ajouter un email secondaire

```bash
gpg --edit-key alice@example.com
gpg> adduid
Real name: Alice Dupont
Email address: autre@email.com
Comment:
gpg> save
```

Utile si tu utilises plusieurs adresses email sur GitHub ou d'autres plateformes.

## Supprimer une clé {#delete}

### Supprimer une clé publique

```bash
gpg --delete-key alice@example.com
```

### Supprimer une clé privée

```bash
gpg --delete-secret-key alice@example.com
```

### Supprimer les deux en une fois

```bash
gpg --delete-secret-and-public-key alice@example.com
```

> **Attention** : La suppression d'une clé privée est **irréversible**. Assure-toi d'avoir un backup ou un certificat de révocation avant de supprimer. Si d'autres personnes utilisent ta clé publique, préfère la **révoquer** plutôt que la supprimer (voir [Utilisation avancée](/help/gpg/advanced)).

## Pour aller plus loin {#next}

- [Signer ses commits](/help/gpg/signing) — utiliser ta clé pour signer tes commits Git
- [Intégration GitHub](/help/gpg/github) — ajouter ta clé publique à GitHub
- [Utilisation avancée](/help/gpg/advanced) — export, import, révocation et chiffrement