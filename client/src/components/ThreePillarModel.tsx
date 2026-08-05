import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Pillar {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'weekly-help',
    title: 'Weekly Help Desk',
    description: 'Walk-in and scheduled 1:1 sessions with Digital Navigators',
    details: [
      '4–8 hours per week at your community hub',
      'Paid Digital Navigators with ongoing training',
      'Human-first approach to technology assistance',
      'No credential access—we guide, we don\'t control',
    ],
    icon: '🤝',
  },
  {
    id: 'hk-ai',
    title: 'H.K. AI Triage',
    description: '24/7 step-by-step guidance between visits',
    details: [
      'Named for Horace King, master bridge builder',
      'Never guesses, never asks for credentials',
      'Routes you to the right portal',
      'Walks you through each step',
      'Escalates to human Navigator when needed',
    ],
    icon: '🤖',
  },
  {
    id: 'techminutes',
    title: 'TechMinutes® Reporting',
    description: 'Monthly non-PII impact reports',
    details: [
      'Minutes served tracked per interaction',
      'Issue categories and resolution rates',
      'Privacy by design—no personal data stored',
      'Measured impact for continuous improvement',
      'Transparent reporting to stakeholders',
    ],
    icon: '📊',
  },
];

export const ThreePillarModel: React.FC = () => {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const pillarVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Three Pillars</span>
            <span className="text-foreground/60 mx-2">·</span>
            <span className="text-cyan-400">One Bridge</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            A comprehensive model for community technology support combining human expertise, AI assistance, and measured impact.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.id}
              variants={pillarVariants}
              className="group relative"
            >
              {/* Pillar Card */}
              <motion.div
                onClick={() =>
                  setExpandedPillar(
                    expandedPillar === pillar.id ? null : pillar.id
                  )
                }
                className="relative h-full cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                    expandedPillar === pillar.id
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                      : 'border-primary/30 bg-background/50 hover:border-primary/60 hover:bg-background/70'
                  }`}
                  style={{
                    boxShadow:
                      expandedPillar === pillar.id
                        ? '0 0 30px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.1)'
                        : 'none',
                  }}
                >
                  {/* Pillar Icon */}
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{
                      scale: expandedPillar === pillar.id ? 1.2 : 1,
                      rotate: expandedPillar === pillar.id ? 5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {pillar.icon}
                  </motion.div>

                  {/* Pillar Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {pillar.title}
                  </h3>

                  {/* Pillar Description */}
                  <p className="text-foreground/70 mb-4">{pillar.description}</p>

                  {/* Expand Indicator */}
                  <motion.div
                    animate={{ rotate: expandedPillar === pillar.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>

                {/* Expanded Details */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: expandedPillar === pillar.id ? 1 : 0,
                    height: expandedPillar === pillar.id ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="p-6 rounded-xl border border-primary/30 bg-background/50 backdrop-blur-sm">
                    <ul className="space-y-3">
                      {pillar.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 text-foreground/80"
                        >
                          <span className="text-primary font-bold mt-1">▸</span>
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Connection Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full mb-12"
          style={{ originX: 0 }}
        />

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            { emoji: '🔄', title: 'Consistency', desc: 'We show up. Every week. Same time, same place.' },
            { emoji: '🤝', title: 'Human-First', desc: 'H.K. triages; humans deliver.' },
            { emoji: '📊', title: 'Measured Impact', desc: 'Every interaction becomes a TechMinute®.' },
            { emoji: '🏢', title: 'Low-Lift Partnerships', desc: 'Host provides space. TechBridge provides everything else.' },
            { emoji: '💰', title: 'Paid Navigators', desc: 'No volunteers. Paid staff show up, stay trained, don\'t churn.' },
            { emoji: '🔒', title: 'Privacy by Design', desc: 'No PII. No credential access. We guide; we don\'t control.' },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + idx * 0.1, duration: 0.4 }}
              className="p-4 rounded-lg border border-primary/20 bg-background/30 hover:bg-background/50 transition-colors"
            >
              <div className="text-3xl mb-2">{value.emoji}</div>
              <h4 className="font-bold text-primary mb-1">{value.title}</h4>
              <p className="text-sm text-foreground/70">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ThreePillarModel;
