import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGestureRecognition, GestureType } from '@/hooks/useGestureRecognition';
import { Camera, CameraOff, Zap, Volume2 } from 'lucide-react';
import { useAudioManager } from '@/hooks/useAudioManager';

interface GestureMapping {
  gesture: GestureType;
  label: string;
  emoji: string;
  action?: string;
}

const GESTURE_MAPPINGS: GestureMapping[] = [
  { gesture: 'swipe_left', label: 'Swipe Left', emoji: '👈', action: 'previous' },
  { gesture: 'swipe_right', label: 'Swipe Right', emoji: '👉', action: 'next' },
  { gesture: 'thumbs_up', label: 'Thumbs Up', emoji: '👍', action: 'like' },
  { gesture: 'thumbs_down', label: 'Thumbs Down', emoji: '👎', action: 'dislike' },
  { gesture: 'peace_sign', label: 'Peace Sign', emoji: '✌️', action: 'home' },
  { gesture: 'ok_sign', label: 'OK Sign', emoji: '👌', action: 'confirm' },
  { gesture: 'point_forward', label: 'Point Forward', emoji: '☝️', action: 'select' },
  { gesture: 'palm_open', label: 'Palm Open', emoji: '✋', action: 'stop' },
  { gesture: 'fist', label: 'Fist', emoji: '✊', action: 'menu' },
];

export const GestureRecognitionPanel: React.FC<{
  onGestureDetected?: (gesture: GestureType) => void;
}> = ({ onGestureDetected }) => {
  const {
    videoRef,
    isInitialized,
    isRunning,
    cameraPermission,
    lastGesture,
    gestureHistory,
    error,
    start,
    stop,
    requestCameraPermission,
  } = useGestureRecognition();

  const { playClick, playSuccess } = useAudioManager(true);
  const [showLegend, setShowLegend] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (lastGesture && onGestureDetected) {
      onGestureDetected(lastGesture.gesture);
      if (soundEnabled) {
        playClick();
      }
    }
  }, [lastGesture, onGestureDetected, soundEnabled, playClick]);

  const handleStart = async () => {
    if (cameraPermission === 'pending') {
      await requestCameraPermission();
    }
    await start();
    if (soundEnabled) {
      playSuccess();
    }
  };

  const handleStop = () => {
    stop();
    if (soundEnabled) {
      playClick();
    }
  };

  const getGestureLabel = (gesture: GestureType): string => {
    return GESTURE_MAPPINGS.find((m) => m.gesture === gesture)?.label || 'Unknown';
  };

  const getGestureEmoji = (gesture: GestureType): string => {
    return GESTURE_MAPPINGS.find((m) => m.gesture === gesture)?.emoji || '🤚';
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4 p-6">
        {/* Header */}
        <div className="border-b border-purple-500/30 pb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🤖 Gesture Control
          </h2>
          <p className="text-slate-400 text-sm mt-1">Hands-free navigation using hand gestures</p>
        </div>

        {/* Camera Feed */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Status Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {!isRunning && (
              <div className="text-center">
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-slate-400 text-sm">Camera inactive</p>
              </div>
            )}

            {isRunning && lastGesture && (
              <motion.div
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="text-6xl mb-2">{getGestureEmoji(lastGesture.gesture)}</div>
                <p className="text-purple-300 font-semibold">{getGestureLabel(lastGesture.gesture)}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Confidence: {(lastGesture.confidence * 100).toFixed(0)}%
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Camera Permission Status */}
        {cameraPermission === 'denied' && (
          <motion.div
            className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-yellow-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Camera permission denied. Please enable camera access in your browser settings.
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <motion.button
              onClick={handleStart}
              disabled={cameraPermission === 'denied'}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Camera className="w-4 h-4" />
              Start Gesture Control
            </motion.button>
          ) : (
            <motion.button
              onClick={handleStop}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CameraOff className="w-4 h-4" />
              Stop Gesture Control
            </motion.button>
          )}

          <motion.button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`py-2 px-4 rounded-lg border-2 transition-all ${
              soundEnabled
                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                : 'border-slate-600 bg-slate-700/50 text-slate-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={soundEnabled ? 'Sound enabled' : 'Sound disabled'}
          >
            <Volume2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => setShowLegend(!showLegend)}
            className="py-2 px-4 rounded-lg border-2 border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Show gesture legend"
          >
            <Zap className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Gesture History */}
        {gestureHistory.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-2">Recent Gestures:</p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {gestureHistory.slice(-5).map((gesture, idx) => (
                  <motion.div
                    key={`${gesture.timestamp}-${idx}`}
                    className="text-sm bg-purple-500/20 border border-purple-500/50 rounded px-2 py-1 text-purple-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {getGestureEmoji(gesture.gesture)} {getGestureLabel(gesture.gesture)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Gesture Legend */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-sm font-semibold text-purple-300 mb-3">Available Gestures:</p>
              <div className="grid grid-cols-2 gap-2">
                {GESTURE_MAPPINGS.map((mapping) => (
                  <div key={mapping.gesture} className="text-xs text-slate-300">
                    <span className="text-lg">{mapping.emoji}</span> {mapping.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-400 text-xs">
          <p>💡 Position your hand in front of the camera and perform gestures to navigate</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GestureRecognitionPanel;
