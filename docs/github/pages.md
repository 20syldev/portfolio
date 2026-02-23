---
title: Héberger un site sur GitHub Pages
description: Guide pas à pas pour déployer un site statique avec GitHub Pages.
category: github
slug: pages
order: 1
---

## Introduction {#intro}

**GitHub Pages** est un service gratuit proposé par GitHub qui permet d'héberger des sites web statiques directement depuis un dépôt GitHub. Il est parfait pour les portfolios, la documentation, ou tout projet ne nécessitant pas de serveur backend.

Votre site sera accessible à une adresse du type `https://<votre-utilisateur>.github.io/<nom-du-repo>`.

### Quelques termes à connaître

Avant de commencer, voici les termes que vous allez rencontrer :

- **Dépôt (repository)** : Un dossier de projet hébergé sur GitHub, qui contient tous vos fichiers et l'historique de leurs modifications.
- **Clone** : Copier un dépôt distant (sur GitHub) vers votre ordinateur pour travailler dessus localement.
- **Commit** : Une sauvegarde de vos modifications. Chaque commit décrit ce que vous avez changé.
- **Push** : Envoyer vos commits (vos sauvegardes locales) vers GitHub pour les rendre disponibles en ligne.
- **Branche** : Une version parallèle de votre projet. Par défaut, vous travaillez sur la branche `main`.

## Avec GitHub Desktop {#desktop}

Cette méthode utilise **GitHub Desktop**, une application graphique qui permet de gérer vos dépôts Git sans avoir à taper de commandes.

### Étape 1 : Préparer votre projet

1. **Créer les fichiers du site** :
    - Assurez-vous d'avoir une structure de base pour votre site, par exemple :

```
/index.html   (obligatoire)
/style.css    (optionnel)
/images/      (optionnel)
etc...
```

2. **Vérifiez vos fichiers** :
    - Le fichier `index.html` doit être dans le dossier racine de votre projet. C'est le fichier d'accueil par défaut pour GitHub Pages.

> **Astuce** : Si votre fichier principal ne s'appelle pas `index.html`, GitHub Pages ne saura pas quelle page afficher par défaut.

### Étape 2 : Créer un dépôt GitHub

1. Connectez-vous à votre compte GitHub (ou créez-en un sur [github.com](https://github.com)).
2. Cliquez sur le bouton **+** en haut à droite, puis sur **New Repository**.
3. Remplissez les informations :
    - **Repository Name** : Nommez votre dépôt (ex. `portfolio`).
    - **Public/Private** : Choisissez `Public` pour héberger un site (GitHub Pages nécessite un dépôt public sur un compte gratuit).
    - **Initialize Repository** : Cochez l'option "Add a README file" si vous voulez avoir une base.
4. Cliquez sur **Create Repository**.

### Étape 3 : Cloner le dépôt avec GitHub Desktop

1. Téléchargez et installez **[GitHub Desktop](https://desktop.github.com/download)** si ce n'est pas déjà fait.
2. Connectez-vous avec votre compte GitHub.
3. Dans GitHub Desktop, allez sur **File > Clone Repository** ou cliquez directement sur le dépôt si c'est votre premier.
4. Choisissez l'onglet **GitHub.com** et sélectionnez le dépôt que vous venez de créer.
5. Sélectionnez un dossier local où le dépôt sera cloné.

> **Astuce** : Retenez bien l'emplacement du dossier cloné, c'est là que vous devrez copier vos fichiers.

### Étape 4 : Ajouter vos fichiers de site au dépôt local

1. Copiez tous vos fichiers du projet (index.html, styles, images, etc.) dans le dossier cloné.
2. Dans GitHub Desktop, les fichiers ajoutés apparaîtront sous l'onglet **Changes**.
3. Ajoutez un message de commit (ex. "Ajout des fichiers du site") dans le champ en bas à gauche.
    - Vous pouvez sélectionner les fichiers un par un ou les lignes à "commit" si vous souhaitez détailler vos **commits**.
4. Cliquez sur **Commit to main** (ou la branche que vous souhaitez).

### Étape 5 : Publier sur GitHub

1. Dans GitHub Desktop, cliquez sur **Push origin** pour envoyer vos fichiers sur GitHub.

> Une fois le push terminé, vos fichiers sont visibles sur votre dépôt GitHub en ligne.

### Étape 6 : Activer GitHub Pages

1. Retournez sur votre dépôt GitHub en ligne.
2. Cliquez sur **Settings** (en haut à droite du dépôt).
3. Descendez jusqu'à **Pages** (dans la barre latérale gauche).
4. Dans la section **Build and Deployment**, choisissez :
    - **Source** : `GitHub Actions`.
    - **Static HTML** : Sélectionnez le workflow **Static HTML** puis `configure` et "**Commit Changes...**".
5. Retournez sur **Pages** et cochez "**Enforce HTTPS**".
6. Une URL sera générée pour votre site (ex. `https://<votre-utilisateur>.github.io/portfolio`).

### Étape 7 : Vérifier votre site

- Attendez quelques minutes (le premier déploiement peut prendre jusqu'à 5 minutes).
- Accédez à l'URL fournie pour voir votre site en ligne.
- Si la page affiche une erreur 404, vérifiez que votre fichier `index.html` est bien à la racine du dépôt.

## Avec le terminal (CLI) {#cli}

Cette méthode utilise **Git en ligne de commande**. Elle est plus rapide une fois maîtrisée, et ne nécessite aucune application supplémentaire à part Git.

### Étape 1 : Préparer votre projet

1. **Créer votre site** :
    - Préparez un dossier contenant vos fichiers HTML, CSS, et autres ressources nécessaires.
    - Assurez-vous que le fichier `index.html` se trouve à la racine du dossier (c'est la page d'accueil par défaut).

2. **Installer Git** :
    - Téléchargez et installez Git depuis [git-scm.com](https://git-scm.com/install).
    - Vérifiez l'installation avec la commande suivante :

```bash
git --version
```

> Si la commande affiche un numéro de version (ex. `git version 2.43.0`), Git est correctement installé.

### Étape 2 : Créer un dépôt GitHub

1. Connectez-vous à votre compte GitHub.
2. Cliquez sur **+** (en haut à droite) > **New Repository**.
3. Donnez un nom à votre dépôt (par exemple `portfolio`), choisissez `Public` et cliquez sur l'option "Add a README file" si vous voulez avoir une base.
4. Cliquez sur **Create Repository**.

### Étape 3 : Initialiser un dépôt local

1. **Accédez à votre projet localement** :
   Ouvrez un terminal dans le dossier où se trouvent vos fichiers du site :

```bash
cd /chemin/vers/portfolio
```

2. **Initialiser Git** :
   Si ce n'est pas déjà fait, initialisez un dépôt Git dans ce dossier :

```bash
git init
```

3. **Ajouter les fichiers** :

```bash
git add .
```

> Cette commande ajoute **tous** les fichiers du dossier au prochain commit. Si vous voulez ajouter un fichier spécifique, utilisez `git add index.html` par exemple.

4. **Créer un commit initial** :

```bash
git commit -m "Initial commit"
```

5. **Lier votre dépôt local au dépôt GitHub** :
   Remplacez `<votre-nom-utilisateur>` et `<nom-du-repo>` par les informations appropriées :

```bash
git remote add origin https://github.com/<votre-nom-utilisateur>/<nom-du-repo>.git
```

### Étape 4 : Envoyer les fichiers vers GitHub

1. **Pousser les fichiers sur le dépôt distant** :

```bash
git branch -M main
git push -u origin main
```

> La première commande renomme votre branche en `main` (convention standard). La seconde envoie vos fichiers et lie votre branche locale à la branche distante.

### Étape 5 : Activer GitHub Pages

1. Allez sur votre dépôt GitHub en ligne.
2. Cliquez sur **Settings**.
3. Dans la section **Pages** (menu à gauche), puis **Build and Deployment** configurez :
    - **Source** : `GitHub Actions`.
    - **Static HTML** : Sélectionnez le workflow **Static HTML** puis `configure` et "**Commit Changes...**".
4. Retournez sur **Pages** et cochez "**Enforce HTTPS**".
5. Une URL sera générée pour accéder à votre site (par exemple `https://<votre-utilisateur>.github.io/mon-site-web`).

### Étape 6 : Vérifier votre site

- Attendez quelques minutes pour que GitHub déploie les fichiers.
- Visitez l'URL générée pour voir votre site.

### Étape 7 : Mettre à jour votre site

À chaque modification de votre site, il suffit de répéter ces trois commandes :

```bash
git add .
git commit -m "Mise à jour du site"
git push
```

Votre site sera automatiquement mis à jour sur GitHub Pages après chaque push.

## Workflow GitHub Actions {#workflow}

Pour un contrôle plus avancé du déploiement, vous pouvez créer un fichier de workflow GitHub Actions. Ce fichier automatise le processus de déploiement à chaque push.

Créez le fichier `.github/workflows/deploy.yml` dans votre dépôt :

```yml
name: Deploy Portfolio

on:
    push:
        branches: ["master"]

    workflow_dispatch:

permissions:
    contents: read
    pages: write
    id-token: write

concurrency:
    group: "pages"
    cancel-in-progress: false

jobs:
    deploy:
        environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v4
            - name: Setup Pages
              uses: actions/configure-pages@v4
            - name: Upload artifact
              uses: actions/upload-pages-artifact@v3
              with:
                  path: "."
            - name: Deploy to GitHub Pages
              id: deployment
              uses: actions/deploy-pages@v4
```

Ce workflow se déclenche automatiquement à chaque push sur la branche `master`. Il télécharge votre code, configure GitHub Pages, et déploie le contenu du dépôt.

> **Note** : Adaptez le nom de la branche (`master` ou `main`) selon la configuration de votre dépôt.

Cet exemple convient pour un site HTML statique. Pour des projets utilisant un framework, consultez les guides dédiés : [Next.js](./workflows/next.md), [VitePress](./workflows/vitepress.md).

## Problèmes de chemins d'accès {#paths}

### Le problème des chemins absolus

Lorsque votre site est hébergé sur `https://<votre-utilisateur>.github.io/<nom-du-repo>`, vous pouvez rencontrer des problèmes avec les chemins absolus dans votre code.

**Exemple du problème :**

- Votre site est hébergé sur : `https://johndoe.github.io/portfolio`
- Vous utilisez un chemin absolu dans votre HTML : `<link rel="stylesheet" href="/style.css">`
- Le navigateur cherchera le fichier à : `https://johndoe.github.io/style.css`
- Alors qu'il devrait être à : `https://johndoe.github.io/portfolio/style.css`

Le `/` au début du chemin renvoie à la racine du domaine (`github.io`), et non à la racine de votre projet.

### Solutions possibles

#### Solution 1 : Utiliser des chemins relatifs

Remplacez tous vos chemins absolus par des chemins relatifs :

```html
<!-- Au lieu de -->
<link rel="stylesheet" href="/style.css" />
<script src="/script.js"></script>
<img src="/images/logo.png" />

<!-- Utilisez -->
<link rel="stylesheet" href="./style.css" />
<script src="./script.js"></script>
<img src="./images/logo.png" />
```

**Avantage** : Fonctionne partout, même en local.
**Inconvénient** : Peut devenir complexe dans les sous-dossiers (`../../style.css`).

#### Solution 2 : Nommer le dépôt `<votre-utilisateur>.github.io`

Si vous nommez votre dépôt exactement comme votre nom d'utilisateur suivi de `.github.io`, votre site sera hébergé directement sur `https://<votre-utilisateur>.github.io` sans sous-dossier.

**Exemple :**

- Nom du dépôt : `johndoe.github.io`
- URL du site : `https://johndoe.github.io/`

Dans ce cas, les chemins absolus avec `/` fonctionnent correctement car ils pointent vers la racine de votre site.

**Avantage** : Les chemins absolus fonctionnent.
**Inconvénient** : Vous ne pouvez avoir qu'un seul dépôt de ce type par compte, et le nom n'est pas très descriptif.

#### Solution 3 : Utiliser un nom de domaine personnalisé (Recommandé)

La meilleure solution est d'utiliser votre propre nom de domaine. Cela résout tous les problèmes de chemins et donne une apparence plus professionnelle à votre site.

**Avantages :**

- Chemins absolus fonctionnels (le `/` pointe vers la racine de votre domaine)
- URL personnalisée et mémorable (ex: `https://prenom.fr`)
- Possibilité de configurer des sous-domaines (ex: `blog.prenom.fr`)
- Emails professionnels (ex: `contact@prenom.fr`)
- Système catch-all pour recevoir tous les emails du domaine

Pour configurer un domaine personnalisé, consultez nos guides détaillés pour les principaux fournisseurs :

- [Configuration avec NameCheap](/help/github/configuration/namecheap)
- [Configuration avec GoDaddy](/help/github/configuration/godaddy)
- [Configuration avec OVH](/help/github/configuration/ovh)
- [Configuration avec Cloudflare](/help/github/configuration/cloudflare)

### Résumé

| Solution                 | Chemins absolus | Complexité  | Professionnalisme |
| ------------------------ | --------------- | ----------- | ----------------- |
| Chemins relatifs         | Non             | Faible      | Moyen             |
| Dépôt `<user>.github.io` | -               | Faible      | Moyen             |
| **Domaine personnalisé** | **Oui**         | **Moyenne** | **Élevé**         |

> **Recommandation** : Pour un projet personnel ou professionnel sérieux, investissez dans un nom de domaine (environ 10-15€/an). C'est peu coûteux et apporte de nombreux avantages.