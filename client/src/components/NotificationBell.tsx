import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface NotificationBellProps {
  sessionId: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, refetch } = trpc.notifications.getAll.useQuery(
    { sessionId, limit: 20 },
    { refetchInterval: 30000 } // Poll every 30s
  );

  const markRead = trpc.notifications.markRead.useMutation({ onSuccess: () => refetch() });
  const markAllRead = trpc.notifications.markAllRead.useMutation({ onSuccess: () => refetch() });

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-[#d6a33a]';
      case 'milestone': return 'text-[#1f66ad]';
      case 'ai_insight': return 'text-purple-400';
      case 'engagement': return 'text-green-400';
      default: return 'text-white/60';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'milestone': return '🎯';
      case 'ai_insight': return '🤖';
      case 'engagement': return '⚡';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/60 hover:text-[#d6a33a] transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d6a33a] text-black text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[#0a0d10] border border-[#d6a33a]/20 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#d6a33a]/10">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead.mutate({ sessionId })}
                      className="text-xs text-[#d6a33a] hover:text-[#f0cc79] transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notifications list */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-white/40">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                    <p className="text-xs mt-1">Explore the portfolio to earn achievements!</p>
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-[#d6a33a]/5' : ''}`}
                    >
                      <span className="text-lg mt-0.5">{getTypeIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${getTypeColor(notif.type)}`}>{notif.title}</p>
                        <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-white/30 mt-1">
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <button
                          onClick={() => markRead.mutate({ id: notif.id })}
                          className="text-white/30 hover:text-[#d6a33a] transition-colors flex-shrink-0"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
