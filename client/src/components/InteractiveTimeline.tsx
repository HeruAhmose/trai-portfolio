import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  Milestone,
  ShieldCheck,
} from "lucide-react";

type TimelineCategory =
  "cybersecurity" | "materials" | "community" | "research" | "patent";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  category: TimelineCategory;
  dateLabel: string;
  evidenceStatus: string;
  markers: Record<string, string | number>;
  displayOrder: number;
}

const PORTFOLIO_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "provisional-filing",
    title: "U.S. Provisional Application Filed",
    description:
      "U.S. Provisional Application 63/934,269 records the proposed multi-constituent composite architecture and 25 application claims.",
    category: "patent",
    dateLabel: "December 11, 2025",
    evidenceStatus:
      "Documented filing. A provisional application is not a granted patent and does not establish measured performance.",
    markers: { Filing: "63/934,269", Claims: 25, Status: "Provisional" },
    displayOrder: 1,
  },
  {
    id: "amc-preprint",
    title: "AMC Hypothesis Record Published",
    description:
      "The public preprint sets out an architecture-driven hypothesis, cited rationale, and conditions that future experiments must test.",
    category: "research",
    dateLabel: "Public research record",
    evidenceStatus:
      "Preprint; not peer reviewed. Fifty-one cited papers support constituent-level rationale, not performance of the integrated composite.",
    markers: {
      "Papers cited": 51,
      "Planned phases": 5,
      "Peer review": "Not completed",
    },
    displayOrder: 2,
  },
  {
    id: "queen-command-demo",
    title: "Queen Califia Command Demo Published",
    description:
      "The public interface demonstrates a command-surface concept for evidence review, vulnerability triage, and explicitly authorized remediation.",
    category: "cybersecurity",
    dateLabel: "Current public state",
    evidenceStatus:
      "Human-authorized and evidence-bound demo. No autonomous authority, production coverage, customer deployment, or performance result is represented.",
    markers: { Authority: "Human", Evidence: "Required", Runtime: "Demo" },
    displayOrder: 3,
  },
  {
    id: "techbridge-pilot-design",
    title: "TechBridge Pilot Model Designed",
    description:
      "The two-year model combines proposed weekly help desks, paid Digital Navigators, deterministic H.K. triage, and non-PII TechMinutes reporting.",
    category: "community",
    dateLabel: "Current design state",
    evidenceStatus:
      "Pilot not operating. Hub counts and the 3,200-person service figure are targets, not achieved outcomes or partner commitments.",
    markers: {
      "Year 1 target": "2 hubs",
      "Year 2 target": "4 hubs",
      "Service target": "3,200",
    },
    displayOrder: 4,
  },
  {
    id: "integrated-validation",
    title: "Integrated Composite Validation",
    description:
      "Structural, electromechanical, magnetic, optical, and system-level testing must establish whether the integrated architecture performs as proposed.",
    category: "materials",
    dateLabel: "Next evidence gate",
    evidenceStatus:
      "Planned and pending. No completed phase, independent replication, lifecycle result, biocompatibility result, or integrated device metric is represented.",
    markers: {
      "Planned phases": 5,
      "Completed outcomes represented": 0,
      Status: "Pending",
    },
    displayOrder: 5,
  },
];

const categoryConfig: Record<
  TimelineCategory,
  { color: string; icon: React.ReactNode; label: string }
> = {
  cybersecurity: {
    color: "from-cyan-500 to-blue-600",
    icon: <ShieldCheck className="h-5 w-5" />,
    label: "Cybersecurity",
  },
  materials: {
    color: "from-yellow-500 to-orange-600",
    icon: <Milestone className="h-5 w-5" />,
    label: "Materials",
  },
  community: {
    color: "from-green-500 to-emerald-600",
    icon: <Milestone className="h-5 w-5" />,
    label: "Community",
  },
  research: {
    color: "from-purple-500 to-pink-600",
    icon: <BookOpen className="h-5 w-5" />,
    label: "Research",
  },
  patent: {
    color: "from-red-500 to-rose-600",
    icon: <FileText className="h-5 w-5" />,
    label: "Patent record",
  },
};

export default function InteractiveTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    TimelineCategory | "all"
  >("all");

  const filteredEvents = useMemo(() => {
    const matching =
      selectedCategory === "all"
        ? PORTFOLIO_TIMELINE_EVENTS
        : PORTFOLIO_TIMELINE_EVENTS.filter(
            event => event.category === selectedCategory
          );
    return [...matching].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [selectedCategory]);

  const categories: Array<TimelineCategory | "all"> = [
    "all",
    "patent",
    "research",
    "cybersecurity",
    "community",
    "materials",
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 bg-gradient-to-r from-primary via-cyan-400 to-yellow-400 bg-clip-text text-4xl font-bold text-transparent">
          Documented Record & Next Gates
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-foreground/70">
          A status record that separates filed or published facts from planned
          validation. Dates are shown only where the repository carries a
          documented date.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-12 flex flex-wrap justify-center gap-2"
      >
        {categories.map(category => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-lg px-4 py-2 font-semibold transition-all ${
              selectedCategory === category
                ? "bg-gradient-to-r from-primary to-cyan-500 text-background shadow-lg shadow-primary/50"
                : "border border-primary/30 bg-background/50 text-foreground hover:border-primary/60"
            }`}
          >
            {category === "all"
              ? "All records"
              : categoryConfig[category].label}
          </motion.button>
        ))}
      </motion.div>

      <div className="relative border-l border-primary/30 pl-6 sm:pl-10">
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => {
              const config = categoryConfig[event.category];
              const expanded = expandedId === event.id;

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <div
                    className={`absolute -left-[2.08rem] top-7 h-4 w-4 rounded-full bg-gradient-to-r shadow-lg shadow-primary/40 sm:-left-[2.82rem] ${config.color}`}
                    aria-hidden="true"
                  />
                  <motion.button
                    type="button"
                    onClick={() =>
                      setExpandedId(current =>
                        current === event.id ? null : event.id
                      )
                    }
                    whileHover={{ scale: 1.01 }}
                    className="w-full rounded-xl border border-primary/20 bg-background/40 p-6 text-left backdrop-blur-sm transition-colors hover:border-primary/50"
                    aria-expanded={expanded}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-lg bg-gradient-to-br p-2 ${config.color}`}
                          >
                            {config.icon}
                          </span>
                          <span
                            className={`bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent ${config.color}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {event.title}
                        </h3>
                        <div className="mt-3 flex items-center gap-2 text-sm text-foreground/60">
                          <Calendar className="h-4 w-4" />
                          <span>{event.dateLabel}</span>
                        </div>
                        <p className="mt-4 text-foreground/70">
                          {event.description}
                        </p>
                      </div>
                      <motion.span
                        animate={{ rotate: expanded ? 180 : 0 }}
                        className="mt-1 flex-shrink-0 text-primary"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </motion.span>
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-5 overflow-hidden border-t border-primary/20 pt-5"
                        >
                          <h4 className="mb-2 text-sm font-semibold text-primary">
                            Evidence status
                          </h4>
                          <p className="text-foreground/70">
                            {event.evidenceStatus}
                          </p>
                          <h4 className="mb-3 mt-5 text-sm font-semibold text-primary">
                            Documented markers
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {Object.entries(event.markers).map(
                              ([label, value]) => (
                                <span
                                  key={label}
                                  className="rounded-lg border border-primary/20 bg-background/60 p-3"
                                >
                                  <span className="block text-xs text-foreground/60">
                                    {label}
                                  </span>
                                  <span className="mt-1 block font-bold text-primary">
                                    {value}
                                  </span>
                                </span>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {[
          ["Record entries", PORTFOLIO_TIMELINE_EVENTS.length],
          ["Provisional filings", 1],
          ["Papers cited", 51],
          ["Measured outcomes represented", 0],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-primary/20 bg-background/40 p-4 text-center"
          >
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="mt-1 text-xs text-foreground/60">{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
