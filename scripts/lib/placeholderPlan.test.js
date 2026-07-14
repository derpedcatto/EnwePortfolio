import { describe, it, expect } from 'vitest';
import { planPlaceholderWork } from './placeholderPlan.js';

const PREV = {
  'projects/sword/hero.webp': { hash: 'aaa', width: 2560, height: 1440 },
  'projects/orc/bust.webp': { hash: 'bbb', width: 2000, height: 2000 },
};

describe('planPlaceholderWork', () => {
  it('reuses previous entries and only fetches unseen refs', () => {
    const { reused, toFetch } = planPlaceholderWork(
      ['projects/sword/hero.webp', 'projects/new/thing.webp'],
      PREV,
      false
    );
    expect(reused).toEqual({
      'projects/sword/hero.webp': { hash: 'aaa', width: 2560, height: 1440 },
    });
    expect(toFetch).toEqual(['projects/new/thing.webp']);
  });

  it('drops previous entries whose refs are no longer referenced', () => {
    const { reused } = planPlaceholderWork(['projects/orc/bust.webp'], PREV, false);
    expect(Object.keys(reused)).toEqual(['projects/orc/bust.webp']);
  });

  it('refetches everything when force is set', () => {
    const { reused, toFetch } = planPlaceholderWork(
      ['projects/sword/hero.webp', 'projects/orc/bust.webp'],
      PREV,
      true
    );
    expect(reused).toEqual({});
    expect(toFetch).toEqual(['projects/sword/hero.webp', 'projects/orc/bust.webp']);
  });

  it('treats a missing previous output as fetch-everything', () => {
    const { reused, toFetch } = planPlaceholderWork(['a.webp'], undefined, false);
    expect(reused).toEqual({});
    expect(toFetch).toEqual(['a.webp']);
  });
});
