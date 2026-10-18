---
name: Neuron
description: Essai interactif sur les réseaux de neurones, de l'encre au sens, sans serveur.
longDescription: "Essai interactif sur les réseaux de neurones développé avec Next.js 16, React 19 et Tailwind CSS 4 : un chiffre manuscrit reconnu en direct par un réseau 784-256-256-10, puis l'attention d'un transformer expliquée au fil d'un essai de quinze chapitres. Tout le calcul se fait dans le navigateur, en français et en anglais."
tags: ["Next.js", "TypeScript", "Neural Network", "Essay"]
github: "https://github.com/20syldev/neuron"
demo: "https://neuron.sylvain.sh"
---

## À propos {#about}

Neuron est un essai interactif sur les réseaux de neurones, publié sur [neuron.sylvain.sh](https://neuron.sylvain.sh) sous le titre « De l'encre au sens ».
Il montre d'abord comment un réseau reconnaît un chiffre dessiné à la main, puis comment un transformer lit une phrase en décidant quels mots s'écoutent.
Tout tourne dans le navigateur : pas de serveur, pas de compte, aucune donnée envoyée. Il remplace l'ancien projet **digit**, un petit réseau de neurones en JavaScript qui reconnaissait les chiffres manuscrits.

## Structure de l'essai {#essay}

L'essai se compose d'un prologue, de deux parties, d'un interlude et d'un épilogue, et compte quinze chapitres numérotés, répartis entre les deux parties :

- **Partie I, « Voir »** (chapitres 1 à 4) — un perceptron reconnaît un chiffre : dessin, image reçue par le réseau, couches successives, puis ce que cherche un neurone
- **Interlude** — « Ce qu'un regard fixe ne sait pas faire » : le perceptron lit chaque pixel à une place fixe et ne compare jamais deux pixels entre eux
- **Partie II, « Lire »** (chapitres 5 à 15) — un transformer décide quels mots s'écoutent, du problème posé par la phrase et du graphe d'attention jusqu'au coût de l'attention chiffré sur GPT-3
- **Épilogue** — Ce que « il » a appris, avec des références pour aller plus loin

## Partie I : un chiffre reconnu en direct {#digit}

La zone de dessin accepte la souris, le doigt ou le stylet, et le réseau **784-256-256-10** recalcule sa prédiction à chaque trait.
Le tracé est recadré dans un carré de 20 x 20 puis placé dans une image de 28 x 28 de façon que son centre de masse tombe au centre, comme pour le jeu MNIST, avant d'être réduit en 784 valeurs entre 0 et 1.

Le réseau peut ensuite être ouvert :

- **Valeurs des pixels** — une loupe déplaçable à la souris ou aux flèches affiche les valeurs d'un détail de 6 x 6 pixels
- **Activations couche après couche** — les neurones allumés de chaque couche cachée, sur 256, jusqu'aux dix probabilités de sortie
- **Inspecteur de neurone** — les 784 poids d'un neurone de la première couche replacés sur la grille 28 x 28, points pleins pour les poids excitateurs et anneaux pour les inhibiteurs

L'inférence est écrite à la main dans `src/lib/mlp.ts`, sans bibliothèque de calcul. Les poids sont stockés dans `public/models/digit.bin`, en entiers 16 bits little-endian à l'échelle 1e-4, soit 269 322 paramètres chargés une seule fois.

## Partie II : l'attention {#attention}

La seconde partie s'appuie sur une phrase découpée en treize mots (« L' » et « qu' » comptant à part) : « L'animal n'a pas traversé le boulevard parce qu'il était trop fatigué / large ». Seul le chapitre sur l'ordre des mots change de phrase.
Un interrupteur change le dernier mot et montre comment l'attention de « il » passe de l'animal au boulevard.

Les chapitres défont la grille d'attention pas à pas :

- **Mécanique** — requête, clé, valeur, produit scalaire, softmax puis somme pondérée
- **Grille d'attention** — 13 x 13 poids, dont chaque ligne totalise toujours 1
- **Ordre des mots** — deux phrases de mêmes mots dans un ordre différent
- **Plusieurs têtes** — quatre têtes illustratives lisant la même phrase
- **Masque causal** — chaque mot ne regarde qu'en arrière : tout ce qui le suit est caché
- **Couches et coût** — doubler la phrase quadruple le nombre de comparaisons, chiffré sur GPT-3

Le modèle de cette partie est un modèle jouet dont les poids sont réglés à la main pour rester lisibles. Le texte le précise, de même que le caractère illustratif des têtes.

## Navigation et interface {#interface}

Un sommaire, une barre compacte et une pastille flottante indiquent le chapitre en cours et la progression de lecture.
L'identité graphique repose sur une trame de points (halftone) baptisée Trame, et sur un thème clair ou sombre (next-themes).
L'essai est disponible en **anglais** (servi à `/`) et en **français** (servi à `/fr/`), avec le raccourci `Alt+L` pour changer de langue.

À la première visite, un petit script intégré à la page redirige vers `/fr/` si le navigateur est en français. Un choix enregistré dans le `localStorage` l'emporte ensuite toujours.

## Stack technique {#tech}

Construit avec **Next.js 16** (App Router, export statique), **React 19** et **TypeScript strict**, Neuron utilise **Tailwind CSS v4** et **shadcn/ui** (new-york, primitives Radix via `radix-ui`).
S'y ajoutent next-intl pour les deux langues (`localePrefix: "as-needed"`, sans middleware), next-themes et lucide-react.
Les polices Bricolage Grotesque, Manrope et Geist Mono sont auto-hébergées par `next/font/google` au build.

Le site est déployé sur GitHub Pages par un workflow GitHub Actions à chaque push sur `master`. En local, `npm run dev` lance le serveur sur `127.0.0.1:1535`, `npm run build` produit l'export statique dans `out/` et `npm run check` enchaîne `tsc`, ESLint et Prettier.
Le projet est publié sous licence **BSD 3-Clause**.