---
name: ccleanup
description: "Nettoyage interactif des sessions de Claude Code : les plus lourdes et les plus anciennes d'abord."
longDescription: "Outil en ligne de commande, publié sur npm, qui liste les sessions de Claude Code par taille, montre de quoi elles parlaient, laisse marquer celles à supprimer et peut envoyer un rappel. Interface plein écran écrite à la main en TypeScript, sans aucune dépendance, avec une protection des sessions ouvertes et récentes, une suppression qui ne suit jamais un lien et une interface en français et en anglais."
tags: ["Node.js", "TypeScript", "Claude Code", "TUI"]
github: "https://github.com/20syldev/ccleanup"
npm: "https://www.npmjs.com/package/ccleanup"
---

## À propos {#about}

ccleanup nettoie les sessions de [Claude Code](https://claude.com/claude-code). Claude Code garde chaque conversation sous forme de transcription dans `~/.claude/projects`, et quelques longues sessions pèsent vite plusieurs gigaoctets.
L'outil les liste par taille, montre de quoi chacune parlait, laisse marquer celles à supprimer et peut envoyer un rappel pour revenir faire le ménage.
Il se lance sans installation avec `npx ccleanup`, il est publié sur [npm](https://www.npmjs.com/package/ccleanup) et le code est sur [github.com/20syldev/ccleanup](https://github.com/20syldev/ccleanup).

![La visite complète : le scan remplit la liste, trois sessions sont marquées, une recherche, le détail d'une session, puis la boîte de confirmation](/images/projects/ccleanup/hero)

## Pourquoi ce projet ? {#why}

Claude Code supprime de lui-même, sans message, les sessions de plus de 30 jours. On peut repousser cette limite avec `cleanupPeriodDays` dans `~/.claude/settings.json`, mais les sessions s'accumulent alors jusqu'à ce qu'on les retire à la main.
ccleanup comble ce vide : au lieu de tout laisser partir après 30 jours, on choisit ce qui s'en va, en commençant par le plus gros et le plus ancien.
Il ne modifie jamais ce fichier de réglages.

## Utilisation {#usage}

L'outil se lance avec ce qu'on a déjà sous la main : `npx ccleanup`, `bunx ccleanup@latest` ou `pnpm dlx ccleanup`. Rien n'est supprimé sans demander :

```bash
npx ccleanup                      # liste interactive
npx ccleanup --older-than 14d     # idem, avec les sessions de plus de 14 jours déjà marquées
npx ccleanup --list               # affiche la liste et quitte
npx ccleanup --older-than 30d --min-size 100M --dry-run    # aperçu d'un nettoyage en masse
```

Sans l'interface, `--yes` supprime aussitôt les sessions visées, sans confirmation. Il exige `--older-than` ou `--min-size`, et `--dry-run` montre d'abord ce qui serait supprimé.
Quand la sortie n'est pas un terminal, l'outil affiche la liste au lieu d'ouvrir l'interface.

## L'interface {#ui}

La liste s'ouvre aussitôt et grandit au fil de la mesure des sessions.
L'en-tête affiche les totaux, ce qui est marqué, ce qui pourrait être libéré et ce qui l'a été, et les suppressions tournent en arrière-plan avec un état par ligne, si bien que la liste reste utilisable.

![L'analyse en cours : la liste se remplit au fil des mesures, avec une luciole sur la ligne d'analyse et des braises sous les lignes](/images/projects/ccleanup/scan.svg)

- **Marquer** — `espace` marque ou démarque la session puis avance dans le sens du dernier déplacement, `a` marque tout, `o` marque les sessions plus anciennes que `--older-than` (14 jours par défaut)
- **Trier** — `s` fait tourner le tri entre taille, âge et projet, `S` inverse l'ordre
- **Chercher** — `/` filtre par projet, titre, dossier ou identifiant, `entrée` garde le filtre et `échap` l'efface
- **Détails** — `i` montre de quoi la session est faite et comment la reprendre, et `c` quitte pour lancer `claude --resume` sur elle
- **Supprimer** — `entrée` ouvre une boîte de confirmation qui liste les sessions marquées et l'espace libéré ; `e` affiche les erreurs de suppression
- **Se déplacer** — flèches ou `j` et `k`, `PgUp` et `PgDn`, `g` et `G` ; la souris fonctionne avec `CCLEANUP_MOUSE=1` (clic pour sélectionner, second clic pour marquer, clic droit pour les détails)
- **Aide** — `?` affiche l'aide et la légende, `q` ou `échap` quitte ; `Ctrl+C` deux fois quitte aussi, `Ctrl+Z` suspend

![La boîte de confirmation : elle liste les sessions marquées et l'espace qu'elles libèrent](/images/projects/ccleanup/confirm.svg)

![Une recherche puis le détail d'une session : ce qui la compose et comment la reprendre](/images/projects/ccleanup/details.svg)

Les captures sont dessinées à partir de la vraie interface, sur des sessions inventées.

Les couleurs suivent le terminal : vraies couleurs, 256 ou 16 couleurs, ou aucune. Le fond est demandé au terminal (OSC 11, puis `COLORFGBG`) et un fond clair reçoit une palette plus sombre.
`CCLEANUP_ASCII=1` dessine l'interface avec des caractères ASCII seulement, `NO_COLOR` et `FORCE_COLOR` coupent ou forcent les couleurs, et `CCLEANUP_LANG=fr|en` choisit la langue, le français par défaut sur un système en français.

## Ce qui est supprimé, et ce qui ne l'est pas {#safety}

Une session est une transcription `<uuid>.jsonl` dans `~/.claude/projects/<projet>/`, plus ce que Claude Code range à côté : le dossier `<uuid>/` (résultats d'outils, sous-agents, workflows), `file-history/<uuid>`, `session-env/<uuid>` et `debug/<uuid>.txt`.
Son dossier temporaire part aussi : Claude Code y garde le bloc-notes et les images collées de la session, que `claude purge` laisse derrière lui. Tout est supprimé ensemble et les tailles sont additionnées.

- **Seules les sessions sont touchées** — seules les entrées nommées d'après un UUID de session sont listées ou supprimées, et le reste est laissé tel quel : le dossier `memory/` d'un projet, `history.jsonl`, les réglages, les skills et les plugins
- **Chemins vérifiés** — chaque chemin doit se trouver dans le dossier de configuration, ou dans son propre dossier `claude-<uid>` du répertoire temporaire, sans passer par un lien, et porter le nom de la session avant qu'on y touche
- **Sessions ouvertes protégées** — une session ouverte dans un Claude Code en cours est marquée `open` et jamais supprimée, même avec `--include-recent` : l'outil lit le fichier que Claude Code tient pour chaque instance (`sessions/<pid>.json`), vérifie que le processus tourne, cherche sous Linux les identifiants passés aux commandes en cours (`--resume <id>`), et revérifie juste avant de supprimer
- **Sessions récentes protégées** — celles modifiées depuis moins de 30 minutes sont marquées `recent`, car l'une d'elles peut tourner sans fichier, et elles ne sont supprimables qu'avec `--include-recent`
- **Plusieurs dossiers de configuration** — sans `--claude-dir`, tous ceux qui existent sont listés ensemble (`$CLAUDE_CONFIG_DIR`, `~/.claude` et `~/.config/claude`), chacun une seule fois même à travers un lien ; un dossier illisible est signalé avec son chemin plutôt que traité comme vide

Une session supprimée ne peut plus être reprise avec `claude --resume`. Windows n'est pas encore pris en charge.

## Rappel {#reminder}

```bash
npm i -g ccleanup
ccleanup --install-reminder --every weekly --older-than 14d --notify-above 1G
```

Cette commande écrit une unité de service et un minuteur dans `~/.config/systemd/user` et active le minuteur. Chaque semaine, l'outil examine les sessions et envoie une notification de bureau, seulement quand plus de 1 Go peut être libéré.
`--dry-run` affiche les unités sans rien écrire, `--uninstall-reminder` les retire et `--check` lance à la main ce que le rappel exécute, sans rien supprimer. La notification passe par `notify-send`, et `CCLEANUP_NOTIFY` permet d'utiliser une autre commande.

## Avis de mise à jour {#update}

À la fermeture de l'interface, une ligne signale qu'une version plus récente existe. C'est le seul appel réseau de l'outil : il interroge le registre npm au plus toutes les 12 heures, garde la réponse dans `$XDG_CACHE_HOME/ccleanup/update.json`.
La requête ne transporte rien sur l'utilisateur ni sur ses sessions, ne retarde ni le démarrage ni la sortie et est abandonnée si elle n'est pas finie à temps. Rien n'est demandé avec `--list`, `--check`, `--yes` ou `--dry-run`, sous `npx` ou en CI, ni quand `NO_UPDATE_NOTIFIER` est défini.

## Stack technique {#tech}

L'outil est écrit en **TypeScript** strict pour **Node.js** 22.12 ou plus, sans aucune dépendance à l'exécution : l'interface plein écran, les couleurs, la souris et la détection du fond du terminal sont écrites à la main, et la langue se lit dans `src/i18n`.
Les tests tournent avec le lanceur intégré de Node (`node --test`), le projet est contrôlé par ESLint et Prettier, et les captures de l'interface sont régénérées depuis la vraie vue, avec une vérification qu'elles sont à jour.
L'intégration continue passe `npm run check` et les tests à chaque poussée, et chaque release GitHub publie le paquet sur npm avec une attestation de provenance, après avoir vérifié que le tag correspond à la version du `package.json`.
Le projet est publié sous licence **BSD-3-Clause**.
