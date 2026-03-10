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