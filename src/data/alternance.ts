export const projects = [
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
        id: "logvault",
        title: "LogVault - Service de gestion de Logs",
        description:
            "LogVault est un service de sécurisation et de gestion de logs, développé par Zenetys. J'ai été impliqué dans le développement de l'interface utilisateur en Vue.js, et j'ai entièrement développé le site web.",
        technologies: ["Vue.js", "Tailwind CSS"],
        image: "/images/logvault-demo.png",
        link: "https://logvault.io",
        sections: [
            {
                title: "Qu'est ce que LogVault ?",
                content:
                    "LogVault permet de centraliser, sécuriser et analyser les logs de vos applications et infrastructures. Il possède une interface web intuitive permettant de visualiser les logs en temps réel, de les analyser via des graphiques.",
            },
            {
                title: "Interface moderne",
                content:
                    "L'interface utilisateur est développée en Vue.js. Le site web utilise Tailwind CSS pour un design moderne, avec un mode clair et sombre automatique.",
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