import { describe, it, expect } from 'vitest';
import { PATENT_CLAIMS } from '../../data/patentClaims';

describe('SearchablePatentClaims data', () => {
  it('has exactly 25 patent claims, numbered 1-25 in order', () => {
    expect(PATENT_CLAIMS).toHaveLength(25);
    PATENT_CLAIMS.forEach((claim, i) => {
      expect(claim.number).toBe(i + 1);
    });
  });

  it('has the documented category distribution', () => {
    const composition = PATENT_CLAIMS.filter(c => c.category === 'composition');
    const manufacturing = PATENT_CLAIMS.filter(c => c.category === 'manufacturing');
    const device = PATENT_CLAIMS.filter(c => c.category === 'device');

    expect(composition).toHaveLength(15);
    expect(manufacturing).toHaveLength(3);
    expect(device).toHaveLength(7);
  });

  it('claims 1-15 are composition, 16-18 are manufacturing, 19-25 are device', () => {
    PATENT_CLAIMS.forEach(claim => {
      if (claim.number <= 15) expect(claim.category).toBe('composition');
      else if (claim.number <= 18) expect(claim.category).toBe('manufacturing');
      else expect(claim.category).toBe('device');
    });
  });

  it('derives type from category using standard patent claim taxonomy', () => {
    // type is not an independent axis -- it mirrors category 1:1, which is
    // why the component has no separate type filter. This test guards
    // against that relationship silently drifting.
    PATENT_CLAIMS.forEach(claim => {
      if (claim.category === 'composition') expect(claim.type).toBe('composition');
      if (claim.category === 'manufacturing') expect(claim.type).toBe('method');
      if (claim.category === 'device') expect(claim.type).toBe('apparatus');
    });
  });

  it('every claim has at least one sourced specification', () => {
    PATENT_CLAIMS.forEach(claim => {
      expect(Object.keys(claim.specifications).length).toBeGreaterThan(0);
    });
  });

  it('every claim has a non-empty title and description', () => {
    PATENT_CLAIMS.forEach(claim => {
      expect(claim.title.length).toBeGreaterThan(0);
      expect(claim.description.length).toBeGreaterThan(0);
    });
  });

  it('claim numbers are unique', () => {
    const numbers = PATENT_CLAIMS.map(c => c.number);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('does not contain claims fabricated outside the sourced record', () => {
    // These titles/specs shipped live before this data was corrected to
    // match the sourced 25-claim record used elsewhere in the repo. They
    // must never reappear.
    const blob = JSON.stringify(PATENT_CLAIMS).toLowerCase();
    expect(blob).not.toContain('dna data storage');
    expect(blob).not.toContain('crispr');
    expect(blob).not.toContain('neural interface');
    expect(blob).not.toContain('bluetooth');
    expect(blob).not.toContain('5g/lte/wifi');
  });

  it('reflects the real filing figures used elsewhere in the repo', () => {
    const claim1 = PATENT_CLAIMS[0];
    expect(claim1.specifications['Pyrolysis Temperature']).toBe('700–1400°C');
    expect(claim1.specifications['Conductivity']).toBe('10²–10⁶ S/m');

    const claim2 = PATENT_CLAIMS[1];
    expect(claim2.specifications['Quartz']).toBe('15–45%');
    expect(claim2.specifications['Tourmaline']).toBe('3–25%');
    expect(claim2.specifications['Magnetite']).toBe('2–20%');
  });
});
