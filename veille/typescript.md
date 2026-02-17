---
id: typescript
title: TypeScript
description: JavaScript avec typage statique pour des applications plus robustes
keywords:
    - TypeScript
    - JavaScript
    - Typage
    - Microsoft
    - Frontend
url: "https://www.typescriptlang.org"
order: 2
---

## À propos de TypeScript {#about}

TypeScript est un sur-ensemble typé de JavaScript qui compile vers du JavaScript standard. Développé et maintenu par Microsoft depuis 2012, TypeScript ajoute des types statiques optionnels au langage JavaScript, permettant de détecter les erreurs dès la compilation plutôt qu'à l'exécution.

### Avantages principaux

- **Typage statique:** Détection des erreurs à la compilation
- **IntelliSense amélioré:** Autocomplétion et documentation inline dans l'éditeur
- **Refactoring sûr:** Renommer et restructurer le code avec confiance
- **Interopérabilité:** Compatible avec tout le code JavaScript existant
- **Écosystème riche:** Support natif dans la plupart des frameworks modernes

### Nouveautés récentes

TypeScript évolue rapidement avec des versions majeures tous les 3 mois. Les dernières versions apportent des améliorations significatives en termes de performances et de nouvelles fonctionnalités de typage.

## Cas d'usage {#usecases}

### Applications d'entreprise

TypeScript est particulièrement adapté pour les applications d'entreprise de grande envergure, où la maintenabilité et la robustesse du code sont essentielles.

### Frameworks modernes

Tous les frameworks JavaScript modernes offrent un support de première classe pour TypeScript : React, Vue, Angular, Next.js, Nest.js, etc.

### Librairies NPM

De plus en plus de packages NPM sont écrits directement en TypeScript ou fournissent des définitions de types via DefinitelyTyped.

## Comparaison {#comparison}

### TypeScript vs alternatives

**Flow:** Système de typage statique développé par Facebook. Flow offre des fonctionnalités similaires à TypeScript avec une syntaxe proche, mais son adoption est beaucoup plus limitée et l'écosystème moins développé. TypeScript bénéficie d'un support communautaire et corporate bien plus important.

**PropTypes:** Solution de validation de types à l'exécution (runtime) pour React. Contrairement à TypeScript qui vérifie les types à la compilation, PropTypes détecte les erreurs uniquement pendant l'exécution. TypeScript offre une détection précoce des erreurs et un meilleur support IDE.

**JSDoc:** Annotations de types dans des commentaires JavaScript. JSDoc permet d'ajouter des informations de types sans transpilation, mais n'offre pas de vérification stricte à la compilation comme TypeScript. L'IDE support est limité comparé à TypeScript natif.

**ReScript:** Langage fortement typé qui compile vers JavaScript avec un système de types très robuste. ReScript offre une sécurité de types supérieure mais implique une courbe d'apprentissage plus raide et une syntaxe différente de JavaScript, contrairement à TypeScript qui reste un sur-ensemble de JavaScript.

**JavaScript pur:** JavaScript sans typage reste une option valide pour des projets de petite taille ou des prototypes rapides, mais TypeScript devient indispensable pour des bases de code volumineuses nécessitant maintenabilité et collaboration.

## Écosystème {#ecosystem}

### L'écosystème TypeScript en 2025

#### Utilitaires de types

- **type-fest:** Collection complète de types utilitaires avancés pour TypeScript, incluant plus de 100 types helpers pour des opérations complexes sur les types.
- **utility-types:** Bibliothèque de types utilitaires populaire couvrant les besoins courants de manipulation de types.
- **ts-toolbelt:** Suite d'outils de types avancés pour des transformations de types complexes et du type-level programming.
- **ts-reset:** Améliore les types natifs de TypeScript avec des définitions plus strictes et précises pour les APIs standard.

#### Linters et formatage

- **@typescript-eslint:** Plugin ESLint officiel pour TypeScript permettant l'analyse statique du code avec des règles spécifiques au typage.
- **ts-standard:** Configuration ESLint prête à l'emploi suivant les standards TypeScript, sans configuration nécessaire.
- **Prettier:** Formatteur de code supportant nativement TypeScript, garantissant un style cohérent dans toute la codebase.

#### Outils de build et compilation

- **tsc (TypeScript Compiler):** Compilateur officiel TypeScript, référence pour la transpilation vers JavaScript.
- **esbuild:** Bundler ultra-rapide écrit en Go avec support natif TypeScript, jusqu'à 100x plus rapide que les alternatives traditionnelles.
- **swc (Speedy Web Compiler):** Compilateur écrit en Rust offrant des performances exceptionnelles, utilisé par Next.js et d'autres frameworks modernes.
- **Rollup:** Bundler pour librairies avec excellent support TypeScript via plugin @rollup/plugin-typescript.
- **Vite:** Build tool nouvelle génération utilisant esbuild en développement et Rollup en production, support TypeScript natif.

#### Gestion des définitions de types

- **DefinitelyTyped:** Repository GitHub centralisant plus de 9000 définitions de types pour packages JavaScript populaires.
- **Packages @types:** Packages NPM contenant les définitions de types pour librairies JavaScript tierces, installables via npm/yarn.
- **dts-gen:** Générateur automatique de fichiers de définitions de types à partir de code JavaScript existant.

## Exemples {#examples}

### Exemples pratiques avec TypeScript

#### Interfaces et annotations de base

```typescript
// Interface pour définir la structure d'un utilisateur
interface User {
    id: number;
    name: string;
    email: string;
    age?: number; // Propriété optionnelle
}

// Fonction avec paramètres typés et valeur de retour typée
function createUser(name: string, email: string): User {
    return {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
    };
}

const user: User = createUser("Alice", "alice@example.com");
```

#### Génériques avec contraintes

```typescript
// Fonction générique avec contrainte de type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

interface Product {
    name: string;
    price: number;
    stock: number;
}

const product: Product = { name: "Laptop", price: 999, stock: 5 };
const productName = getProperty(product, "name"); // Type: string
const productPrice = getProperty(product, "price"); // Type: number
```

#### Types mappés et conditionnels

```typescript
// Type mappé pour rendre toutes les propriétés readonly
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// Type conditionnel pour extraire le type de retour d'une fonction
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Utilisation avec types utilitaires intégrés
type UserUpdate = Partial<User>; // Toutes propriétés optionnelles
type UserKeys = keyof User; // "id" | "name" | "email" | "age"
type UserWithoutId = Omit<User, "id">; // User sans la propriété id
```

#### Type guards et narrowing

```typescript
// Type guard personnalisé
function isString(value: unknown): value is string {
    return typeof value === "string";
}

// Utilisation de type guards natifs
function processValue(value: string | number | null) {
    if (value === null) {
        return "Valeur nulle";
    }

    if (typeof value === "string") {
        return value.toUpperCase(); // TypeScript sait que c'est un string
    }

    return value.toFixed(2); // TypeScript sait que c'est un number
}

// instanceof pour les classes
class Dog {
    bark() {
        console.log("Woof!");
    }
}

class Cat {
    meow() {
        console.log("Meow!");
    }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}
```

#### Types utilitaires avancés

```typescript
// Pick: Sélectionner certaines propriétés
type UserPreview = Pick<User, "name" | "email">;

// Record: Créer un type objet avec clés et valeurs typées
type UserRoles = Record<string, "admin" | "user" | "guest">;
const roles: UserRoles = {
    user1: "admin",
    user2: "user",
};

// Exclude et Extract: Manipulation d'unions
type Status = "pending" | "approved" | "rejected" | "cancelled";
type ActiveStatus = Exclude<Status, "cancelled">; // "pending" | "approved" | "rejected"
type FinalStatus = Extract<Status, "approved" | "rejected">; // "approved" | "rejected"

// NonNullable: Retirer null et undefined
type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>; // User
```

## Avantages {#advantages}

### Pourquoi utiliser TypeScript ?

- **Détection précoce des erreurs:** TypeScript identifie les erreurs de types, les typos, et les problèmes de logique à la compilation, bien avant l'exécution en production. Cela réduit significativement le nombre de bugs et améliore la qualité du code.

- **Support IDE exceptionnel:** IntelliSense, autocomplétion intelligente, navigation dans le code, refactoring automatisé et documentation inline transforment l'expérience de développement. Les IDE modernes (VS Code, WebStorm) exploitent pleinement les informations de types.

- **Code auto-documenté:** Les annotations de types servent de documentation vivante et toujours à jour. Les signatures de fonctions, interfaces et types communiquent clairement les contrats d'API sans documentation externe.

- **Refactoring sûr et confiant:** Renommer des variables, déplacer du code, changer des signatures de fonctions devient sûr grâce à la vérification de types. L'IDE peut identifier tous les usages et garantir la cohérence.

- **Maintenabilité accrue:** Pour les grandes bases de code et les équipes importantes, TypeScript facilite la compréhension du code existant, réduit la dette technique et améliore la collaboration entre développeurs.

- **Interopérabilité JavaScript:** TypeScript est un sur-ensemble strict de JavaScript. Tout code JavaScript valide est du TypeScript valide, permettant une adoption progressive et l'utilisation de l'écosystème NPM existant.

- **Écosystème mature:** Soutenu par Microsoft et adopté massivement par la communauté, TypeScript bénéficie d'un écosystème riche avec des milliers de définitions de types disponibles, un outillage excellent et une communauté active.

## Tendances {#trends}

### Tendances et évolutions de TypeScript

#### Adoption universelle comme standard de facto

TypeScript est devenu le choix par défaut pour les nouveaux projets JavaScript en 2025. Les grandes entreprises (Google, Microsoft, Airbnb, Shopify) ont migré massivement vers TypeScript. Le State of JS 2024 confirme que plus de 85% des développeurs utilisent ou souhaitent utiliser TypeScript, consolidant sa position de standard industriel.

#### Inférence de types de plus en plus intelligente

Les versions récentes de TypeScript (5.x et 6.x) ont considérablement amélioré l'inférence de types, réduisant le besoin d'annotations explicites. Les types sont déduits automatiquement dans de nombreux contextes, rendant le code plus concis tout en conservant la sécurité de types. Le control flow analysis s'est également amélioré pour des narrowing plus précis.

#### Intégration native avec les outils modernes

Les outils de build nouvelle génération (Vite, Turbopack, esbuild, swc) offrent un support TypeScript natif et optimisé. La compilation TypeScript est devenue quasi-instantanée grâce à ces outils écrits en langages compilés (Rust, Go). Cette performance élimine les frictions historiques du développement TypeScript.

#### TypeScript-first pour frameworks et librairies

Les frameworks modernes sont conçus dès le départ avec TypeScript : Next.js 15, Astro, SvelteKit, Solid.js et Qwik privilégient TypeScript dans leur documentation et leurs APIs. Les librairies populaires migrent vers TypeScript ou fournissent des types de première qualité, rendant l'expérience développeur exceptionnelle.

## Conclusion {#conclusion}

### TypeScript : l'avenir du développement JavaScript

TypeScript s'est imposé comme le standard incontournable pour le développement JavaScript moderne. En combinant la flexibilité de JavaScript avec la robustesse du typage statique, TypeScript répond aux besoins des développeurs et des entreprises pour créer des applications fiables et maintenables à grande échelle.

L'avenir de TypeScript s'annonce prometteur avec des améliorations continues de l'inférence de types, une meilleure intégration avec les runtimes modernes, et une adoption toujours croissante dans l'écosystème JavaScript. Pour tout projet de taille significative ou nécessitant une collaboration d'équipe, TypeScript représente un investissement rentable qui améliore la qualité du code, la productivité et la confiance des développeurs.

## Ressources {#resources}

### Pour apprendre

- [Documentation officielle TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Blog TypeScript](https://devblogs.microsoft.com/typescript/)
- [TypeScript Exercises](https://typescript-exercises.github.io/)
- [Total TypeScript](https://www.totaltypescript.com/)

## Sources {#sources}

### Références bibliographiques

#### Documentation officielle

- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)
- [TypeScript Blog - Microsoft](https://devblogs.microsoft.com/typescript/)
- [TypeScript GitHub Repository](https://github.com/microsoft/TypeScript)

#### Alternatives et comparaisons

- [Flow - Static Type Checker](https://flow.org/)
- [Flow vs TypeScript Comparison](https://github.com/niieani/typescript-vs-flowtype)
- [JSDoc Type Annotations](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [ReScript Language](https://rescript-lang.org/)
- [PropTypes Documentation - React](https://legacy.reactjs.org/docs/typechecking-with-proptypes.html)

#### Outils de l'écosystème

- [type-fest - Utility Types Collection](https://github.com/sindresorhus/type-fest)
- [utility-types Library](https://github.com/piotrwitek/utility-types)
- [ts-toolbelt - Advanced Type Utils](https://github.com/millsp/ts-toolbelt)
- [@typescript-eslint](https://typescript-eslint.io/)
- [DefinitelyTyped Repository](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [esbuild - Fast Bundler](https://esbuild.github.io/)
- [swc - Speedy Web Compiler](https://swc.rs/)
- [Vite - Next Generation Frontend Tooling](https://vitejs.dev/)

#### Tendances et adoption

- [State of JS Survey - TypeScript](https://stateofjs.com/)
- [GitHub Octoverse - TypeScript Rankings](https://octoverse.github.com/)
- [TypeScript Roadmap](https://github.com/microsoft/TypeScript/wiki/Roadmap)
- [TypeScript Performance Improvements](https://devblogs.microsoft.com/typescript/category/performance/)
- [Stack Overflow Developer Survey](https://survey.stackoverflow.co/)