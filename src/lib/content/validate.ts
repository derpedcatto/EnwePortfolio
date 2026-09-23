import type { CategoryEntry } from "./schemas";

export function validateCategories(
  entries: readonly CategoryEntry[],
): string[] {
  const problems: string[] = [];
  const bySlug = new Map(entries.map((c) => [c.slug, c]));

  for (const entry of entries) {
    if (!entry.parent) {
      continue;
    }

    const parent = bySlug.get(entry.parent);

    if (!parent) {
      problems.push(`${entry.slug}: unknown parent "${entry.parent}"`);
    } else if (parent.parent) {
      problems.push(`${entry.slug}: parent "${parent.slug}" is a sub-category`);
    }
  }

  return problems;
}
