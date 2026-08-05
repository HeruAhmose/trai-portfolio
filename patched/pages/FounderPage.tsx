import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';
import React from 'react';
import { motion } from 'framer-motion';


const PHOTOS = {
  headshot: '/media/archive/founder-portrait.jpg',
  navyWhites: '/media/archive/navy-whites.jpg',
  footballSalisbury: '/media/archive/salisbury-44.jpg',
  trackKannapolis: '/media/archive/track-handoff.jpg',
  football2006: '/media/archive/maritime-portrait.jpg',
};

const C = {
  gold: '#d8aa43',
  cream: '#f4f0e6',
  dark: '#050709',
  mid: '#070b0f',
};

const TIMELINE = [
  {
    era: 'Origin',
    period: 'Salisbury, NC',
    title: 'Built on discipline.',
    copy: 'Jonathan Peoples grew up in Salisbury, North Carolina — a city with deep roots in Black American history. From the beginning, discipline was not optional. It was the foundation.',
    photo: PHOTOS.footballSalisbury,
    photoAlt: 'Jonathan Peoples, Salisbury #44',
    photoCaption: 'Salisbury High School, #44',
  },
  {
    era: 'Athletics',
    period: 'Kannapolis, NC',
    title: 'Speed. Precision. The baton passes.',
    copy: 'Track and football built the mental architecture that would later define the TRAI organism — the understanding that individual excellence only matters when it serves the team, and the team only matters when it serves the community.',
    photo: PHOTOS.trackKannapolis,
    photoAlt: 'Relay race, Kannapolis',
    photoCaption: 'Kannapolis relay — the baton passes',
  },
  {
    era: 'Service',
    period: 'U.S. Navy · Operation Enduring Freedom',
    title: 'Veteran. Operator. Builder.',
    copy: 'Jonathan served in the United States Navy during Operation Enduring Freedom (OEF). Military service forged the operational discipline, systems thinking, and commitment to mission that now drives every venture in the TRAI architecture.',
    photo: PHOTOS.navyWhites,
    photoAlt: 'Navy dress whites group photo',
    photoCaption: 'U.S. Navy — dress whites',
  },
  {
    era: 'Technology',
    period: 'Concord, NC · 2019–present',
    title: 'From service to sovereignty.',
    copy: 'After military service, Jonathan earned CompTIA A+, CompTIA Tech+, and 14+ technology certifications. He founded AIT Consulting LTD, then built the TRAI Sovereignty Architecture — seven ventures designed to circulate value within the Black American community rather than extract it.',
    photo: PHOTOS.headshot,
    photoAlt: 'Jonathan Peoples, founder portrait',
    photoCaption: 'Jonathan Peoples · Founder, TRAI',
  },
];

const CREDENTIALS = [
  'U.S. Navy Veteran · Operation Enduring Freedom (OEF)',
  'CompTIA A+ Certified',
  'CompTIA Tech+ Certified',
  '14+ Technology Certifications',
  'Patent Applicant · App 63/934,269 · 25 Claims',
  'Founder · AIT Consulting LTD',
  'Founder · TRAI Sovereignty Architecture',
  'GitHub: HeruAhmose · Concord, NC',
];

function TimelineSection({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: index % 2 === 0 ? C.dark : C.mid }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className={`grid lg:grid-cols-2 gap-20 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
          {/* Text */}
          <motion.div
            className={isEven ? '' : 'lg:col-start-2'}
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="ceremonial-label mb-4">{item.era} — {item.period}</p>
            <h2 className="display-heading text-[clamp(2rem,4vw,3.2rem)] mb-6">{item.title}</h2>
            <p className="text-lg text-[#f4f0e6]/60 font-sans leading-relaxed">{item.copy}</p>
          </motion.div>
          {/* Photo */}
          <motion.div
            className={`relative ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: item.photo === PHOTOS.footballSalisbury ? '9/16' : '4/3' }}>
              <img
                src={item.photo}
                alt={item.photoAlt}
                className="w-full h-full object-cover object-top"
                style={{ filter: item.photo === PHOTOS.footballSalisbury ? 'grayscale(100%) contrast(1.1)' : 'none' }}
              />
              {/* Gold overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: `linear-gradient(to top, ${C.dark}dd, transparent)` }} />
            </div>
            <p className="text-xs font-mono text-[#d8aa43]/50 mt-3 tracking-[0.15em]">{item.photoCaption}</p>
          </motion.div>
        </div>
      </div>
      <hr className="sovereign-rule mt-0" />
    </section>
  );
}

export default function FounderPage() {
  return (
    <div className="min-h-screen" style={{ background: C.dark }}>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <SovereignNebulaGL />
        {/* Large portrait — right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-2/5 overflow-hidden pointer-events-none">
          <img
            src={PHOTOS.headshot}
            alt="Jonathan Peoples"
            className="w-full h-full object-cover object-top"
            style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #050709 0%, transparent 50%)' }} />
        </div>
        {/* Text */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-32">
          <motion.p className="ceremonial-label mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            The Founder
          </motion.p>
          <div className="overflow-hidden mb-2">
            <motion.h1
              className="display-heading text-[clamp(3.5rem,8vw,7rem)]"
              initial={{ y: '110%' }} animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              Jonathan
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="display-heading text-[clamp(3.5rem,8vw,7rem)]"
              style={{ color: C.gold, WebkitTextFillColor: C.gold }}
              initial={{ y: '110%' }} animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              Peoples.
            </motion.h1>
          </div>
          <motion.p
            className="text-xl text-[#f4f0e6]/55 font-sans max-w-[440px] leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            U.S. Navy Veteran. Inventor. Architect of a sovereign economic system rooted in Black American excellence.
          </motion.p>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* Timeline sections */}
      {TIMELINE.map((item, i) => (
        <TimelineSection key={item.era} item={item} index={i} />
      ))}

      {/* Credentials */}
      <section className="py-32" style={{ background: C.mid }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="ceremonial-label mb-8">Credentials & Recognition</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {CREDENTIALS.map((c, i) => (
                <motion.div
                  key={c}
                  className="border border-[#d8aa43]/15 px-6 py-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <p className="text-sm font-mono text-[#d8aa43]/70">{c}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <hr className="sovereign-rule" />

      {/* Contact CTA */}
      <section className="py-32 text-center" style={{ background: C.dark }}>
        <div className="max-w-[600px] mx-auto px-6">
          <motion.p className="ceremonial-label mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Connect
          </motion.p>
          <motion.h2 className="display-heading text-[clamp(2rem,4vw,3.2rem)] mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Build something sovereign together.
          </motion.h2>
          <motion.div className="flex flex-wrap gap-6 justify-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 font-sans font-bold text-sm tracking-[0.12em] uppercase text-[#050709] active:scale-[0.97] transition-transform"
              style={{ background: C.gold }}
            >
              Book 30 Minutes
            </a>
            <a
              href="mailto:aitconsult22@gmail.com"
              className="px-8 py-3.5 font-sans text-sm tracking-[0.12em] uppercase border border-[#d8aa43]/30 text-[#d8aa43]/70 hover:text-[#d8aa43] hover:border-[#d8aa43]/60 transition-colors"
            >
              aitconsult22@gmail.com
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
