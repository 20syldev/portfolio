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
    education: {
        school: "Ensitech",
        degree: "BTS SIO SLAM",
        duration: "2 ans",
        email: "contact@sylvain.sh",
    },
    work: {
        company: "Zenetys",
        role: "Développeur Web",
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

// Open source contributions (PRs, repositories)
export const contributions = [
    {
        repo: "rsyslog/rsyslog",
        title: "add split() function",
        pr: "6384",
        url: "https://github.com/rsyslog/rsyslog/pull/6384",
        description: "Fonction RainerScript pour parser des chaînes délimitées en tableaux JSON",
    },
    {
        repo: "rsyslog/rsyslog",
        title: "add append_json() function",
        pr: "6385",
        url: "https://github.com/rsyslog/rsyslog/pull/6385",
        description: "Fonction RainerScript pour construire dynamiquement des structures JSON",
    },
];

// Pinned GitHub projects displayed on the homepage
export const projects = [
    {
        name: "Planning",
        repo: "planning",
        branch: "master",
        icon: "calendar",
        description: "UI de planning simplifiée",
        link: "https://planning.sylvain.sh/",
    },
    {
        name: "PPE C#",
        repo: "PPE-csharp",
        branch: "master",
        icon: "database",
        description: "Gestionnaire de clients en C# avec PostGreSQL",
    },
    {
        name: "FlyRadars",
        repo: "flyradars",
        branch: "master",
        icon: "plane",
        description: "Interface de gestion de données d'aviation",
    },
];

export interface ContactLink {
    icon: string;
    label: string;
    url?: string;
    action?: "copy" | "pdf" | "route";
}

// Contact links with icons, labels and optional actions
export const contacts: ContactLink[] = [
    { icon: "mail", label: profile.links.email, action: "copy" },
    { icon: "github", label: profile.social.github, url: profile.links.github },
    { icon: "cv", label: "CV", action: "pdf", url: profile.links.cv },
    { icon: "sponsors", label: "Sponsors", url: profile.links.sponsors },
    { icon: "linkedin", label: profile.social.linkedin, url: profile.links.linkedin },
    { icon: "discord", label: profile.social.discord, url: profile.links.discord },
];

// Internal page links displayed in the contact dialog
export const pageLinks: ContactLink[] = [
    { icon: "wrench", label: "Technologies", url: "/tech", action: "route" },
    { icon: "award", label: "Certifications", url: "/certifications", action: "route" },
    { icon: "badge", label: "Badges", url: "/badges", action: "route" },
    { icon: "check", label: "Complétions", url: "/completion", action: "route" },
];