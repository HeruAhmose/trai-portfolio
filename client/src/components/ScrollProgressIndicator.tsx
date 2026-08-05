import React, { useEffect, useState } from 'react';

/**
 * A thin gold line along the left edge of the viewport that fills as the visitor scrolls.
 * Reinforces the sense of journey depth without adding visual noise.
 */
export function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 bottom-0 z-[60] pointer-events-none"
      style={{ width: 2 }}
    >
      {/* Track */}
      <div className="absolute inset-0" style={{ background: 'rgba(216,170,67,0.08)' }} />
      {/* Fill */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: `${progress * 100}%`,
          background: 'linear-gradient(to bottom, rgba(216,170,67,0.9), rgba(216,170,67,0.4))',
          transition: 'height 0.1s linear',
          boxShadow: '0 0 8px rgba(216,170,67,0.4)',
        }}
      />
    </div>
  );
}

