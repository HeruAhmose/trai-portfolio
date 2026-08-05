import React, { createContext, useContext, useState, useEffect } from 'react';

interface VolumeContextType {
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export const VolumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('masterVolume');
    const savedSoundsEnabled = localStorage.getItem('soundsEnabled');
    
    if (savedVolume) setMasterVolume(parseFloat(savedVolume));
    if (savedSoundsEnabled) setSoundsEnabled(JSON.parse(savedSoundsEnabled));
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('masterVolume', masterVolume.toString());
  }, [masterVolume]);

  useEffect(() => {
    localStorage.setItem('soundsEnabled', JSON.stringify(soundsEnabled));
  }, [soundsEnabled]);

  return (
    <VolumeContext.Provider value={{ masterVolume, setMasterVolume, soundsEnabled, setSoundsEnabled }}>
      {children}
    </VolumeContext.Provider>
  );
};

export const useVolume = () => {
  const context = useContext(VolumeContext);
  if (!context) {
    throw new Error('useVolume must be used within VolumeProvider');
  }
  return context;
};
