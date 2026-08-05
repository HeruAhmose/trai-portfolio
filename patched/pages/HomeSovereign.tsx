import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';
import { NeuralNetworkViz } from '@/components/NeuralNetworkViz';
import { QuantumComputingViz } from '@/components/QuantumComputingViz';
import { BlockchainVisualization } from '@/components/BlockchainVisualization';
import { DNAHelix } from '@/components/DNAHelix';
import OrganPortal, { ORGAN_DATA } from '@/components/OrganPortal';
import OrganCanvas from '@/components/OrganCanvas';
import RememberedWorldMap from '@/components/RememberedWorldMap';
import sovereignAudio from '@/lib/sovereignAudio';
import { ArchiveRail, BiomimicryGrid, TechnologyGrid, VideoPanel, MediaFrame } from '@/components/MediaSystem';
import { VIDEO, TAMERIAN } from '@/lib/media';

const C = {
  gold: '#d8aa43',
  cream: '#f4f0e6',
  dark: '#050709',
  mid: '#070b0f',
};


const FLYWHEEL = [
  { num: '01', label: 'Material', title: 'Structural sovereignty', copy: 'Research and material platforms create the substrate on which the wider organism can stand.' },
  { num: '02', label: 'Metabolism', title: 'Biological sovereignty', copy: 'Daily ritual translates the architecture into a tangible relationship between body, discipline and value.' },
  { num: '03', label: 'Intelligence', title: 'Cognitive sovereignty', copy: 'Protective intelligence coordinates decisions without surrendering trust, agency or memory.' },
  { num: '04', label: 'Mobility', title: 'Movement sovereignty', copy: 'Resilient routes connect people, goods and opportunity across the organism.' },
  { num: '05', label: 'Identity', title: 'Cultural sovereignty', copy: 'Material culture protects dignity, expression and the memory carried through form.' },
  { num: '06', label: 'Access', title: 'Community reach', copy: 'Skills, navigation and digital infrastructure convert systems into usable pathways.' },
  { num: '07', label: 'Foundation', title: 'Regenerative return', copy: 'Surplus, knowledge and capacity return to the communities that make the system possible.' },
];


export default function HomeSovereign() {
  const [, navigate] = useLocation();
  const [activeStage, setActiveStage] = useState('material');
  const [activeOrgan, setActiveOrgan] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hoveredOrgan, setHoveredOrgan] = useState<number | null>(null);

  // Portal opens from a card click, and from the lateral nav inside the portal.
  const openOrgan = React.useCallback((i: number) => {
    setActiveOrgan(i);
    sovereignAudio.portalOpen(i);
  }, []);

  // The AudioContext can only be created inside a user gesture, which is why
  // the previous boolean-only toggle could never produce sound.
  const toggleAudio = React.useCallback(async () => {
    const on = await sovereignAudio.toggle();
    setAudioEnabled(on);
  }, []);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -120]);

  const activeFlywheelStage = FLYWHEEL.find(s => s.label.toLowerCase() === activeStage) || FLYWHEEL[0];

  return (
    <div className="min-h-screen bg-[#050709] text-[#f4f0e6] overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Layer 0: Deep starfield */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <SovereignNebulaGL />
        </div>
        {/* Layer 4: Heart orb + orbital rings */}
        <motion.div
          className="absolute right-[8%] top-1/2 -translate-y-1/2 pointer-events-none z-[4]"
          style={{ y: heroParallax }}
        >
          {/* Orbital rings */}
          {[280, 360, 440].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[#d8aa43]/10"
              style={{ width: size, height: size, top: '50%', left: '50%', marginLeft: -size/2, marginTop: -size/2 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 40 + i * 20, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Heart orb */}
          <motion.div
            className="w-48 h-48 rounded-full relative"
            style={{ background: 'radial-gradient(circle at 35% 32%, #ffe090 0%, #d8aa43 38%, #8a6018 68%, #1a1004 100%)' }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 38% 35%, rgba(255,230,140,0.35) 0%, transparent 60%)' }} />
          </motion.div>
          {/* Outer glow halo */}
          <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: '50%', left: '50%', marginLeft: -250, marginTop: -250, background: 'radial-gradient(circle, rgba(216,170,67,0.12) 0%, transparent 70%)' }} />
        </motion.div>
        {/* Hero content */}
        <div className="relative z-[5] max-w-[1380px] mx-auto px-6 lg:px-12 py-32">
          <motion.p className="ceremonial-label mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            The TRAI Sovereignty Architecture
          </motion.p>
          {/* Split-line display serif headline */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              className="display-heading text-[clamp(3.8rem,9vw,8rem)] max-w-[780px]"
              initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              One regenerative
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="display-heading text-[clamp(3.8rem,9vw,8rem)] max-w-[780px]"
              style={{ color: '#d8aa43', WebkitTextFillColor: '#d8aa43', textShadow: '0 0 80px rgba(216,170,67,0.35)' }}
              initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              organism.
            </motion.h1>
          </div>
          <motion.p className="text-xl text-[#f4f0e6]/55 mb-10 max-w-[440px] leading-relaxed font-sans tracking-wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            Seven organs of sovereignty.<br />One flywheel of return.
          </motion.p>
          <motion.div className="flex flex-wrap gap-4 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <button
              onClick={() => navigate('/materials')}
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709] active:scale-[0.97] transition-transform"
              style={{ background: C.gold }}
            >
              Enter the Organism
            </button>
            <button
              onClick={() => document.getElementById('world')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-sans text-[#f4f0e6]/60 hover:text-[#f4f0e6] transition-colors"
            >
              See the remembered world →
            </button>
            <button
              onClick={toggleAudio}
              className="ml-auto text-xs font-sans text-[#d8aa43]/50 hover:text-[#d8aa43] transition-colors border border-[#d8aa43]/20 px-3 py-1.5"
            >
              {audioEnabled ? '◉ Sound on' : '○ Sound off'}
            </button>
          </motion.div>
          <motion.div className="flex gap-8 mt-16 pt-8 border-t border-[#d8aa43]/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            {[['07', 'coordinated organs'], ['01', 'sovereignty flywheel'], ['∞', 'regenerative return']].map(([n, l]) => (
              <div key={l}>
                <span className="glow-number text-2xl">{n}</span>
                <span className="text-xs font-sans text-[#f4f0e6]/40 ml-2">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Spatial audio */}
      </section>

      {/* ── DOCTRINE SECTION ── */}
      <hr className="sovereign-rule" />
      <section className="py-40 section-deep relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="max-w-[680px]">
            <motion.p className="ceremonial-label mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              01 — The Doctrine
            </motion.p>
            <motion.h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              A sovereign system is stronger than any single venture.
            </motion.h2>
            <motion.p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              Intelligence, metabolism, movement, identity, access and community return — each depends on one coordinated body.
            </motion.p>
            <motion.p className="text-sm text-[#d8aa43]/60 font-sans tracking-wide" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              The organism is the strategy. The organ is the instrument.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── FLYWHEEL SECTION ── */}
      <hr className="sovereign-rule" />
      <section className="py-40 sovereign-bg relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="ceremonial-label mb-6">02 — The Flywheel</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">
                Value circulates.<br />Capacity returns.<br />The wheel turns.
              </h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">
                True Melange Φ is the biological heart — the first product that carries the organism's philosophy into daily life. 28 mg Affron® saffron. Blue-Gold Daily.
              </p>
              <button onClick={() => navigate('/true-melange')} className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">
                Explore True Melange Φ →
              </button>
            </motion.div>
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <DNAHelix interactive={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE SECTION ── */}
      <hr className="sovereign-rule" />
      <section className="py-40 section-deep relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <NeuralNetworkViz />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="ceremonial-label mb-6">03 — Cognitive Sovereignty</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">
                A tangible entry point into the larger system.
              </h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">
                Queen Califia CyberAI — autonomous cybersecurity intelligence. Triple-core architecture. Sovereign Afrofuturist aesthetic. The nervous system of the organism.
              </p>
              <a href="https://queencalifia-cyberai.web.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">
                Visit Queen Califia ↗
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MATERIAL SCIENCE SECTION ── */}
      <hr className="sovereign-rule" />
      <section className="py-40 sovereign-bg relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="ceremonial-label mb-6">04 — Material Sovereignty</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">
                Quantum sensing.<br />Room-temperature target.
              </h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-6">
                Patent App 63/934,269 proposes quantum sensing via NV-center-like defects in the hemp-carbon matrix. Target coherence T₂ &gt; 500 ns at 300K. Active research hypothesis — not yet confirmed.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Eu', 'Nd', 'Er', 'Yb', 'Ce'].map(d => (
                  <span key={d} className="text-xs font-mono text-[#d8aa43]/50 border border-[#d8aa43]/15 px-3 py-1.5">{d} dopant</span>
                ))}
              </div>
              <button onClick={() => navigate('/materials')} className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">
                Explore Tamerian Materials →
              </button>
            </motion.div>
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <QuantumComputingViz />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── IP & GOVERNANCE SECTION ── */}
      <hr className="sovereign-rule" />
      <section className="py-40 section-deep relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <BlockchainVisualization blockCount={6} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="ceremonial-label mb-6">05 — IP & Governance</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">
                The Sovereign Ledger.
              </h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">
                One hemp substrate. One sovereignty philosophy. One community mission. IP, security, and capital architecture coordinated under TRAI.
              </p>
              <div className="space-y-3 mb-8">
                {['Patent App 63/934,269 · Filed Dec 11 2025', '25 claims · Confirmation #6305 · Micro Entity', 'Jon Peoples · U.S. Navy Veteran (OEF) · Concord, NC'].map(f => (
                  <p key={f} className="text-xs font-mono text-[#d8aa43]/60">{f}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-6">
                <a href="https://tamerian-materials.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">Tamerian Materials ↗</a>
                <a href="https://github.com/HeruAhmose" target="_blank" rel="noopener noreferrer" className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">GitHub: HeruAhmose ↗</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ORIGIN ── */}
      <section id="origin" className="py-32">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12 max-w-[62ch]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">06 — Origin</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>A number, chosen.</h2>
            <p className="text-[#f4f0e6]/55 font-sans leading-relaxed">
              His father wore №44 at Salisbury. He took №6 — his own number, at Kannapolis and again at Maritime, then dress whites in the Navy. Two decades on, a community page ranked him fourteenth among every running back the town has produced. The discipline that built the architecture was learned somewhere, and it was not a lab.
            </p>
          </motion.div>
          <ArchiveRail />
        </div>
      </section>

            {/* ── SEVEN ORGANS GRID ── */}
      <section id="organs" className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">07 — Seven organs</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>Distinct functions. One body.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ORGAN_DATA.map((organ, i) => (
              <motion.article
                key={organ.num}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                className="group relative p-6 border cursor-pointer transition-all overflow-hidden border-[#d8aa43]/10 hover:border-[#d8aa43]/40 hover:bg-[#d8aa43]/5 focus:outline-none focus-visible:border-[#d8aa43]"
                onClick={() => openOrgan(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openOrgan(i); }
                }}
                onMouseEnter={() => { setHoveredOrgan(i); sovereignAudio.hover(i); }}
                onMouseLeave={() => setHoveredOrgan((h) => (h === i ? null : h))}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
              >
                {/* live visualisation wakes on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <OrganCanvas organ={organ.key} active={hoveredOrgan === i} className="w-full h-full opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050709] via-[#050709]/60 to-transparent" />
                </div>
                <div className="relative">
                  <span className="text-xs font-sans tracking-widest text-[#d8aa43]/50 block mb-3">{organ.num} · {organ.role}</span>
                  <h3 className="font-bold text-[#f4f0e6] mb-2 text-lg" style={{ WebkitTextFillColor: '#f4f0e6' }}>{organ.name}</h3>
                  <p className="text-sm text-[#f4f0e6]/50 font-sans leading-relaxed">{organ.tagline} — {organ.body.slice(0, 96)}…</p>
                  <span className="mt-4 block text-xs font-sans text-[#d8aa43]/60 group-hover:text-[#d8aa43] transition-colors">Enter the {organ.role.toLowerCase()} →</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPRIETARY TECHNOLOGIES ── */}
      <section id="technologies" className="py-32">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-center mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">08 — Proprietary technologies</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>Six programmes. One substrate.</h2>
              <p className="text-[#f4f0e6]/55 font-sans leading-relaxed max-w-[58ch]">
                Every card below states its stage. One is a filed patent, one is deployed and running, and the rest are research. Nothing here is presented as further along than it is.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <VideoPanel video={VIDEO.tamerianProject} className="aspect-video border border-[#d8aa43]/10" />
            </motion.div>
          </div>
          <TechnologyGrid />
        </div>
      </section>

      {/* ── BIOMIMICRY ── */}
      <section id="biomimicry" className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12 max-w-[62ch]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">09 — Biomimicry</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>The solved problems.</h2>
            <p className="text-[#f4f0e6]/55 font-sans leading-relaxed">
              A wing scale makes colour from structure rather than pigment. A gecko's foot holds without adhesive. These are not metaphors borrowed for a brochure — they are the reference cases the materials work reads from.
            </p>
          </motion.div>
          <BiomimicryGrid />
          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <VideoPanel video={VIDEO.butterfly} className="aspect-video border border-[#d8aa43]/10" />
            <MediaFrame item={TAMERIAN[7]} className="aspect-video border border-[#d8aa43]/10" />
          </div>
        </div>
      </section>

      {/* ── REMEMBERED WORLD ── */}
      <section id="world" className="py-32">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">08 — The remembered world</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>Seven regions. Seven functions. One memory.</h2>
            <p className="text-[#f4f0e6]/55 font-sans max-w-[62ch] leading-relaxed">Each region stands for a venture, and the routes between them are the order value travels through the architecture. Follow the light around the loop.</p>
          </motion.div>
          <RememberedWorldMap />
        </div>
      </section>

      {/* ── FOUNDATION RETURN ── */}
      <section className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">09 — Community return</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>
                Surplus returns as care, capability and continuity.
              </h2>
              <p className="text-[#f4f0e6]/60 font-sans leading-relaxed mb-6">
                The Peoples Foundation is not an afterthought. It is the regenerative heart that licenses, protects and re-invests value.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {['Funeral assistance', 'Violence interruption', 'Youth athletics', 'Digital navigation', 'Spiritual healing', 'Community wellbeing'].map(p => (
                  <div key={p} className="p-3 border border-[#d8aa43]/10 text-xs font-sans text-[#f4f0e6]/50 text-center">{p}</div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="space-y-4">
                {['Funeral and bereavement assistance', 'Violence interruption programs', 'Youth athletics and mentorship', 'Digital navigation (TechBridge coordination)', 'Spiritual healing and community wellbeing'].map((p, i) => (
                  <motion.div key={p} className="flex gap-4 items-start" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d8aa43] mt-2 flex-shrink-0" />
                    <p className="text-sm font-sans text-[#f4f0e6]/60">{p}</p>
                  </motion.div>
                ))}
                <p className="text-xs font-sans text-[#f4f0e6]/30 mt-4 pt-4 border-t border-[#d8aa43]/10">
                  Allocations subject to written agreements, counsel review, and applicable charitable-solicitation compliance. EIN obtained; federal tax-exempt status pending counsel confirmation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE MANIFESTO ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-15">
        </div>
        <div className="relative z-10 max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-16 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">10 — Architecture</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-6 max-w-2xl mx-auto" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>Mythic in presentation. Exact in claim.</h2>
            <p className="text-[#f4f0e6]/50 font-sans max-w-xl mx-auto">The architecture rests on a single governing standard: Vast in Vision, Exact in Claim.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Progressive by default', body: 'The architecture is designed for resilience through distinct technical, market, funding, and revenue pathways.' },
              { title: 'Performance governed', body: 'Technology-readiness levels are founder-assessed and flagged for independent validation. No venture is overstated.' },
              { title: 'Privacy respected', body: 'Data flows under consent, purpose limitation, and community-advisory authority where promised.' },
              { title: 'Claims separated', body: 'Vision is allowed to be limitless precisely because it is named as vision. Funded work rests on filed IP and labeled R&D hypotheses.' },
            ].map((item, i) => (
              <motion.div key={i} className="p-6 border border-[#d8aa43]/10 hover:border-[#d8aa43]/30 transition-colors" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -2 }}>
                <h3 className="font-bold text-[#d8aa43] mb-3 text-sm" style={{ WebkitTextFillColor: '#d8aa43' }}>{item.title}</h3>
                <p className="text-sm text-[#f4f0e6]/50 font-sans leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-[#070b0f] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
        </div>
        <motion.div className="relative z-10 max-w-2xl mx-auto px-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-6" style={{ color: C.cream, WebkitTextFillColor: C.cream }}>
            Build the organism, not another isolated product.
          </h2>
          <p className="text-[#f4f0e6]/50 font-sans mb-10 text-lg">Partners, researchers, operators and institutions can enter through a pathway designed for their role.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:aitconsult22@gmail.com?subject=TRAI%20Partnership%20Inquiry" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709] active:scale-[0.97] transition-transform" style={{ background: C.gold }}>
              Build with us
            </a>
            <a href="https://calendly.com/aitconsult22/30min" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#d8aa43] border border-[#d8aa43]/40 hover:border-[#d8aa43] transition-colors">
              Book a call
            </a>
          </div>
        </motion.div>
      </section>

      <OrganPortal index={activeOrgan} onClose={() => setActiveOrgan(null)} onNavigate={openOrgan} />
    </div>
  );
}
