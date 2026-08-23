import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Volume2, VolumeX, Search, Trophy, Brain, Code, ChevronDown } from 'lucide-react';
import '../styles/premiumDesign.css';
import { NotificationBell } from './NotificationBell';

interface PremiumNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  onSearchOpen?: () => void;
  sessionId?: string;
}

/**
 * Premium Navigation Component — Enhanced with search, notifications, and all new sections
 */
export const PremiumNavigation: React.FC<PremiumNavigationProps> = ({
  activeTab,
  onTabChange,
  isMuted,
  onMuteToggle,
  onSearchOpen,
  sessionId = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryNav = [
    { id: 'hero', label: 'Home' },
    { id: 'materials', label: 'Materials' },
    { id: 'quantum', label: 'Quantum' },
    { id: 'energy', label: 'Energy' },
    { id: 'community', label: 'Community' },
    { id: 'research', label: 'Research' },
    { id: 'patents', label: 'Patents' },
  ];

  const moreNav = [
    { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
    { id: 'applications', label: 'Applications', icon: '🔧' },
    { id: 'timeline', label: 'Timeline', icon: '⏳' },
    { id: 'advanced', label: 'Advanced Features', icon: '🚀' },
    { id: 'true-melange', label: 'True Mélange Φ', icon: '🌿' },
    { id: 'queen-califia', label: 'Queen Califia', icon: '👑' },
    { id: 'trai-coin', label: 'TRAI Coin', icon: '◇' },
    { id: 'founder', label: 'Jonathan Peoples', icon: '◉' },
    { id: 'peoples-foundation', label: 'The Peoples Foundation', icon: '◈' },
    { id: 'contact', label: 'Contact', icon: '◎' },
    { id: 'gamification', label: 'Achievements', icon: '🏆' },
    { id: 'ai-insights', label: 'AI Insights', icon: '🧠' },
    { id: 'api-docs', label: 'API Docs', icon: '📚' },
    { id: 'search', label: 'Search', icon: '🔍' },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setIsOpen(false);
    setMoreOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-accent-gold/20"
      style={{
        background: 'linear-gradient(180deg, rgba(5,6,7,0.97) 0%, rgba(10,13,16,0.90) 100%)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }}>
          <a href={import.meta.env.BASE_URL} className="flex items-center gap-3 text-2xl font-bold text-gradient tracking-widest">
            TRAI
            <img
              src={`${import.meta.env.BASE_URL}media/archive/founder-portrait.jpg`}
              alt="Jonathan Peoples"
              className="w-8 h-8 rounded-full object-cover object-top border border-[#d8aa43]/30 hidden xl:block"
              style={{ filter: 'none' }}
            />
          </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {primaryNav.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  activeTab === item.id ? 'text-accent-gold' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-gold to-accent-cyan"
                    layoutId="navUnderline"
                    transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                  />
                )}
              </motion.button>
            ))}

            {/* More dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                More
                <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-[#0a0d10] border border-[#d6a33a]/20 rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                    >
                      {moreNav.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#d6a33a]/10 ${
                            activeTab === item.id ? 'text-[#d6a33a]' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-1.5">
            {/* Search Button */}
            <motion.button
              onClick={onSearchOpen}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#d6a33a]/30 hover:bg-[#d6a33a]/5 transition-all text-sm text-white/50 hover:text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Search (Cmd+K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-xs">Search</span>
              <kbd className="hidden xl:inline text-xs bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </motion.button>

            {/* Notification Bell */}
            {sessionId && <NotificationBell sessionId={sessionId} />}

            {/* Sound Toggle */}
            <motion.button
              onClick={onMuteToggle}
              className="p-2 rounded-lg hover:bg-[#d6a33a]/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-[#d6a33a]" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#d6a33a]" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#d6a33a]/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-[#d6a33a]" />
              ) : (
                <Menu className="w-6 h-6 text-[#d6a33a]" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden pb-4 space-y-1 border-t border-white/5 pt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {[...primaryNav, ...moreNav].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-[#d6a33a]/20 text-[#d6a33a]'
                      : 'text-gray-300 hover:bg-[#d6a33a]/10 hover:text-white'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {'icon' in item ? `${item.icon} ${item.label}` : item.label}
                </motion.button>
              ))}
              {onSearchOpen && (
                <motion.button
                  onClick={() => { onSearchOpen(); setIsOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#d6a33a]/10 hover:text-white transition-all"
                  whileHover={{ x: 4 }}
                >
                  🔍 Search (⌘K)
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
