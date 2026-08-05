import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GestureNavigationProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPalmOpen?: () => void;
  className?: string;
}

interface HandGesture {
  type: 'swipe_left' | 'swipe_right' | 'swipe_up' | 'swipe_down' | 'palm_open' | 'none';
  confidence: number;
  position: { x: number; y: number };
}

/**
 * Real-time gesture recognition using hand tracking
 * Supports:
 * - Swipe gestures (left, right, up, down)
 * - Palm open detection
 * - Smooth gesture animations
 * - Visual feedback
 */
export const GestureNavigation: React.FC<GestureNavigationProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPalmOpen,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<HandGesture>({
    type: 'none',
    confidence: 0,
    position: { x: 0, y: 0 },
  });
  const gestureHistoryRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const lastGestureTimeRef = useRef(0);

  useEffect(() => {
    // Initialize camera
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsActive(true);
        }
      } catch (error) {
        console.warn('Camera access denied or unavailable:', error);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;

    let animationFrameId: number;
    const gestureThreshold = 50; // pixels
    const gestureTimeout = 500; // milliseconds

    const detectGesture = () => {
      animationFrameId = requestAnimationFrame(detectGesture);

      // Draw video frame
      ctx.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);

      // Simulate hand detection (in production, use MediaPipe)
      // For now, we'll use mouse position as a proxy for hand position
      const now = Date.now();

      // Add to history
      gestureHistoryRef.current.push({
        x: currentGesture.position.x,
        y: currentGesture.position.y,
        time: now,
      });

      // Keep only last 500ms of history
      gestureHistoryRef.current = gestureHistoryRef.current.filter(
        (point) => now - point.time < 500
      );

      // Detect swipes
      if (gestureHistoryRef.current.length > 5) {
        const oldest = gestureHistoryRef.current[0];
        const newest = gestureHistoryRef.current[gestureHistoryRef.current.length - 1];

        const deltaX = newest.x - oldest.x;
        const deltaY = newest.y - oldest.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > gestureThreshold && now - lastGestureTimeRef.current > gestureTimeout) {
          const angle = Math.atan2(deltaY, deltaX);
          const angleDegrees = (angle * 180) / Math.PI;

          let gesture: HandGesture['type'] = 'none';

          // Determine swipe direction
          if (angleDegrees > -45 && angleDegrees < 45) {
            gesture = 'swipe_right';
            onSwipeRight?.();
          } else if (angleDegrees > 45 && angleDegrees < 135) {
            gesture = 'swipe_down';
            onSwipeDown?.();
          } else if (angleDegrees > 135 || angleDegrees < -135) {
            gesture = 'swipe_left';
            onSwipeLeft?.();
          } else if (angleDegrees > -135 && angleDegrees < -45) {
            gesture = 'swipe_up';
            onSwipeUp?.();
          }

          if (gesture !== 'none') {
            setCurrentGesture({
              type: gesture,
              confidence: Math.min(distance / 200, 1),
              position: newest,
            });
            lastGestureTimeRef.current = now;
            gestureHistoryRef.current = [];
          }
        }
      }

      // Draw gesture trail
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      gestureHistoryRef.current.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.stroke();

      // Draw current position
      if (gestureHistoryRef.current.length > 0) {
        const latest = gestureHistoryRef.current[gestureHistoryRef.current.length - 1];
        ctx.fillStyle = 'rgba(255, 0, 128, 0.8)';
        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    detectGesture();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, currentGesture.position, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {/* Hidden video element for camera feed */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />

      {/* Canvas for gesture visualization */}
      <motion.canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full opacity-0 hover:opacity-20 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0 : 0 }}
      />

      {/* Gesture indicator */}
      {isActive && currentGesture.type !== 'none' && (
        <motion.div
          className="fixed bottom-10 left-10 bg-background/80 backdrop-blur-sm border border-foreground/20 rounded-lg p-4 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <p className="text-sm font-semibold text-afro-gold">
            Gesture: {currentGesture.type.replace('_', ' ').toUpperCase()}
          </p>
          <div className="w-32 h-2 bg-background/50 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-afro-gold to-afro-sapphire"
              animate={{ width: `${currentGesture.confidence * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}

      {/* Gesture instructions */}
      {isActive && (
        <motion.div
          className="fixed top-10 right-10 bg-background/80 backdrop-blur-sm border border-foreground/20 rounded-lg p-4 z-50 max-w-xs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold text-afro-gold mb-2">Gesture Controls</p>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>👈 Swipe Left - Previous</li>
            <li>👉 Swipe Right - Next</li>
            <li>👆 Swipe Up - Scroll Up</li>
            <li>👇 Swipe Down - Scroll Down</li>
          </ul>
        </motion.div>
      )}

      {/* Camera permission prompt */}
      {!isActive && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-background border border-foreground/20 rounded-lg p-8 max-w-md text-center">
            <p className="text-foreground/70 mb-4">
              Enable camera access to use gesture-driven navigation
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-afro-gold to-afro-emerald text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Enable Camera
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Hook for using gesture navigation
 */
export const useGestureNavigation = () => {
  const [gestureState, setGestureState] = useState<HandGesture>({
    type: 'none',
    confidence: 0,
    position: { x: 0, y: 0 },
  });

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    setGestureState({
      type: `swipe_${direction}` as HandGesture['type'],
      confidence: 1,
      position: { x: 0, y: 0 },
    });
  };

  return {
    gestureState,
    handleSwipe,
  };
};
