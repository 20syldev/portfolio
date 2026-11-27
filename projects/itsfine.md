---
name: itsfine
description: "Un moniteur système pour le terminal, avec un chien en pixels qui répète que tout va bien."
longDescription: "Outil en ligne de commande qui affiche les cœurs, la charge, la mémoire, la température, les disques, le réseau et les plus gros processus dans une interface plein écran. Un chien en pixels trône au milieu et répète que tout va bien, pendant que le sol prend feu à mesure que la machine chauffe. Écrit en TypeScript pour Node.js, sans aucune dépendance, il lit /proc et /sys directement."
tags: ["Node.js", "TypeScript", "Linux", "TUI"]
github: "https://github.com/20syldev/itsfine"
---

## À propos {#about}

itsfine est un moniteur système pour le terminal, un peu pour rire : il montre les cœurs, la charge, la mémoire, la température, les disques, le réseau et les plus gros processus, et un chien en pixels trône au milieu de tout cela en disant que tout va bien.
Plus la machine chauffe, plus le sol prend feu autour de lui.
Il se lance sans installation avec `npx itsfine`, ne dépend de rien, lit `/proc` et `/sys` directement et pèse assez peu pour rester ouvert dans un coin.
Le code est sur [github.com/20syldev/itsfine](https://github.com/20syldev/itsfine).

![La machine passe du calme au chaud puis au critique, et le chien et les flammes suivent](/images/projects/itsfine/hero)

## L'humeur {#mood}

Le chien et l'en-tête suivent l'état de la machine, et le texte suit le chien. Les seuils par défaut sont ceux-ci :

- **Calme** — tout est sous les seuils : `all good`, une pastille verte et un chien qui cligne des yeux au-dessus de son café
- **Chaud** — température à partir de 75 °C, charge à partir de 70 % ou mémoire à partir de 80 % : `this is fine.`, une pastille ambre, des joues rouges, un chien qui halète, transpire et fume
- **Critique** — température à partir de 90 °C, charge ou mémoire à partir de 95 % : `this is NOT fine`, une bannière rouge qui clignote, de hautes flammes et des yeux écarquillés

![Les trois humeurs : tout va bien, c'est fine, ce n'est PAS fine](/images/projects/itsfine/moods.svg)

L'humeur ne vacille pas au bord d'un seuil : pour redescendre, les mesures doivent passer quelques degrés (ou 5 %) en dessous. Les seuils de température se règlent avec `--hot-temp` et `--crit-temp`.

## Utilisation {#usage}

L'outil se lance avec ce qu'on a déjà sous la main : `npx itsfine`, `bunx itsfine@latest` ou `pnpm dlx itsfine`.

```bash
npx itsfine                       # l'interface
npx itsfine --once                # affiche une image et quitte
npx itsfine --json                # affiche les mesures en JSON et quitte
npx itsfine --interval 2000       # mesure toutes les 2 secondes
npx itsfine --no-anim             # sans pouls ni flammes : plus léger, plus agréable en SSH
npx itsfine --hot-temp 65 --crit-temp 80
```

Depuis un clone, `npm install` construit aussi `dist/`, et `npm link` place `itsfine` dans le `PATH`.

## Les onglets {#tabs}

Six onglets se parcourent avec les flèches, `tab` ou les touches `1` à `6` :

- **Vue d'ensemble** — le pouls, dont les pics montent aussi haut que la charge, une barre par cœur, la mémoire et la température, puis, sur un terminal large, la console de barres, le réseau, la batterie et les trois plus gros processus
- **CPU** — le modèle, une tuile d'historique par cœur, la fréquence et la température
- **Mémoire** — utilisée, en cache et libre dans une seule barre, le swap, l'historique et les plus gros processus
- **Disque** — une jauge par disque monté, et les débits de lecture et d'écriture en deux courbes
- **Réseau** — la réception au-dessus, l'envoi en dessous, avec les pics, puis chaque interface et ses totaux
- **Processus** — un tableau avec une barre par processus, triable, avec un `kill` qui demande d'abord confirmation

![L'onglet CPU : une tuile par cœur avec sa charge et son historique, puis la fréquence et la température](/images/projects/itsfine/cpu.svg)

![L'onglet réseau : ce qui entre monte, ce qui sort pend depuis la même ligne](/images/projects/itsfine/network.svg)

![L'onglet processus : une barre par processus et la ligne sélectionnée en surbrillance](/images/projects/itsfine/processes.svg)

Les captures sont dessinées à partir de la vraie interface, sur une machine inventée.

La vue d'ensemble affiche ce qui tient : quand le terminal est court ou étroit, le moins important part en premier (les trois processus, puis la batterie, le réseau et la console).
Les chiffres affichés sont lissés sur environ 2 secondes, si bien qu'un cœur qui travaille par à-coups ne saute pas de 0 à 100 % à chaque mesure et que l'humeur ne vacille pas. `--json` affiche les mesures brutes.

## Les touches {#keys}

- **Onglets** — `←` `→` ou `tab` pour le précédent et le suivant, `1` à `6` pour aller à un onglet, clic sur un onglet pour l'ouvrir
- **Processus** — `↑` `↓`, `PgUp` et `PgDn` ou la molette déplacent la sélection, `s` fait tourner le tri entre CPU, mémoire et nom, `k` termine le processus choisi (`SIGTERM`) après une confirmation
- **Général** — `p` met en pause, `?` affiche l'aide, `q` ou `Ctrl+C` quitte

## Réglages {#options}

- **`--once`** — affiche une image et quitte, à la taille du terminal, sinon selon `COLUMNS` et `LINES`, sinon en 100x34 ; `ITSFINE_TAB=1..6` choisit l'onglet
- **`--json`** — affiche les mesures en JSON et quitte
- **`--interval <ms>`** — temps entre deux mesures, 1000 par défaut et 250 au minimum
- **`--no-anim`** — coupe les animations
- **`--hot-temp <°C>` et `--crit-temp <°C>`** — températures des humeurs chaude (75 par défaut) et critique (90)
- **`--lang <fr|en>`** — langue de l'interface, aussi réglable avec `ITSFINE_LANG` ; par défaut le français sur un système en français, sinon l'anglais
- **`ITSFINE_ASCII=1`** — dessine l'interface avec des caractères ASCII seulement
- **`NO_COLOR` et `FORCE_COLOR`** — coupent ou forcent les couleurs

Les couleurs suivent le terminal : vraies couleurs, 256 ou 16 couleurs, ou aucune. Le fond est demandé au terminal (OSC 11, puis `COLORFGBG`) et un fond clair reçoit une palette plus sombre.

## Ce qu'il lit {#reads}

Tout vient du noyau, rien ne quitte la machine et rien n'est écrit :

- **Charge et cœurs** — `/proc/stat` et `/proc/loadavg`
- **Mémoire et swap** — `/proc/meminfo`
- **Réseau** — `/proc/net/dev` et les adresses du module `os`
- **Disques** — `/proc/diskstats`, `/proc/mounts` et `statfs`
- **Processus** — `/proc/<pid>/stat`, lu seulement quand un onglet les montre
- **Température** — `/sys/class/thermal` et `/sys/class/hwmon`, avec `k10temp` ou `coretemp` de préférence
- **Fréquence et GPU** — `/sys/devices/system/cpu/*/cpufreq` et `/sys/class/drm` (AMD)
- **Batterie** — `/sys/class/power_supply`

Sur un autre système, le module `os` donne la charge et la mémoire, et ce qu'il ne peut pas donner (température, réseau, disque, processus) est marqué comme indisponible plutôt qu'inventé.

## Un outil léger {#weight}

Les mesures sont prises une fois par seconde, et l'animation tourne à quatre images par seconde, sur la vue d'ensemble et partout où le chien apparaît : la vapeur, le clignement et les flammes bougent de quelques pixels à la fois.
Une image est comparée à la précédente pour n'écrire que les cellules qui ont changé. La liste des processus est ce qui coûte le plus : elle n'est lue que lorsqu'elle est affichée, au plus toutes les 2 secondes (5 sur la vue d'ensemble), et les threads du noyau sont ignorés entre deux lectures complètes.
`--no-anim` et un `--interval` plus long l'allègent encore.

Mesuré sur un portable (i7-8565U, terminal de 100x34) : environ 80 Mo de mémoire, dont 40 pour Node lui-même, et environ 2 % d'un cœur avec l'animation, 1 % avec `--no-anim`.

## Stack technique {#tech}

L'outil est écrit en **TypeScript** strict pour **Node.js** 22.12 ou plus, sans aucune dépendance à l'exécution : l'interface plein écran, le dessin du chien en pixels, les couleurs, la souris et la détection du fond du terminal sont écrits à la main, et la langue se lit dans `src/i18n`.
Les tests tournent avec le lanceur intégré de Node (`node --test`), le projet est contrôlé par ESLint et Prettier, et les captures de l'interface sont régénérées depuis la vraie vue, avec une vérification qu'elles sont à jour.
L'intégration continue passe `npm run check` et les tests à chaque poussée, et chaque release GitHub publie le paquet sur npm avec une attestation de provenance, après avoir vérifié que le tag correspond à la version du `package.json`.
Le projet est publié sous licence **BSD-3-Clause**.
