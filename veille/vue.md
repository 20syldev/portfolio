---
id: vue
title: Vue.js
description: Framework JavaScript progressif pour créer des interfaces utilisateur
keywords:
    - Vue.js
    - JavaScript
    - Framework
    - Frontend
    - SPA
url: "https://vuejs.org"
order: 5
---

## À propos de Vue.js {#about}

Vue.js est un framework JavaScript progressif pour construire des interfaces utilisateur. Créé par Evan You en 2014, Vue a gagné en popularité grâce à sa simplicité, sa flexibilité et sa courbe d'apprentissage douce. Il peut être utilisé aussi bien pour ajouter de l'interactivité à une page existante que pour créer des Single Page Applications (SPA) complètes.

### Philosophie

- **Progressif:** Adoptable de manière incrémentale
- **Approchable:** Documentation claire et courbe d'apprentissage douce
- **Versatile:** Écosystème riche pour tous types de projets
- **Performant:** Virtual DOM optimisé et bundle size minimal

### Vue 3

La version 3 de Vue a apporté de nombreuses améliorations :

- **Composition API:** Alternative plus flexible à l'Options API
- **Performances améliorées:** Virtual DOM reécrit, meilleur tree-shaking
- **TypeScript:** Support natif amélioré
- **Teleport, Suspense, Fragments:** Nouvelles fonctionnalités puissantes

## Comparaison {#comparison}

### Vue vs alternatives

**React:** Framework le plus populaire avec l'écosystème le plus vaste. React utilise JSX et une approche "just JavaScript", tandis que Vue privilégie les templates HTML-like plus familiers pour les développeurs web. React nécessite des librairies tierces pour le routing et state management, alors que Vue propose des solutions officielles (Vue Router, Pinia). Courbe d'apprentissage généralement plus raide pour React, mais Vue rattrape React en popularité dans certaines régions comme l'Asie.

**Angular:** Framework complet et opinionnaire développé par Google. Angular est plus verbeux et complexe que Vue, avec une courbe d'apprentissage significativement plus raide. Angular impose TypeScript et une architecture spécifique (modules, decorators, dependency injection), tandis que Vue reste flexible et progressif. Vue est environ 3x plus léger qu'Angular en bundle size. Angular convient mieux aux grandes applications d'entreprise avec équipes importantes.

**Svelte:** Framework moderne qui compile les composants en JavaScript vanilla hautement optimisé plutôt que d'utiliser un Virtual DOM. Svelte produit des bundles plus légers et offre des performances exceptionnelles. La syntaxe Svelte est très concise et élégante, similaire à Vue mais avec moins de boilerplate. Cependant, l'écosystème Svelte est moins mature que celui de Vue, et les opportunités professionnelles sont plus rares.

**Solid.js:** Framework réactif ultra-performant utilisant des fine-grained reactivity au lieu du Virtual DOM. Solid offre des performances supérieures à Vue tout en maintenant une API similaire à React. Excellent pour les applications nécessitant des performances maximales, mais l'écosystème est encore naissant comparé à Vue. Solid reste un choix de niche pour des cas d'usage spécifiques.

**Preact:** Alternative ultra-légère à React (3KB) avec une API compatible. Preact n'est pas directement comparable à Vue car c'est un drop-in replacement pour React. Mentionné ici car certains projets hésitent entre Vue et Preact pour des applications nécessitant un bundle minimal. Vue offre plus de fonctionnalités built-in (directives, transitions) tandis que Preact privilégie la simplicité absolue.

## Écosystème {#ecosystem}

### L'écosystème Vue.js en 2025

#### Outils officiels et core

- **Vite:** Build tool ultra-rapide créé par Evan You (créateur de Vue). Vite utilise ESM en développement pour un HMR instantané et Rollup en production. Devenu le standard pour les projets Vue.
- **Vue Router:** Solution de routing officielle avec support des nested routes, navigation guards, lazy loading, et excellent TypeScript support.
- **Pinia:** Store state management officiel moderne remplaçant Vuex. API plus simple, support TypeScript excellent, DevTools integration, et architecture modulaire.
- **VueUse:** Collection de +200 composition functions utilitaires couvrant les cas d'usage courants (localStorage, fetch, sensors, animations).

#### Meta-frameworks et SSR

- **Nuxt.js:** Framework full-stack Vue équivalent à Next.js pour React. Offre SSR, SSG, ISR, file-based routing, server API routes, et excellent DX. Nuxt 3 avec Nitro engine offre des performances exceptionnelles.
- **Quasar:** Framework complet permettant de créer des applications web, mobile (Cordova/Capacitor), desktop (Electron), et SPA à partir d'une seule codebase.
- **Vite-SSR:** Solution SSR minimaliste et flexible pour Vue utilisant Vite, alternative légère à Nuxt pour des besoins simples.
- **VitePress:** Générateur de sites statiques optimisé pour la documentation technique, construit sur Vite et Vue.

#### UI Component Libraries

- **Vuetify:** Library Material Design la plus complète pour Vue avec 100+ components, thèmes personnalisables, et responsive design built-in.
- **Element Plus:** Suite de components pour applications d'entreprise avec design professionnel et riche palette de composants complexes (data tables, forms, etc.).
- **Naive UI:** Library moderne avec excellent dark mode support, TypeScript-first, et design épuré. Performances optimales et bundle size réduit.
- **PrimeVue:** Suite complète de 90+ components richement fonctionnels avec thèmes personnalisables et excellent support accessibility.
- **Ant Design Vue:** Port officiel d'Ant Design pour Vue, design system complet utilisé par de nombreuses entreprises chinoises.

#### Testing et qualité

- **Vitest:** Framework de test unitaire ultra-rapide créé par l'équipe Vite, compatible avec l'API Jest mais bien plus performant.
- **Vue Test Utils:** Librairie officielle pour tester les composants Vue avec mounting, queries, et assertions.
- **Cypress Component Testing:** Tests de composants Vue dans un vrai navigateur avec excellent DX et debugging.
- **Playwright:** Tests end-to-end cross-browser pour applications Vue complètes.

#### Build et tooling

- **Vite:** Standard actuel, remplace Vue CLI pour les nouveaux projets.
- **Vue CLI:** Outil historique de scaffolding et build basé sur Webpack, en mode maintenance.
- **Webpack:** Encore utilisé dans certains projets legacy Vue, mais Vite est maintenant recommandé.

## Single File Components {#sfc}

### Format .vue

Les fichiers .vue permettent de regrouper template, script et styles dans un seul fichier :

```vue
<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script setup>
import { ref } from "vue";

const msg = ref("Hello Vue 3!");
</script>

<style scoped>
.hello {
    color: #42b983;
}
</style>
```

## Exemples {#examples}

### Exemples pratiques avec Vue.js

#### Composition API avec réactivité

```vue
<script setup>
import { ref, reactive, computed, onMounted } from "vue";

// Refs pour valeurs primitives
const count = ref(0);
const message = ref("Bonjour Vue 3!");

// Reactive pour objets
const user = reactive({
    name: "Alice",
    email: "alice@example.com",
    age: 25,
});

// Computed property
const doubleCount = computed(() => count.value * 2);

// Fonction
function increment() {
    count.value++;
}

// Lifecycle hook
onMounted(() => {
    console.log("Composant monté");
});
</script>

<template>
    <div>
        <p>{{ message }}</p>
        <p>Count: {{ count }}</p>
        <p>Double: {{ doubleCount }}</p>
        <button @click="increment">Incrémenter</button>

        <div>
            <p>User: {{ user.name }} ({{ user.age }} ans)</p>
        </div>
    </div>
</template>
```

#### Composable personnalisé (logique réutilisable)

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = initialValue;
  }

  return {
    count,
    doubled,
    increment,
    decrement,
    reset
  };
}

// Utilisation dans un composant
<script setup>
import { useCounter } from '@/composables/useCounter';

const { count, doubled, increment, decrement, reset } = useCounter(10);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

#### Watch et watchEffect pour réactivité

```vue
<script setup>
import { ref, watch, watchEffect } from "vue";

const searchQuery = ref("");
const results = ref([]);
const isLoading = ref(false);

// Watch avec source spécifique
watch(searchQuery, async (newQuery, oldQuery) => {
    if (newQuery.length > 2) {
        isLoading.value = true;
        // Simulation d'une recherche API
        await new Promise((resolve) => setTimeout(resolve, 500));
        results.value = [`Résultat pour "${newQuery}"`];
        isLoading.value = false;
    }
});

// Watch multiple sources
const firstName = ref("John");
const lastName = ref("Doe");

watch([firstName, lastName], ([newFirst, newLast]) => {
    console.log(`Nom complet: ${newFirst} ${newLast}`);
});

// WatchEffect s'exécute immédiatement et track les dépendances
watchEffect(() => {
    console.log(`Query actuelle: ${searchQuery.value}`);
    // Automatiquement re-exécuté quand searchQuery change
});

// Watch avec options avancées
watch(searchQuery, (newVal) => console.log("Changed:", newVal), { deep: true, immediate: true });
</script>

<template>
    <div>
        <input v-model="searchQuery" placeholder="Rechercher..." />
        <p v-if="isLoading">Chargement...</p>
        <ul>
            <li v-for="result in results" :key="result">{{ result }}</li>
        </ul>
    </div>
</template>
```

#### Directive personnalisée

```typescript
// directives/vFocus.ts
import type { Directive } from 'vue';

// Directive pour auto-focus un input
export const vFocus: Directive = {
  mounted(el) {
    el.focus();
  }
};

// Directive avec arguments et modifiers
export const vColor: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    el.style.color = binding.value;
  },
  updated(el, binding) {
    el.style.color = binding.value;
  }
};

// Utilisation dans un composant
<script setup>
import { ref } from 'vue';
import { vFocus, vColor } from '@/directives';

const inputValue = ref('');
const textColor = ref('blue');
</script>

<template>
  <div>
    <!-- Auto-focus à la création -->
    <input v-focus v-model="inputValue" />

    <!-- Couleur dynamique -->
    <p v-color="textColor">Texte coloré</p>

    <button @click="textColor = 'red'">Rouge</button>
    <button @click="textColor = 'green'">Vert</button>
  </div>
</template>
```

#### Teleport pour modals et overlays

```vue
<script setup>
import { ref } from "vue";

const isModalOpen = ref(false);

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}
</script>

<template>
    <div>
        <button @click="openModal">Ouvrir Modal</button>

        <!-- Teleport vers <body> pour éviter les problèmes de z-index -->
        <Teleport to="body">
            <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
                <div class="modal-content" @click.stop>
                    <h2>Modal Title</h2>
                    <p>Contenu du modal</p>
                    <button @click="closeModal">Fermer</button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
}
</style>
```

## Avantages {#advantages}

### Pourquoi choisir Vue.js ?

- **Courbe d'apprentissage douce:** Vue est conçu pour être accessible aux débutants tout en restant puissant pour les experts. La documentation est exceptionnelle, claire et traduite en plusieurs langues. Les développeurs peuvent commencer rapidement et progresser naturellement vers des concepts avancés.

- **Framework progressif:** Vue peut être adopté incrémentalement. Commencez par ajouter Vue à une page existante avec un simple script tag, puis évoluez vers une SPA complète avec build tools. Cette flexibilité permet une adoption sans refonte complète.

- **Système de réactivité intuitif:** Le système de réactivité de Vue (ref, reactive) est simple à comprendre et performant. Les changements de données se propagent automatiquement dans le template sans code boilerplate. La Composition API offre une logique réutilisable élégante.

- **Single File Components:** Le format .vue regroupe template, script et styles dans un fichier unique, facilitant la compréhension et la maintenance. Les styles scoped évitent les conflits CSS sans configuration complexe.

- **Excellente documentation:** La documentation Vue est régulièrement citée comme la meilleure parmi les frameworks JavaScript. Des guides détaillés, des exemples pratiques, et des traductions en 12+ langues rendent Vue accessible mondialement.

- **Écosystème mature et cohérent:** Solutions officielles pour routing (Vue Router), state management (Pinia), SSR (Nuxt), build tooling (Vite), et testing. Cet écosystème cohérent réduit la "JavaScript fatigue" et simplifie les décisions architecturales.

- **Performances optimales:** Virtual DOM optimisé, compiler hints, et composition API permettent des performances excellentes. Vue 3 avec bundle size minimal (~10KB gzipped) et temps de rendu compétitifs avec Svelte et Solid.

- **Communauté active et bienveillante:** Communauté mondiale active, particulièrement forte en Asie. Support Discord réactif, plugins et composants communautaires abondants, et événements réguliers (VueConf).

## Tendances {#trends}

### Tendances et évolutions de Vue.js

#### Composition API devenant le standard

La Composition API introduite dans Vue 3 est devenue la façon recommandée d'écrire des composants Vue. Elle offre une meilleure organisation du code, réutilisation de logique via composables, et TypeScript support supérieur. En 2025, la majorité des nouveaux projets et librairies utilisent `<script setup>` comme syntaxe par défaut, remplaçant progressivement l'Options API legacy.

#### Vapor Mode : compilation optimisée expérimentale

Vapor Mode est un nouveau mode de compilation expérimental pour Vue qui élimine le Virtual DOM et compile les composants directement en opérations DOM optimales, similaire à Svelte. Cette approche promet des performances encore meilleures et un bundle size réduit de 50%. Bien qu'encore en développement, Vapor Mode représente l'avenir des performances Vue.

#### TypeScript support amélioré

Vue 3 a considérablement amélioré le support TypeScript avec des types générés automatiquement, meilleure inference, et intégration IDE (Volar). Les projets Vue utilisent de plus en plus TypeScript par défaut, et l'écosystème offre un excellent typage. Volar remplace Vetur comme extension VS Code officielle avec type checking complet.

#### Vite comme standard de build

Vite, créé par Evan You, est devenu l'outil de build standard pour Vue, remplaçant Vue CLI. Le HMR instantané de Vite et les temps de build rapides transforment l'expérience développeur. La majorité des templates officiels et projets communautaires utilisent désormais Vite, et Vue CLI est en mode maintenance.

#### Adoption croissante en entreprise

Vue gagne du terrain dans les entreprises, particulièrement en Europe et Asie. Des entreprises comme Alibaba, Xiaomi, Adobe, et GitLab utilisent Vue en production. La maturité de Vue 3, l'écosystème stable, et le support long terme renforcent la confiance des entreprises pour des projets critiques.

## Conclusion {#conclusion}

### Vue.js : le framework progressif pour tous

Vue.js s'est établi comme une alternative solide et appréciée dans l'écosystème JavaScript. Sa philosophie progressive, sa courbe d'apprentissage douce, et son écosystème mature en font un excellent choix pour des projets de toutes tailles, des prototypes rapides aux applications d'entreprise complexes.

L'avenir de Vue est prometteur avec des innovations continues comme Vapor Mode, l'amélioration constante des performances, et une adoption croissante dans le monde professionnel. Pour les développeurs cherchant un framework équilibré entre puissance et simplicité, avec une communauté bienveillante et une documentation exceptionnelle, Vue.js représente un choix judicieux en 2025.

## Ressources {#resources}

### Pour apprendre

- [Documentation officielle Vue.js](https://vuejs.org/)
- [Vue Mastery](https://www.vuemastery.com/) - Cours vidéo de qualité
- [Vue School](https://vueschool.io/) - Plateforme d'apprentissage
- [Awesome Vue](https://github.com/vuejs/awesome-vue) - Liste de ressources
- [Blog Vue.js](https://blog.vuejs.org/)
- [Vue.js Challenges](https://vuejs-challenges.netlify.app/)

## Sources {#sources}

### Références bibliographiques

#### Documentation officielle

- [Vue.js Official Documentation](https://vuejs.org/)
- [Vue.js Guide](https://vuejs.org/guide/)
- [Vue.js API Reference](https://vuejs.org/api/)
- [Vue.js Blog](https://blog.vuejs.org/)
- [Vue.js GitHub Repository](https://github.com/vuejs/core)
- [Vue.js RFC (Request for Comments)](https://github.com/vuejs/rfcs)

#### Alternatives et comparaisons

- [React Framework](https://react.dev/)
- [Angular Framework](https://angular.io/)
- [Svelte Framework](https://svelte.dev/)
- [Solid.js Framework](https://www.solidjs.com/)
- [Preact - Lightweight React Alternative](https://preactjs.com/)
- [Vue vs React Comparison](https://vuejs.org/guide/extras/composition-api-faq.html)
- [State of JS - Framework Rankings](https://stateofjs.com/)

#### Écosystème officiel

- [Vite - Next Generation Frontend Tooling](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia - State Management](https://pinia.vuejs.org/)
- [VueUse - Composition Utilities](https://vueuse.org/)
- [Nuxt.js - Vue Framework](https://nuxt.com/)
- [VitePress - Static Site Generator](https://vitepress.dev/)
- [Vitest - Unit Test Framework](https://vitest.dev/)

#### UI Libraries et écosystème

- [Vuetify - Material Design Components](https://vuetifyjs.com/)
- [Element Plus - Enterprise Components](https://element-plus.org/)
- [Naive UI - Modern Component Library](https://www.naiveui.com/)
- [PrimeVue - Rich UI Components](https://primevue.org/)
- [Ant Design Vue](https://antdv.com/)
- [Quasar Framework](https://quasar.dev/)
- [Awesome Vue - Curated Resources](https://github.com/vuejs/awesome-vue)

#### Tendances et évolution

- [Vue.js Roadmap](https://github.com/vuejs/core/blob/main/ROADMAP.md)
- [Vapor Mode Announcement](https://github.com/vuejs/core-vapor)
- [Volar - Vue Language Tools](https://github.com/vuejs/language-tools)
- [Vue.js Conf](https://vuejs.amsterdam/)
- [State of Vue.js](https://2024.stateofvue.com/)