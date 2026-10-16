---
name: Kao
description: Éditeur d'avatars manga dans le navigateur, avec export haute définition sans perte.
longDescription: "Éditeur d'avatars manga développé avec Next.js 16 et TypeScript, dont le moteur d'édition, un film Flash, tourne dans le navigateur grâce à Ruffle. L'avatar est redessiné depuis ses vecteurs et exporté de 360 à 4320 px, sans jamais être agrandi, et rien ne quitte le navigateur."
tags: ["Next.js", "TypeScript", "Ruffle", "Avatar"]
github: "https://github.com/20syldev/kao"
demo: "https://kao.sylvain.sh"
---

## À propos {#about}

Kao est un éditeur d'avatars manga disponible sur [kao.sylvain.sh](https://kao.sylvain.sh).
On y compose un visage à partir d'environ 1 800 pièces (yeux, coiffures, vêtements...), puis on l'exporte en haute définition.
L'éditeur est un film Flash, lu dans le navigateur par [Ruffle](https://ruffle.rs). Le site est entièrement statique : aucun compte, aucun serveur applicatif, et rien ne quitte le navigateur.

## Fonctionnalités {#features}

- **Éditeur complet** — environ 1 800 pièces de visage regroupées en menus, avec des menus de l'éditeur en anglais ou en français, selon la langue du site
- **Export haute définition** — de 360 à 4320 px (six échelles), en PNG transparent, PNG sur fond blanc, JPEG ou WebP
- **Rendu sans perte** — l'avatar est redessiné depuis les dessins vectoriels à la taille choisie : jamais agrandi, jamais flou
- **Code d'avatar `.kao`** — chaque export fournit un code, à télécharger, copier ou coller, pour rouvrir et retoucher le même avatar plus tard
- **Mes avatars** — les avatars exportés sont conservés dans le `localStorage` du navigateur (60 au maximum), avec suppression annulable et sauvegarde ou restauration au format JSON
- **Plein écran** — l'éditeur peut occuper tout l'écran
- **Mémoire des réglages** — la taille et le format d'export sont retenus d'une visite à l'autre
- **Thème clair et sombre** — une interface au style manga, avec des ombres portées décalées de type « comics » qui changent de couleur selon le thème

## Un moteur Flash dans le navigateur {#engine}

L'éditeur lui-même est un film Flash, `engine.swf`, écrit en ActionScript 2 et lu par une version de Ruffle hébergée avec le site.
Un chargeur, `MAIN.swf`, compilé depuis `flash/MainTimeline.as` avec ffdec, fait le lien entre le moteur et la page, et les pièces du visage sont servies depuis `public/library/`.
Le moteur n'a pas de dossier source : le binaire est la source, et il se modifie en place avec ffdec grâce au script `scripts/engine.sh`.

## L'export sans perte {#export}

Quand on clique sur **SAVE** dans l'éditeur, le moteur appelle le chargeur par une `LocalConnection`.
Celui-ci demande à la page l'échelle choisie, redessine l'avatar vectoriel à cette taille avec sa transparence, puis lui renvoie les pixels compressés en zlib.
Comme `BitmapData.encode()` n'est qu'un stub dans Ruffle, c'est la page qui décode ces pixels (`DecompressionStream`) et encode elle-même l'image dans le format voulu.

## Utilisation {#usage}

En ligne, il suffit d'ouvrir [kao.sylvain.sh](https://kao.sylvain.sh), de créer son avatar puis de valider avec SAVE.
Les versions publiées embarquent aussi une archive `kao-X.Y.Z.zip` pour l'utiliser hors ligne sous Linux :

```sh
./start.sh            # ouvre Kao dans une fenêtre de navigateur autonome
./start.sh --install  # ajoute aussi Kao au menu des applications
```

Le script a besoin de Python 3 et d'un navigateur basé sur Chromium (Chrome, Chromium ou Brave). Il sert l'éditeur en local sur le port 7712.

## Qualité et déploiement {#quality}

Le dépôt est couvert par des tests de bout en bout Playwright qui pilotent le vrai éditeur : création d'un avatar, export en PNG 1440 px, réouverture d'un fichier `.kao` et export en JPEG, sauvegarde et restauration de l'historique.
Le script `npm run check:assets` vérifie hors ligne que chaque pièce référencée par les menus existe bien.
Chaque envoi sur `master` lance la CI, qui contrôle notamment que `MAIN.swf` correspond à sa source, puis, si elle passe, déploie le site statique sur GitHub Pages.

## Stack technique {#tech}

Construit avec **Next.js 16** (App Router, export statique), **React 19** et **TypeScript strict**, Kao utilise **Tailwind CSS v4**, **shadcn/ui** (new-york, primitives Radix), next-intl (anglais sur `/`, français sur `/fr/`), next-themes, sonner et lucide-react.
Le code écrit pour Kao est publié sous licence **BSD 3-Clause** ; Ruffle, le moteur de l'éditeur et les pièces de visage gardent leurs propres conditions.