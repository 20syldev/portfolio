---
name: LogCenter
description: Plateforme de collecte, d'archivage et de visualisation de logs de ZENETYS, hébergée en SaaS sous le nom LogVault.
longDescription: "Plateforme de gestion de logs publiée par ZENETYS sous licence MIT : scripts de liaison, configurations et exemples autour d'Elasticsearch, Kibana et rsyslog pour collecter, archiver, parser, indexer et visualiser des logs. J'ai contribué à son interface web en Vue.js, qui suit le volume de logs reçu par machine et permet de télécharger les archives."
tags: ["Vue.js", "Vuetify", "Chart.js", "Elasticsearch"]
github: "https://github.com/zenetys/logcenter"
work: true
---

## À propos {#about}

LogCenter est la plateforme de gestion de logs de [ZENETYS](https://www.zenetys.com), conçue pour **collecter, archiver, parser, indexer et visualiser** des logs. Le dépôt public réunit les scripts de liaison, les fichiers de configuration et les exemples qui permettent de la construire, sous licence MIT.
La même plateforme est hébergée par ZENETYS en SaaS sous le nom **LogVault**, dont le site marketing fait l'objet d'une page à part : [LogVault](/projet/logvault).
J'ai contribué à l'interface web des archives, développée en Vue.js, le reste de la plateforme étant un travail de l'équipe. Le code est publié sur [github.com/zenetys/logcenter](https://github.com/zenetys/logcenter) et le projet est présenté sur la [page LogCenter du site ZENETYS](https://www.zenetys.com/zlab/logcenter/).
Ce LogCenter n'a rien à voir avec celui de la page [Logs](/projet/logs), une interface personnelle pour les logs de mon API.

## Pourquoi ce projet ? {#why}

Une plateforme de logs reçoit, archive et indexe en continu des flux venus de sources très différentes. Encore faut-il pouvoir répondre simplement à quelques questions : combien la plateforme reçoit-elle, de quelles machines, et comment récupérer les archives d'une période donnée ?
L'interface web des archives répond à ces besoins :

- **suivre ce que la plateforme reçoit**, avec le volume reçu et le volume indexé sur une période
- **comparer les machines** entre elles, heure par heure, jour par jour ou mois par mois
- **télécharger les archives** d'une heure précise sans passer par la ligne de commande

Côté LogVault, l'offre SaaS met en avant la conformité réglementaire (RGPD, NIS2, DORA) et l'observabilité.

## La plateforme {#platform}

Le dépôt est un assemblage de briques, écrites surtout en Shell, avec aussi du Ruby, du Lua et du Python :

- **Outils en ligne de commande** — des scripts d'administration, dont une famille `es-*` pour Elasticsearch et une famille `kbn-*` pour Kibana, ainsi que `zlccli`, dont la commande `list-archives` alimente le rapport hebdomadaire
- **Collecte** — des configurations rsyslog d'exemple, notamment pour transmettre les logs à Elasticsearch ou lire des fichiers
- **Addons par source** — un dossier par type de source, comme `fortigate`, `panos`, `o365`, `winlog`, `squid` ou `haproxy`
- **Signature des archives** — les outils `fsig`, `sigfiled` et `find-unsigned-logs` signent les archives de logs et repèrent celles qui ne le sont pas encore
- **Exemples de configuration** — Elasticsearch, Kibana, HAProxy, keepalived, lighttpd, systemd et SELinux
- **Rapport hebdomadaire** — `generate-weekly-report` produit un rapport HTML de la consommation de la semaine, avec l'espace utilisé par les archives et par Elasticsearch
- **Packaging** — un fichier `logcenter.spec` et un script `rpmbuild-docker` pour construire un paquet RPM

## L'interface des archives {#ui}

L'application web s'intitule « Volume reçu sur la plateforme LogVault ». Elle dialogue avec des scripts CGI, dont `get-archives.cgi`, écrit en Bash, qui renvoie les archives demandées.

- **Volume par période** — un graphique du volume reçu et du volume indexé, par heure, jour, semaine ou mois, avec une navigation par jour, mois, trimestre ou année
- **Navigation dans le temps** — un clic sur une barre ou sur une cellule descend vers une période plus fine, de l'année au mois puis au jour
- **Tableau par machine** — les volumes de chaque machine, 25 lignes par page et en-têtes fixes
- **Filtre par machine** — une sélection multiple, les machines pouvant s'afficher sous un alias que l'on modifie en double-cliquant
- **Téléchargement des archives** — depuis une cellule du tableau en vue jour, après une confirmation
- **En-tête** — le nom de l'utilisateur, un accès à Kibana quand il est disponible, l'espace utilisé par les archives et par Elasticsearch par rapport au maximum prévu, la déconnexion et un logo qui suit le thème clair ou sombre
- **Erreurs visibles** — un message s'affiche quand les données ne peuvent pas être récupérées

## Ma contribution {#contribution}

L'interface existait déjà avant mes premiers commits (février 2025) : 43 de mes 45 commits, étalés jusqu'en février 2026, portent sur elle, les deux autres sur le rapport hebdomadaire et un script CGI. Les alias de machines et la plateforme elle-même sont le travail d'autres membres de l'équipe.

- **En-tête et identité** — le nom d'utilisateur, le bouton Kibana et la déconnexion, le logo clair et sombre selon la préférence du système, puis un logo cliquable vers le site de ZENETYS
- **Téléchargement des archives** — la première version date de février 2025. En novembre 2025, je l'ai fait passer par un envoi de formulaire natif, sans axios, pour que le navigateur ouvre directement sa fenêtre de téléchargement, et `get-archives.cgi` accepte désormais aussi ce format
- **Graphique et tableau** — ils se recalculent selon le filtre par machine sélectionné
- **Tableau** — 25 lignes par page par défaut, et le nom de chaque machine en infobulle
- **Tri** — un tri naturel des adresses IP, comparées octet par octet, et des noms de machines
- **Style** — plusieurs passes sur les styles globaux, la barre de recherche, les boutons, les filtres et la largeur du contenu
- **Rapport hebdomadaire** — les barres d'utilisation sont plafonnées à 100 %, pour qu'un dépassement ne fasse plus déborder la jauge

## Stack technique {#tech}

L'interface repose sur **Vue 3** et **Vite**, avec **Vuetify** pour les composants, **Chart.js** (via vue-chartjs) pour les graphiques et vue-router pour la navigation, en JavaScript. Le reste de la plateforme s'appuie sur **Elasticsearch**, **Kibana** et **rsyslog**, assemblés par des scripts Shell, Ruby, Lua et Python.
Le projet est publié sous licence **MIT**.