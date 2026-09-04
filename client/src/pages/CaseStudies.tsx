import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, ShieldCheck } from "lucide-react";
import CaseStudyCard from "@/components/CaseStudyCard";
import { useAudioSystem } from "@/hooks/useAudioSystem";

interface CaseStudy {
  id: string;
  title: string;
  category: "cybersecurity" | "materials" | "community" | "research";
  client?: string;
  timeline: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }>;
  tags: string[];
  results: Array<{
    title: string;
    description: string;
  }>;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "queen-califia-command-demo",
    title: "Queen Califia Command-Demo Validation Plan",
    category: "cybersecurity",
    client: "Queen Califia · TRAI brain organ",
    timeline: "Public demo · active development",
    challenge:
      "A cybersecurity command surface must help a human review evidence without silently acquiring authority or presenting simulated detections as operational security coverage.",
    solution:
      "Keep every consequential action human-authorized and evidence-bound. Treat the public experience as an interface demo, require provenance for claims, and preserve an explicit boundary between recommendation and execution.",
    impact:
      "The repository documents the intended control model. It does not represent production deployment, autonomous remediation, client outcomes, certifications, or measured security performance.",
    metrics: [
      {
        label: "Authority model",
        value: "Human",
        icon: "✋",
        color: "primary",
      },
      {
        label: "Evidence gate",
        value: "Required",
        icon: "🔎",
        color: "cyan-400",
      },
      {
        label: "Public surface",
        value: "1 demo",
        icon: "🖥️",
        color: "yellow-400",
      },
      {
        label: "Measured outcomes",
        value: "0 represented",
        icon: "—",
        color: "green-400",
      },
    ],
    tags: [
      "Human authorization",
      "Evidence boundary",
      "Public demo",
      "No delegated authority",
    ],
    results: [
      {
        title: "Documented now",
        description:
          "A public command-interface demo and evidence-governed operating doctrine.",
      },
      {
        title: "Not represented",
        description:
          "Production coverage, autonomous action, customer deployment, or performance outcomes.",
      },
      {
        title: "Required next gate",
        description:
          "Authorized environment testing with sourced evidence and auditable operator approval.",
      },
      {
        title: "Public reference",
        description:
          "The canonical GitHub Pages experience is linked from the Queen Califia organ page.",
      },
    ],
  },
  {
    id: "tamerian-integrated-composite",
    title: "Tamerian Integrated-Composite Validation Plan",
    category: "materials",
    client: "Tamerian Materials · TRAI skeleton organ",
    timeline: "Provisional filed December 11, 2025",
    challenge:
      "The architecture proposes coupling bio-derived carbon with crystalline and magnetic constituents, but constituent-level literature cannot substitute for measured performance of the integrated composite.",
    solution:
      "Use the cited literature to define falsifiable tests, then execute structural, electromechanical, magnetic, optical, and system-level characterization with recorded methods and controls.",
    impact:
      "One U.S. provisional application and a literature-grounded validation framework are documented. Integrated performance, lifecycle benefit, biocompatibility, and manufacturability remain unvalidated.",
    metrics: [
      {
        label: "Provisional filings",
        value: "1",
        icon: "📄",
        color: "primary",
      },
      {
        label: "Application claims",
        value: "25",
        icon: "§",
        color: "cyan-400",
      },
      { label: "Papers cited", value: "51", icon: "📚", color: "yellow-400" },
      {
        label: "Integrated outcomes",
        value: "Pending",
        icon: "◇",
        color: "green-400",
      },
    ],
    tags: [
      "Bio-derived carbon",
      "Provisional application",
      "Falsifiable tests",
      "Unvalidated system",
    ],
    results: [
      {
        title: "Documented now",
        description:
          "U.S. Provisional Application 63/934,269 with 25 application claims.",
      },
      {
        title: "Evidence base",
        description:
          "Fifty-one cited papers support constituent-level rationale, not integrated results.",
      },
      {
        title: "Required next gate",
        description:
          "Independent, reproducible measurements across the planned validation phases.",
      },
      {
        title: "Claims boundary",
        description:
          "No granted patent, production readiness, or measured device performance is represented.",
      },
    ],
  },
  {
    id: "techbridge-pilot-model",
    title: "TechBridge Two-Year Pilot Model",
    category: "community",
    client: "TechBridge Collective · TRAI hands organ",
    timeline: "Designed · pilot not operating",
    challenge:
      "Digital navigation needs consistent human help, safe between-visit guidance, privacy boundaries, and reporting that distinguishes targets from delivered outcomes.",
    solution:
      "Pair proposed weekly help desks and paid Digital Navigators with deterministic, bounded H.K. triage and non-PII TechMinutes reporting. Validate the model through a deliberately staged pilot.",
    impact:
      "The two-year service and hub figures are planning targets. TRAI does not represent active hubs, completed sessions, residents served, resolution rates, or partner commitments.",
    metrics: [
      { label: "Year 1 hub target", value: "2", icon: "①", color: "primary" },
      { label: "Year 2 hub target", value: "4", icon: "②", color: "cyan-400" },
      {
        label: "2-year service target",
        value: "3,200",
        icon: "◎",
        color: "yellow-400",
      },
      {
        label: "Achieved outcomes",
        value: "0 represented",
        icon: "—",
        color: "green-400",
      },
    ],
    tags: ["Pilot design", "Deterministic H.K.", "Human-first", "Targets only"],
    results: [
      {
        title: "Documented now",
        description:
          "A two-year pilot model, proposed hub sequence, and service target.",
      },
      {
        title: "Runtime boundary",
        description:
          "TechBridge H.K. uses deterministic in-browser triage and does not request credentials.",
      },
      {
        title: "Required next gate",
        description:
          "Confirmed host agreements, trained navigators, live sessions, and privacy-safe measurement.",
      },
      {
        title: "Claims boundary",
        description:
          "No active hub network or achieved service outcome is represented.",
      },
    ],
  },
  {
    id: "amc-evidence-program",
    title: "AMC Evidence Program",
    category: "research",
    client: "TRAI research record",
    timeline: "Preprint public · not peer reviewed",
    challenge:
      "A system-level materials hypothesis needs tests that can disprove it, not visual simulations or constituent literature presented as experimental confirmation.",
    solution:
      "Preserve the preprint as a hypothesis record, distinguish cited work from original measurements, and sequence five planned validation phases with explicit pass/fail gates.",
    impact:
      "The public record contains a preprint and validation plan. It does not represent completed experiments, peer review, independent replication, or a validated integrated device.",
    metrics: [
      {
        label: "Validation phases",
        value: "5 planned",
        icon: "Ⅴ",
        color: "primary",
      },
      { label: "Papers cited", value: "51", icon: "📚", color: "cyan-400" },
      {
        label: "Peer-review status",
        value: "Not reviewed",
        icon: "◌",
        color: "yellow-400",
      },
      {
        label: "Measured outcomes",
        value: "0 represented",
        icon: "—",
        color: "green-400",
      },
    ],
    tags: [
      "Preprint",
      "Falsification",
      "Planned validation",
      "Evidence before claims",
    ],
    results: [
      {
        title: "Documented now",
        description:
          "A public hypothesis record, references, and five-phase validation sequence.",
      },
      {
        title: "Required next gate",
        description:
          "Instrumented testing with methods, controls, uncertainty, and reproducible data.",
      },
      {
        title: "Publication boundary",
        description: "The TRAI preprint has not been peer reviewed.",
      },
      {
        title: "Claims boundary",
        description:
          "No integrated performance figure is presented as a measured result.",
      },
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All plans", count: CASE_STUDIES.length },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    count: CASE_STUDIES.filter(item => item.category === "cybersecurity")
      .length,
  },
  {
    id: "materials",
    label: "Materials",
    count: CASE_STUDIES.filter(item => item.category === "materials").length,
  },
  {
    id: "community",
    label: "Community",
    count: CASE_STUDIES.filter(item => item.category === "community").length,
  },
  {
    id: "research",
    label: "Research",
    count: CASE_STUDIES.filter(item => item.category === "research").length,
  },
];

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const { playClickSound } = useAudioSystem();

  const filteredCases = useMemo(() => {
    if (selectedCategory === "all") return CASE_STUDIES;
    return CASE_STUDIES.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    playClickSound();
    setSelectedCategory(categoryId);
    setExpandedCase(null);
  };

  const handleCaseToggle = (caseId: string) => {
    playClickSound();
    setExpandedCase(current => (current === caseId ? null : caseId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-background px-4 pb-20 pt-32">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <ShieldCheck className="mx-auto mb-4 text-primary" size={40} />
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            <span className="text-primary">Validation Plans</span>
            <span className="mx-2 text-foreground/60">·</span>
            <span className="text-cyan-400">Evidence Before Claims</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-foreground/70">
            These are governed plans and documented public states—not customer
            case studies or completed outcome reports. Each card separates what
            exists now from what still requires evidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-12 flex flex-wrap justify-center gap-2"
        >
          <div className="mr-4 flex items-center gap-2 text-foreground/70">
            <Filter size={20} />
            <span className="font-semibold">Filter:</span>
          </div>
          {CATEGORIES.map(category => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-primary to-primary/50 text-background shadow-lg shadow-primary/50"
                  : "border border-primary/30 bg-background/50 text-foreground hover:border-primary/60"
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-70">
                ({category.count})
              </span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          {filteredCases.map(caseStudy => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              isExpanded={expandedCase === caseStudy.id}
              onToggle={() => handleCaseToggle(caseStudy.id)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid gap-4 rounded-xl border border-primary/20 bg-background/30 p-6 md:grid-cols-4"
        >
          {[
            ["Governed plans", CASE_STUDIES.length],
            ["U.S. provisional filings", "1"],
            ["Papers cited", "51"],
            ["Measured outcomes represented", "0"],
          ].map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="mb-2 text-3xl font-bold text-primary">{value}</p>
              <p className="text-sm text-foreground/70">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
