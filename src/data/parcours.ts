// Academic path (schools, degrees and school projects), most recent first.
export interface ParcoursProject {
    name: string;
    repo: string;
    branch: string;
    icon: string;
    description: string;
    from?: string;
    to?: string;
    tags?: string[];
    link?: string;
}

export interface ParcoursEntry {
    id: string;
    school: string;
    degree: string;
    short: string;
    field?: string;
    start: string;
    end: string;
    from: string;
    to: string;
    status: "upcoming" | "current" | "done";
    description?: string;
    skills?: string[];
    skillsNote?: string;
    document?: { label: string; file: string };
    projects?: ParcoursProject[];
}

export interface ParcoursWork {
    id: string;
    company: string;
    role: string;
    start: string;
    end: string;
    from: string;
    to: string;
    href?: string;
    current?: boolean;
}

export const parcours: ParcoursEntry[] = [
    {
        id: "ipssi",
        school: "IPSSI",
        degree: "Bachelor Concepteur développeur d'applications",
        short: "Bachelor CDA",
        field: "Développement & Intelligence Artificielle",
        start: "2026-10-01",
        end: "2027-10-31",
        from: "octobre 2026",
        to: "octobre 2027",
        status: "upcoming",
        description:
            "Poursuite d'études en alternance sur un Bachelor orienté conception d'applications, avec une spécialisation en intelligence artificielle.",
        skills: [
            "Architecture logicielle",
            "Intelligence artificielle",
            "Conception d'applications",
            "Gestion de projet",
        ],
        skillsNote: "Compétences visées par le Bachelor, la formation débute en octobre 2026.",
    },
    {
        id: "ensitech",
        school: "ENSITECH",
        degree: "BTS Services Informatiques aux Organisations",
        short: "BTS SIO SLAM",
        field: "Solutions Logicielles et Applications Métiers",
        start: "2024-09-01",
        end: "2026-08-28",
        from: "septembre 2024",
        to: "août 2026",
        status: "done",
        description:
            "Deux années de BTS SIO option SLAM réalisées en alternance, centrées sur le développement d'applications, la conception de bases de données et la mise en production. Chaque année a donné lieu à des projets encadrés, du site MVC au projet personnel encadré en double plateforme.",
        skills: [
            "Développement full-stack",
            "Design d'interface utilisateur",
            "PHP",
            "TypeScript",
            "C#",
            "SQL",
            "Docker",
            "Architecture MVC",
        ],
        document: {
            label: "Tableau de synthèse E5",
            file: "/E5 - Tableau Synthèse - Sylvain L.pdf",
        },
        projects: [
            {
                name: "StadiumCompany",
                repo: "stadiumcompany",
                branch: "master",
                icon: "chart",
                from: "décembre 2025",
                to: "juin 2026",
                description:
                    "Projet Personnel Encadré de gestion de questionnaires, en double plateforme",
            },
            {
                name: "LeBonChar",
                repo: "lebonchar",
                branch: "master",
                icon: "car",
                from: "juin 2025",
                description: "Plateforme de vente de véhicules d'occasion, projet MVC d'examen",
                link: "https://lebonchar.sylvain.sh",
            },
            {
                name: "PPE C#",
                repo: "PPE-csharp",
                branch: "master",
                icon: "database",
                from: "décembre 2025",
                to: "janvier 2026",
                description:
                    "Application desktop de gestion de clients, avec authentification à deux facteurs",
                tags: ["C#", "Avalonia", "PostgreSQL", ".NET 8", "2FA"],
            },
            {
                name: "FlyRadars",
                repo: "flyradars",
                branch: "master",
                icon: "plane",
                from: "janvier 2026",
                description: "Interface de gestion de données pour le suivi de vols",
                tags: ["TypeScript", "React", "Express", "PostgreSQL", "Vite"],
            },
            {
                name: "WrkIT",
                repo: "wrkit",
                branch: "master",
                icon: "bot",
                from: "septembre 2024",
                to: "aujourd'hui",
                description: "Bot Discord de la classe de BTS SIO, hébergé en continu",
                link: "https://wrkit.sylvain.sh",
            },
            {
                name: "Planning",
                repo: "planning",
                branch: "master",
                icon: "calendar",
                from: "décembre 2025",
                to: "mars 2026",
                description: "Interface de planning HyperPlanning pour les SLAM et SISR",
                link: "https://planning.sylvain.sh/",
            },
        ],
    },
];

// Work-study path (companies and roles), most recent first.
export const alternance: ParcoursWork[] = [
    {
        id: "zenetys-fullstack",
        company: "Zenetys",
        role: "Développeur Full Stack",
        start: "2026-08-31",
        end: "2027-10-31",
        from: "août 2026",
        to: "octobre 2027",
        href: "/alternance/",
        current: true,
    },
    {
        id: "zenetys-web",
        company: "Zenetys",
        role: "Développeur Web",
        start: "2024-09-01",
        end: "2026-08-28",
        from: "septembre 2024",
        to: "août 2026",
        href: "/alternance/",
    },
];

// Secondary education, displayed discreetly at the bottom of the timeline
export const bac = {
    school: "Lycée Jean Monnet",
    city: "La Queue-les-Yvelines",
    degree: "Baccalauréat général",
    field: "NSI, Mathématiques, Physique-Chimie",
    from: "septembre 2021",
    to: "juin 2024",
};