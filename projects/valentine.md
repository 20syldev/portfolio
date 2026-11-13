---
name: Valentine
description: Challenges de cybersécurité pour la Saint-Valentin.
longDescription: Jeu interactif de 12 défis en cybersécurité de difficulté croissante. SQL injection, XSS, cryptographie, réseaux et plus. Développé avec Next.js 16, React 19, TypeScript et Tailwind CSS v4.
tags: ["Next.js", "TypeScript", "Cybersecurity", "Game"]
github: "https://github.com/20syldev/valentine"
demo: "https://valentine.sylvain.sh"
archived: true
---

## À propos {#about}

Valentine, alias **Hack My Heart**, est un jeu interactif de défis en cybersécurité créé pour la Saint-Valentin.
Testez vos connaissances à travers 12 challenges de difficulté croissante dans un thème Cyber et Développement !
Le projet est aujourd'hui archivé : le jeu reste jouable sur [valentine.sylvain.sh](https://valentine.sylvain.sh) et le code consultable sur GitHub.

## Fonctionnalités {#features}

Le jeu propose une expérience complète avec de nombreuses fonctionnalités :

- **12 challenges** de cybersécurité couvrant SQL injection, XSS, cryptographie, réseaux et plus
- **Système de hints progressifs** en trois paliers selon le nombre de tentatives, le dernier révélant la réponse
- **Animations interactives** : pluie de cœurs, effet machine à écrire, transitions fluides
- **Sauvegarde automatique** de la progression avec localStorage
- **Design responsive** avec Tailwind CSS v4
- **Navigation intuitive** entre les challenges

## Challenges {#challenges}

Les 12 challenges sont répartis en 4 niveaux de difficulté :

**Facile :**

1. SQL Injection — Injection SQL de base
2. HTTP Status — Codes de statut HTTP
3. Git Commit — Historique Git

**Moyen :**

4. XSS Escape — Cross-Site Scripting
5. Port HTTPS — Ports réseau
6. Firewall ACL — Règles de pare-feu
7. Binary ASCII — Conversion binaire
8. Hash Collision — Collisions de hash

**Difficile :**

9. SQL Bypass — Bypass d'authentification
10. Vigenère — Cryptographie classique

**Expert :**

11. Subnet Mask — Masques réseau
12. Regex Email — Expressions régulières

## Stack technique {#tech}

Le projet est construit avec une stack moderne :

- **Next.js 16** — App Router, export statique en production
- **React 19** — Framework UI
- **TypeScript 5** — Typage statique
- **Tailwind CSS v4** — Styling CSS-first
- **Lucide React** — Icônes

Chaque challenge a sa propre page (`/challenge/1` à `/challenge/12`), générée au build, suivie d'une page finale.
La progression est gérée par un contexte React et restaurée depuis le `localStorage` au chargement.
Le site est déployé sur GitHub Pages par un workflow GitHub Actions à chaque push sur `master`.
