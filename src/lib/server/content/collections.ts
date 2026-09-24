import * as z from "zod";
import { optional } from "./fields";
import { ContentError, type Entry } from "./load";
import type { Category, Taxonomy } from "$lib/content/types";

/* ------------------------------- Taxonomies ------------------------------- */

export const taxonomySchema = z.object({
  title: z.string().trim().min(1),
  order: z.number().int(),
});

export function buildTaxonomy(
  entries: Entry<typeof taxonomySchema>[],
  alphabetical: boolean,
): Taxonomy[] {
  const sorted = alphabetical
    ? entries.toSorted((a, b) => a.title.localeCompare(b.title, "en"))
    : entries.toSorted((a, b) => a.order - b.order);

  return sorted.map(({ slug, title }) => ({ slug, title }));
}

/* ------------------------------- Categories ------------------------------- */

export const categorySchema = taxonomySchema.extend({
  parent: optional(z.string()),
});

type CategoryEntry = Entry<typeof categorySchema>;

export function validateCategories(entries: CategoryEntry[]): void {
  const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
  const problems: string[] = [];

  for (const { slug, parent } of entries) {
    if (!parent) {
      continue;
    }

    const parentEntry = bySlug.get(parent);

    if (!parentEntry) {
      problems.push(`Category "${slug}": unknown parent "${parent}"`);
    } else if (parentEntry.parent !== null) {
      problems.push(`Category "${slug}": parent "${parent}" is a sub-category`);
    }
  }

  if (problems.length > 0) {
    throw new ContentError(problems);
  }
}

export function buildCategories(entries: CategoryEntry[]): Category[] {
  const sorted = entries.toSorted((a, b) => a.order - b.order);

  return sorted
    .filter((entry) => entry.parent === null)
    .map(({ slug, title }) => ({
      slug,
      title,
      children: sorted
        .filter((child) => child.parent === slug)
        .map((child) => ({ slug: child.slug, title: child.title })),
    }));
}
