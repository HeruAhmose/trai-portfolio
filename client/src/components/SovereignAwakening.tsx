import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AwakeningStatus {
  label: string;
  status: 'waiting' | 'processing' | 'complete';
}

interface SovereignAwakeningProps {
  onComplete: () => void;
}

export default function SovereignAwakening({ onComplete }: SovereignAwakeningProps) {
  const [statuses, setStatuses] = useState<AwakeningStatus[]>([
    { label: 'HEX MESH', status: 'waiting' },
    { label: 'AURA', status: 'waiting' },
    { label: 'VOICE', status: 'waiting' },
    { label: 'TRANSITION MATRIX', status: 'waiting' },
  ]);
  const [isComplete, setIsComplete] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);

  useEffect(() => {
    if (skipClicked) {
      setIsComplete(true);
      onComplete();
      return;
    }

    const timings = [
      { index: 0, delay: 500 },
      { index: 1, delay: 1200 },
      { index: 2, delay: 1900 },
      { index: 3, delay: 2600 },
    ];

    const timeouts = timings.map(({ index, delay }) =>
      setTimeout(() => {
        setStatuses((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], status: 'processing' };
          return updated;
        });

        setTimeout(() => {
          setStatuses((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], status: 'complete' };
            return updated;
          });

          if (index === 3) {
            setTimeout(() => {
              setIsComplete(true);
              onComplete();
            }, 800);
          }
        }, 600);
      }, delay)
    );

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [skipClicked, onComplete]);

  const getStatusColor = (status: AwakeningStatus['status']) => {
    switch (status) {
      case 'waiting':
        return 'text-muted-foreground';
      case 'processing':
        return 'text-cyan-400 animate-pulse';
      case 'complete':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusSymbol = (status: AwakeningStatus['status']) => {
    switch (status) {
      case 'waiting':
        return '◯';
      case 'processing':
        return '◐';
      case 'complete':
        return '◉';
      default:
        return '◯';
    }
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 bg-background space-bg flex flex-col items-center justify-center z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                }}
                animate={{
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: Math.max(0.1, 3 + Math.random() * 2),
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: Math.max(0, Math.random() * 2),
                  type: 'tween',
                }}
              />
            ))}
          </div>

          {/* Central Circle */}
          <motion.div
            className="relative w-32 h-32 mb-16"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute inset-0 border-2 border-primary rounded-full animate-spin-slow"
            />
            <div
              className="absolute inset-4 border border-primary rounded-full opacity-50 animate-spin-reverse"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary neon-text">◉</div>
              </div>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <div className="space-y-4 mb-16 text-center">
            <motion.h1
              className="text-3xl font-bold text-primary tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              SOVEREIGN AWAKENING SEQUENCE
            </motion.h1>

            <div className="space-y-3 mt-8">
              {statuses.map((status, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center justify-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <span className={`text-lg font-mono ${getStatusColor(status.status)}`}>
                    {getStatusSymbol(status.status)}
                  </span>
                  <span className={`font-mono text-sm tracking-widest ${getStatusColor(status.status)}`}>
                    {status.label}
                  </span>
                  <span className={`text-xs font-mono ${getStatusColor(status.status)}`}>
                    {status.status === 'waiting' && 'WAITING'}
                    {status.status === 'processing' && 'PROCESSING'}
                    {status.status === 'complete' && 'COMPLETE'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skip Button */}
          <motion.button
            onClick={() => setSkipClicked(true)}
            className="px-6 py-2 border border-primary text-primary font-mono text-sm hover:bg-primary hover:text-background transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SKIP SEQUENCE
          </motion.button>

          {/* Bottom Text */}
          <motion.p
            className="absolute bottom-8 text-xs font-mono text-muted-foreground tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            CLICK TO AWAKEN
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
