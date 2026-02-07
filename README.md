<div align="center">
  <a href="https://sylvain.pro"><img src="https://sylvain.pro/favicon.ico" alt="Logo" width="25%" height="auto"/></a>

  # Site Web Personnel - Portfolio
  [![Version](https://custom-icon-badges.demolab.com/badge/Version%20:-v4.1.1-6479ee?logo=sylvain&labelColor=23272A)](https://github.com/20syldev/portfolio/releases/latest)
</div>

---

## Présentation rapide
Voici le **code source** de mon site web portfolio **[sylvain.pro](https://sylvain.pro)**.

Le design du site est réalisé avec **Next.js**, **Tailwind CSS** et **Radix UI**. Il est également "**responsive**", c'est-à-dire qu'il s'adapte à **toutes** les tailles d'écran !

Vous avez aussi le droit à un **mode** clair et sombre **automatique** ou **manuel**, des **animations**, un menu de **navigation** dynamique et bien plus !

> *Vous pouvez utiliser l'URL raccourcie **[sylv.pro](https://sylvain.pro)** pour accéder au **site web**, ainsi que **toutes** ses pages.*

---

## Technologies utilisées

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS 4
- **UI** : Radix UI, Lucide Icons
- **Animations** : Lenis (smooth scroll)
- **Thème** : next-themes (mode clair/sombre)


---

## Installation

```bash
npm install
npm run build
```
*Il est préférable d'utiliser `npm run dev` pour développer et `npm run start` pour la version de production.*

## Configuration du serveur de développement

Dans le fichier [`package.json`](package.json), vous pouvez modifier la commande de développement afin que le serveur écoute sur **toutes les interfaces réseau**.

Remplacez la commande actuelle :

```bash
npm run generate && next dev --hostname 127.0.0.1 --port 2146
````

par :

```bash
npm run generate && next dev --hostname 0.0.0.0 --port 2146
```

---

## Scripts disponibles

| Commande           | Description                                        |
|--------------------|----------------------------------------------------|
| `npm run dev`      | Lance le serveur de développement sur le port 2146 |
| `npm run build`    | Compile le projet pour la production               |
| `npm run start`    | Démarre le serveur de production                   |
| `npm run generate` | Génère les fichiers de données des projets         |
| `npm run check`    | Vérifie le typage TypeScript                       |
| `npm run lint`     | Vérifie le code avec ESLint                        |

---

## URLs des projets

| URL                 | Description                                |
|---------------------|--------------------------------------------|
| `/{projet}`         | Redirection vers le site externe du projet |
| `/card/{projet}`    | Carte du projet (popup)                    |
| `/projet/{projet}`  | Page complète du projet (vue)              |
| `/preview/{projet}` | Modal complète du projet (popup)           |

**Exemples :**
- `sylvain.pro/api` - Redirection vers api.sylvain.pro
- `sylvain.pro/card/api` - Carte du projet API
- `sylvain.pro/projet/api` - Vue complète du projet API
- `sylvain.pro/preview/api` - Preview du projet API