import { useNeonCursorTrail } from "@/hooks/useNeonCursorTrail";
import { useEffect, useState } from "react";

interface NeonCursorTrailProps {
  enabled?: boolean;
}

export const NeonCursorTrail = ({ enabled = true }: NeonCursorTrailProps) => {
  const canvasRef = useNeonCursorTrail(enabled);
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
        mixBlendMode: "screen",
      }}
    />
  );
};
