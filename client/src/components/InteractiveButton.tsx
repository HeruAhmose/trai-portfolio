import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAudioManager } from '@/hooks/useAudioManager';
import { HolographicEffects } from './HolographicEffects';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  holographic?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  className?: string;
  disabled?: boolean;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  holographic = true,
  soundEnabled = true,
  hapticEnabled = true,
  className = '',
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { playClick, playHover } = useAudioManager(soundEnabled);

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    // Only play hover sound occasionally to reduce audio clutter
    if (Math.random() > 0.5) {
      playHover();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (disabled) return;
    playClick();
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
    onClick?.();
  }; 

  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const buttonContent = (
    <motion.button
      className={`
        relative overflow-hidden rounded-lg font-bold tracking-wider
        transition-all duration-200 transform
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
        shadow-lg hover:shadow-2xl
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background layer */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        animate={isHovered ? { opacity: 0.2 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Neon glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={isHovered ? {
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.2)'
        } : {
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
        }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: 'none' }}
      />

      {/* Text content */}
      <motion.span
        className="relative z-10 block"
        animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.span>

      {/* Particle effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300 rounded-full"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
              }}
              animate={{
                x: `${50 + Math.cos(i * Math.PI * 2 / 3) * 30}%`,
                y: `${50 + Math.sin(i * Math.PI * 2 / 3) * 30}%`,
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );

  return holographic ? (
    <HolographicEffects intensity={isHovered ? 0.8 : 0.3}>
      {buttonContent}
    </HolographicEffects>
  ) : (
    buttonContent
  );
};

export default InteractiveButton;
