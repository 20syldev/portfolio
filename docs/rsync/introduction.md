---
title: Introduction à rsync
description: Présentation de rsync, algorithme delta, fonctionnalités clés et syntaxe générale — avec un premier exemple commenté.
category: rsync
slug: introduction
order: 1
---

## Qu'est-ce que rsync ? {#intro}

Le guide complet de **rsync**, l'outil de référence pour la synchronisation rapide et incrémentale de fichiers sous Linux, macOS et Windows (WSL).

### Fonctionnalités clés

- **Algorithme Delta** — Ne transfère que les différences entre source et destination, économisant bande passante et temps de transfert.
- **Polyvalent** — Fonctionne en local, via SSH, ou en mode daemon. Idéal pour les sauvegardes, déploiements et migrations.
- **Préservation** — Conserve permissions, timestamps, liens symboliques, propriétaires et groupes grâce au mode archive (`-a`).
- **Reprise de transfert** — Reprend les transferts interrompus sans tout recommencer grâce à l'option `--partial`.

### Pourquoi rsync ?

Rsync est l'outil standard de synchronisation de fichiers sous Unix/Linux depuis plus de 25 ans. Il surpasse `cp` et `scp` dans de nombreux scénarios :

- **Économie de bande passante** — L'algorithme delta ne transfère que les blocs modifiés, pas les fichiers entiers.
- **Reprise automatique** — Un transfert interrompu reprend où il s'est arrêté avec `--partial` ou `-P`.
- **Transport sécurisé** — SSH est le transport par défaut, aucune configuration supplémentaire nécessaire.
- **Dry-run** — Testez vos commandes sans risque avec `-n` avant de les exécuter.
- **Sauvegardes incrémentales** — Créez des snapshots quotidiens avec `--link-dest` sans dupliquer l'espace disque.
- **Filtrage puissant** — Excluez ou incluez des fichiers par pattern avec `--exclude` et `--include`.

## Syntaxe générale {#syntax}

```bash
rsync [OPTIONS] SOURCE... DESTINATION
```

La source et la destination peuvent être des chemins locaux ou distants (`user@host:chemin`). Consultez les sections suivantes pour des exemples détaillés.

## Votre première commande rsync {#example}

Voici un exemple complet avec ce que rsync affiche réellement dans le terminal :

```bash
rsync -avh ~/Documents/ /media/disque-externe/Documents/
```

```
sending incremental file list
rapport-Q4.pdf
factures/
factures/2026-01.pdf
factures/2026-02.pdf
photos/
photos/anniversaire.jpg

sent 47,23M bytes  received 1,12K bytes  9,45M bytes/sec
total size is 47,23M  speedup is 1,00
```

- `sending incremental file list` — rsync liste les fichiers à transférer en temps réel ("incremental" signifie qu'il construit la liste pendant le transfert, pas avant).
- Les lignes de fichiers — chaque élément transféré est affiché. Les dossiers se terminent par `/`.
- `speedup is 1,00` — lors d'une première copie, tous les fichiers sont transférés. Lors des synchros suivantes, ce chiffre sera bien supérieur à 1 (ex: 45 signifie que rsync n'a transféré que 1/45e de la taille totale).

> **Bonne pratique** : Ajoutez `-n` pour simuler sans rien modifier : `rsync -avhn ~/Documents/ /media/disque-externe/Documents/`

## Pour aller plus loin {#next}

- [Installation](/help/rsync/installation) — installer rsync sur votre OS
- [Utilisation basique](/help/rsync/basics) — options essentielles et exemples pratiques
- [Options avancées](/help/rsync/advanced) — filtres, compression, snapshots incrémentaux