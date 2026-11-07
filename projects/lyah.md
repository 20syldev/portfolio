---
name: Lyah
description: Application de chat collaboratif où l'on peut interpeller des modèles d'IA internes, par ZENETYS.
longDescription: "Application de chat collaboratif développée chez ZENETYS : des conversations privées ou publiques en temps réel par WebSocket, des modèles d'IA internes que l'on interpelle depuis le chat et dont la réponse s'affiche en streaming pour tous les membres, et un mode vocal avec mot d'activation. L'interface est en HTML, CSS et JavaScript sans framework, adossée à un serveur Node.js et à PostgreSQL."
tags: ["Node.js", "WebSocket", "PostgreSQL", "Voice"]
work: true
---

## À propos {#about}

Lyah est une application de **chat collaboratif**, commencée en mars 2025 chez [ZENETYS](https://www.zenetys.com), où l'on discute entre collègues et où l'on peut interpeller les modèles d'IA internes depuis la conversation.
Le projet réunit une **interface web** en HTML, CSS et JavaScript, un **serveur Node.js** qui expose une API HTTP et un canal WebSocket au-dessus de PostgreSQL, et trois **agents Python** écrits par l'équipe. Le code est interne à ZENETYS.
J'ai conçu et développé l'interface ainsi que le serveur Node.js, les agents Python étant un travail de l'équipe.
Il a depuis été remplacé par [HYOAI](/projet/hyoai).

![Démonstration de Lyah](/videos/lyah-demo.mp4)

## Pourquoi ce projet ? {#why}

Lyah rassemble dans une même interface une messagerie d'équipe et l'accès aux modèles d'IA internes de ZENETYS.
Les objectifs étaient de :

- **discuter à plusieurs** — conversations privées ou publiques, invitations, mentions et notifications, comme dans une messagerie classique
- **interroger les modèles d'IA depuis la conversation** — chaque modèle est un compte de type IA, que l'on choisit dans le sélecteur ou que l'on interpelle avec `@nom`, et dont la réponse est visible par tous les membres du chat
- **recueillir des retours** — chaque réponse d'un modèle peut être notée d'un pouce haut ou bas, pour améliorer les modèles

## L'interface {#interface}

L'interface est écrite à la main, sans framework ni étape de build : des modules JavaScript, des feuilles de style découpées par composant et un serveur qui sert directement les fichiers.

- **Conversations** — un menu latéral rétractable liste les chats, avec favoris, icônes personnalisables, renommage par double-clic et menu contextuel (utilisateurs, confidentialité, identifiant à copier, quitter, supprimer)
- **Groupes** — un chat est privé ou public ; son créateur y invite des comptes avec une saisie à complétion automatique, qui écarte les membres et les invitations en attente, et l'on peut demander à rejoindre un chat public
- **Mentions et notifications** — taper `@` propose les comptes, utilisateurs et modèles d'IA : choisir un utilisateur le mentionne et lui envoie une notification, choisir un modèle lui adresse le message ; invitations, demandes et mentions arrivent dans un panneau de notifications
- **Recherche** — une fenêtre unique cherche dans les messages, les chats et les utilisateurs, avec un filtre par type
- **Messages** — rendus en Markdown avec coloration syntaxique du code et nettoyage du HTML, les vingt derniers à l'ouverture, puis dix de plus à chaque demande vers le haut
- **Profil** — photo importée ou initiales générées côté serveur, nom d'affichage modifiable, état en ligne ou inactif
- **Apparence** — thème clair, sombre ou système, deux modes d'interface (normal et large) et quatre langues : français, anglais, allemand et espagnol
- **Raccourcis clavier** — une série de combinaisons `Alt` pour la recherche, les réglages, le thème, la langue ou le menu, listées dans une fenêtre dédiée
- **Responsive** — l'interface s'adapte à tous les écrans, un balayage vers la droite ouvre le menu latéral et vers la gauche le referme ; une application web installable (manifeste et service worker) met en cache les styles et la police

## Temps réel et données {#realtime}

Les messages des utilisateurs passent par un **WebSocket** : le client y envoie des actions nommées (envoyer ou supprimer un message, inviter ou retirer un utilisateur, renommer un chat, changer son icône ou sa confidentialité, lire une notification...). Le serveur les enregistre dans PostgreSQL puis les diffuse aux membres du chat concernés.
L'API HTTP s'occupe du reste : authentification, avatars, liste des modèles, recherche, création des chats, ainsi que l'IA et la voix, dont les réponses sont enregistrées côté serveur puis relayées en WebSocket.

- **Authentification déléguée** — l'identité est transmise par le reverse proxy, le compte est créé à la première visite et une session d'une heure est prolongée tant qu'on est actif, avec cinq sessions au plus par compte
- **Sessions revérifiées** — la session et le compte sont contrôlés à l'ouverture du WebSocket puis à chaque message reçu
- **Présence** — un utilisateur est en ligne s'il a été vu dans les deux dernières minutes, inactif jusqu'à cinq minutes
- **Suppression douce** — les messages et les chats supprimés restent en base avec une date de suppression
- **Un schéma compact** — sept tables : comptes, chats, messages, sessions, appartenances aux chats (avec dernier message lu et favori), notifications et retours sur les modèles

## Modèles d'IA et voix {#ai}

Un modèle d'IA est un compte de type IA, avec sa propre configuration. Quand un utilisateur envoie un message avec un modèle actif, son navigateur appelle l'API, qui parle à l'un des deux types de services déclarés dans la configuration : le **service interne** de ZENETYS ou un **endpoint compatible OpenAI**. Avant chaque requête, le serveur contrôle la disponibilité du service : un modèle injoignable n'est plus sélectionnable plutôt que de laisser un envoi échouer.
La réponse est lue en **streaming** puis relayée par WebSocket à tous les membres du chat, si bien que chacun la voit s'écrire en direct. Le message complet est enregistré à la fin, avec son raisonnement, ses sources et ses statistiques.

- **Désactivés par défaut en groupe** — dans un chat à plusieurs membres, le modèle est désactivé par défaut ; on l'appelle alors au coup par coup avec `@modele texte` en début de message, ou en le réactivant dans le sélecteur
- **Raisonnement** — un interrupteur demande au modèle de réfléchir, et le raisonnement s'affiche dans un bloc avant la réponse
- **Sources et statistiques** — les sources citées, le nombre de tokens, le débit et la durée sont conservés avec le message
- **Arrêt à la demande** — l'utilisateur peut interrompre une génération en cours, ce qui coupe la requête vers le modèle
- **Titre automatique** — le service interne peut nommer lui-même la conversation
- **Retours** — le pouce haut ou bas enregistre le modèle, la question et la réponse, une seule fois par message

Le dépôt contient aussi trois **agents Python** (FastAPI) écrits par l'équipe : une recherche documentaire (RAG) sur la base de connaissances de l'entreprise, un agent qui traduit les questions en SQL en validant la requête avant de l'exécuter, et un autre qui les traduit en SPARQL sur un graphe de connaissances du réseau. Ils interrogent un modèle servi par Ollama.

Depuis décembre 2025, Lyah propose aussi un **mode vocal**. Le navigateur enregistre l'audio, détecte la fin de la phrase par un silence d'environ 1,5 seconde, puis l'envoie au serveur, qui le transmet à un service externe de reconnaissance vocale, d'IA et de synthèse vocale, puis relaie son flux en continu. La transcription et la réponse apparaissent dans la conversation et sont enregistrées comme des messages d'appel, la voix étant jouée avec un visualiseur animé. Un **mot d'activation**, détecté dans le navigateur par un modèle ONNX, peut lancer la conversation sans toucher à l'écran.

## Stack technique {#tech}

Le serveur est en **Node.js** (modules ES) avec **Express**, **ws** pour le WebSocket, **pg** pour **PostgreSQL**, multer pour les envois de fichiers, luxon pour les dates et node-canvas pour générer les avatars.
L'interface n'utilise aucun framework : **HTML, CSS et JavaScript** natifs, avec marked pour le Markdown, DOMPurify pour assainir le rendu, highlight.js pour le code, l'API Web Audio pour la voix et ONNX Runtime pour le mot d'activation.
Les agents sont en **Python** avec FastAPI.