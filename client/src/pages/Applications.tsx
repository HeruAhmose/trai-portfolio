import { useState } from "react";
import { motion } from "framer-motion";
import { CinematicIntro } from "../components/CinematicIntro";

interface ApplicationDirection {
  id: string;
  name: string;
  description: string;
  icon: string;
  enablingIdeas: string[];
  validationNeed: string;
  status: "Concept only" | "Research hypothesis";
}

const applications: ApplicationDirection[] = [
  {
    id: "structural-monitoring",
    name: "Structural Monitoring",
    description:
      "A proposed self-powered sensing direction for strain, vibration, and damage signals.",
    icon: "🌉",
    enablingIdeas: [
      "Piezoelectric response",
      "Signal electrodes",
      "Energy harvesting",
    ],
    validationNeed:
      "Requires calibrated prototypes, environmental testing, and comparison with established sensors.",
    status: "Concept only",
  },
  {
    id: "wearables",
    name: "Wearable Sensors",
    description:
      "A proposed device direction using motion or thermal gradients as local energy inputs.",
    icon: "⌚",
    enablingIdeas: [
      "Thermal gradients",
      "Mechanical input",
      "Low-power electronics",
    ],
    validationNeed:
      "Requires measured output, durability, skin-contact safety, and application-specific review.",
    status: "Concept only",
  },
  {
    id: "ambient-sensors",
    name: "Ambient Sensor Nodes",
    description:
      "A research direction for reduced-battery environmental or industrial monitoring.",
    icon: "◉",
    enablingIdeas: [
      "Multi-modal inputs",
      "Energy management",
      "Wireless telemetry",
    ],
    validationNeed:
      "Requires a power budget, duty-cycle data, field durability, and a working integrated prototype.",
    status: "Concept only",
  },
  {
    id: "thermal-vibration",
    name: "Thermal & Vibration Harvesting",
    description:
      "A proposed use of waste heat and mechanical motion as inputs to an integrated harvester.",
    icon: "⚡",
    enablingIdeas: [
      "Thermoelectric target",
      "Piezoelectric target",
      "Storage interface",
    ],
    validationNeed:
      "Requires controlled measurements of the integrated composite and end-to-end conversion efficiency.",
    status: "Concept only",
  },
  {
    id: "quantum-sensing",
    name: "Quantum Sensing",
    description:
      "A hypothesis involving rare-earth-doped crystalline constituents at room temperature.",
    icon: "⚛️",
    enablingIdeas: ["Rare-earth candidates", "Optical pumping", "Spin readout"],
    validationNeed:
      "T₂ >500 ns at 300 K is a target and hypothesis—not a confirmed measurement.",
    status: "Research hypothesis",
  },
  {
    id: "biomedical",
    name: "Biomedical Research Direction",
    description:
      "A long-horizon concept for devices influenced by body heat or motion.",
    icon: "✚",
    enablingIdeas: [
      "Low-power sensing",
      "Encapsulation",
      "Thermal or motion input",
    ],
    validationNeed:
      "Requires material characterization, biocompatibility evidence, safety testing, and regulatory review.",
    status: "Research hypothesis",
  },
];

export const Applications: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const selected = applications[selectedApp];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-deep-blue to-black pb-20 pt-20">
      {showIntro && (
        <CinematicIntro
          title="Application Directions"
          subtitle="Concepts that still require integrated evidence"
          color="#00ffff"
          icon="◇"
          onComplete={() => setShowIntro(false)}
        />
      )}

      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-12 max-w-6xl px-4 text-center"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
          Application map · not a deployment record
        </p>
        <h1 className="mb-4 text-5xl font-bold sm:text-6xl">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Proposed Application Directions
          </span>
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-cyan-100/70">
          These directions explain why the architecture may be worth testing.
          TRAI represents no active deployment, commercialization timetable,
          customer integration, or measured application outcome.
        </p>
      </motion.header>

      <div className="mx-auto mb-12 grid max-w-6xl grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-6">
        {applications.map((application, index) => (
          <motion.button
            key={application.id}
            type="button"
            onClick={() => setSelectedApp(index)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={selectedApp === index}
            className={`rounded-lg border p-4 text-left transition-all ${
              selectedApp === index
                ? "border-cyan-300 bg-cyan-300/15 shadow-lg shadow-cyan-400/20"
                : "border-cyan-400/25 bg-black/45 hover:border-cyan-400/55"
            }`}
          >
            <span className="mb-2 block text-3xl" aria-hidden="true">
              {application.icon}
            </span>
            <span className="block text-sm font-bold text-cyan-200">
              {application.name}
            </span>
            <span className="mt-2 block text-[10px] uppercase tracking-wider text-white/45">
              {application.status}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.section
        key={selected.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-14 max-w-4xl px-4"
      >
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/5 p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="text-6xl" aria-hidden="true">
              {selected.icon}
            </span>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">
                {selected.status}
              </p>
              <h2 className="text-3xl font-bold text-cyan-200">
                {selected.name}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-cyan-50/75">
                {selected.description}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-yellow-300">
              Enabling ideas
            </h3>
            <div className="flex flex-wrap gap-2">
              {selected.enablingIdeas.map(idea => (
                <span
                  key={idea}
                  className="rounded-full border border-cyan-400/30 bg-black/35 px-3 py-1 text-xs text-cyan-200"
                >
                  {idea}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-lg border border-yellow-300/30 bg-black/45 p-5">
            <h3 className="font-bold text-yellow-300">Evidence required</h3>
            <p className="mt-2 text-sm leading-relaxed text-cyan-50/70">
              {selected.validationNeed}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-center text-2xl font-bold text-cyan-200">
          VALIDATION SEQUENCE
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [
              "01",
              "Constituent evidence",
              "Confirm inputs and baseline properties.",
            ],
            [
              "02",
              "Integrated prototype",
              "Build and document a reproducible specimen.",
            ],
            [
              "03",
              "Controlled measurement",
              "Record methods, controls, uncertainty, and raw data.",
            ],
            [
              "04",
              "Independent gate",
              "Replicate before any deployment or outcome claim.",
            ],
          ].map(([number, title, copy]) => (
            <article
              key={number}
              className="rounded-lg border border-cyan-400/25 bg-black/45 p-5"
            >
              <p className="font-mono text-xs text-yellow-300">{number}</p>
              <h3 className="mt-3 font-bold text-cyan-200">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {copy}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            ["Directions mapped", applications.length],
            ["Active deployments", 0],
            ["Measured outcomes", 0],
            ["Provisional filings", 1],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded border border-white/10 bg-white/[0.03] p-4 text-center"
            >
              <p className="text-2xl font-bold text-cyan-300">{value}</p>
              <p className="mt-1 text-xs text-white/45">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
