/**
 * Sourced from the same 25-claim record as PatentClaimsExplorer.tsx and
 * EnhancedPatentExplorer.tsx (U.S. Patent Application 63/934,269). Every
 * specification below is derived from that shared description text --
 * do not add a spec without a source. `type` follows standard patent
 * claim taxonomy 1:1 from category (composition -> composition claim,
 * manufacturing -> method claim, device -> apparatus claim); this isn't
 * an independent axis, so SearchablePatentClaims has no separate type
 * filter for it.
 */
export interface PatentClaim {
  number: number;
  title: string;
  category: "composition" | "manufacturing" | "device";
  type: "apparatus" | "method" | "composition";
  description: string;
  specifications: Record<string, string>;
}

export const PATENT_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    title: "Hemp-Carbon Matrix Pyrolysis",
    category: "composition",
    type: "composition",
    description:
      "Pyrolysis at 700–1400°C. Conductivity 10²–10⁶ S/m. Fiber Ø 5–50 μm, aspect ratios >100:1.",
    specifications: {
      "Pyrolysis Temperature": "700–1400°C",
      Conductivity: "10²–10⁶ S/m",
      "Fiber Diameter": "5–50 μm",
      "Aspect Ratio": ">100:1",
    },
  },
  {
    number: 2,
    title: "Crystalline Phase Integration",
    category: "composition",
    type: "composition",
    description:
      "Quartz SiO₂ (15–45%), tourmaline (3–25%), magnetite Fe₃O₄ (2–20%), rare-earth (0.3–10%).",
    specifications: {
      Quartz: "15–45%",
      Tourmaline: "3–25%",
      Magnetite: "2–20%",
      "Rare-Earth": "0.3–10%",
    },
  },
  {
    number: 3,
    title: "Multi-Modal Harvesting",
    category: "composition",
    type: "composition",
    description:
      "Simultaneous piezoelectric + thermoelectric + spin-Seebeck. Combined output at 250–350 K.",
    specifications: {
      "Transduction Modes": "Piezoelectric, thermoelectric, spin-Seebeck",
      "Operating Range": "250–350 K",
    },
  },
  {
    number: 4,
    title: "Quantum Sensing",
    category: "composition",
    type: "composition",
    description:
      "Eu, Nd, Er, Yb, Ce in quartz host. Self-powered quantum sensors at room temperature.",
    specifications: {
      Dopants: "Eu, Nd, Er, Yb, Ce",
      Host: "Quartz",
      Operation: "Self-powered, room temperature",
    },
  },
  {
    number: 5,
    title: "Polymer Binder Architecture",
    category: "composition",
    type: "composition",
    description:
      "PDMS or PVDF matrix controls spatial distribution and mechanical stress transfer.",
    specifications: {
      Binder: "PDMS or PVDF",
      Function: "Spatial distribution and stress transfer",
    },
  },
  {
    number: 6,
    title: "Piezoelectric Coupling",
    category: "composition",
    type: "composition",
    description:
      "Quartz and tourmaline provide dual-mode piezoelectric response with optimized orientation.",
    specifications: {
      Constituents: "Quartz and tourmaline",
      Mode: "Dual-mode piezoelectric response",
    },
  },
  {
    number: 7,
    title: "Pyroelectric Response",
    category: "composition",
    type: "composition",
    description:
      "Tourmaline enables thermal gradient detection with integrated signal conditioning.",
    specifications: {
      Constituent: "Tourmaline",
      Function: "Thermal gradient detection with signal conditioning",
    },
  },
  {
    number: 8,
    title: "Ferrimagnetic Interaction",
    category: "composition",
    type: "composition",
    description:
      "Magnetite Fe₃O₄ with T_C ≈ 850–860 K enables magnetic field coupling.",
    specifications: {
      Constituent: "Magnetite Fe₃O₄",
      "Curie Temperature": "850–860 K",
    },
  },
  {
    number: 9,
    title: "Rare-Earth Dopant Embedding",
    category: "composition",
    type: "composition",
    description:
      "Lanthanide ions in crystalline hosts with optimized crystal field splitting.",
    specifications: {
      Dopants: "Lanthanide ions",
      Host: "Crystalline hosts",
    },
  },
  {
    number: 10,
    title: "Electrical Conductivity Control",
    category: "composition",
    type: "composition",
    description:
      "Hemp-derived carbon matrix with tunable sp²/sp³ bonding for electron delocalization.",
    specifications: {
      Matrix: "Hemp-derived carbon",
      Bonding: "Tunable sp²/sp³",
    },
  },
  {
    number: 11,
    title: "Thermal Stability",
    category: "composition",
    type: "composition",
    description:
      "Application target: structural integrity and transduction efficiency across -40°C to +85°C.",
    specifications: {
      "Operating Range": "-40°C to +85°C",
    },
  },
  {
    number: 12,
    title: "Mechanical Fatigue Resistance",
    category: "composition",
    type: "composition",
    description:
      "Application target: high mechanical quality factor and cyclic-stress tolerance >10⁶ cycles.",
    specifications: {
      "Cyclic Stress Tolerance": ">10⁶ cycles",
    },
  },
  {
    number: 13,
    title: "Surface Area Optimization",
    category: "composition",
    type: "composition",
    description:
      "Hemp-derived activated carbons with >1500 m²/g surface area for enhanced transduction.",
    specifications: {
      "Surface Area": ">1500 m²/g",
    },
  },
  {
    number: 14,
    title: "Biocompatibility",
    category: "composition",
    type: "composition",
    description:
      "Application direction: evaluate hemp-derived carbon and mineral constituents for biomedical use; suitability is unvalidated.",
    specifications: {
      Constituents: "Hemp-derived carbon and mineral constituents",
      Application: "Biomedical",
    },
  },
  {
    number: 15,
    title: "Scalability",
    category: "composition",
    type: "composition",
    description:
      "Application direction: evaluate domestically available hemp feedstock for potential scale-up; cost and scalability are unvalidated.",
    specifications: {
      Feedstock: "Domestically available hemp",
      Manufacturing: "Cost-effective, large-scale",
    },
  },
  {
    number: 16,
    title: "Fiber Preparation Method",
    category: "manufacturing",
    type: "method",
    description:
      "Source, clean, and cut industrial hemp bast fibers. Pre-condition for optimal pyrolysis.",
    specifications: {
      Source: "Industrial hemp bast fibers",
      Steps: "Clean, cut, pre-condition for pyrolysis",
    },
  },
  {
    number: 17,
    title: "Pyrolysis Process",
    category: "manufacturing",
    type: "method",
    description:
      "Controlled heating at 700–1400°C in inert atmosphere. Temperature and duration optimize carbon yield.",
    specifications: {
      "Temperature Range": "700–1400°C",
      Atmosphere: "Inert (N₂ or Ar)",
    },
  },
  {
    number: 18,
    title: "Crystal Synthesis Integration",
    category: "manufacturing",
    type: "method",
    description:
      "Quartz, tourmaline, magnetite, and rare-earth particles synthesized and dispersed in polymer binder.",
    specifications: {
      Particles: "Quartz, tourmaline, magnetite, rare-earth",
      Dispersion: "Polymer binder",
    },
  },
  {
    number: 19,
    title: "Multi-Modal Transduction Device",
    category: "device",
    type: "apparatus",
    description:
      "Composite material configured as sensor or energy harvester with integrated electrodes.",
    specifications: {
      Configuration: "Sensor or energy harvester",
      Electrodes: "Integrated",
    },
  },
  {
    number: 20,
    title: "Mechanical Vibration Harvester",
    category: "device",
    type: "apparatus",
    description:
      "Piezoelectric mode activated by vibration. Output >100 mV under 1g acceleration.",
    specifications: {
      Activation: "Vibration",
      Output: ">100 mV at 1g",
    },
  },
  {
    number: 21,
    title: "Thermal Energy Harvester",
    category: "device",
    type: "apparatus",
    description:
      "Pyroelectric mode activated by thermal gradient. Output >50 mV across 10°C/min ramp.",
    specifications: {
      Activation: "Thermal gradient",
      Output: ">50 mV at 10°C/min",
    },
  },
  {
    number: 22,
    title: "Magnetic Field Sensor",
    category: "device",
    type: "apparatus",
    description:
      "Magnetite-enabled sensing of external magnetic fields with sensitivity >10 mV/mT.",
    specifications: {
      "Sensing Element": "Magnetite",
      Sensitivity: ">10 mV/mT",
    },
  },
  {
    number: 23,
    title: "Quantum Sensing Array",
    category: "device",
    type: "apparatus",
    description:
      "Application direction: rare-earth dopants are proposed for simultaneous detection of multiple physical parameters.",
    specifications: {
      Dopants: "Rare-earth",
      Capability: "Simultaneous multi-parameter detection",
    },
  },
  {
    number: 24,
    title: "Integrated Signal Conditioning",
    category: "device",
    type: "apparatus",
    description:
      "On-board electronics for signal amplification, filtering, and digital output.",
    specifications: {
      Electronics: "On-board",
      Functions: "Amplification, filtering, digital output",
    },
  },
  {
    number: 25,
    title: "System-Level Performance Validation",
    category: "device",
    type: "apparatus",
    description:
      "Application claim calls for end-to-end measurement of sensitivity, repeatability, and manufacturability; no result is represented.",
    specifications: {
      Validation: "End-to-end transduction",
      Metrics: "Sensitivity, repeatability, manufacturability",
    },
  },
];
