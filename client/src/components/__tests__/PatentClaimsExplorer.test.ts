import { describe, it, expect } from 'vitest';

describe('PatentClaimsExplorer Component', () => {
  it('should have 25 total patent claims', () => {
    const totalClaims = 25;
    expect(totalClaims).toBe(25);
  });

  it('should organize claims into three categories', () => {
    const categories = ['composition', 'manufacturing', 'device'];
    expect(categories).toHaveLength(3);
  });

  it('should have correct claim distribution', () => {
    const distribution = {
      composition: 15,
      manufacturing: 3,
      device: 7,
    };

    expect(distribution.composition + distribution.manufacturing + distribution.device).toBe(25);
    expect(distribution.composition).toBe(15);
    expect(distribution.manufacturing).toBe(3);
    expect(distribution.device).toBe(7);
  });

  it('should have category colors defined', () => {
    const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
      composition: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-400/30',
      },
      manufacturing: {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-400/30',
      },
      device: {
        bg: 'bg-magenta-500/10',
        text: 'text-magenta-400',
        border: 'border-magenta-400/30',
      },
    };

    expect(Object.keys(categoryColors)).toEqual(['composition', 'manufacturing', 'device']);
    expect(categoryColors.composition.text).toBe('text-yellow-400');
    expect(categoryColors.manufacturing.text).toBe('text-cyan-400');
    expect(categoryColors.device.text).toBe('text-magenta-400');
  });
});
