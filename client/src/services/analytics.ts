/**
 * Analytics Tracking Service
 * Tracks user interactions, preferences, and behavior
 */

export interface AnalyticsEvent {
  eventType: string;
  timestamp: number;
  data: Record<string, any>;
  sessionId: string;
  userId?: string;
}

export interface UserAnalytics {
  sessionId: string;
  startTime: number;
  events: AnalyticsEvent[];
  pageViews: string[];
  voiceCommands: string[];
  preferencesChanged: Record<string, any>[];
  projectsVisited: string[];
  totalInteractions: number;
}

class AnalyticsService {
  private sessionId: string;
  private analytics: UserAnalytics;
  private eventQueue: AnalyticsEvent[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.analytics = {
      sessionId: this.sessionId,
      startTime: Date.now(),
      events: [],
      pageViews: [],
      voiceCommands: [],
      preferencesChanged: [],
      projectsVisited: [],
      totalInteractions: 0,
    };
    this.initializeAutoFlush();
    this.loadFromStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  /**
   * Track a voice command execution
   */
  trackVoiceCommand(command: string, success: boolean, duration: number): void {
    this.trackEvent('voice_command', {
      command,
      success,
      duration,
    });
    this.analytics.voiceCommands.push(command);
  }

  /**
   * Track project visit
   */
  trackProjectVisit(projectId: string, source: string = 'direct'): void {
    this.trackEvent('project_visit', {
      projectId,
      source,
      timestamp: Date.now(),
    });
    this.analytics.projectsVisited.push(projectId);
  }

  /**
   * Track page view
   */
  trackPageView(page: string, referrer?: string): void {
    this.trackEvent('page_view', {
      page,
      referrer,
    });
    this.analytics.pageViews.push(page);
  }

  /**
   * Track preference change
   */
  trackPreferenceChange(key: string, oldValue: any, newValue: any): void {
    this.trackEvent('preference_change', {
      key,
      oldValue,
      newValue,
    });
    this.analytics.preferencesChanged.push({
      key,
      oldValue,
      newValue,
      timestamp: Date.now(),
    });
  }

  /**
   * Track 3D model interaction
   */
  track3DInteraction(projectId: string, action: string, duration: number): void {
    this.trackEvent('3d_interaction', {
      projectId,
      action,
      duration,
    });
  }

  /**
   * Track gesture interaction
   */
  trackGestureInteraction(gestureType: string, success: boolean): void {
    this.trackEvent('gesture_interaction', {
      gestureType,
      success,
    });
  }

  /**
   * Track sound reactive interaction
   */
  trackSoundReactiveInteraction(intensity: number, duration: number): void {
    this.trackEvent('sound_reactive', {
      intensity,
      duration,
    });
  }

  /**
   * Track feature toggle
   */
  trackFeatureToggle(feature: string, enabled: boolean): void {
    this.trackEvent('feature_toggle', {
      feature,
      enabled,
    });
  }

  /**
   * Track error
   */
  trackError(errorType: string, message: string, stack?: string): void {
    this.trackEvent('error', {
      errorType,
      message,
      stack,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent('performance', {
      metric,
      value,
      unit,
    });
  }

  /**
   * Generic event tracking
   */
  private trackEvent(eventType: string, data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventType,
      timestamp: Date.now(),
      data,
      sessionId: this.sessionId,
    };

    this.eventQueue.push(event);
    this.analytics.events.push(event);
    this.analytics.totalInteractions++;

    // Auto-flush if batch size reached
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }

    // Save to storage periodically
    if (this.analytics.totalInteractions % 5 === 0) {
      this.saveToStorage();
    }
  }

  /**
   * Flush events to server
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send to analytics endpoint
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events: eventsToSend,
          timestamp: Date.now(),
        }),
      }).catch(() => {
        // Silently fail if analytics endpoint unavailable
      });
    } catch (error) {
      console.error('Failed to flush analytics:', error);
      // Re-queue events on failure
      this.eventQueue = [...eventsToSend, ...this.eventQueue];
    }
  }

  /**
   * Get current session analytics
   */
  getAnalytics(): UserAnalytics {
    return {
      ...this.analytics,
      events: this.analytics.events.slice(),
    };
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    sessionDuration: number;
    totalEvents: number;
    pageViews: number;
    projectsVisited: number;
    voiceCommands: number;
    uniqueProjects: number;
  } {
    return {
      sessionDuration: Date.now() - this.analytics.startTime,
      totalEvents: this.analytics.totalInteractions,
      pageViews: this.analytics.pageViews.length,
      projectsVisited: this.analytics.projectsVisited.length,
      voiceCommands: this.analytics.voiceCommands.length,
      uniqueProjects: new Set(this.analytics.projectsVisited).size,
    };
  }

  /**
   * Save analytics to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(
        `analytics_${this.sessionId}`,
        JSON.stringify(this.analytics)
      );
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  /**
   * Load analytics from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(`analytics_${this.sessionId}`);
      if (stored) {
        const loaded = JSON.parse(stored);
        this.analytics = { ...this.analytics, ...loaded };
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }

  /**
   * Clear all analytics
   */
  clear(): void {
    this.analytics = {
      sessionId: this.sessionId,
      startTime: Date.now(),
      events: [],
      pageViews: [],
      voiceCommands: [],
      preferencesChanged: [],
      projectsVisited: [],
      totalInteractions: 0,
    };
    localStorage.removeItem(`analytics_${this.sessionId}`);
  }

  /**
   * Cleanup on unload
   */
  destroy(): void {
    this.flush();
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();

// Auto-flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analyticsService.flush();
  });
}
