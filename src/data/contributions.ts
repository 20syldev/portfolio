export interface Contribution {
    repo: string;
    title: string;
    pr: string;
    url: string;
    description: string;
    reason: string;
    language: string;
    status: "open" | "closed" | "merged";
}

export const contributions: Contribution[] = [
    {
        repo: "rsyslog/rsyslog",
        title: "add split() function",
        pr: "6384",
        url: "https://github.com/rsyslog/rsyslog/pull/6384",
        description: "Fonction RainerScript pour parser des chaînes délimitées en tableaux JSON",
        reason: "Besoin interne Zenetys pour traiter des logs multi-valeurs dans un pipeline rsyslog",
        language: "C",
        status: "merged",
    },
    {
        repo: "rsyslog/rsyslog",
        title: "add append_json() function",
        pr: "6385",
        url: "https://github.com/rsyslog/rsyslog/pull/6385",
        description: "Fonction RainerScript pour construire dynamiquement des structures JSON",
        reason: "Besoin interne Zenetys pour enrichir des messages syslog avec des métadonnées JSON",
        language: "C",
        status: "merged",
    },
    {
        repo: "wazuh/wazuh",
        title: "Include source IP in wazuh-remoted log messages",
        pr: "35358",
        url: "https://github.com/wazuh/wazuh/pull/35358",
        description: "Ajout de l'IP source dans les messages de warning de wazuh-remoted",
        reason: "Faciliter l'investigation des problèmes de connexion en identifiant la source directement dans les logs",
        language: "C",
        status: "merged",
    },
    {
        repo: "wazuh/wazuh-dashboard-plugins",
        title: "Remove toLowerCase on level to fix crash and key mismatch",
        pr: "8287",
        url: "https://github.com/wazuh/wazuh-dashboard-plugins/pull/8287",
        description:
            "Suppression de .toLowerCase() sur errorLog.level dans ErrorOrchestratorBase.storeError()",
        reason: ".toLowerCase() sur une valeur undefined causait un TypeError, et la conversion empêchait la correspondance avec les clés uppercase de winstonLevelDict",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "wazuh/wazuh-dashboard-plugins",
        title: "Show dash for epoch-zero registration date",
        pr: "8288",
        url: "https://github.com/wazuh/wazuh-dashboard-plugins/pull/8288",
        description:
            "Affichage d'un tiret au lieu de la date epoch (1970-01-01) dans la colonne Registration date du tableau des agents",
        reason: "Les agents non enregistrés via authd ont dateAdd à l'epoch zéro, une valeur sentinelle affichée à tort comme une vraie date",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "ChromeDevTools/chrome-devtools-mcp",
        title: "fix: skip frozen/discarded targets in page enumeration",
        pr: "1841",
        url: "https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/1841",
        description:
            "Remplacement de browser.pages() par une itération par-target avec try/catch pour résister aux onglets gelés",
        reason: "Les onglets en arrière-plan frozen/discardés par Chrome ne répondent pas aux commandes CDP et faisaient planter l'énumération entière",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "vercel/next.js",
        title: "Resolve ESM-only plugins passed as strings",
        pr: "92576",
        url: "https://github.com/vercel/next.js/pull/92576",
        description:
            "Fallback vers import() quand require.resolve() échoue avec ERR_PACKAGE_PATH_NOT_EXPORTED dans @next/mdx",
        reason: 'Les packages ESM-only sans condition "require" dans leurs exports échouaient lors du chargement de plugins MDX passés en string',
        language: "JavaScript",
        status: "open",
    },
    {
        repo: "vercel/next-devtools-mcp",
        title: "Close MCP transport gracefully on shutdown",
        pr: "131",
        url: "https://github.com/vercel/next-devtools-mcp/pull/131",
        description:
            "Fermeture propre du transport MCP via await server.close() avant process.exit(), suppression des handlers SIGTERM dupliqués",
        reason: "L'arrêt abrupt du transport causait un faux message d'erreur dans l'hôte MCP à chaque fin de session",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "antfu/nuxt-mcp-dev",
        title: "Use project directory name as MCP server name in monorepos",
        pr: "43",
        url: "https://github.com/antfu/nuxt-mcp-dev/pull/43",
        description:
            "Dérivation du nom du serveur MCP depuis basename(rootDir) au lieu de la valeur hardcodée 'nuxt'",
        reason: 'Dans un monorepo, toutes les apps écrasaient la même clé "nuxt" dans les configs MCP, ne laissant qu\'un seul serveur enregistré',
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "drawdb-io/drawdb",
        title: "fix: correct typo 'realtionship' in meta description",
        pr: "997",
        url: "https://github.com/drawdb-io/drawdb/pull/997",
        description: "Correction de la faute de frappe 'realtionship' dans la meta description",
        reason: "Typo dans le contenu SEO visible dans les aperçus de liens et résultats de recherche",
        language: "TypeScript",
        status: "merged",
    },
    {
        repo: "drawdb-io/drawdb",
        title: "fix: suppress redundant UNIQUE on primary key fields in SQL exports",
        pr: "998",
        url: "https://github.com/drawdb-io/drawdb/pull/998",
        description:
            "Suppression des contraintes UNIQUE redondantes sur les champs clés primaires dans les exports SQL",
        reason: "Une clé primaire est déjà unique par définition — les dupliquer dans le DDL généré causait des erreurs sur certains SGBD",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "drawdb-io/drawdb",
        title: "fix: offset new elements to prevent overlap at same position",
        pr: "999",
        url: "https://github.com/drawdb-io/drawdb/pull/999",
        description:
            "Décalage automatique des nouveaux éléments ajoutés au même emplacement pour éviter les chevauchements",
        reason: "Créer plusieurs tables sans déplacer les précédentes les empilait exactement au même point, rendant les éléments inaccessibles",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "drawdb-io/drawdb",
        title: "fix: align Markdown export table columns with consistent padding",
        pr: "1000",
        url: "https://github.com/drawdb-io/drawdb/pull/1000",
        description: "Alignement des colonnes dans les exports Markdown avec un padding uniforme",
        reason: "Les tables exportées en Markdown avaient des colonnes mal alignées selon la largeur du contenu",
        language: "TypeScript",
        status: "merged",
    },
    {
        repo: "drawdb-io/drawdb",
        title: "fix: correct FK direction when dragging from parent to child table",
        pr: "1001",
        url: "https://github.com/drawdb-io/drawdb/pull/1001",
        description:
            "Correction du sens de la clé étrangère lors d'un drag de la table parente vers l'enfant",
        reason: "La direction de la FK était inversée — créer une relation en partant de la table parente produisait une FK dans le mauvais sens",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "drawdb-io/drawdb",
        title: "fix: add missing pipe delimiters in Markdown table rows",
        pr: "1002",
        url: "https://github.com/drawdb-io/drawdb/pull/1002",
        description:
            "Correction d'une régression introduite par #1000 — les lignes suivantes à la première n'avaient plus le délimiteur `|` de tête dans les exports Markdown",
        reason: "Les tables Markdown exportées étaient malformées dès la deuxième ligne de données, cassant le rendu dans tous les viewers Markdown",
        language: "TypeScript",
        status: "merged",
    },
    {
        repo: "AutoDarkMode/Windows-Auto-Night-Mode",
        title: "Add PowerToys Light Switch conflict warning",
        pr: "1218",
        url: "https://github.com/AutoDarkMode/Windows-Auto-Night-Mode/pull/1218",
        description:
            "Détection du conflit avec PowerToys Light Switch — affiche une InfoBar d'avertissement dans les Settings si le service PowerToys.LightSwitchService est actif",
        reason: "Les deux services se conflictent lors du changement automatique de thème, sans aucun avertissement pour l'utilisateur (issue #1120)",
        language: "C#",
        status: "merged",
    },
    {
        repo: "phare/sloggo",
        title: "fix(live): restore polling when no new logs are available",
        pr: "14",
        url: "https://github.com/phare/sloggo/pull/14",
        description:
            "Correction du polling live qui s'arrêtait définitivement après le premier intervalle sans nouveaux logs",
        reason: "getPreviousPageParam retournait null sur un résultat vide, marquant hasPreviousPage à false et rendant les appels fetchPreviousPage() inopérants",
        language: "TypeScript",
        status: "open",
    },
    {
        repo: "mintlify/components",
        title: "fix(accordion): remove unintended clipboard copy on open",
        pr: "234",
        url: "https://github.com/mintlify/components/pull/234",
        description:
            "Suppression de la copie silencieuse de l'URL dans le presse-papiers à chaque ouverture/fermeture d'un accordion",
        reason: "copyToClipboard(newUrl) écrasait le presse-papiers de l'utilisateur à son insu — le deep-link par hash fonctionne déjà via replaceState",
        language: "TypeScript",
        status: "merged",
    },
    {
        repo: "mintlify/components",
        title: "fix(code-group): add TOML language preset to fix missing icon",
        pr: "235",
        url: "https://github.com/mintlify/components/pull/235",
        description:
            "Ajout du preset TOML dans SNIPPET_PRESETS pour corriger l'icône manquante dans CodeGroup",
        reason: "L'absence d'entrée toml dans les presets faisait fallback sur l'icône YAML au lieu de TOML",
        language: "TypeScript",
        status: "merged",
    },
];