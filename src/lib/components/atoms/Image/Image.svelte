<script>
  // Responsive image backed by the wsrv.nl CDN.
  // Emits <picture> with AVIF + WebP srcsets (browser picks the best format
  // and the right size for its viewport/DPR) and an inline thumbhash blur-up
  // placeholder while the real image loads.
  import { buildWsrvUrl, buildWsrvSrcset } from './wsrv.js';
  import { thumbHashToDataURL } from 'thumbhash';

  let {
    src,
    alt = '',
    widths = [400, 800, 1200, 1600, 2000],
    sizes = '100vw',
    quality = 80,
    // { hash, width, height } entry from generated/placeholders.json —
    // hash drives the blur-up, width/height reserve space (no layout shift)
    placeholder = undefined,
    loading = 'lazy',
    fetchpriority = undefined,
    width = undefined,
    height = undefined,
    class: className = '',
    style = '',
  } = $props();

  const avifSrcset = $derived(buildWsrvSrcset(src, widths, { format: 'avif', quality }));
  const webpSrcset = $derived(buildWsrvSrcset(src, widths, { format: 'webp', quality }));
  const fallbackSrc = $derived(
    buildWsrvUrl(src, { width: widths[widths.length - 1], format: 'webp', quality })
  );

  const blur = $derived.by(() => {
    if (!placeholder?.hash) return undefined;
    try {
      return thumbHashToDataURL(Uint8Array.from(atob(placeholder.hash), (c) => c.charCodeAt(0)));
    } catch {
      return undefined;
    }
  });

  // Explicit props win; otherwise fall back to the intrinsic dimensions
  // captured at generation time so the browser can reserve the right space.
  const imgWidth = $derived(width ?? placeholder?.width);
  const imgHeight = $derived(height ?? placeholder?.height);
</script>

<picture>
  <source type="image/avif" srcset={avifSrcset} {sizes} />
  <source type="image/webp" srcset={webpSrcset} {sizes} />
  <img
    src={fallbackSrc}
    {alt}
    {loading}
    {fetchpriority}
    width={imgWidth}
    height={imgHeight}
    decoding="async"
    class={className}
    style="{blur
      ? `background-image:url(${blur});background-size:cover;background-repeat:no-repeat;`
      : ''}{style}"
  />
</picture>
