import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CinematicOpening } from '../components/CinematicOpening';
import { VisualStorytellingFramework } from '../components/VisualStorytellingFramework';
import { ParallaxDepthLayer } from '../components/ParallaxDepthLayer';
import { AdvancedTimeline } from '../components/AdvancedTimeline';
import { ImmersiveProjectShowcase } from './ImmersiveProjectShowcase';

/**
 * Cinematic Home Page
 * Integrates all advanced visual components into a cohesive narrative experience
 */

export const HomeCinematic: React.FC = () => {
  const [showOpening, setShowOpening] = useState(true);
  const [hasSeenOpening, setHasSeenOpening] = useState(false);

  useEffect(() => {
    // Check if user has seen opening before
    const seen = localStorage.getItem('cinematicOpening');
    if (seen) {
      setShowOpening(false);
      setHasSeenOpening(true);
    }
  }, []);

  const handleOpeningComplete = () => {
    setShowOpening(false);
    localStorage.setItem('cinematicOpening', 'true');
  };

  if (showOpening && !hasSeenOpening) {
    return <CinematicOpening onComplete={handleOpeningComplete} />;
  }

  return (
    <div className="w-full bg-background">
      {/* Hero Section with Parallax Depth */}
      <ParallaxDepthLayer>
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 1920 1080">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="url(#gridGradient)"
                    strokeWidth="0.5"
                  />
                </pattern>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect width="1920" height="1080" fill="url(#grid)" />
            </svg>
          </div>

          {/* Hero content */}
          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto px-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.h1
              className="text-8xl font-black mb-6 bg-gradient-to-r from-accent-gold via-accent-cyan to-accent-magenta bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              SOVEREIGN TECH
            </motion.h1>

            <motion.p
              className="text-3xl text-accent-cyan mb-8 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Where Innovation Meets Impact
            </motion.p>

            <motion.p
              className="text-xl text-gray-300 mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              Exploring quantum frontiers, advancing materials science, and building technology for humanity
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-6 justify-center flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <motion.button
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-accent-gold to-accent-cyan text-black font-bold text-lg hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Projects
              </motion.button>

              <motion.button
                className="px-8 py-4 rounded-lg border-2 border-accent-cyan text-accent-cyan font-bold text-lg hover:bg-accent-cyan/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Timeline
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-accent-cyan text-sm font-mono mb-2">SCROLL TO EXPLORE</div>
            <div className="w-6 h-10 border-2 border-accent-cyan rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-accent-cyan rounded-full"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>
      </ParallaxDepthLayer>

      {/* Visual Storytelling Section */}
      <VisualStorytellingFramework />

      {/* Immersive Project Showcase */}
      <ImmersiveProjectShowcase />

      {/* Advanced Timeline */}
      <AdvancedTimeline />

      {/* Call to Action Section */}
      <section className="relative w-full py-24 bg-gradient-to-b from-background to-black overflow-hidden">
        <motion.div
          className="max-w-4xl mx-auto text-center px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-accent-gold via-accent-cyan to-accent-magenta bg-clip-text text-transparent">
            Ready to Collaborate?
          </h2>

          <p className="text-xl text-gray-400 mb-12">
            Let's explore how we can work together to create something extraordinary
          </p>

          <motion.button
            className="px-12 py-4 rounded-lg bg-gradient-to-r from-accent-gold to-accent-cyan text-black font-bold text-lg hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default HomeCinematic;
