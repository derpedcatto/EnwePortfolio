// Decides which image refs need fetching for thumbhash generation and which
// can be reused from the previous run's output. Keeps `npm run dev` fast and
// offline-friendly: only new/unseen images hit the network. CI starts with no
// previous output, so deploy builds always regenerate everything.

/**
 * @param {string[]} refs - Image refs currently referenced by content.
 * @param {Record<string, {hash: string, width: number, height: number}>} [previous]
 *   - Parsed placeholders.json from the last run, if it exists.
 * @param {boolean} force - When true, ignore previous output and refetch all.
 * @returns {{reused: Record<string, object>, toFetch: string[]}}
 */
export function planPlaceholderWork(refs, previous, force) {
  if (force || !previous) return { reused: {}, toFetch: [...refs] };

  const reused = {};
  const toFetch = [];
  for (const ref of refs) {
    if (ref in previous) reused[ref] = previous[ref];
    else toFetch.push(ref);
  }
  return { reused, toFetch };
}
