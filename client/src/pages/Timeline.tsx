import { motion } from 'framer-motion';
import InteractiveTimeline from '@/components/InteractiveTimeline';

export default function Timeline() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <InteractiveTimeline />
      </div>
    </motion.div>
  );
}
