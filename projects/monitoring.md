---
name: Monitoring
description: Interface et API de supervision adossées à Elasticsearch, par ZENETYS.
longDescription: "Outil de supervision interne de ZENETYS, recréé de zéro : une API Node.js qui expose en REST les alertes stockées dans Elasticsearch et une interface web en JavaScript natif, sans framework ni build, pour les trier, les acquitter, les suivre, les commenter et les partager, sur ordinateur comme sur mobile."
tags: ["Node.js", "Elasticsearch", "Alerting", "JS"]
work: true
---

## À propos {#about}

Monitoring est l'outil de **supervision** utilisé en interne par [ZENETYS](https://www.zenetys.com) pour suivre les alertes de son infrastructure et de celle de ses clients.
Il se compose de deux blocs : une **API Node.js** qui lit les alertes dans Elasticsearch et les expose en REST, et une **interface web** qui les affiche et se rafraîchit seule toutes les 30 secondes.
Les alertes proviennent de la chaîne d'ingestion existante de l'équipe ; j'ai développé de zéro l'interface et l'API. Elles étaient auparavant consultables avec Kibana, et je voulais une solution plus intégrée et personnalisable.
L'outil est interne : il n'a ni démo publique ni code publié.

## Pourquoi ce projet ? {#why}

Kibana sait afficher des documents Elasticsearch, mais pas organiser le travail d'un opérateur de supervision : repérer ce qui est urgent, dire qu'on s'en occupe, laisser une trace pour l'équipe, ouvrir le bon graphique.
L'objectif était donc de :

- **réunir sur un seul écran** les alertes en cours, les changements d'état récents, l'activité sur les dernières heures et l'état des tickets du support
- **agir directement sur les alertes** — acquitter, suivre, désactiver, commenter ou les partager — sans quitter le tableau
- **s'adapter à la façon de travailler de l'équipe** : filtres par client, affichage réglable, raccourcis clavier, mode kiosque pour un affichage permanent

## L'interface {#ui}

L'interface est écrite en **HTML, CSS et JavaScript natifs** : des modules ES chargent des gabarits HTML à la demande, sans framework, sans dépendance et sans étape de build. Les composants de mise en page, les badges d'état et les animations CSS sont faits maison.
Elle se recharge aussi d'elle-même quand le serveur a redémarré.

- **Tableau des alertes** — équipement, indicateur, état, durée et sortie du contrôle, avec des badges colorés critique, avertissement et inconnu
- **Confirmées et non confirmées** — un changement d'état de moins de cinq minutes reste dans un panneau à part, et passe dans le tableau principal une fois confirmé ; une vue regroupe l'ensemble, paginée au défilement
- **Tri par urgence** — d'abord les alertes sous SLA actif et non prises en charge, puis celles hors SLA, puis celles déjà acquittées ou désactivées ; à l'intérieur, par gravité (critique, inconnu, avertissement) puis par criticité de l'équipement, les plus anciennes en tête pour celles sous SLA
- **Délais de réponse** — pour les alertes critiques sous contrat SLA actif, une infobulle donne le temps restant avant le dépassement (ou la durée du dépassement), et le badge s'anime à mesure que l'échéance approche
- **Panneau de détails** — identité de l'équipement, état, durée, dernier événement, sortie et commentaires, repliable par sections
- **Graphe d'activité** — un histogramme minute par minute des états reçus sur les dernières heures, et une horloge
- **Compteurs de tickets** — des boîtes alimentées par les statistiques du support, dont les seuils passent en avertissement puis en critique, et peuvent clignoter après un délai
- **Recherche et filtres** — une recherche plein texte, des filtres par état et par action, et des raccourcis par client ; la vue, la recherche et les filtres sont reflétés dans l'URL pour être partagés ou rechargés
- **Réglages** — hauteur des lignes, désactivation des animations, horloge, notifications, comportement de la barre d'outils, et un thème qui suit la préférence du système
- **Mode kiosque** — le paramètre `kiosk=1` active les notifications et désactive les infobulles pour un affichage permanent

L'interface s'adapte aussi aux petits écrans avec des composants dédiés plutôt qu'un simple redimensionnement : les alertes deviennent des **cartes** au lieu de lignes de tableau, la recherche et les filtres passent dans un **tiroir**, et le détail s'ouvre dans une **feuille** qui glisse depuis le bas. La sélection multiple s'y fait par appui long.

## Agir sur les alertes {#actions}

Chaque alerte peut être **acquittée**, **suivie** ou **désactivée**, individuellement ou par sélection multiple, et recevoir des **commentaires** partagés avec l'équipe. L'utilisateur est identifié par le reverse proxy, et ses actions apparaissent dans les notifications.

- **Clavier** — flèches pour parcourir les lignes et raccourcis pour les actions ; maintenir `Ctrl` au survol d'une ligne, ou les flèches gauche et droite sur la ligne sélectionnée, révèle les boutons d'action
- **Partage par courriel** — l'alerte est envoyée, par défaut au support, à un ou plusieurs destinataires de l'entreprise, avec un lien vers la vue filtrée sur cet équipement et cet indicateur ; plusieurs alertes peuvent être groupées dans un seul message
- **Graphiques et supervision** — depuis une alerte, un clic ouvre le graphe de l'indicateur dans Grafana ou la fiche du service dans Thruk
- **Notifications** — les alertes des quinze dernières minutes et les actions de l'équipe s'affichent en haut à droite, et se ferment une à une

## L'API {#api}

L'API est une application **Express** en modules ES qui sert aussi l'interface en statique. Elle expose en REST la lecture des alertes, les actions par lot, les commentaires, les notifications et les courriels.
La plupart des lectures et des actions sont des **gabarits JSON** de requête Elasticsearch, ce qui permet de les faire évoluer sans toucher au code.

- **Recherche et pagination** — un paramètre de recherche filtre sur tous les champs, des paramètres de filtre et de tri affinent le résultat, et la vue complète est paginée
- **Compteurs configurables** — chaque boîte de tickets se définit dans un fichier de configuration par un libellé bilingue, une formule arithmétique sur les statistiques et des seuils ; le fichier est relu dès qu'il change, sans redémarrage
- **Mode démo** — une variable d'environnement floute les équipements, adresses IP, sites, contacts et commentaires dans l'interface

## Stack technique {#tech}

Le serveur tourne sur **Node.js** avec **Express**, **node-fetch** pour parler à Elasticsearch, **nodemailer** pour les courriels, **cors** et **dotenv** ; l'essentiel se règle par variables d'environnement.
L'interface n'embarque aucune bibliothèque : JavaScript natif, la police **Inter** variable et des icônes **Lucide** en SVG.
Le projet est vérifié avec **ESLint** et **Prettier**.