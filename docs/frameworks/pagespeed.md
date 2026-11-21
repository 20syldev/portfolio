---
title: Optimiser son score PageSpeed Insights
description: Lire un rapport PageSpeed Insights et corriger le chemin critique d'un site Next.js statique — polices, JavaScript, image principale, chargement à la demande, accessibilité.
category: frameworks
slug: pagespeed
order: 5
---

## Introduction {#intro}

**PageSpeed Insights** (PSI) mesure une page avec **Lighthouse**, sur un téléphone simulé pour le score mobile et sur un ordinateur pour le score bureau, puis y ajoute, quand le site a assez de visiteurs, les mesures réelles de Chrome. Un score se corrige rarement en allégeant « tout » : il se corrige en trouvant **ce qui bloque l'affichage du plus grand élément**, puis en le retirant du chemin.

Ce guide reprend la démarche suivie sur ce site, un site **Next.js en export statique** hébergé sur GitHub Pages. La performance mobile y est passée d'environ **50-60 à 85-91** et celle de l'ordinateur à **98-100**, sans changer l'allure de la page : les mesures de chaque étape sont données plus bas.

## Ce que mesure PageSpeed {#metrics}

Le score de performance est une moyenne pondérée de cinq mesures de laboratoire :

| Mesure                             | Ce qu'elle dit                                           | Poids |
| ---------------------------------- | -------------------------------------------------------- | ----- |
| **TBT** (Total Blocking Time)      | combien de temps le JavaScript bloque la page            | 30 %  |
| **LCP** (Largest Contentful Paint) | quand le plus grand élément (image ou titre) est affiché | 25 %  |
| **CLS** (Cumulative Layout Shift)  | combien la mise en page saute pendant le chargement      | 25 %  |
| **FCP** (First Contentful Paint)   | quand le premier élément apparaît                        | 10 %  |
| **Speed Index**                    | à quelle vitesse la page se remplit                      | 10 %  |

Sur mobile, Lighthouse simule un **réseau 4G lent** et un **processeur ralenti** : un site rapide sur un ordinateur de bureau peut y paraître lent. C'est le score mobile qui sert de repère, parce que c'est lui qui révèle les défauts du chemin critique.

## Commencer par le chemin critique {#critical}

Le diagnostic de départ n'était pas « trop de JavaScript » au sens large, mais **ce qui se charge avant le LCP** : environ 1,3 Mo de polices et de scripts, répartis ainsi :

- **vingt-trois fichiers de police préchargés**, alors qu'une seule police est affichée au départ
- tout le **contenu Markdown** (pages d'aide, de projets, de veille) embarqué dans le JavaScript de chaque page
- une page **cachée pendant une seconde** derrière une animation d'entrée en `opacity: 0`
- des sections hors écran, des fenêtres et des effets construits dès le chargement

Chacun de ces points est un **levier indépendant** : on en change un seul, on mesure, puis on passe au suivant. Changer plusieurs choses à la fois empêche de savoir ce qui a servi.

## Précharger une seule police {#fonts}

Avec `next/font`, chaque police déclarée est **préchargée par défaut**. Sur un site qui propose un sélecteur de polices, cela fait autant de requêtes avant le premier affichage. On garde le préchargement pour la police par défaut et on le coupe pour les autres :

```ts
import { Inter, Outfit } from "next/font/google";

// Default font: preloaded, it is shown on the first paint
const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

// Other choices: fetched only when the visitor picks them
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    preload: false,
});
```

Les polices `preload: false` restent disponibles : le navigateur les télécharge au moment où le CSS les utilise. Résultat sur ce site : **23 fichiers préchargés remplacés par un seul**.

## Sortir le contenu du JavaScript {#content}

Un import de données dans un composant client **entre dans le bundle de chaque page** qui utilise ce composant. Quand ces données sont du Markdown, le poids devient vite considérable : plus de **300 Ko** de code à télécharger et à analyser au démarrage, pour des pages que le visiteur n'ouvre pas.

La solution est de séparer l'**index** (titres, descriptions, ordre), léger et utile partout, du **contenu**, lu seulement par la page qui l'affiche. Un script de génération écrit les deux, et un module unique lit le contenu :

```ts
import docsContent from "@/data/docs-content.json";

const docsText: Record<string, string> = docsContent;

/**
 * Retrieves the markdown content of a doc by its identifier.
 * Kept apart from the doc index so that only the server pages, which pass one page on, import it.
 */
export function getDocContent(docId: string): string | null {
    return docsText[docId] ?? null;
}
```

Le point important est qui **importe** ce module : une page serveur le lit au moment du build et ne transmet au client que le texte d'**une** page. Dès qu'un composant client l'importe, tout le contenu repart dans le JavaScript.

## Ne pas cacher la page {#entrance}

Une animation d'entrée qui part de `opacity: 0` **retarde le FCP et le LCP** : tant que l'élément est transparent, Lighthouse ne le compte pas comme affiché. Ici, la page restait invisible environ une seconde au premier chargement.

La correction n'a pas supprimé l'animation, elle l'a changée : au premier chargement, la page et l'en-tête **glissent de quelques pixels en 0,4 seconde sans jamais disparaître**. Le fondu, le glissement et le zoom complets sont gardés pour les changements de page, où le contenu est déjà là.

## Charger à la demande {#lazy}

Ce qui ne sert pas au premier affichage ne doit pas être dans le premier chargement. Trois outils couvrent la plupart des cas.

**Les composants lourds, avec `next/dynamic`**, pour une fenêtre, une palette de commandes ou un effet décoratif :

```tsx
import dynamic from "next/dynamic";

const loadContact = () => import("@/components/dialogs/contact").then((m) => m.ContactDialog);

const Contact = dynamic(loadContact, { ssr: false });
```

Pour que la fenêtre ne perde pas son animation de fermeture, on la monte à la **première ouverture** et on la garde ensuite :

```ts
export function useOnce(flag: boolean) {
    const [seen, setSeen] = useState(flag);

    if (flag && !seen) setSeen(true);

    return seen || flag;
}
```

**Les éléments hors écran, avec un `IntersectionObserver`**, pour une carte qui télécharge des images ou fait défiler des badges : elle n'agit que lorsqu'elle est visible **et** que l'onglet du navigateur est au premier plan.

```ts
export function useVisible<T extends Element>(ref: RefObject<T | null>) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let onScreen = false;
        const sync = () => setVisible(onScreen && !document.hidden);

        const observer = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
        });
        observer.observe(el);
        document.addEventListener("visibilitychange", sync);

        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
        };
    }, [ref]);

    return visible;
}
```

**Les panneaux qui n'apparaissent qu'après une action.** L'onglet « Projets » de l'accueil n'est construit qu'à la **première interaction**, ou tout de suite si l'on arrive directement dessus : l'accueil contient environ **un tiers d'éléments en moins** à afficher.

Pour ne pas faire attendre le premier clic, on peut **préparer** un composant dès le survol ou le ciblage de son bouton, avec la même fonction d'import (`loadContact()` dans l'exemple ci-dessus).

## Prioriser l'image principale {#lcp}

Quand le LCP est une image, Lighthouse vérifie que le navigateur la **découvre tôt** et la demande avec une **priorité haute**. Sans indication, elle passe après les scripts. Un attribut suffit :

```tsx
<img src="/avatar.webp" alt="Portrait" fetchPriority="high" />
```

Sur ce site, le portrait de l'accueil est le plus grand élément affiché au chargement. Deux changements l'ont servi : `fetchPriority="high"`, qui valide l'audit de découverte de la requête, et un fichier **WebP de 8 Ko** à la place d'un ancien favicon de **47 Ko** utilisé comme image. Les icônes SVG les plus lourdes ont aussi été allégées, sans différence visible.

Le gain de score de `fetchPriority` seul a été nul : la mesure mobile est passée de 85 à 84. L'audit est validé, mais ce n'est pas lui qui fait le score.

## Accessibilité {#a11y}

Le score d'accessibilité se corrige en même temps, et en grande partie par des gestes simples. Sur ce site, il est passé de **83 à 100** sur mobile et de **78 à 100** sur ordinateur, avec quatre familles de corrections :

- un **nom lu par les lecteurs d'écran** pour chaque bouton ou lien représenté par une seule icône (recherche, thème, menu, réseaux sociaux), avec `aria-label`
- un **ordre des titres** respecté, sans saut de niveau
- un **contraste suffisant** pour les éléments inactifs, comme les onglets de la barre de navigation en thème clair
- des **cibles assez grandes et espacées** pour les points de navigation, faciles à viser au doigt

Il y a aussi un point que Lighthouse relève sur une page d'accueil : déclarer la **zone de contenu principale** (`<main>`) de chaque page et de chaque onglet, pour que les lecteurs d'écran et la navigation au clavier puissent y sauter directement.

## Mesurer sans se tromper {#measure}

- **Comparer des octets, pas des durées.** Les temps varient quand la machine fait autre chose en même temps. Le poids du JavaScript compressé, le transfert total, le nombre de requêtes et le nombre d'éléments du DOM sont stables d'une mesure à l'autre.
- **Un levier à la fois**, mesuré seul avec Lighthouse, avant d'enchaîner.
- **Lighthouse local et PSI ne donnent pas toujours le même score** : PSI exécute une version plus récente de Lighthouse, avec parfois des audits en plus. Le résultat décisif est celui de PSI sur la page publiée.
- **Mesurer la page déployée**, pas le serveur de développement.

## Les résultats {#results}

Mesures locales avant et après les deux premières séries de changements (polices, contenu, onglet construit à la demande, SVG allégés) :

| Mesure               | Avant     | Après       |
| -------------------- | --------- | ----------- |
| JavaScript compressé | 657 Kio   | 318 Kio     |
| Transfert total      | 1 750 Kio | 627 Kio     |
| Requêtes             | 112       | 74          |
| Éléments du DOM      | 1 537     | environ 990 |

Le chargement à la demande des fenêtres, de la palette de commandes, du logo animé et de l'effet Matrix a ensuite fait passer le JavaScript de démarrage de **319 à 298 Kio** et le transfert de **590 à 569 Kio**.

Scores PageSpeed Insights relevés au fil des versions :

| Étape                                | Mobile (performance) | Ordinateur (performance) |
| ------------------------------------ | -------------------- | ------------------------ |
| Avant les changements                | 50 à 60              | environ 80               |
| Polices, contenu, entrée plus rapide | 85                   | 100                      |
| Priorité haute du portrait           | 84                   | 100                      |
| Version suivante, 5.5.0              | 91                   | 98                       |

Aux versions 5.3, le LCP mobile est resté autour de **3,8 secondes** sur le réseau simulé et le TBT à **70 ms**.

## Ce qui n'a pas marché {#failed}

- **`experimental.inlineCss`** de Next.js, pour supprimer le CSS qui bloque l'affichage : le HTML de l'accueil est passé de 124 Ko à 679 Ko, avec le CSS écrit deux fois. Abandonné.
- **Exclure les fichiers Markdown et publics de l'analyse de Tailwind** (`@source not`) : seulement 0,5 Ko gagné une fois compressé.
- **Faire de l'accueil un composant serveur** : chaque section de l'accueil est un îlot client (glisser, carrousels, grilles qui dépendent de la fenêtre, appels d'API), donc seul le balisage englobant changerait de côté.

## Ce qui reste hors de portée {#remaining}

PSI signale encore quelques points qu'un hébergement statique comme GitHub Pages ne permet pas de régler :

- la **durée de cache** : GitHub Pages envoie `max-age=600`, et fixer une durée longue demande un CDN devant le site
- le **JavaScript hérité** (une quinzaine de Kio), qui vient des polyfills de Next.js et ne se retire pas depuis le code du site
- le **CSS qui bloque l'affichage**, environ 150 ms, que l'inlining automatique aggrave au lieu de corriger (voir plus haut)

## Résumé {#summary}

| Levier                                  | Effet mesuré                                                       |
| --------------------------------------- | ------------------------------------------------------------------ |
| Précharger une seule police             | 23 fichiers préchargés remplacés par 1                             |
| Contenu hors du JavaScript              | plus de 300 Ko en moins au démarrage                               |
| Entrée sans `opacity: 0`                | la page n'est plus invisible pendant une seconde                   |
| Chargement à la demande                 | 319 → 298 Kio de JavaScript de démarrage, un tiers du DOM en moins |
| Image principale prioritaire et allégée | audit de découverte validé, favicon de 47 Ko → WebP de 8 Ko        |
| Accessibilité                           | 83 → 100 (mobile), 78 → 100 (ordinateur)                           |
