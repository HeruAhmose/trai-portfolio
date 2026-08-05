import { useNeonCursorTrailWithSound } from '@/hooks/useNeonCursorTrailWithSound';
import { useEffect, useState } from 'react';

interface SoundReactiveCursorTrailProps {
  enabled?: boolean;
  soundReactive?: boolean;
}

export const SoundReactiveCursorTrail = ({ 
  enabled = true, 
  soundReactive = true 
}: SoundReactiveCursorTrailProps) => {
  const canvasRef = useNeonCursorTrailWithSound(enabled, soundReactive);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        mixBlendMode: 'screen',
      }}
    />
  );
};
