---
name: Ztable
description: Visionneuse JSON sans serveur et composant de tableau Vue/Vuetify, par ZENETYS.
longDescription: "Visionneuse et navigateur JSON sans serveur, développés et open-sourcés par ZENETYS : à partir d'une URL ou d'un JSON téléversé ou collé, les données s'affichent en vue objet ou en tableau (en-têtes générés, tri, pagination, colonnes redimensionnables, export CSV). Son composant AutoTable est publié sur npm sous @zenetys/ztable. J'ai contribué à sa maintenance."
tags: ["Vue.js", "Vuetify", "AutoTable", "JSON"]
github: "https://github.com/zenetys/ztable"
demo: "https://tools.zenetys.com/ztable/#/?source=https%3A%2F%2Fcdn.zenetys.com%2Fapi%2Fv1%2Fdata.gouv.navitia.json&path=data&type=generic"
npm: "https://www.npmjs.com/package/@zenetys/ztable"
work: true
---

## À propos {#about}

Ztable est une **visionneuse et un navigateur JSON** sans serveur, développés par l'équipe de [ZENETYS](https://www.zenetys.com) et publiés en open source sous licence MIT.
À partir d'une URL (fichier JSON ou point d'accès d'API), d'un fichier JSON téléversé ou d'un JSON collé, l'outil affiche les données en vue objet ou en tableau, sans rien installer côté serveur.
Son composant de tableau, **AutoTable**, est aussi publié sur [npm](https://www.npmjs.com/package/@zenetys/ztable) pour être réutilisé dans d'autres interfaces Vuetify.
J'ai contribué à la maintenance du paquet ; le cœur du projet est le travail de l'équipe.

## Fonctionnement {#views}

- **Vue objet** — les paires clé/valeur d'un objet, affichées telles quelles
- **Vue tableau** — les en-têtes sont générés à partir des données, avec pagination et nombreuses options de formatage
- **Navigation** — les tableaux et objets imbriqués apparaissent sous forme de liens qui descendent d'un niveau ; un fil d'Ariane et une arborescence de la structure JSON permettent de remonter
- **Partage** — pour une source distante, l'URL, le chemin, le type et la configuration sont conservés dans l'adresse : partager l'URL partage donc la vue (un JSON collé ou téléversé n'est pas concerné)

## Le composant AutoTable {#autotable}

- **Tri et pagination** — tri par colonne, avec des fonctions de tri personnalisables, et pagination activable (pages de 50, 100 ou 150 lignes, ou tout afficher ; 50 par défaut)
- **Colonnes** — redimensionnables et réordonnables par glisser-déposer, avec un menu pour les afficher ou les masquer ; les préférences sont conservées dans le navigateur
- **Cellules** — copie dans le presse-papiers, formatage texte ou HTML par colonne, infobulles et troncature
- **Sélection** (activable) — cases à cocher par ligne, avec sélection d'une plage au `Maj` + clic
- **Export CSV** — un bouton de la barre d'outils exporte en CSV toutes les lignes chargées, et pas seulement la page affichée ; le CSV n'est qu'un format de sortie, les données entrantes étant du JSON

## Utilisation {#usage}

AutoTable est un composant **Vue 2.7** pour **Vuetify 2** : Vue, Vuetify et axios sont des dépendances de pair, à installer côté application.

```bash
npm install @zenetys/ztable
```

```js
import AutoTable from "@zenetys/ztable";

export default { components: { AutoTable } };
```

Le composant peut aussi se charger depuis un CDN avec son build UMD : il s'enregistre alors tout seul sous la balise `<auto-table>` dès que Vue est présent. La procédure complète figure dans le [README](https://github.com/zenetys/ztable#readme).

## Dans l'écosystème ZENETYS {#ecosystem}

- **Kompot** — l'interface web de Kompot s'appuie sur AutoTable pour ses tableaux
- **Zenetys Tools** — Ztable est présenté dans [le portail des outils de ZENETYS](/projet/zeportal), dans sa visionneuse intégrée

## Ma contribution {#contribution}

J'ai participé à la maintenance du paquet en octobre 2026 : **cinq commits**, intégrés à la version 2.1.17 publiée sur npm par l'équipe.
Le cœur du composant — tableau, arbre, préférences, export — est le travail de mes collègues ; ma part porte sur les dépendances, le build et la documentation :

- **Identifiants des nœuds** — `vue-uuid` est remplacé par un simple compteur local, ce qui retire une dépendance pour numéroter les nœuds de l'arbre
- **Dépendances** — axios (0.28 vers 0.34) et Vite (4 vers 7) sont mis à jour, les dépendances inutiles supprimées et celles mal placées déplacées en `devDependencies`, ce qui ferme les alertes Dependabot sur axios et Vite ; Vue, Vuetify et axios restent des dépendances de pair, et le paquet publié depuis la 2.1.17 n'a plus aucune dépendance propre
- **Publication** — un script `prepack` construit la bibliothèque avant l'empaquetage, pour ne pas publier le build de démo à sa place, et le paquet n'embarque plus que `dist` et les sources de `lib`
- **CDN et documentation** — la version d'axios est mise à jour dans l'exemple CDN du README et dans la démo autonome, et le prérequis Node.js (20.19 ou 22.12) est documenté, comme l'exige Vite 7

## Stack technique {#tech}

Le composant est écrit en **JavaScript** et en composants monofichier **Vue 2.7**, sur **Vuetify 2**, avec **axios** en dépendance de pair.
La bibliothèque est construite avec **Vite 7** en ESM et en UMD, accompagnée de sa feuille de style, et le projet est publié sous licence **MIT**.

## Ressources {#resources}

- **Code source** — [github.com/zenetys/ztable](https://github.com/zenetys/ztable), publié en open source par ZENETYS
- **Paquet npm** — [@zenetys/ztable](https://www.npmjs.com/package/@zenetys/ztable)
- **Démo en ligne** — [tools.zenetys.com/ztable](https://tools.zenetys.com/ztable/)
