import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeVariant = 'dark-cyberpunk' | 'light-neon' | 'high-contrast' | 'minimal';

export interface ThemeConfig {
  variant: ThemeVariant;
  isDark: boolean;
  intensity: number;
  accentColor: string;
  glowIntensity: number;
  animationSpeed: number;
}

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (variant: ThemeVariant) => void;
  setIntensity: (intensity: number) => void;
  setGlowIntensity: (intensity: number) => void;
  setAnimationSpeed: (speed: number) => void;
  toggleTheme: () => void;
  availableThemes: ThemeVariant[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_CONFIGS: Record<ThemeVariant, Omit<ThemeConfig, 'intensity' | 'glowIntensity' | 'animationSpeed'>> = {
  'dark-cyberpunk': {
    variant: 'dark-cyberpunk',
    isDark: true,
    accentColor: '#ff00ff',
  },
  'light-neon': {
    variant: 'light-neon',
    isDark: false,
    accentColor: '#00ffff',
  },
  'high-contrast': {
    variant: 'high-contrast',
    isDark: true,
    accentColor: '#ffff00',
  },
  minimal: {
    variant: 'minimal',
    isDark: true,
    accentColor: '#00ff00',
  },
};

const THEME_STORAGE_KEY = 'portfolio-theme-config';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Invalid JSON, use default
      }
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return {
      variant: 'dark-cyberpunk',
      isDark: prefersDark,
      intensity: 85,
      accentColor: '#ff00ff',
      glowIntensity: 75,
      animationSpeed: 1,
    };
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', theme.variant);
    root.setAttribute('data-theme-mode', theme.isDark ? 'dark' : 'light');

    root.style.setProperty('--theme-intensity', `${theme.intensity}%`);
    root.style.setProperty('--glow-intensity', `${theme.glowIntensity}%`);
    root.style.setProperty('--animation-speed', `${theme.animationSpeed}`);
    root.style.setProperty('--accent-color', theme.accentColor);

    applyThemeStyles(theme);

    document.body.classList.remove('theme-dark-cyberpunk', 'theme-light-neon', 'theme-high-contrast', 'theme-minimal');
    document.body.classList.add(`theme-${theme.variant}`);
  }, [theme]);

  const setTheme = (variant: ThemeVariant) => {
    const config = THEME_CONFIGS[variant];
    setThemeState((prev) => ({
      ...prev,
      ...config,
    }));
  };

  const setIntensity = (intensity: number) => {
    setThemeState((prev) => ({
      ...prev,
      intensity: Math.max(0, Math.min(100, intensity)),
    }));
  };

  const setGlowIntensity = (glowIntensity: number) => {
    setThemeState((prev) => ({
      ...prev,
      glowIntensity: Math.max(0, Math.min(100, glowIntensity)),
    }));
  };

  const setAnimationSpeed = (speed: number) => {
    setThemeState((prev) => ({
      ...prev,
      animationSpeed: Math.max(0.5, Math.min(2, speed)),
    }));
  };

  const toggleTheme = () => {
    const variants: ThemeVariant[] = ['dark-cyberpunk', 'light-neon', 'high-contrast', 'minimal'];
    const currentIndex = variants.indexOf(theme.variant);
    const nextIndex = (currentIndex + 1) % variants.length;
    setTheme(variants[nextIndex]);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    setIntensity,
    setGlowIntensity,
    setAnimationSpeed,
    toggleTheme,
    availableThemes: Object.keys(THEME_CONFIGS) as ThemeVariant[],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

function applyThemeStyles(theme: ThemeConfig) {
  const root = document.documentElement;

  switch (theme.variant) {
    case 'dark-cyberpunk':
      root.style.setProperty('--bg-primary', '#0a0e27');
      root.style.setProperty('--bg-secondary', '#1a1f3a');
      root.style.setProperty('--text-primary', '#e0e0e0');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      root.style.setProperty('--neon-primary', '#ff00ff');
      root.style.setProperty('--neon-secondary', '#00ffff');
      root.style.setProperty('--neon-tertiary', '#00ff00');
      break;

    case 'light-neon':
      root.style.setProperty('--bg-primary', '#f5f5f5');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#404040');
      root.style.setProperty('--neon-primary', '#0099ff');
      root.style.setProperty('--neon-secondary', '#ff0099');
      root.style.setProperty('--neon-tertiary', '#00cc00');
      break;

    case 'high-contrast':
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#cccccc');
      root.style.setProperty('--neon-primary', '#ffff00');
      root.style.setProperty('--neon-secondary', '#00ffff');
      root.style.setProperty('--neon-tertiary', '#ff00ff');
      break;

    case 'minimal':
      root.style.setProperty('--bg-primary', '#0f1419');
      root.style.setProperty('--bg-secondary', '#1a2332');
      root.style.setProperty('--text-primary', '#d0d0d0');
      root.style.setProperty('--text-secondary', '#909090');
      root.style.setProperty('--neon-primary', '#00ff00');
      root.style.setProperty('--neon-secondary', '#00aa00');
      root.style.setProperty('--neon-tertiary', '#008800');
      break;
  }
}

export const getThemeDescription = (variant: ThemeVariant): string => {
  const descriptions: Record<ThemeVariant, string> = {
    'dark-cyberpunk': 'Deep space blacks with extreme neon glows - maximum immersion',
    'light-neon': 'Bright backgrounds with inverted neon colors - eye-friendly',
    'high-contrast': 'Maximum contrast for accessibility - clarity focused',
    minimal: 'Reduced visual intensity - comfort mode',
  };
  return descriptions[variant];
};

export const getThemeIcon = (variant: ThemeVariant): string => {
  const icons: Record<ThemeVariant, string> = {
    'dark-cyberpunk': '🌌',
    'light-neon': '☀️',
    'high-contrast': '⚡',
    minimal: '🌙',
  };
  return icons[variant];
};
