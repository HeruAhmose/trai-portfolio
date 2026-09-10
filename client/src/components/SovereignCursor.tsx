import { useEffect, useRef, useState } from "react";

/**
 * SovereignCursor — restrained gold pointer halo for fine-pointer devices.
 * It never replaces the native cursor, never captures pointer events, and is
 * disabled for coarse pointers or prefers-reduced-motion visitors.
 */
export function SovereignCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener?.("change", sync);
    reduced.addEventListener?.("change", sync);
    return () => {
      fine.removeEventListener?.("change", sync);
      reduced.removeEventListener?.("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = cursorRef.current;
    if (!el) return;

    const onMove = (event: MouseEvent) => {
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      el.style.opacity = "1";
    };
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const interactive = Boolean(
        target.closest('button, a, [role="button"], input, textarea, select, [tabindex]')
      );
      el.dataset.interactive = interactive ? "true" : "false";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      data-sovereign-cursor="true"
      data-interactive="false"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[2147481500] h-7 w-7 rounded-full border border-[#d8aa43]/65 opacity-0 mix-blend-screen transition-[width,height,border-color,box-shadow,opacity] duration-200 data-[interactive=true]:h-11 data-[interactive=true]:w-11 data-[interactive=true]:border-[#f4d987]/90 data-[interactive=true]:shadow-[0_0_24px_rgba(216,170,67,.34)]"
      style={{
        boxShadow: "0 0 16px rgba(216,170,67,.18)",
        willChange: "transform",
      }}
    />
  );
}
