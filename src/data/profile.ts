// Main profile data (identity, education, experience, links)
export const profile = {
    name: "Sylvain L.",
    title: "Développeur Full Stack & Web Designer",
    description: {
        template: "Je conçois des %s, des %s et des %s en tout genre. Je m'intéresse %s et %s.",
        variants: [
            ["sites web", "APIs", "outils", "à la cybersécurité", "à l'IA"],
            ["outils CLI", "plugins", "jeux", "au réseau", "au hacking"],
            ["apps", "bots", "scripts", "à la cryptographie", "à l'open source"],
        ],
    },
    work: {
        email: "slambert@zenetys.com",
    },
    experience: {
        frontend: "8 ans",
        backend: "5 ans",
    },
    links: {
        github: "https://github.com/20syldev",
        linkedin: "https://linkedin.com/in/sylvainlmb",
        discord: "https://discord.com/users/607163002755481602",
        sponsors: "https://github.com/sponsors/20syldev",
        google: "https://g.dev/20syl",
        cv: "/CV.pdf",
        email: "contact@sylvain.sh",
    },
    social: {
        github: "20syldev",
        linkedin: "sylvainlmb",
        discord: "20syl",
    },
};

export interface ContactLink {
    icon: string;
    label: string;
    url?: string;
    action?: "copy" | "pdf" | "route";
    detail?: string;
    counter?: "tech" | "certifications" | "badges" | "completion" | "veille";
}

// Contact links with icons, labels and optional actions
export const contacts: ContactLink[] = [
    {
        icon: "mail",
        label: profile.links.email,
        action: "copy",
        detail: "Copier mon adresse e-mail",
    },
    {
        icon: "github",
        label: profile.social.github,
        url: profile.links.github,
        detail: "Mes dépôts et mon activité",
    },
    {
        icon: "cv",
        label: "CV",
        action: "pdf",
        url: profile.links.cv,
        detail: "Ouvrir mon CV au format PDF",
    },
    {
        icon: "sponsors",
        label: "Sponsors",
        url: profile.links.sponsors,
        detail: "Soutenir mon travail open source",
    },
    {
        icon: "linkedin",
        label: profile.social.linkedin,
        url: profile.links.linkedin,
        detail: "Mon parcours professionnel",
    },
    {
        icon: "discord",
        label: profile.social.discord,
        url: profile.links.discord,
        detail: "Me joindre directement",
    },
];

// Internal page links displayed in the contact dialog
export const pageLinks: ContactLink[] = [
    {
        icon: "graduation",
        label: "Parcours",
        url: "/parcours",
        action: "route",
        detail: "Écoles, alternance et projets encadrés",
    },
    {
        icon: "wrench",
        label: "Technologies",
        url: "/tech",
        action: "route",
        detail: "Langages, frameworks et outils du quotidien",
        counter: "tech",
    },
    {
        icon: "veille",
        label: "Veille",
        url: "/veille",
        action: "route",
        detail: "Ce que je suis dans l'écosystème",
        counter: "veille",
    },
    {
        icon: "award",
        label: "Certifications",
        url: "/certifications",
        action: "route",
        detail: "Certifications obtenues et vérifiables",
        counter: "certifications",
    },
    {
        icon: "badge",
        label: "Badges",
        url: "/badges",
        action: "route",
        detail: "Badges du profil Google Developer",
        counter: "badges",
    },
    {
        icon: "check",
        label: "Complétions",
        url: "/completion",
        action: "route",
        detail: "Modules et parcours terminés",
        counter: "completion",
    },
];