import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, Layers, Sparkles, Gauge, Infinity } from 'lucide-react';
import {
  AfroTechCard,
  AfroButton,
  AfroGradientText,
  AfroDivider,
  AfroGrid,
  AfroGridItem,
  FloatingAfro,
  AfroRadiance,
} from '@/components/AfrofuturisticTech';
import {
  Card3DFlip,
  ParallaxSection,
  MorphingShape,
  AnimatedGradientBg,
  ScrollReveal,
  StaggeredReveal,
  RippleButton,
  HoverLift,
  TextReveal,
  FloatingBubble,
} from '@/components/AdvancedVisualEffects';
import { useAudioSystem } from '@/hooks/useAudioSystem';
import { useEffect, useState } from 'react';

export default function Home() {
  const { playClickSound, playHoverSound, playSuccessSound } = useAudioSystem();
  const [showVisualization, setShowVisualization] = useState(false);

  useEffect(() => {
    playSuccessSound();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.9 },
    },
  };

  const metricsData = [
    { label: 'Cybersecurity Excellence', value: 95, max: 100 },
    { label: 'Material Science Innovation', value: 87, max: 100 },
    { label: 'Community Impact', value: 92, max: 100 },
    { label: 'Research Advancement', value: 88, max: 100 },
  ];

  const researchData: Array<{ icon: typeof Sparkles; title: string; year: string; status: string; description: string }> = [
    {
      icon: Sparkles,
      title: 'Architecture-Driven Emergent Behavior in Multi-Component Composites',
      year: '2026',
      status: 'PREPRINT',
      description: 'Exploring system-level multi-modal transduction through engineered composite coupling.',
    },
    {
      icon: Gauge,
      title: 'TechBridge Collective: Digital Access & Community Resilience',
      year: '2025',
      status: 'ACTIVE',
      description: 'Bridging the digital divide across North Carolina with H.K. AI and human navigators.',
    },
    {
      icon: Infinity,
      title: 'Sovereign Intelligence: Quantum-Ready Cybersecurity Architecture',
      year: '2024',
      status: 'ONGOING',
      description: 'Developing next-generation security frameworks for sovereign digital infrastructure.',
    },
  ];

  const heroSections = [
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'Cybersecurity',
      description: 'Advanced threat detection, quantum-ready encryption, and sovereign security architecture.',
      delay: 0,
      url: 'https://queencalifia-cyberai.web.app/',
    },
    {
      icon: <Layers className="w-10 h-10" />,
      title: 'Material Science',
      description: 'Multi-modal composite transduction with 25 patent claims and experimental validation.',
      delay: 0.1,
      url: 'https://tamerian-materials.com/',
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: 'Community Impact',
      description: 'TechBridge Collective: Bridging digital divides with innovative solutions and human-centered tech.',
      delay: 0.2,
      url: 'https://techbridge-collective.org/',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section with Advanced Visuals */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatedGradientBg colors={['#DAA520', '#228B22', '#1E3A8A']} className="opacity-20" />
          
          <FloatingBubble size={300} duration={8} className="top-10 left-10 opacity-30" />
          <FloatingBubble size={200} duration={10} className="bottom-20 right-10 opacity-20" />
          <FloatingBubble size={150} duration={12} className="top-1/2 left-1/4 opacity-25" />

          <MorphingShape className="w-96 h-96 top-20 left-10 bg-gradient-to-r from-afro-gold to-afro-emerald opacity-10" />
          <MorphingShape className="w-96 h-96 bottom-20 right-10 bg-gradient-to-r from-afro-sapphire to-afro-terracotta opacity-10" />
        </div>

        {/* Content */}
        <motion.div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Main Title with Text Reveal */}
          <motion.div variants={itemVariants}>
            <TextReveal
              text="JONATHAN PEOPLES"
              className="text-6xl md:text-7xl font-bold mb-4 tracking-wider"
              delay={0.2}
            />
            <motion.p
              className="text-xl md:text-2xl text-foreground/80 font-light"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity } as any}
            >
              Sovereign Tech Architect | Cybersecurity Innovator | Material Science Pioneer
            </motion.p>
          </motion.div>

          {/* Animated Subtitle */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.p
              className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Pioneering next-generation technologies that empower communities, secure digital sovereignty, 
              and advance scientific innovation through Afrofuturistic design and cutting-edge engineering.
            </motion.p>
          </motion.div>

          {/* CTA Buttons with Ripple Effect */}
          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <RippleButton
              className="afro-button"
              onClick={() => {
                playClickSound();
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Portfolio <ArrowRight className="ml-2 w-5 h-5 inline" />
            </RippleButton>
            <RippleButton
              className="afro-button bg-afro-emerald border-afro-emerald"
              onClick={() => {
                playClickSound();
                document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Research
            </RippleButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity } as any}
        >
          <div className="text-afro-gold text-center">
            <p className="text-sm mb-2">Scroll to explore</p>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </motion.section>

      {/* Portfolio Sections with Parallax */}
      <ParallaxSection offset={100}>
        <motion.section
          id="portfolio"
          className="py-24 px-4 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <AfroGradientText className="text-5xl font-bold mb-4">
                CORE EXPERTISE
              </AfroGradientText>
              <p className="text-foreground/70 text-lg">
                Three pillars of innovation driving technological sovereignty
              </p>
            </motion.div>

            <AfroGrid columns={3}>
              {heroSections.map((section, index) => (
                <ScrollReveal key={index} delay={section.delay}>
                  <HoverLift liftAmount={15}>
                    <div
                      onClick={() => {
                        playClickSound();
                        window.open(section.url, '_blank');
                      }}
                      className="cursor-pointer h-full"
                    >
                      <AfroTechCard intensity="high" animated>
                        <div className="space-y-6">
                          <FloatingAfro>
                            <motion.div
                              className="text-5xl text-afro-gold mb-4"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity } as any}
                            >
                              {section.icon}
                            </motion.div>
                          </FloatingAfro>

                          <div>
                            <h3 className="text-2xl font-bold text-afro-gold mb-3">
                              {section.title}
                            </h3>
                            <p className="text-foreground/80 leading-relaxed">
                              {section.description}
                            </p>
                          </div>

                          <motion.div
                            className="flex items-center text-afro-emerald font-semibold hover:text-afro-gold transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            Visit Project <ArrowRight className="ml-2 w-4 h-4" />
                          </motion.div>
                        </div>
                      </AfroTechCard>
                    </div>
                  </HoverLift>
                </ScrollReveal>
              ))}
            </AfroGrid>
          </div>
        </motion.section>
      </ParallaxSection>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-4"
      >
        <AfroDivider />
      </motion.div>

      {/* Research Section with Staggered Reveal */}
      <motion.section
        id="research"
        className="py-24 px-4 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <AfroGradientText className="text-5xl font-bold mb-4">
              RESEARCH & INNOVATION
            </AfroGradientText>
            <p className="text-foreground/70 text-lg">
              Advancing the frontier of sovereign technology and community resilience
            </p>
          </motion.div>

          <StaggeredReveal staggerDelay={0.15}>
            {researchData.map((item, index) => {
              const Icon = item.icon;
              return (
                <HoverLift key={index} liftAmount={8}>
                  <AfroTechCard intensity="medium">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <AfroRadiance intensity="high">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity } as any}
                          >
                            <Icon className="w-12 h-12 text-afro-gold" />
                          </motion.div>
                        </AfroRadiance>
                      </div>

                      <div className="flex-grow space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-afro-gold">
                            {item.title}
                          </h3>
                          <motion.span
                            className="text-xs font-bold text-afro-emerald bg-afro-emerald/20 px-3 py-1 rounded"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity } as any}
                          >
                            {item.status}
                          </motion.span>
                        </div>

                        <p className="text-foreground/80 leading-relaxed">
                          {item.description}
                        </p>

                        <p className="text-sm text-foreground/60 font-semibold">
                          {item.year}
                        </p>
                      </div>
                    </div>
                  </AfroTechCard>
                </HoverLift>
              );
            })}
          </StaggeredReveal>
        </div>
      </motion.section>

      {/* Metrics Section with Animated Bars */}
      <motion.section
        className="py-24 px-4 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <AfroGradientText className="text-5xl font-bold mb-4">
              IMPACT METRICS
            </AfroGradientText>
            <p className="text-foreground/70 text-lg">
              Quantified excellence across key domains
            </p>
          </motion.div>

          <AfroGrid columns={2}>
            {metricsData.map((metric, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <HoverLift>
                  <AfroTechCard intensity="medium">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-afro-gold">
                        {metric.label}
                      </h4>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <motion.span
                            className="text-2xl font-bold text-afro-emerald"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            {metric.value}%
                          </motion.span>
                          <span className="text-foreground/60 text-sm">
                            of {metric.max}%
                          </span>
                        </div>

                        <div className="w-full h-3 bg-foreground/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-afro-gold to-afro-emerald"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${metric.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </AfroTechCard>
                </HoverLift>
              </ScrollReveal>
            ))}
          </AfroGrid>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 px-4 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div variants={itemVariants}>
            <AfroGradientText className="text-4xl font-bold mb-4">
              READY TO COLLABORATE?
            </AfroGradientText>
            <p className="text-foreground/70 text-lg mb-8">
              Let's build the future of sovereign technology together
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <RippleButton
              className="afro-button"
              onClick={() => playClickSound()}
            >
              Get In Touch
            </RippleButton>
            <RippleButton
              className="afro-button bg-afro-emerald border-afro-emerald"
              onClick={() => playClickSound()}
            >
              Download CV
            </RippleButton>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
