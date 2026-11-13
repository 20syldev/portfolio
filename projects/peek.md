---
name: Peek
description: Visionneuse Markdown qui affiche n'importe quel README comme GitHub, GitLab, Obsidian ou CommonMark.
longDescription: "Visionneuse Markdown développée avec Next.js 16, React 19 et TypeScript, qui rend un fichier local, un lien GitHub ou du texte collé comme le ferait GitHub, GitLab, Obsidian ou CommonMark. Le rendu se fait dans un Web Worker, entièrement dans le navigateur, avec un éditeur à aperçu synchronisé."
tags: ["Next.js", "TypeScript", "Markdown", "Viewer"]
github: "https://github.com/20syldev/peek"
demo: "https://peek.sylvain.sh"
---

## À propos {#about}

Peek est une visionneuse Markdown, disponible sur [peek.sylvain.sh](https://peek.sylvain.sh). Elle succède à l'ancien projet readme, qui tenait en une page HTML, une feuille de style et un script.
Elle affiche n'importe quel README à partir d'un fichier local, d'un lien ou de texte collé, rendu comme le ferait GitHub, GitLab, Obsidian ou CommonMark.
Tout s'exécute dans le navigateur : le contenu du document n'est envoyé à aucun serveur.

## Fonctionnalités {#features}

- **Trois entrées** — déposer un fichier `.md` n'importe où sur la page, en choisir un, ou coller un lien, un fichier ou du texte (`Ctrl V`)
- **Liens GitHub convertis** — dépôt entier, dossier, blob, vue brute ou gist sont résolus vers le fichier brut ; tout autre lien http(s) est lu tel quel si son serveur l'autorise (CORS)
- **Lien de partage** — `?url=github.com/20syldev/peek&flavor=gitlab` conserve l'historique du navigateur, et les liens et images relatifs sont résolus par rapport à la source, comme dans le dépôt
- **Vue brute** — le Markdown source s'affiche à côté du rendu (`R`)
- **Sommaire latéral** — la section courante est mise en évidence, la largeur s'adapte aux titres longs et chaque titre porte une ancre `#`
- **Thème et langue** — clair, sombre ou système, en français et en anglais, avec une impression et un export PDF soignés

## Quatre formats de Markdown {#flavors}

Le format se choisit dans l'onglet du document et reste mémorisé :

- **GitHub** — GFM (tableaux, listes de tâches, notes de bas de page), alertes, formules, Mermaid, emojis et tableau pour le front matter
- **GitLab** — GFM, sommaire `[[_TOC_]]`, citations `>>>`, diff en ligne, formules, Mermaid et front matter en bloc de code
- **Obsidian** — callouts avec titre et repli, `==surlignage==`, liens wiki, intégrations `![[image]]`, `#tags` et commentaires `%%`
- **CommonMark** — la norme seule, sans extension

## Éditeur {#editor}

La touche `E` ouvre un éditeur : la source à gauche, l'aperçu en direct à droite, qui défilent ensemble selon la ligne source. Sur petit écran, un bouton bascule entre Édition et Aperçu.
`Ctrl S` enregistre dans le fichier choisi (File System Access API, sous Chromium) ou télécharge une copie `.md` en conservant ses sauts de ligne.
Les modifications non enregistrées sont gardées comme brouillon dans le navigateur, proposées de nouveau à la réouverture du même document, puis supprimées une fois enregistrées dans le fichier.

## Sécurité et performance {#security}

Le HTML est assaini selon la liste d'éléments autorisés de GitHub : ni script, ni style, ni lien `javascript:`.
Le rendu s'effectue dans un **Web Worker** avec une limite de 8 secondes, si bien qu'un document lourd ou piégé ne fige jamais la page. Un fichier de plus de 5 Mo est refusé.

## Stack technique {#tech}

Construit avec **Next.js 16** (App Router, export statique), **React 19**, **TypeScript strict**, **Tailwind CSS v4** et **shadcn/ui** (new-york, primitives Radix via `radix-ui`).
Le pipeline Markdown repose sur unified (remark, rehype), KaTeX, highlight.js et Mermaid, avec next-intl pour l'anglais (servi à `/`) et le français (`/fr/`), next-themes et lucide-react.
Le design est piloté uniquement par les tokens de `src/app/appearance/`.

## Raccourcis clavier {#shortcuts}

- `Ctrl /` — afficher tous les raccourcis (aussi `Ctrl :` sur clavier AZERTY)
- `Ctrl O` — ouvrir un fichier
- `Ctrl P` — imprimer
- `/` — saisir un lien
- `S` — sommaire
- `C` — copier le lien de partage
- `E` — éditer, puis `Ctrl S` pour enregistrer
- `D` et `L` — thème et langue

Les raccourcis à une touche peuvent être désactivés (WCAG 2.1.4).
