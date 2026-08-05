import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface VisitorActivity {
  userId: string;
  username: string;
  action: 'gesture' | 'click' | 'view' | 'interaction';
  gestureType?: string;
  page?: string;
  timestamp: number;
  coordinates?: { x: number; y: number };
}

export interface RealtimeStats {
  activeVisitors: number;
  totalGestures: number;
  averageSessionDuration: number;
  currentPage: string;
  lastUpdate: number;
}

export interface CollaborationEvent {
  type: 'visitor_joined' | 'visitor_left' | 'gesture_detected' | 'page_viewed' | 'interaction';
  username?: string;
  gesture?: string;
  page?: string;
  timestamp: number;
}

export const useRealtimeCollaboration = (userId: string, username: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<CollaborationEvent[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketURL = process.env.VITE_SOCKET_URL || window.location.origin;
    const newSocket = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Collaboration] Connected to WebSocket');
      setIsConnected(true);

      // Notify server of visitor join
      newSocket.emit('visitor:join', {
        userId,
        username,
        page: window.location.pathname,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('[Collaboration] Disconnected from WebSocket');
      setIsConnected(false);
    });

    newSocket.on('collaboration:stats', (data: RealtimeStats) => {
      setStats(data);
      setActiveVisitors(data.activeVisitors);
    });

    newSocket.on('collaboration:activity', (data: unknown) => {
      if (typeof data === 'object' && data !== null && 'activeCount' in data) {
        setActiveVisitors((data as { activeCount: number }).activeCount);
      }
    });

    newSocket.on('collaboration:gesture', (data: CollaborationEvent) => {
      setRecentEvents((prev) => [...prev.slice(-49), data]);
    });

    newSocket.on('collaboration:page_view', (data: CollaborationEvent) => {
      setRecentEvents((prev) => [...prev.slice(-49), data]);
    });

    newSocket.on('collaboration:history', (history: CollaborationEvent[]) => {
      setRecentEvents(history);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, username]);

  // Report gesture detection
  const reportGesture = useCallback(
    (gestureType: string, coordinates?: { x: number; y: number }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('gesture:detected', {
          gestureType,
          page: window.location.pathname,
          coordinates,
        });
      }
    },
    []
  );

  // Report page view
  const reportPageView = useCallback((page: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('page:viewed', { page });
    }
  }, []);

  // Report interaction
  const reportInteraction = useCallback((type: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('interaction:occurred', {
        type,
        page: window.location.pathname,
      });
    }
  }, []);

  // Request stats update
  const requestStats = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('stats:request');
    }
  }, []);

  // Request activity history
  const requestHistory = useCallback((limit: number = 50) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('history:request', limit);
    }
  }, []);

  return {
    isConnected,
    stats,
    recentEvents,
    activeVisitors,
    reportGesture,
    reportPageView,
    reportInteraction,
    requestStats,
    requestHistory,
  };
};
