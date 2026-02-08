/** Icons that need to be inverted in dark mode (black icons) */
export const darkInvertIcons = [
    "Rust",
    "Bash",
    "Next.js",
    "VitePress",
    "GitHub",
    "Adobe",
    "Cinema 4D",
    "Markdown",
];

/** Icons that need invert + hue-rotate to preserve colors (black + colored) */
export const darkInvertHueIcons = ["YAML"];

/** Technologies organized by category */
export const techCategories = [
    {
        name: "Langages",
        items: [
            { name: "HTML", icon: "/icons/tech/html.svg", url: "https://developer.mozilla.org/docs/Web/HTML" },
            { name: "CSS", icon: "/icons/tech/css.svg", url: "https://developer.mozilla.org/docs/Web/CSS" },
            { name: "JavaScript", icon: "/icons/tech/javascript.svg", url: "https://developer.mozilla.org/docs/Web/JavaScript" },
            { name: "TypeScript", icon: "/icons/tech/typescript.svg", url: "https://www.typescriptlang.org" },
            { name: "PHP", icon: "/icons/tech/php.svg", url: "https://www.php.net" },
            { name: "Python", icon: "/icons/tech/python.svg", url: "https://www.python.org" },
            { name: "Java", icon: "/icons/tech/java.svg", url: "https://www.java.com" },
            { name: "C", icon: "/icons/tech/c.svg", url: "https://en.cppreference.com/w/c" },
            { name: "C++", icon: "/icons/tech/cplusplus.svg", url: "https://isocpp.org" },
            { name: "C#", icon: "/icons/tech/csharp.svg", url: "https://dotnet.microsoft.com/languages/csharp" },
            { name: "Go", icon: "/icons/tech/go.svg", url: "https://go.dev" },
            { name: "Rust", icon: "/icons/tech/rust.svg", url: "https://www.rust-lang.org" },
            { name: "Bash", icon: "/icons/tech/bash.svg", url: "https://www.gnu.org/software/bash" },
            { name: "Ruby", icon: "/icons/tech/ruby.svg", url: "https://www.ruby-lang.org" },
            { name: "Swift", icon: "/icons/tech/swift.svg", url: "https://www.swift.org" },
            { name: "Kotlin", icon: "/icons/tech/kotlin.svg", url: "https://kotlinlang.org" },
            { name: "Dart", icon: "/icons/tech/dart.svg", url: "https://dart.dev" },
            { name: "Perl", icon: "/icons/tech/perl.svg", url: "https://www.perl.org" },
        ],
    },
    {
        name: "Frameworks",
        items: [
            { name: "React", icon: "/icons/tech/react.svg", url: "https://react.dev" },
            { name: "Next.js", icon: "/icons/tech/nextjs.svg", url: "https://nextjs.org" },
            { name: "Node.js", icon: "/icons/tech/nodejs.svg", url: "https://nodejs.org" },
            { name: "Tailwind CSS", icon: "/icons/tech/tailwindcss.svg", url: "https://tailwindcss.com" },
            { name: "Bootstrap", icon: "/icons/tech/bootstrap.svg", url: "https://getbootstrap.com" },
            { name: "Vue.js", icon: "/icons/tech/vuejs.svg", url: "https://vuejs.org" },
            { name: "Flutter", icon: "/icons/tech/flutter.svg", url: "https://flutter.dev" },
            { name: "Vite.js", icon: "/icons/tech/vitejs.svg", url: "https://vitejs.dev" },
            { name: "jQuery", icon: "/icons/tech/jquery.svg", url: "https://jquery.com" },
            { name: "React Native", icon: "/icons/tech/reactnative.svg", url: "https://reactnative.dev" },
            { name: "Vuetify", icon: "/icons/tech/vuetify.svg", url: "https://vuetifyjs.com" },
            { name: "VitePress", icon: "/icons/tech/vitepress.svg", url: "https://vitepress.dev" },
        ],
    },
    {
        name: "Bases de données",
        items: [
            { name: "MongoDB", icon: "/icons/tech/mongodb.svg", url: "https://www.mongodb.com" },
            { name: "PostgreSQL", icon: "/icons/tech/postgresql.svg", url: "https://www.postgresql.org" },
            { name: "MySQL", icon: "/icons/tech/mysql.svg", url: "https://www.mysql.com" },
            { name: "SQLite", icon: "/icons/tech/sqlite.svg", url: "https://www.sqlite.org" },
            { name: "Firebase", icon: "/icons/tech/firebase.svg", url: "https://firebase.google.com" },
            { name: "Elasticsearch", icon: "/icons/tech/elasticsearch.svg", url: "https://www.elastic.co/elasticsearch" },
        ],
    },
    {
        name: "Outils & IDE",
        items: [
            { name: "VS Code", icon: "/icons/tech/vscode.svg", url: "https://code.visualstudio.com" },
            { name: "Vim", icon: "/icons/tech/vim.svg", url: "https://www.vim.org" },
            { name: "Android Studio", icon: "/icons/tech/androidstudio.svg", url: "https://developer.android.com/studio" },
            { name: "npm", icon: "/icons/tech/npm.svg", url: "https://www.npmjs.com" },
            { name: "Nodemon", icon: "/icons/tech/nodemon.svg", url: "https://nodemon.io" },
            { name: "PostCSS", icon: "/icons/tech/postcss.svg", url: "https://postcss.org" },
            { name: "tmux", icon: "/icons/tech/tmux.svg", url: "https://github.com/tmux/tmux" },
        ],
    },
    {
        name: "Formats",
        items: [
            { name: "JSON", icon: "/icons/tech/json.svg", url: "https://www.json.org" },
            { name: "YAML", icon: "/icons/tech/yaml.svg", url: "https://yaml.org" },
            { name: "Markdown", icon: "/icons/tech/markdown.svg", url: "https://www.markdownguide.org" },
        ],
    },
    {
        name: "Systèmes",
        items: [
            { name: "Linux", icon: "/icons/tech/linux.svg", url: "https://www.kernel.org" },
            { name: "Linux Mint", icon: "/icons/tech/linuxmint.svg", url: "https://linuxmint.com" },
            { name: "Fedora", icon: "/icons/tech/fedora.svg", url: "https://fedoraproject.org" },
            { name: "Windows", icon: "/icons/tech/windows.svg", url: "https://www.microsoft.com/windows" },
            { name: "Raspberry Pi", icon: "/icons/tech/raspberrypi.svg", url: "https://www.raspberrypi.org" },
            { name: "Android", icon: "/icons/tech/android.svg", url: "https://www.android.com" },
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
            { name: "Kibana", icon: "/icons/tech/kibana.svg", url: "https://www.elastic.co/kibana" },
        ],
    },
    {
        name: "Design & 3D",
        items: [
            { name: "Godot", icon: "/icons/tech/godot.svg", url: "https://godotengine.org" },
            { name: "Adobe", icon: "/icons/tech/adobe.svg", url: "https://www.adobe.com" },
            { name: "Figma", icon: "/icons/tech/figma.svg", url: "https://www.figma.com" },
            { name: "Blender", icon: "/icons/tech/blender.svg", url: "https://www.blender.org" },
            { name: "Cinema 4D", icon: "/icons/tech/cinema4d.svg", url: "https://www.maxon.net/cinema-4d" },
        ],
    },
];