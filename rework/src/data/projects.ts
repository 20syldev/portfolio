export interface Project {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    tags: string[];
    github?: string;
    demo?: string;
    npm?: string;
    image?: string;
    featured?: boolean;
    archived?: boolean;
    paused?: boolean;
}

export const projects: Project[] = [
    {
        id: 'api',
        name: 'API',
        description: 'Mon API Node.js, pour les développeurs et les utilisateurs.',
        longDescription:
            'API REST complète développée en Node.js avec Express. Elle fournit des endpoints pour récupérer des données sur mes projets, les statistiques GitHub, et plus encore. Disponible aussi en tant que module NPM.',
        tags: ['Node.js', 'Express', 'Module'],
        github: 'https://github.com/20syldev/api',
        demo: 'https://api.sylvain.pro',
        npm: 'https://npmjs.com/package/@20syldev/api',
        featured: true
    },
    {
        id: 'cdn',
        name: 'CDN',
        description: 'Mon réseau de diffusion de données pour certains projets.',
        tags: ['Node.js', 'Express', 'Module'],
        github: 'https://github.com/20syldev/cdn',
        demo: 'https://cdn.sylvain.pro',
        featured: true
    },
    {
        id: 'docs',
        name: 'Docs',
        description: 'La documentation de mon API, pour les développeurs.',
        longDescription:
            'Documentation complète de l\'API construite avec VitePress (Vue.js). Interface moderne avec recherche, exemples de code et guides d\'utilisation.',
        tags: ['Vue.js', 'VitePress', 'HTML', 'CSS', 'TS'],
        github: 'https://github.com/20syldev/docs',
        demo: 'https://docs.sylvain.pro',
        featured: true
    },
    {
        id: 'chat',
        name: 'Chat',
        description: 'Application de chats publics et privés en ligne.',
        longDescription:
            'Application de messagerie en temps réel avec salons publics et conversations privées. Utilise WebSocket pour la communication instantanée.',
        tags: ['HTML', 'CSS', 'JS', 'WebSocket'],
        github: 'https://github.com/20syldev/chat',
        demo: 'https://chat.sylvain.pro'
    },
    {
        id: 'flowers',
        name: 'Flowers',
        description: 'Application de création de LogCenter.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/flowers',
        demo: 'https://flowers.sylvain.pro',
        paused: true
    },
    {
        id: 'ping',
        name: 'Ping',
        description: 'Interface de test de disponibilité de mes sites web.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/ping',
        demo: 'https://ping.sylvain.pro'
    },
    {
        id: 'terminal',
        name: 'Terminal',
        description: 'Terminal Linux en ligne, avec les commandes de base.',
        longDescription:
            'Émulateur de terminal Linux fonctionnel dans le navigateur. Supporte les commandes de base (ls, cd, cat, etc.) avec un système de fichiers simulé.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/terminal',
        demo: 'https://terminal.sylvain.pro'
    },
    {
        id: 'morpion',
        name: 'Morpion',
        description: 'Un jeu de Morpion en ligne, ou contre l\'ordinateur.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/morpion',
        demo: 'https://morpion.sylvain.pro',
        featured: true
    },
    {
        id: '2048',
        name: '2048',
        description: 'Un jeu de 2048 en ligne.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/2048',
        demo: 'https://2048.sylvain.pro'
    },
    {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Mon site web, avec des informations sur mes projets.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/portfolio',
        demo: 'https://sylvain.pro'
    },
    {
        id: 'php',
        name: 'PHP',
        description: 'Un listing de mes projets en PHP, pour les tester en ligne.',
        tags: ['Docker', 'PHP', 'HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/php',
        demo: 'https://php.sylvain.pro'
    },
    {
        id: 'logs',
        name: 'Logs',
        description: 'Interface pour les logs de mon API.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/logs',
        demo: 'https://logs.sylvain.pro'
    },
    {
        id: 'planning',
        name: 'Planning',
        description: 'Interface de planning HyperPlanning.',
        longDescription:
            'Interface personnalisée pour consulter les emplois du temps HyperPlanning. Navigation fluide jour/semaine avec sauvegarde des préférences.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/planning',
        demo: 'https://planning.sylvain.pro'
    },
    {
        id: 'password',
        name: 'Password',
        description: 'Testeur de mots de passe suivant des critères.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/password',
        demo: 'https://password.sylvain.pro'
    },
    {
        id: 'timestamp',
        name: 'Timestamp',
        description: 'Convertisseur de timestamps pour Discord.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/timestamp',
        demo: 'https://timestamp.sylvain.pro'
    },
    {
        id: 'readme',
        name: 'Readme',
        description: 'Interface de lecture de fichiers README.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/readme',
        demo: 'https://readme.sylvain.pro'
    },
    {
        id: 'donut',
        name: 'Donut',
        description: 'Une animation de donut interactive en JavaScript.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/donut',
        demo: 'https://donut.sylvain.pro'
    },
    {
        id: 'digit',
        name: 'Digit',
        description: 'IA de reconnaissance de chiffres dessinés.',
        longDescription:
            'Réseau de neurones en JavaScript pour reconnaître les chiffres manuscrits (0-9). Dessinez un chiffre et l\'IA le reconnaît instantanément.',
        tags: ['HTML', 'CSS', 'JS', 'AI'],
        github: 'https://github.com/20syldev/digit',
        demo: 'https://digit.sylvain.pro'
    },
    {
        id: 'lebonchar',
        name: 'LeBonChar',
        description: 'Mon site web de vente de véhicules d\'occasion.',
        tags: ['Docker', 'PHP', 'MySQL', 'HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/LeBonChar',
        demo: 'https://lebonchar.site'
    },
    {
        id: 'minify',
        name: 'Minify.js',
        description: 'Un module Node.js pour minifier ce que vous voulez.',
        tags: ['Node.js', 'Module'],
        github: 'https://github.com/20syldev/minify.js',
        npm: 'https://npmjs.com/@20syldev/minify.js'
    },
    {
        id: 'wrkit',
        name: 'WrkIT',
        description: 'Bot Discord de la classe de BTS SIO.',
        tags: ['Discord.js'],
        github: 'https://github.com/20syldev/WrkIT',
        npm: 'https://npmjs.com/wrkit'
    },
    {
        id: 'nitrogen',
        name: 'NitroGen',
        description: 'Bot Discord de génération de code Nitro aléatoires.',
        tags: ['Discord.js'],
        github: 'https://github.com/20syldev/NitroGen',
        archived: true
    },
    {
        id: 'python-api',
        name: 'API Python',
        description: 'Ancienne API Python précédant mon API Node.js.',
        tags: ['Python', 'Flask'],
        github: 'https://github.com/20syldev/python-api',
        archived: true
    },
    {
        id: 'old-database',
        name: 'Database',
        description: 'Ancienne interface de base de données.',
        tags: ['HTML', 'CSS', 'JS'],
        github: 'https://github.com/20syldev/old-database',
        archived: true
    }
];