import React from 'react';
import { VideoBackgroundSection } from '../components/VideoBackgroundSection';
import { motion } from 'framer-motion';

/**
 * Video Project Showcase
 * Cinematic video backgrounds for each project section
 */

export const VideoProjectShowcase: React.FC = () => {
  // Video URLs - replace with actual cinematic video URLs
  const videos = {
    quantum: 'https://media.example.com/quantum-research.mp4',
    materials: 'https://media.example.com/materials-science.mp4',
    community: 'https://media.example.com/community-impact.mp4',
  };

  return (
    <div className="w-full bg-background">
      {/* Quantum Computing Section */}
      <VideoBackgroundSection
        videoUrl={videos.quantum}
        title="Quantum Frontiers"
        subtitle="QUANTUM COMPUTING RESEARCH"
        description="Exploring the boundaries of quantum computation and cryptography. Pushing the limits of what's possible at the quantum scale."
        color="#00d9ff"
      >
        <motion.div
          className="flex gap-6 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button className="px-8 py-3 rounded-lg border-2 border-accent-cyan text-accent-cyan font-bold hover:bg-accent-cyan/10 transition-all">
            View Research
          </button>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-gold text-black font-bold hover:shadow-lg transition-all">
            Explore Details
          </button>
        </motion.div>
      </VideoBackgroundSection>

      {/* Materials Science Section */}
      <VideoBackgroundSection
        videoUrl={videos.materials}
        title="Material Innovation"
        subtitle="MATERIALS SCIENCE ADVANCEMENT"
        description="Engineering novel materials for sustainable energy storage and advanced applications. Transforming atoms into solutions."
        color="#d4af37"
      >
        <motion.div
          className="flex gap-6 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button className="px-8 py-3 rounded-lg border-2 border-accent-gold text-accent-gold font-bold hover:bg-accent-gold/10 transition-all">
            View Patents
          </button>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-accent-cyan text-black font-bold hover:shadow-lg transition-all">
            Learn More
          </button>
        </motion.div>
      </VideoBackgroundSection>

      {/* Community Impact Section */}
      <VideoBackgroundSection
        videoUrl={videos.community}
        title="Community Impact"
        subtitle="TECHNOLOGY FOR HUMANITY"
        description="Building open-source platforms that empower communities. Technology that serves people and creates meaningful change."
        color="#ff006e"
      >
        <motion.div
          className="flex gap-6 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button className="px-8 py-3 rounded-lg border-2 border-accent-magenta text-accent-magenta font-bold hover:bg-accent-magenta/10 transition-all">
            View Platform
          </button>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-accent-magenta to-accent-cyan text-black font-bold hover:shadow-lg transition-all">
            Get Involved
          </button>
        </motion.div>
      </VideoBackgroundSection>

      {/* Integration Guide */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-black px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-accent-gold via-accent-cyan to-accent-magenta bg-clip-text text-transparent">
              Video Integration Guide
            </h2>
            <p className="text-xl text-gray-400">
              To use cinematic video backgrounds, replace the video URLs with your own
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 border-2 border-accent-gold/30 rounded-lg p-8 font-mono text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-accent-gold mb-4">// Replace video URLs in VideoProjectShowcase.tsx</p>
            <p className="text-gray-300 mb-2">
              const videos = {'{'}
            </p>
            <p className="text-gray-300 ml-4 mb-2">
              quantum: 'https://your-cdn.com/quantum-video.mp4',
            </p>
            <p className="text-gray-300 ml-4 mb-2">
              materials: 'https://your-cdn.com/materials-video.mp4',
            </p>
            <p className="text-gray-300 ml-4 mb-2">
              community: 'https://your-cdn.com/community-video.mp4',
            </p>
            <p className="text-gray-300">
              {'}'}
            </p>

            <p className="text-accent-cyan mt-6 mb-2">// Video specifications:</p>
            <p className="text-gray-300 ml-4">• Resolution: 1920x1080 (Full HD)</p>
            <p className="text-gray-300 ml-4">• Format: MP4 (H.264)</p>
            <p className="text-gray-300 ml-4">• Duration: 10-30 seconds (looping)</p>
            <p className="text-gray-300 ml-4">• File size: &lt;50MB for optimal performance</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VideoProjectShowcase;
