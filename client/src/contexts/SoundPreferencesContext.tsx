import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SoundPreferences {
  enabled: boolean;
  masterVolume: number;
  clickEnabled: boolean;
  hoverEnabled: boolean;
  successEnabled: boolean;
  errorEnabled: boolean;
  transitionEnabled: boolean;
  loadingEnabled: boolean;
}

interface SoundPreferencesContextType {
  preferences: SoundPreferences;
  updatePreferences: (prefs: Partial<SoundPreferences>) => void;
  resetToDefaults: () => void;
}

const defaultPreferences: SoundPreferences = {
  // Audio is intentionally opt-in. Web Audio is prepared only after a user gesture
  // and no audible output is produced until the visitor explicitly enables sound.
  enabled: false,
  masterVolume: 0.5,
  clickEnabled: true,
  hoverEnabled: true,
  successEnabled: true,
  errorEnabled: true,
  transitionEnabled: true,
  loadingEnabled: true,
};

const SoundPreferencesContext = createContext<SoundPreferencesContextType | undefined>(undefined);

export const SoundPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<SoundPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Merge persisted preferences into the current schema. This prevents an old
  // localStorage payload from silently omitting newer safety/experience fields.
  useEffect(() => {
    const saved = localStorage.getItem('soundPreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<SoundPreferences>;
        setPreferences({ ...defaultPreferences, ...parsed, enabled: parsed.enabled === true });
      } catch (error) {
        console.error('Failed to load sound preferences:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('soundPreferences', JSON.stringify(preferences));
    }
  }, [preferences, isLoaded]);

  const updatePreferences = (prefs: Partial<SoundPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <SoundPreferencesContext.Provider value={{ preferences, updatePreferences, resetToDefaults }}>
      {children}
    </SoundPreferencesContext.Provider>
  );
};

export const useSoundPreferences = () => {
  const context = useContext(SoundPreferencesContext);
  if (!context) {
    throw new Error('useSoundPreferences must be used within SoundPreferencesProvider');
  }
  return context;
};
