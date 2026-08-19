import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';

interface Claim {
  number: number;
  title: string;
  category: 'composition' | 'manufacturing' | 'device';
  summary: string;
  details: string[];
  specifications?: Record<string, string>;
}

/**
 * Sourced from the same 25-claim record as PatentClaimsExplorer.tsx (U.S.
 * Patent Application 63/934,269). Every detail and specification below is
 * reshaped from that component's descriptions — nothing here adds a figure
 * that isn't already stated there. Do not add specs without a source.
 */
const PATENT_CLAIMS: Claim[] = [
  // Composition & Material Claims (1–15)
  {
    number: 1,
    title: 'Hemp-Carbon Matrix Pyrolysis',
    category: 'composition',
    summary: 'Pyrolysis at 700–1400°C with conductivity 10²–10⁶ S/m.',
    details: [
      'Pyrolysis temperature: 700–1400°C',
      'Conductivity: 10²–10⁶ S/m',
      'Fiber diameter: 5–50 μm',
      'Aspect ratio: >100:1',
    ],
    specifications: {
      'Temperature Range': '700–1400°C',
      'Conductivity': '10²–10⁶ S/m',
      'Fiber Diameter': '5–50 μm',
      'Aspect Ratio': '>100:1',
    },
  },
  {
    number: 2,
    title: 'Crystalline Phase Integration',
    category: 'composition',
    summary: 'Quartz, tourmaline, magnetite, and rare-earth phases at claimed compositions.',
    details: [
      'Quartz SiO₂: 15–45%',
      'Tourmaline: 3–25%',
      'Magnetite Fe₃O₄: 2–20%',
      'Rare-earth elements: 0.3–10%',
    ],
    specifications: {
      'Quartz': '15–45%',
      'Tourmaline': '3–25%',
      'Magnetite': '2–20%',
      'Rare-Earth': '0.3–10%',
    },
  },
  {
    number: 3,
    title: 'Multi-Modal Harvesting',
    category: 'composition',
    summary: 'Simultaneous piezoelectric, thermoelectric, and spin-Seebeck transduction.',
    details: [
      'Simultaneous piezoelectric, thermoelectric, and spin-Seebeck transduction',
      'Combined output at 250–350 K',
    ],
    specifications: {
      'Operating Range': '250–350 K',
    },
  },
  {
    number: 4,
    title: 'Quantum Sensing',
    category: 'composition',
    summary: 'Eu, Nd, Er, Yb, Ce dopants in a quartz host for self-powered sensing.',
    details: [
      'Lanthanide dopants: Eu, Nd, Er, Yb, Ce in quartz host',
      'Self-powered quantum sensors at room temperature',
    ],
  },
  {
    number: 5,
    title: 'Polymer Binder Architecture',
    category: 'composition',
    summary: 'PDMS or PVDF matrix controlling spatial distribution and stress transfer.',
    details: [
      'PDMS or PVDF matrix',
      'Controls spatial distribution of constituents',
      'Mediates mechanical stress transfer',
    ],
  },
  {
    number: 6,
    title: 'Piezoelectric Coupling',
    category: 'composition',
    summary: 'Quartz and tourmaline dual-mode piezoelectric response with optimized orientation.',
    details: [
      'Quartz and tourmaline dual-mode piezoelectric response',
      'Orientation optimized for coupling efficiency',
    ],
  },
  {
    number: 7,
    title: 'Pyroelectric Response',
    category: 'composition',
    summary: 'Tourmaline-enabled thermal gradient detection with integrated signal conditioning.',
    details: [
      'Tourmaline enables thermal gradient detection',
      'Integrated signal conditioning',
    ],
  },
  {
    number: 8,
    title: 'Ferrimagnetic Interaction',
    category: 'composition',
    summary: 'Magnetite constituent enabling magnetic field coupling.',
    details: [
      'Magnetite Fe₃O₄ constituent',
      'Curie temperature T_C ≈ 850–860 K',
      'Enables magnetic field coupling',
    ],
    specifications: {
      'Curie Temperature': '850–860 K',
    },
  },
  {
    number: 9,
    title: 'Rare-Earth Dopant Embedding',
    category: 'composition',
    summary: 'Lanthanide ions in crystalline hosts with optimized crystal field splitting.',
    details: [
      'Lanthanide ions embedded in crystalline hosts',
      'Optimized crystal field splitting',
    ],
  },
  {
    number: 10,
    title: 'Electrical Conductivity Control',
    category: 'composition',
    summary: 'Tunable sp²/sp³ bonding in the hemp-derived carbon matrix.',
    details: [
      'Hemp-derived carbon matrix',
      'Tunable sp²/sp³ bonding',
      'Enables electron delocalization',
    ],
  },
  {
    number: 11,
    title: 'Thermal Stability',
    category: 'composition',
    summary: 'Structural integrity and transduction efficiency across -40°C to +85°C.',
    details: [
      'Maintains structural integrity across -40°C to +85°C',
      'Transduction efficiency preserved across range',
    ],
    specifications: {
      'Operating Range': '-40°C to +85°C',
    },
  },
  {
    number: 12,
    title: 'Mechanical Fatigue Resistance',
    category: 'composition',
    summary: 'High mechanical quality factor tolerant to cyclic stress beyond 10⁶ cycles.',
    details: [
      'High mechanical quality factor',
      'Tolerant to cyclic stress beyond 10⁶ cycles',
    ],
    specifications: {
      'Cyclic Stress Tolerance': '>10⁶ cycles',
    },
  },
  {
    number: 13,
    title: 'Surface Area Optimization',
    category: 'composition',
    summary: 'Hemp-derived activated carbon with >1500 m²/g surface area.',
    details: [
      'Hemp-derived activated carbon',
      'Surface area >1500 m²/g',
      'Enhances transduction',
    ],
    specifications: {
      'Surface Area': '>1500 m²/g',
    },
  },
  {
    number: 14,
    title: 'Biocompatibility',
    category: 'composition',
    summary: 'Hemp-derived carbon and mineral constituents suitable for biomedical applications.',
    details: [
      'Hemp-derived carbon and mineral constituents',
      'Suitable for biomedical applications',
    ],
  },
  {
    number: 15,
    title: 'Scalability',
    category: 'composition',
    summary: 'Domestically available hemp feedstock for cost-effective large-scale manufacturing.',
    details: [
      'Domestically available hemp feedstock',
      'Enables cost-effective large-scale manufacturing',
    ],
  },
  // Manufacturing Method Claims (16–18)
  {
    number: 16,
    title: 'Fiber Preparation Method',
    category: 'manufacturing',
    summary: 'Source, clean, and cut industrial hemp bast fibers; pre-condition for pyrolysis.',
    details: [
      'Source industrial hemp bast fibers',
      'Clean and cut fibers',
      'Pre-condition for optimal pyrolysis',
    ],
  },
  {
    number: 17,
    title: 'Pyrolysis Process',
    category: 'manufacturing',
    summary: 'Controlled heating at 700–1400°C in an inert atmosphere.',
    details: [
      'Controlled heating at 700–1400°C',
      'Inert atmosphere',
      'Temperature and duration optimize carbon yield',
    ],
    specifications: {
      'Temperature Range': '700–1400°C',
    },
  },
  {
    number: 18,
    title: 'Crystal Synthesis Integration',
    category: 'manufacturing',
    summary: 'Quartz, tourmaline, magnetite, and rare-earth particles dispersed in polymer binder.',
    details: [
      'Quartz, tourmaline, magnetite, and rare-earth particles synthesized',
      'Dispersed in polymer binder',
    ],
  },
  // Device & System Claims (19–25)
  {
    number: 19,
    title: 'Multi-Modal Transduction Device',
    category: 'device',
    summary: 'Composite configured as sensor or energy harvester with integrated electrodes.',
    details: [
      'Configured as sensor or energy harvester',
      'Integrated electrodes',
    ],
  },
  {
    number: 20,
    title: 'Mechanical Vibration Harvester',
    category: 'device',
    summary: 'Piezoelectric mode activated by vibration, output >100 mV under 1g acceleration.',
    details: [
      'Piezoelectric mode activated by vibration',
      'Output >100 mV under 1g acceleration',
    ],
    specifications: {
      'Output Voltage': '>100 mV at 1g',
    },
  },
  {
    number: 21,
    title: 'Thermal Energy Harvester',
    category: 'device',
    summary: 'Pyroelectric mode activated by thermal gradient, output >50 mV across a 10°C/min ramp.',
    details: [
      'Pyroelectric mode activated by thermal gradient',
      'Output >50 mV across 10°C/min ramp',
    ],
    specifications: {
      'Output Voltage': '>50 mV at 10°C/min',
    },
  },
  {
    number: 22,
    title: 'Magnetic Field Sensor',
    category: 'device',
    summary: 'Magnetite-enabled sensing of external magnetic fields, sensitivity >10 mV/mT.',
    details: [
      'Magnetite-enabled sensing of external magnetic fields',
      'Sensitivity >10 mV/mT',
    ],
    specifications: {
      'Sensitivity': '>10 mV/mT',
    },
  },
  {
    number: 23,
    title: 'Quantum Sensing Array',
    category: 'device',
    summary: 'Rare-earth dopants enabling simultaneous detection of multiple physical parameters.',
    details: [
      'Rare-earth dopants',
      'Simultaneous detection of multiple physical parameters',
    ],
  },
  {
    number: 24,
    title: 'Integrated Signal Conditioning',
    category: 'device',
    summary: 'On-board electronics for amplification, filtering, and digital output.',
    details: [
      'On-board electronics',
      'Signal amplification and filtering',
      'Digital output',
    ],
  },
  {
    number: 25,
    title: 'System-Level Performance Validation',
    category: 'device',
    summary: 'End-to-end transduction with measured sensitivity, repeatability, and manufacturability.',
    details: [
      'End-to-end transduction',
      'Measured sensitivity, repeatability, and manufacturability',
    ],
  },
];

const CATEGORY_INFO = {
  composition: {
    label: 'Composition & Material Claims',
    color: 'from-primary to-primary/50',
    icon: '⚗️',
    count: 15,
  },
  manufacturing: {
    label: 'Manufacturing Method Claims',
    color: 'from-cyan-400 to-cyan-400/50',
    icon: '🏭',
    count: 3,
  },
  device: {
    label: 'Device & System Claims',
    color: 'from-yellow-400 to-yellow-400/50',
    icon: '⚙️',
    count: 7,
  },
};

export const EnhancedPatentExplorer: React.FC = () => {
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'composition' | 'manufacturing' | 'device' | null>(null);

  const filteredClaims = selectedCategory
    ? PATENT_CLAIMS.filter((claim) => claim.category === selectedCategory)
    : PATENT_CLAIMS;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const claimVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
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
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Patent Claims</span>
            <span className="text-foreground/60 mx-2">·</span>
            <span className="text-cyan-400">25 Total Claims</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Multi-modal energy harvesting composite from hemp-derived carbon. USPTO Filed Application No. 63/934,269
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {(Object.entries(CATEGORY_INFO) as Array<[keyof typeof CATEGORY_INFO, typeof CATEGORY_INFO[keyof typeof CATEGORY_INFO]]>).map(
            ([category, info]) => (
              <motion.button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : (category as any)
                  )
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? `border-primary bg-gradient-to-r ${info.color} shadow-lg`
                    : 'border-primary/30 bg-background/50 hover:border-primary/60'
                }`}
              >
                <div className="text-4xl mb-2">{info.icon}</div>
                <h3 className="font-bold text-foreground mb-1">{info.label}</h3>
                <p className="text-2xl font-bold text-primary">{info.count}</p>
              </motion.button>
            )
          )}
        </motion.div>

        {/* Claims Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="wait">
            {filteredClaims.map((claim) => (
              <motion.div
                key={claim.number}
                variants={claimVariants}
                layout
                className="group"
              >
                <motion.button
                  onClick={() =>
                    setExpandedClaim(
                      expandedClaim === claim.number ? null : claim.number
                    )
                  }
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                    expandedClaim === claim.number
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                      : 'border-primary/30 bg-background/50 hover:border-primary/60 hover:bg-background/70'
                  }`}
                  style={{
                    boxShadow:
                      expandedClaim === claim.number
                        ? '0 0 30px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.1)'
                        : 'none',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary font-bold">
                        {claim.number}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{claim.title}</h4>
                        <p className="text-xs text-foreground/60 mt-1">{claim.summary}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedClaim === claim.number ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-primary flex-shrink-0"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedClaim === claim.number && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="p-6 rounded-xl border border-primary/30 bg-background/50 backdrop-blur-sm">
                        {/* Details List */}
                        <div className="mb-4">
                          <h5 className="font-bold text-primary mb-3 flex items-center gap-2">
                            <Zap size={16} />
                            Key Details
                          </h5>
                          <ul className="space-y-2">
                            {claim.details.map((detail, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-start gap-2 text-foreground/80 text-sm"
                              >
                                <span className="text-primary font-bold mt-1">▸</span>
                                <span>{detail}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Specifications Table */}
                        {claim.specifications && (
                          <div>
                            <h5 className="font-bold text-primary mb-3">Specifications</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(claim.specifications).map(([key, value]) => (
                                <div key={key} className="p-2 rounded bg-background/50 border border-primary/20">
                                  <p className="text-xs text-foreground/60">{key}</p>
                                  <p className="text-sm font-semibold text-primary">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 p-6 rounded-xl border border-primary/20 bg-background/30"
        >
          <h4 className="font-bold text-primary mb-4">Patent Summary</h4>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">25</p>
              <p className="text-sm text-foreground/70">Total Claims</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">15</p>
              <p className="text-sm text-foreground/70">Material Claims</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">3</p>
              <p className="text-sm text-foreground/70">Manufacturing Claims</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">7</p>
              <p className="text-sm text-foreground/70">Device Claims</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedPatentExplorer;
