import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Immersive Project Showcase
 * 3D interactive project presentation with cinematic transitions
 */

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  impact: string;
  color: string;
  depth: number;
}

const projects: Project[] = [
  {
    id: "quantum",
    title: "Quantum Computing Research",
    description:
      "Advanced quantum algorithms for cryptography and optimization",
    technologies: ["Quantum Computing", "Python", "Qiskit"],
    impact: "Published in Nature Quantum Information",
    color: "#00d9ff",
    depth: 3,
  },
  {
    id: "materials",
    title: "Materials Science Innovation",
    description: "Novel materials for sustainable energy storage",
    technologies: ["Materials Science", "Python", "VASP"],
    impact: "15+ patents filed",
    color: "#d4af37",
    depth: 2,
  },
  {
    id: "community",
    title: "Community Tech Platform",
    description: "Open-source platform for community engagement",
    technologies: ["React", "Node.js", "PostgreSQL"],
    impact: "50K+ users",
    color: "#ff006e",
    depth: 1,
  },
];

export const ImmersiveProjectShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentProject = projects[activeProject];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePos({ x, y });
      setRotation({
        x: y * 20,
        y: x * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-background overflow-hidden"
    >
      {/* Background gradient with project color */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(
            circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%,
            ${currentProject.color}20 0%,
            transparent 50%
          )`,
        }}
        transition={{ type: "spring", stiffness: 100 }}
      />

      {/* 3D Project Card Container */}
      <div className="relative w-full h-screen flex items-center justify-center perspective">
        <motion.div
          className="relative w-full max-w-2xl"
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30,
          }}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main project card */}
          <motion.div
            className="relative p-12 rounded-2xl border-2 backdrop-blur-xl"
            style={{
              borderColor: currentProject.color,
              backgroundColor: `${currentProject.color}10`,
            }}
            initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-2xl blur-2xl opacity-30 -z-10"
              style={{
                background: `radial-gradient(circle, ${currentProject.color} 0%, transparent 70%)`,
              }}
            />

            {/* Title with gradient */}
            <motion.h2
              className="text-5xl font-black mb-6 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentProject.color}, #ffffff)`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {currentProject.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {currentProject.description}
            </motion.p>

            {/* Technologies */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className="text-sm font-mono text-accent-gold mb-3">
                TECHNOLOGIES
              </p>
              <div className="flex flex-wrap gap-2">
                {currentProject.technologies.map((tech, i) => (
                  <motion.span
                    key={tech}
                    className="px-4 py-2 rounded-full text-sm font-mono"
                    style={{
                      border: `1px solid ${currentProject.color}`,
                      color: currentProject.color,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8 + i * 0.1,
                      duration: 0.4,
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Impact */}
            <motion.div
              className="pt-8 border-t-2"
              style={{ borderColor: `${currentProject.color}40` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p className="text-sm font-mono text-accent-gold mb-2">IMPACT</p>
              <p className="text-lg" style={{ color: currentProject.color }}>
                {currentProject.impact}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Navigation */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-4 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {projects.map((project, i) => (
          <motion.button
            key={project.id}
            onClick={() => setActiveProject(i)}
            className="relative px-6 py-3 rounded-lg font-mono text-sm transition-all"
            style={{
              borderColor: project.color,
              color: activeProject === i ? "#000" : project.color,
              backgroundColor:
                activeProject === i ? project.color : "transparent",
              border: `2px solid ${project.color}`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {project.title.split(" ")[0]}
          </motion.button>
        ))}
      </motion.div>

      {/* Depth indicators */}
      <div className="absolute top-12 right-12 text-right">
        <motion.div
          className="text-sm font-mono text-accent-gold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          DEPTH LEVEL: {currentProject.depth}
        </motion.div>
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  i < currentProject.depth ? currentProject.color : "#ffffff20",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Mouse position indicator */}
      <motion.div
        className="fixed pointer-events-none"
        animate={{
          x: mousePos.x * 20 - 10,
          y: mousePos.y * 20 - 10,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{
          width: "20px",
          height: "20px",
          border: `2px solid ${currentProject.color}`,
          borderRadius: "50%",
          zIndex: 1000,
        }}
      />
    </div>
  );
};
