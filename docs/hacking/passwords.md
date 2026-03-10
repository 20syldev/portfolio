---
title: Mots de passe et authentification
description: Stockage des mots de passe, types d'attaques, politiques de sécurité, gestionnaires de mots de passe et authentification multifacteur.
category: hacking
slug: passwords
order: 4
---

## Stockage des mots de passe {#storage}

L'histoire du stockage des mots de passe est une succession d'erreurs et d'améliorations :

```
Évolution du stockage des mots de passe
─────────────────────────────────────────

1970s           1990s         2000s             2010s+
Texte clair  →  MD5/SHA-1  →  SHA-256 + sel  →  bcrypt/argon2
(désastre)      (cassé)       (mieux)           (recommandé)
```

### Texte clair (à ne jamais faire)

Stocker les mots de passe en texte clair signifie que toute personne ayant accès à la base de données peut lire tous les mots de passe. Encore aujourd'hui, certains sites font cette erreur.

### Hachage simple (insuffisant)

On applique une fonction de hachage au mot de passe avant de le stocker. Le problème : deux utilisateurs avec le même mot de passe ont le même hash, et les [rainbow tables](/help/hacking/hashing) permettent de retrouver le mot de passe.

### Hachage + sel (minimum acceptable)

Un **sel** (salt) est une valeur aléatoire unique ajoutée au mot de passe avant le hachage. Même si deux utilisateurs ont le même mot de passe, leurs hashes sont différents.

### Algorithmes modernes (recommandé)

**bcrypt**, **argon2** et **scrypt** sont conçus spécifiquement pour le hachage de mots de passe. Ils sont volontairement lents et gourmands en ressources, rendant les attaques par force brute impraticables. Voir la [documentation sur les fonctions de hachage](/help/cryptography/hashing) pour la théorie.

## Format de /etc/shadow {#shadow}

Sous Linux, les mots de passe sont stockés dans `/etc/shadow`, lisible uniquement par root :

```
username:$6$salt$hash:18000:0:99999:7:::
│        │  │    │     │     │ │     │
│        │  │    │     │     │ │     └───  Reserved
│        │  │    │     │     │ └─────────  Days before password expires warning
│        │  │    │     │     └───────────  Maximum password age (days)
│        │  │    │     └─────────────────  Minimum password age (days)
│        │  │    └───────────────────────  Last password change (days since epoch)
│        │  └────────────────────────────  Salt (random)
│        └───────────────────────────────  Hash algorithm ID
└────────────────────────────────────────  Username
```

### Identifiants d'algorithme

| Préfixe | Algorithme | Statut               |
| ------- | ---------- | -------------------- |
| `$1$`   | MD5        | Obsolète             |
| `$5$`   | SHA-256    | Acceptable           |
| `$6$`   | SHA-512    | Standard actuel      |
| `$y$`   | yescrypt   | Moderne (Debian 12+) |
| `$2b$`  | bcrypt     | Recommandé           |

## Types d'attaques {#attacks}

| Attaque                 | Principe                                       | Vitesse  | Efficacité                          |
| ----------------------- | ---------------------------------------------- | -------- | ----------------------------------- |
| **Force brute**         | Tester toutes les combinaisons possibles       | Lente    | Garantie (si assez de temps)        |
| **Dictionnaire**        | Tester des mots d'une liste (rockyou.txt)      | Moyenne  | Bonne sur les mots de passe faibles |
| **Credential stuffing** | Réutiliser des identifiants de fuites connues  | Rapide   | Très bonne (réutilisation de MDP)   |
| **Password spraying**   | Tester un MDP courant sur beaucoup de comptes  | Rapide   | Contourne le verrouillage de compte |
| **Phishing**            | Tromper l'utilisateur pour qu'il donne son MDP | Variable | Très efficace                       |
| **Keylogger**           | Enregistrer les frappes clavier                | —        | Totale si installé                  |
| **Rainbow table**       | Table de hashes précalculés                    | Rapide   | Inutile si sel utilisé              |

### Force brute : le temps nécessaire

| Longueur | Minuscules seules | + majuscules | + chiffres + spéciaux |
| -------- | ----------------- | ------------ | --------------------- |
| 6 chars  | Quelques secondes | Minutes      | Heures                |
| 8 chars  | Heures            | Jours        | Semaines              |
| 10 chars | Mois              | Années       | Siècles               |
| 12 chars | Siècles           | Millénaires  | Incalculable          |

> Ces estimations dépendent de la puissance de calcul et de l'algorithme. Avec bcrypt, même 8 caractères restent difficiles à casser.

## « P@ssw0rd! » est mauvais {#bad-passwords}

Ce mot de passe **semble** complexe (majuscule, chiffre, caractère spécial, 9 caractères), mais il est en réalité dans **toutes les listes de dictionnaires**. Les substitutions classiques (`a→@`, `o→0`, `s→$`) sont connues et testées systématiquement par les outils de cracking.

Les 10 mots de passe les plus courants (d'après les fuites de données) :

1. `123456`
2. `password`
3. `123456789`
4. `12345678`
5. `qwerty`
6. `abc123`
7. `111111`
8. `password1`
9. `1234567`
10. `iloveyou`

### Ce qui fait un bon mot de passe

- **Longueur** > complexité — `cheval-correct-batterie-agrafe` est bien meilleur que `P@s$w0rd!`
- **Unique** par service — ne jamais réutiliser un mot de passe
- **Aléatoire** — généré par un gestionnaire de mots de passe, pas inventé par un humain

## Politiques de mots de passe {#policies}

Les recommandations modernes (NIST SP 800-63B, ANSSI) ont évolué :

| Ancienne recommandation         | Recommandation actuelle                 |
| ------------------------------- | --------------------------------------- |
| Changer tous les 90 jours       | Changer uniquement si compromis         |
| Imposer des caractères spéciaux | Encourager la longueur (12+ caractères) |
| Règles de complexité strictes   | Vérifier contre les listes de fuites    |
| Questions secrètes              | Ne plus utiliser (trop prévisibles)     |

## Gestionnaires de mots de passe {#managers}

Un **gestionnaire de mots de passe** génère, stocke et remplit automatiquement des mots de passe uniques et complexes pour chaque service.

| Outil         | Type                | Open source | Particularité                      |
| ------------- | ------------------- | ----------- | ---------------------------------- |
| **Bitwarden** | Cloud / self-hosted | Oui         | Gratuit, multi-plateforme          |
| **KeePassXC** | Local               | Oui         | Hors ligne, base de données locale |
| **1Password** | Cloud               | Non         | UX soignée, intégration entreprise |
| **pass**      | CLI (GPG)           | Oui         | Unix philosophy, chiffré avec GPG  |

> **Le seul mot de passe à retenir** : celui du gestionnaire. Tous les autres sont générés aléatoirement (20+ caractères).

## Authentification multifacteur (MFA) {#mfa}

La MFA combine **quelque chose que vous savez** (mot de passe) avec **quelque chose que vous avez** (téléphone, clé USB) ou **quelque chose que vous êtes** (biométrie).

| Facteur      | Type         | Exemples                                      | Sécurité  |
| ------------ | ------------ | --------------------------------------------- | --------- |
| Mot de passe | Connaissance | Chaîne de caractères                          | Faible    |
| SMS/Email    | Possession   | Code envoyé par SMS                           | Moyen     |
| TOTP         | Possession   | Application d'authentification (Authy, Aegis) | Bon       |
| Clé physique | Possession   | YubiKey, Titan (FIDO2/WebAuthn)               | Excellent |
| Biométrie    | Inhérence    | Empreinte digitale, visage                    | Bon       |

> **Éviter le SMS** comme second facteur si possible : vulnérable au SIM swapping. Préférer TOTP ou une clé physique FIDO2.

## Have I Been Pwned {#hibp}

[Have I Been Pwned](https://haveibeenpwned.com) permet de vérifier si un email ou un mot de passe apparaît dans des fuites de données connues.

```bash
# Check an email via the API (no API key needed for breaches)
curl "https://haveibeenpwned.com/api/v3/breachedaccount/user@example.com" \
  -H "hibp-api-key: YOUR_KEY"

# Check a password safely using the k-anonymity API
# Only the first 5 characters of the SHA-1 hash are sent
echo -n "password123" | sha1sum
# Take the first 5 chars and query the API
curl "https://api.pwnedpasswords.com/range/CBFDA"
```

> **Important** : L'API de mots de passe utilise le **k-anonymity** — votre mot de passe complet n'est jamais envoyé au serveur.

## Pour aller plus loin {#next}

- [Hash cracking](/help/hacking/hashing) — casser des hashes avec Hashcat et John the Ripper
- [Vulnérabilités web](/help/hacking/web) — attaques sur l'authentification des applications web
- [Fonctions de hachage](/help/cryptography/hashing) — théorie des fonctions de hachage cryptographiques