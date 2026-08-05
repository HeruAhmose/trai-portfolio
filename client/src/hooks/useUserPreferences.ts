import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  theme: 'dark' | 'light';
  enable3D: boolean;
  enableGestures: boolean;
  enableSound: boolean;
  enableVoiceCommands: boolean;
  soundVolume: number;
  animationIntensity: 'low' | 'medium' | 'high';
  language: string;
  lastVisitedProject?: string;
  visitHistory: string[];
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  enable3D: true,
  enableGestures: true,
  enableSound: true,
  enableVoiceCommands: true,
  soundVolume: 0.7,
  animationIntensity: 'high',
  language: 'en',
  visitHistory: [],
};

const STORAGE_KEY = 'peoples-portfolio-preferences';

/**
 * Hook for managing persistent user preferences
 * Stores preferences in localStorage and syncs across tabs
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (error) {
        console.error('Failed to parse stored preferences:', error);
        setPreferences(DEFAULT_PREFERENCES);
      }
    } else {
      setPreferences(DEFAULT_PREFERENCES);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPreferences };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch custom event for cross-tab sync
      window.dispatchEvent(
        new CustomEvent('preferencesChanged', { detail: updated })
      );
      return updated;
    });
  }, []);

  // Update theme
  const setTheme = useCallback((theme: 'dark' | 'light') => {
    savePreferences({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [savePreferences]);

  // Toggle 3D
  const toggle3D = useCallback((enabled: boolean) => {
    savePreferences({ enable3D: enabled });
  }, [savePreferences]);

  // Toggle gestures
  const toggleGestures = useCallback((enabled: boolean) => {
    savePreferences({ enableGestures: enabled });
  }, [savePreferences]);

  // Toggle sound
  const toggleSound = useCallback((enabled: boolean) => {
    savePreferences({ enableSound: enabled });
  }, [savePreferences]);

  // Toggle voice commands
  const toggleVoiceCommands = useCallback((enabled: boolean) => {
    savePreferences({ enableVoiceCommands: enabled });
  }, [savePreferences]);

  // Set sound volume
  const setSoundVolume = useCallback((volume: number) => {
    savePreferences({ soundVolume: Math.max(0, Math.min(1, volume)) });
  }, [savePreferences]);

  // Set animation intensity
  const setAnimationIntensity = useCallback((intensity: 'low' | 'medium' | 'high') => {
    savePreferences({ animationIntensity: intensity });
  }, [savePreferences]);

  // Add to visit history
  const addToVisitHistory = useCallback((projectId: string) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        lastVisitedProject: projectId,
        visitHistory: [
          projectId,
          ...prev.visitHistory.filter((id) => id !== projectId),
        ].slice(0, 20), // Keep last 20 visits
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('preferencesChanged', { detail: DEFAULT_PREFERENCES })
    );
  }, []);

  // Listen for cross-tab changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setPreferences(parsed);
        } catch (error) {
          console.error('Failed to parse storage change:', error);
        }
      }
    };

    const handlePreferencesChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setPreferences(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('preferencesChanged', handlePreferencesChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('preferencesChanged', handlePreferencesChange);
    };
  }, []);

  return {
    preferences,
    isLoaded,
    savePreferences,
    setTheme,
    toggle3D,
    toggleGestures,
    toggleSound,
    toggleVoiceCommands,
    setSoundVolume,
    setAnimationIntensity,
    addToVisitHistory,
    resetPreferences,
  };
};
