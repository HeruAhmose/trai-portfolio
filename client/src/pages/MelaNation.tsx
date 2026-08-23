import { SovereignNebulaGL } from "@/components/SovereignNebulaGL";
import { VesselNetworkVisual } from "@/components/OrganVisuals";
import React from "react";
import { motion } from "framer-motion";

const C = {
  vessel: "#1f66ad",
  vesselLight: "#6ea8da",
  returnGold: "#f0cc79",
  cream: "#f4f0e6",
  dark: "#050709",
};

export default function MelaNation() {
  return (
    <div className="min-h-screen bg-[#050709] text-[#f4f0e6]">
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <SovereignNebulaGL variant="cyber" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 60% 50%, rgba(31,102,173,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="absolute right-[4%] top-[16%] hidden h-[62%] w-[42%] pointer-events-none opacity-65 z-[1] overflow-hidden lg:block">
          <VesselNetworkVisual compact />
        </div>
        <div className="relative z-[2] max-w-[1380px] mx-auto px-6 lg:px-12 py-32">
          <motion.p
            className="text-xs tracking-[0.22em] uppercase mb-4 font-sans"
            style={{ color: `${C.vesselLight}cc` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            04 · Vessels · Mobility Sovereignty
          </motion.p>
          <motion.h1
            className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.05] mb-6 max-w-[700px]"
            style={{ color: C.cream, WebkitTextFillColor: C.cream }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Mela Nation.
          </motion.h1>
          <motion.p
            className="text-xl text-[#f4f0e6]/60 max-w-[560px] leading-relaxed font-sans mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Mobility sovereignty — last-mile logistics, community access, and
            resilient distribution. Mela Nation moves value through the TRAI
            organism the way vessels move life through a body.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="mailto:aitconsult22@gmail.com?subject=Mela%20Nation%20Inquiry"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-white"
              style={{ background: C.vessel }}
            >
              Partner with Mela Nation
            </a>
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase border transition-colors"
              style={{ color: C.vesselLight, borderColor: `${C.vesselLight}66` }}
            >
              Book a Call
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-[#070b0f]">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p
                className="text-xs tracking-[0.22em] uppercase mb-4 font-sans"
                style={{ color: `${C.vesselLight}cc` }}
              >
                The Circulation Organ
              </p>
              <h2
                className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6"
                style={{ color: C.cream, WebkitTextFillColor: C.cream }}
              >
                The blood vessels of the organism.
              </h2>
              <p className="text-[#f4f0e6]/60 font-sans leading-relaxed mb-6">
                Mela Nation does not make the blood — it moves it. Resilient
                routes connect people, goods, and opportunity across the
                organism. Last-mile logistics and community access
                infrastructure are designed around movement, continuity, and
                underserved routes.
              </p>
              <div className="space-y-3">
                {[
                  "Last-mile logistics infrastructure",
                  "Community access routes",
                  "Supply-chain resilience",
                  "Distribution for True Mélange Φ products",
                  "TechBridge hub supply coordination",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: C.vessel }}
                    />
                    <span className="text-sm font-sans text-[#f4f0e6]/60">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p
                className="mt-8 text-xs font-sans text-[#f4f0e6]/30 border-t pt-4"
                style={{ borderColor: `${C.vessel}33` }}
              >
                Mela Nation is in early development. Entity formation pending
                EIN filing. Venture architecture defined in the TRAI Sovereignty
                Architecture document. No products or services currently
                offered.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <VesselNetworkVisual />
              <p
                className="text-xs font-mono mt-3 tracking-[0.12em]"
                style={{ color: `${C.vesselLight}80` }}
              >
                Conceptual circulation map — not current infrastructure
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
