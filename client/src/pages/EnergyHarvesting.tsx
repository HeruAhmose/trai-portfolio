import { motion } from "framer-motion";

const mechanisms = [
  {
    name: "Piezoelectric direction",
    icon: "◇",
    description:
      "Mechanical stress is the proposed input for quartz and tourmaline constituents.",
    targets: [
      ["Application range", "50–500 μW/cm²"],
      ["Quartz d₃₃ reference", "~2.3 pC/N"],
      ["Tourmaline d₃₃ reference", "~5–10 pC/N"],
    ],
  },
  {
    name: "Thermoelectric direction",
    icon: "△",
    description:
      "A thermal gradient is the proposed input for an integrated conversion pathway.",
    targets: [
      ["Application ZT range", "1.0–2.5"],
      ["Reference comparison", "5–10× vs Bi₂Te₃"],
      ["Integrated result", "Not measured"],
    ],
  },
  {
    name: "Spin-Seebeck direction",
    icon: "◎",
    description:
      "Magnetite is proposed as a magnetic constituent within a coupled thermal pathway.",
    targets: [
      ["Application enhancement", "+40–60%"],
      ["Magnetite fraction", "2–20 vol%"],
      ["Integrated result", "Not measured"],
    ],
  },
];

export const EnergyHarvesting: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050607] via-[#0a1628] to-[#050607] pb-20 pt-24">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-12 max-w-6xl px-4 text-center"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-green-300">
          Patent-application targets · not measured data
        </p>
        <h1 className="mb-4 text-5xl font-bold sm:text-6xl">
          <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
            Energy-Harvesting Research Directions
          </span>
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-cyan-100/70">
          U.S. Provisional Application 63/934,269 describes proposed
          piezoelectric, thermoelectric, and magnetic coupling pathways. The
          values below are application ranges or literature-grounded targets—not
          results from an integrated TRAI device.
        </p>
      </motion.header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-3">
        {mechanisms.map((mechanism, index) => (
          <motion.article
            key={mechanism.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-green-400/30 bg-black/45 p-6"
          >
            <span className="text-4xl text-green-300" aria-hidden="true">
              {mechanism.icon}
            </span>
            <h2 className="mt-5 text-2xl font-bold text-green-300">
              {mechanism.name}
            </h2>
            <p className="mt-3 min-h-20 text-sm leading-relaxed text-cyan-50/65">
              {mechanism.description}
            </p>
            <div className="mt-6 space-y-3">
              {mechanism.targets.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    {label}
                  </p>
                  <p className="mt-1 font-semibold text-cyan-200">{value}</p>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/5 p-7">
          <h2 className="text-2xl font-bold text-yellow-200">
            Integrated-device evidence gate
          </h2>
          <p className="mt-3 max-w-4xl leading-relaxed text-white/65">
            The proposed combined output range is 80–800 μW/cm². TRAI does not
            represent that range—or any constituent target—as measured
            integrated performance. A defensible result requires a documented
            specimen, calibrated inputs, control samples, uncertainty, raw data,
            and reproducible testing.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-green-300">
          PROPOSED DEVICE PATH
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["01", "Input", "Mechanical, thermal, or magnetic perturbation"],
            [
              "02",
              "Coupling",
              "Proposed interaction among integrated constituents",
            ],
            ["03", "Readout", "Electrical or optical signal to be measured"],
            ["04", "Verification", "Repeatable performance against controls"],
          ].map(([number, title, copy]) => (
            <article
              key={number}
              className="rounded-lg border border-green-400/20 bg-black/35 p-5"
            >
              <p className="font-mono text-xs text-yellow-300">{number}</p>
              <h3 className="mt-3 font-bold text-green-300">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
