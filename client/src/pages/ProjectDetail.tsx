import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useRouter } from 'wouter';
import { ArrowLeft, ExternalLink, Github, Award, Zap } from 'lucide-react';
import { AstronomicalEffects } from '@/components/AstronomicalEffects';
import { ExtremeNeonLighting, VolumetricLightRays } from '@/components/ExtremeNeonLighting';

interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  achievements: string[];
  technologies: string[];
  impact: string;
  links: {
    github?: string;
    live?: string;
    paper?: string;
  };
  color: string;
  year: number;
}

const projectsData: Record<string, ProjectData> = {
  cybersecurity: {
    id: 'cybersecurity',
    title: 'Quantum-Ready Cybersecurity',
    subtitle: 'Sovereign Digital Architecture',
    description: 'Advanced encryption and security protocols',
    fullDescription: `Pioneering next-generation cybersecurity architecture designed for quantum computing era. This project implements post-quantum cryptography, zero-trust security models, and sovereign data protection frameworks.

Key innovations include:
- Lattice-based encryption resistant to quantum attacks
- Decentralized identity verification systems
- Hardware-accelerated cryptographic operations
- Real-time threat detection using ML models`,
    achievements: [
      '25+ patent claims filed',
      'Military-grade security certification',
      'Zero security breaches in 3 years',
      'Adopted by Fortune 500 companies',
    ],
    technologies: ['Rust', 'FPGA', 'Post-Quantum Crypto', 'Zero Trust', 'ML'],
    impact: 'Protecting digital sovereignty for millions of users globally',
    links: {
      github: 'https://github.com',
      paper: 'https://arxiv.org',
    },
    color: '#FF0080',
    year: 2024,
  },
  materials: {
    id: 'materials',
    title: 'Multi-Modal Composite Materials',
    subtitle: 'Advanced Material Science',
    description: 'Breakthrough in composite transduction',
    fullDescription: `Revolutionary material science research combining multiple modalities for unprecedented performance. This work bridges quantum mechanics, nanotechnology, and engineering to create materials with adaptive properties.

Research highlights:
- 300% improved strength-to-weight ratio
- Self-healing composite structures
- Programmable material properties
- Sustainable manufacturing process`,
    achievements: [
      'Published in Nature Materials',
      'TED talk featured research',
      'Industry partnerships with aerospace',
      'Sustainable production scaled',
    ],
    technologies: ['Nanotechnology', 'Quantum Mechanics', 'Materials Science', 'CAD'],
    impact: 'Enabling next-generation aerospace and infrastructure',
    links: {
      paper: 'https://nature.com',
    },
    color: '#DAA520',
    year: 2023,
  },
  community: {
    id: 'community',
    title: 'TechBridge Collective',
    subtitle: 'Community Impact Initiative',
    description: 'Bridging digital divides',
    fullDescription: `Community-driven initiative to democratize access to advanced technology education and resources. TechBridge Collective has impacted thousands of underrepresented individuals in tech.

Program components:
- Free advanced tech bootcamps
- Mentorship from industry leaders
- Scholarship programs
- Open-source project contributions`,
    achievements: [
      '5000+ students trained',
      '80% job placement rate',
      '100+ open-source contributors',
      'Recognized by UN SDG',
    ],
    technologies: ['Education', 'Community Building', 'Open Source', 'Mentorship'],
    impact: 'Empowering the next generation of tech leaders from underrepresented communities',
    links: {
      github: 'https://github.com',
      live: 'https://techbridge.org',
    },
    color: '#00D9FF',
    year: 2022,
  },
};

/**
 * Project detail page with 3D rotating model
 * Features:
 * - Interactive 3D model rotation
 * - Detailed project information
 * - Achievement badges
 * - Technology stack display
 * - External links
 */
export default function ProjectDetail() {
  const [location] = useLocation() as unknown as [string, any];
  const [, navigate] = useRouter() as unknown as [any, any];
  const projectId = location?.split('/').pop() || 'cybersecurity';
  const project = projectsData[projectId] || projectsData.cybersecurity;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      setRotation((prev) => ({
        x: prev.x + mouseRef.current.y * 0.01,
        y: prev.y + mouseRef.current.x * 0.01,
      }));
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background effects */}
      <AstronomicalEffects intensity="high" />

      {/* Header */}
      <motion.div
        className="relative z-10 pt-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-afro-gold hover:text-afro-sapphire transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Portfolio
        </button>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 3D Model Section */}
          <motion.div
            className="relative h-96 lg:h-full min-h-96"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ExtremeNeonLighting glowColor={project.color} intensity="extreme" animated>
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  perspective: '1000px',
                }}
              >
                {/* 3D Model Placeholder */}
                <motion.div
                  className="w-64 h-64 rounded-lg border-2 border-transparent flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${project.color}20, ${project.color}40)`,
                    rotateX: `${rotation.x}deg`,
                    rotateY: `${rotation.y}deg`,
                    transformStyle: 'preserve-3d',
                    borderColor: project.color,
                  }}
                >
                  <div className="text-6xl" style={{ color: project.color }}>
                    ◆
                  </div>
                </motion.div>
              </div>
            </ExtremeNeonLighting>

            {/* Rotation hint */}
            <motion.p
              className="text-center text-foreground/60 text-sm mt-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity } as any}
            >
              Move mouse to rotate model
            </motion.p>
          </motion.div>

          {/* Project Info Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Title */}
            <div>
              <motion.p
                className="text-sm font-semibold text-afro-gold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {project.year} • {project.subtitle}
              </motion.p>
              <ExtremeNeonLighting glowColor={project.color} intensity="high" animated>
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-afro-gold to-afro-sapphire bg-clip-text text-transparent">
                  {project.title}
                </h1>
              </ExtremeNeonLighting>
            </div>

            {/* Description */}
            <motion.div className="space-y-4">
              <p className="text-foreground/80 leading-relaxed">
                {project.fullDescription}
              </p>
            </motion.div>

            {/* Achievements */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-afro-gold flex items-center gap-2">
                <Award className="w-5 h-5" />
                Key Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="p-3 bg-background/50 border border-foreground/20 rounded-lg flex items-start gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Zap className="w-4 h-4 text-afro-gold mt-1 flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Technologies */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-afro-gold">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-afro-gold/20 to-afro-sapphire/20 border border-afro-gold/40 rounded-full text-sm font-semibold text-afro-gold"
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Impact */}
            <motion.div
              className="p-6 bg-gradient-to-r from-afro-gold/10 to-afro-sapphire/10 border border-afro-gold/30 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm font-semibold text-afro-gold mb-2">Impact</p>
              <p className="text-foreground/80">{project.impact}</p>
            </motion.div>

            {/* Links */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {project.links.github && (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-afro-gold to-afro-emerald text-black font-bold rounded-lg hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                  View Code
                </motion.a>
              )}
              {project.links.live && (
                <motion.a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-afro-sapphire to-afro-emerald text-white font-bold rounded-lg hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                </motion.a>
              )}
              {project.links.paper && (
                <motion.a
                  href={project.links.paper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-afro-emerald to-afro-sapphire text-white font-bold rounded-lg hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Research Paper
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
