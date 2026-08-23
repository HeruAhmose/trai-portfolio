import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, ChevronUp, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { STATIC_MODE } from '@/lib/staticLink';

interface GamificationHUDProps {
  sessionId: string;
}

export const GamificationHUD: React.FC<GamificationHUDProps> = ({ sessionId }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data } = trpc.gamification.getStatus.useQuery(
    { sessionId },
    {
      refetchInterval: STATIC_MODE ? false : 15000,
      retry: STATIC_MODE ? false : 3,
    }
  );

  const points = data?.points ?? 0;
  const level = data?.level ?? 1;
  const badges = data?.badges ?? [];
  const progressToNext = data?.progressToNextLevel ?? 0;
  const nextLevelPoints = data?.nextLevelPoints ?? 100;
  const achievements = data?.availableAchievements ?? [];
  const unlockedAchievements = data?.achievements ?? [];

  const progressPercent = (progressToNext / 100) * 100;

  return (
    <div className="fixed bottom-20 left-4 z-40">
      {/* Compact HUD */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-[#0a0d10]/90 border border-[#d6a33a]/30 rounded-full px-3 py-2 backdrop-blur-md hover:border-[#d6a33a]/60 transition-all shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Trophy className="w-4 h-4 text-[#d6a33a]" />
        <span className="text-sm font-bold text-[#d6a33a]">{points}</span>
        <span className="text-xs text-white/50">Lv.{level}</span>
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#d6a33a] to-[#f0cc79]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <ChevronUp className={`w-3 h-3 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full left-0 mb-2 w-72 bg-[#0a0d10]/95 border border-[#d6a33a]/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#d6a33a]/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#d6a33a]" />
                <span className="text-sm font-bold text-white">Explorer Status</span>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-white/30 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 grid grid-cols-3 gap-3 border-b border-white/5">
              <div className="text-center">
                <div className="text-xl font-black text-[#d6a33a]">{points}</div>
                <div className="text-xs text-white/40">Points</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-[#6ea8da]">Lv.{level}</div>
                <div className="text-xs text-white/40">Level</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-[#2f765d]">{badges.length}</div>
                <div className="text-xs text-white/40">Badges</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 py-3 border-b border-white/5">
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>Level {level}</span>
                <span>{progressToNext}/{nextLevelPoints} to Level {level + 1}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#d6a33a] to-[#f0cc79] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Recent Badges */}
            {badges.length > 0 && (
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Earned Badges</p>
                <div className="flex flex-wrap gap-1.5">
                  {badges.slice(0, 6).map((badge: string) => {
                    const ach = achievements.find((a: any) => a.slug === badge);
                    return (
                      <span key={badge} title={ach?.title ?? badge} className="text-lg cursor-help">
                        {ach?.icon ?? '🏅'}
                      </span>
                    );
                  })}
                  {badges.length > 6 && (
                    <span className="text-xs text-white/40 self-center">+{badges.length - 6} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Next achievements */}
            <div className="px-4 py-3">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Next Achievements</p>
              <div className="space-y-1.5">
                {achievements
                  .filter((a: any) => !badges.includes(a.slug))
                  .slice(0, 3)
                  .map((ach: any) => (
                    <div key={ach.slug} className="flex items-center gap-2 text-xs text-white/50">
                      <span>{ach.icon}</span>
                      <span className="flex-1">{ach.title}</span>
                      <span className="text-[#d6a33a]">+{ach.points}pts</span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
