import { useEffect, useRef } from 'react';

/**
 * SovereignCursor — custom gold cursor that tracks mouse position
 * Expands on hover over interactive elements
 */
export function SovereignCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], input, textarea, select, [tabindex]')) {
        el.classList.add('hovering');
      }
    };

    const onLeave = () => el.classList.remove('hovering');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return <div id="sovereign-cursor" ref={cursorRef} />;
}
