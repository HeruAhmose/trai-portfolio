import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Award } from 'lucide-react';
import { soundDesignService } from '@/services/soundDesign';
import { calculateParallax } from '@/utils/cinematicEffects';
import '../styles/premiumDesign.css';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
}

const projects: Project[] = [
  {
    id: 'cybersecurity',
    title: 'Quantum-Resistant Cryptography',
    description:
      'Advanced cryptographic systems designed to withstand quantum computing attacks. Implements lattice-based and code-based algorithms.',
    image: 'https://via.placeholder.com/600x400?text=Quantum+Crypto',
    tags: ['Cryptography', 'Quantum', 'Security'],
    featured: true,
    metrics: [
      { label: 'Security Level', value: '256-bit' },
      { label: 'Performance', value: '+40%' },
    ],
  },
  {
    id: 'materials',
    title: 'Self-Healing Materials',
    description:
      'Biomimetic materials that autonomously repair damage. Applications in aerospace, automotive, and infrastructure.',
    image: 'https://via.placeholder.com/600x400?text=Materials',
    tags: ['Materials', 'Nanotechnology', 'Innovation'],
    featured: true,
    metrics: [
      { label: 'Durability', value: '10x' },
      { label: 'Cost Reduction', value: '35%' },
    ],
  },
  {
    id: 'energy',
    title: 'Ambient Energy Harvesting',
    description:
      'Harvesting energy from ambient electromagnetic fields and thermal gradients for sustainable power generation.',
    image: 'https://via.placeholder.com/600x400?text=Energy',
    tags: ['Energy', 'Sustainability', 'IoT'],
    metrics: [
      { label: 'Efficiency', value: '78%' },
      { label: 'Output', value: '500mW' },
    ],
  },
];

/**
 * Premium Project Showcase Page
 * Cinematic presentation with parallax and advanced effects
 */
export default function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-color-primary pt-20">
      {/* Cinematic Background */}
      <motion.div
        ref={parallaxRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{
          y: scrollY * 0.5,
          background:
            'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-6xl mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="badge-premium">FEATURED PROJECTS</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gradient mb-6"
          >
            Innovation in Motion
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mb-12"
          >
            Cutting-edge research and development across quantum computing, materials science,
            and sustainable energy systems.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="max-w-6xl mx-auto px-4 pb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -12 }}
                className="group"
              >
                <div className="card-premium overflow-hidden h-full flex flex-col">
                  {/* Project Image */}
                  <div className="relative overflow-hidden rounded-lg mb-6 h-48 bg-gradient-to-br from-accent-gold/10 to-accent-cyan/10">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <motion.div
                          className="flex items-center gap-2 px-3 py-1 bg-accent-gold/20 border border-accent-gold/50 rounded-full text-accent-gold text-sm font-semibold"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Award className="w-4 h-4" />
                          Featured
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{project.description}</p>

                  {/* Metrics */}
                  {project.metrics && (
                    <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-t border-accent-gold/20">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx}>
                          <p className="text-accent-gold text-sm font-semibold">{metric.value}</p>
                          <p className="text-gray-500 text-xs">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full text-accent-cyan text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    {project.link && (
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-premium btn-premium-gold text-sm flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => soundDesignService.playUISound('click')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </motion.a>
                    )}
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-premium btn-premium-cyan text-sm flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => soundDesignService.playUISound('click')}
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
