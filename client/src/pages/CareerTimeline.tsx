import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import TimelineEvent, { TimelineEventData } from '@/components/TimelineEvent';
import {
  AfroGradientText,
  AfroDivider,
} from '@/components/AfrofuturisticTech';
import { ScrollReveal, StaggeredReveal } from '@/components/AdvancedVisualEffects';
import { useAudioSystem } from '@/hooks/useAudioSystem';
import { Award, Zap, Target, Rocket, Brain, Shield } from 'lucide-react';

const CAREER_MILESTONES: TimelineEventData[] = [
  {
    id: '1',
    year: 2018,
    title: 'Cybersecurity Foundation',
    description: 'Began advanced cybersecurity research and threat analysis',
    achievement: 'First publication',
    details: [
      'Developed threat detection algorithms',
      'Published initial research findings',
      'Built security frameworks',
    ],
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-red-500 to-red-700 border-red-500',
    side: 'left',
  },
  {
    id: '2',
    year: 2019,
    title: 'Material Science Breakthrough',
    description: 'Pioneering multi-modal composite transduction research',
    achievement: '5 patent claims',
    details: [
      'Discovered novel material properties',
      'Filed initial patent applications',
      'Established research laboratory',
      'Collaborated with international teams',
    ],
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-afro-gold to-afro-terracotta border-afro-gold',
    side: 'right',
  },
  {
    id: '3',
    year: 2020,
    title: 'Sovereign Tech Initiative',
    description: 'Launched sovereign intelligence framework development',
    achievement: 'Quantum-ready architecture',
    details: [
      'Architected quantum-resistant systems',
      'Developed decentralized protocols',
      'Established sovereign tech standards',
      'Built international partnerships',
    ],
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-500',
    side: 'left',
  },
  {
    id: '4',
    year: 2021,
    title: 'Community Impact Launch',
    description: 'Founded TechBridge Collective for digital equity',
    achievement: 'TechBridge Collective founded',
    details: [
      'Bridged digital divide in North Carolina',
      'Deployed H.K. AI assistance',
      'Trained human navigators',
      'Serving the Triangle Area (Durham, Raleigh, Chapel Hill)',
    ],
    icon: <Target className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-afro-emerald to-green-700 border-afro-emerald',
    side: 'right',
  },
  {
    id: '5',
    year: 2023,
    title: 'Advanced AI Integration',
    description: 'Developed H.K. Assistant with divine voice alternation',
    achievement: 'Black American voice synthesis',
    details: [
      'Implemented advanced voice synthesis',
      'Created divine voice alternation system',
      'Integrated gesture recognition',
      'Built real-time collaboration features',
    ],
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-cyan-500 to-blue-700 border-cyan-500',
    side: 'left',
  },
  {
    id: '6',
    year: 2024,
    title: 'Afrofuturistic Portfolio',
    description: 'Created innovative portfolio with advanced tech aesthetics',
    achievement: 'Afrofuturistic portfolio built',
    details: [
      'Designed Afrofuturistic design system',
      'Implemented 3D project gallery',
      'Built gesture recognition system',
      'Created sound-reactive effects',
      'Developed real-time collaboration',
    ],
    icon: <Rocket className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-afro-gold to-afro-sapphire border-afro-gold',
    side: 'right',
  },
  {
    id: '7',
    year: 2025,
    title: 'Material Science Expansion',
    description: '25 patent claims and international recognition',
    achievement: '25 patent claims filed',
    details: [
      'Advanced composite material research',
      'International collaboration agreements',
      'Commercial applications development',
      'Academic publications and presentations',
    ],
    icon: <Award className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-afro-terracotta to-orange-700 border-afro-terracotta',
    side: 'left',
  },
  {
    id: '8',
    year: 2026,
    title: 'Future Vision',
    description: 'Continuing innovation in sovereign tech and AI',
    achievement: 'Ongoing research',
    details: [
      'Quantum computing integration',
      'Global digital equity expansion',
      'Advanced AI systems development',
      'Sustainable technology innovation',
    ],
    icon: <Rocket className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-afro-sapphire to-blue-900 border-afro-sapphire',
    side: 'right',
  },
];

export default function CareerTimeline() {
  const { playClickSound, playHoverSound } = useAudioSystem();
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setVisibleEvents(new Set(CAREER_MILESTONES.map(m => m.id)));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <AfroGradientText className="text-6xl font-bold mb-4">
              CAREER JOURNEY
            </AfroGradientText>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Explore my evolution from cybersecurity pioneer to sovereign tech innovator
            </p>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <AfroDivider />

        {/* Timeline */}
        <motion.div
          ref={containerRef}
          className="relative py-12"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Vertical connecting line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-afro-gold via-afro-emerald to-afro-sapphire"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            style={{ originY: 0 }}
          />

          {/* Timeline events */}
          <div className="relative space-y-8">
            {CAREER_MILESTONES.map((milestone, index) => (
              <ScrollReveal key={milestone.id} delay={index * 0.05}>
                <TimelineEvent
                  event={milestone}
                  index={index}
                  isVisible={visibleEvents.has(milestone.id)}
                />
              </ScrollReveal>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {[
            { label: 'Years Active', value: '8+' },
            { label: 'Patents Filed', value: '25+' },
            { label: 'Triangle Area', value: 'NC' },
            { label: 'Patent Claims', value: '25' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="afro-tech-card p-6 text-center"
              variants={itemVariants}
              onHoverStart={() => playHoverSound()}
            >
              <motion.div
                className="text-4xl font-bold text-afro-gold mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-foreground/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center space-y-6 pt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <AfroGradientText className="text-3xl font-bold mb-4">
              Let's Build the Future Together
            </AfroGradientText>
            <p className="text-foreground/70 mb-6">
              Interested in collaboration or learning more about my work?
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.button
              className="afro-button"
              onClick={() => playClickSound()}
              onHoverStart={() => playHoverSound()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.button>
            <motion.button
              className="afro-button bg-afro-emerald border-afro-emerald"
              onClick={() => playClickSound()}
              onHoverStart={() => playHoverSound()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
