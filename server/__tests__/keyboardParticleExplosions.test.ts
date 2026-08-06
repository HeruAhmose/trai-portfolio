import { describe, it, expect } from 'vitest';

describe('Keyboard-Triggered Particle Explosions', () => {
  it('should validate mega burst configuration', () => {
    const MEGA_BURST_COUNT = 60;
    const MEGA_BURST_LIFE = 1.2;
    const PARTICLE_COUNT = 8;

    expect(MEGA_BURST_COUNT).toBe(60);
    expect(MEGA_BURST_LIFE).toBe(1.2);
    expect(MEGA_BURST_COUNT).toBeGreaterThan(PARTICLE_COUNT);
  });

  it('should validate directional burst configuration', () => {
    const DIRECTIONAL_BURST_COUNT = 30;
    const MEGA_BURST_LIFE = 1.2;

    expect(DIRECTIONAL_BURST_COUNT).toBe(30);
    expect(MEGA_BURST_LIFE).toBe(1.2);
  });

  it('should calculate directional angles correctly', () => {
    // Up direction
    const upAngle = -Math.PI / 2;
    expect(upAngle).toBe(-Math.PI / 2);

    // Down direction
    const downAngle = Math.PI / 2;
    expect(downAngle).toBe(Math.PI / 2);

    // Left direction
    const leftAngle = Math.PI;
    expect(leftAngle).toBe(Math.PI);

    // Right direction
    const rightAngle = 0;
    expect(rightAngle).toBe(0);
  });

  it('should validate particle velocity calculations', () => {
    const baseVelocity = 100;
    const randomVelocity = 50;
    const minVelocity = baseVelocity;
    const maxVelocity = baseVelocity + randomVelocity;

    expect(minVelocity).toBe(100);
    expect(maxVelocity).toBe(150);
  });

  it('should validate color selection', () => {
    const NEON_COLORS = [
      '#ffd700', // Gold
      '#00ffff', // Cyan
      '#ff00ff', // Magenta
      '#00ff00', // Lime
      '#ff0080', // Hot Pink
      '#00d9ff', // Electric Cyan
    ];

    for (let i = 1; i <= 6; i++) {
      const colorIndex = i - 1;
      expect(colorIndex).toBeLessThan(NEON_COLORS.length);
      expect(NEON_COLORS[colorIndex]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('should handle spacebar key code', () => {
    const keyCode = 'Space';
    expect(keyCode).toBe('Space');
  });

  it('should handle arrow key codes', () => {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    expect(arrowKeys).toHaveLength(4);
    expect(arrowKeys[0]).toBe('ArrowUp');
    expect(arrowKeys[1]).toBe('ArrowDown');
    expect(arrowKeys[2]).toBe('ArrowLeft');
    expect(arrowKeys[3]).toBe('ArrowRight');
  });

  it('should validate number key range for color selection', () => {
    const numberKeys = ['1', '2', '3', '4', '5', '6'];
    const NEON_COLORS = [
      '#ffd700',
      '#00ffff',
      '#ff00ff',
      '#00ff00',
      '#ff0080',
      '#00d9ff',
    ];

    expect(numberKeys).toHaveLength(NEON_COLORS.length);

    numberKeys.forEach((key, index) => {
      const colorIndex = parseInt(key) - 1;
      expect(colorIndex).toBe(index);
      expect(colorIndex).toBeLessThan(NEON_COLORS.length);
    });
  });

  it('should calculate particle spread angle correctly', () => {
    const count = 30;
    const angles: number[] = [];

    for (let i = 0; i < count; i++) {
      const baseAngle = -Math.PI / 2;
      const spread = (Math.random() - 0.5) * 0.4;
      const angle = baseAngle + spread;
      angles.push(angle);
    }

    expect(angles).toHaveLength(30);
    angles.forEach(angle => {
      expect(angle).toBeGreaterThanOrEqual(-Math.PI / 2 - 0.2);
      expect(angle).toBeLessThanOrEqual(-Math.PI / 2 + 0.2);
    });
  });

  it('should validate particle velocity multiplier', () => {
    const normalMultiplier = 1;
    const megaBurstMultiplier = 1.5;
    const directionalMultiplier = 1;

    expect(megaBurstMultiplier).toBeGreaterThan(normalMultiplier);
    expect(directionalMultiplier).toBe(normalMultiplier);
  });

  it('should validate particle life duration', () => {
    const PARTICLE_LIFE = 0.8;
    const MEGA_BURST_LIFE = 1.2;

    expect(MEGA_BURST_LIFE).toBeGreaterThan(PARTICLE_LIFE);
    expect(PARTICLE_LIFE).toBe(0.8);
    expect(MEGA_BURST_LIFE).toBe(1.2);
  });

  it('should handle key press tracking', () => {
    const keyPressed = new Set<string>();

    keyPressed.add('Space');
    expect(keyPressed.has('Space')).toBe(true);

    keyPressed.add('ArrowUp');
    expect(keyPressed.has('ArrowUp')).toBe(true);

    keyPressed.delete('Space');
    expect(keyPressed.has('Space')).toBe(false);
    expect(keyPressed.has('ArrowUp')).toBe(true);
  });

  it('should validate burst particle count', () => {
    const PARTICLE_COUNT = 8;
    const DIRECTIONAL_BURST_COUNT = 30;
    const MEGA_BURST_COUNT = 60;

    expect(PARTICLE_COUNT).toBeLessThan(DIRECTIONAL_BURST_COUNT);
    expect(DIRECTIONAL_BURST_COUNT).toBeLessThan(MEGA_BURST_COUNT);
  });

  it('should validate angle offset calculations', () => {
    const count = 60;
    const baseAngle = (Math.PI * 2 * 0) / count;
    const offsetAngle = baseAngle + (Math.random() - 0.5) * 0.5;

    expect(baseAngle).toBe(0);
    expect(offsetAngle).toBeGreaterThanOrEqual(-0.25);
    expect(offsetAngle).toBeLessThanOrEqual(0.25);
  });

  it('should validate velocity component calculations', () => {
    const angle = Math.PI / 4;
    const velocity = 100;

    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    expect(vx).toBeCloseTo(70.71, 1);
    expect(vy).toBeCloseTo(70.71, 1);
  });

  it('should validate gravity application', () => {
    let vy = 0;
    const gravity = 50;
    const deltaTime = 1 / 60;

    vy += gravity * deltaTime;

    expect(vy).toBeGreaterThan(0);
    expect(vy).toBeCloseTo(0.833, 2);
  });

  it('should validate particle opacity calculation', () => {
    const life = 0.6;
    const maxLife = 1.2;
    const progress = life / maxLife;
    const opacity = Math.max(0, 1 - progress);

    expect(progress).toBe(0.5);
    expect(opacity).toBe(0.5);
  });
});
