import React, { useEffect, useRef, useState } from 'react';

interface GestureEvent {
  type: 'swipe_left' | 'swipe_right' | 'pinch' | 'point' | 'thumbs_up' | 'peace' | 'fist';
  confidence: number;
  position: { x: number; y: number };
}

export const GestureRecognition: React.FC<{
  onGesture?: (event: GestureEvent) => void;
  enabled?: boolean;
}> = ({ onGesture, enabled = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gestureHistory, setGestureHistory] = useState<GestureEvent[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const loadMediaPipe = async () => {
      try {
        // Load MediaPipe Hands solution
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.4.1633559619.0/camera_utils.js';
        document.head.appendChild(script);

        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.4.1633559619.0/drawing_utils.js';
        document.head.appendChild(script2);

        const script3 = document.createElement('script');
        script3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1633559619.0/hands.js';
        script3.onload = () => {
          initializeGestureDetection();
        };
        document.head.appendChild(script3);
      } catch (error) {
        console.error('Failed to load MediaPipe:', error);
      }
    };

    const initializeGestureDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        video.srcObject = stream;
        setIsLoaded(true);

        // Gesture detection logic
        const detectGestures = () => {
          // Placeholder for actual gesture detection
          // In production, this would use MediaPipe's hand tracking
          requestAnimationFrame(detectGestures);
        };

        video.onloadedmetadata = () => {
          detectGestures();
        };
      } catch (error) {
        console.error('Failed to access camera:', error);
      }
    };

    loadMediaPipe();
  }, [enabled]);

  const handleGestureDetected = (gesture: GestureEvent) => {
    setGestureHistory((prev) => [...prev.slice(-10), gesture]);
    onGesture?.(gesture);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {isLoaded && (
        <div className="text-xs text-cyan-400 bg-black/50 px-2 py-1 rounded border border-cyan-400">
          Gesture Recognition Active
        </div>
      )}
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      {gestureHistory.length > 0 && (
        <div className="text-xs text-gold-400 bg-black/50 px-2 py-1 rounded border border-gold-400 max-w-xs">
          Last: {gestureHistory[gestureHistory.length - 1].type}
        </div>
      )}
    </div>
  );
};
