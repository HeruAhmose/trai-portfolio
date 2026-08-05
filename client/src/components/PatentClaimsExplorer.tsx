import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Claim {
  number: number;
  title: string;
  description: string;
  category: 'composition' | 'manufacturing' | 'device';
}

const claims: Claim[] = [
  {
    number: 1,
    title: 'Hemp-Carbon Matrix Pyrolysis',
    description: 'Pyrolysis at 700–1400°C. Conductivity 10²–10⁶ S/m. Fiber Ø 5–50 μm, aspect ratios >100:1.',
    category: 'composition',
  },
  {
    number: 2,
    title: 'Crystalline Phase Integration',
    description: 'Quartz SiO₂ (15–45%), tourmaline (3–25%), magnetite Fe₃O₄ (2–20%), rare-earth (0.3–10%).',
    category: 'composition',
  },
  {
    number: 3,
    title: 'Multi-Modal Harvesting',
    description: 'Simultaneous piezoelectric + thermoelectric + spin-Seebeck. Combined output at 250–350 K.',
    category: 'composition',
  },
  {
    number: 4,
    title: 'Quantum Sensing',
    description: 'Eu, Nd, Er, Yb, Ce in quartz host. Self-powered quantum sensors at room temperature.',
    category: 'composition',
  },
  {
    number: 5,
    title: 'Polymer Binder Architecture',
    description: 'PDMS or PVDF matrix controls spatial distribution and mechanical stress transfer.',
    category: 'composition',
  },
  {
    number: 6,
    title: 'Piezoelectric Coupling',
    description: 'Quartz and tourmaline provide dual-mode piezoelectric response with optimized orientation.',
    category: 'composition',
  },
  {
    number: 7,
    title: 'Pyroelectric Response',
    description: 'Tourmaline enables thermal gradient detection with integrated signal conditioning.',
    category: 'composition',
  },
  {
    number: 8,
    title: 'Ferrimagnetic Interaction',
    description: 'Magnetite Fe₃O₄ with T_C ≈ 850–860 K enables magnetic field coupling.',
    category: 'composition',
  },
  {
    number: 9,
    title: 'Rare-Earth Dopant Embedding',
    description: 'Lanthanide ions in crystalline hosts with optimized crystal field splitting.',
    category: 'composition',
  },
  {
    number: 10,
    title: 'Electrical Conductivity Control',
    description: 'Hemp-derived carbon matrix with tunable sp²/sp³ bonding for electron delocalization.',
    category: 'composition',
  },
  {
    number: 11,
    title: 'Thermal Stability',
    description: 'Composite maintains structural integrity and transduction efficiency across -40°C to +85°C.',
    category: 'composition',
  },
  {
    number: 12,
    title: 'Mechanical Fatigue Resistance',
    description: 'High mechanical quality factor with tolerance to cyclic stress >10⁶ cycles.',
    category: 'composition',
  },
  {
    number: 13,
    title: 'Surface Area Optimization',
    description: 'Hemp-derived activated carbons with >1500 m²/g surface area for enhanced transduction.',
    category: 'composition',
  },
  {
    number: 14,
    title: 'Biocompatibility',
    description: 'Hemp-derived carbon and mineral constituents suitable for biomedical applications.',
    category: 'composition',
  },
  {
    number: 15,
    title: 'Scalability',
    description: 'Domestically available hemp feedstock enables cost-effective large-scale manufacturing.',
    category: 'composition',
  },
  {
    number: 16,
    title: 'Fiber Preparation Method',
    description: 'Source, clean, and cut industrial hemp bast fibers. Pre-condition for optimal pyrolysis.',
    category: 'manufacturing',
  },
  {
    number: 17,
    title: 'Pyrolysis Process',
    description: 'Controlled heating at 700–1400°C in inert atmosphere. Temperature and duration optimize carbon yield.',
    category: 'manufacturing',
  },
  {
    number: 18,
    title: 'Crystal Synthesis Integration',
    description: 'Quartz, tourmaline, magnetite, and rare-earth particles synthesized and dispersed in polymer binder.',
    category: 'manufacturing',
  },
  {
    number: 19,
    title: 'Multi-Modal Transduction Device',
    description: 'Composite material configured as sensor or energy harvester with integrated electrodes.',
    category: 'device',
  },
  {
    number: 20,
    title: 'Mechanical Vibration Harvester',
    description: 'Piezoelectric mode activated by vibration. Output >100 mV under 1g acceleration.',
    category: 'device',
  },
  {
    number: 21,
    title: 'Thermal Energy Harvester',
    description: 'Pyroelectric mode activated by thermal gradient. Output >50 mV across 10°C/min ramp.',
    category: 'device',
  },
  {
    number: 22,
    title: 'Magnetic Field Sensor',
    description: 'Magnetite-enabled sensing of external magnetic fields with sensitivity >10 mV/mT.',
    category: 'device',
  },
  {
    number: 23,
    title: 'Quantum Sensing Array',
    description: 'Rare-earth dopants enable simultaneous detection of multiple physical parameters.',
    category: 'device',
  },
  {
    number: 24,
    title: 'Integrated Signal Conditioning',
    description: 'On-board electronics for signal amplification, filtering, and digital output.',
    category: 'device',
  },
  {
    number: 25,
    title: 'System-Level Performance Validation',
    description: 'End-to-end transduction with measured sensitivity, repeatability, and manufacturability.',
    category: 'device',
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  composition: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-400/30',
  },
  manufacturing: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-400/30',
  },
  device: {
    bg: 'bg-magenta-500/10',
    text: 'text-magenta-400',
    border: 'border-magenta-400/30',
  },
};

export default function PatentClaimsExplorer() {
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredClaims = selectedCategory
    ? claims.filter((c) => c.category === selectedCategory)
    : claims;

  const categoryGroups = {
    composition: claims.filter((c) => c.category === 'composition'),
    manufacturing: claims.filter((c) => c.category === 'manufacturing'),
    device: claims.filter((c) => c.category === 'device'),
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Category Filters */}
      <div className="flex gap-3 flex-wrap">
        <motion.button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded border font-mono text-xs tracking-widest transition-all ${
            selectedCategory === null
              ? 'bg-primary text-background border-primary'
              : 'border-border text-foreground hover:border-primary'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ALL CLAIMS ({claims.length})
        </motion.button>

        {Object.entries(categoryColors).map(([category, colors]) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded border font-mono text-xs tracking-widest transition-all ${
              selectedCategory === category
                ? `${colors.bg} ${colors.text} ${colors.border}`
                : 'border-border text-foreground hover:border-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.toUpperCase()} ({categoryGroups[category as keyof typeof categoryGroups].length})
          </motion.button>
        ))}
      </div>

      {/* Claims List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredClaims.map((claim, idx) => {
            const colors = categoryColors[claim.category];
            const isExpanded = expandedClaim === claim.number;

            return (
              <motion.div
                key={claim.number}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
              >
                <motion.button
                  onClick={() => setExpandedClaim(isExpanded ? null : claim.number)}
                  className={`w-full p-4 rounded border text-left transition-all ${colors.bg} ${colors.border} hover:border-primary`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`font-bold text-lg ${colors.text}`}>CLAIM {claim.number}</span>
                        <span className={`text-xs font-mono ${colors.text} opacity-70`}>
                          {claim.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">{claim.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-5 h-5 ${colors.text}`} />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-current border-opacity-20"
                      >
                        <p className="text-sm text-foreground/80 leading-relaxed">{claim.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4 p-4 rounded border border-border bg-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Object.entries(categoryGroups).map(([category, items]) => (
          <div key={category} className="text-center">
            <div className={`text-2xl font-bold ${categoryColors[category].text}`}>
              {items.length}
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-1">
              {category.toUpperCase()}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
