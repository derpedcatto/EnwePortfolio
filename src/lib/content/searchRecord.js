// Normalises a project's frontmatter into the minimal record shipped to the
// client search index (Fuse.js). Deliberately drops heavy fields like `body`
// so the index stays small to download and fast to search.

/**
 * @param {Record<string, any>} frontmatter - Parsed project frontmatter.
 * @param {Record<string, string>} [tagTitles] - Map of tag slug → display title
 *   (from the tags collection). Frontmatter stores relation slugs; the index
 *   should contain the human-readable titles people actually search for.
 * @returns {{slug: string, title: string, summary: string, category: string, tags: string[], software: string[]}}
 */
export function buildSearchRecord(frontmatter, tagTitles = {}) {
  return {
    slug: frontmatter.slug ?? '',
    title: frontmatter.title ?? '',
    summary: frontmatter.summary ?? '',
    category: frontmatter.category ?? '',
    tags: (frontmatter.tags ?? []).map((slug) => tagTitles[slug] ?? slug),
    software: frontmatter.software ?? [],
  };
}
