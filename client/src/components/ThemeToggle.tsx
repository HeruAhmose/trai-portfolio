import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme, getThemeDescription, getThemeIcon, type ThemeVariant } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, setIntensity, setGlowIntensity, setAnimationSpeed, toggleTheme, availableThemes } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setShowMenu(!showMenu)}
          className="cyberpunk-button flex items-center gap-2"
          title="Theme settings"
        >
          <span className="text-lg">{getThemeIcon(theme.variant)}</span>
          <span className="hidden sm:inline capitalize">{theme.variant.replace('-', ' ')}</span>
        </Button>
      </motion.div>

      {/* Theme Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50 w-80"
          >
            <Card className="p-6 bg-deep-blue border-neon-cyan/50 shadow-lg shadow-neon-cyan/20 space-y-4">
              {/* Theme Variants */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neon-cyan">Theme Variants</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableThemes.map((variant) => (
                    <motion.button
                      key={variant}
                      onClick={() => setTheme(variant)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        theme.variant === variant
                          ? 'border-neon-pink bg-neon-pink/20'
                          : 'border-border/30 hover:border-neon-cyan/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{getThemeIcon(variant)}</div>
                      <div className="text-xs capitalize font-semibold">{variant.replace('-', ' ')}</div>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic mt-2">{getThemeDescription(theme.variant)}</p>
              </div>

              {/* Intensity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-neon-cyan">Visual Intensity</label>
                  <span className="text-xs text-muted-foreground">{theme.intensity}%</span>
                </div>
                <Slider
                  value={[theme.intensity]}
                  onValueChange={([value]) => setIntensity(value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Glow Intensity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-neon-cyan">Glow Intensity</label>
                  <span className="text-xs text-muted-foreground">{theme.glowIntensity}%</span>
                </div>
                <Slider
                  value={[theme.glowIntensity]}
                  onValueChange={([value]) => setGlowIntensity(value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Animation Speed Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-neon-cyan">Animation Speed</label>
                  <span className="text-xs text-muted-foreground">{theme.animationSpeed.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[theme.animationSpeed]}
                  onValueChange={([value]) => setAnimationSpeed(value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t border-border/30 space-y-2">
                <Button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="w-full cyberpunk-button text-sm"
                >
                  Next Theme
                </Button>
                <Button
                  onClick={() => setShowMenu(false)}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Compact Theme Toggle (for navbar)
 */
export const CompactThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink transition-colors"
      title={`Current theme: ${theme.variant}`}
    >
      <span className="text-xl">{getThemeIcon(theme.variant)}</span>
    </motion.button>
  );
};

/**
 * Theme Indicator Badge
 */
export const ThemeIndicator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
      <span className="text-sm">{getThemeIcon(theme.variant)}</span>
      <span className="text-xs font-semibold text-neon-cyan capitalize">{theme.variant.replace('-', ' ')}</span>
      <span className="text-xs text-muted-foreground">({theme.intensity}%)</span>
    </div>
  );
};
