import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Copy, Download } from 'lucide-react';

interface PatentClaim {
  number: number;
  title: string;
  category: 'composition' | 'manufacturing' | 'device';
  type: 'apparatus' | 'method' | 'composition';
  description: string;
  specifications: Record<string, string>;
  dependencies: number[];
}

const PATENT_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    title: 'Hemp-Derived Carbon Matrix',
    category: 'composition',
    type: 'composition',
    description: 'A composite material comprising hemp-derived carbon fibers with controlled conductivity',
    specifications: {
      'Conductivity': '10²–10⁶ S/m',
      'Fiber Diameter': '5–50 μm',
      'Aspect Ratio': '>100:1',
      'Pyrolysis Temperature': '700–1400°C'
    },
    dependencies: []
  },
  {
    number: 2,
    title: 'Crystalline Phase Integration',
    category: 'composition',
    type: 'composition',
    description: 'Integration of quartz, tourmaline, and magnetite crystalline phases',
    specifications: {
      'Quartz Content': '15–45%',
      'Tourmaline Content': '3–25%',
      'Magnetite Content': '2–20%'
    },
    dependencies: [1]
  },
  {
    number: 3,
    title: 'Rare-Earth Dopant System',
    category: 'composition',
    type: 'composition',
    description: 'Rare-earth element doping for quantum sensing capabilities',
    specifications: {
      'Dopant Elements': 'Eu, Nd, Er, Yb, Ce',
      'Doping Concentration': '0.3–10%',
      'Coherence Time (T₂)': '>5 μs'
    },
    dependencies: [1, 2]
  },
  {
    number: 4,
    title: 'Multi-Modal Transduction',
    category: 'composition',
    type: 'apparatus',
    description: 'Simultaneous piezoelectric, thermoelectric, and spin-Seebeck energy harvesting',
    specifications: {
      'Piezoelectric Coefficient': 'd₃₃ > 100 pC/N',
      'Seebeck Coefficient': 'α > 50 μV/K',
      'Combined Output': '250–350 K'
    },
    dependencies: [1, 2, 3]
  },
  {
    number: 5,
    title: 'Biocompatible Surface Coating',
    category: 'composition',
    type: 'composition',
    description: 'ISO 10993-5 compliant biocompatible coating for implantable applications',
    specifications: {
      'Coating Material': 'Parylene or Silicone',
      'Thickness': '1–10 μm',
      'Biocompatibility': 'ISO 10993-5'
    },
    dependencies: [1]
  },
  {
    number: 6,
    title: 'Thermal Stability Enhancement',
    category: 'composition',
    type: 'composition',
    description: 'Thermal stabilization for extreme temperature operation',
    specifications: {
      'Operating Range': '-50°C to +500°C',
      'Thermal Conductivity': '5–50 W/mK',
      'CTE Match': '±5 ppm/K'
    },
    dependencies: [1, 2]
  },
  {
    number: 7,
    title: 'Quantum Sensing Configuration',
    category: 'device',
    type: 'apparatus',
    description: 'Room-temperature quantum sensor using rare-earth dopants',
    specifications: {
      'Operating Temperature': '300 K',
      'Coherence Time': '>5 μs',
      'Sensitivity': '<1 nT/√Hz'
    },
    dependencies: [3, 4]
  },
  {
    number: 8,
    title: 'Energy Harvesting Device',
    category: 'device',
    type: 'apparatus',
    description: 'Integrated multi-modal energy harvesting device',
    specifications: {
      'Power Output': '100–500 mW/cm³',
      'Efficiency': '15–35%',
      'Form Factor': 'Flexible or rigid'
    },
    dependencies: [4]
  },
  {
    number: 9,
    title: 'Biomedical Implant',
    category: 'device',
    type: 'apparatus',
    description: 'Implantable device for biomedical sensing and power generation',
    specifications: {
      'Implant Size': '1–10 mm',
      'Biocompatibility': 'ISO 10993-5',
      'Power Generation': '10–50 μW'
    },
    dependencies: [5, 7, 8]
  },
  {
    number: 10,
    title: 'DNA Data Storage Substrate',
    category: 'device',
    type: 'apparatus',
    description: 'Hemp-derived carbon substrate for DNA data storage with CRISPR',
    specifications: {
      'Storage Density': '>1 PB/g',
      'Substrate Area': '1–100 cm²',
      'Stability': '>100 years'
    },
    dependencies: [1, 5]
  },
  {
    number: 11,
    title: 'Environmental Sensor Array',
    category: 'device',
    type: 'apparatus',
    description: 'Multi-parameter environmental monitoring sensor',
    specifications: {
      'Parameters': 'Temperature, humidity, pressure, magnetic field',
      'Accuracy': '±2% FS',
      'Response Time': '<100 ms'
    },
    dependencies: [4, 7]
  },
  {
    number: 12,
    title: 'Wearable Power Generator',
    category: 'device',
    type: 'apparatus',
    description: 'Flexible wearable device for kinetic energy harvesting',
    specifications: {
      'Flexibility': 'Bending radius <10 mm',
      'Power Output': '50–200 mW',
      'Durability': '>100,000 cycles'
    },
    dependencies: [4, 6]
  },
  {
    number: 13,
    title: 'Integrated System Architecture',
    category: 'device',
    type: 'apparatus',
    description: 'Complete system integrating sensing, power generation, and data processing',
    specifications: {
      'Integration Level': 'System-on-Chip',
      'Power Budget': '<10 mW',
      'Data Rate': '1–100 kbps'
    },
    dependencies: [7, 8, 11]
  },
  {
    number: 14,
    title: 'Fiber Preparation Method',
    category: 'manufacturing',
    type: 'method',
    description: 'Process for preparing hemp-derived carbon fibers',
    specifications: {
      'Source': 'Industrial hemp bast fibers',
      'Pre-conditioning': 'Moisture removal and cleaning',
      'Fiber Length': '10–100 mm'
    },
    dependencies: []
  },
  {
    number: 15,
    title: 'Pyrolysis Process',
    category: 'manufacturing',
    type: 'method',
    description: 'Controlled pyrolysis for carbon matrix formation',
    specifications: {
      'Temperature Range': '700–1400°C',
      'Heating Rate': '5–20°C/min',
      'Atmosphere': 'Inert (N₂ or Ar)'
    },
    dependencies: [14]
  },
  {
    number: 16,
    title: 'Crystal Synthesis Integration',
    category: 'manufacturing',
    type: 'method',
    description: 'Integration of crystalline phases into carbon matrix',
    specifications: {
      'Synthesis Method': 'Sol-gel or solid-state',
      'Temperature': '800–1200°C',
      'Duration': '2–8 hours'
    },
    dependencies: [15]
  },
  {
    number: 17,
    title: 'Composite Assembly',
    category: 'manufacturing',
    type: 'method',
    description: 'Assembly of composite material with controlled phase distribution',
    specifications: {
      'Dispersion Method': 'Sonication or mechanical mixing',
      'Binder': 'Epoxy or polyimide',
      'Curing': '120–180°C, 2–4 hours'
    },
    dependencies: [16]
  },
  {
    number: 18,
    title: 'Quality Control & Electrode Deposition',
    category: 'manufacturing',
    type: 'method',
    description: 'QC procedures and electrode deposition for device integration',
    specifications: {
      'QC Tests': 'Conductivity, crystallinity, biocompatibility',
      'Electrode Material': 'Au, Ag, or Pt',
      'Deposition Method': 'Sputtering or electroplating'
    },
    dependencies: [17]
  },
  {
    number: 19,
    title: 'Piezoelectric Energy Harvester',
    category: 'device',
    type: 'apparatus',
    description: 'Piezoelectric device utilizing mechanical vibrations',
    specifications: {
      'Frequency Range': '10–1000 Hz',
      'Power Output': '50–200 mW',
      'Efficiency': '20–40%'
    },
    dependencies: [4, 8]
  },
  {
    number: 20,
    title: 'Thermoelectric Power Module',
    category: 'device',
    type: 'apparatus',
    description: 'Thermoelectric device for heat-to-electricity conversion',
    specifications: {
      'Temperature Differential': '10–100 K',
      'Power Output': '100–500 mW',
      'ZT Value': '>1.0'
    },
    dependencies: [4, 8]
  },
  {
    number: 21,
    title: 'Spin-Seebeck Generator',
    category: 'device',
    type: 'apparatus',
    description: 'Spin-Seebeck effect device for magnetic field energy harvesting',
    specifications: {
      'Magnetic Field': '0.1–1 T',
      'Power Output': '10–100 mW',
      'Operating Temperature': '250–350 K'
    },
    dependencies: [2, 4, 8]
  },
  {
    number: 22,
    title: 'Magnetic Field Sensor',
    category: 'device',
    type: 'apparatus',
    description: 'High-sensitivity magnetic field sensor using quantum effects',
    specifications: {
      'Sensitivity': '<1 nT/√Hz',
      'Dynamic Range': '1 nT–1 mT',
      'Bandwidth': '0–10 kHz'
    },
    dependencies: [3, 7, 11]
  },
  {
    number: 23,
    title: 'Implantable Neural Interface',
    category: 'device',
    type: 'apparatus',
    description: 'Biocompatible neural interface for brain-computer interaction',
    specifications: {
      'Electrode Density': '100–1000 electrodes/mm²',
      'Signal Resolution': '16-bit',
      'Power Consumption': '<5 mW'
    },
    dependencies: [5, 7, 9]
  },
  {
    number: 24,
    title: 'Flexible Sensor Array',
    category: 'device',
    type: 'apparatus',
    description: 'Flexible multi-parameter sensor array for wearable applications',
    specifications: {
      'Sensor Types': 'Temperature, strain, pressure, humidity',
      'Flexibility': 'Bending radius <5 mm',
      'Wireless': 'Bluetooth or NFC'
    },
    dependencies: [4, 6, 12]
  },
  {
    number: 25,
    title: 'Integrated IoT System',
    category: 'device',
    type: 'apparatus',
    description: 'Complete IoT system with sensing, power, and cloud connectivity',
    specifications: {
      'Connectivity': '5G/LTE/WiFi',
      'Battery Life': '>7 days (with harvesting)',
      'Cloud Integration': 'AWS/Azure/GCP'
    },
    dependencies: [8, 11, 13, 24]
  }
];

export const SearchablePatentClaims: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'composition' | 'manufacturing' | 'device'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'apparatus' | 'method' | 'composition'>('all');
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'number' | 'relevance'>('number');

  const filteredClaims = useMemo(() => {
    let filtered = PATENT_CLAIMS;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(c => c.type === selectedType);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.number.toString().includes(query) ||
        Object.values(c.specifications).some(v => v.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'relevance' && searchQuery) {
      filtered.sort((a, b) => {
        const aScore = (a.title.toLowerCase().match(new RegExp(searchQuery, 'g')) || []).length;
        const bScore = (b.title.toLowerCase().match(new RegExp(searchQuery, 'g')) || []).length;
        return bScore - aScore;
      });
    } else {
      filtered.sort((a, b) => a.number - b.number);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedType, sortBy]);

  const categoryStats = {
    composition: PATENT_CLAIMS.filter(c => c.category === 'composition').length,
    manufacturing: PATENT_CLAIMS.filter(c => c.category === 'manufacturing').length,
    device: PATENT_CLAIMS.filter(c => c.category === 'device').length,
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-bold text-primary mb-2">Patent Claims Explorer</h2>
        <p className="text-foreground/70">U.S. Provisional Patent Application 63/934,269 - 25 Claims</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-primary/50" size={20} />
          <input
            type="text"
            placeholder="Search claims by title, number, or specifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-primary/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories ({PATENT_CLAIMS.length})</option>
              <option value="composition">Composition & Material ({categoryStats.composition})</option>
              <option value="manufacturing">Manufacturing Method ({categoryStats.manufacturing})</option>
              <option value="device">Device & System ({categoryStats.device})</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="composition">Composition</option>
              <option value="apparatus">Apparatus</option>
              <option value="method">Method</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="number">Claim Number</option>
              <option value="relevance" disabled={!searchQuery}>Relevance</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-foreground/60">
          Showing {filteredClaims.length} of {PATENT_CLAIMS.length} claims
        </div>
      </motion.div>

      {/* Claims List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredClaims.map((claim, index) => (
            <motion.div
              key={claim.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className="border border-primary/30 rounded-lg overflow-hidden hover:border-primary/60 transition-colors"
            >
              {/* Claim Header */}
              <button
                onClick={() => setExpandedClaim(expandedClaim === claim.number ? null : claim.number)}
                className="w-full px-6 py-4 bg-background/50 hover:bg-background/70 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-primary font-bold text-lg">#{claim.number}</span>
                    <span className="text-sm font-semibold text-foreground">{claim.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      claim.category === 'composition' ? 'bg-cyan-500/20 text-cyan-300' :
                      claim.category === 'manufacturing' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {claim.category === 'composition' ? 'Composition' :
                       claim.category === 'manufacturing' ? 'Manufacturing' : 'Device'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      claim.type === 'composition' ? 'bg-purple-500/20 text-purple-300' :
                      claim.type === 'apparatus' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {claim.type.charAt(0).toUpperCase() + claim.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70">{claim.description}</p>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-primary transition-transform ${expandedClaim === claim.number ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedClaim === claim.number && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-primary/30 px-6 py-4 bg-background/30 space-y-4"
                  >
                    {/* Specifications */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Specifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(claim.specifications).map(([key, value]) => (
                          <div key={key} className="bg-background/50 p-3 rounded border border-primary/20">
                            <p className="text-xs text-foreground/60 font-semibold">{key}</p>
                            <p className="text-sm text-foreground font-mono">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dependencies */}
                    {claim.dependencies.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Depends On</h4>
                        <div className="flex flex-wrap gap-2">
                          {claim.dependencies.map(depNum => (
                            <button
                              key={depNum}
                              onClick={() => setExpandedClaim(depNum)}
                              className="px-3 py-1 bg-primary/20 hover:bg-primary/40 text-primary rounded text-sm font-semibold transition-colors"
                            >
                              Claim #{depNum}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-primary/20">
                      <button
                        onClick={() => navigator.clipboard.writeText(`Claim #${claim.number}: ${claim.title}`)}
                        className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded text-sm font-semibold transition-colors"
                      >
                        <Copy size={16} /> Copy
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded text-sm font-semibold transition-colors">
                        <Download size={16} /> Export
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredClaims.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-foreground/60">No claims match your search criteria.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Statistics Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 pt-8 border-t border-primary/20 grid grid-cols-3 gap-4"
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{categoryStats.composition}</p>
          <p className="text-sm text-foreground/60">Composition Claims</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{categoryStats.manufacturing}</p>
          <p className="text-sm text-foreground/60">Manufacturing Claims</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{categoryStats.device}</p>
          <p className="text-sm text-foreground/60">Device Claims</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchablePatentClaims;
