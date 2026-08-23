import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VesselNetworkVisual } from '@/components/OrganVisuals';

const C = { navy: '#06111d', blue: '#1f66ad', sky: '#7bc4ff', gold: '#d8aa43', ivory: '#f4f0e6' };

const ROUTES = [
  { id: '01', name: 'Community Access', signal: 'PEOPLE', copy: 'Reliable neighborhood movement designed around access to work, services, hubs, and opportunity rather than route density alone.' },
  { id: '02', name: 'Last-Mile Logistics', signal: 'GOODS', copy: 'A resilient distribution layer for small-scale delivery, partner inventory, and community-serving commerce across the wider TRAI organism.' },
  { id: '03', name: 'Institutional Movement', signal: 'SYSTEMS', copy: 'Coordinated movement between TechBridge hubs, partner institutions, suppliers, and regenerative programs where continuity matters as much as speed.' },
  { id: '04', name: 'Nu Ta Meri Circulation', signal: 'CITY', copy: 'The mobility organ scales into the city vision as a low-friction circulation layer: elevated transit, neighborhood loops, freight discipline, and pedestrian-first public space.' },
] as const;

function MobilityField({ active }: { active: number }) {
  return (
    <div className="relative aspect-[16/11] overflow-hidden border border-[#7bc4ff]/15 bg-[#03080d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_28%,rgba(31,102,173,.18),transparent_27%),linear-gradient(180deg,rgba(6,17,29,.15),rgba(6,17,29,.88))]" />
      {[18, 36, 54, 72].map((top, i) => (
        <motion.div key={top} className="absolute left-[9%] right-[9%] h-px bg-gradient-to-r from-transparent via-[#7bc4ff]/45 to-transparent" style={{ top: `${top}%`, rotate: `${i % 2 ? -4 : 5}deg` }} animate={{ opacity: i === active ? [0.35, 0.9, 0.35] : 0.17, scaleX: i === active ? [0.72, 1, 0.82] : 0.78 }} transition={{ duration: 3.8, repeat: Infinity }} />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <motion.span key={i} className="absolute h-2 w-2 rounded-full border border-[#d8aa43]/60 bg-[#08111a]" style={{ left: `${10 + (i * 8) % 78}%`, top: `${20 + (i * 17) % 60}%` }} animate={{ boxShadow: ['0 0 0 rgba(216,170,67,0)', '0 0 18px rgba(216,170,67,.35)', '0 0 0 rgba(216,170,67,0)'] }} transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.12 }} />
      ))}
      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-white/28"><span>route intelligence</span><span>people · goods · systems</span></div>
    </div>
  );
}

export default function MelaNation() {
  const [active, setActive] = useState(0);
  return (
    <div className="min-h-screen bg-[#04080d] text-[#f4f0e6]">
      <section className="relative min-h-[90vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(31,102,173,.24),transparent_31%),radial-gradient(circle_at_18%_82%,rgba(216,170,67,.08),transparent_22%),linear-gradient(135deg,#03070b,#07111d_62%,#020508)]" />
        <div className="relative z-10 mx-auto grid min-h-[90vh] max-w-[1500px] items-center gap-14 px-6 py-28 lg:grid-cols-[.9fr_1.1fr] lg:px-14">
          <div>
            <p className="mb-7 text-[10px] uppercase tracking-[0.32em] text-[#7bc4ff]/75">04 /// Vessels · Mobility sovereignty</p>
            <h1 className="mb-7 text-[clamp(4rem,8vw,8rem)] leading-[.82] tracking-[-.045em]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Mela<br/><span className="text-[#7bc4ff]">Nation.</span></h1>
            <p className="max-w-[650px] text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.5] text-white/62">A mobility and logistics system designed to move people, goods, access, and opportunity through the TRAI organism with the discipline of infrastructure—not the visual language of a generic delivery startup.</p>
            <div className="mt-10 grid max-w-[620px] grid-cols-3 gap-px bg-white/10 text-[9px] uppercase tracking-[.18em]"><div className="bg-[#06111d] p-4"><span className="block text-[#d8aa43]">01</span>Access</div><div className="bg-[#06111d] p-4"><span className="block text-[#d8aa43]">02</span>Logistics</div><div className="bg-[#06111d] p-4"><span className="block text-[#d8aa43]">03</span>Circulation</div></div>
          </div>
          <MobilityField active={active} />
        </div>
      </section>

      <section className="border-b border-white/10 py-28">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          <div className="mb-14 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div><p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#d8aa43]">Circulation architecture</p><h2 className="text-[clamp(2.6rem,5vw,5rem)] leading-[.95]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Movement is a public system.</h2></div>
            <p className="max-w-[650px] text-lg leading-8 text-white/48 lg:justify-self-end">The vessel metaphor becomes useful only when it changes the design: routes are treated as circulation, nodes as access points, and continuity as the core performance measure.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div className="space-y-2">{ROUTES.map((route, i) => <button key={route.id} onClick={() => setActive(i)} className={`w-full border px-5 py-5 text-left transition ${active === i ? 'border-[#7bc4ff]/45 bg-[#7bc4ff]/[.06]' : 'border-white/10 hover:border-white/20'}`}><div className="flex items-center justify-between text-[9px] uppercase tracking-[.2em] text-white/30"><span>{route.id}</span><span>{route.signal}</span></div><div className="mt-2 text-2xl" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{route.name}</div></button>)}</div>
            <div className="border border-[#7bc4ff]/15 bg-[#06111d]/60 p-8 md:p-12"><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><p className="mb-4 text-[10px] uppercase tracking-[.25em] text-[#7bc4ff]">{ROUTES[active].signal} corridor</p><h3 className="mb-6 text-[clamp(2.5rem,4vw,4.5rem)] leading-[.95]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{ROUTES[active].name}</h3><p className="max-w-[700px] text-lg leading-8 text-white/55">{ROUTES[active].copy}</p></motion.div></AnimatePresence></div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#06111d] py-28">
        <div className="absolute inset-0 opacity-38"><VesselNetworkVisual /></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#06111d_0%,rgba(6,17,29,.94)_52%,rgba(6,17,29,.7)_100%)]" />
        <div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-14"><div className="max-w-[780px]"><p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#d8aa43]">The vessels of the organism</p><h2 className="mb-7 text-[clamp(3rem,6vw,6rem)] leading-[.88]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Value cannot circulate if movement is an afterthought.</h2><p className="mb-8 text-lg leading-8 text-white/52">Mela Nation is in development. This experience presents the intended mobility architecture and its relationship to TechBridge, True Mélange Φ, MeLaNiNa, and Nu Ta Meri; it does not imply a currently operating transportation network.</p><div className="flex flex-wrap gap-3"><a href="/nu-ta-meri" className="border border-[#d8aa43] bg-[#d8aa43] px-7 py-3 text-[10px] font-bold uppercase tracking-[.18em] text-black">Enter Nu Ta Meri</a><a href="mailto:aitconsult22@gmail.com?subject=Mela%20Nation%20Partnership" className="border border-white/15 px-7 py-3 text-[10px] uppercase tracking-[.18em] text-white/60">Partnership inquiry</a></div></div></div>
      </section>
    </div>
  );
}
