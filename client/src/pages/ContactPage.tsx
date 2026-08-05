import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';

const C = { gold: '#d8aa43', cream: '#f4f0e6', dark: '#050709', mid: '#070b0f' };

const CONTACT_METHODS = [
  {
    icon: '📅',
    label: 'Book a 30-Minute Call',
    value: 'calendly.com/aitconsult22/30min',
    href: 'https://calendly.com/aitconsult22/30min',
    cta: 'Schedule Now',
    primary: true,
  },
  {
    icon: '✉',
    label: 'Email',
    value: 'aitconsult22@gmail.com',
    href: 'mailto:aitconsult22@gmail.com',
    cta: 'Send Email',
    primary: false,
  },
  {
    icon: '☎',
    label: 'Phone',
    value: '(216) 307-0174',
    href: 'tel:+12163070174',
    cta: 'Call Now',
    primary: false,
  },
  {
    icon: '⌥',
    label: 'GitHub',
    value: 'github.com/HeruAhmose',
    href: 'https://github.com/HeruAhmose',
    cta: 'View Code',
    primary: false,
  },
];

const AUDIENCE = [
  { role: 'Investors', copy: 'Seed-stage capital for Tamerian Materials, True Melange Φ, and TechBridge. Equity, SAFE, and grant structures available.' },
  { role: 'Co-packers & Manufacturers', copy: 'Seeking co-packing partners for Blue-Gold Daily RTD tea. Contact Carolina Beverage Group or reach out directly.' },
  { role: 'Research Partners', copy: 'Collaboration on hemp-derived carbon composite characterization, quantum sensing, and thermoelectric measurement.' },
  { role: 'Community Partners', copy: 'Host a TechBridge Digital Navigator hub in your facility. Low-lift partnership — TechBridge provides everything except the space.' },
];

export default function ContactPage() {
  // Load Calendly widget script
  useEffect(() => {
    const existing = document.getElementById('calendly-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.dark }}>

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
          <SovereignNebulaGL />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to top, #050709 20%, transparent 100%)' }} />
        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 lg:px-12 py-28">
          <motion.p className="ceremonial-label mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Reach the Organism
          </motion.p>
          <div className="overflow-hidden mb-2">
            <motion.h1 className="display-heading text-[clamp(3rem,7vw,6rem)]" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}>
              Let's build
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1 className="display-heading text-[clamp(3rem,7vw,6rem)]" style={{ color: C.gold, WebkitTextFillColor: C.gold }} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}>
              something sovereign.
            </motion.h1>
          </div>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* Contact Methods */}
      <section className="py-24 section-deep">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {CONTACT_METHODS.map((m, i) => (
              <motion.a
                key={m.label}
                href={m.href}
                target={m.href.startsWith('http') ? '_blank' : undefined}
                rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block border p-6 group transition-all duration-300 gold-shimmer depth-card-3d"
                style={{ borderColor: m.primary ? 'rgba(216,170,67,0.5)' : 'rgba(216,170,67,0.12)', background: m.primary ? 'rgba(216,170,67,0.05)' : 'transparent' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ borderColor: 'rgba(216,170,67,0.6)', background: 'rgba(216,170,67,0.08)' }}
              >
                <div className="text-2xl mb-4 text-[#d8aa43]">{m.icon}</div>
                <p className="text-xs font-mono text-[#f4f0e6]/40 tracking-[0.15em] uppercase mb-2">{m.label}</p>
                <p className="text-sm font-sans text-[#f4f0e6]/70 mb-4 break-all">{m.value}</p>
                <span className="text-xs font-mono text-[#d8aa43] tracking-[0.12em] uppercase group-hover:text-[#f4f0e6] transition-colors">
                  {m.cta} →
                </span>
              </motion.a>
            ))}
          </div>

          {/* Calendly Inline Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="ceremonial-label mb-8">Schedule a Conversation</p>
            <div
              className="calendly-inline-widget w-full"
              data-url="https://calendly.com/aitconsult22/30min?hide_gdpr_banner=1&background_color=050709&text_color=f4f0e6&primary_color=d8aa43"
              style={{ minWidth: 320, height: 700 }}
            />
          </motion.div>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* Audience Gateways */}
      <section className="py-24 sovereign-bg">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.p className="ceremonial-label mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Who Should Reach Out
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-8">
            {AUDIENCE.map((a, i) => (
              <motion.div
                key={a.role}
                className="border border-[#d8aa43]/12 p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="display-heading text-xl mb-4" style={{ color: C.gold, WebkitTextFillColor: C.gold }}>{a.role}</h3>
                <p className="text-[#f4f0e6]/55 font-sans leading-relaxed text-sm">{a.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* Footer CTA */}
      <section className="py-24 text-center" style={{ background: C.dark }}>
        <div className="max-w-[600px] mx-auto px-6">
          <motion.p className="ceremonial-label mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Jonathan Peoples
          </motion.p>
          <motion.p className="text-[#f4f0e6]/40 font-sans text-sm leading-relaxed" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            U.S. Navy Veteran (OEF) · CompTIA A+ · CompTIA Tech+ · 14+ Certifications<br />
            Concord, NC · Tamerian Renaissance Alliance Initiative
          </motion.p>
          <motion.div className="mt-12 pt-12 border-t border-[#d8aa43]/10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <p className="text-[#f4f0e6]/25 text-xs font-mono tracking-[0.15em] uppercase mb-4">Experience Controls</p>
            <button
              onClick={() => {
                try { localStorage.removeItem('trai_visit_count'); } catch {}
                window.location.href = '/';
              }}
              className="text-xs font-mono text-[#d8aa43]/50 tracking-[0.12em] uppercase hover:text-[#d8aa43] transition-colors border border-[#d8aa43]/15 px-4 py-2 hover:border-[#d8aa43]/40"
            >
              ↺ Re-experience the entrance
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
