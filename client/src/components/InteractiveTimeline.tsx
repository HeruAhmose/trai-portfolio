import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Zap, Award, BookOpen, FileText, Milestone } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  category: 'cybersecurity' | 'materials' | 'community' | 'research' | 'patent' | 'publication' | 'milestone';
  eventDate: Date;
  year: number;
  impact?: string;
  metrics?: Record<string, string | number>;
  displayOrder: number;
}

const PORTFOLIO_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'timeline-001',
    title: 'AMC Hypothesis Formulation',
    description: 'Architected Multi-Modal Coupling (AMC) framework conceptualized - integrating hemp-derived carbon, quartz, tourmaline, magnetite, and rare-earth dopants',
    category: 'research',
    eventDate: new Date('2024-01-15'),
    year: 2024,
    impact: 'Established testable hypothesis for multi-modal transduction',
    metrics: { 'Constituents': 5, 'Transduction Modes': 4 },
    displayOrder: 1,
  },
  {
    id: 'timeline-002',
    title: 'Phase 1: Structural Characterization',
    description: 'SEM, XRD, FTIR analysis of component distribution and phase purity',
    category: 'research',
    eventDate: new Date('2024-02-10'),
    year: 2024,
    impact: 'Component distribution confirmed; interfaces documented',
    metrics: { 'Phase Purity': '98%', 'Interfaces Mapped': '12' },
    displayOrder: 2,
  },
  {
    id: 'timeline-003',
    title: 'Phase 2: Electromechanical Testing',
    description: 'd₃₃ measurement and impedance analysis for piezoelectric response',
    category: 'materials',
    eventDate: new Date('2024-03-20'),
    year: 2024,
    impact: 'Measurable and repeatable piezoelectric coefficient achieved',
    metrics: { 'Piezoelectric Coefficient': '450 pC/N', 'Repeatability': '94%' },
    displayOrder: 3,
  },
  {
    id: 'timeline-004',
    title: 'AMC Preprint Publication (Peoples 2026)',
    description: 'Preprint (not peer reviewed): "Architecture-Driven Emergent Behavior in Multi-Component Composites"',
    category: 'publication',
    eventDate: new Date('2024-04-01'),
    year: 2024,
    impact: 'Testable hypothesis with explicit falsification conditions established',
    metrics: { 'References': 20, 'Validation Phases': 5, 'Patent Claims': 25 },
    displayOrder: 4,
  },
  {
    id: 'timeline-005',
    title: 'Phase 3: Magnetic Characterization',
    description: 'VSM and magnetometry analysis of magnetite coupling and field response',
    category: 'materials',
    eventDate: new Date('2024-05-15'),
    year: 2024,
    impact: 'Characterized hysteresis; field-response quantified',
    metrics: { 'Curie Temp': '860K', 'Saturation': '4 μB/f.u.' },
    displayOrder: 5,
  },
  {
    id: 'timeline-006',
    title: 'Phase 4: Optical Spectroscopy (Critical Gate)',
    description: 'Photoluminescence spectroscopy for rare-earth 4f emission detection',
    category: 'research',
    eventDate: new Date('2024-06-20'),
    year: 2024,
    impact: 'Identifiable 4f peaks detected; host effects documented',
    metrics: { '4f Peaks': '8', 'Signal/Noise': '12:1' },
    displayOrder: 6,
  },
  {
    id: 'timeline-007',
    title: 'U.S. Patent Applications Filed',
    description: 'U.S. Provisional Patent Application 63/934,269 - Multi-modal composite transduction',
    category: 'patent',
    eventDate: new Date('2024-07-10'),
    year: 2024,
    impact: 'Intellectual property protection for AMC architecture established',
    metrics: { 'Claims': 25, 'Categories': 3, 'Scope': 'Composition + Manufacturing + Device' },
    displayOrder: 7,
  },
  {
    id: 'timeline-008',
    title: 'Phase 5: System-Level Benchmarking',
    description: 'Application-specific target use cases and performance validation',
    category: 'research',
    eventDate: new Date('2024-08-25'),
    year: 2024,
    impact: 'Full composite transduction validated against defined thresholds',
    metrics: { 'Energy Harvesting': '2.3 mW/cm²', 'Sensitivity': '±0.1°C' },
    displayOrder: 8,
  },
  {
    id: 'timeline-009',
    title: 'TechBridge Collective Launch',
    description: 'Community digital access initiative with H.K. AI triage system',
    category: 'community',
    eventDate: new Date('2024-09-01'),
    year: 2024,
    impact: '5,000+ community members served across 12 Triangle Area hubs',
    metrics: { 'Hubs Active': 12, 'Users Served': '5000+', 'Success Rate': '87%' },
    displayOrder: 9,
  },
  {
    id: 'timeline-010',
    title: 'Hemp-Derived Carbon Matrix Optimization',
    description: 'Pyrolysis temperature and processing optimization for conductivity',
    category: 'materials',
    eventDate: new Date('2024-10-15'),
    year: 2024,
    impact: 'Conductivity range: 10²–10⁶ S/m achieved; surface area >1500 m²/g',
    metrics: { 'Conductivity': '10⁶ S/m', 'Surface Area': '1800 m²/g' },
    displayOrder: 10,
  },
  {
    id: 'timeline-011',
    title: 'Sovereign Intelligence Platform Release',
    description: 'Cybersecurity portfolio and zero-trust architecture deployment',
    category: 'cybersecurity',
    eventDate: new Date('2024-11-01'),
    year: 2024,
    impact: 'Enterprise security framework protecting 500+ endpoints',
    metrics: { 'Threat Detection': '99.2%', 'Response Time': '2.3s', 'Uptime': '99.99%' },
    displayOrder: 11,
  },
  {
    id: 'timeline-012',
    title: 'Multi-Modal Transduction Validation Complete',
    description: 'All five experimental phases completed; hypothesis validation confirmed',
    category: 'milestone',
    eventDate: new Date('2024-12-15'),
    year: 2024,
    impact: 'Architecture-driven emergent behavior demonstrated across all modalities',
    metrics: { 'Phases Complete': '5/5', 'Success Rate': '92%', 'Reproducibility': '94%' },
    displayOrder: 12,
  },
];

const categoryConfig: Record<TimelineEvent['category'], { color: string; icon: React.ReactNode; label: string }> = {
  cybersecurity: { color: 'from-cyan-500 to-blue-600', icon: <Zap className="w-5 h-5" />, label: 'Cybersecurity' },
  materials: { color: 'from-yellow-500 to-orange-600', icon: <Award className="w-5 h-5" />, label: 'Materials' },
  community: { color: 'from-green-500 to-emerald-600', icon: <Milestone className="w-5 h-5" />, label: 'Community' },
  research: { color: 'from-purple-500 to-pink-600', icon: <BookOpen className="w-5 h-5" />, label: 'Research' },
  patent: { color: 'from-red-500 to-rose-600', icon: <FileText className="w-5 h-5" />, label: 'Patent' },
  publication: { color: 'from-indigo-500 to-purple-600', icon: <BookOpen className="w-5 h-5" />, label: 'Publication' },
  milestone: { color: 'from-gold-500 to-yellow-600', icon: <Milestone className="w-5 h-5" />, label: 'Milestone' },
};

export default function InteractiveTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TimelineEvent['category'] | 'all'>('all');

  const filteredEvents = useMemo(() => {
    return selectedCategory === 'all'
      ? PORTFOLIO_TIMELINE_EVENTS
      : PORTFOLIO_TIMELINE_EVENTS.filter(e => e.category === selectedCategory);
  }, [selectedCategory]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [filteredEvents]);

  const categories: Array<TimelineEvent['category'] | 'all'> = [
    'all',
    'research',
    'materials',
    'publication',
    'patent',
    'cybersecurity',
    'community',
    'milestone',
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-4">
          Portfolio Evolution & Research Milestones
        </h2>
        <p className="text-foreground/70 text-lg">
          Journey through AMC hypothesis validation, patent development, and community impact initiatives
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-12 flex flex-wrap gap-2 justify-center"
      >
        {categories.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-primary to-cyan-500 text-background shadow-lg shadow-primary/50'
                : 'bg-background/50 border border-primary/30 text-foreground hover:border-primary/60'
            }`}
          >
            {cat === 'all' ? 'All Events' : categoryConfig[cat as TimelineEvent['category']]?.label || cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-cyan-400 to-yellow-400 opacity-30" />

        {/* Events */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {sortedEvents.map((event, index) => {
              const config = categoryConfig[event.category];
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center gap-8`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                      className="cursor-pointer bg-background/40 border border-primary/20 rounded-lg p-6 backdrop-blur-sm hover:border-primary/50 transition-all group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
                              {config.icon}
                            </div>
                            <span className={`text-sm font-semibold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                              {config.label}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedId === event.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-primary" />
                        </motion.div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-foreground/60 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{event.eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      {/* Description */}
                      {event.description && (
                        <p className="text-foreground/70 mb-4">{event.description}</p>
                      )}

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedId === event.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-primary/20 pt-4 mt-4 space-y-4"
                          >
                            {/* Impact */}
                            {event.impact && (
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-2">Impact</h4>
                                <p className="text-foreground/70">{event.impact}</p>
                              </div>
                            )}

                            {/* Metrics */}
                            {event.metrics && Object.keys(event.metrics).length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-3">Key Metrics</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  {Object.entries(event.metrics).map(([key, value]) => (
                                    <motion.div
                                      key={key}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="bg-background/60 border border-primary/20 rounded p-3"
                                    >
                                      <div className="text-xs text-foreground/60 mb-1">{key}</div>
                                      <div className="text-lg font-bold text-primary">{value}</div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Center Dot */}
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${config.color} shadow-lg shadow-primary/50 flex-shrink-0 z-10`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Milestones', value: PORTFOLIO_TIMELINE_EVENTS.length },
          { label: 'Research Phases', value: 5 },
          { label: 'Patent Claims', value: 25 },
          { label: 'Community Impact', value: '5000+' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="bg-background/40 border border-primary/20 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-xs text-foreground/60">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
