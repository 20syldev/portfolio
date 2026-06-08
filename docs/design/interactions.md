---
title: Interactions utilisateur
description: Microinteractions, feedback, raccourcis clavier, drag-to-scroll, curseur personnalisé, command palette et easter eggs dans les interfaces web.
category: design
slug: interactions
order: 8
---

## Qu'est-ce qu'une interaction ? {#intro}

Une **interaction** est tout ce qui se passe entre l'utilisateur et l'interface : un clic, un survol, un raccourci clavier, un swipe, un drag. La qualité des interactions détermine si une interface se sent **vivante et réactive** ou **lourde et froide**.

Les **microinteractions** sont les petites interactions qui jalonnent l'usage : l'animation d'un bouton au clic, le changement de couleur d'un champ en erreur, la notification qui confirme une action. Elles communiquent l'état du système et donnent du feedback à l'utilisateur.

## Anatomie d'une microinteraction {#microinteractions}

Dan Saffer (auteur de _Microinteractions_, O'Reilly) définit quatre composants :

```
Déclencheur → Règles → Feedback → Boucles et modes
```

| Composant            | Description                             | Exemple                                    |
| -------------------- | --------------------------------------- | ------------------------------------------ |
| **Déclencheur**      | Ce qui initie l'interaction             | Clic sur "Copier"                          |
| **Règles**           | Ce qui se passe en réponse              | L'email est copié dans le presse-papier    |
| **Feedback**         | Comment l'utilisateur le sait           | L'icône passe de Copier à Check pendant 2s |
| **Boucles et modes** | Comportements répétés ou états spéciaux | Après 3 tentatives, bouton désactivé       |

## Feedback visuel {#feedback}

### États interactifs

Chaque élément interactif doit avoir des états visuels distincts :

```css
/* Bouton — 5 états */
.button {
    background: var(--primary);
} /* par défaut */
.button:hover {
    background: var(--primary/90%);
} /* survol */
.button:active {
    transform: scale(0.97);
} /* clic */
.button:focus-visible {
    outline: 3px solid var(--ring);
} /* focus clavier */
.button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
} /* désactivé */
```

### Hover effects

Un survol bien conçu prépare l'utilisateur à l'action qui va suivre :

```css
/* Élévation — indique que l'élément est cliquable */
.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

/* Lueur — indique un état spécial (nouveau, actif) */
.card[data-status="new"]:hover {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}
```

### Confirmation d'action

Pour les actions réversibles (copier, ajouter au panier), montrer une confirmation visuelle temporaire :

```tsx
const [copied, setCopied] = useState(false);

function handleCopy() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
}

// Dans le render
{
    copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />;
}
```

## Navigation clavier {#keyboard}

Une interface bien conçue est navigable entièrement au clavier. Les raccourcis clavier améliorent la productivité des utilisateurs avancés.

### Raccourcis courants

| Raccourci               | Action courante                                   |
| ----------------------- | ------------------------------------------------- |
| **Ctrl+K** / **Cmd+K**  | Ouvrir une palette de commandes                   |
| **Échap**               | Fermer un dialog / annuler                        |
| **Entrée**              | Confirmer / sélectionner                          |
| **Tab** / **Shift+Tab** | Navigation entre éléments focusables              |
| **Espace**              | Activer un bouton / cocher une case               |
| **Flèches**             | Navigation dans une liste, un slider, des onglets |
| **?**                   | Afficher l'aide ou les raccourcis disponibles     |

### Implémentation en React

```typescript
useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
        // Ctrl+K / Cmd+K — ignorer si dans un champ de saisie
        if ((event.ctrlKey || event.metaKey) && event.key === "k") {
            event.preventDefault();
            openCommandPalette();
        }

        // Échap — fermer le dialog actif
        if (event.key === "Escape") {
            closeActiveDialog();
        }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

> **Note** : Toujours utiliser `event.preventDefault()` pour les raccourcis qui redéfinissent des actions navigateur natives (Ctrl+S, Ctrl+F…). Sans ça, l'action navigateur se déclenchera en plus de la tienne.

## Palette de commandes {#palette}

La **palette de commandes** (popularisée par VS Code et Linear) est un outil de navigation universelle accessible via Ctrl+K. Elle permet de rechercher et d'exécuter n'importe quelle action sans quitter le clavier.

```
┌─────────────────────────────────────────────┐
│  Rechercher…                                │
├─────────────────────────────────────────────┤
│  Navigation                                 │
│    Accueil                            ↵     │
│    Projets                            ↵     │
│  Paramètres                                 │
│    Thème sombre                    Alt+T    │
│    Animations                      Alt+M    │
└─────────────────────────────────────────────┘
```

La bibliothèque **cmdk** (React) facilite l'implémentation d'une palette accessible avec recherche floue et navigation clavier intégrées.

### Recherche insensible aux accents

Pour une meilleure expérience en français, normaliser les accents avant la comparaison :

```typescript
function normalizeStr(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
        .toLowerCase();
}

// "securite" trouve "Sécurité", "cryptographie" trouve "Cryptographie"
const matches = items.filter((item) => normalizeStr(item.label).includes(normalizeStr(query)));
```

## Curseur personnalisé {#cursor}

Un curseur personnalisé peut renforcer l'identité visuelle d'un site, mais il faut l'implémenter correctement :

```css
/* Masquer le curseur natif */
.custom-cursor-active {
    cursor: none !important;
}
.custom-cursor-active *,
.custom-cursor-active *::before,
.custom-cursor-active *::after {
    cursor: none !important;
}
```

```typescript
// Deux éléments : un point précis + un cercle suiveur avec délai
const dot = { x: 0, y: 0 };
const circle = { x: 0, y: 0 };

function animate() {
    // Interpolation linéaire (lerp) — 15% de la distance par frame
    circle.x += (dot.x - circle.x) * 0.15;
    circle.y += (dot.y - circle.y) * 0.15;

    // Mettre à jour les positions CSS
    dotEl.style.transform = `translate(${dot.x}px, ${dot.y}px)`;
    circleEl.style.transform = `translate(${circle.x}px, ${circle.y}px)`;

    requestAnimationFrame(animate);
}
```

> **En pratique** : Toujours proposer un moyen de désactiver le curseur personnalisé (raccourci clavier ou paramètre). Sur les appareils tactiles, désactiver automatiquement en détectant `ontouchstart`.

## Drag-to-scroll {#drag}

Le **drag-to-scroll** transforme un conteneur scrollable en carousel draggable à la souris, souvent plus intuitif que les flèches de navigation.

```typescript
function useDragScroll(ref: React.RefObject<HTMLElement>) {
    const state = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        function onMouseDown(e: MouseEvent) {
            state.current = {
                isDragging: true,
                startX: e.pageX - el.offsetLeft,
                scrollLeft: el.scrollLeft,
            };
            el.style.cursor = "grabbing";
        }

        function onMouseMove(e: MouseEvent) {
            if (!state.current.isDragging) return;
            const x = e.pageX - el.offsetLeft;
            const walk = (x - state.current.startX) * 1.5; // multiplicateur de vitesse
            el.scrollLeft = state.current.scrollLeft - walk;
        }

        function onMouseUp() {
            state.current.isDragging = false;
            el.style.cursor = "grab";
        }

        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            el.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);
}
```

### Touch et direction locking

Sur mobile, il faut détecter la direction du premier mouvement pour éviter de bloquer le scroll vertical :

```typescript
let lockAxis: "x" | "y" | null = null;

function onTouchMove(e: TouchEvent) {
    const dx = Math.abs(e.touches[0].clientX - startX);
    const dy = Math.abs(e.touches[0].clientY - startY);

    if (!lockAxis) {
        lockAxis = dx > dy ? "x" : "y";
    }

    if (lockAxis === "x") {
        e.preventDefault(); // scroll horizontal du carousel
        el.scrollLeft = startScrollLeft - (e.touches[0].clientX - startX);
    }
    // lockAxis === "y" → laisser le scroll de page se produire
}
```

## Easter eggs {#easter}

Les **easter eggs** sont des interactions cachées qui récompensent la curiosité des utilisateurs. Ils créent un lien émotionnel avec le produit et deviennent souvent des sujets de conversation.

| Type                    | Exemple                                         | Déclencheur                  |
| ----------------------- | ----------------------------------------------- | ---------------------------- |
| **Séquence de touches** | Konami Code (↑↑↓↓←→←→BA)                        | Lecteurs de jeux vidéo       |
| **Clic répété**         | Tap 7 fois rapidement sur un logo               | Utilisateurs mobiles curieux |
| **Drag extrême**        | Glisser un élément jusqu'au bord → effet visuel | Utilisateurs qui explorent   |
| **Texte caché**         | Taper un mot dans une recherche                 | Utilisateurs qui testent     |
| **Secouer l'appareil**  | Déclencher un effet via l'accéléromètre         | Utilisateurs mobiles         |

### Konami Code en JavaScript

```typescript
const KONAMI = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

let sequence: string[] = [];

window.addEventListener("keydown", (e) => {
    sequence = [...sequence, e.key].slice(-KONAMI.length);
    if (sequence.join(",") === KONAMI.join(",")) {
        triggerEasterEgg();
    }
});
```

> **Note** : Les easter eggs doivent rester des surprises délicates — jamais intrusifs, toujours optionnels, facilement ignorables. Ils ne doivent pas interférer avec l'utilisation normale du site.

## Particules et effets visuels {#particles}

Les particules (confettis, sparkles, feux d'artifice) renforcent le feedback sur des actions importantes (succès, accomplissement).

```css
/* Particule étoile en CSS clip-path */
.sparkle {
    background: oklch(0.6 0.2 280);
    clip-path: polygon(50% 0%, 60% 35%, 100% 50%, 60% 65%, 50% 100%, 40% 65%, 0% 50%, 40% 35%);
    animation: sparkle-out 0.8s ease-out forwards;
    pointer-events: none;
    position: absolute;
    height: 10px;
    width: 10px;
}

@keyframes sparkle-out {
    0% {
        transform: scale(0) rotate(0deg) translate(0, 0);
        opacity: 0;
    }
    20% {
        transform: scale(1.2) rotate(45deg);
        opacity: 1;
    }
    100% {
        transform: scale(0) rotate(90deg) translate(var(--dx), var(--dy));
        opacity: 0;
    }
}
```

Les positions et directions aléatoires sont passées via des **CSS custom properties** `--dx` et `--dy` générées en JavaScript.

## Pour aller plus loin {#next}

- [Composants UI](/help/design/components) — hover states, feedback dans les composants
- [Animations et transitions CSS](/help/design/animations) — microinteractions, timing
- [Accessibilité web](/help/design/accessibility) — clavier, focus, ARIA
- [Layout et responsive design](/help/design/layout) — scroll, drag, carousel