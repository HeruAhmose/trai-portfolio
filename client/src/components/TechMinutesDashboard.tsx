import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TechMinutesDashboardProps {
  isActive: boolean;
}

const impactData = [
  { month: 'Jan', minutes: 240, residents: 32 },
  { month: 'Feb', minutes: 380, residents: 52 },
  { month: 'Mar', minutes: 520, residents: 78 },
  { month: 'Apr', minutes: 680, residents: 95 },
  { month: 'May', minutes: 890, residents: 128 },
  { month: 'Jun', minutes: 1200, residents: 165 },
];

const categoryData = [
  { category: 'Education', minutes: 340, color: '#ffd700' },
  { category: 'Workforce', minutes: 280, color: '#00d9ff' },
  { category: 'Health', minutes: 220, color: '#ff00ff' },
  { category: 'Housing', minutes: 160, color: '#00ff88' },
];

export default function TechMinutesDashboard({ isActive }: TechMinutesDashboardProps) {
  const [animatedStats, setAnimatedStats] = useState({
    totalMinutes: 0,
    residentsServed: 0,
    averageResolution: 0,
  });

  useEffect(() => {
    if (!isActive) return;

    const targets = {
      totalMinutes: 3710,
      residentsServed: 550,
      averageResolution: 87,
    };

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedStats({
        totalMinutes: Math.floor(targets.totalMinutes * progress),
        residentsServed: Math.floor(targets.residentsServed * progress),
        averageResolution: Math.floor(targets.averageResolution * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isActive]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      transition={{ duration: 0.6 }}
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL TECHMINUTES', value: animatedStats.totalMinutes, suffix: '' },
          { label: 'RESIDENTS SERVED', value: animatedStats.residentsServed, suffix: '' },
          { label: 'RESOLUTION RATE', value: animatedStats.averageResolution, suffix: '%' },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            className="p-6 rounded border border-primary bg-card neon-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <p className="text-xs font-mono text-muted-foreground tracking-widest mb-2">
              {metric.label}
            </p>
            <motion.div className="text-4xl font-bold text-primary neon-text">
              {metric.value.toLocaleString()}
              <span className="text-2xl">{metric.suffix}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Over Time */}
        <motion.div
          className="p-6 rounded border border-border bg-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-foreground mb-4">IMPACT TRAJECTORY</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 215, 0, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(224, 224, 224, 0.5)" />
              <YAxis stroke="rgba(224, 224, 224, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 14, 39, 0.9)',
                  border: '1px solid #ffd700',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: '#e0e0e0' }}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#ffd700"
                strokeWidth={2}
                dot={{ fill: '#ffd700', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          className="p-6 rounded border border-border bg-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-foreground mb-4">CATEGORY BREAKDOWN</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 215, 0, 0.1)" />
              <XAxis dataKey="category" stroke="rgba(224, 224, 224, 0.5)" />
              <YAxis stroke="rgba(224, 224, 224, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 14, 39, 0.9)',
                  border: '1px solid #ffd700',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: '#e0e0e0' }}
              />
              <Bar dataKey="minutes" fill="#ffd700" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Impact Stories */}
      <motion.div
        className="p-6 rounded border border-border bg-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-bold text-foreground mb-4">IMPACT STORIES</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Maria',
              category: 'EDUCATION',
              story: 'School portal password reset, bookmark setup, physical backup card created. Resolved.',
              time: '18 min',
            },
            {
              name: 'James',
              category: 'WORKFORCE',
              story: 'VA job application: account creation, draft-save strategy, DD-214 upload. Partial — follow-up scheduled.',
              time: '35 min',
            },
            {
              name: 'Dorothy',
              category: 'HEALTH',
              story: 'Apple ID reset, health portal app install, first telehealth appointment booked. Resolved.',
              time: '40 min',
            },
            {
              name: 'Carlos',
              category: 'HOUSING',
              story: 'Phone document scanner setup, housing application upload, screenshot confirmation. Resolved.',
              time: '22 min',
            },
          ].map((story, idx) => (
            <motion.div
              key={idx}
              className="p-4 rounded border border-border bg-background"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-foreground">{story.name}</h4>
                  <p className="text-xs font-mono text-primary">{story.category}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{story.time}</span>
              </div>
              <p className="text-sm text-foreground/80">{story.story}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        className="p-4 rounded border border-border bg-card text-sm text-foreground/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="font-mono text-xs text-muted-foreground mb-2">MISSION STATEMENT</p>
        <p>
          TechBridge Collective builds bridges of access, dignity, and opportunity through human-centered digital help. Every TechMinute represents a life changed—a parent reconnecting with their child's education, a veteran rebuilding their career, a senior accessing healthcare. We measure impact not in metrics, but in moments.
        </p>
      </motion.div>
    </motion.div>
  );
}
