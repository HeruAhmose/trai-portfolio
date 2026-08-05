import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SoundPreferences {
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

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('soundPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load sound preferences:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage whenever they change
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
