import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AudioSystem } from '../components/AudioSystem';
import { CinematicIntro } from '../components/CinematicIntro';

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  technologies: string[];
  impact: string;
  status: 'active' | 'development' | 'research';
}

export const Applications: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const applications: Application[] = [
    {
      id: 'wearables',
      name: 'Advanced Wearables',
      description: 'Self-powered health monitoring devices using thermoelectric and piezoelectric energy harvesting',
      icon: '⌚',
      technologies: ['Thermoelectric Generation', 'Piezoelectric Sensors', 'Energy Harvesting'],
      impact: 'Continuous health monitoring without battery replacement',
      status: 'active',
    },
    {
      id: 'aerospace',
      name: 'Aerospace Systems',
      description: 'Lightweight composite materials for aircraft with integrated energy harvesting',
      icon: '✈️',
      technologies: ['Hemp-Derived Carbon Fibers', 'Composite Materials', 'Thermal Management'],
      impact: 'Reduced weight, improved efficiency, self-powered systems',
      status: 'development',
    },
    {
      id: 'quantum',
      name: 'Quantum Computing',
      description: 'Room-temperature quantum processors using rare-earth dopants in quartz',
      icon: '⚛️',
      technologies: ['Quantum Coherence', 'Rare-Earth Dopants', 'Quantum Gates'],
      impact: 'Practical quantum computing without cryogenic cooling',
      status: 'research',
    },
    {
      id: 'renewable',
      name: 'Renewable Energy',
      description: 'Integrated thermoelectric and piezoelectric power generation systems',
      icon: '⚡',
      technologies: ['Thermoelectric Modules', 'Piezoelectric Generators', 'Energy Storage'],
      impact: 'Harness waste heat and mechanical vibrations for power',
      status: 'active',
    },
    {
      id: 'biomedical',
      name: 'Biomedical Devices',
      description: 'Implantable medical devices powered by body heat and motion',
      icon: '🏥',
      technologies: ['Biocompatible Materials', 'Thermoelectric Harvesting', 'Wireless Power'],
      impact: 'Eliminate need for surgical battery replacement procedures',
      status: 'development',
    },
    {
      id: 'iot',
      name: 'IoT Networks',
      description: 'Self-powered IoT sensors using ambient energy harvesting',
      icon: '🌐',
      technologies: ['Energy Harvesting', 'Wireless Communication', 'Low-Power Electronics'],
      impact: 'Maintenance-free sensor networks for decades',
      status: 'active',
    },
    {
      id: 'automotive',
      name: 'Automotive Integration',
      description: 'Vehicle components with integrated energy harvesting from heat and vibration',
      icon: '🚗',
      technologies: ['Thermoelectric Harvesting', 'Vibration Sensing', 'Composite Integration'],
      impact: 'Improved fuel efficiency and reduced emissions',
      status: 'development',
    },
    {
      id: 'defense',
      name: 'Defense & Security',
      description: 'Advanced materials for cybersecurity and quantum-resistant encryption',
      icon: '🛡️',
      technologies: ['Quantum Cryptography', 'Advanced Materials', 'Secure Computing'],
      impact: 'Next-generation security infrastructure',
      status: 'research',
    },
  ];

  const statusColors = {
    active: 'text-green-400',
    development: 'text-yellow-400',
    research: 'text-magenta-400',
  };

  const statusBgColors = {
    active: 'bg-green-400/10 border-green-400/50',
    development: 'bg-yellow-400/10 border-yellow-400/50',
    research: 'bg-magenta-400/10 border-magenta-400/50',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-deep-blue to-black pt-20 pb-20">
      <AudioSystem
        soundscapeUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/applications-soundscape_1f487949.wav"
        volume={0.3}
        autoPlay={true}
        loop={true}
      />

      {showIntro && (
        <CinematicIntro
          title="Applications"
          subtitle="Transforming Industries with Advanced Technology"
          color="#00ffff"
          icon="🚀"
          duration={2.5}
          onComplete={() => setShowIntro(false)}
        />
      )}
      {/* Cinematic Intro */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <h1 className="text-6xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Real-World Applications
          </span>
        </h1>
        <p className="text-center text-cyan-400 text-lg mb-8">
          Transforming Industries with Advanced Materials & Quantum Technology
        </p>
      </motion.div>

      {/* Application Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {applications.map((app, idx) => (
          <motion.button
            key={app.id}
            onClick={() => setSelectedApp(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + idx * 0.05 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedApp === idx
                ? 'bg-cyan-400/20 border-cyan-400 shadow-lg shadow-cyan-400/50'
                : 'bg-black/50 border-cyan-400/30 hover:border-cyan-400/60'
            }`}
          >
            <div className="text-3xl mb-2">{app.icon}</div>
            <div className="text-xs font-bold text-cyan-400">{app.name}</div>
            <div className={`text-xs mt-1 ${statusColors[app.status]}`}>
              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Selected Application Details */}
      <motion.div
        key={selectedApp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 mb-12"
      >
        <div
          className={`p-8 rounded-lg border-2 ${statusBgColors[applications[selectedApp].status]}`}
        >
          <div className="flex items-start gap-6 mb-6">
            <div className="text-6xl">{applications[selectedApp].icon}</div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-cyan-400 mb-2">
                {applications[selectedApp].name}
              </h3>
              <p className="text-cyan-400 text-lg mb-4">
                {applications[selectedApp].description}
              </p>
              <div className={`inline-block px-3 py-1 rounded text-sm font-bold ${statusColors[applications[selectedApp].status]}`}>
                {applications[selectedApp].status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h4 className="font-bold text-gold-400 mb-3">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {applications[selectedApp].technologies.map((tech, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="px-3 py-1 bg-black/50 border border-cyan-400/50 rounded text-xs text-cyan-400"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="p-4 bg-black/50 rounded border border-green-400/30">
            <h4 className="font-bold text-green-400 mb-2">Impact</h4>
            <p className="text-sm text-cyan-400">{applications[selectedApp].impact}</p>
          </div>
        </div>
      </motion.div>

      {/* Application Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            title: 'Active Deployments',
            count: applications.filter((a) => a.status === 'active').length,
            color: 'green',
          },
          {
            title: 'In Development',
            count: applications.filter((a) => a.status === 'development').length,
            color: 'yellow',
          },
          {
            title: 'Research Phase',
            count: applications.filter((a) => a.status === 'research').length,
            color: 'magenta',
          },
        ].map((category, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + idx * 0.1 }}
            className={`p-6 rounded-lg border-2 border-${category.color}-400/50 bg-${category.color}-400/10 text-center`}
          >
            <div className={`text-4xl font-bold text-${category.color}-400 mb-2`}>
              {category.count}
            </div>
            <div className={`text-sm text-${category.color}-400`}>{category.title}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Implementation Roadmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mt-12 p-8 bg-black/50 rounded-lg border border-cyan-400/30"
      >
        <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          Implementation Timeline
        </h3>
        <div className="space-y-4">
          {[
            { year: '2024-2025', milestone: 'Active deployment in wearables and IoT' },
            { year: '2025-2026', milestone: 'Aerospace and automotive integration' },
            { year: '2026-2027', milestone: 'Biomedical device commercialization' },
            { year: '2027-2028', milestone: 'Quantum computing system deployment' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + idx * 0.1 }}
              className="flex items-center gap-4 p-4 bg-black/70 rounded border border-cyan-400/20"
            >
              <div className="w-24 font-bold text-gold-400">{item.year}</div>
              <div className="flex-1 text-cyan-400">{item.milestone}</div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-green-400"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
