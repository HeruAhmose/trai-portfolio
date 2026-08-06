import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  audioEnabled: boolean;
  onAudioToggle: () => void;
}

const sections = [
  { id: 'home', label: 'SOVEREIGN INTELLIGENCE' },
  { id: 'materials', label: 'MATERIAL SCIENCE' },
  { id: 'community', label: 'COMMUNITY IMPACT' },
  { id: 'research', label: 'RESEARCH LAB' },
];

export default function Navigation({
  activeSection,
  onNavigate,
  audioEnabled,
  onAudioToggle,
}: NavigationProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-primary neon-text">◉</div>
          <span className="font-mono text-sm tracking-widest text-foreground hidden sm:inline">
            JONATHAN PEOPLES
          </span>
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              className="relative font-mono text-xs tracking-widest transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`${
                  activeSection === section.id
                    ? 'text-primary neon-text'
                    : hoveredSection === section.id
                      ? 'text-cyan-400'
                      : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {section.label}
              </span>
              {activeSection === section.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Audio Control */}
        <motion.button
          onClick={onAudioToggle}
          className="p-2 rounded border border-border hover:border-primary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled ? (
            <Volume2 className="w-5 h-5 text-primary" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}
