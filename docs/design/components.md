---
title: Composants UI
description: Architecture des composants, design system atomique, pattern CVA, primitives accessibles Radix UI, shadcn/ui et gestion des variantes.
category: design
slug: components
order: 7
---

## Qu'est-ce qu'un composant UI ? {#intro}

Un **composant UI** est un bloc de code réutilisable qui encapsule une partie de l'interface : son apparence, son comportement et son accessibilité. Un bouton, une carte, un dialog, un tooltip — chacun est un composant.

L'objectif d'une bonne architecture de composants : **assembler des interfaces complexes à partir de briques simples et cohérentes**, sans recréer les mêmes éléments à chaque page.

## Design atomique {#atomic}

Le **design atomique** (Brad Frost, 2013) est une méthodologie de composants organisés en niveaux de complexité croissants :

```
Atomes       →   éléments HTML de base + styles (Button, Input, Badge, Icon)
Molécules    →   groupes simples d'atomes (SearchBar = Input + Button)
Organismes   →   sections complexes (Header = Nav + SearchBar + Avatar)
Templates    →   layouts sans données réelles
Pages        →   templates avec données réelles
```

En pratique, la plupart des design systems modernes distinguent simplement :

- **Composants atomiques** — boutons, champs, badges, tooltips
- **Composants composés** — dialogs, dropdowns, accordéons
- **Composants de layout** — nav, footer, sidebar
- **Composants de page** — sections hero, features, pricing

## Primitives vs composants complets {#primitives}

### Primitives accessibles

Une **primitive** est un composant sans style, qui fournit uniquement le comportement et l'accessibilité. **Radix UI** est la référence pour les primitives React :

```tsx
import * as Dialog from "@radix-ui/react-dialog";

// Primitive sans style — le comportement et l'ARIA sont gérés
<Dialog.Root>
    <Dialog.Trigger>Ouvrir</Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
            <Dialog.Title>Titre</Dialog.Title>
            <Dialog.Description>Description</Dialog.Description>
            <Dialog.Close>Fermer</Dialog.Close>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>;
```

Radix UI gère automatiquement : focus trap, fermeture avec Échap, `aria-modal`, `aria-labelledby`, gestion du scroll, portal dans `<body>`.

### shadcn/ui — primitives + style

**shadcn/ui** est une collection de composants construits sur Radix UI + Tailwind CSS. Contrairement à une bibliothèque classique, les composants sont **copiés dans ton projet** et tu les modifies librement :

```bash
npx shadcn@latest add button dialog tooltip
```

Les fichiers générés sont dans `src/components/ui/` — tu peux les modifier comme n'importe quel fichier du projet.

Avantages : contrôle total, pas de dépendance à maintenir à jour, accessible par défaut grâce à Radix.

## Le pattern CVA {#cva}

**Class Variance Authority (CVA)** gère les variantes de composants de manière type-safe. Il génère une fonction qui retourne les bonnes classes Tailwind selon les props.

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    // Classes de base — toujours présentes
    "inline-flex items-center justify-center rounded-md font-medium transition-all",
    {
        variants: {
            variant: {
                default:     "bg-primary text-primary-foreground hover:bg-primary/90",
                outline:     "border border-input bg-background hover:bg-accent",
                ghost:       "hover:bg-accent hover:text-accent-foreground",
                destructive: "bg-destructive text-white hover:bg-destructive/90",
            },
            size: {
                sm:   "h-8 px-3 text-xs",
                md:   "h-9 px-4 text-sm",
                lg:   "h-10 px-6 text-base",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

// TypeScript infère automatiquement les types des props
type ButtonProps = VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    className?: string;
};

export function Button({ variant, size, className, children }: ButtonProps) {
    return (
        <button className={buttonVariants({ variant, size, className })}>
            {children}
        </button>
    );
}
```

### La fonction cn()

`cn()` combine `clsx` (conditions logiques) et `tailwind-merge` (résolution des conflits Tailwind) en une seule fonction :

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Usage
cn("px-4 py-2", isActive && "bg-primary", className);
// tailwind-merge résout les conflits : cn("p-2", "p-4") → "p-4"
```

## Composants composés {#compound}

Les **composants composés** exposent plusieurs sous-composants liés par un contexte partagé. C'est le pattern utilisé par shadcn/ui pour Card, Dialog, Command…

```tsx
// Exemple : Card composée
<Card>
    <CardHeader>
        <CardTitle>Mon projet</CardTitle>
        <CardDescription>Une description</CardDescription>
    </CardHeader>
    <CardContent>
        <p>Contenu…</p>
    </CardContent>
    <CardFooter>
        <Button>Action</Button>
    </CardFooter>
</Card>
```

Chaque sous-composant (`CardHeader`, `CardTitle`…) a accès au contexte du parent et peut s'adapter sans que le consommateur ait à passer des props explicites.

## Accordéon sans JavaScript {#collapsible}

Une technique élégante pour animer la hauteur d'un accordéon sans connaître la hauteur exacte du contenu :

```css
/* Conteneur externe */
.collapsible {
    display: grid;
    grid-template-rows: 0fr; /* fermé : hauteur 0 */
    transition: grid-template-rows 0.3s ease;
}
.collapsible.open {
    grid-template-rows: 1fr; /* ouvert : hauteur naturelle */
}

/* Enfant interne — nécessaire pour que overflow fonctionne */
.collapsible-inner {
    overflow: hidden;
}
```

Cette technique exploite le fait que `grid-template-rows: 0fr` coupe la hauteur à 0 même si le contenu est plus grand. Elle est **animable** (contrairement à `height: auto`) et ne nécessite pas de JavaScript pour calculer la hauteur.

## Le pattern asChild {#aschild}

Le pattern **asChild** (via Radix `Slot`) permet de fusionner les props d'un composant avec son enfant, au lieu de créer un élément wrapper supplémentaire :

```tsx
// Sans asChild — crée un <button> + un <a> imbriqués
<Button>
    <a href="/projets">Voir les projets</a>
</Button>

// Avec asChild — les props du Button sont fusionnées avec le <a>
<Button asChild>
    <a href="/projets">Voir les projets</a>
</Button>
```

`asChild` est particulièrement utile pour combiner les styles d'un `Button` avec la sémantique d'un lien `<a>` ou d'un composant de routeur (`Link` de Next.js).

## Skeleton screens {#skeleton}

Les **skeleton screens** remplacent les spinners génériques par la structure visuelle du contenu pendant le chargement. Ils donnent une meilleure perception de la performance.

```tsx
// Pendant le chargement
function ProjectCardSkeleton() {
    return (
        <div className="card p-4 space-y-3">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
        </div>
    );
}

// Données chargées
function ProjectCard({ project }) {
    return (
        <div className="card p-4">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
        </div>
    );
}
```

```css
.skeleton {
    background: linear-gradient(
        90deg,
        var(--muted) 25%,
        var(--muted-foreground/20%) 50%,
        var(--muted) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    from {
        background-position: 200% center;
    }
    to {
        background-position: -200% center;
    }
}
```

## Notifications et toasts {#notifications}

Les **toasts** (notifications éphémères) suivent des règles UX précises :

| Règle           | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| **Durée**       | 4–8 secondes selon l'importance                              |
| **Position**    | Bas-droite (desktop), bas-centré (mobile)                    |
| **Empilage**    | Maximum 3 toasts simultanés                                  |
| **Dismissible** | Toujours un bouton de fermeture                              |
| **Type**        | Success (vert), erreur (rouge), info (bleu), warning (ambre) |

Les toasts doivent être annoncés aux lecteurs d'écran via `aria-live="polite"` (pour les infos) ou `aria-live="assertive"` (pour les erreurs urgentes).

## Pour aller plus loin {#next}

- [Couleurs et espaces colorimétriques](/help/design/colors) — tokens dans les variantes CVA
- [Animations et transitions CSS](/help/design/animations) — entrées/sorties de composants
- [Accessibilité web](/help/design/accessibility) — ARIA, focus management, Radix
- [Interactions utilisateur](/help/design/interactions) — feedback, hover states, patterns