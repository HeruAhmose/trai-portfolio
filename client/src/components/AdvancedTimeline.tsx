import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Advanced Timeline Visualization
 * Cinematic timeline with depth, parallax, and interactive elements
 */

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: 'achievement' | 'publication' | 'project';
  color: string;
  impact: number;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 2019,
    title: 'Quantum Research Initiative',
    description: 'Started quantum computing research program',
    category: 'achievement',
    color: '#00d9ff',
    impact: 8,
  },
  {
    year: 2020,
    title: 'First Publication',
    description: 'Published groundbreaking research in quantum algorithms',
    category: 'publication',
    color: '#d4af37',
    impact: 9,
  },
  {
    year: 2021,
    title: 'Materials Innovation',
    description: 'Developed novel materials for energy storage',
    category: 'project',
    color: '#ff006e',
    impact: 7,
  },
  {
    year: 2022,
    title: 'Community Platform Launch',
    description: 'Released open-source community engagement platform',
    category: 'project',
    color: '#00d9ff',
    impact: 8,
  },
  {
    year: 2023,
    title: 'Industry Recognition',
    description: 'Received multiple industry awards and recognition',
    category: 'achievement',
    color: '#d4af37',
    impact: 9,
  },
  {
    year: 2024,
    title: 'Global Impact',
    description: 'Technology adopted by 50+ organizations worldwide',
    category: 'achievement',
    color: '#ff006e',
    impact: 10,
  },
];

export const AdvancedTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeEvent, setActiveEvent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full py-32 bg-background overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(0, 217, 255, ${0.1 * scrollProgress}) 0%,
            rgba(212, 175, 55, ${0.05 * scrollProgress}) 50%,
            rgba(255, 0, 110, ${0.1 * scrollProgress}) 100%
          )`,
        }}
      />

      {/* Timeline container */}
      <div className="relative max-w-6xl mx-auto px-8">
        {/* Title */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl font-black bg-gradient-to-r from-accent-gold via-accent-cyan to-accent-magenta bg-clip-text text-transparent mb-4">
            JOURNEY THROUGH TIME
          </h2>
          <p className="text-xl text-gray-400">A chronicle of innovation and impact</p>
        </motion.div>

        {/* Central timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent-gold via-accent-cyan to-accent-magenta" />

        {/* Timeline events */}
        <div className="space-y-24">
          {timelineEvents.map((event, i) => (
            <motion.div
              key={event.year}
              className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-12`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              onMouseEnter={() => setActiveEvent(i)}
            >
              {/* Event card */}
              <motion.div
                className="flex-1 p-8 rounded-xl border-2 backdrop-blur-xl cursor-pointer group"
                style={{
                  borderColor: event.color,
                  backgroundColor: `${event.color}10`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px ${event.color}40`,
                }}
              >
                {/* Year badge */}
                <motion.div
                  className="inline-block px-4 py-2 rounded-full text-sm font-mono mb-4"
                  style={{
                    backgroundColor: `${event.color}20`,
                    color: event.color,
                  }}
                >
                  {event.year}
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-accent-cyan transition-colors">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-4">{event.description}</p>

                {/* Impact meter */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Impact Level</span>
                    <span style={{ color: event.color }} className="font-mono">
                      {event.impact}/10
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: event.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${event.impact * 10}%` }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>

                {/* Category badge */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    {event.category}
                  </span>
                </div>
              </motion.div>

              {/* Timeline dot */}
              <motion.div
                className="flex-shrink-0 w-6 h-6 rounded-full border-4 bg-background"
                style={{
                  borderColor: event.color,
                }}
                animate={{
                  scale: activeEvent === i ? 1.5 : 1,
                  boxShadow: activeEvent === i ? `0 0 20px ${event.color}` : 'none',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Timeline progress indicator */}
        <motion.div
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="text-right">
            <div className="text-sm font-mono text-accent-gold mb-4">
              PROGRESS: {Math.round(scrollProgress * 100)}%
            </div>
            <div className="w-1 h-32 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="w-full bg-gradient-to-b from-accent-gold via-accent-cyan to-accent-magenta rounded-full"
                style={{
                  height: `${scrollProgress * 100}%`,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
