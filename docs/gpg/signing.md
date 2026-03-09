---
title: Signer ses commits Git
description: Configurer Git pour signer automatiquement chaque commit avec GPG — vérification locale et badge "Verified" sur GitHub.
category: gpg
slug: signing
order: 4
---

## Pourquoi signer ses commits ? {#why}

Par défaut, n'importe qui peut créer un commit avec ton nom et ton email :

```bash
git commit --author="Alice Dupont <alice@example.com>" -m "Commit"
```

Git ne vérifie pas l'identité. La signature GPG résout ce problème :

- **Authenticité** — Prouve cryptographiquement que le commit vient bien de toi
- **Badge "Verified"** — GitHub affiche un badge vert à côté de chaque commit signé
- **Supply chain security** — Protège ton projet contre les commits usurpés
- **Confiance** — Les contributeurs et utilisateurs savent que le code est authentique

## Configurer Git avec GPG {#config}

### Étape 1 — Trouver l'ID de ta clé

```bash
gpg --list-secret-keys --keyid-format=long
```

```
sec   ed25519/6E4F9B11A8475F3D 2025-02-07 [SC]
      3AA5C343B0D24DF12E890C726E4F9B11A8475F3D
uid                 [ultimate] Alice Dupont <alice@example.com>
```

Le Key ID est la partie après `ed25519/` : **`6E4F9B11A8475F3D`**

### Étape 2 — Associer la clé à Git

```bash
# Set the signing key
git config --global user.signingkey 6E4F9B11A8475F3D

# Set the GPG program (important on some systems)
git config --global gpg.program gpg
```

> **Important** : L'email dans ta clé GPG (`alice@example.com`) doit correspondre à l'email configuré dans Git (`user.email`) et à celui de ton compte GitHub.

### Étape 3 — Signer un commit manuellement

```bash
git commit -S -m "MINOR: app: Add signed commit example"
```

Le flag `-S` (majuscule) active la signature pour ce commit. GPG te demandera ta passphrase (si elle n'est pas en cache).

### Étape 4 — Activer la signature automatique

Pour ne plus avoir à ajouter `-S` à chaque commit :

```bash
# Sign all commits automatically
git config --global commit.gpgsign true

# Sign all tags automatically
git config --global tag.gpgsign true
```

À partir de maintenant, chaque `git commit` et `git tag` sera automatiquement signé.

## Vérifier les signatures {#verify}

### Voir les signatures dans le log

```bash
git log --show-signature -1
```

```
commit a3f8c21 (HEAD -> main)
gpg: Signature made Fri 07 Feb 2025 10:30:00 AM CET
gpg:                using EDDSA key 3AA5C343B0D24DF12E890C726E4F9B11A8475F3D
gpg: Good signature from "Alice Dupont <alice@example.com>" [ultimate]
Author: Alice Dupont <alice@example.com>
Date:   Fri Feb 7 10:30:00 2025 +0100

    MINOR: app: Add signed commit example
```

- `Good signature` = la signature est valide
- `[ultimate]` = tu fais confiance à cette clé (c'est la tienne)

### Vérifier un commit spécifique

```bash
git verify-commit HEAD
git verify-commit a3f8c21
```

### Format personnalisé dans le log

```bash
# Show signature status inline
git log --pretty=format:"%h %G? %s" -5
```

| Code `%G?` | Signification                                   |
| ---------- | ----------------------------------------------- |
| `G`        | Signature valide (Good)                         |
| `B`        | Signature invalide (Bad)                        |
| `U`        | Signature valide, clé non approuvée (Untrusted) |
| `N`        | Pas de signature (None)                         |

## Signer des tags {#tags}

Les tags signés sont particulièrement utiles pour les releases :

### Créer un tag signé

```bash
git tag -s v1.0.0 -m "Release 1.0.0"
```

Le flag `-s` (minuscule ici) signe le tag avec ta clé GPG.

### Vérifier un tag signé

```bash
git verify-tag v1.0.0
```

```
gpg: Signature made Fri 07 Feb 2025 10:30:00 AM CET
gpg:                using EDDSA key 3AA5C343B0D24DF12E890C726E4F9B11A8475F3D
gpg: Good signature from "Alice Dupont <alice@example.com>" [ultimate]
```

### Voir les détails d'un tag

```bash
git tag -v v1.0.0
```

## Configuration du GPG Agent {#agent}

Le **gpg-agent** est un daemon qui met en cache ta passphrase pour éviter de la retaper à chaque commit.

### Configurer le TTY

GPG a besoin de savoir quel terminal utiliser pour afficher le prompt de passphrase :

```bash
# Add to your ~/.bashrc or ~/.zshrc
export GPG_TTY=$(tty)
```

> **Essentiel** : Sans cette ligne, tu risques l'erreur `Inappropriate ioctl for device`. C'est la cause n°1 des problèmes de signature GPG.

### Configurer pinentry

Le programme **pinentry** affiche la fenêtre de saisie de la passphrase. Plusieurs variantes existent :

| Programme         | Type             | Système     |
| ----------------- | ---------------- | ----------- |
| `pinentry-curses` | Terminal         | Linux       |
| `pinentry-tty`    | Terminal basique | Linux       |
| `pinentry-gnome3` | Graphique GTK    | Linux GNOME |
| `pinentry-qt`     | Graphique Qt     | Linux KDE   |
| `pinentry-mac`    | Graphique        | macOS       |

Configurer dans `~/.gnupg/gpg-agent.conf` :

```ini
# Linux (terminal)
pinentry-program /usr/bin/pinentry-curses

# macOS
pinentry-program /opt/homebrew/bin/pinentry-mac
```

Puis redémarrer l'agent :

```bash
gpgconf --kill gpg-agent
```

### Durée du cache

Par défaut, gpg-agent cache la passphrase pendant 10 minutes. Pour modifier dans `~/.gnupg/gpg-agent.conf` :

```ini
# Cache for 1 hour after last use
default-cache-ttl 3600

# Maximum cache duration: 4 hours
max-cache-ttl 14400
```

## Pour aller plus loin {#next}

- [Intégration GitHub](/help/gpg/github) — ajouter ta clé à GitHub et obtenir le badge "Verified"
- [Dépannage](/help/gpg/troubleshooting) — résoudre les erreurs de signature courantes