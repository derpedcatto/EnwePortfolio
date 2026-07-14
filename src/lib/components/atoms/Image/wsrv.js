// Builds URLs for the free wsrv.nl image CDN (https://wsrv.nl/docs/).
// It fetches our R2 master image, resizes/re-encodes it on the fly and
// caches the result at Cloudflare's edge — so we store ONE master per
// image and let the browser request the right size/format per device.

const WSRV_ENDPOINT = 'https://wsrv.nl/';

/**
 * @param {string} src - Public URL of the source (master) image, e.g. the R2 asset URL.
 * @param {object} [options]
 * @param {number} [options.width]   Target width in px (wsrv `w`).
 * @param {number} [options.height]  Target height in px (wsrv `h`).
 * @param {number} [options.quality] Output quality 1-100 (wsrv `q`).
 * @param {string} [options.format]  Output format, e.g. 'webp' | 'avif' (wsrv `output`).
 * @param {string} [options.fit]     Resize behaviour, e.g. 'cover' | 'contain' (wsrv `fit`).
 * @param {number} [options.dpr]     Device pixel ratio multiplier (wsrv `dpr`).
 * @returns {string} A wsrv.nl URL.
 */
export function buildWsrvUrl(src, { width, height, quality, format, fit, dpr } = {}) {
  if (!src) throw new Error('buildWsrvUrl: a source url is required');

  const params = new URLSearchParams();
  params.set('url', src);
  if (width != null) params.set('w', String(width));
  if (height != null) params.set('h', String(height));
  if (format) params.set('output', format);
  if (quality != null) params.set('q', String(quality));
  if (fit) params.set('fit', fit);
  if (dpr != null) params.set('dpr', String(dpr));
  params.set('we', ''); // never enlarge beyond the master's intrinsic size

  return `${WSRV_ENDPOINT}?${params.toString()}`;
}

/**
 * Builds a responsive `srcset` string across the given widths.
 * @param {string} src
 * @param {number[]} widths
 * @param {object} [options] - Same shape as buildWsrvUrl options (minus width).
 * @returns {string}
 */
export function buildWsrvSrcset(src, widths, options = {}) {
  return widths
    .map((width) => `${buildWsrvUrl(src, { ...options, width })} ${width}w`)
    .join(', ');
}
