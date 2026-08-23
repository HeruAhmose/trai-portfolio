import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VesselNetworkVisual } from '@/components/OrganVisuals';

const ROUTES = [
  { id: '01', name: 'Local Business Delivery', signal: 'CLIENTS', copy: 'The documented launch model centers affordable, flexible last-mile and regional delivery for local micro-businesses, minority-owned businesses, and e-commerce sellers that may not fit large-carrier economics.' },
  { id: '02', name: 'Subscription Logistics', signal: 'REPEAT', copy: 'The business plan proposes recurring delivery subscriptions so regular clients can access a predictable number of deliveries at a more stable cost.' },
  { id: '03', name: 'Route Optimization', signal: 'EFFICIENCY', copy: 'Route-planning software, lower-idle driving, and fuel-conscious operations are part of the documented operating model for reducing mileage, cost, and avoidable emissions.' },
  { id: '04', name: 'Fleet Transition', signal: 'EV PATH', copy: 'The plan starts with a small fuel-efficient box-truck fleet and proposes adding an electric truck as the company scales, rather than presenting a fully electric fleet as current fact.' },
] as const;

function MobilityField({ active }: { active: number }) {
  return (
    <div className="relative aspect-[16/11] overflow-hidden border bg-[#03080d]" style={{ borderColor: '#1f66ad' }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_28%,rgba(31,102,173,.18),transparent_27%),linear-gradient(180deg,rgba(6,17,29,.15),rgba(6,17,29,.88))]" />
      {[18, 36, 54, 72].map((top, i) => (
        <motion.div key={top} className="absolute left-[9%] right-[9%] h-px bg-gradient-to-r from-transparent via-[#7bc4ff]/45 to-transparent" style={{ top: `${top}%`, rotate: `${i % 2 ? -4 : 5}deg` }} animate={{ opacity: i === active ? [0.35, 0.9, 0.35] : 0.17, scaleX: i === active ? [0.72, 1, 0.82] : 0.78 }} transition={{ duration: 3.8, repeat: Infinity }} />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <motion.span key={i} className="absolute h-2 w-2 rounded-full border border-[#d8aa43]/60 bg-[#08111a]" style={{ left: `${10 + (i * 8) % 78}%`, top: `${20 + (i * 17) % 60}%` }} animate={{ boxShadow: ['0 0 0 rgba(216,170,67,0)', '0 0 18px rgba(216,170,67,.35)', '0 0 0 rgba(216,170,67,0)'] }} transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.12 }} />
      ))}
      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-white/28"><span>operating model</span><span>clients · routes · fleet</span></div>
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
            <p className="mb-7 text-[10px] uppercase tracking-[0.32em] text-[#7bc4ff]/75">04 · Vessels · Mobility Sovereignty</p>
            <h1 className="mb-7 text-[clamp(4rem,8vw,8rem)] leading-[.82] tracking-[-.045em]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Mela<br /><span className="text-[#7bc4ff]">Nation.</span></h1>
            <p className="max-w-[650px] text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.5] text-white/62">A North Carolina logistics venture built around last-mile and regional delivery, flexible service for underserved small businesses, route discipline, and a gradual lower-emission fleet strategy.</p>
            <div className="mt-10 grid max-w-[650px] grid-cols-2 gap-px bg-white/10 text-[9px] uppercase tracking-[.18em] md:grid-cols-4"><div className="bg-[#06111d] p-4"><span className="block text-[#d8aa43]">01</span>Last-mile</div><div className="bg-[#06111d] p-4"><span className="block text-[#d8aa43]">02</span>Regional</div><div className="bg-[#06111d] p-4"><span className="block text-[#d8aa43]">03</span>Subscription</div><div className="bg-[#06111d] p-4"><span className="block text-[#d8aa43]">04</span>EV path</div></div>
          </div>
          <MobilityField active={active} />
        </div>
      </section>

      <section className="border-b border-white/10 py-28">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          <div className="mb-14 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div><p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#d8aa43]">Documented operating model</p><h2 className="text-[clamp(2.6rem,5vw,5rem)] leading-[.95]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Start practical. Scale with discipline.</h2></div>
            <p className="max-w-[690px] text-lg leading-8 text-white/48 lg:justify-self-end">The supplied plan describes a small launch fleet, local and regional delivery, route optimization, subscription services, and a staged transition toward electric vehicles. The page keeps that near-term operating model distinct from TRAI’s larger future-city vision.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div className="space-y-2">{ROUTES.map((route, i) => <button key={route.id} onClick={() => setActive(i)} className={`w-full border px-5 py-5 text-left transition ${active === i ? 'border-[#7bc4ff]/45 bg-[#7bc4ff]/[.06]' : 'border-white/10 hover:border-white/20'}`}><div className="flex items-center justify-between text-[9px] uppercase tracking-[.2em] text-white/30"><span>{route.id}</span><span>{route.signal}</span></div><div className="mt-2 text-2xl" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{route.name}</div></button>)}</div>
            <div className="border border-[#7bc4ff]/15 bg-[#06111d]/60 p-8 md:p-12"><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><p className="mb-4 text-[10px] uppercase tracking-[.25em] text-[#7bc4ff]">{ROUTES[active].signal}</p><h3 className="mb-6 text-[clamp(2.5rem,4vw,4.5rem)] leading-[.95]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{ROUTES[active].name}</h3><p className="max-w-[700px] text-lg leading-8 text-white/55">{ROUTES[active].copy}</p></motion.div></AnimatePresence></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#03070b] py-24">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-14">
          <div><p className="mb-4 text-[10px] uppercase tracking-[.28em] text-[#d8aa43]">Source reconciliation</p><h2 className="text-[clamp(2.5rem,4vw,4.3rem)] leading-[.94]" style={{fontFamily:'"Cormorant Garamond",serif'}}>Evidence before polish.</h2></div>
          <div className="grid gap-6 md:grid-cols-2"><div className="border-l border-[#7bc4ff]/30 pl-6"><p className="text-[9px] uppercase tracking-[.22em] text-[#7bc4ff]">Launch geography</p><p className="mt-3 text-base leading-7 text-white/48">The supplied plan lists Concord on its cover but describes the company as based in Charlotte in the executive summary. This site therefore does not assert a finalized headquarters until that source conflict is resolved.</p></div><div className="border-l border-[#d8aa43]/30 pl-6"><p className="text-[9px] uppercase tracking-[.22em] text-[#d8aa43]">Business status</p><p className="mt-3 text-base leading-7 text-white/48">The plan sets forward-looking fleet, revenue, hiring, and expansion objectives. They are treated as targets and design inputs—not completed operating milestones.</p></div></div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#06111d] py-28">
        <div className="absolute inset-0 opacity-38"><VesselNetworkVisual /></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#06111d_0%,rgba(6,17,29,.94)_52%,rgba(6,17,29,.7)_100%)]" />
        <div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-14"><div className="max-w-[800px]"><p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#d8aa43]">Future organism interface</p><h2 className="mb-7 text-[clamp(3rem,6vw,6rem)] leading-[.88]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The vessels can scale beyond the first fleet.</h2><p className="mb-8 text-lg leading-8 text-white/52">Within TRAI, Mela Nation can conceptually extend into TechBridge partner movement, MeLaNiNa fulfillment, True Mélange distribution, and future Nu Ta Meri circulation. That integration is a systems-design direction, not a claim that those routes or city services operate today.</p><div className="flex flex-wrap gap-3"><a href="/nu-ta-meri" className="border border-[#d8aa43] bg-[#d8aa43] px-7 py-3 text-[10px] font-bold uppercase tracking-[.18em] text-black">See future city interface</a><a href="mailto:aitconsult22@gmail.com?subject=Mela%20Nation%20Partnership" className="border border-white/15 px-7 py-3 text-[10px] uppercase tracking-[.18em] text-white/60">Partnership inquiry</a></div></div></div>
      </section>
    </div>
  );
}
