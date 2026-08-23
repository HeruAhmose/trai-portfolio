import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IdentityTextileVisual } from '@/components/OrganVisuals';

const SKIN = '#d98758';
const GOLD = '#d6b66a';

const LOOKS = [
  { id: '01', name: 'The Column', note: 'Architectural tailoring', geometry: 'linear', copy: 'Long, controlled lines translate hemp into a formal silhouette: restrained shoulders, sculpted waist, deliberate negative space, and surface detail used as structure rather than ornament.' },
  { id: '02', name: 'The Mantle', note: 'Protective volume', geometry: 'arc', copy: 'A ceremonial outer layer treats clothing as interface and shelter. Volume concentrates at the shoulder and back while texture and restrained cultural geometry carry presence without visual noise.' },
  { id: '03', name: 'The Fold', note: 'Soft structure', geometry: 'fold', copy: 'Pleat, wrap, and engineered drape soften the architecture without abandoning discipline. The material language stays tactile, adult, and formal rather than costume-like.' },
] as const;

const HOUSE = [
  ['HEMP', 'Primary textile direction', 'A durable natural-fiber foundation for elevated tailoring, woven texture, and lower-impact material development.'],
  ['SURFACE', 'Identity carried through craft', 'Embroidery, restrained geometry, woven relief, and tonal contrast act as memory-bearing detail rather than decorative overlay.'],
  ['FORM', 'Silhouette before spectacle', 'Proportion, drape, shoulder, waist, and negative space establish the house language before embellishment is introduced.'],
  ['RETURN', 'Value through the organism', 'The venture architecture is designed around ethical production, community reinvestment, and wider participation in the value created.'],
] as const;

const PYRAMID_LANGUAGE = [
  ['PYRAMID', 'A recurring structural silhouette', 'Stacked, fractured, inverted, and nested triangular forms establish the collection architecture.'],
  ['MOLECULE', 'Melanin rendered as visual system', 'Molecular nodes and bonds move through the geometry as an identity motif rather than a scientific claim.'],
  ['PRISM', 'Color released from a dark ground', 'Black, bronze, clay, blush, teal, and spectral accents break through controlled fields of ebony and warm metal.'],
  ['NO SCHEME', 'The declaration', 'The phrase interrupts the pyramid as a graphic refusal: a first-collection statement carried through surface, placement, and scale.'],
] as const;

function FashionStudy({ geometry, active }: { geometry: string; active: boolean }) {
  const clip = geometry === 'arc' ? 'polygon(15% 0,85% 0,100% 24%,76% 100%,24% 100%,0 24%)' : geometry === 'fold' ? 'polygon(8% 0,92% 0,72% 49%,90% 100%,18% 100%,30% 50%)' : 'polygon(18% 0,82% 0,75% 100%,25% 100%)';
  return <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-[#090909]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(217,135,88,.12),transparent_38%),linear-gradient(180deg,rgba(183,122,73,.07),transparent_55%)]" />
    <div className="absolute left-1/2 top-[12%] h-[12%] w-[18%] -translate-x-1/2 rounded-[50%] border border-[#d98758]/50 bg-[#120f0c]" />
    <motion.div className="absolute left-1/2 top-[23%] h-[57%] -translate-x-1/2 border border-[#d98758]/60 bg-[linear-gradient(145deg,rgba(217,135,88,.16),rgba(8,8,8,.96)_42%,rgba(214,182,106,.08))]" animate={{ width: geometry === 'arc' ? '62%' : geometry === 'fold' ? '52%' : '44%', clipPath: clip, boxShadow: active ? '0 0 45px rgba(217,135,88,.12)' : '0 0 0 rgba(0,0,0,0)' }} transition={{ duration: .8, ease: [0.23,1,.32,1] }}>
      {Array.from({ length: 9 }).map((_, i) => <motion.span key={i} className="absolute left-[12%] right-[12%] h-px bg-[#d6b66a]/20" style={{ top: `${12 + i * 9}%` }} animate={{ scaleX: active ? [0.65,1,.72] : .6, opacity: active ? [.18,.5,.22] : .16 }} transition={{ duration: 5 + i * .2, repeat: Infinity, delay: i * .08 }} />)}
    </motion.div>
  </div>;
}

function PyramidMark() {
  return <div className="relative mx-auto aspect-square w-full max-w-[520px]">
    <div className="absolute inset-[7%] rotate-45 border border-[#d6b66a]/20" />
    {[0,1,2,3].map((i)=><motion.div key={i} className="absolute left-1/2 border border-[#d6b66a]/60 bg-black/70" style={{ width:`${72-i*13}%`, height:`${24-i*2}%`, bottom:`${12+i*17}%`, clipPath:'polygon(50% 0,100% 100%,0 100%)', x:'-50%' }} animate={{ opacity:[.38,.9,.38], y:[0,-3,0] }} transition={{ duration:5+i*.7, repeat:Infinity, delay:i*.25 }}/>) }
    {Array.from({length:18}).map((_,i)=><motion.span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-[#d6b66a]" style={{left:`${14+(i*17)%72}%`,top:`${18+(i*23)%65}%`}} animate={{opacity:[.2,.9,.2],scale:[.7,1.25,.7]}} transition={{duration:3+i*.08,repeat:Infinity,delay:i*.11}}/>)}
    <div className="absolute inset-x-0 bottom-[3%] text-center text-[10px] uppercase tracking-[.42em] text-[#d6b66a]/60">Pyramid · molecule · prism</div>
  </div>;
}

export default function MeLaNiNa() {
  const [active, setActive] = useState(0);
  return <div className="min-h-screen bg-[#050505] text-[#f3eee4] selection:bg-[#d6b66a] selection:text-black">
    <section className="relative min-h-[92vh] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(217,135,88,.15),transparent_31%),radial-gradient(circle_at_18%_90%,rgba(214,182,106,.08),transparent_27%),linear-gradient(135deg,#050505_0%,#0b0908_55%,#050505_100%)]" />
      <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-[1500px] items-center gap-16 px-6 py-28 lg:grid-cols-[1fr_.72fr] lg:px-14">
        <div><p className="mb-8 text-[10px] uppercase tracking-[.34em]" style={{ color: SKIN }}>05 · Skin · Identity Sovereignty</p><h1 className="mb-8 text-[clamp(4.5rem,10vw,9rem)] font-semibold leading-[.78] tracking-[-.055em]" style={{ fontFamily: '"Cormorant Garamond",serif' }}>MeLa<span style={{ color: SKIN }}>Ni</span>Na</h1><p className="max-w-[690px] border-l border-[#d98758]/35 pl-6 text-[clamp(1.2rem,2vw,1.7rem)] leading-[1.48] text-white/68">A luxury hemp fashion house built around melanated identity, sculptural tailoring, cultural memory, ethical production, and value that returns through the larger TRAI organism.</p><div className="mt-10 flex flex-wrap gap-3 text-[9px] uppercase tracking-[.18em] text-white/35"><span className="border border-white/10 px-4 py-2">hemp-led textile direction</span><span className="border border-white/10 px-4 py-2">ebony · ivory · bronze</span><span className="border border-white/10 px-4 py-2">private-house restraint</span></div></div>
        <FashionStudy geometry={LOOKS[active].geometry} active />
      </div>
    </section>

    <section className="relative overflow-hidden border-b border-white/10 bg-[#080706] py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(214,182,106,.10),transparent_28%),radial-gradient(circle_at_22%_60%,rgba(217,135,88,.09),transparent_24%)]" />
      <div className="relative mx-auto grid max-w-[1500px] gap-16 px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:px-14">
        <div><p className="mb-5 text-[10px] uppercase tracking-[.34em]" style={{color:GOLD}}>Collection 001 · source archive</p><h2 className="text-[clamp(3.4rem,7vw,7.4rem)] leading-[.82]" style={{fontFamily:'"Cormorant Garamond",serif'}}>Pyramid<br/><span className="text-white/35">No Scheme.</span></h2><p className="mt-8 max-w-[610px] text-lg leading-8 text-white/52">The first named MeLaNiNa collection establishes a sharper skin language: pyramid architecture, melanin-inspired molecular graphics, prism fields, fractured geometry, and declarative typography. The supplied artwork is treated as collection source material—not as evidence of manufactured inventory.</p><div className="mt-9 border-l border-[#d6b66a]/30 pl-5 text-[10px] uppercase leading-6 tracking-[.2em] text-white/35">black ground · warm metal · clay · blush · teal · spectral interruption</div></div>
        <PyramidMark />
      </div>
      <div className="relative mx-auto mt-20 max-w-[1500px] px-6 lg:px-14"><div className="grid border-y border-white/10 md:grid-cols-4">{PYRAMID_LANGUAGE.map(([label,title,copy],i)=><motion.article key={label} className="border-b border-white/10 p-6 md:border-b-0 md:border-r md:last:border-r-0" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}><p className="mb-6 text-[9px] tracking-[.25em] text-[#d6b66a]/60">0{i+1}</p><p className="text-[10px] uppercase tracking-[.25em]" style={{color:SKIN}}>{label}</p><h3 className="mt-3 text-2xl" style={{fontFamily:'"Cormorant Garamond",serif'}}>{title}</h3><p className="mt-4 text-sm leading-6 text-white/43">{copy}</p></motion.article>)}</div></div>
    </section>

    <section className="border-b border-white/10 bg-[#080706] py-28"><div className="mx-auto max-w-[1500px] px-6 lg:px-14"><div className="mb-14 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="mb-4 text-[10px] uppercase tracking-[.3em]" style={{ color: SKIN }}>Atelier studies /// silhouette as memory</p><h2 className="text-[clamp(2.6rem,5vw,5rem)] leading-[.94]" style={{ fontFamily: '"Cormorant Garamond",serif' }}>Prestige begins with proportion, not decoration.</h2></div><p className="max-w-[680px] text-lg leading-8 text-white/48 lg:justify-self-end">Monumental rooms, museum light, tactile hemp, controlled geometry, and silhouettes that read before embellishment establish the house direction. The experience behaves like a private fashion-house study rather than a merchandise grid.</p></div>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]"><div className="grid gap-3 md:grid-cols-3">{LOOKS.map((look,i) => <button key={look.id} onClick={() => setActive(i)} className="text-left"><FashionStudy geometry={look.geometry} active={active === i}/><div className={`border-x border-b p-4 ${active === i ? 'border-[#d98758]/45 bg-[#d98758]/[.06]' : 'border-white/10'}`}><div className="mb-2 flex justify-between text-[9px] uppercase tracking-[.18em] text-white/30"><span>{look.id}</span><span>{look.note}</span></div><div className="text-xl" style={{fontFamily:'"Cormorant Garamond",serif'}}>{look.name}</div></div></button>)}</div><div className="flex min-h-[420px] items-end border border-[#d98758]/20 bg-black/30 p-8 md:p-12"><AnimatePresence mode="wait"><motion.div key={active} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><p className="mb-4 text-[10px] uppercase tracking-[.25em]" style={{ color: SKIN }}>{LOOKS[active].note}</p><h3 className="mb-6 text-[clamp(3rem,6vw,6rem)] leading-[.9]" style={{fontFamily:'"Cormorant Garamond",serif'}}>{LOOKS[active].name}</h3><p className="text-lg leading-8 text-white/54">{LOOKS[active].copy}</p></motion.div></AnimatePresence></div></div>
    </div></section>

    <section className="border-b border-white/10 py-28"><div className="mx-auto grid max-w-[1500px] gap-14 px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-14"><div><p className="mb-4 text-[10px] uppercase tracking-[.3em] text-[#d6b66a]">House architecture</p><h2 className="mb-6 text-[clamp(2.8rem,5vw,4.8rem)] leading-[.95]" style={{fontFamily:'"Cormorant Garamond",serif'}}>Fiber. Form. Identity. Return.</h2><p className="text-base leading-7 text-white/44">A fashion system, not a merch layer.</p></div><div className="divide-y divide-white/10 border-y border-white/10">{HOUSE.map(([label,title,copy],i)=><motion.div key={label} className="grid gap-5 py-8 md:grid-cols-[70px_1fr_1.4fr]" initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><div className="text-[9px] text-[#d6b66a]/55">0{i+1}</div><div><p className="text-[9px] uppercase tracking-[.22em]" style={{ color: SKIN }}>{label}</p><h3 className="mt-2 text-2xl" style={{fontFamily:'"Cormorant Garamond",serif'}}>{title}</h3></div><p className="text-base leading-7 text-white/47">{copy}</p></motion.div>)}</div></div></section>

    <section className="relative overflow-hidden bg-[#090806] py-28"><div className="absolute inset-0 opacity-32"><IdentityTextileVisual /></div><div className="absolute inset-0 bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,.94)_55%,rgba(9,8,6,.72)_100%)]"/><div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-14"><div className="max-w-[780px]"><p className="mb-4 text-[10px] uppercase tracking-[.3em]" style={{ color: SKIN }}>The identity organ</p><h2 className="mb-7 text-[clamp(3rem,6vw,6rem)] leading-[.88]" style={{fontFamily:'"Cormorant Garamond",serif'}}>The organism meets the world through its skin.</h2><p className="mb-8 text-lg leading-8 text-white/52">MeLaNiNa remains in development. This page presents the house architecture, first-collection source language, and design direction derived from supplied brand materials; it does not imply currently available products.</p><div className="flex flex-wrap gap-3"><a href="mailto:aitconsult22@gmail.com?subject=MeLaNiNa%20Partnership" className="border border-[#d6b66a] bg-[#d6b66a] px-7 py-3 text-[10px] font-bold uppercase tracking-[.18em] text-black">Partnership inquiry</a><a href="/nu-ta-meri" className="border border-white/15 px-7 py-3 text-[10px] uppercase tracking-[.18em] text-white/60">See the city context</a></div></div></div></section>
  </div>;
}
