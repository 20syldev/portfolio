---
title: Personnaliser le logo de boot Linux Mint
description: Remplacer le logo Linux Mint affiché au démarrage (Plymouth) par une image personnalisée.
category: linux
slug: plymouth
order: 1
---

## Introduction {#intro}

**Plymouth** est le système qui gère l'écran de démarrage (splash screen) sous Linux Mint. C'est lui qui affiche le logo animé pendant le boot et l'arrêt de la machine.

Ce guide explique comment remplacer le logo Mint par votre propre image.

## Prérequis {#prerequisites}

- Accès `sudo` sur la machine
- Une image **PNG** prête à l'emploi (votre logo personnalisé)

## Structure du thème {#structure}

Le thème par défaut se trouve dans `/usr/share/plymouth/themes/mint-logo/` :

| Fichier(s)                    | Rôle                                      |
| ----------------------------- | ----------------------------------------- |
| `mint-logo.plymouth`          | Fichier de configuration du thème         |
| `animation-0001.png` à `0036` | 36 frames de l'animation affichée au boot |
| `throbber-0001.png` à `0030`  | 30 frames de l'indicateur de chargement   |
| `watermark.png`               | Petit logo affiché en bas de l'écran      |
| `bgrt-fallback.png`           | Image de fallback BIOS/UEFI               |

> **Point clé** : Ce sont les fichiers `animation-*.png` et `throbber-*.png` qui déterminent ce qui s'affiche réellement au boot, pas le paramètre `Logo=` du fichier `.plymouth`.

## Étapes {#steps}

Toutes les commandes sont à exécuter depuis le répertoire du thème :

```bash
cd /usr/share/plymouth/themes/mint-logo
```

### 1. Copier votre image dans le répertoire du thème {#copy}

```bash
sudo cp ~/Downloads/votre-logo.png /usr/share/plymouth/themes/mint-logo/
```

### 2. Sauvegarder le logo original {#backup}

```bash
sudo mv mint-logo.png mint-logo.png.bak
```

### 3. Créer un PNG transparent pour neutraliser le watermark {#blank}

On crée un PNG 1x1 pixel transparent qui servira à "effacer" le watermark :

```bash
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==" | base64 -d | sudo tee blank.png > /dev/null
```

### 4. Remplacer le watermark {#watermark}

```bash
sudo cp blank.png watermark.png
```

### 5. Remplacer les frames d'animation {#animation}

C'est **cette étape** qui change réellement le visuel au boot :

```bash
for i in {0001..0036}; do sudo cp votre-logo.png animation-$i.png; done
```

### 6. Remplacer les frames du throbber {#throbber}

```bash
for i in {0001..0030}; do sudo cp votre-logo.png throbber-$i.png; done
```

### 7. Appliquer les changements {#apply}

Plymouth est intégré dans l'initramfs. Il faut le reconstruire pour que les modifications prennent effet :

```bash
sudo update-initramfs -u
```

Redémarrez pour voir le résultat.

## Pièges à éviter {#pitfalls}

### Ce qui compte, ce sont les fichiers PNG

La méthode testée et validée ici consiste à remplacer directement les fichiers `animation-*.png` et `throbber-*.png`. C'est la certitude que le visuel change au boot. Modifier uniquement le paramètre `Logo=` dans `mint-logo.plymouth` n'a pas été testé isolément, donc son effet exact n'est pas garanti.

### `sudo echo > fichier` ne fonctionne pas

La redirection `>` est exécutée par le shell courant (votre utilisateur), pas par `sudo`. Elle échouera en écriture dans un répertoire root :

```bash
# Ne marche PAS :
sudo echo "data" > /usr/share/plymouth/themes/mint-logo/blank.png

# Fonctionne :
echo "data" | sudo tee /usr/share/plymouth/themes/mint-logo/blank.png > /dev/null
```

### Remplacer tous les éléments visuels

Si vous ne remplacez que l'animation sans toucher au watermark et au throbber, des résidus de l'ancien thème resteront visibles.

## Restauration {#restore}

Pour revenir au thème Mint d'origine :

```bash
cd /usr/share/plymouth/themes/mint-logo
sudo mv mint-logo.png.bak mint-logo.png
sudo apt reinstall plymouth-theme-mint-logo
sudo update-initramfs -u
```

La réinstallation du paquet restaure tous les fichiers originaux (animation, throbber, watermark).

## Résumé {#summary}

| Étape                           | Commande principale                                                       |
| ------------------------------- | ------------------------------------------------------------------------- |
| Copier l'image                  | `sudo cp votre-logo.png /usr/share/plymouth/themes/mint-logo/`            |
| Sauvegarder l'original          | `sudo mv mint-logo.png mint-logo.png.bak`                                 |
| Créer blank.png                 | `echo "..." \| base64 -d \| sudo tee blank.png`                           |
| Neutraliser le watermark        | `sudo cp blank.png watermark.png`                                         |
| Remplacer l'animation (36 imgs) | `for i in {0001..0036}; do sudo cp votre-logo.png animation-$i.png; done` |
| Remplacer le throbber (30 imgs) | `for i in {0001..0030}; do sudo cp votre-logo.png throbber-$i.png; done`  |
| Appliquer                       | `sudo update-initramfs -u`                                                |