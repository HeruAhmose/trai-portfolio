import { motion } from "framer-motion";

interface TechMinutesDashboardProps {
  isActive: boolean;
}

const targets = [
  { label: "YEAR 1 HUB TARGET", value: "2", note: "Proposed, not active" },
  {
    label: "YEAR 2 HUB TARGET",
    value: "4",
    note: "Cumulative planning target",
  },
  {
    label: "TWO-YEAR SERVICE TARGET",
    value: "3,200",
    note: "People targeted, not served",
  },
  {
    label: "PLANNED TWO-YEAR INVESTMENT",
    value: "$250K",
    note: "Model figure, not funding received",
  },
];

const proposedFields = [
  ["TechMinutes®", "Minutes of assistance delivered"],
  ["Issue category", "A non-identifying service classification"],
  ["Resolution status", "Resolved, partial, or escalated"],
  ["Privacy boundary", "No credentials or personal information stored"],
];

export default function TechMinutesDashboard({
  isActive,
}: TechMinutesDashboardProps) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="rounded-lg border border-yellow-400/35 bg-yellow-400/5 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-yellow-300">
          Planning data · no live outcomes
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/75">
          These figures define the proposed pilot. They must not be read as
          active hubs, residents served, funding secured, resolution rates, or
          measured return on investment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {targets.map((target, index) => (
          <motion.article
            key={target.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded border border-primary/40 bg-card p-5"
          >
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground">
              {target.label}
            </p>
            <p className="my-3 text-3xl font-bold text-primary">
              {target.value}
            </p>
            <p className="text-xs text-foreground/60">{target.note}</p>
          </motion.article>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-2 font-bold text-foreground">
          PROPOSED MEASUREMENT SCHEMA
        </h3>
        <p className="mb-6 text-sm text-foreground/65">
          A future operating pilot would publish sourced aggregates only after
          collection and review.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {proposedFields.map(([label, description]) => (
            <div
              key={label}
              className="rounded border border-border bg-background p-4"
            >
              <p className="font-semibold text-primary">{label}</p>
              <p className="mt-1 text-sm text-foreground/70">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
