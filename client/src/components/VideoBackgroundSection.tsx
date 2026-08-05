import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Video Background Section Component
 * Displays cinematic video backgrounds with overlay content
 */

interface VideoBackgroundProps {
  videoUrl: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  children?: React.ReactNode;
}

export const VideoBackgroundSection: React.FC<VideoBackgroundProps> = ({
  videoUrl,
  title,
  subtitle,
  description,
  color,
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    const handleError = () => {
      setVideoError(true);
      console.warn(`Failed to load video: ${videoUrl}`);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Attempt to load video
    video.src = videoUrl;
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        {!videoError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            style={{
              opacity: isVideoLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
          />
        ) : (
          // Fallback gradient if video fails to load
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${color}20 0%, ${color}10 50%, transparent 100%)`,
            }}
          />
        )}

        {/* Overlay gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse at center,
              rgba(0, 0, 0, 0.3) 0%,
              rgba(0, 0, 0, 0.6) 50%,
              rgba(0, 0, 0, 0.8) 100%
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        <motion.div
          className="max-w-3xl text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Accent line */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ width: 0 }}
            whileInView={{ width: '60px' }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div
              className="h-1 rounded-full"
              style={{ backgroundColor: color }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-sm font-mono tracking-widest mb-4"
            style={{ color }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>

          {/* Title */}
          <motion.h2
            className="text-7xl font-black mb-6 text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-200 mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {description}
          </motion.p>

          {/* Children (additional content) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>

      {/* Video status indicator */}
      {!isVideoLoaded && !videoError && (
        <div className="absolute top-4 right-4 z-20">
          <div className="text-xs font-mono text-accent-gold animate-pulse">
            LOADING VIDEO...
          </div>
        </div>
      )}
    </section>
  );
};

/**
 * Create placeholder video URLs using data URIs
 * In production, replace with actual video URLs
 */
export const createPlaceholderVideoUrl = (color: string): string => {
  // Create a simple animated canvas video as placeholder
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Draw gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color + '40');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('video/mp4');
};
