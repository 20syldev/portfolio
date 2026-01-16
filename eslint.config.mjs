import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        files: ["scripts/**/*.ts"],
    },
    {
        rules: {
            "eol-last": "off",
            "no-multiple-empty-lines": [
                "error",
                {
                    "max": 1,
                    "maxEOF": 0
                }
            ],
            "indent": ["error", 4],
            "react-hooks/set-state-in-effect": "off",
            "react/no-unescaped-entities": "off",
            "@next/next/no-img-element": "off"
        },
    },
    globalIgnores(["public/v1/**"]),
]);

export default eslintConfig;