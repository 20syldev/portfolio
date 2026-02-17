---
id: radix
title: Radix UI
description: Composants UI accessibles et non stylisés pour React
keywords:
    - Radix UI
    - React
    - UI
    - Composants
    - Accessibilité
url: "https://www.radix-ui.com"
order: 3
---

## À propos de Radix UI {#about}

Radix UI est une bibliothèque de composants React bas niveau, non stylisés et accessibles. Développée par l'équipe derrière Modulz et Stitches, Radix UI fournit les fondations pour construire des systèmes de design de haute qualité.

### Philosophie

- **Accessibilité d'abord:** Tous les composants respectent les standards WAI-ARIA
- **Non stylisé:** Apportez votre propre CSS, Tailwind, CSS-in-JS, etc.
- **Ouvert et modulaire:** Chaque composant est un package npm indépendant
- **Developer experience:** API intuitive et documentation complète

### Composants populaires

- **Dialog / Modal:** Boîtes de dialogue accessibles
- **Dropdown Menu:** Menus déroulants avec keyboard navigation
- **Tooltip:** Info-bulles accessibles
- **Select:** Sélecteurs personnalisables
- **Accordion:** Panneaux extensibles
- **Tabs:** Navigation par onglets

## Pourquoi Radix UI ? {#why}

### Alternative aux UI kits

Contrairement aux bibliothèques comme Material-UI ou Ant Design qui imposent un style, Radix UI vous donne le contrôle total sur l'apparence tout en gérant la logique complexe et l'accessibilité.

### Utilisé par

Radix UI est utilisé par de nombreux projets open source populaires comme shadcn/ui, qui est lui-même basé sur Radix UI et Tailwind CSS.

### Intégration avec Tailwind

Radix UI s'intègre parfaitement avec Tailwind CSS, permettant de créer rapidement des interfaces modernes et accessibles.

## Comparaison {#comparison}

### Radix UI vs alternatives headless/accessibles

**Headless UI:** Bibliothèque de composants unstyled développée par Tailwind Labs. Headless UI partage la philosophie de Radix UI avec une approche similaire. Headless UI offre moins de composants que Radix (environ 10 vs 30+), mais une intégration native avec Tailwind CSS. Radix UI propose une API plus granulaire et modulaire, avec chaque composant publié comme package npm indépendant.

**Reach UI:** Bibliothèque pionnière de composants accessibles React par Ryan Florence. Reach UI est plus opinionnaire que Radix UI avec des styles par défaut et moins de flexibilité de customisation. Reach UI a inspiré Radix UI mais est maintenant moins activement maintenu. Radix UI offre une API plus moderne et un écosystème plus riche.

**React Aria:** Collection de hooks d'accessibilité par Adobe offrant un contrôle très fin sur le comportement des composants. React Aria est plus bas niveau que Radix UI, nécessitant plus de code pour assembler un composant complet. Excellent pour des cas d'usage très spécifiques, mais Radix UI offre une meilleure DX pour la majorité des projets avec des composants prêts à l'emploi.

**Ariakit:** Toolkit accessible React similaire à Radix UI avec excellent support WAI-ARIA. Ariakit offre une API légèrement différente avec une approche plus hook-based. Les deux librairies sont excellentes ; le choix dépend des préférences d'API. Radix UI a un écosystème plus large avec shadcn/ui et d'autres solutions construites dessus.

**Chakra UI headless:** Chakra UI propose maintenant une version headless séparant logique et styles. Cependant, Chakra reste plus opinionnaire que Radix UI même en version headless, avec une architecture de theming intégrée. Radix UI offre une liberté totale sans système de thème imposé.

## Écosystème {#ecosystem}

### L'écosystème Radix UI en 2025

#### Solutions de styling

- **Tailwind CSS:** L'intégration la plus populaire avec Radix UI. Tailwind utility classes permettent un styling rapide et responsive. La combinaison Radix + Tailwind est devenue un standard dans l'écosystème React.
- **Stitches:** CSS-in-JS library développée par l'équipe Radix, offrant variants, responsive styles, et theming avec excellent DX et performance.
- **CSS Modules:** Approche classique fonctionnant parfaitement avec Radix UI pour des styles scopés sans runtime overhead.
- **Vanilla Extract:** Zero-runtime CSS-in-TypeScript avec excellent type safety, intégration élégante avec Radix UI.
- **Styled Components / Emotion:** CSS-in-JS traditionnel compatible avec Radix UI, bien que moins utilisé aujourd'hui au profit de solutions zero-runtime.

#### Collections de composants préfabriquées

- **shadcn/ui:** Collection de composants copy-paste basés sur Radix UI + Tailwind CSS. Devenue extrêmement populaire (100k+ stars GitHub), shadcn/ui offre des composants magnifiquement designés et accessibles prêts à l'emploi. Pas une librairie npm mais des composants à copier dans votre projet pour customisation complète.
- **Park UI:** Design system moderne basé sur Radix UI avec variants et theming intégré, alternative à shadcn/ui avec approche plus structurée.
- **Radix Themes:** Solution officielle Radix fournissant des composants stylisés built on top de Radix Primitives, pour démarrage rapide sans configuration.

#### Form libraries et validation

- **React Hook Form:** Librairie de formulaires performante avec excellente intégration Radix UI pour les composants personnalisés (Select, RadioGroup, Checkbox).
- **Formik:** Alternative mature à React Hook Form, fonctionne bien avec Radix UI bien que plus verbose.
- **Zod:** Schema validation TypeScript-first, parfait combo avec React Hook Form et Radix UI pour formulaires type-safe et validés.
- **Yup:** Alternative validation schema populaire, compatible avec l'écosystème Radix UI.

#### Animation et transitions

- **Framer Motion:** Librairie d'animation puissante avec excellente intégration Radix UI pour animer Dialog, Tooltip, Dropdown etc.
- **React Spring:** Alternative à Framer Motion avec approche physics-based, compatible avec Radix UI.
- **Auto Animate:** Animations automatiques minimalistes pour listes et layouts, fonctionne seamlessly avec Radix UI.

## Exemples {#examples}

### Exemples pratiques avec Radix UI

#### Dialog accessible avec Tailwind CSS

```tsx
import * as Dialog from "@radix-ui/react-dialog";

function MyDialog() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Ouvrir Dialog
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <Dialog.Title className="text-xl font-bold mb-4">Titre du Dialog</Dialog.Title>
                    <Dialog.Description className="text-gray-600 mb-4">
                        Description du contenu du dialog pour l'accessibilité.
                    </Dialog.Description>

                    <div className="mt-4">
                        <p>Contenu du dialog...</p>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <Dialog.Close asChild>
                            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                                Annuler
                            </button>
                        </Dialog.Close>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Confirmer
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
```

#### Dropdown Menu avec navigation clavier

```tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon, DotFilledIcon } from "@radix-ui/react-icons";

function MyDropdownMenu() {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="p-2 rounded hover:bg-gray-100">
                    <HamburgerMenuIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[220px] bg-white rounded shadow-lg p-1">
                    <DropdownMenu.Item className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer">
                        Nouveau fichier
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer">
                        Ouvrir...
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer">
                            Partager →
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.SubContent className="min-w-[220px] bg-white rounded shadow-lg p-1">
                                <DropdownMenu.Item className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer">
                                    Email
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer">
                                    Copier le lien
                                </DropdownMenu.Item>
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    <DropdownMenu.CheckboxItem
                        className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer flex items-center"
                        checked={true}
                    >
                        <DropdownMenu.ItemIndicator className="mr-2">
                            <DotFilledIcon />
                        </DropdownMenu.ItemIndicator>
                        Mode sombre
                    </DropdownMenu.CheckboxItem>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
```

#### Accordion avec état contrôlé

```tsx
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

function MyAccordion() {
    const [openItems, setOpenItems] = useState<string[]>(["item-1"]);

    return (
        <Accordion.Root
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
            className="w-full max-w-md"
        >
            <Accordion.Item value="item-1" className="border-b">
                <Accordion.Header>
                    <Accordion.Trigger className="w-full flex justify-between items-center py-4 hover:underline">
                        <span>Section 1</span>
                        <ChevronDownIcon className="transition-transform" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-4 text-gray-600">
                    Contenu de la première section avec des informations détaillées.
                </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-2" className="border-b">
                <Accordion.Header>
                    <Accordion.Trigger className="w-full flex justify-between items-center py-4 hover:underline">
                        <span>Section 2</span>
                        <ChevronDownIcon className="transition-transform" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-4 text-gray-600">
                    Contenu de la deuxième section.
                </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-3" className="border-b">
                <Accordion.Header>
                    <Accordion.Trigger className="w-full flex justify-between items-center py-4 hover:underline">
                        <span>Section 3</span>
                        <ChevronDownIcon className="transition-transform" />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-4 text-gray-600">
                    Contenu de la troisième section.
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    );
}
```

#### Tooltip avec positionnement personnalisé

```tsx
import * as Tooltip from "@radix-ui/react-tooltip";

function MyTooltip() {
    return (
        <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                        Survolez-moi
                    </button>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content
                        className="bg-gray-900 text-white px-3 py-2 rounded text-sm shadow-lg max-w-xs"
                        sideOffset={5}
                        side="top"
                    >
                        Ceci est un tooltip accessible avec positionnement automatique et support
                        complet du clavier.
                        <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
```

#### Formulaire avec Select et validation

```tsx
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    country: z.string().min(1, "Veuillez sélectionner un pays"),
    name: z.string().min(2, "Nom requis"),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log("Form submitted:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
            <div>
                <label className="block mb-1 font-medium">Nom</label>
                <input
                    {...register("name")}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Votre nom"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Pays</label>
                <Select.Root onValueChange={(value) => setValue("country", value)}>
                    <Select.Trigger className="w-full px-3 py-2 border rounded flex justify-between items-center">
                        <Select.Value placeholder="Sélectionner un pays" />
                        <Select.Icon>
                            <ChevronDownIcon />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className="bg-white rounded shadow-lg border">
                            <Select.Viewport className="p-1">
                                <Select.Item
                                    value="fr"
                                    className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer flex items-center"
                                >
                                    <Select.ItemText>France</Select.ItemText>
                                    <Select.ItemIndicator className="ml-auto">
                                        <CheckIcon />
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item
                                    value="us"
                                    className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer flex items-center"
                                >
                                    <Select.ItemText>États-Unis</Select.ItemText>
                                    <Select.ItemIndicator className="ml-auto">
                                        <CheckIcon />
                                    </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item
                                    value="uk"
                                    className="px-3 py-2 outline-none hover:bg-gray-100 rounded cursor-pointer flex items-center"
                                >
                                    <Select.ItemText>Royaume-Uni</Select.ItemText>
                                    <Select.ItemIndicator className="ml-auto">
                                        <CheckIcon />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            </Select.Viewport>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
                {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Soumettre
            </button>
        </form>
    );
}
```

## Avantages {#advantages}

### Pourquoi choisir Radix UI ?

- **Accessibilité WAI-ARIA intégrée:** Tous les composants Radix UI respectent les standards WAI-ARIA avec navigation clavier complète, gestion du focus, rôles ARIA appropriés, et support des screen readers. Vous obtenez l'accessibilité gratuitement sans expertise spécialisée.

- **Liberté de design totale:** Radix UI est complètement unstyled, vous donnant 100% de contrôle sur l'apparence. Utilisez Tailwind, CSS Modules, CSS-in-JS, ou n'importe quelle solution de styling sans limitations. Pas de classes CSS à override ou de styles imposés.

- **API composable et intuitive:** Les composants Radix utilisent une API déclarative avec sous-composants (Dialog.Trigger, Dialog.Content) permettant une composition flexible. L'API est consistante entre composants, facilitant l'apprentissage.

- **Gestion avancée du clavier:** Navigation clavier sophistiquée built-in : Tab, Escape, Arrow keys, Home/End, etc. Les composants gèrent intelligemment le focus trapping, focus restoration, et keyboard shortcuts selon les best practices.

- **Bundle size optimisé:** Chaque composant est un package npm indépendant avec tree-shaking parfait. N'importez que ce dont vous avez besoin. Les composants sont légers sans dépendances lourdes, contrairement aux UI kits monolithiques.

- **TypeScript first-class support:** Types TypeScript complets et précis pour tous les composants. Excellent IntelliSense et type safety, détection des erreurs à la compilation, et refactoring sûr.

- **Écosystème riche:** shadcn/ui, Park UI, et d'autres solutions construites sur Radix UI. Intégration parfaite avec React Hook Form, Framer Motion, et l'écosystème React moderne. Documentation exhaustive avec exemples interactifs.

## Tendances {#trends}

### Tendances et évolutions de Radix UI

#### Pattern headless UI mainstream

Le pattern headless UI popularisé par Radix UI est devenu mainstream en 2025. Les développeurs privilégient désormais les librairies headless offrant la logique sans styles imposés, plutôt que les UI kits traditionnels. Cette tendance reflète le besoin de design systems uniques et performants, tout en maintenant l'accessibilité.

#### shadcn/ui moteur d'adoption

shadcn/ui a explosé en popularité (100k+ GitHub stars) et est devenu le moteur principal d'adoption de Radix UI. L'approche copy-paste de shadcn/ui permet aux développeurs d'avoir des composants magnifiques et accessibles tout en gardant le contrôle total. Cette approche "composants as code" plutôt que "composants as dependency" transforme l'écosystème.

#### Fondation de design systems entreprise

Les entreprises adoptent Radix UI comme fondation de leurs design systems custom. Radix gère la complexité de l'accessibilité et de l'interaction, permettant aux équipes design de se concentrer sur l'identité visuelle. Des entreprises majeures construisent leurs design systems sur Radix UI.

#### Intégration React Server Components

Radix UI évolue pour supporter les React Server Components de Next.js App Router. Les composants interactifs (Dialog, Dropdown) fonctionnent comme Client Components tandis que les wrappers peuvent être Server Components. Cette compatibilité assure la pertinence de Radix UI dans l'architecture React moderne.

## Conclusion {#conclusion}

### Radix UI : primitives accessibles pour design systems modernes

Radix UI s'est imposé comme la solution de référence pour construire des composants UI accessibles avec design personnalisé. En fournissant des primitives robustes, accessibles et unstyled, Radix UI permet aux équipes de créer des interfaces uniques sans sacrifier l'accessibilité ou réinventer la roue.

L'avenir de Radix UI est prometteur avec l'évolution continue des composants, l'adaptation aux nouvelles patterns React (Server Components), et l'expansion de l'écosystème. Pour les équipes cherchant à construire un design system custom avec accessibilité intégrée, Radix UI représente le choix optimal en 2025.

## Ressources {#resources}

### Pour démarrer

- [Documentation officielle Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Radix UI Themes](https://www.radix-ui.com/themes/docs/overview/getting-started)
- [shadcn/ui](https://ui.shadcn.com/) - Composants basés sur Radix UI
- [GitHub Radix UI](https://github.com/radix-ui/primitives)
- [Radix UI Icons](https://www.radix-ui.com/icons)

## Sources {#sources}

### Références bibliographiques

#### Documentation officielle

- [Radix UI Primitives Documentation](https://www.radix-ui.com/primitives)
- [Radix UI Themes](https://www.radix-ui.com/themes)
- [Radix UI GitHub](https://github.com/radix-ui/primitives)
- [Radix UI Colors](https://www.radix-ui.com/colors)
- [Radix UI Icons Library](https://www.radix-ui.com/icons)
- [Stitches CSS-in-JS](https://stitches.dev/)

#### Alternatives headless/accessibles

- [Headless UI by Tailwind Labs](https://headlessui.com/)
- [Reach UI](https://reach.tech/)
- [React Aria by Adobe](https://react-spectrum.adobe.com/react-aria/)
- [Ariakit Toolkit](https://ariakit.org/)
- [Chakra UI - Headless](https://chakra-ui.com/)
- [Accessibility Guidelines - WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/)

#### Écosystème et collections

- [shadcn/ui Component Collection](https://ui.shadcn.com/)
- [Park UI Design System](https://park-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stitches CSS-in-JS](https://stitches.dev/)
- [Vanilla Extract](https://vanilla-extract.style/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)

#### Ressources accessibilité

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)