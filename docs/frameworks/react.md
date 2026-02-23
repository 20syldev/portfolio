---
title: React Markdown
description: Transformer du Markdown en composants React avec react-markdown — composants custom, plugins, syntaxe highlighting et intégration Next.js.
category: frameworks
slug: react
order: 3
---

## Introduction {#intro}

**React Markdown** est une bibliothèque qui transforme du Markdown en composants React. Elle est idéale quand le contenu Markdown fait partie d'une application React ou Next.js existante — portfolio, blog intégré, section d'aide, fiches projet.

### Installation

```bash
npm install react-markdown remark-gfm
```

| Package          | Rôle                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| `react-markdown` | Convertit le Markdown en éléments React                                         |
| `remark-gfm`     | Ajoute le support [GFM](/help/markdown/github) (tables, listes de tâches, etc.) |

## Utilisation de base {#usage}

```tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MonContenu({ content }: { content: string }) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
```

C'est tout. Le Markdown est automatiquement converti en HTML sémantique : `##` devient `<h2>`, `**texte**` devient `<strong>`, etc.

## Composants personnalisés {#components}

La vraie puissance de React Markdown réside dans le **remplacement des éléments HTML** par vos propres composants React. Chaque élément Markdown peut être remplacé :

```tsx
import type { Components } from "react-markdown";

const components: Components = {
    h2: ({ children }) => (
        <h2 className="text-2xl font-semibold mt-10 mb-4 border-t pt-6">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-lg font-semibold mt-6 mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-muted-foreground leading-7 mb-4">{children}</p>,
    ul: ({ children }) => (
        <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-inside space-y-1 mb-4 text-muted-foreground">
            {children}
        </ol>
    ),
    table: ({ children }) => (
        <div className="overflow-x-auto rounded-lg border mb-6">
            <table className="w-full text-sm">{children}</table>
        </div>
    ),
    th: ({ children }) => <th className="px-4 py-2 text-left font-medium bg-muted">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2 border-t">{children}</td>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
            {children}
        </blockquote>
    ),
    hr: () => <hr className="my-8 border-border" />,
    a: ({ children, href }) => (
        <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-primary underline hover:text-primary/80"
        >
            {children}
        </a>
    ),
    img: ({ src, alt }) => (
        <figure className="my-6">
            <img src={src} alt={alt} className="rounded-lg border w-full" />
            {alt && (
                <figcaption className="text-center text-xs mt-2 text-muted-foreground">
                    {alt}
                </figcaption>
            )}
        </figure>
    ),
    code: ({ children, className }) => {
        const isInline = !className;
        if (isInline) {
            return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
            );
        }
        return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => (
        <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono">
            {children}
        </pre>
    ),
};

<ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
    {content}
</ReactMarkdown>;
```

## Types TypeScript {#typescript}

React Markdown exporte ses types pour typer correctement les composants :

```tsx
import type { Components, ExtraProps } from "react-markdown";
import type { ReactNode } from "react";

// Type complet pour un composant de heading
type HeadingProps = React.ComponentPropsWithoutRef<"h2"> & ExtraProps;

const components: Components = {
    h2: ({ children, node, ...props }: HeadingProps) => <h2 {...props}>{children}</h2>,
    // Le type code expose `inline` pour différencier code inline et bloc
    code: ({ children, className, node, ...props }) => {
        const isBlock = Boolean(className);
        return isBlock ? (
            <code className={className} {...props}>
                {children}
            </code>
        ) : (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
            </code>
        );
    },
};
```

## Headings avec ID personnalisé {#headings}

Pour générer une table des matières avec des ancres, utilisez une syntaxe custom dans le Markdown :

```md
## Ma section {#ma-section}
```

Et un parser dans le composant qui extrait l'ID :

```tsx
import type { ReactNode } from "react";

function parseHeadingId(children: ReactNode): { id: string | null; text: ReactNode } {
    if (typeof children === "string") {
        const match = children.match(/^(.+?)\s*\{#([a-z0-9-]+)\}\s*$/i);
        if (match) {
            return { id: match[2], text: match[1].trim() };
        }
    }
    return { id: null, text: children };
}

// Utilisation dans le composant h2
h2: ({ children }) => {
    const { id, text } = parseHeadingId(children);
    return <h2 id={id ?? undefined}>{text}</h2>;
},
```

Cela permet ensuite de naviguer vers `#ma-section` dans l'URL et de générer automatiquement une sidebar de navigation.

## Syntax highlighting {#highlighting}

Pour coloriser les blocs de code, utilisez `rehype-highlight` :

```bash
npm install rehype-highlight highlight.js
```

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // ou un autre thème

export function MonContenu({ content }: { content: string }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {content}
        </ReactMarkdown>
    );
}
```

Le bloc de code Markdown doit préciser le langage :

````md
```tsx
const hello = "world";
```
````

`rehype-highlight` détecte la classe CSS générée par react-markdown (`language-tsx`) et applique la coloration syntaxique.

## Formules mathématiques {#math}

Pour afficher des formules LaTeX, utilisez `remark-math` + `rehype-katex` :

```bash
npm install remark-math rehype-katex katex
```

```tsx
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function MonContenu({ content }: { content: string }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {content}
        </ReactMarkdown>
    );
}
```

Dans le Markdown :

```md
Inline : $E = mc^2$

Bloc :

$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

## Écosystème remark/rehype {#plugins}

React Markdown repose sur un pipeline de plugins :

| Plugin             | Type   | Rôle                                        |
| ------------------ | ------ | ------------------------------------------- |
| `remark-gfm`       | Remark | Tables, listes de tâches, autolinks, barré  |
| `remark-math`      | Remark | Support des formules mathématiques LaTeX    |
| `remark-breaks`    | Remark | Transforme les retours à la ligne en `<br>` |
| `rehype-highlight` | Rehype | Coloration syntaxique des blocs de code     |
| `rehype-katex`     | Rehype | Rendu des formules mathématiques            |
| `rehype-slug`      | Rehype | Ajoute des IDs automatiques aux headings    |
| `rehype-raw`       | Rehype | Permet le HTML brut dans le Markdown        |

Les plugins **remark** transforment le Markdown (AST Markdown), les plugins **rehype** transforment le HTML généré (AST HTML).

## Intégration Next.js {#nextjs}

### Composant client

React Markdown est un composant interactif — il doit tourner dans le navigateur. Ajoutez `"use client"` :

```tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function HelpDoc({ content }: { content: string }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
        </ReactMarkdown>
    );
}
```

### Chargement depuis JSON (SSG)

Dans un projet Next.js avec export statique, le Markdown est compilé en JSON au build et injecté côté serveur :

```tsx
// app/help/[category]/[...slug]/page.tsx (Server Component)
import { getDoc } from "@/data/docs";
import { HelpDoc } from "@/components/detail/content";

export default function Page({ params }: { params: { slug: string[] } }) {
    const doc = getDoc(params.slug.join("/"));
    return <HelpDoc content={doc.content} />;
}
```

Le contenu Markdown est une simple `string` passée en prop — aucune lecture de fichier côté client.

## Avantages et limites {#advantages}

### Avantages

- **Intégration native** : Fonctionne directement dans une app React/Next.js sans build séparé
- **Composants custom** : Chaque élément peut être remplacé par un composant React stylisé
- **Plugins extensibles** : Large écosystème de plugins remark/rehype
- **Typage complet** : Types TypeScript inclus dans le package
- **Léger** : Juste une lib, pas de framework supplémentaire

### Limites

- **Pas de navigation intégrée** : La sidebar et les ancres sont à implémenter manuellement
- **Pas de recherche** : La recherche full-text est à ajouter (ex : Fuse.js, Algolia)
- **Rendu côté client** : Le composant doit être `"use client"` en Next.js App Router
- **Pas de conteneurs** : Pas d'équivalent aux `:::info` de VitePress sans plugin custom