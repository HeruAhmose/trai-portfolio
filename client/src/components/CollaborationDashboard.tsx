import React, { useEffect } from 'react';
import { useRealtimeCollaboration, type CollaborationEvent } from '@/hooks/useRealtimeCollaboration';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const CollaborationDashboard = () => {
  const { data: user } = trpc.auth.me.useQuery();
  const {
    isConnected,
    stats,
    recentEvents,
    activeVisitors,
    requestStats,
    requestHistory,
  } = useRealtimeCollaboration(
    user?.id?.toString() || 'anonymous',
    user?.name || 'Anonymous Visitor'
  );

  useEffect(() => {
    requestStats();
    requestHistory(50);

    const interval = setInterval(() => {
      requestStats();
    }, 5000);

    return () => clearInterval(interval);
  }, [requestStats, requestHistory]);

  const getEventIcon = (event: CollaborationEvent) => {
    switch (event.type) {
      case 'visitor_joined':
        return '👤';
      case 'visitor_left':
        return '👋';
      case 'gesture_detected':
        return '👆';
      case 'page_viewed':
        return '👁️';
      case 'interaction':
        return '✨';
      default:
        return '•';
    }
  };

  const getEventDescription = (event: CollaborationEvent) => {
    switch (event.type) {
      case 'visitor_joined':
        return `${event.username} joined`;
      case 'visitor_left':
        return `${event.username} left`;
      case 'gesture_detected':
        return `${event.username} performed ${event.gesture}`;
      case 'page_viewed':
        return `${event.username} viewed ${event.page}`;
      case 'interaction':
        return `${event.username} interacted with the portfolio`;
      default:
        return 'Unknown event';
    }
  };

  return (
    <div className="w-full space-y-6 p-6">
      {/* Connection Status */}
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-lime-500 animate-pulse' : 'bg-red-500'
          }`}
        />
        <span className="text-sm font-medium">
          {isConnected ? 'Connected to Collaboration Server' : 'Disconnected'}
        </span>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-neon-cyan/30 bg-deep-blue/50">
            <div className="text-xs text-muted-foreground mb-1">Active Visitors</div>
            <div className="text-2xl font-bold text-cyan">{stats.activeVisitors}</div>
          </Card>

          <Card className="p-4 border-neon-pink/30 bg-deep-blue/50">
            <div className="text-xs text-muted-foreground mb-1">Total Gestures</div>
            <div className="text-2xl font-bold text-neon-pink">{stats.totalGestures}</div>
          </Card>

          <Card className="p-4 border-gold/30 bg-deep-blue/50">
            <div className="text-xs text-muted-foreground mb-1">Current Page</div>
            <div className="text-sm font-bold text-gold truncate">{stats.currentPage}</div>
          </Card>

          <Card className="p-4 border-lime/30 bg-deep-blue/50">
            <div className="text-xs text-muted-foreground mb-1">Avg Session</div>
            <div className="text-2xl font-bold text-lime">{stats.averageSessionDuration}s</div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card className="p-6 border-neon-cyan/30 bg-deep-blue/50">
        <h3 className="text-lg font-bold text-cyan mb-4">Recent Activity</h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <span className="text-xl">{getEventIcon(event)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {getEventDescription(event)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {event.type === 'gesture_detected' && (
                  <Badge variant="outline" className="text-xs">
                    {event.gesture}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Visitor Count Badge */}
      <div className="flex items-center justify-center">
        <Badge
          variant="outline"
          className="px-4 py-2 border-neon-pink text-neon-pink bg-neon-pink/10"
        >
          {activeVisitors} {activeVisitors === 1 ? 'visitor' : 'visitors'} online
        </Badge>
      </div>
    </div>
  );
};
