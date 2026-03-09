---
title: Dépannage
description: Diagnostiquer les erreurs GPG courantes, résoudre les problèmes de signature Git et de pinentry.
category: gpg
slug: troubleshooting
order: 7
---

## Erreurs courantes et solutions {#errors}

### `gpg: signing failed: No secret key`

```
error: gpg failed to sign the data
fatal: failed to write commit object
```

**Traduction** : Git essaie de signer avec une clé qui n'existe pas dans ton keyring.

**Causes possibles** :

- Le `user.signingkey` dans Git ne correspond à aucune clé privée
- La clé a expiré
- L'email dans Git (`user.email`) ne correspond pas à celui de la clé GPG

**Solution** :

```bash
# Check which key Git is trying to use
git config --global user.signingkey

# List your actual secret keys
gpg --list-secret-keys --keyid-format=long

# Fix the key ID if needed
git config --global user.signingkey CORRECT_KEY_ID
```

### `gpg: signing failed: Inappropriate ioctl for device`

```
gpg: signing failed: Inappropriate ioctl for device
error: gpg failed to sign the data
```

**Traduction** : GPG ne sait pas quel terminal utiliser pour afficher le prompt de passphrase.

**Solution** :

```bash
# Add to ~/.bashrc or ~/.zshrc
export GPG_TTY=$(tty)
```

Puis recharge ton shell :

```bash
source ~/.bashrc
# or
source ~/.zshrc
```

> C'est l'erreur la plus fréquente. Si tu ne retiens qu'une seule chose de cette page, c'est `export GPG_TTY=$(tty)`.

### `error: gpg failed to sign the data`

**Traduction** : Message générique qui peut avoir plusieurs causes.

**Diagnostic** :

```bash
# Test GPG signing directly (outside of Git)
echo "test" | gpg --clearsign
```

Si cette commande échoue aussi, le problème vient de GPG lui-même (pas de Git). Vérifier :

1. L'agent GPG tourne-t-il ? → `gpgconf --kill gpg-agent && gpg-agent --daemon`
2. Pinentry est-il installé ? → `which pinentry`
3. Le TTY est-il configuré ? → `echo $GPG_TTY`

### `gpg: public key decryption failed: No pinentry`

```
gpg: public key decryption failed: No pinentry
gpg: decryption failed: No secret key
```

**Traduction** : GPG ne trouve pas le programme `pinentry` pour afficher le prompt de passphrase.

**Solution** :

```bash
# Install pinentry (Debian/Ubuntu)
sudo apt install pinentry-curses

# Verify it works
which pinentry
# → /usr/bin/pinentry

# Or configure a specific pinentry in ~/.gnupg/gpg-agent.conf
echo "pinentry-program /usr/bin/pinentry-curses" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
```

### Commits affichent "Unverified" sur GitHub

Le commit est signé mais GitHub n'affiche pas le badge "Verified".

**Vérifier dans l'ordre** :

1. **Clé ajoutée à GitHub ?** → Settings → SSH and GPG keys → vérifier que la clé est listée
2. **Email correspondant ?** → L'email du commit (`git config user.email`) doit correspondre à un email vérifié dans ton compte GitHub
3. **Email dans la clé GPG ?** → La clé doit contenir un UID avec ce même email (`gpg --list-keys`)
4. **Clé expirée ?** → Vérifier la date d'expiration dans `gpg --list-keys`
5. **Clé mise à jour sur GitHub ?** → Si tu as prolongé l'expiration, il faut ré-exporter et ré-ajouter la clé sur GitHub

```bash
# Quick diagnostic
git log --show-signature -1
git config user.email
gpg --list-keys --keyid-format=long
```

## Déboguer GPG {#debug}

### Mode verbose

```bash
# Verbose GPG output
gpg --verbose --verify file.sig

# Very verbose
gpg -vvv --verify file.sig
```

### Tester la signature en dehors de Git

```bash
echo "test" | gpg --clearsign
```

Si ça fonctionne, le problème vient de la configuration Git, pas de GPG.

### Vérifier l'agent

```bash
# Check if gpg-agent is running
gpg-connect-agent /bye
# → OK

# Show agent configuration
gpgconf --list-options gpg-agent
```

### Logs de l'agent

Pour activer les logs détaillés dans `~/.gnupg/gpg-agent.conf` :

```ini
verbose
log-file /tmp/gpg-agent.log
```

Puis redémarrer et consulter :

```bash
gpgconf --kill gpg-agent
# Trigger an operation (sign, decrypt)
cat /tmp/gpg-agent.log
```

## Réinitialiser le GPG Agent {#agent}

Quand l'agent se comporte de manière inattendue, le redémarrer résout souvent le problème :

```bash
# Kill the agent
gpgconf --kill gpg-agent

# It restarts automatically on next GPG operation
# Or start it manually
gpg-agent --daemon
```

### Vider le cache des passphrases

```bash
# Flush all cached passphrases
gpg-connect-agent reloadagent /bye
```

### Réinitialisation complète

En dernier recours, si rien ne fonctionne :

```bash
# Kill everything
gpgconf --kill all

# Restart
gpg-agent --daemon
```

> **Note** : Cela ne supprime pas tes clés. Seuls les processus en cours sont redémarrés.

## Problèmes spécifiques {#specific}

### macOS et pinentry

Sur macOS, le `pinentry` par défaut peut ne pas fonctionner correctement avec certains terminaux.

```bash
# Install pinentry-mac
brew install pinentry-mac

# Configure GPG to use it
echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf

# Restart the agent
gpgconf --kill gpg-agent
```

`pinentry-mac` affiche une fenêtre native macOS et peut stocker la passphrase dans le Keychain.

### WSL (Windows Subsystem for Linux)

Dans WSL, le `pinentry` graphique de Linux ne fonctionne pas car il n'y a pas de serveur d'affichage par défaut.

```bash
# Use terminal-based pinentry
echo "pinentry-program /usr/bin/pinentry-curses" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent

# And always set GPG_TTY
echo 'export GPG_TTY=$(tty)' >> ~/.bashrc
source ~/.bashrc
```

### VS Code et la signature

VS Code utilise son propre terminal intégré, qui peut ne pas hériter de `GPG_TTY`.

**Solution 1** — Ajouter dans les settings VS Code (`settings.json`) :

```json
{
    "terminal.integrated.env.linux": {
        "GPG_TTY": "${env:TTY}"
    }
}
```

**Solution 2** — Utiliser `pinentry-curses` ou un pinentry graphique qui ne dépend pas du TTY :

```bash
# Use a graphical pinentry on Linux
sudo apt install pinentry-gnome3
echo "pinentry-program /usr/bin/pinentry-gnome3" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
```

**Solution 3** — Configurer `gpg-agent` pour permettre le loopback pinentry :

```ini
# In ~/.gnupg/gpg-agent.conf
allow-loopback-pinentry
```

```ini
# In ~/.gnupg/gpg.conf
pinentry-mode loopback
```

> **Note** : Le mode loopback est moins sécurisé car la passphrase transite par le processus appelant. Préférer un pinentry graphique quand c'est possible.

### Git GUI et clients graphiques

Les clients Git graphiques (GitKraken, Sourcetree, etc.) peuvent ne pas hériter de la configuration `GPG_TTY`. Solutions :

1. Utiliser un pinentry graphique (pas de dépendance au terminal)
2. Augmenter le `default-cache-ttl` pour garder la passphrase en cache plus longtemps
3. Consulter la documentation spécifique du client

## Pour aller plus loin {#next}

- [Signer ses commits](/help/gpg/signing) — revoir la configuration de signature
- [Intégration GitHub](/help/gpg/github) — vérifier le badge "Verified"
- [Installation](/help/gpg/installation) — revoir la configuration initiale