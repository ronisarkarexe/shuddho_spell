import { describe, expect, it } from 'vitest';
import { usdToBdt } from '../../domain/usd-to-bdt';
import { StaticUniversityCatalog } from '../static-university-catalog';
import { US_UNIVERSITY_SEEDS } from './us-universities';

describe('US university seeds', () => {
  it('holds the hundred named universities, each with a stable slug', () => {
    const slugs = US_UNIVERSITY_SEEDS.map((seed) => seed.slug);

    expect(US_UNIVERSITY_SEEDS).toHaveLength(100);
    expect(new Set(slugs).size).toBe(100);
    expect(new Set(US_UNIVERSITY_SEEDS.map((seed) => seed.name)).size).toBe(100);
  });

  it('points every row at an official https site', () => {
    for (const seed of US_UNIVERSITY_SEEDS) {
      expect(seed.website.startsWith('https://')).toBe(true);
      expect(seed.stateCode).toHaveLength(2);
    }
  });
});

describe('StaticUniversityCatalog', () => {
  it('expands the US list and leaves the other destinations empty', async () => {
    const catalog = new StaticUniversityCatalog();
    const [us, gb, found, missing] = await Promise.all([
      catalog.listByCountry('us'),
      catalog.listByCountry('gb'),
      catalog.findBySlug('us', 'university-of-north-texas'),
      catalog.findBySlug('us', 'not-a-university'),
    ]);

    expect(us).toHaveLength(100);
    expect(gb).toHaveLength(0);
    expect(found).not.toBeNull();

    if (found === null) {
      return;
    }

    expect(found.name).toBe('University of North Texas');
    expect(found.needsReview).toBe(true);
    expect(found.bachelor.english.ieltsOverall).toBeGreaterThan(0);
    expect(missing).toBeNull();
  });
});

describe('usdToBdt', () => {
  it('converts at the documented snapshot rate', () => {
    expect(usdToBdt(100)).toBe(12_200);
  });
});
