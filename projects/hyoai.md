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
- **Branches** — éditer un message ou régénérer une réponse crée une version alternative navigable
- **Citer & répondre** — citer un message entier ou une simple sélection de texte pour ancrer la question suivante
- **Raisonnement** — le `reasoning_content` s'affiche dans un bloc repliable, avec des statistiques par message (tokens, tok/s, durée)
- **Mode comparaison** — lancer le même prompt sur deux modèles côte à côte, chaque panneau gardant son propre choix de raisonnement
- **Markdown & sources** — tables, coloration syntaxique et citations de sources rendues en ligne
- **Images** — coller ou glisser-déposer, redimensionnées côté client avant l'envoi (format vision OpenAI)
- **Responsive** — sur mobile, les menus s'ouvrent en drawers par le bas (poignée, swipe, safe-area), et l'ensemble reste accessible au clavier via les primitives Radix

## Stack technique {#tech}

Construit avec **Next.js** (App Router, export statique en production), **React 19** et **TypeScript strict**, HYOAI utilise **Tailwind CSS v4**, **shadcn/ui** (primitives Radix), next-themes (avec deux skins `soft` et `flat`), next-intl (FR/EN), react-markdown et lz-string.
Le projet est publié sous licence **Apache 2.0**.