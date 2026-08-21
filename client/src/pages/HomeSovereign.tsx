import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { SovereignStarfield } from '@/components/SovereignStarfield';
import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';
import { SovereignWorldMap } from '@/components/SovereignWorldMap';
import { OrganPortal } from '@/components/OrganPortal';
import { NeuralNetworkViz } from '@/components/NeuralNetworkViz';
import { QuantumComputingViz } from '@/components/QuantumComputingViz';
import { BlockchainVisualization } from '@/components/BlockchainVisualization';
import { DNAHelix } from '@/components/DNAHelix';
import { AdvancedPhysicsSimulation } from '@/components/AdvancedPhysicsSimulation';
import { useSovereignSound } from '@/hooks/useSovereignSound';
import { ArchiveRail, BiomimicryGrid, TechnologyGrid, VideoPanel } from '@/components/MediaSystem';
import { VIDEO } from '@/lib/media';

const C = { gold: '#d8aa43', cream: '#f4f0e6', dark: '#050709', mid: '#070b0f' };

const ORGANS = [
  { num: '01', role: 'Skeleton', name: 'Tamerian Materials', desc: 'Material sovereignty — hemp-derived carbon composite, energy harvesting, quantum sensing. Patent App 63/934,269 · 25 claims.', route: '/materials', external: 'https://tamerian-materials.com/' },
  { num: '02', role: 'Heart', name: 'True Mélange \u03a6', desc: 'Biological sovereignty — saffron-hemp biotechnology platform. First product: Blue-Gold Daily RTD tea.', route: '/true-melange', external: null },
  { num: '03', role: 'Brain', name: 'Queen Califia', desc: 'Cognitive sovereignty — autonomous cybersecurity AI. Triple-core: Cyber, Identity, Markets.', route: '/queen-califia', external: 'https://queencalifia-cyberai.web.app/' },
  { num: '04', role: 'Vessels', name: 'Mela Nation', desc: 'Mobility sovereignty — last-mile logistics, community access, supply-chain resilience.', route: '/mela-nation', external: null },
  { num: '05', role: 'Skin', name: 'MeLaNiNa', desc: 'Identity sovereignty — hemp apparel, cultural expression, employee-ownership pathways.', route: '/melanina', external: null },
  { num: '06', role: 'Hands', name: 'TechBridge', desc: 'Community reach — Digital Navigator hubs in Raleigh-Durham. H.K. AI integration.', route: '/community', external: 'https://techbridge-collective.org/' },
  { num: '07', role: 'Lymphatic', name: 'The Peoples Foundation', desc: 'Regenerative return — designed to receive defined charitable allocations for community programs.', route: '/peoples-foundation', external: null },
];

const FLYWHEEL = [
  { num: '01', label: 'material', title: 'Structural sovereignty', copy: 'Research and material platforms create the substrate on which the wider organism can stand.' },
  { num: '02', label: 'metabolism', title: 'Biological sovereignty', copy: 'Daily ritual translates the architecture into a tangible relationship between body, discipline and value.' },
  { num: '03', label: 'intelligence', title: 'Cognitive sovereignty', copy: 'Protective intelligence coordinates decisions without surrendering trust, agency or memory.' },
  { num: '04', label: 'mobility', title: 'Movement sovereignty', copy: 'Resilient routes connect people, goods and opportunity across the organism.' },
  { num: '05', label: 'identity', title: 'Cultural sovereignty', copy: 'Material culture protects dignity, expression and the memory carried through form.' },
  { num: '06', label: 'access', title: 'Community reach', copy: 'Skills, navigation and digital infrastructure convert systems into usable pathways.' },
  { num: '07', label: 'foundation', title: 'Regenerative return', copy: 'Surplus, knowledge and capacity return to the communities that make the system possible.' },
];

export default function HomeSovereign() {
  const [, navigate] = useLocation();
  const [activeStage, setActiveStage] = useState('material');
  const [portalOrgan, setPortalOrgan] = useState<typeof ORGANS[0] | null>(null);
  const sound = useSovereignSound();
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -120]);
  const activeFlywheelStage = FLYWHEEL.find(s => s.label === activeStage) || FLYWHEEL[0];

  useEffect(() => {
    const handler = () => { sound.enable(); };
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => { window.removeEventListener('click', handler); window.removeEventListener('keydown', handler); };
  }, [sound]);

  const handleOrganClick = (organ: typeof ORGANS[0]) => {
    sound.unlock();
    setPortalOrgan(organ);
  };

  const handleNavigate = (route: string) => {
    sound.navigate();
    navigate(route);
  };

  return (
    <div className="relative" style={{ background: C.dark, color: C.cream }}>
      <OrganPortal organ={portalOrgan} onClose={() => { sound.click(); setPortalOrgan(null); }} onNavigate={handleNavigate} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0"><SovereignNebulaGL /></div>
        <div className="absolute inset-0 pointer-events-none z-[1] opacity-35"><SovereignStarfield /></div>
        <motion.div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 lg:px-12 py-32" style={{ y: heroParallax }}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p className="text-xs tracking-[0.25em] uppercase mb-8 font-sans" style={{ color: `${C.gold}80` }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                Tamerian Renaissance Alliance Initiative
              </motion.p>
              <motion.h1 className="text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[1.05] mb-8" style={{ color: C.cream, WebkitTextFillColor: C.cream, fontFamily: '"Cormorant Garamond", serif' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ease: [0.23, 1, 0.32, 1] }}>
                One regenerative<br /><span style={{ color: C.gold, WebkitTextFillColor: C.gold }}>organism.</span>
              </motion.h1>
              <motion.p className="text-xl font-sans leading-relaxed mb-10 max-w-lg" style={{ color: `${C.cream}60` }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                A sovereign system is stronger than any single venture. Seven organs. One flywheel. One community mission.
              </motion.p>
              <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                <button onClick={() => { sound.navigate(); document.getElementById('seven-organs')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase transition-opacity hover:opacity-90 active:scale-[0.97]" style={{ background: C.gold, color: C.dark }} onMouseEnter={() => sound.hover()}>
                  Enter the Organism
                </button>
                <button onClick={() => { sound.click(); document.getElementById('remembered-world')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 font-sans text-sm tracking-[0.12em] uppercase border transition-colors hover:border-[#d8aa43]/60" style={{ borderColor: `${C.gold}30`, color: `${C.cream}60` }} onMouseEnter={() => sound.hover()}>
                  See the remembered world →
                </button>
              </motion.div>
            </div>
            <motion.div className="flex items-center justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}>
              <div className="relative w-[320px] h-[320px] lg:w-[400px] lg:h-[400px]">
                <motion.div className="absolute inset-0 rounded-full border" style={{ borderColor: `${C.gold}20` }} animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute inset-6 rounded-full border" style={{ borderColor: `${C.gold}30` }} animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute inset-12 rounded-full border" style={{ borderColor: `${C.gold}50` }} animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute inset-16 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${C.gold}ee, ${C.gold}88, ${C.gold}33)`, boxShadow: `0 0 60px ${C.gold}40, 0 0 120px ${C.gold}20` }} animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="absolute" style={{ width: 2, height: i % 3 === 0 ? 10 : 5, background: `${C.gold}${i % 3 === 0 ? '70' : '30'}`, top: '50%', left: '50%', transformOrigin: '0 -148px', transform: `rotate(${i * 30}deg) translateX(-1px)` }} />
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div className="mt-20 pt-8 border-t grid grid-cols-3 gap-8 max-w-lg" style={{ borderColor: `${C.gold}15` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            {[['07', 'Organs'], ['01', 'Patent Filed'], ['\u221e', 'Flywheel']].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold mb-1" style={{ color: C.gold, fontFamily: '"Cormorant Garamond", serif' }}>{val}</div>
                <div className="text-xs font-mono tracking-[0.15em] uppercase" style={{ color: `${C.cream}35` }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: `${C.cream}25` }}>Scroll</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(180deg, ${C.gold}40, transparent)` }} />
        </motion.div>
      </section>

      {/* DOCTRINE */}
      <hr className="sovereign-rule" />
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="max-w-3xl" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: [0.23, 1, 0.32, 1] }}>
            <p className="ceremonial-label mb-8">The Doctrine</p>
            <blockquote className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-bold leading-[1.2] mb-10" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>
              "A sovereign system is stronger than any single venture."
            </blockquote>
            <p className="text-lg font-sans leading-relaxed" style={{ color: `${C.cream}55` }}>
              TRAI is not a holding company. It is a living architecture — seven organs that share a flywheel, a philosophy, and a community mission. Each organ is designed to be independently viable and mutually reinforcing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* REMEMBERED WORLD MAP */}
      <hr className="sovereign-rule" />
      <section id="remembered-world" className="py-32 relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="ceremonial-label mb-4">The Remembered World</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-6" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>
              Seven regions. Seven functions.<br /><span style={{ color: C.gold }}>One memory.</span>
            </h2>
            <p className="text-lg font-sans max-w-xl" style={{ color: `${C.cream}50` }}>
              Click any region to enter its sovereign domain. Each node is a living organ of the TRAI organism.
            </p>
          </motion.div>
          <motion.div className="relative rounded border overflow-hidden" style={{ borderColor: `${C.gold}15`, background: '#030406', minHeight: 520 }} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ ease: [0.23, 1, 0.32, 1] }}>
            <SovereignWorldMap
              onRegionClick={(r) => { sound.unlock(); const organ = ORGANS.find(o => o.route === r.route); if (organ) setPortalOrgan(organ); }}
              onRegionHover={() => sound.hover()}
              soundHover={() => sound.hover()}
              soundClick={() => sound.click()}
            />
          </motion.div>
        </div>
      </section>

      {/* FLYWHEEL */}
      <hr className="sovereign-rule" />
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="ceremonial-label mb-4">The Flywheel</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>Value in circulation.</h2>
            <p className="text-lg font-sans" style={{ color: `${C.cream}50` }}>Click each stage to understand how the organism circulates value.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-1">
              {FLYWHEEL.map((stage, i) => {
                const isActive = activeStage === stage.label;
                return (
                  <motion.button key={stage.label} onClick={() => { sound.click(); setActiveStage(stage.label); }} onMouseEnter={() => sound.hover()} className="w-full text-left px-5 py-4 border-l-2 transition-all" style={{ borderLeftColor: isActive ? C.gold : 'transparent', background: isActive ? `${C.gold}08` : 'transparent' }} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ x: 2 }}>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono" style={{ color: isActive ? C.gold : `${C.cream}25` }}>{stage.num}</span>
                      <span className="text-sm font-sans font-semibold capitalize" style={{ color: isActive ? C.cream : `${C.cream}50` }}>{stage.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={activeStage} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }} className="p-8 border" style={{ borderColor: `${C.gold}15`, background: '#030406' }}>
                <p className="text-xs font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${C.gold}70` }}>Stage {activeFlywheelStage?.num}</p>
                <h3 className="text-2xl font-bold mb-4" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>{activeFlywheelStage?.title}</h3>
                <p className="text-base font-sans leading-relaxed" style={{ color: `${C.cream}60` }}>{activeFlywheelStage?.copy}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ORIGIN — the founder archive */}
      <hr className="sovereign-rule" />
      <section id="origin" className="py-32 relative">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12 max-w-[62ch]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="ceremonial-label mb-4">Origin</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>A number, chosen.</h2>
            <p className="text-[#f4f0e6]/55 font-sans leading-relaxed">
              His father wore №44 at Salisbury. He took №6 — his own number, at Kannapolis and again at Maritime, then dress whites in the Navy. Two decades on, a community page ranked him fourteenth among every running back the town has produced. The discipline that built the architecture was learned somewhere, and it was not a lab.
            </p>
          </motion.div>
          <ArchiveRail />
        </div>
      </section>

      {/* PROPRIETARY TECHNOLOGIES */}
      <hr className="sovereign-rule" />
      <section id="technologies" className="py-32 relative">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-center mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="ceremonial-label mb-4">Section 7 · Proprietary technologies</p>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>Six programs. One substrate.</h2>
              <p className="text-[#f4f0e6]/55 font-sans leading-relaxed max-w-[58ch]">
                Every card states its stage. One is a filed patent, one is deployed and running, and the rest are research. Nothing here is presented as further along than it is.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <VideoPanel video={VIDEO.tamerianProject} className="aspect-video border border-[#d8aa43]/10" />
            </motion.div>
          </div>
          <TechnologyGrid />
        </div>
      </section>

      {/* BIOMIMICRY */}
      <hr className="sovereign-rule" />
      <section id="biomimicry" className="py-32 relative">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-12 max-w-[62ch]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="ceremonial-label mb-4">Biomimicry</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-4" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>The solved problems.</h2>
            <p className="text-[#f4f0e6]/55 font-sans leading-relaxed">
              A wing scale makes color from structure rather than pigment. A gecko's foot holds without adhesive. These are not metaphors borrowed for a brochure — they are the reference cases the materials work reads from.
            </p>
          </motion.div>
          <BiomimicryGrid />
          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <VideoPanel video={VIDEO.butterfly} className="aspect-video border border-[#d8aa43]/10" />
            <VideoPanel video={VIDEO.tamerianCompose} className="aspect-video border border-[#d8aa43]/10" />
          </div>
        </div>
      </section>

      {/* SEVEN ORGANS */}
      <hr className="sovereign-rule" />
      <section id="seven-organs" className="py-32 relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="ceremonial-label mb-4">The Seven Organs</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>Click any organ to enter its domain.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ORGANS.map((organ, i) => (
              <motion.button key={organ.num} onClick={() => handleOrganClick(organ)} onMouseEnter={() => sound.hover()} className="text-left p-6 border group relative overflow-hidden transition-all" style={{ borderColor: `${C.gold}12`, background: '#030406' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ borderColor: `${C.gold}40`, y: -4 }} whileTap={{ scale: 0.98 }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 30%, ${C.gold}08, transparent 70%)` }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono" style={{ color: `${C.gold}60` }}>{organ.num}</span>
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 border" style={{ borderColor: `${C.gold}20`, color: `${C.cream}35` }}>{organ.role}</span>
                  </div>
                  <h3 className="font-bold mb-3 text-base" style={{ color: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>{organ.name}</h3>
                  <p className="text-xs font-sans leading-relaxed mb-4" style={{ color: `${C.cream}45` }}>{organ.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-mono" style={{ color: `${C.gold}60` }}>
                    <span>Enter</span>
                    <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* DNA / BIOLOGICAL */}
      <hr className="sovereign-rule" />
      <section className="py-40 section-deep relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="ceremonial-label mb-6">02 — Biological Sovereignty</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">The body as architecture.</h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">True Mélange Φ encodes sovereignty into daily ritual. Affron® 28 mg/day. Hempseed-only inputs. Blue-Gold Daily — a 12 oz RTD tea that is the biological heart of the organism.</p>
              <button onClick={() => handleOrganClick(ORGANS[1])} onMouseEnter={() => sound.hover()} className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">Enter True Mélange Φ →</button>
            </motion.div>
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <DNAHelix interactive={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTELLIGENCE / NEURAL */}
      <hr className="sovereign-rule" />
      <section className="py-40 section-deep relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <NeuralNetworkViz />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="ceremonial-label mb-6">03 — Cognitive Sovereignty</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">Intelligence that protects.</h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">Queen Califia — autonomous cybersecurity intelligence. Triple-core: Cyber Core, Identity Core, Markets Core. The nervous system of the TRAI organism.</p>
              <div className="flex gap-4 flex-wrap">
                <button onClick={() => handleOrganClick(ORGANS[2])} onMouseEnter={() => sound.hover()} className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">Enter Queen Califia →</button>
                <a href="https://queencalifia-cyberai.web.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-sans text-[#4a9eff]/60 hover:text-[#4a9eff] transition-colors tracking-wide" onMouseEnter={() => sound.hover()}>Live site ↗</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MATERIAL SCIENCE */}
      <hr className="sovereign-rule" />
      <section className="py-40 sovereign-bg relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="ceremonial-label mb-6">04 — Material Sovereignty</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">Quantum sensing.<br />Room-temperature target.</h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-6">Patent App 63/934,269 proposes quantum sensing via NV-center-like defects in the hemp-carbon matrix. Target coherence T&#x2082; &gt; 500 ns at 300K. Active research hypothesis — not yet confirmed.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Eu', 'Nd', 'Er', 'Yb', 'Ce'].map(d => (<span key={d} className="text-xs font-mono text-[#d8aa43]/50 border border-[#d8aa43]/15 px-3 py-1.5">{d} dopant</span>))}
              </div>
              <button onClick={() => handleOrganClick(ORGANS[0])} onMouseEnter={() => sound.hover()} className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">Explore Tamerian Materials →</button>
            </motion.div>
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <QuantumComputingViz />
            </motion.div>
          </div>
        </div>
      </section>

      {/* IP & GOVERNANCE */}
      <hr className="sovereign-rule" />
      <section className="py-40 section-deep relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <BlockchainVisualization blockCount={6} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="ceremonial-label mb-6">05 — IP & Governance</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">The Sovereign Ledger.</h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">One hemp substrate. One sovereignty philosophy. One community mission. IP, security, and capital architecture coordinated under TRAI.</p>
              <div className="space-y-3 mb-8">
                {['Patent App 63/934,269 · Filed Dec 11 2025', '25 claims · Confirmation #6305 · Micro Entity', 'Jon Peoples · U.S. Navy Veteran (OEF) · Concord, NC'].map(f => (
                  <div key={f} className="flex gap-3 items-center"><div className="w-1 h-1 rounded-full bg-[#d8aa43] flex-shrink-0" /><span className="text-sm font-mono text-[#f4f0e6]/50">{f}</span></div>
                ))}
              </div>
              <button onClick={() => { sound.navigate(); navigate('/patents'); }} onMouseEnter={() => sound.hover()} className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">View Patent Claims →</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMMUNITY / TECHBRIDGE */}
      <hr className="sovereign-rule" />
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="ceremonial-label mb-6">06 — Community Reach</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">The hands that build bridges.</h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">TechBridge Collective — Digital Navigator hubs in Raleigh-Durham. 1.2M NC residents lack adequate broadband access. H.K. AI triage, named for Horace King.</p>
              <div className="flex gap-4 flex-wrap">
                <button onClick={() => handleOrganClick(ORGANS[5])} onMouseEnter={() => sound.hover()} className="text-sm font-sans text-[#2ecc71]/70 hover:text-[#2ecc71] transition-colors tracking-wide">Enter TechBridge →</button>
                <a href="https://techbridge-collective.org/" target="_blank" rel="noopener noreferrer" className="text-sm font-sans text-[#f4f0e6]/30 hover:text-[#f4f0e6]/60 transition-colors tracking-wide" onMouseEnter={() => sound.hover()}>Live site ↗</a>
              </div>
            </motion.div>
            <motion.div className="h-[520px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <AdvancedPhysicsSimulation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOUNDATION */}
      <hr className="sovereign-rule" />
      <section className="py-40 section-deep relative overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="ceremonial-label mb-6">07 — Regenerative Return</p>
              <h2 className="display-heading text-[clamp(2.4rem,5vw,4rem)] mb-8">Return is not optional.</h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">The Peoples Foundation is designed to receive defined charitable allocations from the TRAI organism and return value to the community that built it.</p>
              <button onClick={() => handleOrganClick(ORGANS[6])} onMouseEnter={() => sound.hover()} className="text-sm font-sans text-[#d8aa43]/70 hover:text-[#d8aa43] transition-colors tracking-wide">Enter The Peoples Foundation →</button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="space-y-4">
                {['Funeral and bereavement assistance', 'Violence interruption programs', 'Youth athletics and mentorship', 'Digital navigation (TechBridge coordination)', 'Spiritual healing and community wellbeing'].map((p, i) => (
                  <motion.div key={p} className="flex gap-4 items-start" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d8aa43] mt-2 flex-shrink-0" />
                    <p className="text-sm font-sans text-[#f4f0e6]/60">{p}</p>
                  </motion.div>
                ))}
                <p className="text-xs font-sans text-[#f4f0e6]/30 mt-4 pt-4 border-t border-[#d8aa43]/10">Allocations subject to written agreements, counsel review, and applicable charitable-solicitation compliance. EIN obtained; federal tax-exempt status pending counsel confirmation.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <hr className="sovereign-rule" />
      <section className="py-32 relative overflow-hidden">
        <div className="relative z-10 max-w-[1380px] mx-auto px-6 lg:px-12">
          <motion.div className="mb-16 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="ceremonial-label mb-4">Architecture</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-6 max-w-2xl mx-auto" style={{ color: C.cream, WebkitTextFillColor: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>Mythic in presentation. Exact in claim.</h2>
            <p className="text-[#f4f0e6]/50 font-sans max-w-xl mx-auto">The architecture rests on a single governing standard: Vast in Vision, Exact in Claim.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Progressive by default', body: 'The architecture is designed for resilience through distinct technical, market, funding, and revenue pathways.' },
              { title: 'Performance governed', body: 'Technology-readiness levels are founder-assessed and flagged for independent validation. No venture is overstated.' },
              { title: 'Privacy respected', body: 'Data flows under consent, purpose limitation, and community-advisory authority where promised.' },
              { title: 'Claims separated', body: 'Vision is allowed to be limitless precisely because it is named as vision. Funded work rests on filed IP and labeled R&D hypotheses.' },
            ].map((item, i) => (
              <motion.div key={i} className="p-6 border border-[#d8aa43]/10 hover:border-[#d8aa43]/30 transition-colors" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -2 }} onMouseEnter={() => sound.hover()}>
                <h3 className="font-bold text-[#d8aa43] mb-3 text-sm" style={{ WebkitTextFillColor: '#d8aa43' }}>{item.title}</h3>
                <p className="text-sm text-[#f4f0e6]/50 font-sans leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#070b0f] text-center relative overflow-hidden">
        <motion.div className="relative z-10 max-w-2xl mx-auto px-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-6" style={{ color: C.cream, WebkitTextFillColor: C.cream, fontFamily: '"Cormorant Garamond", serif' }}>Build the organism, not another isolated product.</h2>
          <p className="text-[#f4f0e6]/50 font-sans mb-10 text-lg">Partners, researchers, operators and institutions can enter through a pathway designed for their role.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:aitconsult22@gmail.com?subject=TRAI%20Partnership%20Inquiry" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709] active:scale-[0.97] transition-transform" style={{ background: C.gold }} onMouseEnter={() => sound.hover()} onClick={() => sound.click()}>Build with us</a>
            <a href="https://calendly.com/aitconsult22/30min" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#d8aa43] border border-[#d8aa43]/40 hover:border-[#d8aa43] transition-colors" onMouseEnter={() => sound.hover()} onClick={() => sound.click()}>Book a call</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
