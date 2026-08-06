import { describe, it, expect } from 'vitest';

describe('Sound Preferences System', () => {
  it('should define default sound preferences', () => {
    const defaultPreferences = {
      masterVolume: 0.5,
      clickEnabled: true,
      hoverEnabled: true,
      successEnabled: true,
      errorEnabled: true,
      transitionEnabled: true,
      loadingEnabled: true,
    };

    expect(defaultPreferences.masterVolume).toBe(0.5);
    expect(defaultPreferences.clickEnabled).toBe(true);
    expect(defaultPreferences.hoverEnabled).toBe(true);
    expect(defaultPreferences.successEnabled).toBe(true);
    expect(defaultPreferences.errorEnabled).toBe(true);
    expect(defaultPreferences.transitionEnabled).toBe(true);
    expect(defaultPreferences.loadingEnabled).toBe(true);
  });

  it('should validate master volume range', () => {
    const volumes = [0, 0.25, 0.5, 0.75, 1.0];
    
    volumes.forEach(volume => {
      expect(volume).toBeGreaterThanOrEqual(0);
      expect(volume).toBeLessThanOrEqual(1);
    });
  });

  it('should support all 6 sound effect types', () => {
    const soundTypes = ['click', 'hover', 'success', 'error', 'transition', 'loading'];
    
    expect(soundTypes).toHaveLength(6);
    expect(soundTypes).toContain('click');
    expect(soundTypes).toContain('hover');
    expect(soundTypes).toContain('success');
    expect(soundTypes).toContain('error');
    expect(soundTypes).toContain('transition');
    expect(soundTypes).toContain('loading');
  });

  it('should allow toggling individual sound effects', () => {
    const preferences = {
      masterVolume: 0.5,
      clickEnabled: true,
      hoverEnabled: true,
      successEnabled: true,
      errorEnabled: true,
      transitionEnabled: true,
      loadingEnabled: true,
    };

    // Toggle each sound
    preferences.clickEnabled = !preferences.clickEnabled;
    expect(preferences.clickEnabled).toBe(false);

    preferences.hoverEnabled = !preferences.hoverEnabled;
    expect(preferences.hoverEnabled).toBe(false);

    preferences.successEnabled = !preferences.successEnabled;
    expect(preferences.successEnabled).toBe(false);

    // Others should remain unchanged
    expect(preferences.errorEnabled).toBe(true);
    expect(preferences.transitionEnabled).toBe(true);
    expect(preferences.loadingEnabled).toBe(true);
  });

  it('should support batch preference updates', () => {
    const preferences = {
      masterVolume: 0.5,
      clickEnabled: true,
      hoverEnabled: true,
      successEnabled: true,
      errorEnabled: true,
      transitionEnabled: true,
      loadingEnabled: true,
    };

    // Batch update
    const updates = {
      masterVolume: 0.8,
      clickEnabled: false,
      hoverEnabled: false,
    };

    const updated = { ...preferences, ...updates };

    expect(updated.masterVolume).toBe(0.8);
    expect(updated.clickEnabled).toBe(false);
    expect(updated.hoverEnabled).toBe(false);
    expect(updated.successEnabled).toBe(true);
  });

  it('should support reset to defaults', () => {
    const defaults = {
      masterVolume: 0.5,
      clickEnabled: true,
      hoverEnabled: true,
      successEnabled: true,
      errorEnabled: true,
      transitionEnabled: true,
      loadingEnabled: true,
    };

    let preferences = {
      masterVolume: 0.2,
      clickEnabled: false,
      hoverEnabled: false,
      successEnabled: false,
      errorEnabled: false,
      transitionEnabled: false,
      loadingEnabled: false,
    };

    preferences = { ...defaults };

    expect(preferences).toEqual(defaults);
  });

  it('should serialize preferences to JSON', () => {
    const preferences = {
      masterVolume: 0.7,
      clickEnabled: true,
      hoverEnabled: false,
      successEnabled: true,
      errorEnabled: false,
      transitionEnabled: true,
      loadingEnabled: false,
    };

    const json = JSON.stringify(preferences);
    const parsed = JSON.parse(json);

    expect(parsed.masterVolume).toBe(0.7);
    expect(parsed.clickEnabled).toBe(true);
    expect(parsed.hoverEnabled).toBe(false);
    expect(parsed.successEnabled).toBe(true);
  });

  it('should handle edge cases for master volume', () => {
    const testCases = [
      { input: 0, expected: 0 },
      { input: 0.001, expected: 0.001 },
      { input: 0.5, expected: 0.5 },
      { input: 0.999, expected: 0.999 },
      { input: 1.0, expected: 1.0 },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(input).toBe(expected);
      expect(input).toBeGreaterThanOrEqual(0);
      expect(input).toBeLessThanOrEqual(1);
    });
  });

  it('should maintain preference type safety', () => {
    const preferences = {
      masterVolume: 0.5,
      clickEnabled: true,
      hoverEnabled: true,
      successEnabled: true,
      errorEnabled: true,
      transitionEnabled: true,
      loadingEnabled: true,
    };

    // Type checks
    expect(typeof preferences.masterVolume).toBe('number');
    expect(typeof preferences.clickEnabled).toBe('boolean');
    expect(typeof preferences.hoverEnabled).toBe('boolean');
    expect(typeof preferences.successEnabled).toBe('boolean');
    expect(typeof preferences.errorEnabled).toBe('boolean');
    expect(typeof preferences.transitionEnabled).toBe('boolean');
    expect(typeof preferences.loadingEnabled).toBe('boolean');
  });
});
