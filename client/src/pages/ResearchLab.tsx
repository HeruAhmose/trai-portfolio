import { motion } from "framer-motion";

export default function ResearchLab() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            <span className="text-primary neon-text">RESEARCH LAB</span>
          </h1>
          <p className="text-2xl text-cyan mb-2">
            Architected Multi-Modal Coupling (AMC)
          </p>
          <p className="text-xl text-foreground/80 max-w-2xl">
            2026 preprint, not peer reviewed: a testable hypothesis for
            multi-modal transduction through coupled piezoelectric,
            pyroelectric, ferrimagnetic, and optically active constituents in
            hemp-derived carbon composites. Its 51 peer-reviewed references
            support constituent mechanisms; they do not establish integrated
            performance.
          </p>
        </motion.div>
      </section>

      {/* Featured Publication */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">
            FEATURED PREPRINT
          </h2>
          <div className="p-8 rounded border border-primary bg-card neon-border space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                Architected Multi-Modal Coupling: A Testable Hypothesis for
                Emergent Transduction in Hemp-Carbon Composites
              </h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                Jonathan Peoples (2026) — Preprint — Not peer reviewed — U.S.
                Patent Application 63/934,269 (25 Claims)
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                CENTRAL HYPOTHESIS
              </h4>
              <p className="text-foreground/80 leading-relaxed">
                A structured composite integrating hemp-derived carbon, quartz,
                tourmaline, magnetite, and rare-earth-doped crystalline
                particles within a polymer binder may exhibit system-level
                multi-modal transduction—converting mechanical, thermal, and
                magnetic perturbations into detectable electrical and/or optical
                output—if the spatial arrangement and mechanical coupling among
                constituents are deliberately engineered to create constructive
                interaction pathways.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                RESEARCH PHASES
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded border border-cyan">
                  <p className="font-mono text-sm text-cyan">
                    Planned Phase 1: Constituent Characterization
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">
                    Baseline properties of hemp carbon, quartz, tourmaline,
                    magnetite, rare-earth dopants
                  </p>
                </div>
                <div className="p-3 bg-background rounded border border-gold">
                  <p className="font-mono text-sm text-gold">
                    Planned Phase 2: Binary Coupling Studies
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">
                    Pairwise interactions: piezo-pyro, piezo-ferri, pyro-optical
                  </p>
                </div>
                <div className="p-3 bg-background rounded border border-lime-500">
                  <p className="font-mono text-sm text-lime-500">
                    Planned Phase 3: Ternary &amp; Quaternary Systems
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">
                    Multi-way coupling tests and comparison with controls
                  </p>
                </div>
                <div className="p-3 bg-background rounded border border-purple-500">
                  <p className="font-mono text-sm text-purple-400">
                    Planned Phase 4: Manufacturing Study
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">
                    7-step process: fiber prep, matrix mixing, casting, curing,
                    machining, assembly, QC
                  </p>
                </div>
                <div className="p-3 bg-background rounded border border-pink-500">
                  <p className="font-mono text-sm text-pink-400">
                    Planned Phase 5: Application Benchmarking
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">
                    Application-specific energy-harvesting and sensing
                    benchmarks after laboratory gates
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                DOCUMENTED MARKERS &amp; APPLICATION TARGET
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded border border-cyan/50">
                  <p className="text-cyan font-bold text-lg">25</p>
                  <p className="text-xs text-foreground/70">
                    Application Claims
                  </p>
                </div>
                <div className="p-4 bg-background rounded border border-gold/50">
                  <p className="text-gold font-bold text-lg">4</p>
                  <p className="text-xs text-foreground/70">
                    Proposed Transduction Modes
                  </p>
                </div>
                <div className="p-4 bg-background rounded border border-lime-500/50">
                  <p className="text-lime-500 font-bold text-lg">
                    80–800 μW/cm²
                  </p>
                  <p className="text-xs text-foreground/70">
                    Application Range · Not Measured
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                PROPOSED APPLICATION DIRECTIONS
              </h4>
              <ul className="space-y-2 text-foreground/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan">▸</span>
                  <span>
                    <strong>Structural Health Monitoring:</strong> proposed
                    strain, vibration, and damage-sensing research for
                    structures
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">▸</span>
                  <span>
                    <strong>Wearable Sensors:</strong> proposed harvesting from
                    body motion or heat, subject to safety and performance
                    testing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-500">▸</span>
                  <span>
                    <strong>Ambient Sensors:</strong> a research direction for
                    reduced-battery environmental or industrial monitoring
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>
                    <strong>Quantum Sensing:</strong> T₂ &gt;500 ns at 300 K is
                    an application target and hypothesis, not a confirmed
                    measurement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">▸</span>
                  <span>
                    <strong>Lifecycle Direction:</strong> hemp-derived carbon
                    supports a carbon-negative design objective; net impact
                    requires a measured lifecycle assessment
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 rounded border border-yellow-400/30 bg-yellow-400/5 p-4 text-sm text-foreground/70">
            No phase is represented as complete. No integrated performance,
            lifecycle benefit, biocompatibility result, or field outcome is
            reported.
          </p>
        </motion.div>
      </section>

      {/* Validation Framework */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">
            EXPERIMENTAL VALIDATION FRAMEWORK
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="font-bold text-cyan mb-4">
                Characterization Methods
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>• Scanning Electron Microscopy (SEM) for morphology</li>
                <li>• X-ray Diffraction (XRD) for phase identification</li>
                <li>• Raman Spectroscopy for carbon structure</li>
                <li>• Piezoelectric coefficient (d₃₃) measurement</li>
                <li>• Thermal conductivity via laser flash analysis</li>
                <li>• Magnetic susceptibility (SQUID)</li>
              </ul>
            </div>
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="font-bold text-gold mb-4">Performance Testing</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>• Mechanical stress-strain under controlled load</li>
                <li>• Thermal cycling (-20°C to +80°C)</li>
                <li>
                  • Electrical output measurement under multi-modal stimuli
                </li>
                <li>• Quantum coherence time (T₂) via spin echo</li>
                <li>• Durability: 10,000+ cycle fatigue testing</li>
                <li>• Environmental stability in humidity/salt spray</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Patent Claims Summary */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">
            PATENT CLAIMS OVERVIEW
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-lime-500 rounded-lg bg-card">
              <h3 className="font-bold text-lime-500 mb-3">
                Composition Claims (1-8)
              </h3>
              <p className="text-sm text-foreground/80">
                Material constituents, volume fractions, dopant specifications,
                and binder systems for the multi-modal composite
              </p>
            </div>
            <div className="p-6 border border-cyan rounded-lg bg-card">
              <h3 className="font-bold text-cyan mb-3">
                Manufacturing Claims (9-18)
              </h3>
              <p className="text-sm text-foreground/80">
                7-step production process: fiber preparation, matrix
                formulation, casting, curing, machining, assembly, quality
                control
              </p>
            </div>
            <div className="p-6 border border-gold rounded-lg bg-card">
              <h3 className="font-bold text-gold mb-3">
                Device Claims (19-25)
              </h3>
              <p className="text-sm text-foreground/80">
                Applications: energy harvesters, sensors, structural monitoring
                devices, wearables, quantum sensing systems
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            RESEARCH INQUIRIES
          </h2>
          <div className="p-6 border border-primary rounded-lg bg-card">
            <p className="text-foreground/80 mb-4">
              Interested in collaboration, licensing, or validation
              partnerships?
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-cyan font-bold">Email:</span>{" "}
                aitconsult22@gmail.com
              </p>
              <p>
                <span className="text-cyan font-bold">Phone:</span> (216)
                307-0174
              </p>
              <p className="text-foreground/70 mt-4">
                Patent Application: U.S. App. No. 63/934,269 · Filed December
                11, 2025 · Confirmation #6305
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
