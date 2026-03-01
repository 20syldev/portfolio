---
order: 15
name: Chat
description: Application de chats publics et privés en ligne.
longDescription: Application de messagerie en temps réel avec salons publics et conversations privées.
tags: ["HTML", "CSS", "JS"]
github: "https://github.com/20syldev/chat"
demo: "https://chat.sylvain.sh"
---

## À propos {#about}

Ce site permet de créer des chats temporaires (1h) en ligne via mon [API](https://api.sylvain.sh).
Vous pouvez partager votre clé et n'importe qui pourra se connecter au chat quand il le souhaitera.

## Fonctionnalités {#features}

Le chat fonctionne à l'aide de mon [API](https://api.sylvain.sh) qui permet de créer un nouveau chat à l'aide de n'importe quelle clé.
Vous pouvez partager votre clé et n'importe qui pourra se connecter au chat tant qu'il la possède. Le chat est temporaire et se ferme automatiquement après 1h.

Les tokens utilisés pour sécuriser les échanges sont générés directement via l'API.
Il suffit de créer un nouveau chat avec un token de votre choix, ou d'en générer un automatiquement.

## Sécurité et confidentialité {#security}

Les données ne sont accessibles que pendant une heure, ce qui signifie que même si quelqu'un obtient votre clé, il ne pourra pas accéder à vos données après l'expiration.
Aucune donnée n'est conservée au-delà de cette période : les messages sont automatiquement supprimés.

À ce moment-là, utilisez une nouvelle clé, partagez-la et commencez un nouveau chat. C'est simple et sécurisé.
Cette approche éphémère garantit la confidentialité de vos échanges sans nécessiter de création de compte.