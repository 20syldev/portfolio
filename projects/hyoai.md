---
name: HYOAI
description: Interface de chat 100% navigateur pour tout LLM compatible OpenAI, par ZENETYS.
longDescription: "Interface de chat statique et sans serveur pour n'importe quel LLM compatible OpenAI (llama.cpp, vLLM, Ollama...), développée et open-sourcée par ZENETYS. Le navigateur communique directement avec le serveur d'inférence et les conversations ne quittent jamais la machine."
tags: ["Next.js", "TypeScript", "LLM", "Chat"]
github: "https://github.com/zenetys/hyoai"
demo: "https://tools.zenetys.com/hyoai/"
article: "https://www.zenetys.com/hyoai-un-client-de-chat-ia-sans-backend-dans-le-navigateur/"
---

## À propos {#about}

HYOAI (**H**ost **Y**our **O**wn **AI**) est une interface de chat pour dialoguer avec n'importe quel LLM compatible OpenAI, développée et open-sourcée par [ZENETYS](https://www.zenetys.com).
C'est un front-end **100% statique** : aucun backend, rien à déployer ni à sécuriser côté serveur. Le navigateur communique directement avec l'API de votre serveur d'inférence (llama.cpp, vLLM, Ollama, ou tout endpoint compatible OpenAI).
Une démo est disponible sur [tools.zenetys.com/hyoai](https://tools.zenetys.com/hyoai/), le code est publié sur [github.com/zenetys/hyoai](https://github.com/zenetys/hyoai) et le projet est présenté dans un [article sur le blog ZENETYS](https://www.zenetys.com/hyoai-un-client-de-chat-ia-sans-backend-dans-le-navigateur/).

## Pourquoi ce projet ? {#why}

Évaluer, comparer et benchmarker des LLM fait partie du travail de ZENETYS pour ses choix techniques et ceux de ses clients.
L'objectif était d'avoir un client de chat **sans dépendance** pour :

- **tester et benchmarker** rapidement des endpoints LLM, depuis n'importe quelle machine et sans installation
- **vérifier la compatibilité avec l'API OpenAI** à travers différents backends (llama.cpp, vLLM, Ollama, API publiques) depuis un seul client
- disposer d'un client **autonome et portable**, sans base de données, sans hébergement, et sans données quittant le navigateur

Parti comme un remplaçant de l'interface web embarquée de llama.cpp, il est devenu un client multi-backend généraliste.

## Une architecture 100% locale {#architecture}

HYOAI n'embarque **aucun modèle** : on branche le sien. La configuration passe par un fichier `config.json` servi à côté de l'application, éditable sans rebuild, qui décrit chaque modèle et l'endpoint qui le sert.
Les conversations ne quittent jamais le navigateur : elles vivent dans le `localStorage`, compressées via lz-string.
Le build statique se dépose n'importe où (object storage, CDN, ou juste à côté du serveur d'inférence).

## Multi-backend {#backends}

Un même client parle à plusieurs types d'endpoints, sélectionnables depuis le menu des modèles :

- **Local** — Ollama, llama.cpp ou vLLM exécutés sur votre propre matériel
- **Distant** — toute API compatible OpenAI qui envoie les en-têtes CORS (OpenRouter par exemple), ou via un reverse proxy same-origin
- **Raisonnement** — un toggle « thinking » et un sélecteur d'effort apparaissent dans le menu quand le modèle les déclare (Qwen3, gpt-oss...), chaque backend mappant ces réglages sur son propre corps de requête

## Fonctionnalités {#features}

- **Conversations locales** — index léger, une clé `localStorage` par conversation, écritures debouncées pendant le streaming, jauge d'usage et import/export JSON
- **Recherche** — recherche plein texte dans l'historique local, avec un extrait de contexte autour de chaque correspondance
- **Branches** — éditer un message ou régénérer une réponse crée une version alternative navigable
- **Citer & répondre** — citer un message entier ou une simple sélection de texte pour ancrer la question suivante
- **Raisonnement** — le `reasoning_content` s'affiche dans un bloc repliable, avec des statistiques par message (tokens, tok/s, durée)
- **Mode comparaison** — lancer le même prompt sur jusqu'à quatre modèles, la grille passant d'un panneau à deux côte à côte puis à 2×2, chacun gardant son propre choix de raisonnement
- **Compactage automatique** — quand la fenêtre de contexte se remplit, les tours les plus anciens sont résumés, une fraction de la fenêtre restant réservée au résumé
- **Markdown & sources** — tables, coloration syntaxique et citations de sources rendues en ligne
- **Pièces jointes** — images (redimensionnées côté client, format vision OpenAI), PDF, audio (mp3, wav) et fichiers texte, au collage comme au glisser-déposer
- **Réglages d'échantillonnage** — un champ laissé vide n'est pas envoyé et l'endpoint applique son propre défaut ; les noms de paramètres suivent le type d'endpoint (`repetition_penalty` pour vLLM, `repeat_penalty` et `dry_*` pour llama.cpp)
- **Raccourcis clavier** — `Ctrl/Cmd+K` pour la palette, `Ctrl/Cmd+B` pour la barre latérale, `Ctrl/Cmd+Shift+O` pour une nouvelle conversation
- **Responsive** — sur mobile, les menus s'ouvrent en drawers par le bas (poignée, swipe, safe-area), et l'ensemble reste accessible au clavier via les primitives Radix

## Widget embarquable {#embed}

Au-delà de l'application complète, HYOAI s'embarque dans une page tierce sous forme de widget en iframe, avec son propre stockage isolé.
Un pont `postMessage` relie la page hôte au widget : l'hôte pousse à chaud un prompt système, une langue ou un thème, injecte un tour de conversation, ou lance une commande en mode « headless » dont la réponse lui est renvoyée en streaming.
Le guide [`docs/embed.md`](https://github.com/zenetys/hyoai/blob/master/docs/embed.md) couvre les paramètres d'URL, l'isolation du stockage, la poignée de main, le dimensionnement et les points de sécurité.

## Intégrations {#integrations}

`config.json` accepte un tableau `integrations` qui branche des actions de l'interface sur des endpoints HTTP externes, sans toucher au code : ajouter un endpoint est une simple édition de configuration.
Chaque entrée vise tout ou partie des modèles et déclenche un `POST` JSON. Le type `feedback` ajoute par exemple des pouces haut et bas sous chaque réponse, qui transmettent la note et le message concerné.
Une entrée inconnue ou malformée est ignorée plutôt que de faire échouer toute la configuration.

## Stack technique {#tech}

Construit avec **Next.js** (App Router, export statique en production), **React 19** et **TypeScript strict**, HYOAI utilise **Tailwind CSS v4** et **shadcn/ui** (primitives Radix via le paquet unifié `radix-ui`).
S'y ajoutent next-themes avec six skins commutables (`flat`, `soft`, `contrast`, `warm`, `forest`, `dim`), next-intl (FR/EN, sans routing), react-markdown avec remark-gfm et rehype-highlight, pdfjs-dist pour la lecture des PDF, react-hook-form et zod pour les formulaires de réglages, et lz-string pour la compression des conversations.
Le projet est publié sous licence **Apache 2.0**.

## Ressources {#resources}

- **Code source** — [github.com/zenetys/hyoai](https://github.com/zenetys/hyoai), publié en open source par ZENETYS
- **Démo en ligne** — [tools.zenetys.com/hyoai](https://tools.zenetys.com/hyoai/)
- **Guide d'intégration** — [`docs/embed.md`](https://github.com/zenetys/hyoai/blob/master/docs/embed.md), pour embarquer HYOAI dans une page tierce
- **Article** — [HYOAI : un client de chat IA sans backend, dans le navigateur](https://www.zenetys.com/hyoai-un-client-de-chat-ia-sans-backend-dans-le-navigateur/), sur le blog ZENETYS
- **Démo vidéo** — une présentation de 30 secondes est disponible sur la [page alternance](/alternance#hyoai)