import { motion } from "framer-motion";
import TechMinutesDashboard from "@/components/TechMinutesDashboard";
import { SovereignNebulaGL } from "@/components/SovereignNebulaGL";

const pillars = [
  {
    title: "Proposed Help Desks",
    color: "border-cyan text-cyan",
    copy: "The pilot model proposes recurring in-person digital navigation with paid Navigators. No active hub or partner commitment is represented here.",
  },
  {
    title: "Deterministic H.K. Triage",
    color: "border-gold text-gold",
    copy: "The TechBridge runtime uses bounded in-browser decision logic for step-by-step routing. It does not request credentials or replace a human Navigator.",
  },
  {
    title: "Proposed TechMinutes® Reporting",
    color: "border-lime-500 text-lime-500",
    copy: "The measurement design records minutes, issue category, and resolution status without personal information. No live outcome dataset is represented.",
  },
];

const hubPlan = [
  {
    name: "Durham-area host target",
    stage: "PROPOSED YEAR 1",
    hours: "4–8 hrs/wk target",
  },
  {
    name: "Raleigh-area host target",
    stage: "PROPOSED YEAR 1",
    hours: "4–8 hrs/wk target",
  },
  {
    name: "Third host target",
    stage: "PROPOSED YEAR 2",
    hours: "Site not selected",
  },
  {
    name: "Fourth host target",
    stage: "PROPOSED YEAR 2",
    hours: "Site not selected",
  },
];

export default function CommunityImpact() {
  return (
    <div className="relative min-h-screen" style={{ background: "#050709" }}>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <SovereignNebulaGL variant="emerald" />
      </div>

      <div className="relative z-[1]">
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
              Hands organ · designed pilot model
            </p>
            <h1 className="text-5xl font-bold text-foreground md:text-6xl">
              <span className="neon-text text-primary">
                TECHBRIDGE COLLECTIVE
              </span>
            </h1>
            <p className="text-2xl text-cyan">
              Building Bridges of Digital Access
            </p>
            <p className="max-w-3xl text-xl text-foreground/80">
              A planned, community-based digital-navigation model for North
              Carolina. The source record cites 1.2 million residents lacking
              adequate digital access and proposes a staged Triangle-area pilot.
            </p>
            <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["Current state", "Designed · not operating"],
                ["Achieved outcomes", "0 represented"],
                ["Host commitments", "None represented"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-primary/25 bg-black/30 p-4"
                >
                  <p className="text-xs uppercase tracking-wider text-foreground/50">
                    {label}
                  </p>
                  <p className="mt-2 font-semibold text-primary">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto border-t border-border px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-3 text-2xl font-bold text-foreground">
              THREE-PILLAR PILOT MODEL
            </h2>
            <p className="mb-8 max-w-3xl text-foreground/65">
              Every element below is a design commitment or validation target
              until an operating pilot produces verifiable records.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map(pillar => (
                <article
                  key={pillar.title}
                  className={`rounded-lg border p-6 ${pillar.color.split(" ")[0]}`}
                >
                  <h3
                    className={`mb-3 text-lg font-bold ${pillar.color.split(" ")[1]}`}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {pillar.copy}
                  </p>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto border-t border-border px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="mb-3 text-2xl font-bold text-foreground">
              PILOT PLANNING DASHBOARD
            </h2>
            <p className="mb-8 max-w-3xl text-foreground/65">
              Targets and measurement design only. This is not a live impact
              dashboard.
            </p>
            <TechMinutesDashboard isActive />
          </motion.div>
        </section>

        <section className="container mx-auto border-t border-border px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="mb-3 text-2xl font-bold text-foreground">
              PROPOSED HUB SEQUENCE
            </h2>
            <p className="mb-8 max-w-3xl text-foreground/65">
              Geographic targets do not name or imply committed host
              organizations.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {hubPlan.map(hub => (
                <article
                  key={hub.name}
                  className="rounded border border-border bg-card p-6 hover:border-primary"
                >
                  <h3 className="mb-2 font-bold text-foreground">{hub.name}</h3>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-primary">
                      {hub.stage}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {hub.hours}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto border-t border-border px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="max-w-3xl"
          >
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              H.K. DETERMINISTIC TRIAGE
            </h2>
            <p className="mb-6 text-foreground/80">
              Named for bridge builder Horace King, the TechBridge H.K.
              interface provides bounded routing and guidance between human
              visits. It is not a generative authority and does not claim
              completed service outcomes.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Step-by-step bounded guidance",
                "Portal navigation",
                "Human escalation paths",
                "No credential requests",
              ].map(feature => (
                <div
                  key={feature}
                  className="rounded border border-border bg-card p-4 font-semibold text-foreground"
                >
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto border-t border-border px-4 py-16 text-center">
          <h2 className="mb-5 text-3xl font-bold text-foreground">
            Review the TechBridge public experience
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-foreground/70">
            The dedicated site carries the current pilot design, H.K. runtime,
            and participation paths.
          </p>
          <a
            href="https://techbridge-collective.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded bg-primary px-8 py-3 font-mono text-sm tracking-widest text-background transition-colors hover:bg-primary/80"
          >
            OPEN TECHBRIDGE
          </a>
        </section>
      </div>
    </div>
  );
}
