---
title: Intégration avec GitHub
description: Ajouter sa clé GPG à GitHub, obtenir le badge "Verified", activer le mode vigilant et vérifier le workflow complet.
category: gpg
slug: github
order: 5
---

## Exporter sa clé publique {#export}

GitHub a besoin de ta clé publique pour vérifier tes signatures. Exporte-la au format ASCII :

```bash
gpg --armor --export 6E4F9B11A8475F3D
```

```
-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZ...
...
-----END PGP PUBLIC KEY BLOCK-----
```

Copie **tout** le bloc, y compris les lignes `-----BEGIN` et `-----END`.

> **Astuce** : Pour copier directement dans le presse-papier :
>
> ```bash
> # Linux (X11)
> gpg --armor --export 6E4F9B11A8475F3D | xclip -selection clipboard
>
> # Linux (Wayland)
> gpg --armor --export 6E4F9B11A8475F3D | wl-copy
>
> # macOS
> gpg --armor --export 6E4F9B11A8475F3D | pbcopy
> ```

## Ajouter la clé à GitHub {#add}

1. Va sur [github.com](https://github.com) et connecte-toi
2. Clique sur ton avatar en haut à droite → **Settings**
3. Dans la barre latérale, clique sur **SSH and GPG keys**
4. Dans la section "GPG keys", clique sur **New GPG key**
5. Donne un titre descriptif (ex : `ed25519 - laptop`)
6. Colle le bloc de clé publique exporté à l'étape précédente
7. Clique sur **Add GPG key**

GitHub valide la clé et l'associe à ton compte. Tous les commits signés avec cette clé et dont l'email correspond à ton compte seront marqués "Verified".

## Le badge "Verified" {#verified}

Quand tu pousses un commit signé, GitHub affiche un badge à côté du message de commit. Voici les différents statuts possibles :

| Badge                   | Signification                                | Cause                                                                       |
| ----------------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| **Verified** (vert)     | Signature valide, clé reconnue               | Commit signé avec une clé GPG ajoutée au compte GitHub, email correspondant |
| **Partially verified**  | Signature valide mais conditions incomplètes | L'email du commit ne correspond pas exactement à celui du compte GitHub     |
| **Unverified** (orange) | Signature présente mais non validée          | Clé non ajoutée à GitHub, clé expirée, ou email ne correspondant pas        |
| Pas de badge            | Commit non signé                             | Pas de signature GPG sur le commit                                          |

### Conditions pour obtenir "Verified"

Pour qu'un commit affiche le badge vert, **toutes** ces conditions doivent être remplies :

1. Le commit est signé avec une clé GPG valide (non expirée, non révoquée)
2. La clé publique correspondante est ajoutée à ton compte GitHub
3. L'email du commit (`user.email` dans Git) correspond à un email vérifié de ton compte GitHub
4. La clé GPG contient un UID avec ce même email

## Mode vigilant {#vigilant}

Par défaut, GitHub marque les commits non signés comme "neutres" (sans badge). Le **mode vigilant** change ce comportement :

- Tous les commits **non signés** ou signés avec une clé **non reconnue** affichent un badge "Unverified"
- Seuls les commits correctement signés affichent "Verified"

### Activer le mode vigilant

1. Va dans **Settings** → **SSH and GPG keys**
2. Dans la section "Vigilant mode", coche **Flag unsigned commits as unverified**

> **Bonne pratique** : Active le mode vigilant uniquement quand tu es sûr que **tous** tes commits sont signés (y compris les commits de merge, les squash via l'interface GitHub, etc.). Sinon, tu verras beaucoup de badges "Unverified" sur tes propres commits.

## Email et identité {#email}

L'email est le lien entre ta clé GPG, Git et GitHub. Les trois doivent correspondre.

### Vérifier la cohérence

```bash
# Email in Git config
git config --global user.email
# → alice@example.com

# Email in GPG key
gpg --list-keys --keyid-format=long
# → uid [ultimate] Alice Dupont <alice@example.com>
```

L'email doit aussi être **vérifié** dans les paramètres GitHub (Settings → Emails).

### Utiliser l'email noreply de GitHub

Si tu préfères ne pas exposer ton email dans les commits, tu peux utiliser l'adresse noreply fournie par GitHub :

```
ID+username@users.noreply.github.com
```

Dans ce cas, ajoute cet email comme UID dans ta clé GPG :

```bash
gpg --edit-key alice@example.com
gpg> adduid
# Enter the noreply email
gpg> save
```

Puis mets à jour ta clé sur GitHub (supprimer et ré-ajouter la clé publique mise à jour).

## Vérifier que tout fonctionne {#test}

Voici le workflow complet pour tester ta configuration de bout en bout :

### 1. Vérifier la configuration Git

```bash
git config --global user.signingkey
# → 6E4F9B11A8475F3D

git config --global commit.gpgsign
# → true
```

### 2. Créer un commit de test

```bash
echo "test" >> test.txt
git add test.txt
git commit -m "MINOR: app: Test GPG signature"
```

Si la passphrase est demandée et le commit réussit, la signature fonctionne.

### 3. Vérifier la signature localement

```bash
git verify-commit HEAD
```

```
gpg: Signature made ...
gpg: Good signature from "Alice Dupont <alice@example.com>" [ultimate]
```

### 4. Pousser et vérifier sur GitHub

```bash
git push
```

Va sur ton dépôt GitHub, ouvre le dernier commit. Tu devrais voir le badge **Verified** à côté du message.

### 5. Nettoyer le commit de test

```bash
git reset --soft HEAD~1
git restore --staged test.txt
rm test.txt
```

## Pour aller plus loin {#next}

- [Utilisation avancée](/help/gpg/advanced) — export, import, révocation et chiffrement
- [Dépannage](/help/gpg/troubleshooting) — résoudre les problèmes de badge "Unverified"
- [Signer ses commits](/help/gpg/signing) — revenir aux détails de la configuration Git