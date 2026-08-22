import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';
import { motion } from 'framer-motion';

import { DNAHelix } from '@/components/DNAHelix';

const PHI_LAYERS = [
  { id: 'Φ-1', name: 'Red-Gold Core', color: '#c8502a', desc: 'Saffron — Affron® 28 mg/day. Apocarotenoid mood and antioxidant support. Standardized to ≥3.5% Lepticrosalides (Pharmactive, patent US10933110B2).' },
  { id: 'Φ-0', name: 'Soma Matrix', color: '#6b8c3a', desc: 'Hempseed oil, hemp seed protein (GRAS GRN 765/771/778). No CBD, no THC, no hemp flower or leaf.' },
  { id: 'Φ-2', name: 'Spice Flame', color: '#c87a2a', desc: 'Cinnamon, cardamom, ginger. Sensory ritual — warmth and flavor.' },
  { id: 'Φ-3', name: 'Mind Lattice', color: '#3a8c6b', desc: 'Green tea + L-theanine. Calm-focus support. Low-dose caffeine 15–30 mg/serving.' },
  { id: 'Φ-5', name: 'Longevity Root', color: '#8c3a6b', desc: 'Pomegranate, amla, turmeric, black seed. Polyphenol antioxidant and inflammatory-balance layer.' },
  { id: 'Φ-8', name: 'Mito-Fungal Web', color: '#5a4a2a', desc: 'Ergothioneine mushrooms, lion\'s mane, spermidine ferment. Cellular-maintenance and mitochondrial-support layer.' },
  { id: 'Φ-13', name: 'BioDelivery Shell', color: '#3a5a8c', desc: 'Emulsion system for the Daily SKU. Hemp-CNC Pickering emulsion in development for advanced lanes.' },
  { id: 'Blue Veil', name: 'The Blue Veil', color: '#1a5a8c', desc: 'Galdieria extract blue (21 CFR 73.167) — primary colorant. Butterfly pea flower (21 CFR 73.69) — secondary accent. Gardenia blue excluded (soy allergen, less stable).' },
  { id: 'Φ-21', name: 'Sovereignty Loop', color: '#d8aa43', desc: 'Not an ingredient. The Sovereignty Covenant: a defined allocation architecture — charitable (Peoples Foundation), independent research-access, and commercial ecosystem reinvestment. To be implemented through written agreements once adopted.' },
];

const MILESTONES = [
  { months: '1–4', label: 'Formulation lock and analytical method validation (saffron HPLC, caffeine, EGCG, ICP-MS, cannabinoids)' },
  { months: '2–5', label: 'Regulatory counsel written opinion: beverage category, colorant use, hemp inputs, claims language, label copy' },
  { months: '2–4', label: 'Trademark counsel on "Melange" — free preliminary knockout search at USPTO first' },
  { months: '1–2', label: 'EINs filed for all 4 entities (Tamerian, Queen Califia, True Mélange Φ, TechBridge). NC Articles of Organization ($125/entity)' },
  { months: '1–2', label: 'Co-packer outreach: Carolina Beverage Group (Mooresville NC, 704.799.2337) and Niche Beverage Company' },
  { months: '4–8', label: 'Co-manufacturer qualification, NDA, development batch (bench → pilot 1,000–5,000 units)' },
  { months: '6–9', label: 'Soft DTC launch via Shopify + Amazon; NC specialty retail outreach' },
  { months: '6–10', label: 'Human pilot study IRB approval and ClinicalTrials.gov registration' },
  { months: '4–12', label: 'Saffron agronomic pilot trial — Fibonacci spacing, ISO 3632 testing' },
  { months: '3–9', label: 'Provisional patent filings: Pickering emulsion, Blue-Gold compositions, staged BioReactor process' },
];

export default function TrueMelangePhi() {
  return (
    <div className="min-h-screen bg-[#050709] text-[#f4f0e6]">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <SovereignNebulaGL variant="saffron" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(200,80,42,0.12) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-[1380px] mx-auto px-6 lg:px-12 py-24">
          <motion.p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            02 · Metabolism · Biological Sovereignty
          </motion.p>
          <motion.h1 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.05] mb-6 max-w-[700px]" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            True Mélange Φ
          </motion.h1>
          <motion.p className="text-xl text-[#f4f0e6]/60 max-w-[560px] leading-relaxed font-sans mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            A saffron-hemp biotechnology platform. The biological heart of the TRAI organism. First product: Blue-Gold Daily.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {['Saffron 28 mg Affron®', 'GRAS Hemp Inputs', 'RTD Tea · $7–10', 'DTC-First Launch', 'Structure/Function Claims Only'].map(tag => (
              <span key={tag} className="text-xs font-sans text-[#d8aa43]/70 border border-[#d8aa43]/20 px-3 py-1.5">{tag}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Φ Layer System */}
      <section className="py-24 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-3 font-sans">The Φ Layer System</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold mb-4" style={{ color: '#d8aa43', WebkitTextFillColor: '#d8aa43' }}>One architecture for story and science.</h2>
            <p className="text-[#f4f0e6]/50 font-sans max-w-2xl">Every True Mélange Φ formula is built from Fibonacci-indexed layers. Each layer is a piece of the mythos, a ritual element, and a functional ingredient group. A product activates the layers it needs; the rest stay dormant.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PHI_LAYERS.map((layer, i) => (
              <motion.div
                key={layer.id}
                className="p-5 border border-[#d8aa43]/10 hover:border-[#d8aa43]/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: layer.color }} />
                  <span className="text-xs font-mono text-[#d8aa43]/60">{layer.id}</span>
                </div>
                <h3 className="font-bold text-[#f4f0e6] mb-2" style={{ WebkitTextFillColor: '#f4f0e6' }}>{layer.name}</h3>
                <p className="text-sm text-[#f4f0e6]/50 font-sans leading-relaxed">{layer.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence Basis */}
      <section className="py-24 max-w-[1380px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">Evidence Basis</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold mb-6" style={{ color: '#d8aa43', WebkitTextFillColor: '#d8aa43' }}>Every hero dose cited to the human literature.</h2>
            <div className="space-y-6">
              {[
                { active: 'Saffron (Affron®) — 28 mg/day, 12 wk', tier: 'Human RCT', finding: '202 adults with low mood: ~72% reached clinically significant mood improvement vs ~54% on placebo. Manufacturer-funded; extract- and dose-specific.', ref: 'Ref. 1' },
                { active: 'Saffron (Affron®) — dose-finding', tier: 'Human RCT', finding: '128 adults: 28 mg effective where 22 mg was not — the basis for the 28 mg dose. Manufacturer-funded.', ref: 'Ref. 2' },
                { active: 'Saffron — GRADE meta-analysis', tier: 'Meta-analysis', finding: '34 randomized trials support saffron\'s benefit for depressive, anxiety, and mood symptoms. Broader supporting evidence — not direct equivalence to this product.', ref: 'Ref. 5' },
                { active: 'L-theanine + green tea', tier: 'Human-supported', finding: 'Calm-focus rationale mechanistically supported. 150 mg used here is lower than monotherapy doses; finished-product effect unproven until tested.', ref: 'Refs. 6–7' },
                { active: 'Hempseed inputs', tier: 'Regulatory', finding: 'FDA raised no questions on GRAS conclusions for hulled hemp seed, hemp seed protein, and hemp seed oil.', ref: 'GRAS GRN 765/771/778' },
              ].map((row, i) => (
                <motion.div key={i} className="border-l-2 border-[#d8aa43]/20 pl-5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-[#d8aa43]/60 border border-[#d8aa43]/20 px-2 py-0.5">{row.tier}</span>
                    <span className="text-xs font-sans text-[#f4f0e6]/30">{row.ref}</span>
                  </div>
                  <p className="font-semibold text-[#f4f0e6] text-sm mb-1">{row.active}</p>
                  <p className="text-sm text-[#f4f0e6]/50 font-sans leading-relaxed">{row.finding}</p>
                </motion.div>
              ))}
            </div>
          <div className="mt-8 border-t border-[#d8aa43]/10 pt-4 space-y-3">
            <p className="text-xs font-sans text-[#d8aa43]/70 font-semibold">Permitted claims (structure/function only):</p>
            <p className="text-xs font-sans text-[#f4f0e6]/50">Supports mood and emotional wellbeing · Supports focus and calm alertness · Supports antioxidant status · Supports stress resilience · Made with saffron and traditional spices · Hempseed-derived, naturally colored, no synthetic dyes</p>
            <p className="text-xs font-sans text-[#d8aa43]/70 font-semibold mt-3">Prohibited claims (fixed):</p>
            <p className="text-xs font-sans text-[#f4f0e6]/50">Any claim to treat, prevent, or cure disease including depression, anxiety, PTSD, insomnia, or ADHD · Anti-aging reversal or lifespan-extension claims · Psychedelic or vision-inducing framing · Population-specific biology claims · "FDA-approved"</p>
            <p className="text-xs font-sans text-[#f4f0e6]/30 mt-3">Required label statement: "Contains no CBD, no THC; made with hempseed oil and hemp seed protein only." Cautionary statement required for saffron + serotonergic, dopaminergic, sympathomimetic, or MAOI medications. All claims pending counsel review.</p>
          </div>
          </motion.div>

          {/* DNA Helix visualization */}
          <motion.div className="h-[500px]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <DNAHelix />
          </motion.div>
        </div>
      </section>

      {/* 12–18 Month Milestones */}
      <section className="py-24 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-3 font-sans">12–18 Month Roadmap</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold" style={{ color: '#d8aa43', WebkitTextFillColor: '#d8aa43' }}>From bench to market.</h2>
          </motion.div>
          <div className="space-y-3 max-w-2xl">
            {MILESTONES.map((m, i) => (
              <motion.div key={i} className="flex gap-6 items-start p-4 border border-[#d8aa43]/10 hover:border-[#d8aa43]/25 transition-colors" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <span className="text-xs font-mono text-[#d8aa43]/60 w-16 flex-shrink-0 pt-0.5">Mo. {m.months}</span>
                <p className="text-sm text-[#f4f0e6]/70 font-sans">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IP Architecture */}
      <section className="py-24 max-w-[1380px] mx-auto px-6 lg:px-12">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-3 font-sans">IP Architecture</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold" style={{ color: '#d8aa43', WebkitTextFillColor: '#d8aa43' }}>Provisional filing targets.</h2>
          <p className="text-[#f4f0e6]/40 font-sans text-sm mt-2">Provisional filings in preparation — not yet filed.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          {[
            'Hemp-CNC Pickering emulsion compositions for saffron lipid extracts',
            'Blue-Gold saffron-apocarotenoid beverage compositions using FDA-listed natural blue colorants',
            'Staged apocarotenoid biomanufacturing using Crocus sativus, Gardenia jasminoides, and Nyctanthes arbor-tristis genetic modules',
            'Circular fermentation of saffron residue, hemp seed cake, and pomegranate husk into postbiotic co-products',
            'Chronobiological dawn/midday/nocturne dosing architecture',
          ].map((ip, i) => (
            <motion.div key={i} className="p-4 border border-[#d8aa43]/10 text-sm text-[#f4f0e6]/60 font-sans" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              {ip}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#070b0f] text-center">
        <motion.div className="max-w-xl mx-auto px-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>Partner or fund the platform.</h2>
          <p className="text-[#f4f0e6]/50 font-sans mb-8">Companion documents available on request: Blue-Gold Daily Production Packet v1.3, Scientific Strengthening Brief, and Tamerian Materials patent documentation (App 63/934,269).</p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <a href="mailto:aitconsult22@gmail.com?subject=True%20Melange%20Phi%20Inquiry" className="inline-block px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709]" style={{ background: '#d8aa43' }}>
              Contact Jon Peoples
            </a>
            <a href="https://calendly.com/aitconsult22/30min" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#d8aa43] border border-[#d8aa43]/40 hover:border-[#d8aa43] transition-colors">
              Book a Call
            </a>
          </div>
          <p className="text-xs font-mono text-[#f4f0e6]/30">(216) 307-0174 · aitconsult22@gmail.com · Concord, NC</p>
          <a href="mailto:aitconsult22@gmail.com?subject=True%20Melange%20Phi%20Inquiry" className="inline-block px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709]" style={{ background: '#d8aa43' }}>
            Contact Jon Peoples
          </a>
        </motion.div>
      </section>
    </div>
  );
}
