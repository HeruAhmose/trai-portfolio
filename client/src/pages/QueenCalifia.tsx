import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { NeuralNetworkViz } from '@/components/NeuralNetworkViz';
import { QuantumComputingViz } from '@/components/QuantumComputingViz';
import { BlockchainVisualization } from '@/components/BlockchainVisualization';

const CORES = [
  {
    id: 'cyber',
    num: '01',
    name: 'Cyber Core',
    color: '#00d9ff',
    glow: 'rgba(0,217,255,0.15)',
    desc: 'Autonomous threat detection, vulnerability scanning, one-click remediation, and self-learning security engine. Protects the portfolio\'s IP, data, and operations.',
    capabilities: ['Autonomous threat detection', 'One-click remediation', 'Self-learning security engine', 'Vulnerability scanning', 'Quantum hardening layer'],
    funding: 'NSF, DARPA, DoD cybersecurity programs',
  },
  {
    id: 'identity',
    num: '02',
    name: 'Identity Core',
    color: '#d8aa43',
    glow: 'rgba(216,170,67,0.15)',
    desc: 'Sovereign identity architecture. Manages authentication, authorization, and the cultural identity layer that carries the Afrofuturist sovereignty philosophy.',
    capabilities: ['Sovereign identity management', 'Cultural identity layer', 'Afrofuturist aesthetic engine', 'Portfolio brand coherence', 'Community trust architecture'],
    funding: 'Veteran-owned & Black-owned business designations',
  },
  {
    id: 'markets',
    num: '03',
    name: 'Markets Core',
    color: '#6b8c3a',
    glow: 'rgba(107,140,58,0.15)',
    desc: 'AI-operations layer for the portfolio. Coordinates intelligence across ventures, supports capital strategy, and provides the shared-services security capability.',
    capabilities: ['Portfolio AI coordination', 'Capital strategy support', 'Shared-services security', 'Federal contracting pathways', 'Revenue intelligence layer'],
    funding: 'NSF SBIR, federal contracting set-asides',
  },
];

const SYNERGIES = [
  { from: 'Queen Califia', to: 'Tamerian Materials', type: 'Security', desc: 'Protects the patent estate and research data for App 63/934,269' },
  { from: 'Queen Califia', to: 'True Mélange Φ', type: 'AI-Ops', desc: 'Coordinates formulation data, regulatory documents, and supply chain intelligence' },
  { from: 'Queen Califia', to: 'TechBridge', type: 'Infrastructure', desc: 'Powers H.K. AI integration and Digital Navigator platform security' },
  { from: 'Queen Califia', to: 'Portfolio', type: 'Brand', desc: 'Carries the Queen Califia mythos — the unifying Afrofuturist sovereignty narrative' },
];

export default function QueenCalifia() {
  const [activeCore, setActiveCore] = useState('cyber');
  const core = CORES.find(c => c.id === activeCore) || CORES[0];

  return (
    <div className="min-h-screen bg-[#050709] text-[#f4f0e6] overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <SovereignNebulaGL variant="cyber" />
        </div>
        {/* Cyan/sapphire glow — Califia's color */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 65% 50%, rgba(0,100,180,0.18) 0%, rgba(0,40,80,0.10) 50%, transparent 80%)' }} />
        {/* Neural network always-on background */}
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none opacity-30 z-[1]">
          <NeuralNetworkViz />
        </div>
        <div className="relative z-[2] max-w-[1380px] mx-auto px-6 lg:px-12 py-32">
          <motion.p className="text-xs tracking-[0.22em] uppercase text-[#00d9ff]/70 mb-4 font-sans" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            03 · Intelligence · Cognitive Sovereignty
          </motion.p>
          <motion.h1
            className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.05] mb-6 max-w-[700px]"
            style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            Queen Califia.
          </motion.h1>
          <motion.p className="text-xl text-[#f4f0e6]/60 max-w-[560px] leading-relaxed font-sans mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Autonomous cybersecurity intelligence. Flask/React stack, triple-core architecture. The nervous system of the TRAI organism.
          </motion.p>
          <motion.div className="flex flex-wrap gap-4 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <a
              href="https://queencalifia-cyberai.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709] active:scale-[0.97] transition-transform"
              style={{ background: '#00d9ff' }}
            >
              Enter Queen Califia ↗
            </a>
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#00d9ff] border border-[#00d9ff]/40 hover:border-[#00d9ff] transition-colors"
            >
              Book a Call
            </a>
          </motion.div>
          <motion.div className="flex gap-8 mt-16 pt-8 border-t border-[#00d9ff]/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            {[['03', 'system layer'], ['Flask/React', 'tech stack'], ['Dual', 'product + ops role']].map(([n, l]) => (
              <div key={l}>
                <span className="text-xl font-bold text-[#00d9ff] font-mono">{n}</span>
                <span className="text-xs font-sans text-[#f4f0e6]/40 ml-2">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRIPLE-CORE ARCHITECTURE ── */}
      <section className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#00d9ff]/70 mb-4 font-sans">Triple-Core Architecture</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>
              Three cores. One sovereign intelligence.
            </h2>
            <p className="text-[#f4f0e6]/50 font-sans max-w-2xl">
              Queen Califia CyberAI plays a dual role: a fundable and sellable cybersecurity product, and the natural security and AI-operations layer for the rest of the portfolio.
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            {/* Core selector */}
            <div className="space-y-3">
              {CORES.map((c, i) => (
                <motion.button
                  key={c.id}
                  className={`w-full text-left p-6 border transition-all ${activeCore === c.id ? 'border-[#00d9ff]/50 bg-[#00d9ff]/5' : 'border-[#d8aa43]/10 hover:border-[#d8aa43]/30'}`}
                  onClick={() => setActiveCore(c.id)}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-xs font-mono text-[#f4f0e6]/40">{c.num}</span>
                    <h3 className="font-bold" style={{ color: activeCore === c.id ? c.color : '#f4f0e6', WebkitTextFillColor: activeCore === c.id ? c.color : '#f4f0e6' }}>{c.name}</h3>
                  </div>
                  <p className="text-sm text-[#f4f0e6]/50 font-sans leading-relaxed">{c.desc}</p>
                </motion.button>
              ))}
            </div>
            {/* Active core detail */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={activeCore} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-8 border" style={{ borderColor: `${core.color}30`, background: core.glow }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-4 h-4 rounded-full" style={{ background: core.color, boxShadow: `0 0 20px ${core.color}` }} />
                    <h3 className="text-xl font-bold" style={{ color: core.color, WebkitTextFillColor: core.color }}>{core.name}</h3>
                  </div>
                  <div className="space-y-2 mb-6">
                    {core.capabilities.map(cap => (
                      <div key={cap} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: core.color }} />
                        <span className="text-sm font-sans text-[#f4f0e6]/70">{cap}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: `${core.color}20` }}>
                    <p className="text-xs font-sans text-[#f4f0e6]/40">Funding pathway: <span style={{ color: core.color }}>{core.funding}</span></p>
                  </div>
                  {/* Visualization */}
                  <div className="mt-6 h-48 overflow-hidden">
                    {activeCore === 'cyber' && <NeuralNetworkViz />}
                    {activeCore === 'identity' && <QuantumComputingViz />}
                    {activeCore === 'markets' && <BlockchainVisualization blockCount={5} />}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── AFROFUTURIST MYTHOS ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,80,140,0.12) 0%, transparent 70%)' }} />
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-xs tracking-[0.22em] uppercase text-[#00d9ff]/70 mb-4 font-sans">The Mythos</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>
                Named for the first Black queen of California.
              </h2>
              <p className="text-[#f4f0e6]/60 font-sans leading-relaxed mb-6">
                Queen Califia — the legendary Black warrior queen from Garci Rodríguez de Montalvo's 1510 novel <em>Las Sergas de Esplandián</em> — is the namesake that carries the ecosystem's governing mythos. The Afrofuturist and Queen Califia layer is carried as cultural identity, brand, and mission — never as an empirical or biological claim.
              </p>
              <p className="text-[#f4f0e6]/60 font-sans leading-relaxed mb-6">
                The unifying brand and mission — Afrofuturist technological sovereignty anchored in the Queen Califia mythos and delivered through community ownership — make the portfolio coherent rather than scattered.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Veteran-owned', 'Black-owned', 'Sovereign Afrofuturist', 'Community-mission driven', 'Concord, NC'].map(tag => (
                  <span key={tag} className="text-xs font-sans text-[#00d9ff]/70 border border-[#00d9ff]/20 px-3 py-1.5">{tag}</span>
                ))}
              </div>
            </motion.div>
            <motion.div className="h-[400px]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <NeuralNetworkViz />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CROSS-VENTURE SYNERGY ── */}
      <section className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#00d9ff]/70 mb-4 font-sans">Cross-Venture Synergy</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>
              The nervous system of the organism.
            </h2>
            <p className="text-[#f4f0e6]/50 font-sans max-w-2xl">Queen Califia CyberAI is both a commercial product and the shared-services security and AI-operations layer for the entire portfolio.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {SYNERGIES.map((s, i) => (
              <motion.div
                key={i}
                className="p-6 border border-[#00d9ff]/10 hover:border-[#00d9ff]/30 transition-colors"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-[#00d9ff]/60 border border-[#00d9ff]/20 px-2 py-0.5">{s.type}</span>
                  <span className="text-xs font-sans text-[#f4f0e6]/30">{s.from} → {s.to}</span>
                </div>
                <p className="text-sm text-[#f4f0e6]/60 font-sans leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUNDING PATHWAYS ── */}
      <section className="py-32">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#00d9ff]/70 mb-4 font-sans">Federal Funding Strategy</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>
              Diversified across non-correlated agencies.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { agency: 'NSF', programs: 'SBIR/STTR, Convergence Accelerator, AI programs', relevance: 'Cybersecurity AI, materials science, digital equity' },
              { agency: 'DARPA', programs: 'Cyber programs, AI Next Campaign', relevance: 'Autonomous cybersecurity, AI-ops layer' },
              { agency: 'DoD', programs: 'SBIR, veteran-owned set-asides', relevance: 'Veteran-owned business designation, cybersecurity' },
              { agency: 'SBA', programs: '8(a), SBIR, veteran/minority set-asides', relevance: 'Black-owned + veteran-owned dual designation' },
              { agency: 'NTIA', programs: 'Digital equity, workforce programs', relevance: 'TechBridge integration, community access mission' },
              { agency: 'Equity capital', programs: 'Integrated portfolio raise', relevance: 'Sequences non-dilutive grants first, then equity' },
            ].map((item, i) => (
              <motion.div key={i} className="p-5 border border-[#00d9ff]/10 hover:border-[#00d9ff]/25 transition-colors" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <h3 className="font-bold text-[#00d9ff] mb-2 text-sm" style={{ WebkitTextFillColor: '#00d9ff' }}>{item.agency}</h3>
                <p className="text-xs font-mono text-[#f4f0e6]/50 mb-2">{item.programs}</p>
                <p className="text-xs font-sans text-[#f4f0e6]/40">{item.relevance}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-xs font-sans text-[#f4f0e6]/30">Program eligibility and current announcements must be verified at time of application. Market figures and legal structure are flagged for verification rather than asserted.</p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-[#070b0f] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <NeuralNetworkViz />
        </div>
        <motion.div className="relative z-10 max-w-2xl mx-auto px-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>
            Enter the sovereign intelligence layer.
          </h2>
          <p className="text-[#f4f0e6]/50 font-sans mb-10">The live Queen Califia CyberAI platform is deployed at queencalifia-cyberai.web.app. Partnerships, licensing, and investment inquiries welcome.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://queencalifia-cyberai.web.app/" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709] active:scale-[0.97] transition-transform" style={{ background: '#00d9ff' }}>
              Visit Queen Califia ↗
            </a>
            <a href="mailto:aitconsult22@gmail.com?subject=Queen%20Califia%20Inquiry" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#00d9ff] border border-[#00d9ff]/40 hover:border-[#00d9ff] transition-colors">
              Contact Jon Peoples
            </a>
            <a href="https://calendly.com/aitconsult22/30min" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#d8aa43] border border-[#d8aa43]/40 hover:border-[#d8aa43] transition-colors">
              Book a Call
            </a>
          </div>
          <p className="mt-6 text-xs font-mono text-[#f4f0e6]/30">(216) 307-0174 · aitconsult22@gmail.com · GitHub: HeruAhmose · Concord, NC</p>
        </motion.div>
      </section>

    </div>
  );
}
