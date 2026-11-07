---
name: Plugin Draw.io pour YaNa
description: Plugin Draw.io qui dessine un schéma réseau à partir de l'API YaNa et colore ses switchs selon leur état, pour ZENETYS.
longDescription: "Plugin JavaScript pour Draw.io (diagrams.net) qui génère un schéma de base d'un réseau à partir de l'API YaNa : switchs, liens entre eux, ports, VLANs, vitesse et duplex. Les équipements sont colorés selon leur état en direct, et ceux que l'on déplace à la main sont laissés en place par la disposition automatique."
tags: ["JavaScript", "Draw.io", "YaNa", "Network"]
github: "https://github.com/20syldev/drawio-ext"
work: true
---

## À propos {#about}

Ce plugin pour **Draw.io** (diagrams.net) génère un schéma de base d'un réseau à partir des données de **YaNa**, une API REST, et colore chaque équipement selon son état en direct, grâce au plugin **Live.js** qui interroge une seconde API (Kompot). Il a été développé pour [ZENETYS](https://www.zenetys.com) et son code est publié sur [github.com/20syldev/drawio-ext](https://github.com/20syldev/drawio-ext).
J'ai écrit le plugin `yana.js`, entre décembre 2024 et février 2025. Le dépôt contenait à l'origine un seul plugin, **Live.js**, qui met à jour les éléments d'un diagramme depuis une API REST : il avait été écrit par l'équipe avant mon intervention et a été retiré du dépôt quand `yana.js` y a été ajouté, mais `yana.js` continue de s'appuyer sur lui.

## Pourquoi ce projet ? {#why}

Plutôt que de dessiner un schéma réseau à la main, l'idée était de le créer à partir des données que les API exposent déjà, et d'y ajouter une couleur d'état en direct pour chaque équipement.
L'objectif était donc de :

- **générer le schéma depuis les données** — choisir une entité, et obtenir ses switchs et leurs liaisons sans rien dessiner
- **montrer l'état des équipements** — une couleur par équipement, calculée à partir de l'API live
- **rester dans Draw.io** — le résultat est un diagramme ordinaire, que l'on peut déplacer, compléter et enregistrer comme les autres

## Du réseau au schéma {#graph}

Le plugin ajoute des entrées à la barre d'outils de Draw.io : **Select APIs**, **Select Entity**, **Load**, **Re-update**, **Reset** et **Force Layout**. Le parcours tient en quelques étapes :

1. on renseigne l'adresse de l'API live (Kompot) et celle de l'API YaNa
2. le plugin liste les entités disponibles et l'on en choisit une, par exemple un réseau ou un groupe d'équipements
3. il récupère en parallèle les switchs de l'entité, leurs liaisons et leurs interfaces, puis dessine le graphe
4. une disposition organique, calculée avec la disposition `mxFastOrganicLayout` de Draw.io, répartit les éléments

Chaque équipement devient une boîte portant son nom (sans le domaine) et sa première adresse IP, dont la taille et la police grandissent avec son nombre de connexions. Il porte aussi un lien vers Kompot, filtré sur son nom.
Les liens ne sont tracés qu'entre switchs connus, avec un seul lien par paire de switchs même si les deux extrémités le déclarent, et leur couleur dépend de la vitesse et du duplex : rouge sous 1 Gbit/s ou pour la valeur de duplex 2, noir sinon.
Chaque extrémité d'un lien porte une étiquette avec le nom du port. Les VLANs affichés (`Tag` et `Untag`, le VLAN natif étant souligné dans `Untag`) sont ceux du port source du lien.

## Des couleurs d'état en direct {#live}

Les couleurs viennent de Live.js. Pour chaque équipement, `yana.js` écrit des attributs `live.property.fillColor` et `live.property.fontColor` dont l'expression appelle la fonction `cState` à partir des données de l'hôte renvoyées par l'API live. Le premier équipement porte la déclaration de cette source de données, partagée ensuite par tous.
La fonction `cState`, définie dans `PreConfig.js`, associe le code d'état de l'hôte renvoyé par l'API live à une couleur de fond et à une couleur de texte :

- **gris** — les codes 0 à 2, et un équipement inconnu de l'API
- **vert** — les codes 3 et 4
- **orange** — les codes 5 à 7
- **rouge** — les codes 8 et 9

Les adresses des API et l'entité choisie sont enregistrées dans les données de la cellule racine du diagramme, visibles dans « Edit Data », avec des valeurs par défaut qui pointent vers les API de ZENETYS et l'entité `demo`. Un diagramme rouvert reprend donc sa source sans rien ressaisir.

## Un schéma que l'on peut ranger {#layout}

Quand on déplace un équipement à la souris, le plugin lui pose l'attribut `yana.moved`. La disposition organique ne touche alors plus à cet équipement, ce qui permet de ranger le schéma à sa façon : **Force Layout** relance la disposition uniquement sur les équipements qui n'ont pas été déplacés. Un déplacement au clavier ne pose pas ce drapeau.
**Reset** vide le diagramme.

## Installation {#install}

Les plugins sont désactivés dans la version navigateur de Draw.io : le README demande **Draw.io v24.7.1 ou plus** et renvoie vers la version de bureau 24.7.17. Le plugin se charge ensuite de l'une des trois manières décrites :

- **Au démarrage** — en déclarant `yana` dans le registre des plugins depuis `PostConfig.js`, puis en le chargeant avec `App.loadPlugins`
- **À la demande** — par l'URL, avec `?plugins=1&p=<id>` pour un plugin déjà déclaré dans `App.pluginRegistry`
- **En mode plugin personnalisé** — avec `window.ALLOW_CUSTOM_PLUGINS = true`

Le dépôt fournit aussi un `PreConfig.js`, adapté du fichier de Draw.io et à prendre comme base : interface en anglais ou en français, sauvegarde locale uniquement, stockages cloud, écran d'accueil et PWA désactivés, ainsi que les fonctions de couleur utilisées par les attributs live. Quelques paramètres y restent à renseigner, et `PostConfig.js` se modifie à la main, comme le décrit le README.

## Stack technique {#tech}

Le plugin est écrit en **JavaScript** natif, dans un seul fichier d'environ 600 lignes très commentées, sans paquet npm ni étape de build. Il s'appuie sur l'API de plugins de Draw.io, sur la bibliothèque de graphes mxGraph qu'elle expose et sur le plugin Live.js.
Il interroge l'API YaNa avec `fetch` (la liste des entités, puis les équipements, un export des liaisons et les interfaces de l'entité choisie) et charge la police Montserrat pour les libellés. Le projet est publié sous licence **MIT**.