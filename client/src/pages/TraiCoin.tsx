import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const C = {
  black: '#040607',
  deep: '#07100f',
  jade: '#36d7a0',
  jadeSoft: '#9df2d2',
  gold: '#d8aa43',
  ivory: '#f4f0e6',
};

const ORGANS = [
  { num: '01', name: 'Tamerian Materials', role: 'Skeleton', angle: -90 },
  { num: '02', name: 'True Mélange Φ', role: 'Heart', angle: -38 },
  { num: '03', name: 'Queen Califia', role: 'Brain', angle: 14 },
  { num: '04', name: 'Mela Nation', role: 'Vessels', angle: 66 },
  { num: '05', name: 'MeLaNiNa', role: 'Skin', angle: 118 },
  { num: '06', name: 'TechBridge', role: 'Hands', angle: 170 },
  { num: '07', name: 'Peoples Foundation', role: 'Lymphatic', angle: 222 },
] as const;

const PRINCIPLES = [
  {
    id: 'governance',
    signal: '01 · GOVERNANCE',
    title: 'Participation before speculation.',
    copy: 'TRAI Coin is presented here as a proposed governance and participation layer for the wider TRAI ecosystem. The design goal is to make decision rights, stewardship rules, and accountability legible before any token mechanics are considered.',
  },
  {
    id: 'cooperative',
    signal: '02 · COOPERATIVE',
    title: 'A system for shared agency.',
    copy: 'The concept is intended to support cooperative participation across ventures without collapsing the seven organs into one undifferentiated entity. Each venture keeps its own operating identity while cross-organ decisions can be structured transparently.',
  },
  {
    id: 'allocation',
    signal: '03 · ALLOCATION',
    title: 'Traceable rules for value flows.',
    copy: 'Any future treasury, grant, incentive, or ecosystem-allocation mechanism should be rule-based, auditable, and bounded by approved governance. This page does not represent a live treasury, token supply, smart contract, exchange listing, or issued asset.',
  },
  {
    id: 'return',
    signal: '04 · REGENERATIVE RETURN',
    title: 'Value should circulate back.',
    copy: 'The architecture is designed around TRAI’s regenerative flywheel: participation should strengthen the organism and preserve a defined path for community benefit rather than treating extraction as the primary objective.',
  },
] as const;

function GovernanceConstellation() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[620px] overflow-hidden rounded-full border border-[#36d7a0]/15 bg-[radial-gradient(circle_at_center,rgba(54,215,160,.12),transparent_30%),radial-gradient(circle_at_center,rgba(216,170,67,.07),transparent_62%)]">
      <motion.div
        className="absolute inset-[8%] rounded-full border border-[#36d7a0]/12"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[19%] rounded-full border border-[#d8aa43]/12"
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-0">
        {ORGANS.map((organ, index) => {
          const radius = 39;
          const radians = (organ.angle * Math.PI) / 180;
          const left = 50 + Math.cos(radians) * radius;
          const top = 50 + Math.sin(radians) * radius;
          return (
            <motion.div
              key={organ.num}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index }}
            >
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-full border border-[#36d7a0]/35 bg-[#07100f]/90 text-[10px] font-bold tracking-[.18em] text-[#9df2d2] shadow-[0_0_28px_rgba(54,215,160,.12)] md:h-16 md:w-16"
                animate={{ boxShadow: ['0 0 10px rgba(54,215,160,.08)', '0 0 30px rgba(54,215,160,.22)', '0 0 10px rgba(54,215,160,.08)'] }}
                transition={{ duration: 3.5 + index * 0.15, repeat: Infinity }}
              >
                {organ.num}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#d8aa43]/50 bg-[#050908] text-center shadow-[0_0_80px_rgba(216,170,67,.15)] md:h-44 md:w-44"
        animate={{ scale: [1, 1.025, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[9px] uppercase tracking-[.28em] text-[#36d7a0]/70">Proposed layer</span>
        <span className="mt-2 text-3xl font-semibold text-[#d8aa43] md:text-4xl" style={{ fontFamily: '"Cormorant Garamond", serif' }}>TRAI</span>
        <span className="text-[10px] uppercase tracking-[.32em] text-white/45">Coin</span>
      </motion.div>

      <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] uppercase tracking-[.2em] text-white/24">
        governance · participation · regenerative circulation
      </div>
    </div>
  );
}

export default function TraiCoin() {
  const [, navigate] = useLocation();
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-[#040607] text-[#f4f0e6]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(54,215,160,.12),transparent_30%),radial-gradient(circle_at_18%_75%,rgba(216,170,67,.08),transparent_34%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1500px] items-center gap-14 px-6 py-24 lg:grid-cols-[.86fr_1.14fr] lg:px-14 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="mb-6 text-[10px] uppercase tracking-[.32em] text-[#36d7a0]/75">Cross-organ infrastructure · governance concept</p>
            <h1 className="text-[clamp(4.6rem,10vw,9.5rem)] leading-[.78] tracking-[-.055em]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              TRAI<br /><span className="text-[#d8aa43]">Coin.</span>
            </h1>
            <p className="mt-9 max-w-[690px] text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.5] text-white/58">
              The proposed participation and governance layer for the TRAI ecosystem—designed to connect seven sovereign ventures through transparent rules without pretending that a live token, treasury, or public market already exists.
            </p>

            <div className="mt-10 grid max-w-[760px] grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
              <div className="bg-[#07100f] p-4"><span className="block text-[9px] uppercase tracking-[.2em] text-[#36d7a0]">Status</span><span className="mt-1 block text-sm text-white/60">Concept architecture</span></div>
              <div className="bg-[#07100f] p-4"><span className="block text-[9px] uppercase tracking-[.2em] text-[#36d7a0]">Issuance</span><span className="mt-1 block text-sm text-white/60">Not issued</span></div>
              <div className="bg-[#07100f] p-4"><span className="block text-[9px] uppercase tracking-[.2em] text-[#36d7a0]">Public sale</span><span className="mt-1 block text-sm text-white/60">None represented</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.15 }}>
            <GovernanceConstellation />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 py-28">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          <div className="mb-14 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#d8aa43]">Design doctrine</p>
              <h2 className="text-[clamp(2.8rem,5vw,5.2rem)] leading-[.92]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Governance before tokenomics.</h2>
            </div>
            <p className="max-w-[720px] text-lg leading-8 text-white/48 lg:justify-self-end">
              The page deliberately separates the ecosystem idea from claims of legal, financial, or technical completion. A serious token or DAO layer requires governance law, securities analysis, tax treatment, custody decisions, smart-contract security, treasury controls, and explicit participant rights before launch.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
            <div className="space-y-2">
              {PRINCIPLES.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActive(index)}
                  className={`w-full border px-5 py-5 text-left transition ${active === index ? 'border-[#36d7a0]/45 bg-[#36d7a0]/[.06]' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className="text-[9px] uppercase tracking-[.22em] text-white/30">{item.signal}</div>
                  <div className="mt-2 text-2xl" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{item.title}</div>
                </button>
              ))}
            </div>

            <div className="border border-[#36d7a0]/15 bg-[#07100f]/70 p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="mb-4 text-[10px] uppercase tracking-[.25em] text-[#36d7a0]">{PRINCIPLES[active].signal}</p>
                  <h3 className="mb-6 text-[clamp(2.7rem,4vw,4.8rem)] leading-[.92]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{PRINCIPLES[active].title}</h3>
                  <p className="max-w-[760px] text-lg leading-8 text-white/55">{PRINCIPLES[active].copy}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#050807] py-28">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="border border-[#d8aa43]/18 bg-[#d8aa43]/[.025] p-8 md:p-12">
              <p className="mb-5 text-[10px] uppercase tracking-[.28em] text-[#d8aa43]">What TRAI Coin is intended to be</p>
              <ul className="space-y-5 text-base leading-7 text-white/55">
                <li><span className="mr-3 text-[#36d7a0]">01</span>A proposed cross-organ participation and governance mechanism.</li>
                <li><span className="mr-3 text-[#36d7a0]">02</span>A framework for transparent voting, stewardship, and approved ecosystem allocations.</li>
                <li><span className="mr-3 text-[#36d7a0]">03</span>A possible technical layer for DAO-style coordination once governance and legal design are mature.</li>
                <li><span className="mr-3 text-[#36d7a0]">04</span>A way to express the TRAI flywheel in auditable rules rather than opaque promises.</li>
              </ul>
            </div>
            <div className="border border-white/10 bg-white/[.02] p-8 md:p-12">
              <p className="mb-5 text-[10px] uppercase tracking-[.28em] text-white/38">What this page does not claim</p>
              <ul className="space-y-5 text-base leading-7 text-white/48">
                <li><span className="mr-3 text-white/25">—</span>No live token, public offering, exchange listing, or deployed smart contract is represented.</li>
                <li><span className="mr-3 text-white/25">—</span>No guaranteed return, yield, appreciation, dividend, or investment outcome is promised.</li>
                <li><span className="mr-3 text-white/25">—</span>No equity, revenue-share, security, or ownership right should be inferred from the name “TRAI Coin.”</li>
                <li><span className="mr-3 text-white/25">—</span>Any future economic rights would require separate legal documentation and regulatory review.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(54,215,160,.08),transparent_42%)]" />
        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-14">
          <p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#36d7a0]">Position in the organism</p>
          <h2 className="max-w-[980px] text-[clamp(3rem,6vw,6.4rem)] leading-[.86]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Not an eighth organ.<br /><span className="text-[#d8aa43]">A coordination layer.</span></h2>
          <p className="mt-8 max-w-[760px] text-lg leading-8 text-white/50">
            TRAI Coin sits conceptually across the seven-organ architecture rather than replacing any venture. Materials, biology, intelligence, mobility, identity, community access, and regenerative return remain distinct operating domains; the coin concept exists to explore how participation and governance could coordinate across them.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => navigate('/')} className="border border-[#d8aa43] bg-[#d8aa43] px-7 py-3 text-[10px] font-bold uppercase tracking-[.18em] text-black">Return to the organism</button>
            <button onClick={() => navigate('/queen-califia')} className="border border-white/15 px-7 py-3 text-[10px] uppercase tracking-[.18em] text-white/60 hover:border-[#36d7a0]/35 hover:text-white">Explore governance intelligence</button>
          </div>
        </div>
      </section>
    </div>
  );
}
