import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp, Award, Clock } from "lucide-react";

interface MetricData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface CaseStudy {
  id: string;
  title: string;
  category: "cybersecurity" | "materials" | "community" | "research";
  client?: string;
  timeline: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: MetricData[];
  tags: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  results: {
    title: string;
    description: string;
  }[];
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  isExpanded: boolean;
  onToggle: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "cybersecurity":
      return "from-primary to-primary/50";
    case "materials":
      return "from-cyan-400 to-cyan-400/50";
    case "community":
      return "from-yellow-400 to-yellow-400/50";
    case "research":
      return "from-green-400 to-green-400/50";
    default:
      return "from-primary to-primary/50";
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "cybersecurity":
      return "🔒 Cybersecurity";
    case "materials":
      return "⚗️ Material Science";
    case "community":
      return "🤝 Community Impact";
    case "research":
      return "📚 Research";
    default:
      return category;
  }
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  isExpanded,
  onToggle,
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  return (
    <motion.div
      layout
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Main Card */}
      <motion.button
        onClick={onToggle}
        className={`w-full text-left rounded-xl border-2 transition-all duration-300 overflow-hidden ${
          isExpanded
            ? "border-primary bg-primary/10 shadow-lg shadow-primary/30"
            : "border-primary/30 bg-background/50 hover:border-primary/60 hover:bg-background/70"
        }`}
        style={{
          boxShadow: isExpanded
            ? "0 0 30px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.1)"
            : "none",
        }}
      >
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Category Badge */}
              <div className="inline-block mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getCategoryColor(
                    caseStudy.category
                  )} text-background`}
                >
                  {getCategoryLabel(caseStudy.category)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {caseStudy.title}
              </h3>

              {/* Context & stage */}
              <div className="flex flex-wrap gap-4 text-sm text-foreground/70 mb-4">
                {caseStudy.client && (
                  <div className="flex items-center gap-2">
                    <Award size={16} />
                    <span>{caseStudy.client}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{caseStudy.timeline}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-2 py-1 rounded text-xs bg-primary/20 text-primary border border-primary/30"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Expand Button */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-primary flex-shrink-0 ml-4"
            >
              <ChevronDown size={24} />
            </motion.div>
          </div>

          {/* Quick Metrics Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-primary/20">
            {caseStudy.metrics.slice(0, 4).map((metric, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredMetric(idx)}
                onMouseLeave={() => setHoveredMetric(null)}
                whileHover={{ scale: 1.05 }}
                className="text-center p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <div className={`text-${metric.color} mb-1`}>{metric.icon}</div>
                <p className="text-xs text-foreground/60">{metric.label}</p>
                <p className="text-sm font-bold text-primary">{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <div className="p-6 rounded-xl border border-primary/30 bg-background/50 backdrop-blur-sm space-y-6">
              {/* Challenge Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Challenge
                </h4>
                <p className="text-foreground/80 leading-relaxed">
                  {caseStudy.challenge}
                </p>
              </motion.div>

              {/* Solution Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Proposed approach
                </h4>
                <p className="text-foreground/80 leading-relaxed">
                  {caseStudy.solution}
                </p>
              </motion.div>

              {/* Evidence boundary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Evidence boundary
                </h4>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  {caseStudy.impact}
                </p>

                {/* Required gates */}
                <div className="grid md:grid-cols-2 gap-3">
                  {caseStudy.results.map((result, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="p-3 rounded-lg border border-primary/20 bg-background/50"
                    >
                      <p className="font-semibold text-primary text-sm mb-1">
                        {result.title}
                      </p>
                      <p className="text-xs text-foreground/70">
                        {result.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Full Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Documented facts & plan markers
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {caseStudy.metrics.map((metric, idx) => (
                    <motion.div
                      key={idx}
                      onMouseEnter={() => setHoveredMetric(idx)}
                      onMouseLeave={() => setHoveredMetric(null)}
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        hoveredMetric === idx
                          ? `border-primary bg-primary/10`
                          : "border-primary/20 bg-background/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-foreground/70">
                          {metric.label}
                        </p>
                        <div className={`text-${metric.color}`}>
                          {metric.icon}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {metric.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonial */}
              {caseStudy.testimonial && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-lg border-l-4 border-primary bg-primary/5 italic"
                >
                  <p className="text-foreground/80 mb-3">
                    "{caseStudy.testimonial.quote}"
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    — {caseStudy.testimonial.author}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {caseStudy.testimonial.role}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CaseStudyCard;
