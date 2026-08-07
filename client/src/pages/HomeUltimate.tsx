import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Layers,
  Brain,
  Volume2,
  Hand,
  Box,
} from "lucide-react";
import { AstronomicalEffects } from "@/components/AstronomicalEffects";
import {
  ExtremeNeonLighting,
  VolumetricLightRays,
  BloomEffect,
} from "@/components/ExtremeNeonLighting";
import {
  AdvancedRadarChart,
  AnimatedBarChart,
} from "@/components/AdvancedDataViz";
import { Interactive3DScene } from "@/components/Interactive3DScene";
import { GestureNavigation } from "@/components/GestureNavigation";
import { SoundReactiveEffects } from "@/components/SoundReactiveEffects";

/**
 * Ultimate home page with all state-of-the-art features:
 * - Astronomical effects background
 * - Interactive 3D scene with project models
 * - Gesture-driven navigation
 * - Sound-reactive effects
 * - Extreme neon lighting
 * - Advanced data visualizations
 */
export default function HomeUltimate() {
  const [activeFeature, setActiveFeature] = useState<
    "3d" | "gesture" | "sound" | "none"
  >("none");
  const [showMetrics, setShowMetrics] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowMetrics(true), 1500);
    return () => clearTimeout(timer);
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
    { label: "Cybersecurity", value: 95, max: 100, color: "#FF0080" },
    { label: "Innovation", value: 92, max: 100, color: "#00D9FF" },
    { label: "Impact", value: 88, max: 100, color: "#DAA520" },
    { label: "Research", value: 90, max: 100, color: "#228B22" },
  ];

  const skillsData = [
    { label: "Cybersecurity", value: 95, max: 100, color: "#FF0080" },
    { label: "Material Science", value: 87, max: 100, color: "#DAA520" },
    { label: "AI/ML Systems", value: 92, max: 100, color: "#00D9FF" },
    { label: "Community Impact", value: 90, max: 100, color: "#228B22" },
  ];

  const handleProjectClick = (projectId: string) => {
    console.log("Project clicked:", projectId);
    // Navigate to project details
  };

  const handleSwipeLeft = () => {
    setCurrentPage(prev => (prev + 1) % 3);
  };

  const handleSwipeRight = () => {
    setCurrentPage(prev => (prev - 1 + 3) % 3);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background effects */}
      <AstronomicalEffects intensity="high" />

      {/* Interactive 3D scene */}
      {activeFeature === "3d" && (
        <Interactive3DScene onProjectClick={handleProjectClick} />
      )}

      {/* Gesture navigation */}
      <GestureNavigation
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSwipeUp={() => window.scrollBy({ top: -200, behavior: "smooth" })}
        onSwipeDown={() => window.scrollBy({ top: 200, behavior: "smooth" })}
      />

      {/* Sound reactive effects */}
      {activeFeature === "sound" && (
        <SoundReactiveEffects enabled intensity="high" />
      )}

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <VolumetricLightRays color="#00D9FF" rayCount={12} animated />

        <motion.div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Title */}
          <motion.div variants={itemVariants}>
            <ExtremeNeonLighting
              glowColor="#00D9FF"
              intensity="extreme"
              animated
            >
              <h1 className="text-7xl md:text-8xl font-bold tracking-wider mb-4 bg-gradient-to-r from-afro-gold via-afro-sapphire to-afro-emerald bg-clip-text text-transparent">
                JONATHAN PEOPLES
              </h1>
            </ExtremeNeonLighting>
            <motion.p
              className="text-2xl md:text-3xl text-foreground/80 font-light mt-6"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity } as any}
            >
              Sovereign Tech Architect | Cybersecurity Innovator | Material
              Science Pioneer
            </motion.p>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants} className="space-y-4">
            <BloomEffect color="#DAA520" intensity="high">
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                Pioneering next-generation technologies that empower
                communities, secure digital sovereignty, and advance scientific
                innovation through Afrofuturistic design and cutting-edge
                engineering.
              </p>
            </BloomEffect>
          </motion.div>

          {/* Feature Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center flex-wrap pt-8"
          >
            <ExtremeNeonLighting glowColor="#FF0080" intensity="high" animated>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-afro-gold to-afro-emerald text-black font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                onClick={() =>
                  setActiveFeature(activeFeature === "3d" ? "none" : "3d")
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box className="w-5 h-5" />
                {activeFeature === "3d" ? "Hide 3D" : "View 3D Projects"}
              </motion.button>
            </ExtremeNeonLighting>

            <ExtremeNeonLighting glowColor="#00D9FF" intensity="high" animated>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-afro-sapphire to-afro-emerald text-white font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                onClick={() =>
                  setActiveFeature(activeFeature === "sound" ? "none" : "sound")
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Volume2 className="w-5 h-5" />
                {activeFeature === "sound"
                  ? "Disable Sound"
                  : "Enable Sound Reactive"}
              </motion.button>
            </ExtremeNeonLighting>

            <ExtremeNeonLighting glowColor="#DAA520" intensity="high" animated>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-afro-emerald to-afro-sapphire text-white font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Hand className="w-5 h-5" />
                Gesture Controls Active
              </motion.button>
            </ExtremeNeonLighting>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity } as any}
        >
          <div className="text-afro-gold text-center">
            <p className="text-sm mb-2">Scroll to explore</p>
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </motion.section>

      {/* Expertise Section */}
      <motion.section
        className="relative py-24 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-afro-gold to-afro-sapphire bg-clip-text text-transparent">
              CORE EXPERTISE
            </h2>
            <p className="text-foreground/70 text-lg">
              Advanced capabilities across multiple domains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Zap className="w-12 h-12" />,
                title: "Cybersecurity",
                description:
                  "Quantum-ready encryption and sovereign security architecture",
                color: "#FF0080",
              },
              {
                icon: <Layers className="w-12 h-12" />,
                title: "Material Science",
                description:
                  "Multi-modal composite transduction with 25+ patent claims",
                color: "#DAA520",
              },
              {
                icon: <Brain className="w-12 h-12" />,
                title: "Community Impact",
                description: "TechBridge Collective bridging digital divides",
                color: "#00D9FF",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <ExtremeNeonLighting
                  glowColor={item.color}
                  intensity="high"
                  animated
                >
                  <div className="p-8 bg-background/50 rounded-lg border border-foreground/20 backdrop-blur-sm h-full">
                    <div
                      className="text-5xl mb-4"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-foreground/80">{item.description}</p>
                  </div>
                </ExtremeNeonLighting>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Metrics Section */}
      {showMetrics && (
        <motion.section
          className="relative py-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-afro-sapphire to-afro-emerald bg-clip-text text-transparent">
                PERFORMANCE METRICS
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <ExtremeNeonLighting
                  glowColor="#00D9FF"
                  intensity="medium"
                  animated
                >
                  <div className="p-8 bg-background/50 rounded-lg border border-foreground/20 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-6 text-center text-afro-gold">
                      Capability Matrix
                    </h3>
                    <AdvancedRadarChart data={metricsData} animated />
                  </div>
                </ExtremeNeonLighting>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <ExtremeNeonLighting
                  glowColor="#FF0080"
                  intensity="medium"
                  animated
                >
                  <div className="p-8 bg-background/50 rounded-lg border border-foreground/20 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-6 text-center text-afro-gold">
                      Technical Proficiency
                    </h3>
                    <AnimatedBarChart data={skillsData} />
                  </div>
                </ExtremeNeonLighting>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
