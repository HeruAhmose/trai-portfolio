import React from 'react';
import { motion } from 'framer-motion';
import { SoundPreferencesPanel } from '@/components/SoundPreferencesPanel';

export const SoundPreferencesPage: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
            Audio Settings
          </h1>
          <p className="text-slate-400 text-lg">
            Fine-tune your portfolio's audio experience
          </p>
        </motion.div>

        {/* Main Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SoundPreferencesPanel />
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
            <h3 className="text-cyan-300 font-semibold mb-2">🎵 Sound Effects</h3>
            <p className="text-slate-400 text-sm">
              6 professional sound effects provide tactile feedback for all interactions across the portfolio.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-purple-300 font-semibold mb-2">💾 Auto-Save</h3>
            <p className="text-slate-400 text-sm">
              Your preferences are automatically saved to your browser's local storage.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>🔊 Enjoy an immersive audio experience tailored to your preferences</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SoundPreferencesPage;
