---
name: Portfolio
description: Mon site web, avec des informations sur mes projets.
longDescription: "Site web portfolio développé avec Next.js 16, Tailwind CSS 4 et Radix UI. Design responsive avec mode clair/sombre, animations fluides, easter eggs et modes de personnalisation avancés."
tags: ["Next.js", "Radix UI", "Tailwind CSS", "TypeScript", "MD"]
github: "https://github.com/20syldev/portfolio"
demo: "https://sylvain.sh"
---

## À propos {#about}

Ce site a été créé pour faire une présentation claire et professionnelle de mes projets et de mes compétences.
Vous pouvez y trouver des informations sur mon parcours, mes compétences et mes expériences.
Au-delà d'un simple portfolio, il embarque de nombreuses fonctionnalités de personnalisation, des animations interactives et quelques secrets à découvrir.

## Fonctionnalités {#features}

Le design utilise **Next.js 16** (App Router) avec **Tailwind CSS 4** et **Radix UI** pour les composants.

**Navigation :**

- **Défilement 2D** : navigation horizontale entre 3 onglets (Accueil, Alternance, Veille) et verticale entre les sections
- Support **molette**, **swipe tactile** et **touches fléchées** du clavier
- **Indicateurs de section** : pastilles verticales qui s'allongent selon la section active
- **Transitions de page** instantanées avec un glissement vers le haut à chaque changement de route

**Personnalisation :**

- **9 polices** disponibles (dont Lexend, recommandée pour la dyslexie) avec prévisualisation en temps réel
- **Taille de police globale** ajustable de 80 % à 180 % via un curseur
- **Thème** clair, sombre ou automatique selon les préférences système
- Tous les réglages persistent entre les visites via `localStorage`

**Accessibilité :**

- **Raccourcis clavier** complets (listés via `Alt + /`)
- **Mode sans animations** respectant également `prefers-reduced-motion`
- Police Lexend conçue pour les personnes dyslexiques

## Un design moderne {#design}

Le site propose un mode clair et sombre, que vous pouvez choisir manuellement ou activer automatiquement en fonction des préférences de votre appareil.

**Animations et transitions :**

- **Barre de navigation morphique** : compacte et centrée sur l'accueil, elle s'étire en barre pleine largeur avec logo et boutons d'action sur les autres pages
- **Animations en cascade** : les éléments enfants apparaissent en décalé, créant un effet de vague à l'entrée
- **Bordures animées** : les projets récents ou mis à jour affichent un dégradé en rotation continue
- **Effet de brillance** sur le nom de l'auteur, qui traverse le texte en boucle
- **Soulignement directionnel** sur les liens : il glisse vers la droite au survol et repart dans la même direction

**Détails UI :**

- Scrollbars personnalisées (couleur, opacité) pour les thèmes clair et sombre
- Couleur de sélection de texte en **violet** sur tout le site
- **Lenis** pour un défilement fluide avec une courbe d'easing exponentielle

## Interactions et physique {#interactions}

Le logo de la page d'accueil est entièrement **interactif et draggable** avec un moteur physique complet :

- **Ressort** de rappel vers le centre avec raideur et amortissement réalistes
- **Rebonds** sur les 4 bords de la fenêtre avec conservation partielle de l'énergie
- **Rotation pendulaire** pendant le déplacement, avec retour progressif à zéro à la release
- **Historique de vélocité** sur 80 ms pour un lancer réaliste au relâchement

Autour du logo, des **étincelles** en forme d'étoile à 4 branches apparaissent périodiquement, se dispersent puis s'estompent. Elles s'arrêtent pendant le déplacement du logo.

La description en hero utilise un **effet de rotation 3D** : plusieurs variantes de texte défilent toutes les 5 secondes avec une animation `rotateX` en cascade, et la largeur de chaque mot se réajuste en douceur.

## Easter eggs {#easter-eggs}

Le site cache plusieurs secrets à découvrir — certains sont évidents, d'autres beaucoup moins.

**Pluie de Matrix :**
Saisir le **code Konami** (↑ ↑ ↓ ↓ ← → ← → B A) déclenche une pluie de caractères japonais et hexadécimaux en vert, façon Matrix. Le thème passe automatiquement en sombre. Sur mobile, il existe d'autres façons de le déclencher...

**Trou noir :**
Si vous parvenez à faire rebondir le logo sur les **4 bords** de la fenêtre rapidement, les éléments de la page sont aspirés vers un point, le thème bascule, puis un écran de victoire apparaît. Sur écran tactile, un geste avec **5 doigts** sur le logo produit le même effet.

**Palette de commandes :**
En cherchant votre prénom dans la palette (`Ctrl + K`), vous pourriez avoir une surprise... si vous vous appelez Sylvain.

**Police cachée :**
Un **double-clic** sur le nom "Sylvain L." dans la barre de navigation ouvre directement le sélecteur de police. Cliquer sur le même nom dans la section hero fonctionne aussi.

## Modes spéciaux {#modes}

Trois modes peuvent être activés à la volée via des raccourcis clavier :

- **`Alt + X` — Mode X-Ray** : ajoute des contours colorés sur chaque élément du DOM, avec une couleur différente par niveau d'imbrication. Un badge "X-RAY" apparaît en bas de l'écran.
- **`Alt + C` — Curseur personnalisé** : remplace le curseur système par un point et un anneau qui suit avec un léger décalage, créant un effet de traînée fluide.
- **`Alt + M` — Mode sans animations** : coupe instantanément toutes les animations et transitions du site, y compris les sparkles et la physique du logo.

## Palette de commandes {#command}

La palette de commandes (`Ctrl + K` ou `Cmd + K`) permet d'accéder rapidement à toutes les pages et fonctionnalités :

- **Navigation** vers les sections, les projets et les pages internes
- **Personnalisation** (thème, police, taille, curseur, animations)
- **Raccourcis clavier** : liste complète accessible via `Alt + /`
- **Documentation aléatoire** : un bouton dé relance une suggestion au hasard parmi toute la doc
- En défilant dans la palette, la mise en page **s'élargit** et passe en deux colonnes
- Au survol d'un projet ou d'une doc, une **carte de prévisualisation** apparaît à droite

## Pages et routes {#routes}

Certaines routes ne sont pas accessibles depuis la navigation principale, mais restent utilisables directement par URL :

- `/me` : ouvre le formulaire de contact directement, pratique pour partager le lien
- `/cv` : affiche le CV en plein écran dans la visionneuse PDF intégrée
- `/stats` : page de métriques en direct — latence API, FPS, temps de chargement, mémoire JS, nombre de nœuds DOM
- `/discord`, `/git`, `/status` et chaque identifiant de projet (`/api`, `/docs`...)