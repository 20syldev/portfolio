import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import checkFile from "eslint-plugin-check-file";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
    // Next.js
    ...nextVitals,
    ...nextTs,

    // Scripts
    { files: ["scripts/**/*.ts"] },

    // Main
    {
        plugins: {
            "check-file": checkFile,
            import: importPlugin,
        },
        rules: {
            // Formatting (handled by Prettier, keep only what Prettier doesn't cover)
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],

            // Files
            "check-file/filename-naming-convention": [
                "error",
                { "src/{components,hooks,lib,data}/**/*.{ts,tsx}": "KEBAB_CASE" },
                { ignoreMiddleExtensions: true },
            ],

            // Imports
            "import/order": [
                "error",
                {
                    alphabetize: { order: "asc", caseInsensitive: true },
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    pathGroups: [{ pattern: "@/**", group: "internal" }],
                    pathGroupsExcludedImportTypes: ["builtin"],
                },
            ],
            "sort-imports": ["error", { ignoreCase: true, ignoreDeclarationSort: true }],

            // React
            "react/no-unescaped-entities": "off",
            "react-hooks/set-state-in-effect": "off",

            // Next.js
            "@next/next/no-img-element": "off",
        },
    },

    // Ignores
    globalIgnores(["public/v1/**"]),

    // Prettier (must be last to override formatting rules)
    prettier,
]);

export default eslintConfig;