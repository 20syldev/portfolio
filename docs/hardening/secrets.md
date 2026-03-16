---
title: Gestion des secrets
description: Protéger les secrets applicatifs — variables d'environnement, détection de fuites, gestionnaires de secrets et rotation.
category: hardening
slug: secrets
order: 7
---

## Le problème des secrets {#intro}

Les secrets (clés API, mots de passe, tokens, certificats, clés privées) sont trop souvent codés en dur dans le source, commités dans Git ou partagés en clair sur Slack. Une clé AWS qui fuite peut générer une facture de cryptomining de plusieurs milliers d'euros.

| Type               | Exemple                 | Risque si exposé              |
| ------------------ | ----------------------- | ----------------------------- |
| Clé API            | `sk-1234...`            | Accès au service, facturation |
| Token JWT          | `eyJhbG...`             | Usurpation d'identité         |
| Mot de passe BDD   | `POSTGRES_PASSWORD=...` | Accès aux données             |
| Clé privée SSH/GPG | `-----BEGIN...`         | Accès aux serveurs            |
| Secret webhook     | `whsec_...`             | Forge de webhooks             |

## Variables d'environnement {#env}

Stocker les secrets dans des variables d'environnement, jamais dans le code.

```bash
# .env file (NEVER commit this)
DATABASE_URL=postgres://user:pass@localhost:5432/db
API_SECRET=sk-1234567890abcdef

# Load in shell
export $(cat .env | xargs)

# In Node.js
process.env.DATABASE_URL
```

Le fichier `.env` doit **toujours** être dans `.gitignore`. Utiliser `.env.example` avec des valeurs fictives pour documenter les variables attendues.

```bash
# .env.example (safe to commit)
DATABASE_URL=postgres://user:password@localhost:5432/mydb
API_SECRET=your-api-secret-here
```

## Prévenir les fuites {#prevention}

### .gitignore {#gitignore}

```gitignore
# Secrets
.env
.env.local
.env.production
*.pem
*.key
credentials.json
```

### Pre-commit hooks {#hooks}

```bash
# Install git-secrets (AWS)
git secrets --install
git secrets --register-aws

# Or use pre-commit framework with detect-secrets
pip install pre-commit
```

### Outils de détection {#detection}

| Outil          | Spécialité             | Usage               |
| -------------- | ---------------------- | ------------------- |
| git-secrets    | AWS keys               | Pre-commit hook     |
| trufflehog     | Entropie + patterns    | Scan historique Git |
| gitleaks       | Patterns configurables | CI/CD pipeline      |
| detect-secrets | Multi-provider         | Pre-commit + audit  |

```bash
# Scan entire Git history with trufflehog
trufflehog git file://. --only-verified

# Scan with gitleaks
gitleaks detect --source . --verbose

# If a secret is found in history → rotate it immediately
# Then clean history with git filter-repo (see /help/git/large)
```

## Gestionnaires de secrets {#managers}

En production, ne pas utiliser de fichiers `.env` — préférer un gestionnaire de secrets dédié.

| Outil               | Type              | Cas d'usage                |
| ------------------- | ----------------- | -------------------------- |
| HashiCorp Vault     | Self-hosted       | Multi-cloud, rotation auto |
| AWS Secrets Manager | Cloud             | Écosystème AWS             |
| Azure Key Vault     | Cloud             | Écosystème Azure           |
| 1Password CLI       | SaaS              | Équipes, CI/CD             |
| SOPS                | Fichiers chiffrés | GitOps, config as code     |

### Exemple avec SOPS {#sops}

```bash
# Install sops
brew install sops

# Encrypt a file with age
sops --encrypt --age age1... secrets.yaml > secrets.enc.yaml

# Decrypt
sops --decrypt secrets.enc.yaml

# Edit in place (decrypts, opens editor, re-encrypts)
sops secrets.enc.yaml
```

## Rotation des secrets {#rotation}

Les secrets doivent être renouvelés régulièrement (tous les 90 jours minimum). Automatiser la rotation quand c'est possible.

- **Clés API** : régénérer et mettre à jour dans le gestionnaire de secrets
- **Mots de passe BDD** : mettre à jour en base et dans le gestionnaire simultanément
- **Clés SSH** : voir [gestion des clés SSH](/help/ssh/keys)
- **Certificats TLS** : automatiser avec Let's Encrypt / certbot
- **Secrets JWT** : renouveler et invalider les tokens existants

## Diceware et passphrases {#diceware}

La méthode **Diceware** génère des passphrases en utilisant des **dés physiques** et une liste de mots numérotés. Chaque mot est sélectionné par un lancer de 5 dés, ce qui garantit un caractère véritablement aléatoire (pas de biais humain).

### Comment ça fonctionne

```
1. Lancer 5 dés             → 4-2-5-1-6
2. Chercher dans la liste   → 42516 = "merge"
3. Répéter 6 fois           → "merge clamp hobby plaid cedar omega"
```

Chaque mot apporte **~12.9 bits d'entropie** (la liste EFF contient 7776 mots = 6⁵).

### Entropie par nombre de mots

| Mots | Bits d'entropie | Résistance                       |
| ---- | --------------- | -------------------------------- |
| 4    | ~51 bits        | Faible — usage personnel basique |
| 5    | ~64 bits        | Correct — usage courant          |
| 6    | ~77 bits        | Bon — recommandé pour la plupart |
| 7    | ~90 bits        | Très bon — secrets importants    |
| 8    | ~103 bits       | Excellent — master password      |

> **Minimum recommandé** : 6 mots pour un usage sérieux (gestionnaire de mots de passe, chiffrement de disque).

### Listes de mots

| Liste                   | Taille    | Particularité                              |
| ----------------------- | --------- | ------------------------------------------ |
| **EFF Long Word List**  | 7776 mots | Mots courants anglais, faciles à retenir   |
| **EFF Short Word List** | 1296 mots | Mots plus courts, moins d'entropie par mot |
| **Diceware FR**         | 7776 mots | Liste française                            |

```bash
# Generate a 6-word passphrase with dice (manual process)
# Roll 5 dice 6 times, look up each result in the word list

# Or use a CSPRNG to simulate (less pure, but practical)
# Using EFF word list:
shuf -n 6 eff_large_wordlist.txt | awk '{print $2}'

# With keepassxc-cli
keepassxc-cli diceware -W 6

# With Bitwarden CLI
bw generate --passphrase --words 6 --separator '-'
```

### Diceware vs mot de passe aléatoire

| Critère                      | Diceware (`merge-clamp-hobby-plaid`) | Aléatoire (`x7$kQ!9mR2@p`)  |
| ---------------------------- | ------------------------------------ | --------------------------- |
| Mémorisation                 | Facile (mots du quotidien)           | Très difficile              |
| Saisie manuelle              | Facile                               | Pénible, erreurs fréquentes |
| Entropie (6 mots / 12 chars) | ~77 bits                             | ~78 bits                    |
| Résistance                   | Équivalente à longueur égale         | Équivalente                 |

> **L'avantage principal** : une passphrase diceware de 6 mots est aussi sûre qu'un mot de passe aléatoire de 12 caractères, mais beaucoup plus facile à retenir et à taper.

## Que faire en cas de fuite ? {#incident}

1. **Révoquer** immédiatement le secret compromis
2. **Régénérer** un nouveau secret
3. **Déployer** le nouveau secret dans l'application
4. **Auditer** les logs pour détecter un usage malveillant
5. **Nettoyer** l'historique Git si nécessaire (`git filter-repo`)
6. **Post-mortem** : comment la fuite s'est produite, comment l'éviter

## Pour aller plus loin {#next}

- [Chiffrement GPG](/help/gpg/advanced) — chiffrer des fichiers sensibles
- [Gros dépôts](/help/git/large) — nettoyer l'historique avec git filter-repo
- [Mises à jour et audit](/help/hardening/updates) — auditer la sécurité avec Lynis