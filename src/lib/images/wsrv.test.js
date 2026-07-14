import { describe, it, expect } from 'vitest';
import { buildWsrvUrl, buildWsrvSrcset } from './wsrv.js';

const SRC = 'https://media.example.com/projects/sword/hero.webp';

describe('buildWsrvUrl', () => {
  it('points at the wsrv.nl endpoint and passes the source as the url param', () => {
    const u = new URL(buildWsrvUrl(SRC, { width: 800 }));
    expect(u.origin + u.pathname).toBe('https://wsrv.nl/');
    expect(u.searchParams.get('url')).toBe(SRC);
  });

  it('maps width, format and quality to wsrv params', () => {
    const u = new URL(buildWsrvUrl(SRC, { width: 800, format: 'avif', quality: 70 }));
    expect(u.searchParams.get('w')).toBe('800');
    expect(u.searchParams.get('output')).toBe('avif');
    expect(u.searchParams.get('q')).toBe('70');
  });

  it('never upscales past the source (without-enlargement flag)', () => {
    const u = new URL(buildWsrvUrl(SRC, { width: 800 }));
    expect(u.searchParams.has('we')).toBe(true);
  });

  it('omits params that were not provided', () => {
    const u = new URL(buildWsrvUrl(SRC, { width: 800 }));
    expect(u.searchParams.has('h')).toBe(false);
    expect(u.searchParams.has('output')).toBe(false);
    expect(u.searchParams.has('q')).toBe(false);
  });

  it('throws when no source url is given', () => {
    expect(() => buildWsrvUrl('', { width: 800 })).toThrow();
  });
});

describe('buildWsrvSrcset', () => {
  it('produces one "<url> <width>w" candidate per requested width', () => {
    const set = buildWsrvSrcset(SRC, [400, 800], { format: 'webp', quality: 80 });
    const parts = set.split(', ');
    expect(parts).toHaveLength(2);
    expect(parts[0]).toMatch(/ 400w$/);
    expect(parts[1]).toMatch(/ 800w$/);

    const first = new URL(parts[0].split(' ')[0]);
    expect(first.searchParams.get('w')).toBe('400');
    expect(first.searchParams.get('output')).toBe('webp');
  });
});
