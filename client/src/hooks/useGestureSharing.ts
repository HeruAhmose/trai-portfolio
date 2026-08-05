import React, { useEffect, useCallback, useRef } from 'react';

export interface GestureShareConfig {
  onPeaceGesture?: () => void;
  onThumbsUpGesture?: () => void;
  onPointGesture?: () => void;
}

/**
 * Hook for gesture-triggered sharing
 * Detects specific hand gestures and triggers share actions
 */
export const useGestureSharing = (config: GestureShareConfig) => {
  const lastGestureRef = useRef<string | null>(null);
  const gestureTimestampRef = useRef<number>(0);
  const debounceTimeRef = useRef<number>(1000); // 1 second debounce

  const handleGesture = useCallback((gestureName: string) => {
    const now = Date.now();

    // Debounce repeated gestures
    if (lastGestureRef.current === gestureName && now - gestureTimestampRef.current < debounceTimeRef.current) {
      return;
    }

    lastGestureRef.current = gestureName;
    gestureTimestampRef.current = now;

    // Trigger appropriate callback
    switch (gestureName) {
      case 'peace':
        config.onPeaceGesture?.();
        break;
      case 'thumbs_up':
        config.onThumbsUpGesture?.();
        break;
      case 'point':
        config.onPointGesture?.();
        break;
      default:
        break;
    }
  }, [config]);

  // Listen for gesture events from gesture recognition system
  useEffect(() => {
    const handleGestureEvent = (event: CustomEvent) => {
      const { gestureName } = event.detail;
      handleGesture(gestureName);
    };

    window.addEventListener('gesture-detected', handleGestureEvent as EventListener);

    return () => {
      window.removeEventListener('gesture-detected', handleGestureEvent as EventListener);
    };
  }, [handleGesture]);

  const triggerGestureShare = useCallback((gestureName: string) => {
    handleGesture(gestureName);
  }, [handleGesture]);

  return {
    triggerGestureShare,
    lastGesture: lastGestureRef.current,
  };
};

/**
 * Emit gesture event for sharing
 */
export const emitGestureShareEvent = (gestureName: string) => {
  const event = new CustomEvent('gesture-detected', {
    detail: { gestureName },
  });
  window.dispatchEvent(event);
};

/**
 * Hook for tracking share events
 */
export const useShareTracking = () => {
  const trackShare = useCallback(async (sectionId: string, platform: string) => {
    try {
      // Track share event (could be sent to analytics)
      const event = {
        type: 'share',
        sectionId,
        platform,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      };

      // Log to console for now
      console.log('[Share Tracked]', event);

      // In production, send to analytics service
      // await fetch('/api/analytics/share', { method: 'POST', body: JSON.stringify(event) });
    } catch (error) {
      console.error('[Share Tracking Error]', error);
    }
  }, []);

  return { trackShare };
};

/**
 * Hook for generating share URLs
 */
export const useShareUrls = (sectionId: string, sectionTitle: string, description: string) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const generateTwitterUrl = useCallback(() => {
    const text = `${sectionTitle} - ${description.substring(0, 80)}...`;
    const url = `${baseUrl}?section=${sectionId}`;
    const params = new URLSearchParams({ text, url });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [sectionId, sectionTitle, description, baseUrl]);

  const generateLinkedInUrl = useCallback(() => {
    const url = `${baseUrl}?section=${sectionId}`;
    const params = new URLSearchParams({
      url,
      title: sectionTitle,
      summary: description,
    });
    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
  }, [sectionId, sectionTitle, description, baseUrl]);

  const generateFacebookUrl = useCallback(() => {
    const url = `${baseUrl}?section=${sectionId}`;
    const params = new URLSearchParams({ u: url, quote: sectionTitle });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }, [sectionId, sectionTitle, baseUrl]);

  const generateInstagramUrl = useCallback(() => {
    const text = `${sectionTitle}\n\n${description}\n\nCheck it out: ${baseUrl}?section=${sectionId}`;
    return `instagram://share?text=${encodeURIComponent(text)}`;
  }, [sectionId, sectionTitle, description, baseUrl]);

  return {
    twitter: generateTwitterUrl(),
    linkedin: generateLinkedInUrl(),
    facebook: generateFacebookUrl(),
    instagram: generateInstagramUrl(),
  };
};

/**
 * Hook for share button visibility based on gestures
 */
export const useShareButtonVisibility = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleGestureEvent = (event: CustomEvent) => {
      const { gestureName } = event.detail;

      // Show share menu on peace or thumbs up gesture
      if (gestureName === 'peace' || gestureName === 'thumbs_up') {
        setIsVisible(true);

        // Auto-hide after 3 seconds
        const timer = setTimeout(() => setIsVisible(false), 3000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('gesture-detected', handleGestureEvent as EventListener);

    return () => {
      window.removeEventListener('gesture-detected', handleGestureEvent as EventListener);
    };
  }, []);

  return { isVisible, setIsVisible };
};
