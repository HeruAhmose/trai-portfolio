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

const PATENT_CLAIMS: Claim[] = [
  // Composition & Material Claims (1–15)
  {
    number: 1,
    title: 'Hemp-Carbon Matrix Pyrolysis',
    category: 'composition',
    summary: 'Pyrolysis at 700–1400°C with conductivity 10²–10⁶ S/m',
    details: [
      'Fiber diameter: 5–50 μm',
      'Aspect ratios: >100:1',
      'Carbon yield: 35–65% by weight',
      'Thermal stability: up to 1400°C',
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
    title: 'Crystalline Phases',
    category: 'composition',
    summary: 'Quartz, tourmaline, magnetite, and rare-earth elements',
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
    summary: 'Simultaneous piezoelectric + thermoelectric + spin-Seebeck',
    details: [
      'Combined output: 250–350 K',
      'Piezoelectric coefficient: d₃₃ > 100 pC/N',
      'Thermoelectric ZT > 0.5',
      'Spin-Seebeck voltage: 5–15 mV',
    ],
  },
  {
    number: 4,
    title: 'Quantum Sensing',
    category: 'composition',
    summary: 'Eu, Nd, Er, Yb, Ce in quartz host',
    details: [
      'Self-powered quantum sensors at room temperature',
      'T₂ coherence time: >5 μs',
      'Sensitivity: 10⁻¹² T/√Hz',
      'Operating temperature: 300 K',
    ],
  },
  {
    number: 5,
    title: 'Biocompatible Substrate',
    category: 'composition',
    summary: 'Hemp-derived carbon for biological applications',
    details: [
      'Cytotoxicity: <5% at 100 μg/mL',
      'Biocompatibility: ISO 10993-5 compliant',
      'Surface area: 500–2000 m²/g',
      'Pore size: 1–100 nm',
    ],
  },
  {
    number: 6,
    title: 'Electrical Conductivity Enhancement',
    category: 'composition',
    summary: 'Multi-layer graphene integration for enhanced conductivity',
    details: [
      'Graphene loading: 2–8% by weight',
      'Conductivity increase: 100–1000×',
      'Sheet resistance: <100 Ω/sq',
      'Stability: >1000 thermal cycles',
    ],
  },
  {
    number: 7,
    title: 'Thermal Stability',
    category: 'composition',
    summary: 'Composite stability across extreme temperature ranges',
    details: [
      'Operating range: -50°C to +500°C',
      'Thermal expansion coefficient: <10 ppm/K',
      'No phase transitions in range',
      'Mechanical properties retention: >95%',
    ],
  },
  {
    number: 8,
    title: 'Mechanical Properties',
    category: 'composition',
    summary: 'Enhanced strength and flexibility',
    details: [
      'Tensile strength: 50–200 MPa',
      'Young\'s modulus: 5–20 GPa',
      'Elongation at break: 5–15%',
      'Hardness: 2–4 GPa',
    ],
  },
  {
    number: 9,
    title: 'Optical Properties',
    category: 'composition',
    summary: 'Controlled light absorption and emission',
    details: [
      'Bandgap: 1.5–3.5 eV',
      'Absorption coefficient: 10⁴–10⁵ cm⁻¹',
      'Photoluminescence QY: 10–50%',
      'Refractive index: 1.5–2.5',
    ],
  },
  {
    number: 10,
    title: 'Chemical Stability',
    category: 'composition',
    summary: 'Resistance to common solvents and acids',
    details: [
      'pH range: 1–14',
      'Solvent resistance: >99% retention',
      'Oxidation resistance: >1000 hours',
      'Corrosion rate: <0.1 μm/year',
    ],
  },
  {
    number: 11,
    title: 'Magnetic Properties',
    category: 'composition',
    summary: 'Controlled magnetic response',
    details: [
      'Saturation magnetization: 50–150 emu/g',
      'Coercivity: 100–500 Oe',
      'Remanence: 20–60% of saturation',
      'Magnetic anisotropy: tunable',
    ],
  },
  {
    number: 12,
    title: 'Acoustic Properties',
    category: 'composition',
    summary: 'Sound absorption and transmission',
    details: [
      'Absorption coefficient: 0.3–0.9 (500 Hz)',
      'Sound transmission loss: 20–40 dB',
      'Acoustic impedance: 1–5 MRayl',
      'Damping ratio: 0.05–0.15',
    ],
  },
  {
    number: 13,
    title: 'Water Absorption',
    category: 'composition',
    summary: 'Controlled hydrophobicity',
    details: [
      'Water absorption: <5% by weight',
      'Contact angle: 80–120°',
      'Moisture retention: <2%',
      'Hydrophobic coating: optional',
    ],
  },
  {
    number: 14,
    title: 'Biodegradability',
    category: 'composition',
    summary: 'Controlled degradation profile',
    details: [
      'Degradation time: 6–24 months',
      'Degradation products: non-toxic',
      'Biodegradation rate: 10–50% per year',
      'Environmental impact: minimal',
    ],
  },
  {
    number: 15,
    title: 'Composite Structure',
    category: 'composition',
    summary: 'Multi-phase composite architecture',
    details: [
      'Matrix: hemp-derived carbon',
      'Reinforcement: graphene, nanotubes',
      'Filler: rare-earth oxides',
      'Binder: organic polymer or ceramic',
    ],
  },
  // Manufacturing Method Claims (16–18)
  {
    number: 16,
    title: 'Fiber Preparation Process',
    category: 'manufacturing',
    summary: 'Source, clean, and condition hemp fibers',
    details: [
      'Step 1: Source industrial hemp bast fibers',
      'Step 2: Clean and remove impurities',
      'Step 3: Pre-condition for pyrolysis',
      'Step 4: Select high-cellulose varieties',
    ],
  },
  {
    number: 17,
    title: 'Pyrolysis & Crystal Synthesis',
    category: 'manufacturing',
    summary: 'Controlled thermal decomposition and crystallization',
    details: [
      'Pyrolysis temperature: 700–1400°C',
      'Heating rate: 5–20°C/min',
      'Atmosphere: nitrogen or argon',
      'Crystal growth: 2–8 hours',
    ],
  },
  {
    number: 18,
    title: 'Composite Assembly',
    category: 'manufacturing',
    summary: 'Dispersion, binding, forming, and curing',
    details: [
      'Dispersion: ultrasonic or mechanical',
      'Binder addition: 5–15% by weight',
      'Forming: compression or molding',
      'Curing: thermal or UV hardening',
    ],
  },
  // Device & System Claims (19–25)
  {
    number: 19,
    title: 'Energy Harvesting Device',
    category: 'device',
    summary: 'Multi-modal energy conversion system',
    details: [
      'Piezoelectric layer: 2–5 mm',
      'Thermoelectric layer: 1–3 mm',
      'Spin-Seebeck layer: 0.5–2 mm',
      'Total thickness: <15 mm',
    ],
  },
  {
    number: 20,
    title: 'Quantum Sensor Array',
    category: 'device',
    summary: 'Integrated quantum sensing platform',
    details: [
      'Sensor count: 4–64 elements',
      'Sensitivity: 10⁻¹² T/√Hz',
      'Operating frequency: 1–100 MHz',
      'Power consumption: <100 mW',
    ],
  },
  {
    number: 21,
    title: 'Biomedical Implant',
    category: 'device',
    summary: 'Biocompatible implantable device',
    details: [
      'Size: 1–50 mm³',
      'Biocompatibility: ISO 10993-5',
      'Operational life: >5 years',
      'Power generation: 1–10 mW',
    ],
  },
  {
    number: 22,
    title: 'DNA Data Storage',
    category: 'device',
    summary: 'Hemp-derived substrate for DNA storage',
    details: [
      'Storage capacity: 1–10 TB/cm³',
      'Read/write cycles: >1000',
      'Error rate: <10⁻⁹',
      'Stability: >100 years',
    ],
  },
  {
    number: 23,
    title: 'Environmental Sensor',
    category: 'device',
    summary: 'Multi-parameter environmental monitoring',
    details: [
      'Temperature range: -50°C to +150°C',
      'Humidity: 0–100% RH',
      'Pressure: 0.5–2 atm',
      'Wireless transmission: up to 1 km',
    ],
  },
  {
    number: 24,
    title: 'Wearable Power Generator',
    category: 'device',
    summary: 'Flexible wearable energy harvesting',
    details: [
      'Flexibility: >10,000 bend cycles',
      'Power output: 100–500 μW',
      'Weight: <10 g',
      'Comfort rating: >8/10',
    ],
  },
  {
    number: 25,
    title: 'Integrated System Architecture',
    category: 'device',
    summary: 'Complete system integration with control electronics',
    details: [
      'Power management: MPPT algorithm',
      'Data logging: 1 GB internal storage',
      'Wireless interface: Bluetooth 5.0',
      'Battery backup: 48-hour autonomy',
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
