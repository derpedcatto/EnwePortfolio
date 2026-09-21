import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import prettier from "eslint-config-prettier";
import svelteConfig from "./svelte.config.js";

export default [
  { ignores: [".svelte-kit/", "build/", ".wrangler/"] },

  js.configs.recommended,
  ...svelte.configs.recommended,

  prettier,
  ...svelte.configs.prettier,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: { svelteConfig },
    },
  },
];
