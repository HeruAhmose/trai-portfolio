import { SovereignNebulaGL } from "@/components/SovereignNebulaGL";
import React from "react";
import { motion } from "framer-motion";

const C = {
  gold: "#d8aa43",
  cream: "#f4f0e6",
  dark: "#050709",
  mid: "#070b0f",
};

const PRINCIPLES = [
  {
    num: "01",
    title: "Regenerative Return",
    copy: "The design calls for a defined community-return allocation from future TRAI revenue. The percentage, trigger, and enforcement mechanism require adopted governing documents and written agreements.",
  },
  {
    num: "02",
    title: "Community Ownership",
    copy: "The proposed covenant is intended to prevent unilateral capture of the community-return mechanism. That protection is a design objective until the governing documents are adopted.",
  },
  {
    num: "03",
    title: "Transparent Allocation",
    copy: "The allocation model is intended to require documented, publicly reported value flows. No allocation or reporting history is represented yet.",
  },
  {
    num: "04",
    title: "Long Horizon",
    copy: "The long-horizon design is meant to outlast any single venture. Its durability depends on governance, funding, compliance, and accountable execution that are still being developed.",
  },
];

export default function PeoplesFoundation() {
  return (
    <div className="min-h-screen" style={{ background: C.dark }}>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <SovereignNebulaGL />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-32">
          <motion.p
            className="ceremonial-label mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Organ 07 — The Lymphatic System
          </motion.p>
          <div className="overflow-hidden mb-2">
            <motion.h1
              className="display-heading text-[clamp(3rem,7vw,6rem)]"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              The Peoples
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="display-heading text-[clamp(3rem,7vw,6rem)]"
              style={{ color: C.gold, WebkitTextFillColor: C.gold }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              Foundation.
            </motion.h1>
          </div>
          <motion.p
            className="text-xl text-[#f4f0e6]/55 font-sans max-w-[520px] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Operating under §508(c)(1)(A), the Foundation is the Sovereignty
            Stack's regenerative-return organ, structured to route value back to
            the community that built it.
          </motion.p>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* Status */}
      <section className="py-32 section-deep">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="ceremonial-label mb-6">Current Status</p>
              <h2 className="display-heading text-[clamp(2rem,4vw,3.2rem)] mb-8">
                Operating position, stated precisely.
              </h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed mb-8">
                The Peoples Foundation states that it operates under
                §508(c)(1)(A). This is the Foundation's operating position; this
                public repository does not represent an IRS determination or
                recognition letter. Its community-return architecture remains
                subject to governing documents, written agreements, counsel, and
                applicable law.
              </p>
              <div className="space-y-3">
                {[
                  {
                    label: "Federal operating position",
                    status: "§508(c)(1)(A)",
                    color: "#4ade80",
                  },
                  {
                    label: "IRS determination",
                    status: "Not represented",
                    color: "#94a3b8",
                  },
                  {
                    label: "Community Covenant",
                    status: "In Development",
                    color: "#d8aa43",
                  },
                  {
                    label: "First Allocation",
                    status: "Pending TRAI Revenue",
                    color: "#94a3b8",
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border border-[#d8aa43]/10 px-5 py-3"
                  >
                    <span className="text-sm font-mono text-[#f4f0e6]/60">
                      {item.label}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: item.color }}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="ceremonial-label mb-6">The Architecture</p>
              <h2 className="display-heading text-[clamp(2rem,4vw,3.2rem)] mb-8">
                Return is not optional.
              </h2>
              <p className="text-xl text-[#f4f0e6]/55 font-sans leading-relaxed">
                The Foundation is intended to make regenerative return a
                structural commitment rather than a marketing gesture. The
                allocation percentage and enforcement mechanism are not
                represented as adopted or automatic; they remain subject to
                governing documents, written agreements, counsel, and applicable
                law.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* Principles */}
      <section className="py-32 sovereign-bg">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.p
            className="ceremonial-label mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Founding Principles
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-8">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.num}
                className="border border-[#d8aa43]/15 p-8 gold-shimmer depth-card-3d"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-xs font-mono text-[#d8aa43]/50 mb-4 tracking-[0.2em]">
                  {p.num}
                </p>
                <h3 className="display-heading text-xl mb-4">{p.title}</h3>
                <p className="text-[#f4f0e6]/55 font-sans leading-relaxed text-sm">
                  {p.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* CTA */}
      <section className="py-32 text-center" style={{ background: C.dark }}>
        <div className="max-w-[600px] mx-auto px-6">
          <motion.p
            className="ceremonial-label mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Get Involved
          </motion.p>
          <motion.h2
            className="display-heading text-[clamp(2rem,4vw,3.2rem)] mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The community builds the organism. The organism returns to the
            community.
          </motion.h2>
          <motion.div
            className="flex flex-wrap gap-6 justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709] active:scale-[0.97] transition-transform"
              style={{ background: C.gold }}
            >
              Book a Conversation
            </a>
            <a
              href="mailto:aitconsult22@gmail.com"
              className="px-8 py-3.5 font-sans text-sm tracking-[0.12em] uppercase border border-[#d8aa43]/30 text-[#d8aa43]/70 hover:text-[#d8aa43] hover:border-[#d8aa43]/60 transition-colors"
            >
              aitconsult22@gmail.com
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
