import { useState } from 'react';
import { motion } from 'framer-motion';
import AMCVisualization from '@/components/AMCVisualization';
import { EnhancedPatentExplorer } from '@/components/EnhancedPatentExplorer';
import ManufacturingProcess from '@/components/ManufacturingProcess';
import { InteractiveButton } from '@/components/InteractiveButton';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';

export default function MaterialsScience() {
  const [activeTab, setActiveTab] = useState<'visualization' | 'patents' | 'manufacturing'>('visualization');
  const { playTransition } = useSoundEffects(true);

  return (
    <div className="min-h-screen relative" style={{ background: '#050709' }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <SovereignNebulaGL variant="copper" />
      </div>
      <div className="relative z-[1]">
      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            <span className="text-primary neon-text">TAMERIAN MATERIALS</span>
          </h1>
          <p className="text-2xl text-cyan mb-2">Where Carbon Meets Crystal</p>
          <p className="text-xl text-foreground/80 max-w-2xl">
            Multi-Modal Energy Harvesting Composite from Hemp-Derived Carbon. U.S. Patent Application 63/934,269 · Filed December 11, 2025 · 25 Claims · Confirmation #6305 · Micro Entity
          </p>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-4 flex-wrap border-b border-border pb-4">
          {[
            { id: 'visualization', label: 'TECHNOLOGY' },
            { id: 'patents', label: 'PATENT CLAIMS (25)' },
            { id: 'manufacturing', label: 'MANUFACTURING (7-STEP)' },
          ].map((tab) => (
            <InteractiveButton
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
              playTransition();
              setActiveTab(tab.id as typeof activeTab);
            }}
              soundEnabled={true}
              holographic={true}
            >
              {tab.label}
            </InteractiveButton>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        {activeTab === 'visualization' && (
          <motion.div
            key="visualization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Visualization */}
              <div className="lg:col-span-2">
                <AMCVisualization isActive={activeTab === 'visualization'} />
              </div>

              {/* Constituents Info */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold text-foreground text-lg">CONSTITUENTS</h3>
                {[
                  { name: 'Hemp-Carbon Matrix', color: '#ffd700', role: 'Pyrolysis 700–1400°C · Conductivity 10²–10⁶ S/m' },
                  { name: 'Quartz SiO₂', color: '#00d9ff', role: 'Piezoelectric · 15–45% composition' },
                  { name: 'Tourmaline', color: '#ff00ff', role: 'Dual piezo/pyro · 3–25% composition' },
                  { name: 'Magnetite Fe₃O₄', color: '#00ff88', role: 'Ferrimagnetic · 2–20% composition' },
                ].map((constituent, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 rounded border border-border bg-card hover:border-primary transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: constituent.color }}
                      />
                      <h4 className="font-semibold text-foreground">{constituent.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{constituent.role}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Description */}
            <motion.div
              className="p-6 rounded border border-border bg-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-foreground mb-4">MULTI-MODAL ENERGY HARVESTING</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><p className="text-lime-500 font-bold">Piezoelectric:</p><p className="text-foreground/80">50–500 μW/cm²</p></div>
                <div><p className="text-lime-500 font-bold">Thermoelectric:</p><p className="text-foreground/80">ZT target: <p className="text-foreground/80">ZT 1.0–2.5</p>gt;1.0 (proposed)</p></div>
                <div><p className="text-lime-500 font-bold">Spin-Seebeck:</p><p className="text-foreground/80">+40–60%</p></div>
                <div><p className="text-lime-500 font-bold">Combined Output:</p><p className="text-foreground/80">80–800 μW/cm²</p></div>
              </div>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Quantum Sensing: Rare-earth dopants (Eu³⁺, Nd³⁺, Er³⁺, Yb³⁺, Ce³⁺) with coherence T₂ {'>'} 500 ns at room temperature. Self-powered magnetic, temperature, and strain sensing.
              </p>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'patents' && (
          <motion.div
            key="patents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <EnhancedPatentExplorer />
          </motion.div>
        )}

        {activeTab === 'manufacturing' && (
          <motion.div
            key="manufacturing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <ManufacturingProcess />
          </motion.div>
        )}
      </section>

      {/* Key Metrics */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'PATENT CLAIMS', value: '25' },
            { label: 'CORE TECHNOLOGIES', value: '4' },
            { label: 'ENERGY MODES', value: '4' },
            { label: 'MANUFACTURING STEPS', value: '7' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded border border-border bg-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-primary neon-text">{metric.value}</div>
              <p className="text-xs font-mono text-muted-foreground mt-2 tracking-widest">
                {metric.label}
              </p>
              {metric.label === 'PATENT CLAIMS' && <p className="text-xs text-cyan mt-1">U.S. App. 63/934,269</p>}
          {metric.label === 'MANUFACTURING STEPS' && <p className="text-xs text-lime-500 mt-1">Fiber to QC</p>}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Concept Renders */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <p className="text-xs font-mono text-[#d8aa43]/60 tracking-[0.2em] uppercase mb-8">Conceptual Visualization — Research Direction</p>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div className="overflow-hidden rounded" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <img src="/media/tamerian/living-circuit.jpg" alt="Energy transfer visualization concept" className="w-full h-64 object-cover" style={{ filter: 'brightness(0.85) saturate(0.9)' }} />
          </motion.div>
          <motion.div className="overflow-hidden rounded" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <img src="/media/tamerian/helix-lab.jpg" alt="Lattice structure visualization concept" className="w-full h-64 object-cover" style={{ filter: 'brightness(0.85) saturate(0.9)' }} />
          </motion.div>
        </div>
      <p className="text-xs font-mono text-muted-foreground mt-4">Conceptual AI renders for research communication purposes only. Not photographs of actual materials or devices.</p>
      </section>
    </div>
    </div>
  );
}
