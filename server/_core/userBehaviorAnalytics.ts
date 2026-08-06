import type { VisitorActivity } from './websocket';

export interface UserBehaviorProfile {
  userId: string;
  gesturePatterns: Record<string, number>;
  pageVisits: Record<string, { count: number; totalDwellTime: number; avgDwellTime: number }>;
  interactionIntensity: number;
  preferredSections: string[];
  behaviorCluster: string;
  lastUpdated: number;
}

export interface GesturePattern {
  gesture: string;
  frequency: number;
  pages: string[];
  avgTimeBetweenGestures: number;
}

export interface PageDwellMetrics {
  page: string;
  totalVisits: number;
  avgDwellTime: number;
  maxDwellTime: number;
  minDwellTime: number;
  bounceRate: number;
}

export interface RecommendationScore {
  page: string;
  score: number;
  reason: string;
  confidence: number;
}

class UserBehaviorAnalytics {
  private userProfiles = new Map<string, UserBehaviorProfile>();
  private gesturePatterns = new Map<string, GesturePattern>();
  private pageMetrics = new Map<string, PageDwellMetrics>();
  private sessionData = new Map<string, { startTime: number; pages: string[]; gestures: string[] }>();

  /**
   * Track user activity and update behavior profile
   */
  trackActivity(userId: string, activity: VisitorActivity) {
    if (!this.userProfiles.has(userId)) {
      this.initializeUserProfile(userId);
    }

    const profile = this.userProfiles.get(userId)!;

    // Track gesture patterns
    if (activity.action === 'gesture' && activity.gestureType) {
      profile.gesturePatterns[activity.gestureType] =
        (profile.gesturePatterns[activity.gestureType] || 0) + 1;
      this.updateGesturePattern(activity.gestureType, activity.page || '/', userId);
    }

    // Track page visits
    if (activity.action === 'view' && activity.page) {
      if (!profile.pageVisits[activity.page]) {
        profile.pageVisits[activity.page] = { count: 0, totalDwellTime: 0, avgDwellTime: 0 };
      }
      profile.pageVisits[activity.page].count += 1;
    }

    // Update interaction intensity
    profile.interactionIntensity = this.calculateInteractionIntensity(profile);
    profile.lastUpdated = Date.now();

    // Update behavior cluster
    profile.behaviorCluster = this.classifyBehavior(profile);
  }

  /**
   * Track page dwell time
   */
  trackPageDwell(userId: string, page: string, dwellTime: number) {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    if (!profile.pageVisits[page]) {
      profile.pageVisits[page] = { count: 1, totalDwellTime: dwellTime, avgDwellTime: dwellTime };
    } else {
      const visit = profile.pageVisits[page];
      visit.totalDwellTime += dwellTime;
      visit.avgDwellTime = visit.totalDwellTime / visit.count;
    }

    // Update page metrics
    this.updatePageMetrics(page, dwellTime);
  }

  /**
   * Get user behavior profile
   */
  getUserProfile(userId: string): UserBehaviorProfile | undefined {
    return this.userProfiles.get(userId);
  }

  /**
   * Generate recommendations based on user behavior
   */
  generateRecommendations(userId: string, currentPage: string, limit: number = 5): RecommendationScore[] {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    const recommendations: RecommendationScore[] = [];
    const allPages = this.getAllPages();

    // Score each page based on multiple factors
    for (const page of allPages) {
      if (page === currentPage) continue;

      const score = this.calculateRecommendationScore(profile, page, currentPage);
      recommendations.push(score);
    }

    // Sort by score and return top recommendations
    return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Calculate recommendation score for a page
   */
  private calculateRecommendationScore(
    profile: UserBehaviorProfile,
    targetPage: string,
    currentPage: string
  ): RecommendationScore {
    let score = 0;
    let reason = '';

    // Factor 1: Similar gesture patterns (30%)
    const gestureScore = this.calculateGestureSimilarity(profile, targetPage);
    score += gestureScore * 0.3;

    // Factor 2: Dwell time correlation (25%)
    const dwellScore = this.calculateDwellTimeCorrelation(profile, targetPage);
    score += dwellScore * 0.25;

    // Factor 3: User cluster preference (25%)
    const clusterScore = this.calculateClusterPreference(profile.behaviorCluster, targetPage);
    score += clusterScore * 0.25;

    // Factor 4: Page popularity among similar users (20%)
    const popularityScore = this.calculatePagePopularity(targetPage);
    score += popularityScore * 0.2;

    // Determine reason
    if (gestureScore > 0.7) {
      reason = 'Based on your gesture patterns';
    } else if (dwellScore > 0.7) {
      reason = 'Similar to pages you spend time on';
    } else if (clusterScore > 0.7) {
      reason = 'Recommended for users like you';
    } else {
      reason = 'Popular among visitors';
    }

    const confidence = Math.min(score, 1);

    return {
      page: targetPage,
      score: score,
      reason,
      confidence,
    };
  }

  /**
   * Calculate gesture similarity score
   */
  private calculateGestureSimilarity(profile: UserBehaviorProfile, targetPage: string): number {
    const targetGestures = this.getPageGestures(targetPage);
    const userGestures = Object.keys(profile.gesturePatterns);

    if (userGestures.length === 0 || targetGestures.length === 0) return 0.5;

    const commonGestures = userGestures.filter((g) => targetGestures.includes(g)).length;
    return commonGestures / Math.max(userGestures.length, targetGestures.length);
  }

  /**
   * Calculate dwell time correlation
   */
  private calculateDwellTimeCorrelation(profile: UserBehaviorProfile, targetPage: string): number {
    const userAvgDwell =
      Object.values(profile.pageVisits).reduce((sum, v) => sum + v.avgDwellTime, 0) /
      Object.keys(profile.pageVisits).length;

    const targetMetrics = this.pageMetrics.get(targetPage);
    if (!targetMetrics) return 0.5;

    const diff = Math.abs(userAvgDwell - targetMetrics.avgDwellTime);
    const maxDiff = Math.max(userAvgDwell, targetMetrics.avgDwellTime);

    return Math.max(0, 1 - diff / maxDiff);
  }

  /**
   * Calculate cluster preference score
   */
  private calculateClusterPreference(cluster: string, targetPage: string): number {
    // Simplified cluster preference mapping
    const clusterPreferences: Record<string, string[]> = {
      explorer: ['/', '/quantum', '/materials', '/community'],
      focused: ['/quantum', '/materials'],
      casual: ['/', '/cybersecurity'],
      technical: ['/quantum', '/materials', '/cybersecurity'],
    };

    const preferences = clusterPreferences[cluster] || [];
    return preferences.includes(targetPage) ? 0.8 : 0.3;
  }

  /**
   * Calculate page popularity
   */
  private calculatePagePopularity(page: string): number {
    const metrics = this.pageMetrics.get(page);
    if (!metrics) return 0.5;

    // Normalize by max visits
    const maxVisits = Math.max(...Array.from(this.pageMetrics.values()).map((m) => m.totalVisits));
    return metrics.totalVisits / Math.max(maxVisits, 1);
  }

  /**
   * Classify user behavior into clusters
   */
  private classifyBehavior(profile: UserBehaviorProfile): string {
    const gestureCount = Object.values(profile.gesturePatterns).reduce((a, b) => a + b, 0);
    const pageCount = Object.keys(profile.pageVisits).length;
    const avgDwell =
      Object.values(profile.pageVisits).reduce((sum, v) => sum + v.avgDwellTime, 0) / pageCount;

    if (pageCount > 4 && gestureCount > 20) {
      return 'explorer'; // Visits many pages with many gestures
    } else if (avgDwell > 60000) {
      return 'focused'; // Spends long time on pages
    } else if (gestureCount > 50) {
      return 'technical'; // Very interactive
    } else {
      return 'casual'; // Light interaction
    }
  }

  /**
   * Calculate interaction intensity (0-1)
   */
  private calculateInteractionIntensity(profile: UserBehaviorProfile): number {
    const gestureCount = Object.values(profile.gesturePatterns).reduce((a, b) => a + b, 0);
    const pageCount = Object.keys(profile.pageVisits).length;
    const avgDwell =
      Object.values(profile.pageVisits).reduce((sum, v) => sum + v.avgDwellTime, 0) / pageCount;

    // Normalize: gestures (0-100), pages (0-10), dwell time (0-300s)
    const gestureScore = Math.min(gestureCount / 100, 1);
    const pageScore = Math.min(pageCount / 10, 1);
    const dwellScore = Math.min(avgDwell / 300000, 1);

    return (gestureScore + pageScore + dwellScore) / 3;
  }

  /**
   * Update gesture pattern tracking
   */
  private updateGesturePattern(gesture: string, page: string, userId: string) {
    if (!this.gesturePatterns.has(gesture)) {
      this.gesturePatterns.set(gesture, {
        gesture,
        frequency: 0,
        pages: [],
        avgTimeBetweenGestures: 0,
      });
    }

    const pattern = this.gesturePatterns.get(gesture)!;
    pattern.frequency += 1;
    if (!pattern.pages.includes(page)) {
      pattern.pages.push(page);
    }
  }

  /**
   * Update page metrics
   */
  private updatePageMetrics(page: string, dwellTime: number) {
    if (!this.pageMetrics.has(page)) {
      this.pageMetrics.set(page, {
        page,
        totalVisits: 1,
        avgDwellTime: dwellTime,
        maxDwellTime: dwellTime,
        minDwellTime: dwellTime,
        bounceRate: 0,
      });
    } else {
      const metrics = this.pageMetrics.get(page)!;
      metrics.totalVisits += 1;
      metrics.avgDwellTime = (metrics.avgDwellTime * (metrics.totalVisits - 1) + dwellTime) / metrics.totalVisits;
      metrics.maxDwellTime = Math.max(metrics.maxDwellTime, dwellTime);
      metrics.minDwellTime = Math.min(metrics.minDwellTime, dwellTime);
    }
  }

  /**
   * Get all pages with gesture data
   */
  private getPageGestures(page: string): string[] {
    const gestures: string[] = [];
    this.gesturePatterns.forEach((pattern, gesture) => {
      if (pattern.pages.includes(page)) {
        gestures.push(gesture);
      }
    });
    return gestures;
  }

  /**
   * Get all tracked pages
   */
  private getAllPages(): string[] {
    return Array.from(this.pageMetrics.keys());
  }

  /**
   * Initialize user profile
   */
  private initializeUserProfile(userId: string) {
    this.userProfiles.set(userId, {
      userId,
      gesturePatterns: {},
      pageVisits: {},
      interactionIntensity: 0,
      preferredSections: [],
      behaviorCluster: 'casual',
      lastUpdated: Date.now(),
    });
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    return {
      totalUsers: this.userProfiles.size,
      totalPages: this.pageMetrics.size,
      totalGestures: this.gesturePatterns.size,
      avgInteractionIntensity:
        Array.from(this.userProfiles.values()).reduce((sum, p) => sum + p.interactionIntensity, 0) /
        this.userProfiles.size,
    };
  }
}

export const userBehaviorAnalytics = new UserBehaviorAnalytics();
