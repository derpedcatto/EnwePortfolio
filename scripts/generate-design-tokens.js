import { mkdir, writeFile } from "fs/promises";
import designTokens from "../src/lib/design-tokens.js";

const CSS_DIR = "src/styles";
const TOKENS_FILE = `${CSS_DIR}/tokens.css`;
const MEDIA_FILE = `${CSS_DIR}/media.css`;
const GENERATED_COMMENT = "/* generated, do not edit */\n\n";

function flattenTokens(obj, prefix = "") {
  const lines = [];

  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${key}` : key;

    if (value !== null && typeof value === "object") {
      lines.push(...flattenTokens(value, name));
    } else {
      lines.push(`--${name}: ${value};`);
    }
  }

  return lines;
}

function rootCss(tokens) {
  return `:root {\n${flattenTokens(tokens).join("\n")}\n}\n`;
}

function customMediaCss(breakpoints) {
  return (
    Object.entries(breakpoints)
      .map(([name, width]) => `@custom-media --${name} (width >= ${width});`)
      .join("\n") + "\n"
  );
}

const { breakpoint, ...cssTokens } = designTokens;

await mkdir(CSS_DIR, { recursive: true });

await writeFile(TOKENS_FILE, GENERATED_COMMENT + rootCss(cssTokens));

if (breakpoint) {
  await writeFile(MEDIA_FILE, GENERATED_COMMENT + customMediaCss(breakpoint));
}
