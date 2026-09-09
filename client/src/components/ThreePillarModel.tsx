import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Pillar {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

const PILLARS: Pillar[] = [
  {
    id: "weekly-help",
    title: "Proposed Weekly Help Desk",
    description:
      "Pilot design for walk-in and scheduled 1:1 Navigator sessions",
    details: [
      "Target: 4–8 hours per week at a future community hub",
      "Model calls for paid Digital Navigators with ongoing training",
      "Human-first approach to technology assistance",
      "No credential access—we guide, we don't control",
    ],
    icon: "🤝",
  },
  {
    id: "hk-triage",
    title: "Deterministic H.K. Triage",
    description: "Bounded step-by-step routing between future visits",
    details: [
      "Named for Horace King, master bridge builder",
      "Deterministic in-browser guidance; no external model",
      "Never asks for credentials",
      "Routes you to the right portal",
      "Walks you through each step",
      "Escalates to human Navigator when needed",
    ],
    icon: "🤖",
  },
  {
    id: "techminutes",
    title: "TechMinutes® Reporting",
    description: "Proposed monthly non-PII impact reports",
    details: [
      "Would track assistance minutes per interaction",
      "Would aggregate issue categories and resolution status",
      "Privacy by design—no personal data stored",
      "Measurement begins only with an operating pilot",
      "Would support transparent stakeholder reporting",
    ],
    icon: "📊",
  },
];

export const ThreePillarModel: React.FC = () => {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const pillarVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Three Pillars</span>
            <span className="text-foreground/60 mx-2">·</span>
            <span className="text-cyan-400">One Bridge</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            A proposed model combining human expertise, deterministic guidance,
            and privacy-safe measurement. The pilot is not yet operating.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {PILLARS.map(pillar => (
            <motion.div
              key={pillar.id}
              variants={pillarVariants}
              className="group relative"
            >
              {/* Pillar Card */}
              <motion.div
                onClick={() =>
                  setExpandedPillar(
                    expandedPillar === pillar.id ? null : pillar.id
                  )
                }
                className="relative h-full cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                    expandedPillar === pillar.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/30"
                      : "border-primary/30 bg-background/50 hover:border-primary/60 hover:bg-background/70"
                  }`}
                  style={{
                    boxShadow:
                      expandedPillar === pillar.id
                        ? "0 0 30px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.1)"
                        : "none",
                  }}
                >
                  {/* Pillar Icon */}
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{
                      scale: expandedPillar === pillar.id ? 1.2 : 1,
                      rotate: expandedPillar === pillar.id ? 5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {pillar.icon}
                  </motion.div>

                  {/* Pillar Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {pillar.title}
                  </h3>

                  {/* Pillar Description */}
                  <p className="text-foreground/70 mb-4">
                    {pillar.description}
                  </p>

                  {/* Expand Indicator */}
                  <motion.div
                    animate={{ rotate: expandedPillar === pillar.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>

                {/* Expanded Details */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: expandedPillar === pillar.id ? 1 : 0,
                    height: expandedPillar === pillar.id ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="p-6 rounded-xl border border-primary/30 bg-background/50 backdrop-blur-sm">
                    <ul className="space-y-3">
                      {pillar.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 text-foreground/80"
                        >
                          <span className="text-primary font-bold mt-1">▸</span>
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Connection Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full mb-12"
          style={{ originX: 0 }}
        />

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            {
              emoji: "🔄",
              title: "Consistency target",
              desc: "The pilot model calls for a recurring time and place.",
            },
            {
              emoji: "🤝",
              title: "Human-First",
              desc: "H.K. routes; a human Navigator remains responsible.",
            },
            {
              emoji: "📊",
              title: "Measurement design",
              desc: "A future interaction would be recorded as TechMinutes®.",
            },
            {
              emoji: "🏢",
              title: "Proposed host model",
              desc: "A future host would provide space while TechBridge supplies the program.",
            },
            {
              emoji: "💰",
              title: "Paid Navigator model",
              desc: "The design calls for paid, trained staff rather than volunteers.",
            },
            {
              emoji: "🔒",
              title: "Privacy by Design",
              desc: "No PII. No credential access. We guide; we don't control.",
            },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + idx * 0.1, duration: 0.4 }}
              className="p-4 rounded-lg border border-primary/20 bg-background/30 hover:bg-background/50 transition-colors"
            >
              <div className="text-3xl mb-2">{value.emoji}</div>
              <h4 className="font-bold text-primary mb-1">{value.title}</h4>
              <p className="text-sm text-foreground/70">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ThreePillarModel;
