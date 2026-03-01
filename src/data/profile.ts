export const profile = {
    name: "Sylvain L.",
    title: "Développeur Full Stack & Web Designer",
    description:
        "Je développe de tout, mais principalement des sites Internets et des APIs. J\'expérimente beaucoup, surtout du côté back-end chez Zenetys.",
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
    action?: "copy" | "pdf";
}

export const contacts: ContactLink[] = [
    { icon: "mail", label: profile.links.email, action: "copy" },
    { icon: "github", label: profile.social.github, url: profile.links.github },
    { icon: "linkedin", label: profile.social.linkedin, url: profile.links.linkedin },
    { icon: "discord", label: profile.social.discord, url: profile.links.discord },
    { icon: "sponsors", label: "Sponsors", url: profile.links.sponsors },
    { icon: "cv", label: "CV", action: "pdf", url: profile.links.cv },
];

export const badges = [
    { name: "Google Developer", icon: "developer", url: "https://g.dev/20syl" },
    { name: "Gemini AI", icon: "gemini", url: "https://gemini.google.com" },
    { name: "Firebase", icon: "firebase", url: "https://firebase.google.com" },
    { name: "Google Studio", icon: "studio", url: "https://aistudio.google.com" },
    { name: "Google Cloud", icon: "cloud", url: "https://cloud.google.com" },
    { name: "Google Maps", icon: "maps", url: "https://maps.google.com" },
];