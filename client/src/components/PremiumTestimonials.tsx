import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import '../styles/premiumDesign.css';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Exceptional research and innovation. The quantum-resistant cryptography work is groundbreaking and will shape the future of cybersecurity.',
    author: 'Dr. Sarah Chen',
    role: 'Chief Technology Officer',
    company: 'Quantum Security Labs',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'The self-healing materials research has tremendous potential. Innovative approach with practical applications across multiple industries.',
    author: 'Prof. Michael Rodriguez',
    role: 'Materials Science Lead',
    company: 'Advanced Materials Institute',
    rating: 5,
  },
  {
    id: '3',
    quote:
      'Outstanding work on ambient energy harvesting. The efficiency gains and scalability make this a game-changer for IoT applications.',
    author: 'Jennifer Park',
    role: 'Director of Innovation',
    company: 'SustainTech Ventures',
    rating: 5,
  },
  {
    id: '4',
    quote:
      'Brilliant technical execution combined with visionary thinking. A true pioneer in sovereign technology development.',
    author: 'Dr. James Mitchell',
    role: 'Research Director',
    company: 'Future Systems Lab',
    rating: 5,
  },
];

/**
 * Premium Testimonials Component
 * Cinematic carousel with advanced animations
 */
export const PremiumTestimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-accent-gold/5 to-transparent">
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 100%, rgba(0, 217, 255, 0.05) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <span className="badge-premium mb-4 inline-block">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recognized Excellence
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Industry leaders and experts share their insights on the innovation and impact of
            this research.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <motion.div
            className="card-premium p-8 md:p-12 min-h-80"
            key={activeIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-5 h-5 fill-accent-gold text-accent-gold" />
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.blockquote
              className="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              "{testimonials[activeIndex].quote}"
            </motion.blockquote>

            {/* Author */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-gold to-accent-cyan flex items-center justify-center">
                <span className="text-white font-bold">
                  {testimonials[activeIndex].author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{testimonials[activeIndex].author}</p>
                <p className="text-gray-400 text-sm">
                  {testimonials[activeIndex].role} at {testimonials[activeIndex].company}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-accent-gold w-8'
                    : 'bg-accent-gold/30 w-2 hover:bg-accent-gold/60'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between mt-8">
            <motion.button
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
              }
              className="btn-premium btn-premium-cyan"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Previous
            </motion.button>
            <motion.button
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="btn-premium btn-premium-gold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next →
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
