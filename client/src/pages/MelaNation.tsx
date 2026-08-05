import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';
import React from 'react';
import { motion } from 'framer-motion';


const VISION_IMAGES = [
  { src: '/manus-storage/melanation-vision_5ef466eb.webp', alt: 'Sovereign city infrastructure concept' },
  { src: '/manus-storage/melanation-vision2_5d0c730a.webp', alt: 'Mobility network concept' },
  { src: '/manus-storage/melanation-vision3_d5b70061.webp', alt: 'Community distribution concept' },
  { src: '/manus-storage/melanation-vision4_65ca4327.webp', alt: 'Resilient access infrastructure concept' },
];

export default function MelaNation() {
  return (
    <div className="min-h-screen bg-[#050709] text-[#f4f0e6]">
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0"><SovereignNebulaGL variant="crimson" /></div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 60% 50%, rgba(30,80,160,0.15) 0%, transparent 70%)' }} />
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none opacity-20 z-[1] overflow-hidden">
          <img src={VISION_IMAGES[0].src} alt="" className="w-full h-full object-cover" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)' }} />
        </div>
        <div className="relative z-[2] max-w-[1380px] mx-auto px-6 lg:px-12 py-32">
          <motion.p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            04 · Circulation · Mobility Sovereignty
          </motion.p>
          <motion.h1 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.05] mb-6 max-w-[700px]" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Mela Nation.
          </motion.h1>
          <motion.p className="text-xl text-[#f4f0e6]/60 max-w-[560px] leading-relaxed font-sans mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Mobility sovereignty — last-mile logistics, community access, and resilient distribution. Mela Nation moves what the heart makes.
          </motion.p>
          <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <a href="mailto:aitconsult22@gmail.com?subject=Mela%20Nation%20Inquiry" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709]" style={{ background: '#d8aa43' }}>
              Partner with Mela Nation
            </a>
            <a href="https://calendly.com/aitconsult22/30min" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#d8aa43] border border-[#d8aa43]/40 hover:border-[#d8aa43] transition-colors">
              Book a Call
            </a>
          </motion.div>
        </div>
      </section>
      <section className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">The Circulation Organ</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>The blood vessels of the organism.</h2>
              <p className="text-[#f4f0e6]/60 font-sans leading-relaxed mb-6">
                Mela Nation does not make the blood — it moves it. Resilient routes connect people, goods, and opportunity across the organism. Last-mile logistics and community access infrastructure designed for underserved communities.
              </p>
              <div className="space-y-3">
                {['Last-mile logistics infrastructure', 'Community access routes', 'Supply-chain resilience', 'Distribution for True Melange Φ products', 'TechBridge hub supply coordination'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d8aa43] flex-shrink-0" />
                    <span className="text-sm font-sans text-[#f4f0e6]/60">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs font-sans text-[#f4f0e6]/30 border-t border-[#d8aa43]/10 pt-4">
                Mela Nation is in early development. Entity formation pending EIN filing. Venture architecture defined in the TRAI Sovereignty Architecture document. No products or services currently offered.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-2">
                {VISION_IMAGES.map((img, i) => (
                  <motion.div key={img.src} className="overflow-hidden" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <img src={img.src} alt={img.alt} className="w-full h-40 object-cover" style={{ filter: 'brightness(0.8) saturate(0.85)' }} />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs font-mono text-[#d8aa43]/40 mt-3 tracking-[0.12em]">Conceptual vision — not current infrastructure</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
