import * as z from "zod";

export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

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

export type Category = z.infer<typeof categorySchema>;
