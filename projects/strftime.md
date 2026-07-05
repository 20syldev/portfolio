---
name: strftime
description: Constructeur de formats strftime interactif avec compatibilité C, Python et Ruby.
longDescription: "Constructeur de formats strftime interactif développé avec Next.js 16, React 19 et Tailwind CSS 4. Moteur strftime maison en TypeScript, explications en langage clair et compatibilité C / glibc, Python et Ruby pour chacune des 48 directives."
tags: ["Next.js", "TypeScript", "Date & Time", "Playground"]
github: "https://github.com/20syldev/strftime"
demo: "https://strftime.sylvain.sh"
---

## À propos {#about}

strftime est un constructeur de formats de date interactif, disponible sur [strftime.sylvain.sh](https://strftime.sylvain.sh).
Il permet d'assembler visuellement une chaîne de format `strftime`, de comprendre chaque directive en langage clair et de vérifier sa compatibilité entre les dialectes C, Python et Ruby.
Tout fonctionne côté navigateur, sans compte ni serveur.

## Qu'est-ce que strftime ? {#what}

`strftime` est la fonction historique de formatage des dates, présente en C, Python, Ruby, Shell et bien d'autres langages.
Elle transforme une date en texte à l'aide de directives comme `%Y` (année), `%m` (mois) ou `%H` (heure) — par exemple `%Y-%m-%d` produit `2026-07-15`.
Le problème : ces directives varient d'un langage à l'autre, et il est facile de se tromper. strftime rend tout ce vocabulaire visuel et vérifiable.

## Fonctionnalités {#features}

L'outil couvre l'ensemble du cycle de construction d'un format :

- **Constructeur bidirectionnel** — un champ texte libre tokenisé en direct, avec des pièces cliquables, réordonnables par glisser-déposer et du texte littéral éditable
- **Popover pédagogique** sur chaque pièce : description, valeur en direct, plage de valeurs, compatibilité par dialecte, et contrôles de padding (`-`, `_`, `0`), casse (`^`, `#`) et largeur minimale
- **Aperçu en temps réel** — horloge live ou date personnalisée, locale de rendu sélectionnable (C/POSIX, navigateur, quinze locales), et copie du format, du résultat ou d'un lien partageable (`?f=`)
- **Palette des 48 directives** classées par catégorie, filtrables par dialecte, avec recherche plein texte et palette de commandes (`Ctrl K`)
- **Détection depuis un exemple** — collez une date (ISO, RFC 2822, US/EU, noms de mois et de jours localisés) pour inférer son format et le charger dans le constructeur
- **Génération de code** — des extraits prêts à coller pour Python, Ruby, Shell, C, Go et JavaScript, chacun avec ses réserves de portabilité
- **Linter de portabilité** — des avertissements par pièce et un résumé par format dès qu'une directive n'est pas portable entre C / glibc, Python et Ruby
- **Formats sauvegardés** — une bibliothèque personnelle en `localStorage` avec renommage, suppression (avec annulation) et import/export JSON

## Le moteur maison {#engine}

Le cœur de strftime est un **moteur `strftime` écrit de zéro en TypeScript** (`src/lib/strftime.ts`).
Il implémente le dialecte glibc ainsi que les extensions Ruby (`%L`, `%N`, `%v`, `%+`, `%::z`) et Python (`%f`), gère la locale C et les autres locales via `Intl`, et est **vérifié octet par octet** contre la commande `date` (glibc) sur plusieurs fuseaux horaires.
Le catalogue des directives a été confronté à `man 3 strftime`, à la table des codes de format de Python et à la référence `strftime` de Ruby.

## Multilingue et design {#design}

L'interface est disponible en **français, anglais et espagnol** (next-intl, servies à `/`, `/fr/` et `/es/`), avec un thème clair/sombre (next-themes).
Le style est **entièrement piloté par les tokens** de `globals.css`, avec un loader arcade et une scrollbar personnalisée.
Des raccourcis clavier accélèrent la navigation : `Ctrl K` (recherche), `Alt+L` (langue) et `Alt+T` (thème).

## Stack technique {#tech}

Construit avec **Next.js 16** (App Router, export statique), **React 19** et **TypeScript strict**, l'application utilise **Tailwind CSS v4**, **shadcn/ui** (new-york, primitives Radix), next-intl, next-themes, dnd-kit, cmdk, sonner et lucide-react.