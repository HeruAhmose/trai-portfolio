import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeuralNetworkViz } from "./NeuralNetworkViz";
import { QuantumComputingViz } from "./QuantumComputingViz";
import { BlockchainVisualization } from "./BlockchainVisualization";
import { DNAHelix } from "./DNAHelix";
import { AdvancedPhysicsSimulation } from "./AdvancedPhysicsSimulation";
import AMCVisualization from "./AMCVisualization";

interface OrganData {
  num: string;
  role: string;
  name: string;
  desc: string;
  route: string;
  external?: string | null;
}

interface Props {
  organ: OrganData | null;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

const ORGAN_CONTENT: Record<
  string,
  {
    tagline: string;
    facts: string[];
    status: string;
    statusColor: string;
    viz: React.ReactNode;
    color: string;
  }
> = {
  "01": {
    tagline: "The structural foundation. Where carbon becomes sovereignty.",
    facts: [
      "U.S. Patent App 63/934,269 · Filed Dec 11, 2025 · 25 Claims",
      "Confirmation #6305 · Micro Entity · Jonathan Peoples, inventor",
      "Hemp-Carbon Matrix: 40–70 vol%, pyrolysis 700–1400°C",
      "Conductivity: 10²–10⁶ S/m (vs. copper: 5.8×10⁷)",
      "Piezoelectric output: 50–500 μW/cm² (proposed)",
      "Thermoelectric ZT: 1.0–2.5 target (vs. Bi₂Te₃ baseline)",
      "Quantum coherence T₂ > 500 ns at 300K (research target)",
      "51 peer-reviewed papers cited in validation framework",
    ],
    status: "U.S. Provisional Filed · Research Stage",
    statusColor: "#c87941",
    viz: <AMCVisualization isActive={true} />,
    color: "#c87941",
  },
  "02": {
    tagline: "What the organism metabolizes. The daily ritual of sovereignty.",
    facts: [
      "First SKU: Blue-Gold Daily — 12 oz RTD tea, $7–10 tier",
      "Affron® 28 mg/day (Pharmactive) · ISO 3632 Cat I standardized",
      "Lepticrosalides® ≥3.5% · US Patent 10933110B2",
      "Hemp: hempseed oil + protein only (GRAS GRN 765/771/778)",
      "No CBD · No THC · No flower/leaf derivatives",
      "Colorant: Galdieria extract blue (21 CFR 73.167)",
      "Claims: mood support, focus, antioxidant status, stress resilience",
      "DTC-first · Co-packer outreach: Carolina Beverage Group, Mooresville NC",
    ],
    status: "Formulation Stage · Pre-Launch",
    statusColor: "#d8aa43",
    viz: <DNAHelix interactive={true} />,
    color: "#d8aa43",
  },
  "03": {
    tagline:
      "Human-authorized intelligence. The nervous system of the organism.",
    facts: [
      "Flask/React stack · Triple-core: Cyber Core, Identity Core, Markets Core",
      "Public command experience is a demo, not delegated operational authority",
      "Actions remain human-authorized and evidence-bound",
      "Live at heruahmose.github.io/QueenCalifia-CyberAI/",
      "TechBridge H.K. uses deterministic, bounded in-browser triage",
      "Named for Queen Califia — the legendary Black Amazon queen of California",
    ],
    status: "Live Command Demo · Active Development",
    statusColor: "#4a9eff",
    viz: <NeuralNetworkViz />,
    color: "#4a9eff",
  },
  "04": {
    tagline: "The blood vessels. Moving what the heart makes.",
    facts: [
      "Last-mile logistics and community access infrastructure",
      "Resilient distribution routes for TRAI organ products",
      "Community mobility sovereignty — not extraction, circulation",
      "Designed to serve the Triangle Area (Durham, Raleigh, Chapel Hill)",
      "Coordinates with TechBridge for digital access delivery",
      "Employee-ownership pathway built into operating structure",
    ],
    status: "Concept Stage · Structuring",
    statusColor: "#e85d3a",
    viz: <AdvancedPhysicsSimulation />,
    color: "#e85d3a",
  },
  "05": {
    tagline: "The skin that carries memory. Identity as sovereignty.",
    facts: [
      "Hemp-derived apparel and cultural expression platform",
      "Employee-ownership pathways built into the business model",
      "Cultural memory encoded in material — not just fashion",
      "Melanin as architecture, not aesthetic",
      "Coordinates with True Mélange Φ on hemp supply chain",
      "Community co-design model — not top-down product development",
    ],
    status: "Concept Stage · Designing",
    statusColor: "#9b59b6",
    viz: <QuantumComputingViz />,
    color: "#9b59b6",
  },
  "06": {
    tagline: "The hands that build bridges. Digital access as a right.",
    facts: [
      "1.2M NC residents lack adequate broadband access (NCDIT 2023)",
      "$250K planned investment across a 2-year pilot model",
      "Targets: Year 1, 2 hubs and 4 Navigators · Year 2, 4 hubs",
      "Two-year service target: 3,200 residents; not an achieved outcome",
      "Illustrative unit economics: ~$31 then ~$21 per TechMinute",
      "Budget assumption: Navigator pay $20/hr · 55% payroll / 45% ops",
      "Deterministic H.K. triage · Named for Horace King",
      "Contact: aitconsult22@gmail.com · (216) 307-0174",
    ],
    status: "Designed · Pilot Not Yet Operating",
    statusColor: "#2ecc71",
    viz: <BlockchainVisualization blockCount={6} />,
    color: "#2ecc71",
  },
  "07": {
    tagline: "Regenerative return requires written governance and evidence.",
    facts: [
      "States that it operates under §508(c)(1)(A)",
      "No IRS determination or recognition letter is represented",
      "Designed to receive defined charitable allocations from TRAI",
      "Intended programs include bereavement, violence interruption, and youth athletics",
      "Digital navigation coordination with TechBridge is planned",
      "Community wellbeing support is an intended program area",
      "Allocations subject to written agreements and counsel review",
    ],
    status: "Operating Position Stated · No IRS Determination Represented",
    statusColor: "#d8aa43",
    viz: <AMCVisualization isActive={true} />,
    color: "#d8aa43",
  },
};

export function OrganPortal({ organ, onClose, onNavigate }: Props) {
  const content = organ ? ORGAN_CONTENT[organ.num] : null;
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  /* Scroll lock, focus capture, and focus restore on close. Without the
     restore, a keyboard user is dropped at the top of the document every time
     they close a portal. */
  useEffect(() => {
    if (!organ) return;
    restoreTo.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => panelRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(id);
      restoreTo.current?.focus?.();
    };
  }, [organ]);

  /* Escape closes; Tab is trapped inside the panel. A modal that lets focus
     escape behind the backdrop is worse than no modal. */
  useEffect(() => {
    if (!organ) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0],
        last = f[f.length - 1];
      if (!panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [organ, onClose]);

  return (
    <AnimatePresence>
      {organ && content && (
        <motion.div
          key="organ-portal"
          role="dialog"
          aria-modal="true"
          aria-label={organ.name + " — " + organ.role}
          className="fixed inset-0 z-[200] flex items-stretch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "rgba(3,4,6,0.96)",
              backdropFilter: "blur(24px)",
            }}
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Portal content */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="relative z-10 w-full flex flex-col lg:flex-row overflow-y-auto outline-none"
            initial={{ scale: 0.94, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Left: Visualization */}
            <div
              className="lg:w-[55%] relative flex items-center justify-center min-h-[320px] lg:min-h-screen overflow-hidden"
              style={{
                background: `radial-gradient(ellipse at 40% 50%, ${content.color}12 0%, #030406 70%)`,
              }}
            >
              {/* Accent border */}
              <div
                className="absolute inset-y-0 right-0 w-px"
                style={{
                  background: `linear-gradient(180deg, transparent, ${content.color}40, transparent)`,
                }}
              />
              <div className="w-full h-full min-h-[400px] p-8">
                {content.viz}
              </div>
              {/* Organ number watermark */}
              <div
                className="absolute bottom-8 left-8 text-[8rem] font-bold leading-none pointer-events-none select-none"
                style={{ color: `${content.color}08`, fontFamily: "serif" }}
              >
                {organ.num}
              </div>
            </div>

            {/* Right: Content */}
            <div
              className="lg:w-[45%] flex flex-col justify-between p-8 lg:p-12 overflow-y-auto"
              style={{ background: "#030406" }}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-mono tracking-[0.2em] uppercase"
                      style={{ color: `${content.color}80` }}
                    >
                      {organ.num} · {organ.role}
                    </span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 border"
                      style={{
                        borderColor: `${content.statusColor}40`,
                        color: content.statusColor,
                      }}
                    >
                      {content.status}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#f4f0e6]/30 hover:text-[#f4f0e6]/70 transition-colors text-xl leading-none"
                    aria-label="Close portal"
                  >
                    ✕
                  </button>
                </div>

                <h2
                  className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4 leading-tight"
                  style={{
                    color: "#f4f0e6",
                    fontFamily: '"Cormorant Garamond", serif',
                  }}
                >
                  {organ.name}
                </h2>
                <p
                  className="text-lg font-sans mb-8 leading-relaxed"
                  style={{ color: content.color }}
                >
                  {content.tagline}
                </p>

                {/* Facts */}
                <div className="space-y-3 mb-10">
                  {content.facts.map((fact, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-3 items-start"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + i * 0.06,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      <div
                        className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                        style={{ background: content.color }}
                      />
                      <p className="text-sm font-sans text-[#f4f0e6]/55 leading-relaxed">
                        {fact}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex flex-wrap gap-3 pt-6 border-t"
                style={{ borderColor: `${content.color}15` }}
              >
                <motion.button
                  onClick={() => {
                    onClose();
                    onNavigate(organ.route);
                  }}
                  className="flex-1 min-w-[140px] py-3.5 text-sm font-sans font-bold tracking-[0.1em] uppercase"
                  style={{ background: content.color, color: "#050709" }}
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Enter {organ.name} →
                </motion.button>
                {organ.external && (
                  <motion.a
                    href={organ.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] py-3.5 text-sm font-sans font-bold tracking-[0.1em] uppercase text-center border transition-colors"
                    style={{
                      borderColor: `${content.color}40`,
                      color: content.color,
                    }}
                    whileHover={{
                      borderColor: content.color,
                      background: `${content.color}10`,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Live Site ↗
                  </motion.a>
                )}
                <motion.button
                  onClick={onClose}
                  className="py-3.5 px-4 text-sm font-mono text-[#f4f0e6]/25 hover:text-[#f4f0e6]/50 transition-colors"
                  whileTap={{ scale: 0.97 }}
                >
                  ← Back
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
