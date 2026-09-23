import * as z from "zod";
import { micromark } from "micromark";

export const slug = z.string().regex(/^[a-z0-9_~]+(?:-[a-z0-9_~]+)*$/);
export const richtext = z.string().transform((markdown) =>
  micromark(markdown).replace(
    /<a href="(https?:\/\/[^"]*)"/g, // external link
    '<a href="$1" target="_blank" rel="noopener noreferrer"',
  ),
);

export const categorySchema = z.object({
  slug,
  title: z.string().min(1),
  order: z.number().int(),
  parent: z
    .string()
    .nullish()
    .transform((category) => category || null)
    .pipe(slug.nullable()),
});

export const aboutSchema = z.object({
  avatar: z.url().nullish(),
  body: richtext,
});

export type CategoryEntry = z.infer<typeof categorySchema>;
export type About = z.infer<typeof aboutSchema>;
