---
title: Guide du style de commit
description: Conventions et bonnes pratiques pour rédiger des messages de commit clairs et structurés.
category: git
slug: commit
order: 7
---

## Introduction {#intro}

Un bon message de commit permet de comprendre rapidement **pourquoi** une modification a été apportée, **quelle est sa nature**, et **quel est son impact potentiel** sur le projet. Ce guide présente une convention de nommage structurée pour vos commits.

### Pourquoi suivre un style de commit ?

- **Historique lisible** : Facilite la compréhension des changements au fil du temps
- **Revue de code efficace** : Les reviewers comprennent rapidement l'intention
- **Génération de changelog** : Permet d'automatiser la création de notes de version
- **Recherche facilitée** : Retrouver un changement spécifique devient simple
- **Meilleure collaboration** : Toute l'équipe parle le même langage

## Structure d'un message de commit {#structure}

Un message de commit suit cette structure :

```
TYPE/IMPORTANCE: scope: Description courte

Description détaillée optionnelle expliquant le pourquoi et le contexte de la modification.
```

### Format court (recommandé pour les petits changements)

```
TYPE/IMPORTANCE: scope: Description
```

**Exemple :**

```
FEATURE/MINOR: auth: Add password strength indicator
```

### Format avec importance implicite (si MEDIUM)

Lorsque l'importance est **MEDIUM**, vous pouvez l'omettre :

```
TYPE: scope: Description
```

**Exemple :**

```
BUG: login: Fix redirect after authentication
```

## Les trois critères principaux {#criteria}

Chaque commit doit indiquer trois informations essentielles :

### 1. Type (Nature du changement) {#type}

Le type décrit la **nature** de la modification apportée.

| Type        | Description                           | Quand l'utiliser                                                              |
| ----------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| **FEATURE** | Nouvelle fonctionnalité ou changement | Ajout de code qui apporte quelque chose de nouveau                            |
| **BUG**     | Correction d'un bug                   | Résolution d'un comportement incorrect                                        |
| **CLEANUP** | Nettoyage de code                     | Suppression de code mort, de warnings, reformatage (aucun impact fonctionnel) |
| **DOC**     | Documentation                         | Modification de README, commentaires, guides, etc.                            |
| **REORG**   | Réorganisation du code                | Déplacement de blocs de code, refactoring structurel                          |
| **BUILD**   | Système de build                      | Modifications liées au build, dépendances, configuration                      |
| **OPTIM**   | Optimisation                          | Amélioration des performances sans changer la fonctionnalité                  |
| **RELEASE** | Publication de version                | Tag de release, changement de version                                         |
| **LICENSE** | Licence                               | Modifications de licence (important pour les distributions)                   |
| **REGTEST** | Tests de régression                   | Ajout ou mise à jour de tests                                                 |
| **WIP**     | Travail en cours                      | Commit temporaire (à éviter sur main/master)                                  |

### 2. Importance (Impact et risque) {#importance}

L'importance reflète le **risque** ou l'**impact** du changement.

| Importance   | Signification                      | Exemples                                         |
| ------------ | ---------------------------------- | ------------------------------------------------ |
| **MINOR**    | Impact minimal, risque très faible | Typo, ajout de log, petite optimisation          |
| **MEDIUM**   | Impact modéré, risque standard     | Correction de bug classique, feature simple      |
| **MAJOR**    | Impact important, risque élevé     | Refactoring important, changement d'architecture |
| **CRITICAL** | Impact critique, urgence           | Faille de sécurité, bug bloquant en production   |

> **Note** : **MEDIUM** est le niveau par défaut. Si vous ne précisez pas l'importance, on assume que c'est MEDIUM.

### 3. Scope (Portée du changement) {#scope}

Le scope indique **quelle partie** du projet est affectée.

**Exemples de scopes :**

- `auth` : Authentification
- `ui` : Interface utilisateur
- `api` : API backend
- `db` : Base de données
- `config` : Configuration
- `docs` : Documentation
- `tests` : Tests
- `build` : Build system
- `ci` : Intégration continue
- `deps` : Dépendances

> **Conseil** : Adaptez les scopes à votre projet. Utilisez des noms courts et cohérents.

## Exemples de messages de commit {#examples}

### Bonnes pratiques

```bash
# Feature simple
FEATURE/MINOR: navbar: Add dark mode toggle button

# Bug critique
BUG/CRITICAL: auth: Fix SQL injection vulnerability in login

# Optimisation majeure
OPTIM/MAJOR: database: Implement query caching with Redis

# Documentation
DOC/MINOR: readme: Update installation instructions

# Nettoyage
CLEANUP/MINOR: utils: Remove unused helper functions

# Réorganisation importante
REORG/MAJOR: components: Restructure folder hierarchy

# Build
BUILD/MINOR: deps: Update React to v18.2.0

# Test
REGTEST/MINOR: auth: Add integration tests for password reset

# Format court (MEDIUM implicite)
BUG: api: Fix null pointer in user endpoint
FEATURE: dashboard: Add analytics widget
```

### Mauvaises pratiques

```bash
# Trop vague
fix bug

# Pas de type/importance
updated files

# Trop long dans le titre
FEATURE/MINOR: auth: Add a new authentication system with JWT tokens, refresh tokens, password reset, email verification, and two-factor authentication

# Majuscules inconsistantes
feature/MINOR: Auth: Add Login

# Description inutile
CLEANUP/MINOR: cleanup: Cleaned up some code

# Message en français alors que le code est en anglais
FEATURE/MINOR: ajout de la page de contact
```

## Format détaillé avec body {#format}

Pour les changements complexes, ajoutez une description détaillée après une ligne vide :

```
FEATURE/MAJOR: api: Implement GraphQL endpoint

This commit introduces a GraphQL API alongside the existing REST API.
The GraphQL endpoint provides more flexible data fetching and reduces
the number of requests needed for complex queries.

Changes:
- Add Apollo Server integration
- Create GraphQL schema for User and Post types
- Implement resolvers for queries and mutations
- Add authentication middleware for GraphQL

Breaking change: The /api/v1/posts endpoint now returns different
date format. Update client code accordingly.
```

### Anatomie d'un message détaillé

1. **Ligne de titre** (max 72 caractères) : `TYPE/IMPORTANCE: scope: Description`
2. **Ligne vide** (obligatoire)
3. **Body** (optionnel) : Explication détaillée du "pourquoi" et du contexte
4. **Footer** (optionnel) : Références à des issues, breaking changes, etc.

## Cas particuliers {#special}

### Multiple scopes

Si plusieurs domaines sont affectés, séparez-les par une virgule ou utilisez un scope plus général :

```bash
# Option 1 : Séparer par virgule
FEATURE/MINOR: auth,api: Add OAuth2 authentication

# Option 2 : Scope plus général
FEATURE/MINOR: backend: Add OAuth2 authentication
```

### Breaking changes

Pour les changements qui cassent la compatibilité, ajoutez `BREAKING CHANGE:` dans le footer :

```
FEATURE/MAJOR: api: Change response format to JSON:API spec

BREAKING CHANGE: All API endpoints now return data following the
JSON:API specification. Client code must be updated to handle the
new response structure.
```

### Références à des issues

Ajoutez les références en fin de message :

```
BUG/MAJOR: checkout: Fix payment processing timeout

The payment gateway timeout was set to 5s, causing failures
during high traffic. Increased to 30s and added retry logic.

Fixes #123
Related to #456
```

### Commits de merge

Pour les merges, utilisez un format simple :

```bash
# Merge de feature branch
MERGE: feature/user-dashboard into main

# Merge de bugfix
MERGE: hotfix/critical-bug into main
```

## Workflow recommandé {#workflow}

### Avant de commiter

1. **Relisez vos changements** : `git diff`
2. **Regroupez logiquement** : Un commit = une idée/fonctionnalité
3. **Testez** : Assurez-vous que le code fonctionne

### Rédiger le message

1. **Déterminez le TYPE** : Quelle est la nature du changement ?
2. **Évaluez l'IMPORTANCE** : Quel est le risque/impact ?
3. **Identifiez le SCOPE** : Quelle partie est affectée ?
4. **Écrivez une description claire** : Que fait ce commit ?

### Exemples de commandes git

```bash
# Commit simple
git commit -m "FEATURE/MINOR: auth: Add password strength indicator"

# Commit avec description détaillée
git commit -m "FEATURE/MAJOR: api: Implement GraphQL endpoint" -m "This commit introduces a GraphQL API alongside the existing REST API..."

# Ou utilisez un éditeur pour écrire un message plus long
git commit
```

## Conseils supplémentaires {#tips}

### Langue

- **Soyez cohérent** : Choisissez anglais OU français pour tout le projet
- **Préférez l'anglais** pour les projets open-source
- **Utilisez l'impératif** : "Add" pas "Added", "Fix" pas "Fixed"
    - `Add authentication`
    - `Added authentication`

### Taille du titre

- **Maximum 72 caractères** pour le titre
- Si c'est trop long, déplacez les détails dans le body
- Soyez concis mais précis

### Atomicité

- **Un commit = un changement logique**
- Ne mélangez pas plusieurs fonctionnalités dans un commit
- Découpez les gros changements en plusieurs commits

### Fréquence

- **Commitez souvent** mais pas trop
- Chaque commit doit avoir du sens individuellement
- Évitez les commits "WIP" sur les branches principales

## Outils et automatisation {#tools}

### Git hooks

Utilisez des git hooks pour valider le format des commits :

```bash
# .git/hooks/commit-msg
#!/bin/bash

commit_msg=$(cat "$1")
pattern="^(FEATURE|BUG|CLEANUP|DOC|REORG|BUILD|OPTIM|RELEASE|LICENSE|REGTEST|WIP)(/(MINOR|MEDIUM|MAJOR|CRITICAL))?: [a-z-]+: .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "Format de commit invalide!"
    echo "Format attendu: TYPE/IMPORTANCE: scope: Description"
    echo "Exemple: FEATURE/MINOR: auth: Add login button"
    exit 1
fi
```

### Commitizen / Conventional Commits

Pour des projets JavaScript/TypeScript, utilisez :

- **Commitizen** : Interface interactive pour créer des commits
- **Conventional Commits** : Standard similaire largement adopté

### Changelog automatique

Avec des commits bien formatés, générez automatiquement un changelog :

```bash
# Avec conventional-changelog (npm)
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```

## Récapitulatif {#summary}

### Format standard

```
TYPE/IMPORTANCE: scope: Description courte
```

### Composants

| Composant       | Obligatoire             | Exemples                                 |
| --------------- | ----------------------- | ---------------------------------------- |
| **TYPE**        | Oui                     | FEATURE, BUG, DOC, CLEANUP, etc.         |
| **IMPORTANCE**  | Non (MEDIUM par défaut) | MINOR, MEDIUM, MAJOR, CRITICAL           |
| **scope**       | Oui                     | auth, ui, api, docs, etc.                |
| **Description** | Oui                     | Add login button, Fix null pointer, etc. |

### Checklist avant de commiter

- [ ] &nbsp; Le TYPE décrit bien la nature du changement
- [ ] &nbsp; L'IMPORTANCE reflète le risque/impact
- [ ] &nbsp; Le scope est précis et court
- [ ] &nbsp; La description est claire et concise (impératif)
- [ ] &nbsp; Le titre fait moins de 72 caractères
- [ ] &nbsp; Le code a été testé
- [ ] &nbsp; Les changements sont logiquement groupés

## Exemples par type de projet {#projects}

### Projet web frontend

```bash
FEATURE/MINOR: button: Add loading state animation
BUG/MAJOR: form: Fix validation not triggering on blur
OPTIM/MINOR: images: Lazy load hero section images
CLEANUP/MINOR: css: Remove unused utility classes
DOC/MINOR: readme: Add deployment instructions
```

### Projet API backend

```bash
FEATURE/MAJOR: auth: Implement JWT authentication
BUG/CRITICAL: api: Fix race condition in user creation
OPTIM/MAJOR: db: Add indexes on frequently queried columns
REGTEST/MINOR: users: Add integration tests for CRUD operations
BUILD/MINOR: docker: Update base image to Node 20
```

### Projet bibliothèque/package

```bash
FEATURE/MAJOR: api: Add support for async callbacks
BUG/MINOR: parser: Handle edge case with empty strings
DOC/MAJOR: readme: Complete API documentation
RELEASE/MAJOR: version: Bump to v2.0.0
LICENSE/MAJOR: license: Update to MIT license
```

En suivant ce guide, vos messages de commit seront bien plus clairs et cohérents ! Pour maîtriser les commandes qui accompagnent ces commits, consultez les guides : [Workflow quotidien](/help/git/workflow), [Branches et fusion](/help/git/branches), [Corriger des erreurs](/help/git/corrections).