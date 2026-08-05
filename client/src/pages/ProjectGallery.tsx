import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Zap } from 'lucide-react';
import Project3DCard, { Project } from '@/components/Project3DCard';
import {
  AfroGradientText,
  AfroTechCard,
  AfroDivider,
  AfroGrid,
} from '@/components/AfrofuturisticTech';
import { ScrollReveal, StaggeredReveal } from '@/components/AdvancedVisualEffects';
import { useAudioSystem } from '@/hooks/useAudioSystem';

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Queen Califia Cyber AI',
    category: 'Cybersecurity',
    description: 'Advanced threat detection and quantum-ready encryption platform.',
    longDescription: 'Enterprise-grade cybersecurity platform with AI-powered threat detection, quantum-resistant encryption, and real-time security monitoring.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    technologies: ['React', 'TypeScript', 'Web Audio API', 'TensorFlow.js', 'Express'],
    link: 'https://queencalifia-cyberai.web.app/',
    year: 2026,
    impact: '95% threat detection accuracy',
  },
  {
    id: '2',
    title: 'Tamerian Materials Science',
    category: 'Material Science',
    description: 'Multi-modal composite transduction with 25 patent claims.',
    longDescription: 'Innovative material science research platform showcasing advanced composite materials with multi-modal transduction capabilities and experimental validation systems.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    technologies: ['React', 'Three.js', '3D Visualization', 'Data Analysis', 'Python'],
    link: 'https://tamerian-materials.com/',
    year: 2025,
    impact: '25 patent claims filed',
  },
  {
    id: '3',
    title: 'TechBridge Collective',
    category: 'Community Impact',
    description: 'Bridging digital divides across North Carolina with innovative solutions.',
    longDescription: 'Community-focused platform connecting underserved populations with digital resources, H.K. AI assistance, and human navigators for technology access.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'AI Integration'],
    link: 'https://techbridge-collective.org/',
    github: 'https://github.com/techbridge',
    year: 2024,
    impact: '10,000+ users served',
  },
  {
    id: '4',
    title: 'Sovereign Intelligence Framework',
    category: 'Cybersecurity',
    description: 'Quantum-ready cybersecurity architecture for digital sovereignty.',
    longDescription: 'Next-generation security framework designed for sovereign digital infrastructure with quantum-resistant algorithms and decentralized architecture.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?w=400&h=300&fit=crop',
    technologies: ['Cryptography', 'Quantum Computing', 'Blockchain', 'Python', 'C++'],
    year: 2024,
    impact: 'Quantum-resistant ready',
  },
  {
    id: '5',
    title: 'Afrofuturistic Design System',
    category: 'Design',
    description: 'Comprehensive design system celebrating African heritage with cutting-edge tech.',
    longDescription: 'Complete design system combining Afrofuturistic aesthetics with modern web technologies, featuring 50+ reusable components and animation utilities.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Storybook', 'TypeScript'],
    github: 'https://github.com/afrofuturistic-design',
    year: 2026,
    impact: '50+ components',
  },
  {
    id: '6',
    title: 'H.K. Assistant Platform',
    category: 'AI',
    description: 'Intelligent voice assistant with Black American voice and divine alternation.',
    longDescription: 'Advanced AI assistant platform featuring natural language processing, voice synthesis with diverse voice options, and real-time collaboration capabilities.',
    image: 'https://images.unsplash.com/photo-1677442d019cecf8e5004a9b53db12d33b57fc58?w=400&h=300&fit=crop',
    technologies: ['React', 'Web Audio API', 'Claude API', 'Node.js', 'WebSocket'],
    year: 2026,
    impact: 'Multi-language support',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name (A-Z)' },
];

export default function ProjectGallery() {
  const { playClickSound, playHoverSound } = useAudioSystem();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = PROJECTS;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.technologies.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'oldest':
        sorted.sort((a, b) => a.year - b.year);
        break;
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => b.year - a.year);
    }

    return sorted;
  }, [selectedCategory, sortBy, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <AfroGradientText className="text-6xl font-bold mb-4">
              PROJECT GALLERY
            </AfroGradientText>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Explore my portfolio of innovative projects spanning cybersecurity, material science, and community impact
            </p>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <AfroDivider />

        {/* Filters and Search */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Search Bar */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-afro-gold" />
              <input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  playClickSound();
                }}
                className="w-full pl-12 pr-4 py-3 bg-foreground/5 border border-afro-gold/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-afro-gold focus:ring-2 focus:ring-afro-gold/20 transition-all"
              />
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2 text-afro-gold font-semibold">
              <Filter className="w-4 h-4" />
              <span>Category</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(category => (
                <motion.button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    playClickSound();
                  }}
                  onHoverStart={() => playHoverSound()}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-afro-gold text-background'
                      : 'bg-afro-gold/20 text-afro-gold hover:bg-afro-gold/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Sort */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2 text-afro-gold font-semibold">
              <Zap className="w-4 h-4" />
              <span>Sort By</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {SORT_OPTIONS.map(option => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    playClickSound();
                  }}
                  onHoverStart={() => playHoverSound()}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    sortBy === option.value
                      ? 'bg-afro-emerald text-background'
                      : 'bg-afro-emerald/20 text-afro-emerald hover:bg-afro-emerald/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <motion.p variants={itemVariants} className="text-foreground/60 text-sm">
            Showing {filteredAndSortedProjects.length} of {PROJECTS.length} projects
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filteredAndSortedProjects.length > 0 ? (
            <AfroGrid columns={3}>
              {filteredAndSortedProjects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 0.1}>
                  <Project3DCard
                    project={project}
                    onClick={() => {
                      playClickSound();
                      if (project.link) {
                        window.open(project.link, '_blank');
                      }
                    }}
                  />
                </ScrollReveal>
              ))}
            </AfroGrid>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-foreground/60 text-lg">
                No projects found matching your criteria
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center space-y-6 pt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <AfroGradientText className="text-3xl font-bold mb-4">
              Want to collaborate?
            </AfroGradientText>
            <p className="text-foreground/70 mb-6">
              Let's build something amazing together
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <motion.button
              className="afro-button"
              onClick={() => playClickSound()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.button>
            <motion.button
              className="afro-button bg-afro-emerald border-afro-emerald"
              onClick={() => playClickSound()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download CV
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
