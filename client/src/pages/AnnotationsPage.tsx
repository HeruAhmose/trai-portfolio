import React from 'react';
import { motion } from 'framer-motion';
import { CollaborativeAnnotation } from '@/components/CollaborativeAnnotation';

export const AnnotationsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Collaborative Annotations</h1>
          <p className="text-cyan-200/60">Mark up research visualizations and share findings in real-time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CollaborativeAnnotation />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="p-6 bg-black/50 rounded-lg border border-cyan-400/20">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">How to Use</h2>
            <ol className="space-y-2 text-sm text-cyan-200/70 list-decimal list-inside">
              <li>Click anywhere on the canvas to select an annotation position</li>
              <li>Type your annotation text in the input field</li>
              <li>Press Enter or click "Add Annotation" to save</li>
              <li>Hover over annotations to see details</li>
              <li>View all annotations in the list below</li>
            </ol>
          </div>

          <div className="p-6 bg-black/50 rounded-lg border border-cyan-400/20">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">Features</h2>
            <ul className="space-y-2 text-sm text-cyan-200/70 list-disc list-inside">
              <li>Color-coded annotations for visual organization</li>
              <li>Author tracking and timestamps</li>
              <li>Persistent annotation storage</li>
              <li>Multi-user collaboration ready</li>
              <li>Grid background for precise positioning</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
