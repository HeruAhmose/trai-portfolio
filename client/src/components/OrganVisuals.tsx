import { motion } from "framer-motion";

const VESSEL_NODES = [
  { x: 14, y: 50, label: "SOURCE" },
  { x: 34, y: 28, label: "HUB" },
  { x: 36, y: 72, label: "HUB" },
  { x: 61, y: 22, label: "ROUTE" },
  { x: 63, y: 51, label: "ROUTE" },
  { x: 61, y: 80, label: "ROUTE" },
  { x: 86, y: 50, label: "LAST MILE" },
] as const;

const VESSEL_LINKS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  [3, 6],
  [4, 6],
  [5, 6],
] as const;

export function VesselNetworkVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="relative overflow-hidden border border-[#1f66ad]/30 bg-[#06101d]"
      style={{ minHeight: compact ? 260 : 390 }}
      aria-label="Abstract logistics network representing Mela Nation as the vessels of the TRAI organism"
      role="img"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(31,102,173,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(31,102,173,.12) 1px,transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vessel-line" x1="0" x2="1">
            <stop offset="0" stopColor="#1f66ad" stopOpacity="0.25" />
            <stop offset="0.55" stopColor="#6ea8da" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f0cc79" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {VESSEL_LINKS.map(([from, to], index) => (
          <motion.line
            key={`${from}-${to}`}
            x1={VESSEL_NODES[from].x}
            y1={VESSEL_NODES[from].y}
            x2={VESSEL_NODES[to].x}
            y2={VESSEL_NODES[to].y}
            stroke="url(#vessel-line)"
            strokeWidth="0.65"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07, duration: 0.7 }}
          />
        ))}
      </svg>

      {VESSEL_NODES.map((node, index) => (
        <motion.div
          key={`${node.label}-${index}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, scale: 0.55 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 + index * 0.07 }}
        >
          <div className="mx-auto h-3 w-3 rounded-full border border-[#6ea8da] bg-[#1f66ad] shadow-[0_0_24px_rgba(110,168,218,.8)]" />
          {!compact && (
            <span className="mt-2 block whitespace-nowrap font-mono text-[8px] tracking-[0.18em] text-[#9bc7ee]/60">
              {node.label}
            </span>
          )}
        </motion.div>
      ))}

      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.24em] text-[#6ea8da]/70">
            ORGAN 04 /// VESSELS
          </p>
          <p className="mt-1 max-w-sm text-sm text-[#f4f0e6]/60">
            Goods, access, and opportunity move through resilient routes instead of a material-science lattice.
          </p>
        </div>
        <div className="hidden sm:block font-mono text-[9px] text-[#f0cc79]/45">
          ORIGIN → HUB → ROUTE → LAST MILE
        </div>
      </div>
    </div>
  );
}

const WEAVE = Array.from({ length: 12 }, (_, index) => index);

export function IdentityTextileVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="relative overflow-hidden border border-[#d98758]/30 bg-[#140b0a]"
      style={{ minHeight: compact ? 260 : 400 }}
      aria-label="Abstract woven textile representing MeLaNiNa as the skin and identity layer of the TRAI organism"
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(217,135,88,.20),transparent_38%),radial-gradient(circle_at_30%_78%,rgba(240,204,121,.10),transparent_40%)]" />
      <div className="absolute inset-[8%] rotate-[-8deg] overflow-hidden opacity-90">
        <div className="absolute inset-0 grid grid-cols-12 gap-[3px]">
          {WEAVE.map(index => (
            <motion.div
              key={`warp-${index}`}
              className="h-full bg-gradient-to-b from-[#d98758]/15 via-[#d98758]/65 to-[#f0cc79]/20"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.035, duration: 0.65 }}
              style={{ transformOrigin: "top" }}
            />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-[3px] mix-blend-screen">
          {WEAVE.map(index => (
            <motion.div
              key={`weft-${index}`}
              className="w-full bg-gradient-to-r from-transparent via-[#f0cc79]/45 to-[#d98758]/15"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + index * 0.035, duration: 0.65 }}
              style={{ transformOrigin: index % 2 === 0 ? "left" : "right" }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute right-[12%] top-[14%] h-[46%] w-[30%] rounded-[48%_52%_45%_55%] border border-[#f0cc79]/45"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.8 }}
        style={{
          background:
            "linear-gradient(145deg,rgba(217,135,88,.22),rgba(240,204,121,.04))",
          boxShadow: "inset 0 0 50px rgba(217,135,88,.12),0 0 60px rgba(217,135,88,.08)",
        }}
        aria-hidden="true"
      />

      <div className="absolute bottom-5 left-5 right-5">
        <p className="font-mono text-[10px] tracking-[0.24em] text-[#d98758]/75">
          ORGAN 05 /// SKIN
        </p>
        <p className="mt-1 max-w-md text-sm text-[#f4f0e6]/60">
          Woven hemp, cultural expression, and material identity — a protective interface, not a DNA diagram.
        </p>
      </div>
    </div>
  );
}
