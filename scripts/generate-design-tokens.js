import { mkdir, writeFile } from "node:fs/promises";

import {
  customMediaCss,
  rootCss,
  GENERATED_COMMENT,
} from "./design-tokens-css.js";

const CSS_DIR = "src/styles";
const TOKENS_FILE = `${CSS_DIR}/tokens.css`;
const MEDIA_FILE = `${CSS_DIR}/media.css`;

await mkdir(CSS_DIR, { recursive: true });

await writeFile(TOKENS_FILE, GENERATED_COMMENT + rootCss());

const media = customMediaCss();
if (media) {
  await writeFile(MEDIA_FILE, GENERATED_COMMENT + media);
}
