import { describe, it, expect } from 'vitest';
import { buildSearchRecord } from './searchRecord.js';

describe('buildSearchRecord', () => {
  it('keeps only the fields needed for search and cards (drops the body)', () => {
    const record = buildSearchRecord({
      slug: 'medieval-sword',
      title: 'Medieval Sword',
      summary: 'A game-ready sword prop',
      category: 'models',
      tags: ['weapon', 'medieval'],
      software: ['Blender', 'Substance 3D Painter'],
      body: 'a very long body that must not bloat the client search index'
    });

    expect(record).toEqual({
      slug: 'medieval-sword',
      title: 'Medieval Sword',
      summary: 'A game-ready sword prop',
      category: 'models',
      tags: ['weapon', 'medieval'],
      software: ['Blender', 'Substance 3D Painter']
    });
  });

  it('defaults optional collection fields to empty values', () => {
    const record = buildSearchRecord({ slug: 'wip', title: 'WIP' });
    expect(record.summary).toBe('');
    expect(record.category).toBe('');
    expect(record.tags).toEqual([]);
    expect(record.software).toEqual([]);
  });

  it('resolves tag slugs to display titles via the tag map', () => {
    const record = buildSearchRecord(
      { slug: 'sword', title: 'Sword', tags: ['hard-surface', 'weapon'] },
      { 'hard-surface': 'Hard Surface', weapon: 'Weapon' }
    );
    expect(record.tags).toEqual(['Hard Surface', 'Weapon']);
  });

  it('falls back to the raw slug when a tag is missing from the map', () => {
    const record = buildSearchRecord(
      { slug: 'sword', title: 'Sword', tags: ['unknown-tag'] },
      {}
    );
    expect(record.tags).toEqual(['unknown-tag']);
  });
});
