import React from 'react';
import { motion } from 'framer-motion';
import { useVoicePreferences } from '@/contexts/VoicePreferencesContext';
import { useAudioManager } from '@/hooks/useAudioManager';

export const VoicePreferencesPanel: React.FC = () => {
  const { preferences, updatePreferences, resetToDefaults } = useVoicePreferences();
  const { playClick, playSuccess } = useAudioManager(true);

  const handleGenderChange = (gender: 'male' | 'female') => {
    updatePreferences({ gender });
    playClick();
  };

  const handleToggle = (key: 'enableDivineAlternation' | 'enableBlackAmericanVoice') => {
    updatePreferences({ [key]: !preferences[key] });
    playClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    updatePreferences({ volume });
    playClick();
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    updatePreferences({ rate });
    playClick();
  };

  const handleReset = () => {
    resetToDefaults();
    playSuccess();
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/30 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-purple-500/30 pb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🎙️ Voice Preferences
          </h2>
          <p className="text-slate-400 text-sm mt-1">Customize your AI voice experience</p>
        </div>

        {/* Gender Selection */}
        <div className="space-y-3">
          <label className="block text-purple-300 font-semibold">Voice Gender</label>
          <div className="flex gap-3">
            {(['female', 'male'] as const).map((gender) => (
              <motion.button
                key={gender}
                onClick={() => handleGenderChange(gender)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all capitalize ${
                  preferences.gender === gender
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {gender === 'female' ? '👩 Female' : '👨 Male'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Divine Alternation Toggle */}
        <div className="space-y-3">
          <label className="block text-purple-300 font-semibold">Divine Voice Features</label>
          <motion.button
            onClick={() => handleToggle('enableDivineAlternation')}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              preferences.enableDivineAlternation
                ? 'border-purple-500 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">✨ Divine Alternation</div>
                <div className="text-xs opacity-70">Alternate between male and female divine voices</div>
              </div>
              <div className={`text-lg ${preferences.enableDivineAlternation ? '✓' : '○'}`} />
            </div>
          </motion.button>
        </div>

        {/* Black American Voice Toggle */}
        <div className="space-y-3">
          <motion.button
            onClick={() => handleToggle('enableBlackAmericanVoice')}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              preferences.enableBlackAmericanVoice
                ? 'border-purple-500 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">🎤 Black American Voice</div>
                <div className="text-xs opacity-70">Prioritize Black American voice options</div>
              </div>
              <div className={`text-lg ${preferences.enableBlackAmericanVoice ? '✓' : '○'}`} />
            </div>
          </motion.button>
        </div>

        {/* Volume Control */}
        <div className="space-y-3">
          <label className="block text-purple-300 font-semibold">Voice Volume</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-purple-400 font-mono text-sm min-w-12">
              {(preferences.volume * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Speech Rate Control */}
        <div className="space-y-3">
          <label className="block text-purple-300 font-semibold">Speech Rate</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={preferences.rate}
              onChange={handleRateChange}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-purple-400 font-mono text-sm min-w-12">
              {preferences.rate.toFixed(1)}x
            </span>
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
          <p>🎙️ Your voice preferences are automatically saved to your browser</p>
        </div>
      </div>
    </motion.div>
  );
};

export default VoicePreferencesPanel;
