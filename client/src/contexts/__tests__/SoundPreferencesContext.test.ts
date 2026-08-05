import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SoundPreferencesProvider, useSoundPreferences, SoundPreferences } from '../SoundPreferencesContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SoundPreferencesContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide default preferences', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    expect(result.current.preferences.masterVolume).toBe(0.5);
    expect(result.current.preferences.clickEnabled).toBe(true);
    expect(result.current.preferences.hoverEnabled).toBe(true);
    expect(result.current.preferences.successEnabled).toBe(true);
    expect(result.current.preferences.errorEnabled).toBe(true);
    expect(result.current.preferences.transitionEnabled).toBe(true);
    expect(result.current.preferences.loadingEnabled).toBe(true);
  });

  it('should update preferences', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    act(() => {
      result.current.updatePreferences({ masterVolume: 0.8 });
    });

    expect(result.current.preferences.masterVolume).toBe(0.8);
  });

  it('should toggle individual sound effects', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    act(() => {
      result.current.updatePreferences({ clickEnabled: false });
    });

    expect(result.current.preferences.clickEnabled).toBe(false);
    expect(result.current.preferences.hoverEnabled).toBe(true);
  });

  it('should reset to defaults', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    act(() => {
      result.current.updatePreferences({
        masterVolume: 0.2,
        clickEnabled: false,
        hoverEnabled: false,
      });
    });

    expect(result.current.preferences.masterVolume).toBe(0.2);
    expect(result.current.preferences.clickEnabled).toBe(false);

    act(() => {
      result.current.resetToDefaults();
    });

    expect(result.current.preferences.masterVolume).toBe(0.5);
    expect(result.current.preferences.clickEnabled).toBe(true);
    expect(result.current.preferences.hoverEnabled).toBe(true);
  });

  it('should persist preferences to localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    act(() => {
      result.current.updatePreferences({ masterVolume: 0.75 });
    });

    const saved = localStorage.getItem('soundPreferences');
    expect(saved).toBeTruthy();
    
    const parsed = JSON.parse(saved!);
    expect(parsed.masterVolume).toBe(0.75);
  });

  it('should load preferences from localStorage', () => {
    const preferences: SoundPreferences = {
      masterVolume: 0.3,
      clickEnabled: false,
      hoverEnabled: true,
      successEnabled: false,
      errorEnabled: true,
      transitionEnabled: false,
      loadingEnabled: true,
    };

    localStorage.setItem('soundPreferences', JSON.stringify(preferences));

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    expect(result.current.preferences.masterVolume).toBe(0.3);
    expect(result.current.preferences.clickEnabled).toBe(false);
    expect(result.current.preferences.successEnabled).toBe(false);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('soundPreferences', 'invalid json');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    // Should fall back to defaults
    expect(result.current.preferences.masterVolume).toBe(0.5);
    expect(result.current.preferences.clickEnabled).toBe(true);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useSoundPreferences());
    }).toThrow('useSoundPreferences must be used within SoundPreferencesProvider');

    consoleError.mockRestore();
  });

  it('should update multiple preferences at once', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(SoundPreferencesProvider, { children });

    const { result } = renderHook(() => useSoundPreferences(), { wrapper });

    act(() => {
      result.current.updatePreferences({
        masterVolume: 0.6,
        clickEnabled: false,
        hoverEnabled: false,
        successEnabled: true,
      });
    });

    expect(result.current.preferences.masterVolume).toBe(0.6);
    expect(result.current.preferences.clickEnabled).toBe(false);
    expect(result.current.preferences.hoverEnabled).toBe(false);
    expect(result.current.preferences.successEnabled).toBe(true);
    // Other preferences should remain unchanged
    expect(result.current.preferences.errorEnabled).toBe(true);
  });
});
