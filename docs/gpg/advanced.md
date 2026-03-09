---
title: Utilisation avancée
description: Export/import de clés, sauvegarde sécurisée, certificat de révocation, chiffrement de fichiers et serveurs de clés.
category: gpg
slug: advanced
order: 6
---

## Exporter et importer des clés {#export-import}

### Exporter sa clé publique

```bash
# ASCII format (for sharing, GitHub, keyservers)
gpg --armor --export alice@example.com > public-key.asc

# Binary format (smaller, for backups)
gpg --export alice@example.com > public-key.gpg
```

### Exporter sa clé privée

```bash
gpg --armor --export-secret-keys alice@example.com > private-key.asc
```

> **Attention** : Ce fichier contient ta clé privée. Ne le partage **jamais** et stocke-le dans un endroit sûr (clé USB chiffrée, gestionnaire de mots de passe).

### Exporter les sous-clés uniquement

```bash
gpg --armor --export-secret-subkeys alice@example.com > subkeys.asc
```

Utile pour exporter uniquement les sous-clés vers une machine de travail, tout en gardant la clé principale hors-ligne.

### Importer une clé

```bash
# Import a public or private key
gpg --import key-file.asc
```

Après l'import d'une clé privée, définir le niveau de confiance :

```bash
gpg --edit-key alice@example.com
gpg> trust
# Select 5 (ultimate trust) for your own key
gpg> save
```

### Sauvegarder ses clés

Voici une stratégie de backup recommandée :

```bash
# Create a backup directory
mkdir -p ~/gpg-backup

# Export everything
gpg --armor --export alice@example.com > ~/gpg-backup/public.asc
gpg --armor --export-secret-keys alice@example.com > ~/gpg-backup/private.asc
gpg --armor --export-ownertrust > ~/gpg-backup/trust.asc
gpg --gen-revoke alice@example.com > ~/gpg-backup/revoke.asc

# Copy to a secure location (encrypted USB, etc.)
```

Pour restaurer sur une nouvelle machine :

```bash
gpg --import public.asc
gpg --import private.asc
gpg --import-ownertrust trust.asc
```

## Certificat de révocation {#revocation}

Le certificat de révocation permet de déclarer publiquement qu'une clé n'est plus valide. C'est le "bouton d'urgence" en cas de compromission.

### Générer le certificat

```bash
gpg --gen-revoke alice@example.com > revoke-certificate.asc
```

GPG te demandera une raison :

```
Please select the reason for the revocation:
  0 = No reason specified
  1 = Key has been compromised
  2 = Key is superseded
  3 = Key is no longer used
```

> **Bonne pratique** : Génère le certificat de révocation **immédiatement** après la création de ta clé, et stocke-le séparément (clé USB, coffre-fort). Si tu perds l'accès à ta clé privée, ce certificat sera le seul moyen de la révoquer.

### Utiliser le certificat

En cas de compromission :

```bash
# Import the revocation certificate
gpg --import revoke-certificate.asc

# Send to keyserver to notify others
gpg --keyserver hkps://keyserver.ubuntu.com --send-keys 6E4F9B11A8475F3D
```

Une fois révoquée, la clé est marquée comme invalide dans ton keyring et sur les serveurs de clés. Les signatures existantes restent vérifiables mais afficheront un avertissement.

## Chiffrer et déchiffrer {#encrypt}

### Chiffrement asymétrique (avec clé publique)

Chiffrer un fichier pour un destinataire spécifique :

```bash
# Encrypt for a specific recipient
gpg --encrypt --recipient alice@example.com document.pdf
# Creates document.pdf.gpg

# Encrypt with ASCII output (for email, etc.)
gpg --armor --encrypt --recipient alice@example.com document.pdf
# Creates document.pdf.asc
```

Le fichier ne pourra être déchiffré que par le propriétaire de la clé privée correspondante.

### Chiffrer pour soi-même

```bash
gpg --encrypt --recipient alice@example.com --recipient autre@email.com document.pdf
```

Ajoute-toi comme destinataire si tu veux pouvoir déchiffrer le fichier toi-même.

### Chiffrement symétrique (avec mot de passe)

Pour chiffrer sans utiliser de clé, juste un mot de passe :

```bash
gpg --symmetric document.pdf
# GPG asks for a passphrase
# Creates document.pdf.gpg
```

Utile pour protéger rapidement un fichier sans avoir besoin de la clé du destinataire.

### Déchiffrer

```bash
gpg --decrypt document.pdf.gpg > document.pdf

# Or let GPG determine the output name
gpg --output document.pdf --decrypt document.pdf.gpg
```

### Signer et chiffrer en même temps

```bash
gpg --sign --encrypt --recipient destinataire@email.com document.pdf
```

Le destinataire pourra vérifier que c'est bien toi qui as envoyé le fichier **et** le déchiffrer.

### Signature en clair (clearsign)

Pour signer un document texte sans le chiffrer :

```bash
gpg --clearsign document.txt
# Creates document.txt.asc
```

Le résultat est un fichier texte lisible avec la signature intégrée. C'est le format utilisé pour signer le [Ubuntu Code of Conduct](https://ubuntu.com/community/ethos/code-of-conduct) :

```bash
gpg -u 6E4F9B11A8475F3D --clearsign UbuntuCodeofConduct-2.0.txt
```

### Vérifier une signature détachée

```bash
# Create a detached signature
gpg --detach-sign document.pdf
# Creates document.pdf.sig

# Verify
gpg --verify document.pdf.sig document.pdf
```

## Serveurs de clés {#keyservers}

Les serveurs de clés sont des annuaires publics où tu peux publier et rechercher des clés GPG.

### Serveurs recommandés

| Serveur                       | Particularité                        |
| ----------------------------- | ------------------------------------ |
| `hkps://keyserver.ubuntu.com` | Fiable, utilisé par Ubuntu/Launchpad |
| `hkps://keys.openpgp.org`     | Moderne, vérifie les emails          |
| `hkps://pgp.mit.edu`          | Historique, grande base de clés      |

### Publier sa clé

```bash
gpg --keyserver hkps://keyserver.ubuntu.com --send-keys 6E4F9B11A8475F3D
```

> **Note** : Une fois publiée sur un serveur de clés classique, une clé ne peut pas être supprimée (seulement révoquée). `keys.openpgp.org` permet la suppression car il vérifie l'email.

### Rechercher une clé

```bash
# Search by email
gpg --keyserver hkps://keyserver.ubuntu.com --search-keys user@example.com

# Import a specific key by ID
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys KEY_ID
```

### Rafraîchir ses clés

Pour mettre à jour les clés de ton keyring (vérifier les révocations, nouvelles signatures) :

```bash
gpg --keyserver hkps://keyserver.ubuntu.com --refresh-keys
```

## Niveau de confiance (WoT) {#trust}

Le **Web of Trust** est le modèle de confiance décentralisé de GPG. Au lieu d'une autorité centrale (comme les certificats SSL), ce sont les utilisateurs qui se valident mutuellement en signant les clés des autres.

### Niveaux de confiance

```bash
gpg --edit-key user@example.com
gpg> trust
```

| Niveau | Nom      | Signification                                                         |
| ------ | -------- | --------------------------------------------------------------------- |
| 1      | Unknown  | Tu ne sais pas si cette personne vérifie les clés avant de les signer |
| 2      | None     | Tu sais que cette personne ne vérifie pas les clés                    |
| 3      | Marginal | Tu fais partiellement confiance à ses vérifications                   |
| 4      | Full     | Tu fais entièrement confiance à ses vérifications                     |
| 5      | Ultimate | C'est ta propre clé                                                   |

### Signer la clé de quelqu'un

Après avoir vérifié l'identité d'une personne (en personne, par un canal sûr) :

```bash
# Sign their key
gpg --sign-key user@example.com

# Send the signed key back to a keyserver
gpg --keyserver hkps://keyserver.ubuntu.com --send-keys THEIR_KEY_ID
```

> **Bonne pratique** : Ne signe la clé de quelqu'un que si tu as vérifié son identité de manière fiable (rencontre en personne, appel vidéo, etc.). Signer des clés sans vérification affaiblit le Web of Trust.

## Pour aller plus loin {#next}

- [Dépannage](/help/gpg/troubleshooting) — résoudre les erreurs GPG courantes
- [Signer ses commits](/help/gpg/signing) — revenir à la configuration Git
- [Introduction](/help/gpg/introduction) — revoir les concepts fondamentaux