import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Lightbulb,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useSessionId } from "@/hooks/useSessionId";

const INSIGHT_TOPICS = [
  {
    topic: "AMC composite architecture",
    context: "hemp-derived carbon with crystalline phases",
    icon: "🔬",
  },
  {
    topic: "Quantum sensing at room temperature",
    context: "T2 coherence and NV centers",
    icon: "⚛️",
  },
  {
    topic: "Sovereign technology infrastructure",
    context: "digital equity and community resilience",
    icon: "🏛️",
  },
  {
    topic: "Multi-modal energy harvesting",
    context: "piezoelectric and spin-Seebeck coupling",
    icon: "⚡",
  },
  {
    topic: "Cybersecurity and AI convergence",
    context: "QueenCalifia architecture",
    icon: "🔐",
  },
  {
    topic: "TechBridge community impact",
    context: "digital navigation and workforce development",
    icon: "🌉",
  },
];

export const AIInsightsPage: React.FC = () => {
  const sessionId = useSessionId();
  const [, navigate] = useLocation();
  const [generatingTopic, setGeneratingTopic] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, string>>({});

  const { data: recommendations } = trpc.aiInsights.getRecommendations.useQuery(
    {
      sessionId,
      visitedPages: [],
    }
  );

  const generateInsight = trpc.aiInsights.generateInsight.useMutation({
    onSuccess: (data: { topic: string; insight: unknown }) => {
      setInsights(prev => ({ ...prev, [data.topic]: String(data.insight) }));
      setGeneratingTopic(null);
    },
    onError: () => setGeneratingTopic(null),
  });

  const handleGenerateInsight = (topic: string, context?: string) => {
    if (insights[topic] || generatingTopic) return;
    setGeneratingTopic(topic);
    generateInsight.mutate({ topic, context });
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-[#d6a33a] to-purple-400 bg-clip-text text-transparent">
              AI INSIGHTS
            </h1>
          </div>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            AI-generated insights about the TRAI ecosystem, powered by Claude.
            Click any topic to generate a unique perspective.
          </p>
        </motion.div>

        {/* Recommendations */}
        {(recommendations?.recommendations ?? []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#d6a33a]" />
              <h2 className="text-xl font-bold text-white">
                Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(recommendations?.recommendations ?? [])
                .slice(0, 6)
                .map((rec: any, i: number) => (
                  <motion.button
                    key={rec.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => navigate(rec.url)}
                    className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#d6a33a]/30 hover:bg-[#d6a33a]/5 transition-all text-left group"
                  >
                    <span className="text-2xl">{rec.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white group-hover:text-[#d6a33a] transition-colors">
                        {rec.title}
                      </div>
                      <div className="text-xs text-white/40 mt-1 line-clamp-2">
                        {rec.reason}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#d6a33a] rounded-full"
                            style={{
                              width: `${Math.round(rec.relevanceScore * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/30">
                          {Math.round(rec.relevanceScore * 100)}% match
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#d6a33a] flex-shrink-0 transition-colors" />
                  </motion.button>
                ))}
            </div>
          </motion.div>
        )}

        {/* AI Insight Generator */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Generate AI Insights
            </h2>
            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
              Powered by Claude
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INSIGHT_TOPICS.map((item, i) => (
              <motion.div
                key={item.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    handleGenerateInsight(item.topic, item.context)
                  }
                  disabled={!!generatingTopic}
                  className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left group disabled:opacity-50"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {item.topic}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      {item.context}
                    </div>
                  </div>
                  {generatingTopic === item.topic ? (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
                  ) : insights[item.topic] ? (
                    <Lightbulb className="w-4 h-4 text-[#d6a33a] flex-shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white/20 group-hover:text-purple-400 flex-shrink-0 transition-colors" />
                  )}
                </button>
                {insights[item.topic] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-4 pb-4 border-t border-white/5"
                  >
                    <p className="text-sm text-white/70 mt-3 leading-relaxed italic">
                      "{insights[item.topic]}"
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
