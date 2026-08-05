import React from 'react';
import { motion } from 'framer-motion';
import { AdvancedDataDashboard } from '@/components/AdvancedDataDashboard';

export const DataDashboardPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Research Data Dashboard</h1>
          <p className="text-cyan-200/60">Real-time visualization of advanced materials research metrics</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AdvancedDataDashboard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 bg-black/50 rounded-lg border border-cyan-400/20"
        >
          <h2 className="text-lg font-bold text-cyan-400 mb-4">About This Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-cyan-200/70">
            <div>
              <div className="font-bold text-cyan-300 mb-2">Piezoelectric Performance</div>
              <p>Voltage output across different composite formulations (A-D), showing optimization progress toward target performance.</p>
            </div>
            <div>
              <div className="font-bold text-cyan-300 mb-2">Thermoelectric Curves</div>
              <p>ZT (Figure of Merit) vs Temperature, comparing Tamerian composites with commercial Bi₂Te₃ reference material.</p>
            </div>
            <div>
              <div className="font-bold text-cyan-300 mb-2">Electrical Conductivity</div>
              <p>Hemp-derived carbon content impact on conductivity, showing percolation threshold at ~15% carbon content.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
