---
name: HYOAI
description: Interface de chat 100% navigateur pour tout LLM compatible OpenAI, par ZENETYS.
longDescription: "Interface de chat statique et sans serveur pour n'importe quel LLM compatible OpenAI (llama.cpp, vLLM, Ollama...), développée et open-sourcée par ZENETYS. Le navigateur communique directement avec le serveur d'inférence, compare jusqu'à quatre modèles côte à côte, appelle des outils et des serveurs MCP, et garde dans le navigateur les conversations, regroupées en projets avec leurs documents."
tags: ["Next.js", "TypeScript", "LLM", "Chat"]
github: "https://github.com/zenetys/hyoai"
demo: "https://tools.zenetys.com/hyoai/"
article: "https://www.zenetys.com/actu/hyoai-un-client-de-chat-ia-sans-backend-dans-le-navigateur/"
work: true
---

## À propos {#about}

HYOAI (**H**ost **Y**our **O**wn **AI**) est une interface de chat pour dialoguer avec n'importe quel LLM compatible OpenAI, développée et open-sourcée par [ZENETYS](https://www.zenetys.com).
C'est un front-end **100% statique** : pas de backend propre, rien à déployer ni à sécuriser côté serveur en dehors des fichiers statiques. Le navigateur communique directement avec l'API de votre serveur d'inférence (llama.cpp, vLLM, Ollama, ou tout endpoint compatible OpenAI qui autorise l'origine de la page).
Une démo est disponible sur [tools.zenetys.com/hyoai](https://tools.zenetys.com/hyoai/), le code est publié sur [github.com/zenetys/hyoai](https://github.com/zenetys/hyoai) et le projet est présenté dans un [article sur le blog ZENETYS](https://www.zenetys.com/actu/hyoai-un-client-de-chat-ia-sans-backend-dans-le-navigateur/).
La version 1.2.0 y a ajouté l'appel d'outils, la 1.3.0 les serveurs MCP, la 1.4.0 une fenêtre de réglages refondue, la 1.5.0 les projets, la 1.6.0 leurs documents et la 1.7.0 des animations plus douces avec un fondu entre les thèmes, jusqu'à la 1.7.1 actuelle.

![Démonstration de HYOAI](/videos/hyoai-demo.mp4)

## Pourquoi ce projet ? {#why}

Évaluer, comparer et benchmarker des LLM fait partie du travail de ZENETYS pour ses choix techniques et ceux de ses clients.
L'objectif était d'avoir un client de chat **sans dépendance côté serveur** pour :

- **tester et benchmarker** rapidement des endpoints LLM, depuis n'importe quelle machine et sans installation
- **vérifier la compatibilité avec l'API OpenAI** à travers différents backends (llama.cpp, vLLM, Ollama, API publiques) depuis un seul client
- disposer d'un client **autonome et portable**, sans base de données, sans serveur applicatif à héberger, et sans historique stocké ailleurs que dans le navigateur

Parti comme un remplaçant de l'interface web embarquée de llama.cpp, il est devenu un client multi-backend généraliste.

## Une architecture 100% locale {#architecture}

HYOAI n'embarque **aucun modèle** : on branche le sien. La configuration passe par un fichier `config.json` servi à côté de l'application, éditable sans rebuild (la page Configuration des réglages peut le surcharger localement), qui décrit chaque modèle et l'endpoint qui le sert. Quand aucun modèle n'est fixé pour une entrée, ses modèles sont découverts via le `/v1/models` de son endpoint.
Les conversations ne sont stockées que dans le navigateur : elles vivent dans le `localStorage`, compressées via lz-string, et ne partent que vers le serveur d'inférence configuré, ainsi que vers les serveurs d'outils et les intégrations que l'on branche explicitement.
Le build statique se dépose sur n'importe quel hébergement de fichiers statiques (object storage, CDN, ou juste à côté du serveur d'inférence).

## Multi-backend {#backends}

Un même client parle à plusieurs types d'endpoints, sélectionnables depuis le menu des modèles :

- **Local** — Ollama, llama.cpp ou vLLM exécutés sur votre propre matériel
- **Distant** — toute API compatible OpenAI qui envoie les en-têtes CORS (OpenRouter par exemple), ou via un reverse proxy same-origin
- **Raisonnement** — un interrupteur « Réflexion » et un sélecteur d'effort apparaissent dans le menu quand `config.json` les déclare (pour tous les modèles ou pour une entrée), avec les fragments de requête à envoyer pour chaque réglage. Le renvoi du raisonnement des tours précédents (`preserve_thinking`) est optionnel : désactivé par défaut, il se demande via `chat_template_kwargs` et suppose un modèle dont le template le gère

## Comparer des modèles {#compare}

Le mode comparaison envoie un même prompt à **jusqu'à quatre modèles** à la fois. Chaque panneau est attaché à son propre modèle et peut avoir son propre niveau de raisonnement (sinon il suit le réglage global), et la disposition tient dans l'URL : une comparaison se met en favori ou se partage (le lien reproduit les modèles et les réglages, les conversations restant dans le navigateur qui les a créées).
Fermer un panneau n'arrête pas sa génération : la conversation continue en arrière-plan (ou attend votre approbation d'un appel d'outil), apparaît dans la barre latérale et se rouvre à tout moment. Quand il ne reste qu'un panneau, la comparaison se termine et la conversation continue comme un chat normal.

![Une même question posée à trois modèles : deux répondent côte à côte avec leurs statistiques, le troisième est grisé « Indisponible » et écarté de l'envoi (démo publique, réponses préparées à l'avance)](/images/projects/hyoai/compare)

Tant que le réglage « Désactiver automatiquement les modèles indisponibles » est actif, ce qui est le cas par défaut, les modèles qui ne peuvent pas répondre sont **signalés plutôt que d'échouer à l'envoi** : un modèle dont le serveur ne répond pas ou ne liste plus le modèle est grisé « Indisponible » avec la raison et un bouton Réessayer, et un modèle désactivé dans la configuration est grisé avec sa raison. Dans un chat, le champ de saisie est bloqué avec cette raison ; en comparaison, le panneau est grisé et écarté de l'envoi (« Envoi à 2 panneaux sur 3 »). Rien n'est jamais basculé vers un autre modèle à votre insu.
Un serveur silencieux n'est pas coupé d'emblée : après 20 secondes (réglable) sans rien recevoir, HYOAI le sonde, et seule une sonde en échec (10 secondes au plus) interrompt la requête, si bien qu'un llama.cpp lent sur CPU, qui répond à la sonde, n'est pas interrompu.

## Outils {#tools}

Un modèle peut appeler des **outils** pendant qu'il répond. Ils sont désactivés par défaut : un bouton en forme de clé à molette dans le champ de saisie ouvre un panneau avec un interrupteur pour la conversation ouverte et la liste des fournisseurs d'outils, chacun avec le nombre d'outils qu'il apporte et un interrupteur global.
Quand le modèle demande un appel, l'application affiche l'outil et ses arguments complets et, sauf pour un outil déjà autorisé, attend votre décision : **autoriser une fois**, **toujours autoriser** (cet outil seulement, jamais un fournisseur entier) ou **refuser**, auquel cas le modèle reçoit un résultat lui disant que vous avez refusé et de poursuivre sans cet appel. Le résultat repart ensuite vers le modèle, qui répond ou demande d'autres appels, exécutés l'un après l'autre, chacun avec sa décision.
Une réponse s'arrête après 10 étapes par défaut (réglable de 1 à 50) : on peut alors continuer ou demander une réponse sans outils. Un résultat est plafonné à 20 000 caractères par défaut et affiché en texte brut, jamais en Markdown ni en HTML, et un appel est coupé après 60 secondes.

![Un appel d'outil en attente de décision : l'outil Heure actuelle et ses arguments complets, puis Autoriser une fois, Toujours autoriser ou Refuser (démo publique, réponses préparées à l'avance)](/images/projects/hyoai/toolcall)

Une approbation par outil se règle dans la page Outils des réglages (demander à chaque fois, toujours autoriser, ou masquer au modèle, auquel cas l'outil n'est pas proposé et le modèle ne peut pas l'appeler). Le panneau d'outils du champ de saisie indique combien d'outils d'un fournisseur sont masqués, pour expliquer pourquoi un modèle ne voit pas un outil laissé activé. L'application embarque un fournisseur **Horloge** avec un seul outil, **Heure actuelle**, pour essayer, et les plugins peuvent en apporter d'autres.
Côté sécurité, les images distantes ne sont pas chargées dans une réponse placée après un résultat d'outil sur sa branche : elles s'affichent comme un lien, ce qui limite ce qu'une instruction injectée peut faire sortir par une adresse d'image. L'import d'un fichier ne restaure ni les approbations ni les réglages d'outils.

Le serveur doit gérer les outils : llama.cpp doit être lancé avec `--jinja` (le support est lu dans le modèle de conversation), vLLM avec `--enable-auto-tool-choice` et un `--tool-call-parser` (et `"tools": true` dans l'entrée), Ollama et les autres serveurs compatibles via `"type": "openai"` avec `"tools": true`.

## Serveurs MCP {#mcp}

Depuis la 1.3.0, HYOAI est aussi un **client MCP** qui tourne dans le navigateur. Un serveur se déclare dans la liste `mcp.servers` de `config.json` ou s'ajoute depuis la page Serveurs MCP des réglages, avec un identifiant, une adresse, un nom, un transport et des en-têtes. Deux transports sont gérés, Streamable HTTP et SSE, le mode automatique essayant le premier puis retombant sur le second si le serveur ne connaît pas le premier.
Seuls les **outils** d'un serveur sont utilisés, ni ses ressources ni ses prompts, et OAuth n'est pas géré : l'authentification passe par des en-têtes statiques, typiquement un jeton Bearer. Comme HYOAI tourne dans le navigateur, ces en-têtes partent du navigateur, et ceux écrits dans `config.json` peuvent être lus par quiconque charge la page.

Chaque serveur est une carte dans les réglages, avec un statut (connecté, authentification, introuvable, pas de réponse, CORS bloqué, réseau local...), un interrupteur, la liste de ses outils et une approbation par outil. Les indications déclarées par le serveur (lecture seule, destructif...) s'affichent en badges, suivis de « déclaré par le serveur, non vérifié », et ne dispensent jamais d'approbation.

![Un serveur MCP dans les réglages de HYOAI : ses deux outils, chacun avec son approbation (« Demander à chaque fois ») et le badge « Lecture seule » suivi de « déclaré par le serveur, non vérifié » (démo publique)](/images/projects/hyoai/mcp)

Rien ne se connecte au démarrage : un serveur se connecte la première fois que ses outils sont demandés (affichage de sa carte, panneau d'outils ou réponse avec outils). Sa liste d'outils est bornée pour protéger le contexte du modèle (200 outils au plus, avec un budget de taille), et les images ou l'audio qu'il renvoie sont remplacés par une courte note. Une entrée de modèle peut aussi se limiter à certains serveurs avec `mcpServers`.

Une option par modèle, `recoverToolCalls`, désactivée par défaut, rattrape les appels que certains modèles écrivent en texte au format Hermes plutôt que par l'API, à condition que le bloc soit complet, en fin de texte et nomme un outil proposé, avec les mêmes règles d'approbation. Et pendant un échange d'outils, une réponse qui s'arrête sans dire pourquoi (flux coupé, appel tronqué ou jamais arrivé, réponse vide après un résultat) est maintenant signalée comme une erreur au lieu de rester muette.

## Projets {#projects}

Depuis la 1.5.0, un **projet** regroupe des conversations qui partagent des consignes et un modèle. Il a un nom, des consignes facultatives et un modèle par défaut facultatif, rien d'autre : ni icône ni couleur. Les projets sont conservés dans le navigateur comme les conversations. On en crée un depuis l'entrée **Déplacer vers un projet** du menu d'une conversation, ou depuis l'encadré que la barre latérale affiche tant qu'il n'y en a pas.
La barre latérale se découpe en sections : les conversations épinglées en haut, une section repliable par projet (les cinq premières conversations, puis un bouton Voir tout), puis les autres. Une section repliée garde un point tant qu'une de ses conversations génère ou attend votre approbation. Les consignes d'un projet jouent le rôle d'invite système pour ses conversations : le message système d'une conversation reste prioritaire, et elles l'emportent sur l'invite système globale. La recherche de la barre latérale peut se limiter à un projet. Les projets ne sont pas exportés, et le widget embarquable n'en affiche aucun.

La 1.6.0 y ajoute des **documents** : des fichiers texte, Markdown, CSV ou PDF, jusqu'à 1 Mo chacun et 5 Mo de texte par projet, que le modèle doit connaître dans chaque conversation, comme un guide de style, une liste de prix ou une FAQ produit. Seul le texte est gardé, lu une fois à l'ajout, et un PDF sans couche de texte est refusé. Les documents sont écrits dans IndexedDB, restent dans le navigateur, ne sont pas exportés et ne partent jamais par le widget.
Ils accompagnent chaque requête dans le message système, après les consignes, ajustés à la fenêtre du modèle qui répond. Quand ils ne tiennent pas tous, le choix **Quand le contexte déborde** du projet tranche : **Tronquer**, par défaut, envoie les documents dans l'ordre jusqu'à épuisement de la place et coupe celui qui dépasse, avec une note indiquant que sa fin a été retirée, tandis qu'**Exclure** n'en envoie aucun, pour que le modèle ne travaille jamais sur un document à moitié. La page Contexte du projet affiche une jauge par modèle activé (ce que le projet partage, la conversation et la place gardée pour la réponse), et le menu des modèles d'une conversation de projet reprend ces jauges, ce qui permet de voir quel modèle absorbe tout le contexte avant d'en choisir un. Les tailles sont des estimations, à quatre caractères par token.

## Réglages {#settings}

La fenêtre des réglages, refondue en 1.4.0, n'est plus faite d'onglets : c'est une liste de navigation à gauche et une page à la fois à droite, avec neuf pages en quatre groupes (Apparence et Comportement ; Modèles, Serveurs MCP et Outils ; Données et Configuration ; Échantillonnage et Découpage), les réglages de génération, les plus techniques, venant en dernier. Chaque réglage est une ligne à plat, avec son libellé et une courte explication à gauche et son contrôle à droite.
Un champ de recherche en tête filtre les réglages à la frappe, sans tenir compte de la casse ni des accents, et mène au réglage et à son contrôle. Un lien `?settings=` suivi d'une page (`appearance`, `behavior`, `models`, `servers`, `tools`, `data`, `config`, `sampling` ou `chunking`) ouvre directement la page voulue, ce qui permet d'envoyer quelqu'un au bon endroit.
Les modèles se modifient dans la page Modèles, avec une ligne par modèle, un interrupteur pour l'activer et un détail. Les champs JSON du formulaire cèdent la place à des sélecteurs pour les pièces jointes image et audio (1.4.2), puis à des interrupteurs et une liste de niveaux d'effort pour la réflexion (1.5.0). Le JSON généré de la page Configuration reprend toutes les clés du fichier, y compris `notice`, `placeholders` et `embedOrigins`, et peut remplacer `config.json` tel quel (1.4.1). Une page Changelog, en bas de la liste, affiche les notes de chaque version avec la version installée ouverte, et un fichier `CHANGELOG.md` à la racine du dépôt les rassemble (1.4.3).

## Personnaliser un déploiement {#deployment}

Quelques clés de `config.json` adaptent l'application à un déploiement sans toucher au code : `notice` affiche une bande d'avis, `placeholders` fait défiler des exemples dans le champ de saisie (1.4.0), et `tools.enabledByDefault` démarre les conversations d'un lecteur qui n'a rien choisi avec les outils activés, sans jamais l'emporter sur son choix dans les réglages (1.6.1).
La clé `suggestions` (1.6.0) liste des invites de démarrage, affichées sous le champ d'une conversation vide : une pastille par catégorie, qui s'ouvre sur ses suggestions et prévisualise l'invite en gris dans le champ. Une suggestion peut porter `"send": false` pour écrire son invite dans le champ au lieu de l'envoyer, ce qui convient à « Traduis ce texte : » (1.6.1), et une entrée sans `items` devient une pastille directe (1.6.3).

## Fonctionnalités {#features}

- **Conversations locales** — index léger, une clé `localStorage` par conversation, écritures debouncées pendant le streaming, jauge d'usage et import/export
- **Recherche** — recherche dans les titres et dans le texte des messages de l'historique local (code exclu, sans tenir compte de la casse ni des accents), avec un extrait autour de la correspondance
- **Branches** — éditer un message ou régénérer une réponse crée une version alternative navigable
- **Citer & répondre** — citer une réponse entière ou une simple sélection de texte dans une réponse pour ancrer la question suivante
- **Raisonnement** — le raisonnement du modèle (`reasoning_content` ou `reasoning`) s'affiche dans un bloc repliable, et le pied de chaque réponse donne ses statistiques (tokens, tok/s, durée) quand le serveur les fournit
- **Maths et diagrammes** — les formules LaTeX sont rendues avec KaTeX (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`, sans toucher à « $5 et $10 ») et les blocs Mermaid deviennent des diagrammes, téléchargeables en SVG
- **Fenêtre de contexte** — sa taille est détectée sur llama.cpp, vLLM et SGLang, avec un délai maximal par sonde pour qu'un serveur muet ne bloque pas l'interface
- **Compactage automatique** — quand la fenêtre de contexte se remplit, les tours les plus anciens sont résumés, une fraction de la fenêtre restant réservée au résumé
- **Export** — JSON HYOAI, JSON de l'interface web de llama.cpp, JSONL au format OpenAI (à rejouer sur un endpoint ou pour un fine-tuning) et Markdown (à archiver), les deux derniers suivant la branche active et laissant le raisonnement de côté
- **Markdown & sources** — tables, coloration syntaxique et liste de sources repliable sous la réponse
- **Pièces jointes** — images (redimensionnées côté client, format vision OpenAI) et audio (mp3, wav) pour les modèles qui les acceptent, PDF (texte extrait dans le navigateur) et fichiers texte, au collage comme au glisser-déposer
- **Réglages d'échantillonnage** — un champ laissé vide n'est pas envoyé et l'endpoint applique son propre défaut ; les noms de paramètres suivent le type d'endpoint (`repetition_penalty` pour vLLM, `repeat_penalty` et `dry_*` pour llama.cpp)
- **Raccourcis clavier** — `Ctrl/Cmd+K` pour la palette, `Ctrl/Cmd+B` pour la barre latérale, `Ctrl/Cmd+Shift+O` pour une nouvelle conversation
- **Apparence et langues** — clair, sombre ou système, six apparences (Soft, Flat, Contraste, Chaud, Forêt, Doux) et une interface bilingue FR/EN
- **Responsive** — sur mobile, les menus s'ouvrent en drawers par le bas (poignée, swipe, safe-area), la palette de commandes devient une feuille qui suit la zone visible, avec un bouton Rechercher dans l'en-tête, et les menus, dialogues et le champ de saisie restent utilisables au clavier via les primitives Radix
- **Animations** — les changements d'état sont adoucis (blocs repliables, appels d'outils, fondu entre deux thèmes), un interrupteur des réglages, ajouté en 1.7.0, les désactive et le réglage de mouvement réduit du système est toujours respecté
- **Saisie directe** — depuis la 1.7.0, quand rien ne prend le texte, taper donne le focus au champ de saisie et le caractère y arrive

## Widget embarquable {#embed}

Au-delà de l'application complète, HYOAI s'embarque dans une page tierce sous forme de widget en iframe. Il écrit très peu : la variante minimale ne conserve rien et la variante avec barre latérale garde seulement l'index et les conversations, sans les réglages. Les outils et les serveurs MCP n'y sont pas disponibles.
Un pont `postMessage` relie la page hôte au widget, à condition que son origine figure dans `embedOrigins` : l'hôte pousse à chaud un prompt système, une langue ou un thème, injecte un tour de conversation, ou lance une commande en mode « headless » dont la réponse lui est renvoyée en streaming. Depuis la 1.6.2, une commande peut porter son propre prompt système, sa température, son nombre maximal de tokens et sa réflexion, un message `abort` l'annule, un paramètre `width` règle la largeur de la colonne, et le message `ready` annonce la version du widget et ses `capabilities`, ce qui permet à l'hôte de tester une fonction avant de l'utiliser. La 1.6.3 lui permet aussi d'envoyer ses propres suggestions de démarrage et son texte d'invite.
Le guide [`docs/embed.md`](https://github.com/zenetys/hyoai/blob/master/docs/embed.md) couvre les paramètres d'URL, l'isolation du stockage, la poignée de main, le dimensionnement et les points de sécurité.

## Intégrations {#integrations}

`config.json` accepte un tableau `integrations` qui branche une action prédéfinie de l'interface sur un endpoint HTTP externe, sans toucher au code : ajouter une instance est une simple édition de configuration, un nouveau genre d'action demande du code.
Le seul genre (`kind`) existant est `feedback` : il ajoute des pouces haut et bas sous les réponses des modèles visés (tous, ou ceux listés dans `models` avec un `model` fixé) et envoie par `POST` JSON (méthode et en-têtes configurables) la question, la réponse, la note, le commentaire et l'état du raisonnement.
Une entrée inconnue ou malformée est ignorée plutôt que de faire échouer toute la configuration.

## Plugins {#plugins}

Le contenu du dossier `plugins/` est ignoré par git, ce qui permet d'y ajouter des types de serveur **au moment du build** : on y dépose un dossier, on relance `npm run dev` ou `npm run build`, et il est pris en compte. Sans plugin, l'application se construit et fonctionne comme avant, ce qui évite de garder dans le noyau ce qui est propre à un seul déploiement : le transport d'un backend privé vit dans un plugin.
Un plugin peut apporter son type de serveur, ses traductions, des fournisseurs d'outils, et signaler ce qu'il fait par des événements génériques d'activité, de sources citées et de durées par étape, rendus de la même façon pour tous. Une entrée dont aucun plugin installé ne gère le type reste dans la configuration et s'affiche grisée dans le sélecteur de modèle, avec l'explication correspondante. Le contrat est documenté dans le dépôt.

## Stack technique {#tech}

Construit avec **Next.js** (App Router, export statique en production), **React 19** et **TypeScript strict**, HYOAI utilise **Tailwind CSS v4** et **shadcn/ui** (primitives Radix via le paquet unifié `radix-ui`).
S'y ajoutent next-themes pour le clair, le sombre et le thème du système, six apparences (skins) commutables par un attribut `data-skin` dédié, next-intl (FR/EN, sans routing), react-markdown avec remark-gfm et rehype-highlight, remark-math et rehype-katex pour les formules, mermaid pour les diagrammes, le SDK MCP officiel, pdfjs-dist pour la lecture des PDF, zod pour valider la configuration, les serveurs MCP et les conversations stockées, lz-string pour la compression des conversations et vitest pour les tests unitaires.
Le projet est publié sous licence **Apache 2.0**.

## Communauté {#community}

Plusieurs apports de la 1.0.2 viennent de pull requests de la communauté, créditées dans la release : les diagrammes Mermaid, les formules KaTeX et la détection de la fenêtre de contexte sur vLLM et SGLang par Tobias, l'envoi optionnel du raisonnement précédent au modèle (`preserve_thinking`) par cptjerry.

## Ressources {#resources}

- **Code source** — [github.com/zenetys/hyoai](https://github.com/zenetys/hyoai), publié en open source par ZENETYS
- **Démo en ligne** — [tools.zenetys.com/hyoai](https://tools.zenetys.com/hyoai/)
- **Guides** — [`docs/`](https://github.com/zenetys/hyoai/tree/master/docs) : modèles, outils, MCP, comparaison, tour de l'interface et [`embed.md`](https://github.com/zenetys/hyoai/blob/master/docs/embed.md) pour embarquer HYOAI dans une page tierce
- **Article** — [HYOAI : un client de chat IA sans backend, dans le navigateur](https://www.zenetys.com/actu/hyoai-un-client-de-chat-ia-sans-backend-dans-le-navigateur/), sur le blog ZENETYS
