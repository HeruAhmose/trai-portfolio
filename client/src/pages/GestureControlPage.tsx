import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GestureRecognitionPanel } from '@/components/GestureRecognitionPanel';
import { useGestureNavigation } from '@/contexts/GestureNavigationContext';
import { GestureType } from '@/hooks/useGestureRecognition';

export default function GestureControlPage() {
  const { executeGestureAction, gestureActions } = useGestureNavigation();

  const handleGestureDetected = (gesture: GestureType) => {
    executeGestureAction(gesture);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🤖 Gesture Control
          </h1>
          <p className="text-lg text-purple-300/80">
            Control your portfolio with hand gestures. No keyboard or mouse needed.
          </p>
        </motion.div>

        {/* Main gesture panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <GestureRecognitionPanel onGestureDetected={handleGestureDetected} />
        </motion.div>

        {/* Gesture mappings info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Navigation Gestures */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4">📍 Navigation Gestures</h3>
            <div className="space-y-3">
              {Array.from(gestureActions.entries())
                .filter(([gesture]) => ['swipe_left', 'swipe_right', 'peace_sign', 'fist'].includes(gesture))
                .map(([gesture, action]) => (
                  <div key={gesture} className="flex items-start gap-3">
                    <div className="text-2xl">
                      {gesture === 'swipe_left' && '👈'}
                      {gesture === 'swipe_right' && '👉'}
                      {gesture === 'peace_sign' && '✌️'}
                      {gesture === 'fist' && '✊'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{action.label}</p>
                      <p className="text-sm text-slate-400">Gesture: {gesture.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Gestures */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-cyan-500/30">
            <h3 className="text-xl font-bold text-cyan-300 mb-4">⚡ Action Gestures</h3>
            <div className="space-y-3">
              {Array.from(gestureActions.entries())
                .filter(([gesture]) => ['thumbs_up', 'thumbs_down', 'ok_sign', 'point_forward', 'palm_open'].includes(gesture))
                .map(([gesture, action]) => (
                  <div key={gesture} className="flex items-start gap-3">
                    <div className="text-2xl">
                      {gesture === 'thumbs_up' && '👍'}
                      {gesture === 'thumbs_down' && '👎'}
                      {gesture === 'ok_sign' && '👌'}
                      {gesture === 'point_forward' && '☝️'}
                      {gesture === 'palm_open' && '✋'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{action.label}</p>
                      <p className="text-sm text-slate-400">Gesture: {gesture.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-purple-300 mb-4">💡 Tips for Best Results</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">→</span>
              <span>Ensure good lighting for accurate hand detection</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">→</span>
              <span>Position your hand clearly in front of the camera</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">→</span>
              <span>Perform gestures slowly and deliberately for better recognition</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">→</span>
              <span>Keep your hand within the camera frame</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">→</span>
              <span>Avoid complex hand positions - stick to clear, distinct gestures</span>
            </li>
          </ul>
        </motion.div>

        {/* Browser support info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-400 text-sm"
        >
          <p>
            🌐 Gesture recognition requires a modern browser with camera access. Works best on Chrome, Edge, and Firefox.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
