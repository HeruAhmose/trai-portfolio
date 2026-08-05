import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Users, Award, Target } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useSessionId } from '@/hooks/useSessionId';

export const GamificationPage: React.FC = () => {
  const sessionId = useSessionId();
  const { data: status } = trpc.gamification.getStatus.useQuery({ sessionId });
  const { data: leaderboard } = trpc.gamification.getLeaderboard.useQuery();
  const { data: allAchievements } = trpc.gamification.getAchievements.useQuery();

  const points = status?.points ?? 0;
  const level = status?.level ?? 1;
  const badges = status?.badges ?? [];
  const progressPercent = ((status?.progressToNextLevel ?? 0) / 100) * 100;

  const categories = ['explorer', 'researcher', 'innovator', 'community', 'tech'];
  const categoryColors: Record<string, string> = {
    explorer: 'text-[#d6a33a] border-[#d6a33a]/30',
    researcher: 'text-[#6ea8da] border-[#6ea8da]/30',
    innovator: 'text-purple-400 border-purple-400/30',
    community: 'text-green-400 border-green-400/30',
    tech: 'text-cyan-400 border-cyan-400/30',
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-[#d6a33a]" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#d6a33a] via-[#f0cc79] to-[#d6a33a] bg-clip-text text-transparent">
              EXPLORER ACHIEVEMENTS
            </h1>
          </div>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Earn points and unlock achievements as you explore the TRAI sovereign technology ecosystem.
          </p>
        </motion.div>

        {/* Your Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Total Points', value: points, icon: <Star className="w-6 h-6" />, color: 'text-[#d6a33a]' },
            { label: 'Current Level', value: `Lv. ${level}`, icon: <Zap className="w-6 h-6" />, color: 'text-[#6ea8da]' },
            { label: 'Badges Earned', value: badges.length, icon: <Award className="w-6 h-6" />, color: 'text-purple-400' },
            { label: 'Achievements', value: `${badges.length}/${allAchievements?.length ?? 0}`, icon: <Target className="w-6 h-6" />, color: 'text-green-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
            >
              <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Level {level} Progress</span>
            <span className="text-[#d6a33a] text-sm">{status?.progressToNextLevel ?? 0} / {status?.nextLevelPoints ?? 100} pts to Level {level + 1}</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d6a33a] to-[#f0cc79] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">All Achievements</h2>
            {categories.map(cat => {
              const catAchievements = (allAchievements ?? []).filter((a: any) => a.category === cat);
              if (!catAchievements.length) return null;
              return (
                <div key={cat} className="mb-6">
                  <h3 className={`text-sm uppercase tracking-wider font-semibold mb-3 ${categoryColors[cat]?.split(' ')[0]}`}>
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catAchievements.map((ach: any) => {
                      const isUnlocked = badges.includes(ach.slug);
                      return (
                        <motion.div
                          key={ach.slug}
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                            isUnlocked
                              ? `bg-[#d6a33a]/10 border-[#d6a33a]/30`
                              : 'bg-white/3 border-white/10 opacity-60'
                          }`}
                        >
                          <span className={`text-2xl ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>{ach.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-white/50'}`}>{ach.title}</span>
                              {isUnlocked && <span className="text-xs text-[#d6a33a]">✓</span>}
                            </div>
                            <p className="text-xs text-white/40 mt-0.5">{ach.description}</p>
                            <span className="text-xs text-[#d6a33a] mt-1 inline-block">+{ach.points} pts</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#d6a33a]" />
              Leaderboard
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {(leaderboard ?? []).slice(0, 10).map((entry: any, i: number) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 ${
                    entry.sessionId.startsWith(sessionId.slice(0, 8)) ? 'bg-[#d6a33a]/10' : ''
                  }`}
                >
                  <span className={`text-sm font-black w-6 text-center ${
                    i === 0 ? 'text-[#d6a33a]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/30'
                  }`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-white/80">{entry.sessionId}</div>
                    <div className="text-xs text-white/40">Level {entry.level}</div>
                  </div>
                  <span className="text-sm font-bold text-[#d6a33a]">{entry.points}</span>
                </div>
              ))}
              {(leaderboard ?? []).length === 0 && (
                <div className="p-8 text-center text-white/40">
                  <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Be the first on the leaderboard!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

