import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';
import React from 'react';
import { motion } from 'framer-motion';

import { DNAHelix } from '@/components/DNAHelix';
import { VideoPanel } from '@/components/MediaSystem';
import { VIDEO } from '@/lib/media';

export default function MeLaNiNa() {
  return (
    <div className="min-h-screen bg-[#050709] text-[#f4f0e6]">
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0"><SovereignNebulaGL variant="violet" /></div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 60% 50%, rgba(80,20,80,0.18) 0%, transparent 70%)' }} />
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none opacity-25 z-[1]">
          <DNAHelix interactive={false} />
        </div>
        <div className="relative z-[2] max-w-[1380px] mx-auto px-6 lg:px-12 py-32">
          <motion.p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            05 · Skin · Identity Sovereignty
          </motion.p>
          <motion.h1 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.05] mb-6 max-w-[700px]" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            MeLaNiNa.
          </motion.h1>
          <motion.p className="text-xl text-[#f4f0e6]/60 max-w-[560px] leading-relaxed font-sans mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Identity sovereignty — hemp apparel, cultural expression, and employee-ownership pathways. Material culture protects dignity.
          </motion.p>
          <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <a href="mailto:aitconsult22@gmail.com?subject=MeLaNiNa%20Inquiry" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709]" style={{ background: '#d8aa43' }}>
              Partner with MeLaNiNa
            </a>
            <a href="https://calendly.com/aitconsult22/30min" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#d8aa43] border border-[#d8aa43]/40 hover:border-[#d8aa43] transition-colors">
              Book a Call
            </a>
          </motion.div>
        </div>
      </section>
      {/* ── BRAND FILM ── */}
      <section className="py-24">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-6 font-sans">Brand film</p>
          <VideoPanel video={VIDEO.melanina} className="aspect-video border border-[#d8aa43]/10" />
        </div>
      </section>

      <section className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 mb-4 font-sans">The Identity Organ</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6" style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}>The skin of the organism.</h2>
              <p className="text-[#f4f0e6]/60 font-sans leading-relaxed mb-6">
                Material culture protects dignity, expression, and the memory carried through form. MeLaNiNa uses the hemp substrate from Tamerian Materials to create apparel that carries the cultural identity of the TRAI sovereignty mission.
              </p>
              <div className="space-y-3">
                {['Hemp-derived apparel and textiles', 'Cultural expression and dignity', 'Employee-ownership pathways', 'Afrofuturist design language', 'Tamerian Materials substrate integration'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d8aa43] flex-shrink-0" />
                    <span className="text-sm font-sans text-[#f4f0e6]/60">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs font-sans text-[#f4f0e6]/30 border-t border-[#d8aa43]/10 pt-4">
                MeLaNiNa is in early development. Entity formation pending EIN filing. Venture architecture defined in the TRAI Sovereignty Architecture document. No products or services currently offered.
              </p>
            </motion.div>
            <motion.div className="h-[400px]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <DNAHelix interactive={true} />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
