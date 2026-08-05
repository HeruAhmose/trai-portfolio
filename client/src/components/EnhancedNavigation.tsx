import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudioSystem } from '@/hooks/useAudioSystem';

interface NavTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const NAVIGATION_TABS: NavTab[] = [
  { id: 'hero', label: 'HERO' },
  { id: 'sovereign', label: 'SOVEREIGN INTELLIGENCE' },
  { id: 'materials', label: 'MATERIAL SCIENCE' },
  { id: 'energy', label: 'ENERGY HARVESTING' },
  { id: 'manufacturing', label: 'MANUFACTURING' },
  { id: 'quantum', label: 'QUANTUM' },
  { id: 'applications', label: 'APPLICATIONS' },
  { id: 'patents', label: 'PATENT CLAIMS' },
  { id: 'community', label: 'COMMUNITY IMPACT' },
  { id: 'research', label: 'RESEARCH LAB' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'dashboard', label: 'DATA DASHBOARD' },
  { id: 'annotations', label: 'ANNOTATIONS' },
  { id: 'quantum-sim', label: 'QUANTUM SIMULATOR' },
  { id: 'advanced', label: 'ADVANCED FEATURES' },
  { id: 'about', label: 'ABOUT' },
  { id: 'contact', label: 'CONTACT' },
];

interface EnhancedNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
}

export const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  activeTab,
  onTabChange,
  isMuted,
  onMuteToggle,
}) => {
  const { playClickSound } = useAudioSystem();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    if (!isMuted) {
      playClickSound();
    }
    // Navigate to route for special tabs
    const routeMap: Record<string, string> = {
      'patents': '/patent-claims',
      'advanced': '/advanced-features',
      'dashboard': '/dashboard',
      'annotations': '/annotations',
      'quantum-sim': '/quantum-simulator',
    };
    
    if (routeMap[tabId]) {
      window.location.href = routeMap[tabId];
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 right-0 z-40 bg-gradient-to-b from-background via-background/95 to-transparent backdrop-blur-md border-b border-primary/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div
            className="text-2xl font-bold tracking-widest animate-glow-pulse"
          >
            <span className="text-primary">PEOPLES</span>
            <span className="text-cyan-400 ml-2">PORTFOLIO</span>
          </div>

          <motion.button
            onClick={onMuteToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap gap-2 overflow-x-auto pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {NAVIGATION_TABS.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`px-4 py-2 rounded-lg font-mono text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-background shadow-lg shadow-primary/50'
                  : 'bg-background/50 text-foreground/70 hover:text-foreground border border-primary/30 hover:border-primary/60'
              }`}
              style={{
                boxShadow:
                  activeTab === tab.id
                    ? '0 0 20px rgba(255,215,0,0.6), inset 0 0 10px rgba(255,215,0,0.2)'
                    : hoveredTab === tab.id
                      ? '0 0 15px rgba(255,215,0,0.3)'
                      : 'none',
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Active Tab Indicator */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-cyan-400 to-primary"
        layoutId="activeTabIndicator"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.nav>
  );
};

export default EnhancedNavigation;
