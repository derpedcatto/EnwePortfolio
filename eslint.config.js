import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import prettier from "eslint-config-prettier";
import svelteConfig from "./svelte.config.js";

export default [
  { ignores: [".svelte-kit/", ".wrangler/"] },

  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,

  prettier,
  ...svelte.configs.prettier,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: { parser: ts.parser, svelteConfig },
    },
  },
];
