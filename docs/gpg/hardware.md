---
title: Clés hardware
description: Utiliser une clé physique (Yubikey, Nitrokey) avec GPG — configuration, sous-clés sur carte, signature et chiffrement.
category: gpg
slug: hardware
order: 6
---

## Pourquoi une clé hardware ? {#intro}

Stocker une clé privée sur le disque (software key) l'expose au vol par un malware, une copie du disque ou un accès physique. Une clé hardware génère et conserve la clé privée **sur le périphérique** — elle ne le quitte jamais, même si la machine est compromise.

| Critère             | Clé logicielle         | Clé hardware           |
| ------------------- | ---------------------- | ---------------------- |
| Stockage            | Fichier sur disque     | Puce sécurisée         |
| Risque d'extraction | Élevé (copie possible) | Quasi nul              |
| Portabilité         | Copier le fichier      | Brancher la clé        |
| Sauvegarde          | Export GPG classique   | Backup avant transfert |

## Clés compatibles {#devices}

| Clé            | GPG | FIDO2 | NFC | Prix approx. |
| -------------- | --- | ----- | --- | ------------ |
| Yubikey 5      | Oui | Oui   | Oui | ~55€         |
| Yubikey 5 Nano | Oui | Oui   | Non | ~55€         |
| Nitrokey Pro 2 | Oui | Non   | Non | ~50€         |
| Nitrokey 3     | Oui | Oui   | Oui | ~60€         |
| OnlyKey        | Oui | Oui   | Non | ~50€         |

## Préparer les sous-clés {#subkeys}

La stratégie recommandée : garder la clé maîtresse hors ligne et transférer uniquement les sous-clés sur le périphérique. Générer les sous-clés si ce n'est pas déjà fait (voir [gestion des clés](/help/gpg/keys)).

```bash
# List existing keys and subkeys
gpg --list-keys --keyid-format long

# Edit key to add subkeys (if needed)
gpg --edit-key user@email.com
> addkey   # Add signing subkey (type 4, ed25519)
> addkey   # Add encryption subkey (type 6, cv25519)
> addkey   # Add authentication subkey (type 8)
> save
```

## Transférer sur la carte {#keytocard}

**Attention : `keytocard` déplace la clé, il ne la copie pas. Sauvegarder avant !**

```bash
# Back up your keys BEFORE transfer
gpg --export-secret-keys user@email.com > backup-secret.gpg

# Move subkeys to card
gpg --edit-key user@email.com
> key 1        # Select signing subkey
> keytocard    # Choose slot: (1) Signature
> key 1        # Deselect
> key 2        # Select encryption subkey
> keytocard    # Choose slot: (2) Encryption
> key 2
> key 3        # Select authentication subkey
> keytocard    # Choose slot: (3) Authentication
> save
```

Après le transfert, `gpg --list-secret-keys` affiche `>` à côté des sous-clés, indiquant qu'elles sont sur la carte.

## Configuration Yubikey {#yubikey}

```bash
# Check card status
gpg --card-status

# Edit card settings
gpg --card-edit
> admin
> passwd     # Change PIN (default: 123456) and Admin PIN (default: 12345678)
> name       # Set cardholder name
> lang       # Set language
> quit
```

Politique de toucher (Yubikey uniquement) : exiger un contact physique pour chaque opération.

```bash
# Require touch for signing
ykman openpgp keys set-touch sig on

# Require touch for encryption
ykman openpgp keys set-touch enc on
```

## Usage quotidien {#usage}

```bash
# Sign a commit (works automatically if key is on card)
git commit -S -m "signed commit"

# Encrypt a file
gpg --encrypt --recipient user@email.com secret.txt

# The Yubikey blinks → touch it to authorize
```

Si la clé n'est pas branchée, GPG retourne une erreur `card not available`. Pour utiliser la clé sur plusieurs machines, installer les stubs de clé publique sur chaque poste et brancher la Yubikey au moment de l'opération.

## Sauvegarde et récupération {#backup}

Conserver la clé maîtresse et les sous-clés dans un endroit sûr (clé USB chiffrée, coffre-fort, impression papier). En cas de perte ou de casse du périphérique :

1. Révoquer les anciennes sous-clés
2. Restaurer la sauvegarde
3. Générer de nouvelles sous-clés
4. Transférer sur le nouveau périphérique

Envisager une deuxième clé hardware de secours avec les mêmes sous-clés.

## Pour aller plus loin {#next}

- [Gestion des clés](/help/gpg/keys) — générer et gérer les clés GPG
- [Signer les commits](/help/gpg/signing) — intégration avec Git
- [Utilisation avancée](/help/gpg/advanced) — export, révocation, Web of Trust