---
name: LogVault
description: Site marketing bilingue pour une solution SaaS de gestion de logs par ZENETYS.
longDescription: Site marketing Next.js bilingue (FR/EN) pour LogVault — une solution SaaS de centralisation, chiffrement et archivage de logs à destination des entreprises.
tags: ["Next.js", "Tailwind CSS", "TS"]
demo: "/alternance#logvault-io"
---

## À propos {#about}

LogVault est une solution SaaS de gestion de logs développée par [ZENETYS](https://www.zenetys.com). Ce dépôt contient le site marketing de la solution, construit sur un template Next.js interne (`@zenetys/template`) et déployé à [logvault.io](https://www.logvault.io).

Le site présente les deux offres de la gamme :

- **LogVault SaaS** — hébergement cloud ZENETYS, mise en place immédiate
- **LogCenter On-Premise** — déploiement sur votre propre infrastructure

## Stack {#stack}

- **Next.js 16** avec App Router et export statique
- **Tailwind CSS v4**
- **TypeScript**
- **shadcn/ui** (Radix UI)
- **next-intl** — internationalisation FR/EN
- **Framer Motion** — animations

## Architecture {#architecture}

Le site repose sur `@zenetys/template`, un template Next.js développé en interne chez ZENETYS. Il impose une architecture **data-driven** : tout le contenu (textes, tarifs, fonctionnalités, comparatifs) est centralisé dans des fichiers de données et de traduction. Les composants ne contiennent aucun texte en dur.

Les traductions FR/EN sont gérées par **next-intl**, avec un switch de langue dynamique côté client. L'export est entièrement statique (`output: "export"`), ce qui permet un déploiement sur n'importe quel CDN sans serveur Node.

## Fonctionnalités {#features}

- **Bilingue FR/EN** — switch de langue dynamique via next-intl
- **Dark mode** intégré
- **Architecture data-driven** — tout le contenu est configuré dans `data/` et `messages/`, zéro texte en dur dans les composants
- **Pages** : home, on-premise, tarifs, contact, CGU
- **Tableau comparatif** LogVault SaaS vs LogCenter On-Premise
- **Formulaire de contact** avec sélecteur de sujet et anti-spam
- **Animation** interactive sur la home

## Défis {#challenges}

### Internationalisation sans serveur

next-intl en mode statique nécessite de pré-générer chaque page pour chaque locale au build. La configuration du routing i18n avec `output: "export"` demande une gestion spécifique des middlewares et des redirections, que le template interne encapsule.

### Intégration au template interne

`@zenetys/template` impose des conventions de structure strictes. L'adapter aux besoins spécifiques de LogVault, pages supplémentaires, composants custom tout en restant compatible avec les mises à jour du template a demandé de bien séparer ce qui relève du template de ce qui est propre au projet.