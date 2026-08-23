import { SovereignNebulaGL } from "@/components/SovereignNebulaGL";
import { IdentityTextileVisual } from "@/components/OrganVisuals";
import React from "react";
import { motion } from "framer-motion";

const C = {
  skin: "#d98758",
  returnGold: "#f0cc79",
  cream: "#f4f0e6",
  dark: "#050709",
};

export default function MeLaNiNa() {
  return (
    <div className="min-h-screen bg-[#050709] text-[#f4f0e6]">
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <SovereignNebulaGL variant="crimson" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 60% 50%, rgba(217,135,88,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="absolute right-[4%] top-[15%] hidden h-[64%] w-[42%] pointer-events-none opacity-65 z-[1] lg:block">
          <IdentityTextileVisual compact />
        </div>
        <div className="relative z-[2] max-w-[1380px] mx-auto px-6 lg:px-12 py-32">
          <motion.p
            className="text-xs tracking-[0.22em] uppercase mb-4 font-sans"
            style={{ color: `${C.skin}dd` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            05 · Skin · Identity Sovereignty
          </motion.p>
          <motion.h1
            className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.05] mb-6 max-w-[700px]"
            style={{ color: C.cream, WebkitTextFillColor: C.cream }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            MeLaNiNa.
          </motion.h1>
          <motion.p
            className="text-xl text-[#f4f0e6]/60 max-w-[560px] leading-relaxed font-sans mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Identity sovereignty — hemp apparel, cultural expression, and
            employee-ownership pathways. Material culture is the protective
            interface through which the organism meets the world.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="mailto:aitconsult22@gmail.com?subject=MeLaNiNa%20Inquiry"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709]"
              style={{ background: C.skin }}
            >
              Partner with MeLaNiNa
            </a>
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase border transition-colors"
              style={{ color: C.returnGold, borderColor: `${C.skin}66` }}
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
                style={{ color: `${C.skin}dd` }}
              >
                The Identity Organ
              </p>
              <h2
                className="text-[clamp(2rem,4vw,3rem)] font-bold mb-6"
                style={{ color: C.cream, WebkitTextFillColor: C.cream }}
              >
                The skin of the organism.
              </h2>
              <p className="text-[#f4f0e6]/60 font-sans leading-relaxed mb-6">
                Material culture protects dignity, expression, and the memory
                carried through form. MeLaNiNa uses the hemp substrate from
                Tamerian Materials to create apparel that carries the cultural
                identity of the TRAI sovereignty mission. Its visual language is
                therefore textile, surface, silhouette, and protection — not
                genetics.
              </p>
              <div className="space-y-3">
                {[
                  "Hemp-derived apparel and textiles",
                  "Cultural expression and dignity",
                  "Employee-ownership pathways",
                  "Afrofuturist design language",
                  "Tamerian Materials substrate integration",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: C.skin }}
                    />
                    <span className="text-sm font-sans text-[#f4f0e6]/60">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p
                className="mt-8 text-xs font-sans text-[#f4f0e6]/30 border-t pt-4"
                style={{ borderColor: `${C.skin}33` }}
              >
                MeLaNiNa is in early development. Entity formation pending EIN
                filing. Venture architecture defined in the TRAI Sovereignty
                Architecture document. No products or services currently
                offered.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <IdentityTextileVisual />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
