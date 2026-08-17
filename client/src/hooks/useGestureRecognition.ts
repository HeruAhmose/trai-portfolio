import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const MEDIAPIPE_TASKS_VISION_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.0/wasm';
const HAND_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export type GestureType =
  | 'swipe_left'
  | 'swipe_right'
  | 'thumbs_up'
  | 'thumbs_down'
  | 'peace_sign'
  | 'ok_sign'
  | 'point_forward'
  | 'palm_open'
  | 'fist'
  | 'none';

export interface GestureEvent {
  gesture: GestureType;
  confidence: number;
  timestamp: number;
  handedness: 'Left' | 'Right';
}

interface HandLandmarks {
  landmarks: Array<{ x: number; y: number; z: number }>;
  handedness: 'Left' | 'Right';
}

export const useGestureRecognition = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastGesture, setLastGesture] = useState<GestureEvent | null>(null);
  const [gestureHistory, setGestureHistory] = useState<GestureEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');

  const gestureDebounceRef = useRef<{ lastGesture: GestureType; timestamp: number }>({
    lastGesture: 'none',
    timestamp: 0,
  });

  // Initialize MediaPipe HandLandmarker using the stable Tasks Vision 1.x resolver API.
  const initializeHandLandmarker = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_TASKS_VISION_WASM_URL);

      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_LANDMARKER_MODEL_URL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });

      handLandmarkerRef.current = landmarker;
      setIsInitialized(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize hand landmarker';
      setError(errorMsg);
      console.error('HandLandmarker initialization error:', err);
    }
  }, []);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission('granted');
      }
    } catch (err) {
      setCameraPermission('denied');
      const errorMsg = err instanceof Error ? err.message : 'Camera permission denied';
      setError(errorMsg);
      console.error('Camera permission error:', err);
    }
  }, []);

  // Detect gestures from hand landmarks
  const detectGesture = useCallback((hands: HandLandmarks[]): GestureType => {
    if (hands.length === 0) return 'none';

    const hand = hands[0];
    const landmarks = hand.landmarks;

    // Helper functions for gesture detection
    const distance = (p1: any, p2: any) => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    const isFingerExtended = (fingerTip: any, fingerPip: any, palmBase: any) => {
      return distance(fingerTip, fingerPip) > distance(fingerPip, palmBase) * 0.5;
    };

    const palmCenter = landmarks[9];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    void palmCenter;

    // Thumbs Up - thumb pointing up, other fingers closed
    const thumbUp =
      landmarks[4].y < landmarks[3].y &&
      landmarks[4].y < landmarks[2].y &&
      !isFingerExtended(indexTip, landmarks[6], landmarks[5]) &&
      !isFingerExtended(middleTip, landmarks[10], landmarks[9]);

    if (thumbUp) return 'thumbs_up';

    // Thumbs Down - thumb pointing down, other fingers closed
    const thumbDown =
      landmarks[4].y > landmarks[3].y &&
      landmarks[4].y > landmarks[2].y &&
      !isFingerExtended(indexTip, landmarks[6], landmarks[5]) &&
      !isFingerExtended(middleTip, landmarks[10], landmarks[9]);

    if (thumbDown) return 'thumbs_down';

    // Peace Sign - index and middle extended, others closed
    const peaceSigns =
      isFingerExtended(indexTip, landmarks[6], landmarks[5]) &&
      isFingerExtended(middleTip, landmarks[10], landmarks[9]) &&
      !isFingerExtended(ringTip, landmarks[14], landmarks[13]) &&
      !isFingerExtended(pinkyTip, landmarks[18], landmarks[17]);

    if (peaceSigns) return 'peace_sign';

    // OK Sign - thumb and index close together, others extended
    const okSign =
      distance(thumbTip, indexTip) < 0.05 &&
      isFingerExtended(middleTip, landmarks[10], landmarks[9]) &&
      isFingerExtended(ringTip, landmarks[14], landmarks[13]) &&
      isFingerExtended(pinkyTip, landmarks[18], landmarks[17]);

    if (okSign) return 'ok_sign';

    // Point Forward - only index extended
    const pointForward =
      isFingerExtended(indexTip, landmarks[6], landmarks[5]) &&
      !isFingerExtended(middleTip, landmarks[10], landmarks[9]) &&
      !isFingerExtended(ringTip, landmarks[14], landmarks[13]) &&
      !isFingerExtended(pinkyTip, landmarks[18], landmarks[17]);

    if (pointForward) return 'point_forward';

    // Palm Open - all fingers extended
    const palmOpen =
      isFingerExtended(thumbTip, landmarks[3], landmarks[2]) &&
      isFingerExtended(indexTip, landmarks[6], landmarks[5]) &&
      isFingerExtended(middleTip, landmarks[10], landmarks[9]) &&
      isFingerExtended(ringTip, landmarks[14], landmarks[13]) &&
      isFingerExtended(pinkyTip, landmarks[18], landmarks[17]);

    if (palmOpen) return 'palm_open';

    // Fist - all fingers closed
    const fist =
      !isFingerExtended(thumbTip, landmarks[3], landmarks[2]) &&
      !isFingerExtended(indexTip, landmarks[6], landmarks[5]) &&
      !isFingerExtended(middleTip, landmarks[10], landmarks[9]) &&
      !isFingerExtended(ringTip, landmarks[14], landmarks[13]) &&
      !isFingerExtended(pinkyTip, landmarks[18], landmarks[17]);

    if (fist) return 'fist';

    return 'none';
  }, []);

  // Process video frames
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !handLandmarkerRef.current || !isRunning) return;

    try {
      const results = handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());

      if (results.landmarks && results.landmarks.length > 0) {
        const hands: HandLandmarks[] = results.landmarks.map((landmarks, index) => ({
          landmarks,
          handedness: (results.handedness?.[index] as any)?.displayName as 'Left' | 'Right',
        }));

        const detectedGesture = detectGesture(hands);

        // Debounce gestures - only register if different from last gesture or enough time has passed
        const now = performance.now();
        if (
          detectedGesture !== 'none' &&
          (detectedGesture !== gestureDebounceRef.current.lastGesture ||
            now - gestureDebounceRef.current.timestamp > 500)
        ) {
          gestureDebounceRef.current = { lastGesture: detectedGesture, timestamp: now };

          const gestureEvent: GestureEvent = {
            gesture: detectedGesture,
            confidence: 0.85,
            timestamp: now,
            handedness: hands[0]?.handedness || 'Right',
          };

          setLastGesture(gestureEvent);
          setGestureHistory((prev) => [...prev.slice(-49), gestureEvent]); // Keep last 50
        }
      }
    } catch (err) {
      console.error('Frame processing error:', err);
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [isRunning, detectGesture]);

  // Start gesture recognition
  const start = useCallback(async () => {
    if (!isInitialized) {
      await initializeHandLandmarker();
    }

    if (cameraPermission !== 'granted') {
      await requestCameraPermission();
    }

    setIsRunning(true);
  }, [isInitialized, cameraPermission, initializeHandLandmarker, requestCameraPermission]);

  // Stop gesture recognition
  const stop = useCallback(() => {
    setIsRunning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    if (isRunning) {
      processFrame();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, processFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      handLandmarkerRef.current?.close();
      handLandmarkerRef.current = null;
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stop]);

  return {
    videoRef,
    canvasRef,
    isInitialized,
    isRunning,
    cameraPermission,
    lastGesture,
    gestureHistory,
    error,
    start,
    stop,
    requestCameraPermission,
    initializeHandLandmarker,
  };
};

export default useGestureRecognition;
