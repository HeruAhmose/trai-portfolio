import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import type { Socket } from 'socket.io';

export interface VisitorActivity {
  userId: string;
  username: string;
  action: 'gesture' | 'click' | 'view' | 'interaction';
  gestureType?: string;
  page?: string;
  timestamp: number;
  coordinates?: { x: number; y: number };
}

export interface CollaborationEvent {
  type: 'visitor_joined' | 'visitor_left' | 'gesture_detected' | 'page_viewed' | 'interaction';
  data: VisitorActivity;
  timestamp: number;
}

export interface RealtimeStats {
  activeVisitors: number;
  totalGestures: number;
  averageSessionDuration: number;
  currentPage: string;
  lastUpdate: number;
}

class WebSocketManager {
  private io: SocketIOServer | null = null;
  private activeVisitors = new Map<string, VisitorActivity>();
  private activityHistory: CollaborationEvent[] = [];
  private maxHistorySize = 1000;

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
    console.log('[WebSocket] Initialized with Socket.io');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      // Handle visitor join
      socket.on('visitor:join', (data: { userId: string; username: string; page: string }) => {
        const activity: VisitorActivity = {
          userId: data.userId,
          username: data.username,
          action: 'view',
          page: data.page,
          timestamp: Date.now(),
        };

        this.activeVisitors.set(socket.id, activity);
        this.recordEvent({
          type: 'visitor_joined',
          data: activity,
          timestamp: Date.now(),
        });

        // Broadcast to all clients
        this.io?.emit('collaboration:activity', {
          type: 'visitor_joined',
          data: activity,
          activeCount: this.activeVisitors.size,
        });

        // Send current stats to new visitor
        socket.emit('collaboration:stats', this.getStats());
      });

      // Handle gesture detection
      socket.on('gesture:detected', (data: { gestureType: string; page: string; coordinates?: { x: number; y: number } }) => {
        const visitor = this.activeVisitors.get(socket.id);
        if (!visitor) return;

        const activity: VisitorActivity = {
          ...visitor,
          action: 'gesture',
          gestureType: data.gestureType,
          page: data.page,
          coordinates: data.coordinates,
          timestamp: Date.now(),
        };

        this.activeVisitors.set(socket.id, activity);
        this.recordEvent({
          type: 'gesture_detected',
          data: activity,
          timestamp: Date.now(),
        });

        // Broadcast gesture to all clients
        this.io?.emit('collaboration:gesture', {
          gesture: data.gestureType,
          username: visitor.username,
          page: data.page,
          timestamp: Date.now(),
        });
      });

      // Handle page view
      socket.on('page:viewed', (data: { page: string }) => {
        const visitor = this.activeVisitors.get(socket.id);
        if (!visitor) return;

        const activity: VisitorActivity = {
          ...visitor,
          action: 'view',
          page: data.page,
          timestamp: Date.now(),
        };

        this.activeVisitors.set(socket.id, activity);
        this.recordEvent({
          type: 'page_viewed',
          data: activity,
          timestamp: Date.now(),
        });

        // Broadcast page view
        this.io?.emit('collaboration:page_view', {
          username: visitor.username,
          page: data.page,
          timestamp: Date.now(),
        });
      });

      // Handle interaction
      socket.on('interaction:occurred', (data: { type: string; page: string }) => {
        const visitor = this.activeVisitors.get(socket.id);
        if (!visitor) return;

        const activity: VisitorActivity = {
          ...visitor,
          action: 'interaction',
          page: data.page,
          timestamp: Date.now(),
        };

        this.activeVisitors.set(socket.id, activity);
        this.recordEvent({
          type: 'interaction',
          data: activity,
          timestamp: Date.now(),
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        const visitor = this.activeVisitors.get(socket.id);
        if (visitor) {
          this.activeVisitors.delete(socket.id);
          this.io?.emit('collaboration:activity', {
            type: 'visitor_left',
            data: visitor,
            activeCount: this.activeVisitors.size,
          });
          console.log(`[WebSocket] Client disconnected: ${socket.id}`);
        }
      });

      // Handle request for stats
      socket.on('stats:request', () => {
        socket.emit('collaboration:stats', this.getStats());
      });

      // Handle request for activity history
      socket.on('history:request', (limit: number = 50) => {
        const history = this.activityHistory.slice(-limit);
        socket.emit('collaboration:history', history);
      });
    });
  }

  private recordEvent(event: CollaborationEvent) {
    this.activityHistory.push(event);
    if (this.activityHistory.length > this.maxHistorySize) {
      this.activityHistory.shift();
    }
  }

  private getStats(): RealtimeStats {
    const visitors = Array.from(this.activeVisitors.values());
    const gestureCount = this.activityHistory.filter((e) => e.type === 'gesture_detected').length;
    const currentPage = visitors[0]?.page || 'home';

    return {
      activeVisitors: this.activeVisitors.size,
      totalGestures: gestureCount,
      averageSessionDuration: 300, // Placeholder
      currentPage,
      lastUpdate: Date.now(),
    };
  }

  getActiveVisitors(): VisitorActivity[] {
    return Array.from(this.activeVisitors.values());
  }

  getActivityHistory(limit: number = 100): CollaborationEvent[] {
    return this.activityHistory.slice(-limit);
  }

  broadcast(event: string, data: unknown) {
    this.io?.emit(event, data);
  }

  getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const wsManager = new WebSocketManager();
