import { motion } from 'framer-motion';
import TechMinutesDashboard from '@/components/TechMinutesDashboard';
import { SovereignNebulaGL } from '@/components/SovereignNebulaGL';

export default function CommunityImpact() {

  return (
    <div className="min-h-screen relative" style={{ background: '#050709' }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <SovereignNebulaGL variant="emerald" />
      </div>
      <div className="relative z-[1]">
      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            <span className="text-primary neon-text">TECHBRIDGE COLLECTIVE</span>
          </h1>
          <p className="text-2xl text-cyan mb-2">Building Bridges of Digital Access</p>
          <p className="text-xl text-foreground/80 max-w-2xl">
            Addressing the digital divide in North Carolina. Free, community-based digital navigation services across the Triangle Area (Durham, Raleigh, Chapel Hill). North Carolina has over 1.2M residents lacking adequate broadband access (NCDIT 2023 data).
          </p>
          <div className="mt-8 overflow-hidden rounded-lg max-w-2xl">
            <img src="/media/tamerian/lattice.jpg" alt="TechBridge Collective — Tech Problems Don't Wait. Neither Do We." className="w-full h-auto" />
          </div>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4 py-12 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">THREE-PILLAR MODEL</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border border-cyan rounded-lg">
              <h3 className="text-lg font-bold text-cyan mb-2">Help Desk</h3>
              <p className="text-foreground/80 text-sm">Weekly in-person digital navigation services with paid Digital Navigators. One-on-one assistance with email, banking, healthcare portals, job applications, and more.</p>
            </div>
            <div className="p-6 border border-gold rounded-lg">
              <h3 className="text-lg font-bold text-gold mb-2">H.K. AI Triage</h3>
              <p className="text-foreground/80 text-sm">24/7 AI-powered guidance system for digital navigation. Horace King-inspired triage interface providing step-by-step assistance anytime, anywhere.</p>
            </div>
            <div className="p-6 border border-lime-500 rounded-lg">
              <h3 className="text-lg font-bold text-lime-500 mb-2">TechMinutes®</h3>
              <p className="text-foreground/80 text-sm">Impact reporting and measurement system. Tracks outcomes, ROI, and community benefit across all initiatives and hub locations.</p>
            </div>
          </div>
          <p className="text-foreground/80 text-lg leading-relaxed">
            We believe that the best technology in the world doesn't matter if no one shows you how to use it. Our mission is to connect North Carolinians who lack adequate digital access with the tools, knowledge, and human support they need to thrive.
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">OUR DNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔄',
                title: 'Consistency over Novelty',
                description: 'We show up. Every week. Same time, same place.',
              },
              {
                icon: '🤝',
                title: 'Human-First Technology',
                description: 'H.K. triages; humans deliver. Technology serves people, not the reverse.',
              },
              {
                icon: '📊',
                title: 'Measured Impact',
                description: 'Every interaction becomes a TechMinute®. We measure what matters.',
              },
              {
                icon: '🏢',
                title: 'Low-Lift Partnerships',
                description: 'Host provides space. TechBridge provides everything else.',
              },
              {
                icon: '💰',
                title: 'Paid Navigators',
                description: 'No volunteers. Paid staff show up, stay trained, and don\'t churn.',
              },
              {
                icon: '🔒',
                title: 'Privacy by Design',
                description: 'No PII. No credential access. We guide; we don\'t control.',
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-foreground/80">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TechMinutes Dashboard */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">IMPACT DASHBOARD</h2>
          <TechMinutesDashboard isActive={true} />
        </motion.div>
      </section>

      {/* Hub Network */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">HUB NETWORK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Durham County Library',
                location: 'Durham, NC',
                status: 'PROPOSED PILOT TARGET',
                hours: '4–8 hrs/wk',
              },
              {
                name: 'Raleigh Digital Impact Center',
                location: 'Raleigh, NC',
                status: 'PROPOSED PILOT TARGET',
                hours: '4–8 hrs/wk',
              },
              {
                name: 'Durham Housing Authority',
                location: 'Durham, NC',
                status: 'PROPOSED YEAR 2 TARGET',
                hours: 'TBD',
              },
              {
                name: 'Raleigh Housing Authority',
                location: 'Raleigh, NC',
                status: 'PROPOSED YEAR 2 TARGET',
                hours: 'TBD',
              },
            ].map((hub, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-foreground mb-2">{hub.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{hub.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-primary">{hub.status}</span>
                  <span className="text-xs font-mono text-muted-foreground">{hub.hours}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* H.K. AI Overview */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">H.K. AI TRIAGE</h2>
          <p className="text-foreground/80 mb-6">
            Named for Horace King, the enslaved master bridge builder who connected communities across the American South, H.K. provides 24/7 step-by-step guidance between visits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Step-by-step guidance', emoji: '📋' },
              { label: 'Portal navigation', emoji: '🗺️' },
              { label: 'Smart escalation', emoji: '🎯' },
              { label: '24/7 availability', emoji: '⏰' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-4 p-4 rounded border border-border bg-card"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + idx * 0.05 }}
              >
                <span className="text-3xl">{feature.emoji}</span>
                <span className="text-foreground font-semibold">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Cross the Bridge?</h2>
          <p className="text-foreground/80 mb-8">
            Whether you need help with digital access, want to host a hub, or are interested in partnership opportunities, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@techbridge-collective.org"
              className="px-8 py-3 bg-primary text-background hover:bg-primary/80 rounded font-mono text-sm tracking-widest transition-colors"
            >
              GET IN TOUCH
            </a>
            <a
              href="https://techbridge-collective.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded font-mono text-sm tracking-widest transition-colors"
            >
              LEARN MORE
            </a>
          </div>
        </motion.div>
    </section>
    </div>
    </div>
  );
}
