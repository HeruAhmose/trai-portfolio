import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const organs = [
  { index: "01", organ: "SKELETON", name: "Tamerian Materials", function: "Material sovereignty", accent: "#56e2d0", href: "https://tamerian-materials.com/", signal: "MATTER" },
  { index: "02", organ: "HEART", name: "True Mélange Φ", function: "Biological sovereignty", accent: "#d6a33a", href: "https://heruahmose.github.io/blue-gold-daily/layers.html", signal: "NOURISH" },
  { index: "03", organ: "BRAIN", name: "Queen Califia", function: "Cognitive sovereignty", accent: "#7dd3fc", href: "https://queencalifia-cyberai.web.app/", signal: "INTERPRET" },
  { index: "04", organ: "VESSELS", name: "Mela Nation", function: "Mobility sovereignty", accent: "#f59e0b", href: "#portfolio", signal: "MOVE" },
  { index: "05", organ: "SKIN", name: "MeLaNiNa", function: "Identity sovereignty", accent: "#f5a6c8", href: "#portfolio", signal: "EXPRESS" },
  { index: "06", organ: "HANDS", name: "TechBridge Collective", function: "Community reach", accent: "#86c89b", href: "https://techbridge-collective.org/", signal: "ENABLE" },
  { index: "07", organ: "LYMPHATIC", name: "Peoples Foundation", function: "Regenerative return", accent: "#c7b6ff", href: "#portfolio", signal: "RETURN" },
] as const;

export default function EstateConstellation() {
  const reduce = !!useReducedMotion();
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black/25 px-4 py-24" data-trai-estate-constellation="v1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(218,165,32,.08),transparent_26%),radial-gradient(circle_at_50%_48%,transparent_0_34%,rgba(34,139,34,.035)_35%,transparent_36%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-afro-gold/80">TRAI ESTATE /// CIVILIZATION SYSTEMS</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-[.96] tracking-tight md:text-6xl">Seven organs. Different functions. One operating estate.</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/68 md:text-lg">
              TRAI is presented as an interdependent portfolio rather than a pile of ventures. Matter, nourishment, intelligence, mobility, identity, community reach, and regenerative return each solve a different systems problem while exchanging context through the same estate.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-lg">
              {["7 ORGANS", "1 ESTATE", "SHARED MEMORY"].map((item, i) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-4">
                  <div className="font-mono text-[9px] tracking-[0.16em] text-afro-gold/75">0{i + 1}</div>
                  <div className="mt-1 font-mono text-[9px] tracking-[0.11em] text-foreground/70">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[44rem]">
            <motion.div className="absolute inset-[12%] rounded-full border border-afro-gold/15" animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 48, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute inset-[27%] rounded-full border border-afro-emerald/15" animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 36, repeat: Infinity, ease: "linear" }} />
            <div className="absolute inset-[39%] flex items-center justify-center rounded-full border border-afro-gold/25 bg-black/55 shadow-[0_0_80px_rgba(218,165,32,.12)] backdrop-blur-xl">
              <div className="text-center"><div className="font-mono text-[9px] tracking-[0.28em] text-afro-gold/75">ESTATE CORE</div><div className="mt-2 text-2xl font-black tracking-[.12em] text-foreground">TRAI</div></div>
            </div>
            {organs.map((item, index) => {
              const angle = (index / organs.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 42;
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group absolute w-[9.4rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-black/72 p-3 backdrop-blur-xl md:w-[10.5rem]"
                  style={{ left: `${x}%`, top: `${y}%`, borderColor: `${item.accent}33`, boxShadow: `0 18px 46px ${item.accent}0d` }}
                  whileHover={reduce ? undefined : { scale: 1.055, y: -3 }}
                >
                  <div className="flex items-start justify-between gap-2"><span className="font-mono text-[8px] tracking-[0.16em]" style={{ color: item.accent }}>{item.index} / {item.organ}</span><ArrowUpRight className="h-3 w-3 text-white/25 transition group-hover:text-white/65" /></div>
                  <h3 className="mt-2 text-sm font-bold leading-tight text-white/88">{item.name}</h3>
                  <p className="mt-1 text-[10px] leading-snug text-white/45">{item.function}</p>
                  <div className="mt-3 flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full" style={{ background: item.accent, boxShadow: `0 0 12px ${item.accent}` }} /><span className="font-mono text-[8px] tracking-[0.15em] text-white/35">{item.signal}</span></div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
