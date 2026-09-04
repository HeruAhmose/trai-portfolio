import { useState } from "react";
import { motion } from "framer-motion";
import { CinematicIntro } from "../components/CinematicIntro";
import ManufacturingProcess from "../components/ManufacturingProcess";

const releaseTargets = [
  { name: "Electrical", value: "10²–10⁶ S/m", claim: "Application Claim 1" },
  {
    name: "Piezoelectric",
    value: ">100 mV @ 1g",
    claim: "Application Claim 20",
  },
  {
    name: "Thermal",
    value: ">50 mV @ 10°C/min",
    claim: "Application Claim 21",
  },
  { name: "Mechanical", value: ">10⁶ cycles", claim: "Application Claim 12" },
];

export const Manufacturing: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-deep-blue to-black pb-20 pt-20">
      {showIntro && (
        <CinematicIntro
          title="Manufacturing"
          subtitle="Seven-step proposed composite sequence"
          color="#ffd700"
          icon="◇"
          onComplete={() => setShowIntro(false)}
        />
      )}

      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-12 max-w-6xl px-4 text-center"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-yellow-300">
          Provisional-application process · not a production record
        </p>
        <h1 className="mb-4 text-5xl font-bold sm:text-6xl">
          <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Proposed Manufacturing Sequence
          </span>
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/65">
          Application 63/934,269 describes a seven-step route from hemp-fiber
          preparation through characterization and electrode integration. TRAI
          does not represent a qualified line, pilot-scale production, process
          yield, or released product.
        </p>
      </motion.header>

      <main className="mx-auto max-w-6xl px-4">
        <ManufacturingProcess />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 rounded-xl border border-yellow-400/30 bg-black/50 p-7"
        >
          <h2 className="text-center text-2xl font-bold text-yellow-300">
            APPLICATION RELEASE TARGETS
          </h2>
          <p className="mx-auto mb-7 mt-3 max-w-3xl text-center text-sm leading-relaxed text-cyan-100/65">
            These acceptance targets come from the provisional application. They
            are a proposed design envelope—not measured data, achieved
            specifications, or quality-control results.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {releaseTargets.map(target => (
              <article
                key={target.name}
                className="rounded-lg border border-yellow-400/25 bg-black/55 p-5 text-center"
              >
                <p className="text-xl font-bold text-yellow-300">
                  {target.value}
                </p>
                <p className="mt-2 text-sm text-cyan-200">{target.name}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {target.claim}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-7 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Required next: documented specimen · process controls · measured
            yield · reproducible QC
          </p>
        </motion.section>
      </main>
    </div>
  );
};
