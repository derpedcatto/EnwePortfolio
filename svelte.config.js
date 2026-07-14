import adapter from "@sveltejs/adapter-cloudflare";
import { mdsvex } from "mdsvex";
import remarkGfm from "remark-gfm";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx"],
  compilerOptions: {
    runes: ({ filename }) =>
      filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
  },
  preprocess: mdsvex({
    remarkPlugins: [remarkGfm],
  }),
  kit: {
    adapter: adapter(),
  },
};

export default config;
