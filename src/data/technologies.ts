// Icons requiring a CSS invert filter in dark mode
export const darkInvertIcons = [
    "Rust",
    "Bash",
    "Next.js",
    "Fastify",
    "VitePress",
    "GitHub",
    "Adobe",
    "Cinema 4D",
    "Markdown",
];

// Icons requiring a hue rotation filter in dark mode
export const darkInvertHueIcons = ["YAML", "Lua", "TOML"];

// Favorites of the moment: they get a golden tooltip and a burst of confetti on hover
export const favoriteTechs = [
    "TypeScript",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "SQLite",
    "PostgreSQL",
    "VS Code",
    "Vim",
    "Git",
    "JSON",
    "Linux",
    "npm",
];

/**
 * Tells whether a technology is one of the favorites of the moment.
 *
 * @param name - Technology name, as written in the tech categories
 * @returns True if the technology is a favorite
 */
export function isFavoriteTech(name: string): boolean {
    return favoriteTechs.includes(name);
}

/**
 * Spells out the symbols of a technology name so that its accessible name stays unique.
 * Screen readers and audits drop punctuation, which would make "C", "C++" and "C#" identical.
 *
 * @param name - Technology name, as written in the tech categories
 * @returns The name with "+" read as "plus" and "#" as "sharp"
 */
export function spokenName(name: string): string {
    return name.replace(/\+/g, " plus").replace(/#/g, " sharp");
}

// Categorized tech stack displayed on the /technologies page
export const techCategories = [
    {
        name: "Langages",
        items: [
            {
                name: "TypeScript",
                icon: "/icons/tech/typescript.svg",
                url: "https://www.typescriptlang.org",
            },
            {
                name: "JavaScript",
                icon: "/icons/tech/javascript.svg",
                url: "https://developer.mozilla.org/docs/Web/JavaScript",
            },
            {
                name: "HTML",
                icon: "/icons/tech/html.svg",
                url: "https://developer.mozilla.org/docs/Web/HTML",
            },
            {
                name: "CSS",
                icon: "/icons/tech/css.svg",
                url: "https://developer.mozilla.org/docs/Web/CSS",
            },
            { name: "Go", icon: "/icons/tech/go.svg", url: "https://go.dev" },
            {
                name: "Bash",
                icon: "/icons/tech/bash.svg",
                url: "https://www.gnu.org/software/bash",
            },
            { name: "Python", icon: "/icons/tech/python.svg", url: "https://www.python.org" },
            { name: "PHP", icon: "/icons/tech/php.svg", url: "https://www.php.net" },
            { name: "Java", icon: "/icons/tech/java.svg", url: "https://www.java.com" },
            {
                name: "C#",
                icon: "/icons/tech/csharp.svg",
                url: "https://dotnet.microsoft.com/languages/csharp",
            },
            { name: "C", icon: "/icons/tech/c.svg", url: "https://en.cppreference.com/w/c" },
            { name: "C++", icon: "/icons/tech/cplusplus.svg", url: "https://isocpp.org" },
            { name: "Rust", icon: "/icons/tech/rust.svg", url: "https://www.rust-lang.org" },
            { name: "Dart", icon: "/icons/tech/dart.svg", url: "https://dart.dev" },
            { name: "Kotlin", icon: "/icons/tech/kotlin.svg", url: "https://kotlinlang.org" },
            { name: "Swift", icon: "/icons/tech/swift.svg", url: "https://www.swift.org" },
            { name: "Ruby", icon: "/icons/tech/ruby.svg", url: "https://www.ruby-lang.org" },
            { name: "Perl", icon: "/icons/tech/perl.svg", url: "https://www.perl.org" },
            { name: "Lua", icon: "/icons/tech/lua.svg", url: "https://www.lua.org" },
        ],
    },
    {
        name: "Frameworks",
        items: [
            { name: "Next.js", icon: "/icons/tech/nextjs.svg", url: "https://nextjs.org" },
            { name: "React", icon: "/icons/tech/react.svg", url: "https://react.dev" },
            { name: "Node.js", icon: "/icons/tech/nodejs.svg", url: "https://nodejs.org" },
            { name: "Fastify", icon: "/icons/tech/fastify.svg", url: "https://fastify.dev" },
            {
                name: "Tailwind CSS",
                icon: "/icons/tech/tailwindcss.svg",
                url: "https://tailwindcss.com",
            },
            { name: "Vue.js", icon: "/icons/tech/vuejs.svg", url: "https://vuejs.org" },
            { name: "Vite.js", icon: "/icons/tech/vitejs.svg", url: "https://vitejs.dev" },
            { name: "Vuetify", icon: "/icons/tech/vuetify.svg", url: "https://vuetifyjs.com" },
            { name: "Flutter", icon: "/icons/tech/flutter.svg", url: "https://flutter.dev" },
            { name: "VitePress", icon: "/icons/tech/vitepress.svg", url: "https://vitepress.dev" },
            {
                name: "Bootstrap",
                icon: "/icons/tech/bootstrap.svg",
                url: "https://getbootstrap.com",
            },
            { name: "jQuery", icon: "/icons/tech/jquery.svg", url: "https://jquery.com" },
        ],
    },
    {
        name: "DevOps & Infra",
        items: [
            { name: "Git", icon: "/icons/tech/git.svg", url: "https://git-scm.com" },
            { name: "GitHub", icon: "/icons/tech/github.svg", url: "https://github.com" },
            { name: "Docker", icon: "/icons/tech/docker.svg", url: "https://www.docker.com" },
            { name: "Nginx", icon: "/icons/tech/nginx.svg", url: "https://nginx.org" },
            { name: "Apache", icon: "/icons/tech/apache.svg", url: "https://httpd.apache.org" },
            { name: "HAProxy", icon: "/icons/tech/haproxy.svg", url: "https://www.haproxy.org" },
            {
                name: "Kibana",
                icon: "/icons/tech/kibana.svg",
                url: "https://www.elastic.co/kibana",
            },
        ],
    },
    {
        name: "Outils & IDE",
        items: [
            {
                name: "VS Code",
                icon: "/icons/tech/vscode.svg",
                url: "https://code.visualstudio.com",
            },
            { name: "Vim", icon: "/icons/tech/vim.svg", url: "https://www.vim.org" },
            { name: "npm", icon: "/icons/tech/npm.svg", url: "https://www.npmjs.com" },
            { name: "tmux", icon: "/icons/tech/tmux.svg", url: "https://github.com/tmux/tmux" },
            { name: "Nodemon", icon: "/icons/tech/nodemon.svg", url: "https://nodemon.io" },
            { name: "PostCSS", icon: "/icons/tech/postcss.svg", url: "https://postcss.org" },
            {
                name: "Android Studio",
                icon: "/icons/tech/androidstudio.svg",
                url: "https://developer.android.com/studio",
            },
        ],
    },
    {
        name: "Formats",
        items: [
            { name: "JSON", icon: "/icons/tech/json.svg", url: "https://www.json.org" },
            {
                name: "Markdown",
                icon: "/icons/tech/markdown.svg",
                url: "https://www.markdownguide.org",
            },
            { name: "YAML", icon: "/icons/tech/yaml.svg", url: "https://yaml.org" },
            { name: "TOML", icon: "/icons/tech/toml.svg", url: "https://toml.io" },
        ],
    },
    {
        name: "Design & 3D",
        items: [
            { name: "Figma", icon: "/icons/tech/figma.svg", url: "https://www.figma.com" },
            { name: "Blender", icon: "/icons/tech/blender.svg", url: "https://www.blender.org" },
            { name: "Adobe", icon: "/icons/tech/adobe.svg", url: "https://www.adobe.com" },
            { name: "Godot", icon: "/icons/tech/godot.svg", url: "https://godotengine.org" },
            {
                name: "Cinema 4D",
                icon: "/icons/tech/cinema4d.svg",
                url: "https://www.maxon.net/cinema-4d",
            },
        ],
    },
    {
        name: "Bases de données",
        items: [
            {
                name: "PostgreSQL",
                icon: "/icons/tech/postgresql.svg",
                url: "https://www.postgresql.org",
            },
            { name: "SQLite", icon: "/icons/tech/sqlite.svg", url: "https://www.sqlite.org" },
            {
                name: "Elasticsearch",
                icon: "/icons/tech/elasticsearch.svg",
                url: "https://www.elastic.co/elasticsearch",
            },
            { name: "MySQL", icon: "/icons/tech/mysql.svg", url: "https://www.mysql.com" },
            { name: "MongoDB", icon: "/icons/tech/mongodb.svg", url: "https://www.mongodb.com" },
            {
                name: "Firebase",
                icon: "/icons/tech/firebase.svg",
                url: "https://firebase.google.com",
            },
        ],
    },
    {
        name: "Systèmes",
        items: [
            { name: "Linux", icon: "/icons/tech/linux.svg", url: "https://www.kernel.org" },
            { name: "Linux Mint", icon: "/icons/tech/linuxmint.svg", url: "https://linuxmint.com" },
            { name: "Fedora", icon: "/icons/tech/fedora.svg", url: "https://fedoraproject.org" },
            {
                name: "Raspberry Pi",
                icon: "/icons/tech/raspberrypi.svg",
                url: "https://www.raspberrypi.org",
            },
            {
                name: "Windows",
                icon: "/icons/tech/windows.svg",
                url: "https://www.microsoft.com/windows",
            },
            { name: "Android", icon: "/icons/tech/android.svg", url: "https://www.android.com" },
        ],
    },
];
