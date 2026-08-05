import React from 'react';
import { motion } from 'framer-motion';
import { Settings, X, RotateCcw } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface PreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * User preferences settings panel
 * Allows users to customize portfolio experience
 */
export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ isOpen, onClose }) => {
  const {
    preferences,
    setTheme,
    toggle3D,
    toggleGestures,
    toggleSound,
    toggleVoiceCommands,
    setSoundVolume,
    setAnimationIntensity,
    resetPreferences,
  } = useUserPreferences();

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Panel */}
      <motion.div
        className="relative bg-background border-2 border-afro-gold rounded-lg p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-afro-gold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-afro-gold">Theme</label>
            <div className="flex gap-4">
              {(['dark', 'light'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setTheme(theme)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    preferences.theme === theme
                      ? 'bg-afro-gold text-black'
                      : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                  }`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Intensity */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-afro-gold">Animation Intensity</label>
            <div className="flex gap-4">
              {(['low', 'medium', 'high'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setAnimationIntensity(intensity)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    preferences.animationIntensity === intensity
                      ? 'bg-afro-sapphire text-white'
                      : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                  }`}
                >
                  {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3">
            {[
              { label: '3D Models', value: preferences.enable3D, onChange: toggle3D },
              { label: 'Gesture Controls', value: preferences.enableGestures, onChange: toggleGestures },
              { label: 'Sound Effects', value: preferences.enableSound, onChange: toggleSound },
              { label: 'Voice Commands', value: preferences.enableVoiceCommands, onChange: toggleVoiceCommands },
            ].map(({ label, value, onChange }) => (
              <div key={label} className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80">{label}</label>
                <button
                  onClick={() => onChange(!value)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    value
                      ? 'bg-afro-emerald'
                      : 'bg-foreground/20'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white"
                    animate={{ x: value ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Sound Volume */}
          {preferences.enableSound && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-afro-gold">Sound Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.soundVolume}
                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-foreground/20 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-foreground/60">{Math.round(preferences.soundVolume * 100)}%</p>
            </div>
          )}

          {/* Reset Button */}
          <motion.button
            onClick={() => {
              resetPreferences();
              onClose();
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreferencesPanel;
