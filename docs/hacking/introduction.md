---
title: Introduction au hacking éthique
description: Cadre légal, types de hackers, méthodologie de pentest, bug bounty et compétitions CTF pour débuter en sécurité offensive.
category: hacking
slug: introduction
order: 1
---

## Avertissement {#disclaimer}

> **Ces documentations sont à des fins éducatives uniquement.** Toujours obtenir une autorisation écrite avant de tester un système. Le hacking non autorisé est un délit pénal. Les techniques présentées ici doivent être pratiquées exclusivement dans un cadre légal : CTF, labs personnels, pentests autorisés ou programmes de bug bounty.

## Qu'est-ce que le hacking éthique ? {#intro}

Le **hacking éthique** (ou sécurité offensive) consiste à utiliser les mêmes techniques que les attaquants malveillants, mais avec **autorisation** et dans le but d'**améliorer la sécurité** d'un système. Un hacker éthique identifie les vulnérabilités avant qu'un attaquant ne les exploite.

On parle aussi de **pentest** (test d'intrusion) : une évaluation méthodique de la sécurité d'un système, d'un réseau ou d'une application.

### Sécurité offensive vs défensive

- **Offensive** (Red Team) — Simuler des attaques pour trouver les failles
- **Défensive** (Blue Team) — Protéger, détecter et répondre aux attaques
- **Purple Team** — Combiner les deux approches pour améliorer la posture de sécurité

## Cadre légal en France {#legal}

En France, l'accès frauduleux à un système informatique est encadré par le **Code pénal** :

| Article     | Infraction                                           | Peine maximale    |
| ----------- | ---------------------------------------------------- | ----------------- |
| **323-1**   | Accès ou maintien frauduleux dans un STAD            | 3 ans + 100 000 € |
| **323-2**   | Entrave au fonctionnement d'un STAD                  | 5 ans + 150 000 € |
| **323-3**   | Introduction, suppression ou modification de données | 5 ans + 150 000 € |
| **323-3-1** | Détention d'outils de piratage sans motif légitime   | 5 ans + 150 000 € |

> **STAD** = Système de Traitement Automatisé de Données (terme juridique français pour désigner un système informatique).

**Ce qui rend un test légal :**

- Une **autorisation écrite** (lettre de mission, contrat de pentest)
- Un **périmètre défini** (quels systèmes, quelles méthodes, quelle période)
- Un **rapport** remis au commanditaire avec les résultats

## Types de hackers {#types}

| Type              | Intention        | Légalité        | Exemple                                         |
| ----------------- | ---------------- | --------------- | ----------------------------------------------- |
| **White Hat**     | Protéger         | Légal           | Pentester, chercheur en sécurité, bug bounty    |
| **Grey Hat**      | Variable         | Zone grise      | Trouve une faille sans autorisation, la signale |
| **Black Hat**     | Nuire / profiter | Illégal         | Vol de données, ransomware, fraude              |
| **Script Kiddie** | Variable         | Souvent illégal | Utilise des outils sans comprendre              |
| **Hacktiviste**   | Idéologique      | Illégal         | Attaques motivées par des convictions           |

## Méthodologie de pentest {#methodology}

Un test d'intrusion professionnel suit une méthodologie structurée en **cinq phases** :

```
┌──────────────────────────────────────────────────────────────────────┐
│                        MÉTHODOLOGIE DE PENTEST                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐        ┌──────────────┐        ┌──────────────┐   │
│   │ 1. Reconnais │  ───>  │ 2. Scanning  │  ───>  │ 3. Exploit.  │   │
│   │    -sance    │        │ Énumération  │        │              │   │
│   └──────────────┘        └──────────────┘        └───────┬──────┘   │
│                                                           │          │
│   ┌──────────────┐        ┌──────────────┐                │          │
│   │ 5. Rapport   │  <───  │ 4. Post-     │  <─────────────┘          │
│   │              │        │ exploitation │                           │
│   └──────────────┘        └──────────────┘                           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 1. Reconnaissance {#phase-recon}

Collecter des informations sur la cible sans interagir directement avec elle (passive) ou en interagissant (active). OSINT, DNS, WHOIS, réseaux sociaux.

### 2. Scanning et énumération {#phase-scan}

Scanner les ports, identifier les services, détecter les versions et les vulnérabilités potentielles. Nmap, Gobuster, Nikto.

### 3. Exploitation {#phase-exploit}

Utiliser les vulnérabilités découvertes pour obtenir un accès. SQL injection, exploitation de services, mots de passe faibles.

### 4. Post-exploitation {#phase-post}

Maintenir l'accès, élever les privilèges, pivoter vers d'autres systèmes, exfiltrer des données de test. Documenter ce qui est accessible.

### 5. Rapport {#phase-report}

Rédiger un rapport détaillé : vulnérabilités trouvées, preuves, impact, recommandations de remédiation. C'est le livrable le plus important.

## Bug bounty {#bugbounty}

Les programmes de **bug bounty** permettent à des chercheurs en sécurité de signaler des vulnérabilités en échange d'une récompense financière. C'est un moyen légal et rémunéré de pratiquer le hacking éthique.

**Plateformes principales :**

| Plateforme    | Particularité                                |
| ------------- | -------------------------------------------- |
| **HackerOne** | Plus grande plateforme, entreprises majeures |
| **Bugcrowd**  | Large catalogue de programmes                |
| **YesWeHack** | Plateforme européenne (française)            |
| **Intigriti** | Plateforme européenne (belge)                |

> **Conseil** : Toujours lire les **règles du programme** (scope, out-of-scope, safe harbor) avant de commencer.

## Compétitions CTF {#ctf}

Les **CTF** (Capture The Flag) sont des compétitions de sécurité informatique. On résout des challenges pour trouver un « flag » (une chaîne de caractères). C'est le meilleur moyen de progresser en pratiquant.

**Plateformes pour s'entraîner :**

| Plateforme      | Type       | Niveau        | Particularité                            |
| --------------- | ---------- | ------------- | ---------------------------------------- |
| **HackTheBox**  | Labs       | Inter./Avancé | Machines virtuelles réalistes            |
| **TryHackMe**   | Guidé      | Débutant      | Parcours pas à pas, idéal pour débuter   |
| **Root-Me**     | Challenges | Tous niveaux  | Plateforme française, large catalogue    |
| **OverTheWire** | Wargames   | Débutant      | Challenges en ligne de commande (Bandit) |
| **VulnHub**     | VMs        | Tous niveaux  | Machines vulnérables à télécharger       |

## Divulgation responsable {#disclosure}

Quand on découvre une vulnérabilité en dehors d'un programme de bug bounty :

1. **Ne pas exploiter** la faille au-delà de la preuve de concept
2. **Contacter le responsable** (security@, page de sécurité, CTO)
3. **Donner un délai raisonnable** (90 jours est le standard) pour corriger
4. **Ne pas divulguer publiquement** avant la correction
5. **Documenter** la vulnérabilité de manière claire et constructive

> **Note** : En France, l'ANSSI peut servir d'intermédiaire pour la divulgation de vulnérabilités (article L.2321-4 du Code de la défense).

## Pour aller plus loin {#next}

- [Reconnaissance](/help/hacking/reconnaissance) — techniques de collecte d'informations passive et active
- [Scanning et énumération](/help/hacking/scanning) — scanner les ports et services avec Nmap
- [Boîte à outils](/help/hacking/tools) — configurer son environnement de hacking