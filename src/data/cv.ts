import { alternance, parcours, type ParcoursEntry } from "./parcours";
import { profile } from "./profile";
import { favoriteTechs, techCategories } from "./technologies";

/**
 * Experience of the CV. The optional subtitle is the line under the title: roles held, company
 * or context.
 */
interface CvExperience {
    title: string;
    subtitle?: string;
    start: string;
    end?: string;
    description: string;
}

export interface CvFormation {
    title: string;
    school: string;
    start: string;
    end: string;
    status: ParcoursEntry["status"];
}

interface CvSkill {
    name: string;
    icon: string;
}

const months = new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
});

/**
 * Formats an ISO date as a capitalised short month and year, e.g. "Sept. 2024".
 *
 * @param date - ISO date such as "2024-09-01"
 * @returns The formatted month, or "aujourd'hui" when no date is given
 */
export function formatMonth(date?: string): string {
    if (!date) return "aujourd’hui";
    const label = months.format(new Date(date));
    return label.charAt(0).toUpperCase() + label.slice(1);
}

const latestWork = alternance.find((work) => work.current) ?? alternance[0];
const firstStart = alternance.map((work) => work.start).sort()[0];

// The sheet lays the entries out in two columns, and three rows is what fits one A4 page
const experiences: CvExperience[] = [
    {
        title: latestWork.company,
        subtitle: "Développeur Web, puis Full-Stack, en alternance",
        start: firstStart,
        end: latestWork.current ? undefined : latestWork.end,
        description: "Front-end et back-end, du BTS SIO au Bachelor IPSSI.",
    },
    {
        title: "Projets personnels",
        subtitle: "Développement Full-Stack",
        start: "2018-09-01",
        description:
            "API REST, bases de données, SEO et principes UX. Design web et mobile avec Android Studio (SDK), Node.js et Vue.js.",
    },
    {
        title: "Développeur Logiciels",
        start: "2020-09-01",
        description:
            "Applications mobiles et conception logicielle. Conception de jeux et modding en Java, C++, C# et JavaScript.",
    },
    {
        title: "Designer Web",
        start: "2020-09-01",
        end: "2024-08-31",
        description:
            "Optimisation SEO, amélioration de l’UX, wireframing. Maquettes avec Figma et Illustrator.",
    },
    {
        title: "Artiste 3D",
        start: "2019-09-01",
        end: "2021-08-31",
        description:
            "Animations et modèles 3D : Cinema 4D, Substance Painter, Blender, Blockbench.",
    },
    {
        title: "Développeur Web Junior",
        start: "2016-09-01",
        end: "2018-08-31",
        description: "Premiers projets en JavaScript, CSS, HTML, Python et Scratch.",
    },
];

// Title and school as written on the CV, by short name in parcours.ts
const formationLabels: Record<string, { title: string; school: string }> = {
    "Bachelor CDA": {
        title: "Bachelor Concepteur Développeur d’Applications",
        school: "IPSSI, Saint-Quentin-en-Yvelines",
    },
    "BTS SIO SLAM": { title: "BTS SIO option SLAM", school: "Ensitech, Montigny-le-Bretonneux" },
};

const formations: CvFormation[] = parcours
    .filter((entry) => formationLabels[entry.short])
    .map((entry) => ({
        ...formationLabels[entry.short],
        start: entry.start,
        end: entry.end,
        status: entry.status,
    }));

const techItems = techCategories.flatMap((category) => category.items);

const formats = techCategories.find((c) => c.name === "Formats")?.items.map((i) => i.name) ?? [];

// Eleven logos and the "Voir tout" tile fill two rows of six, a twelfth adds a printed row
const logos = favoriteTechs.filter((name) => !formats.includes(name));

/**
 * Lists the technologies of a category of the /tech page, minus those shown as logos.
 *
 * @param name - Category name in technologies.ts
 * @param order - Names to put first, in this order (the others follow in the /tech order)
 * @returns Names of the category without the logo ones, empty when the category does not exist
 */
function chipsOf(name: string, order: string[] = []): string[] {
    const category = techCategories.find((c) => c.name === name);
    const rank = (n: string) => (order.includes(n) ? order.indexOf(n) : order.length);

    return (category?.items ?? [])
        .map((item) => item.name)
        .filter((n) => !logos.includes(n))
        .sort((a, b) => rank(a) - rank(b));
}

// A print order, as the /tech order wraps one more line and no longer fits the A4 page
const frameworkOrder = [
    "React",
    "Vue.js",
    "Tailwind CSS",
    "Bootstrap",
    "Vite.js",
    "Flutter",
    "React Native",
    "Vuetify",
    "VitePress",
    "jQuery",
];

const designTools = ["Figma", "Illustrator"];

// Dates, statuses and skill lists come from the site data, so the CV cannot drift from it
export const cv = {
    name: "Sylvain Lambert",
    title: "Développeur Web Full-Stack",
    site: "sylvain.sh",
    email: profile.links.email,
    linkedin: profile.links.linkedin,
    licence: "Permis B",
    summary: `Développeur depuis ${profile.experience.backend}, à la croisée du code et du design : du wireframe à l’API REST, je conçois des produits web et mobiles.`,
    experiences,
    formations,
    skills: {
        logos: logos.map((name) => ({
            name,
            icon:
                techItems.find((item) => item.name === name)?.icon ??
                `/icons/tech/${name.toLowerCase()}.svg`,
        })) satisfies CvSkill[],
        more: techItems.filter((item) => !logos.includes(item.name)).length,
        chips: [
            [
                { label: "Langages", items: chipsOf("Langages") },
                {
                    label: "Design",
                    items: [
                        "UX / UI",
                        "Wireframing",
                        "SEO",
                        "Blender",
                        ...designTools.filter((tool) => !logos.includes(tool)),
                    ],
                },
            ],
            [
                { label: "Frameworks", items: chipsOf("Frameworks", frameworkOrder) },
                { label: "Bases de données", items: chipsOf("Bases de données") },
            ],
        ],
    },
    languages: "Français, anglais, espagnol",
};

// Short name only: the full name stays on the sheet
export const cvTitle = `CV - ${profile.name} - ${cv.title}`;
