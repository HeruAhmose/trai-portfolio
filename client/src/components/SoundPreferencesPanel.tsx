import React from 'react';
import { motion } from 'framer-motion';
import { useSoundPreferences } from '@/contexts/SoundPreferencesContext';
import { useAudioManager } from '@/hooks/useAudioManager';

export const SoundPreferencesPanel: React.FC = () => {
  const { preferences, updatePreferences, resetToDefaults } = useSoundPreferences();
  const { playClick, playSuccess } = useAudioManager(true);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    updatePreferences({ masterVolume: volume });
    playClick();
  };

  const handleToggle = (key: keyof Omit<typeof preferences, 'masterVolume'>) => {
    updatePreferences({ [key]: !preferences[key] });
    playClick();
  };

  const handleReset = () => {
    resetToDefaults();
    playSuccess();
  };

  const soundEffects = [
    { key: 'clickEnabled' as const, label: 'Click Sound', icon: '🖱️' },
    { key: 'hoverEnabled' as const, label: 'Hover Sound', icon: '👆' },
    { key: 'successEnabled' as const, label: 'Success Sound', icon: '✓' },
    { key: 'errorEnabled' as const, label: 'Error Sound', icon: '✕' },
    { key: 'transitionEnabled' as const, label: 'Transition Sound', icon: '→' },
    { key: 'loadingEnabled' as const, label: 'Loading Sound', icon: '⟳' },
  ];

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-cyan-500/30 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-cyan-500/30 pb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            🔊 Sound Preferences
          </h2>
          <p className="text-slate-400 text-sm mt-1">Customize your audio experience</p>
        </div>

        {/* Master Volume Control */}
        <div className="space-y-3">
          <label className="block text-cyan-300 font-semibold">Master Volume</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.masterVolume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-cyan-400 font-mono text-sm min-w-12">
              {(preferences.masterVolume * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-slate-500 text-xs">Adjust the overall volume for all sound effects</p>
        </div>

        {/* Individual Sound Toggles */}
        <div className="space-y-3">
          <label className="block text-cyan-300 font-semibold">Sound Effects</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {soundEffects.map(({ key, label, icon }) => (
              <motion.button
                key={key}
                onClick={() => handleToggle(key)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  preferences[key]
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                    : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-lg">{icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs opacity-70">
                      {preferences[key] ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <motion.button
          onClick={handleReset}
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset to Defaults
        </motion.button>

        {/* Info */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-400 text-xs">
          <p>💾 Your preferences are automatically saved to your browser</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SoundPreferencesPanel;
