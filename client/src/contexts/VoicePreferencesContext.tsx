import React, { createContext, useContext, useState, useEffect } from 'react';

export interface VoicePreferences {
  gender: 'male' | 'female';
  enableDivineAlternation: boolean;
  enableBlackAmericanVoice: boolean;
  volume: number;
  rate: number;
}

interface VoicePreferencesContextType {
  preferences: VoicePreferences;
  updatePreferences: (prefs: Partial<VoicePreferences>) => void;
  resetToDefaults: () => void;
}

const defaultPreferences: VoicePreferences = {
  gender: 'female',
  enableDivineAlternation: true,
  enableBlackAmericanVoice: true,
  volume: 0.8,
  rate: 0.9,
};

const VoicePreferencesContext = createContext<VoicePreferencesContextType | undefined>(undefined);

export const VoicePreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<VoicePreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('voicePreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load voice preferences:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('voicePreferences', JSON.stringify(preferences));
    }
  }, [preferences, isLoaded]);

  const updatePreferences = (prefs: Partial<VoicePreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <VoicePreferencesContext.Provider value={{ preferences, updatePreferences, resetToDefaults }}>
      {children}
    </VoicePreferencesContext.Provider>
  );
};

export const useVoicePreferences = () => {
  const context = useContext(VoicePreferencesContext);
  if (!context) {
    throw new Error('useVoicePreferences must be used within VoicePreferencesProvider');
  }
  return context;
};
