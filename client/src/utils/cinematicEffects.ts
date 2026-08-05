/**
 * Cinematic Effects Utilities
 * Inspired by TRAI's advanced visual patterns
 */

export interface ParallaxConfig {
  depth: number;
  speed?: number;
}

export interface AuroraConfig {
  hue: number;
  saturation: number;
  duration: number;
}

/**
 * Calculate parallax offset based on scroll position
 */
export const calculateParallax = (scrollY: number, depth: number): number => {
  return scrollY * depth;
};

/**
 * Generate aurora effect animation
 */
export const generateAuroraKeyframes = (config: AuroraConfig) => {
  return `
    @keyframes aurora-${config.hue} {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      50% {
        opacity: 0.6;
        filter: hue-rotate(${config.hue}deg) saturate(${config.saturation}%);
      }
      100% {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
  `;
};

/**
 * Create orbital system animation
 */
export const generateOrbitalKeyframes = (orbitIndex: number) => {
  const duration = 20 + orbitIndex * 5;
  return `
    @keyframes orbit-${orbitIndex} {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
};

/**
 * Generate telemetry label animation
 */
export const generateTelemetryKeyframes = (labelIndex: number) => {
  const delay = labelIndex * 0.2;
  return `
    @keyframes telemetry-${labelIndex} {
      0% {
        opacity: 0;
        transform: translateX(-10px);
      }
      ${delay * 100}% {
        opacity: 0;
      }
      ${delay * 100 + 20}% {
        opacity: 1;
        transform: translateX(0);
      }
      100% {
        opacity: 1;
      }
    }
  `;
};

/**
 * Create vector gradient for SVG graphics
 */
export const createVectorGradient = (
  id: string,
  colors: Array<{ offset: number; color: string; opacity: number }>
) => {
  return `
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      ${colors.map((c) => `<stop offset="${c.offset}%" stop-color="${c.color}" stop-opacity="${c.opacity}"/>`).join('')}
    </linearGradient>
  `;
};

/**
 * Generate glow filter for SVG
 */
export const createGlowFilter = (id: string, color: string, intensity: number = 4) => {
  return `
    <filter id="${id}" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="${intensity}" result="blur"/>
      <feFlood flood-color="${color}" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `;
};

/**
 * Pointer aura effect
 */
export const setupPointerAura = (element: HTMLElement) => {
  const updatePointerPosition = (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    element.style.setProperty('--pointer-x', `${x}px`);
    element.style.setProperty('--pointer-y', `${y}px`);
  };

  document.addEventListener('pointermove', updatePointerPosition);

  return () => {
    document.removeEventListener('pointermove', updatePointerPosition);
  };
};

/**
 * Scroll progress tracking
 */
export const setupScrollProgress = (element: HTMLElement) => {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    element.style.transform = `scaleX(${ratio})`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });

  return () => {
    window.removeEventListener('scroll', updateProgress);
  };
};

/**
 * Motion preference detection
 */
export const getMotionPreference = (): 'reduce' | 'normal' => {
  if (typeof window === 'undefined') return 'normal';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'normal';
};

/**
 * Starfield canvas generation
 */
export const generateStarfield = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars: Array<{ x: number; y: number; radius: number; opacity: number }> = [];
  const starCount = Math.floor((canvas.width * canvas.height) / 10000);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      opacity: Math.random() * 0.5 + 0.5,
    });
  }

  const drawStars = () => {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      ctx.fillStyle = `rgba(240, 207, 123, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling effect
      star.opacity += (Math.random() - 0.5) * 0.02;
      star.opacity = Math.max(0.2, Math.min(1, star.opacity));
    });

    requestAnimationFrame(drawStars);
  };

  drawStars();

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
};
