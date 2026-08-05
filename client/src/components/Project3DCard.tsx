import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code2 } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  link?: string;
  github?: string;
  year: number;
  impact?: string;
}

interface Project3DCardProps {
  project: Project;
  onClick?: () => void;
}

export const Project3DCard: React.FC<Project3DCardProps> = ({ project, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="h-96 cursor-pointer perspective"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateY: isFlipped ? 180 : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="w-full h-full relative"
      >
        {/* Front of card */}
        <div
          style={{
            backfaceVisibility: 'hidden',
          }}
          className="absolute w-full h-full"
        >
          <div className="afro-tech-card h-full flex flex-col justify-between p-6 relative overflow-hidden group">
            {/* Background image with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              style={{ backgroundImage: `url(${project.image})` }}
            />

            {/* Content overlay */}
            <div className="relative z-10 space-y-4">
              {/* Category badge */}
              <motion.div
                className="inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-afro-gold bg-afro-gold/20 px-3 py-1 rounded-full">
                  {project.category}
                </span>
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-afro-gold leading-tight">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-foreground/80 text-sm line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Footer with year and tech count */}
            <div className="relative z-10 flex justify-between items-center pt-4 border-t border-afro-gold/30">
              <span className="text-xs text-foreground/60">{project.year}</span>
              <span className="text-xs text-afro-emerald font-semibold">
                {project.technologies.length} tech stack
              </span>
            </div>

            {/* Hover indicator */}
            <motion.div
              className="absolute bottom-4 right-4 text-afro-gold"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Back of card */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute w-full h-full"
        >
          <div className="afro-tech-card h-full flex flex-col justify-between p-6 bg-gradient-to-br from-afro-sapphire/20 to-afro-terracotta/20">
            {/* Technologies */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-afro-emerald uppercase tracking-wider">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={i}
                    className="text-xs bg-afro-gold/20 text-afro-gold px-2 py-1 rounded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Long description */}
            <div className="space-y-3">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {project.longDescription}
              </p>

              {project.impact && (
                <div className="pt-2 border-t border-afro-gold/30">
                  <p className="text-xs text-afro-emerald font-semibold">
                    Impact: {project.impact}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-afro-gold bg-afro-gold/20 hover:bg-afro-gold/30 px-3 py-2 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit
                </motion.a>
              )}

              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-afro-emerald bg-afro-emerald/20 hover:bg-afro-emerald/30 px-3 py-2 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-3 h-3" />
                  Code
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Project3DCard;
