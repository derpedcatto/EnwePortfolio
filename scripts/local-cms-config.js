import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = readFileSync("cms/config.yml", "utf8");

mkdirSync("static/cms", { recursive: true });

writeFileSync(
  "static/cms/config.yml",
  src.replace(/(^\s*(?:folder|file):\s*["']?)content\//gm, "$1content-dev/"),
);
