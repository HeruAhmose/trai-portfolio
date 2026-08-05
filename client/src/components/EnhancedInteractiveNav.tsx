import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDebouncedSounds } from '@/hooks/useDebouncedSounds';
import { HolographicEffects } from './HolographicEffects';

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface EnhancedInteractiveNavProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  soundEnabled?: boolean;
  holographicEnabled?: boolean;
}

export const EnhancedInteractiveNav: React.FC<EnhancedInteractiveNavProps> = ({
  items,
  activeItem,
  onItemClick,
  soundEnabled = true,
  holographicEnabled = true,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { playHover, playClick, playTransition } = useDebouncedSounds(soundEnabled);

  const handleItemClick = (id: string) => {
    playClick();
    // Transition sound plays after a short delay to avoid overlap
    setTimeout(() => playTransition(), 150);
    onItemClick(id);
  };

  const handleItemHover = (id: string) => {
    setHoveredItem(id);
    // Reduce hover sound frequency
    if (Math.random() > 0.6) {
      playHover();
    }
  };

  return (
    <HolographicEffects intensity={0.4} glitchEnabled={false}>
      <nav className="flex flex-wrap gap-2 p-4 rounded-lg bg-black/50 backdrop-blur-md border border-cyan-500/30">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            onMouseEnter={() => handleItemHover(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`
              relative px-4 py-2 rounded-lg font-semibold tracking-wider
              transition-all duration-200
              ${activeItem === item.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/50'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 text-cyan-300 hover:text-cyan-100'
              }
            `}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={hoveredItem === item.id ? {
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.2)'
              } : {
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
              }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: 'none' }}
            />

            {/* Content */}
            <motion.span
              className="relative z-10 flex items-center gap-2"
              animate={hoveredItem === item.id ? { x: 3 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.icon}
              {item.label}
            </motion.span>

            {/* Active indicator */}
            {activeItem === item.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400"
                layoutId="activeIndicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>
    </HolographicEffects>
  );
};

export default EnhancedInteractiveNav;
