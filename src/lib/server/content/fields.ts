import * as z from "zod";
import { micromark } from "micromark";

const SITE = new URL("https://annayaroshevych.com");

const bareHost = (url: URL) => url.host.replace(/^www\./, "");

const isExternalLink = (href: string) => {
  try {
    const url = new URL(href, SITE);
    return /^https?:$/.test(url.protocol) && bareHost(url) !== bareHost(SITE);
  } catch {
    return false;
  }
};

/**
 * For Sveltia fields with `required: false`. `''` or `undefined` fields become `null`.
 */
export const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    schema.nullable(),
  );

export const richtext = z.string().transform((markdown) =>
  micromark(markdown)
    // Replace Sveltia line break (\n) with <br>
    .replace(/<p>[\s\S]*?<\/p>/g, (p) =>
      p.replace(/(?<!<br \/>)\n/g, "<br />\n"),
    )

    // Change H1 to H2 and H4-H6 to H3
    .replace(
      /<(\/?)h([1-6])>/g,
      (_, s, n) => `<${s}h${Math.min(Math.max(+n, 2), 3)}>`,
    )

    // Open external links in a new tab
    .replace(/<a href="([^"]*)"/g, (tag, href: string) =>
      isExternalLink(href)
        ? `${tag} target="_blank" rel="noopener noreferrer"`
        : tag,
    ),
);
