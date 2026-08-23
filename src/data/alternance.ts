// Projects developed during the work-study program at Zenetys
export interface AlternanceProject {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    sections: { title: string; content: string }[];
    image?: string;
    video?: string;
    iframe?: string;
    github?: string;
    link?: string;
    projet?: string;
}

export const projects: AlternanceProject[] = [
    {
        id: "hyoai",
        title: "HYOAI - Interface de chat pour LLM",
        description:
            "HYOAI (Host Your Own AI) est une interface de chat web open-source développée chez Zenetys pour dialoguer avec n'importe quel LLM compatible OpenAI. J'ai développé cette application entièrement statique, exécutée dans le navigateur et sans backend.",
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        image: "/images/hyoai-demo.png",
        github: "https://github.com/zenetys/hyoai",
        link: "https://tools.zenetys.com/hyoai/",
        projet: "hyoai",
        sections: [
            {
                title: "Une architecture 100% navigateur",
                content:
                    "HYOAI est un front-end entièrement statique : aucun backend, rien à héberger ni à sécuriser côté serveur. Le navigateur communique directement avec l'API du serveur d'inférence (llama.cpp, vLLM, Ollama ou toute API compatible OpenAI), et les conversations ne quittent jamais la machine — elles sont stockées compressées dans le localStorage.",
            },
            {
                title: "Multi-backend et raisonnement",
                content:
                    "Un même client parle à plusieurs endpoints, locaux ou distants, sélectionnables depuis le menu des modèles. Quand un modèle le déclare, un toggle de raisonnement et un sélecteur d'effort apparaissent, chaque backend mappant ces réglages sur son propre format de requête. Le mode comparaison permet de lancer un même prompt sur deux modèles côte à côte.",
            },
            {
                title: "L'interface",
                content:
                    "L'interface gère les conversations en local avec branches et versions alternatives, la citation de messages, le rendu Markdown avec coloration syntaxique et sources, ainsi que l'envoi d'images. L'expérience est responsive, avec des drawers tactiles sur mobile, et accessible au clavier via les primitives Radix.",
            },
        ],
    },
    {
        id: "zeportal",
        title: "Zeportal - Tools",
        description:
            "Zenetys Tools est le portail qui centralise les outils et démos web de Zenetys, disponible sur tools.zenetys.com. J'ai entièrement reconstruit son interface en la migrant de Vue.js vers Next.js.",
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        image: "/images/zeportal-demo.png",
        link: "https://tools.zenetys.com",
        projet: "zeportal",
        sections: [
            {
                title: "Une refonte de Vue vers Next.js",
                content:
                    "Le portail reposait à l'origine sur Vue.js. Je l'ai repris de zéro pour le reconstruire sur une base Next.js : migration de l'outillage de build, nouvelle interface développée avec l'App Router, shadcn/ui et Tailwind CSS v4, et export entièrement statique servi derrière un reverse proxy sur la même origine que les outils.",
            },
            {
                title: "Un registre d'outils configurable",
                content:
                    "Les outils sont déclarés dans un fichier config.json récupéré au runtime. Chaque entrée décrit un nom, une icône, une URL, un mode d'ouverture, une description bilingue (FR/EN) et des tags. Modifier un outil existant se reflète sans rebuild, ce qui rend le portail facile à faire évoluer.",
            },
            {
                title: "Visionneuse intégrée et nouvel onglet",
                content:
                    "Selon son type, un outil s'ouvre soit dans une visionneuse intégrée au portail — l'outil dans une iframe avec le panneau de navigation sur la gauche, comme pour ZPKI ou HYOAI — soit directement dans un nouvel onglet. L'interface est bilingue, avec thème clair, sombre ou système.",
            },
        ],
    },
    {
        id: "monitoring",
        title: "Outil de supervision",
        description:
            "J'ai recréé de zéro l'interface utilisateur et l'API de l'outil de supervision de Zenetys. Il était auparavant disponible à l'aide de Kibana, mais j'ai développé une solution plus intégrée et personnalisable.",
        technologies: ["Node.js", "ElasticSearch", "HTML", "CSS", "JS"],
        image: "/images/monitoring-demo.png",
        sections: [
            {
                title: "L'interface utilisateur",
                content:
                    "L'interface utilisateur a été entièrement repensée pour offrir une expérience plus fluide et moderne. J'ai créé mes propres composants pour la mise en page, et j'ai ajouté des animations CSS pour rendre l'interface plus dynamique. Les mises à jour sont en temps réel afin que les utilisateurs puissent voir les changements immédiatement.",
            },
            {
                title: "Responsivité et accessibilité",
                content:
                    "J'ai veillé à ce que l'interface soit responsive et accessible sur tous les appareils. Des options sont disponibles pour ajuster l'affichage en fonction des préférences de l'utilisateur : hauteur des lignes des tableaux, désactivation des animations.",
            },
            {
                title: "L'API",
                content:
                    "L'API permet de récupérer des données de la base ElasticSearch, et de les exposer via des endpoints REST. J'ai utilisé Node.js pour développer l'API, c'est plus rapide et plus léger que d'autres solutions.",
            },
        ],
    },
    {
        id: "logvault-io",
        title: "LogVault.io - Site internet",
        description:
            "J'ai entièrement développé le site internet bilingue de LogVault avec Next.js et un template interne (@zenetys/template). Le site présente les offres SaaS et On-Premise.",
        technologies: ["Next.js", "Tailwind CSS", "TypeScript"],
        image: "/images/logvault-demo.png",
        link: "https://logvault.io",
        projet: "logvault",
        sections: [
            {
                title: "Architecture data-driven",
                content:
                    "Le site est construit sur un template Next.js 16 développé en interne. Tout le contenu est configuré dans des fichiers de données et de traduction, sans texte en dur dans les composants.",
            },
            {
                title: "Bilingue et moderne",
                content:
                    "Le site supporte le français et l'anglais via next-intl, avec dark mode automatique et animations Framer Motion. L'export est entièrement statique.",
            },
        ],
    },
    {
        id: "logvault",
        title: "LogVault - Service de gestion de Logs",
        description:
            "LogVault est un service de sécurisation et de gestion de logs, développé par Zenetys. J'ai contribué au développement de l'interface utilisateur et de l'application web.",
        technologies: ["Vue.js"],
        github: "https://github.com/zenetys/logcenter",
        link: "https://auth.logvault.io",
        sections: [
            {
                title: "Qu'est ce que LogVault ?",
                content:
                    "LogVault permet de centraliser, chiffrer et archiver les logs de vos applications et infrastructures, dans une optique de conformité réglementaire (RGPD, NIS2, DORA) et d'observabilité.",
            },
            {
                title: "Interface utilisateur",
                content:
                    "L'interface utilisateur est développée en Vue.js. Elle fournit des tableaux de bord pour analyser et visualiser les logs collectés, indexés et archivés par la plateforme.",
            },
        ],
    },
    {
        id: "lyah",
        title: "Lyah - Application de chat collaboratif",
        description:
            "Lyah est une application de chat collaboratif commencée en Mars 2025. J'ai designé et développé l'interface utilisateur, en utilisant HTML, CSS et JavaScript. L'API est développée en Node.js, et utilise un système de WebSocket pour la communication en temps réel.",
        technologies: ["Node.js", "WebSocket", "PostgreSQL", "HTML", "CSS", "JS"],
        video: "/videos/lyah-demo.mp4",
        sections: [
            {
                title: "L'interface de chat",
                content:
                    "L'interface est simple, intuitive et moderne. Elle inclut un menu latéral rétractable, permettant de naviguer entre les différentes conversations. Vous pouvez créer des groupes de discussion, changer le thème ou la langue de l'interface.",
            },
            {
                title: "Responsivité",
                content:
                    "L'interface est entièrement responsive, et s'adapte à tous les écrans. Il faut swiper vers la droite pour ouvrir le menu latéral, et vers la gauche pour le refermer.",
            },
            {
                title: "Les modèles d'IA",
                content:
                    "Lyah utilise 5 modèles d'IA internes, chacun ayant ses propres spécificités, ainsi que certains modèles de Ollama. Vous pouvez poser des questions et envoyer des retours pour améliorer les modèles.",
            },
            {
                title: "WebSocket",
                content:
                    "Le système de WebSocket est utilisé pour la communication en temps réel entre le client et le serveur. Cela permet d'envoyer et de recevoir des messages instantanément.",
            },
        ],
    },
    {
        id: "zpki",
        title: "ZPKI - Gestion de certificats SSL",
        description:
            "En début d'année 2024, j'ai entrepris la refonte complète de l'interface utilisateur pour ZPKI, un outil de gestion de certificats OpenSSL. La complexité m'a conduit à recréer entièrement l'application en deux mois.",
        technologies: ["Node.js", "Bootstrap", "Shell/Bash", "OpenSSL"],
        video: "/videos/zpki-demo.mp4",
        github: "https://github.com/zenetys/zpki",
        link: "https://tools.zenetys.com/zpki",
        sections: [
            {
                title: "Fonctionnalités principales",
                content:
                    "Création et gestion d'autorités de certification (CA) et de certificats. Actions avancées : mise à jour, révocation, désactivation des certificats. Visualisation avec des informations détaillées sur le statut, les dates, les téléchargements.",
            },
            {
                title: "Interface utilisateur",
                content:
                    "Développée avec Bootstrap 5.3.3, elle offre une recherche avancée, gestion multi-CA, actions sécurisées avec passphrase, et support multilingue (Français, Anglais).",
            },
            {
                title: "API et sécurité",
                content:
                    "Développée en Node.js, l'API assure des interactions fluides avec validation des entrées et double vérification via l'interface. Elle exploite les modules spawn et exec pour exécuter les commandes bash avec des sécurités renforcées.",
            },
        ],
    },
    {
        id: "drawio-plugin",
        title: "Draw.io Plugin pour YaNA",
        description:
            "Ce plugin améliore l'usage de Draw.io pour visualiser et gérer des infrastructures réseau à l'aide des données de YaNA et Kompot.",
        technologies: ["JavaScript", "Draw.io API"],
        github: "https://github.com/20syldev/drawio-ext",
        sections: [
            {
                title: "Fonctionnalités principales",
                content:
                    "Création automatique de schémas à partir des équipements réseau. Mise à jour des informations en fonction des données de YaNA avec changement de couleur selon le statut. Ajout, suppression et modification des équipements tout en conservant les positions manuelles.",
            },
            {
                title: "Gestion simplifiée",
                content:
                    "Le plugin utilise les données de YaNA pour ajouter des switchs, tracer automatiquement les connexions réseau, afficher les VLANs et donner un style distinctif aux liens en fonction de la vitesse et du mode duplex.",
            },
        ],
    },
];