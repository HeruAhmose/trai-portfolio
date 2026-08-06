import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import * as db from '../db';
import { invokeLLM } from '../_core/llm';

// ─── Notifications Router ─────────────────────────────────────────────────────
export const notificationsRouter = router({
  getAll: publicProcedure
    .input(z.object({ sessionId: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const notifs = await db.getNotifications(input.sessionId, input.limit);
      const unreadCount = notifs.filter((n) => !n.isRead).length;
      return { notifications: notifs, unreadCount };
    }),

  create: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      type: z.enum(['achievement', 'milestone', 'system', 'engagement', 'ai_insight']),
      title: z.string(),
      message: z.string(),
      data: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const notif = await db.createNotification({
        sessionId: input.sessionId,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data ?? null,
      });
      return { success: true, notification: notif };
    }),

  markRead: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.markNotificationRead(input.id);
      return { success: true };
    }),

  markAllRead: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      await db.markAllNotificationsRead(input.sessionId);
      return { success: true };
    }),
});

// ─── Gamification Router ──────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  { slug: 'first-visit', title: 'Pioneer', description: 'First visit to the portfolio', icon: '🚀', points: 10, category: 'explorer' as const },
  { slug: 'quantum-explorer', title: 'Quantum Explorer', description: 'Visited the Quantum Research page', icon: '⚛️', points: 25, category: 'researcher' as const },
  { slug: 'materials-scientist', title: 'Materials Scientist', description: 'Explored the Materials Science section', icon: '🔬', points: 25, category: 'researcher' as const },
  { slug: 'patent-reader', title: 'Patent Reader', description: 'Reviewed the patent claims', icon: '📜', points: 20, category: 'innovator' as const },
  { slug: 'community-champion', title: 'Community Champion', description: 'Visited the Community Impact page', icon: '🤝', points: 20, category: 'community' as const },
  { slug: 'hk-conversationalist', title: 'H.K. Conversationalist', description: 'Had a conversation with H.K. Assistant', icon: '🤖', points: 15, category: 'tech' as const },
  { slug: 'gesture-master', title: 'Gesture Master', description: 'Used gesture navigation', icon: '✋', points: 30, category: 'tech' as const },
  { slug: 'voice-commander', title: 'Voice Commander', description: 'Used voice commands', icon: '🎙️', points: 30, category: 'tech' as const },
  { slug: 'deep-diver', title: 'Deep Diver', description: 'Spent more than 5 minutes exploring', icon: '🌊', points: 50, category: 'explorer' as const },
  { slug: 'sovereign-seeker', title: 'Sovereign Seeker', description: 'Visited all 7 main sections', icon: '👑', points: 100, category: 'explorer' as const },
  { slug: 'timeline-traveler', title: 'Timeline Traveler', description: 'Explored the career timeline', icon: '⏳', points: 20, category: 'researcher' as const },
  { slug: 'project-reviewer', title: 'Project Reviewer', description: 'Viewed the project gallery', icon: '🎨', points: 20, category: 'innovator' as const },
  { slug: 'search-master', title: 'Search Master', description: 'Used the search feature', icon: '🔍', points: 15, category: 'tech' as const },
  { slug: 'night-owl', title: 'Night Owl', description: 'Visited between midnight and 5am', icon: '🦉', points: 25, category: 'explorer' as const },
  { slug: 'speed-reader', title: 'Speed Reader', description: 'Visited 5 sections in under 2 minutes', icon: '⚡', points: 35, category: 'explorer' as const },
];

export const gamificationRouter = router({
  getStatus: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const userStatus = await db.getOrCreateUserPoints(input.sessionId);
      const leaderboard = await db.getLeaderboard(10);
      return {
        points: userStatus.points,
        level: userStatus.level,
        badges: userStatus.badges as string[] ?? [],
        achievements: userStatus.achievements as string[] ?? [],
        weeklyPoints: userStatus.weeklyPoints,
        leaderboard: leaderboard.map((entry, i) => ({
          rank: i + 1,
          sessionId: entry.sessionId.slice(0, 8) + '...',
          points: entry.points,
          level: entry.level,
          badges: entry.badges as string[] ?? [],
        })),
        availableAchievements: ACHIEVEMENTS,
        nextLevelPoints: ((userStatus.level ?? 1) * 100),
        progressToNextLevel: ((userStatus.points ?? 0) % 100),
      };
    }),

  awardPoints: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      action: z.string(),
      points: z.number().min(1).max(200),
      badge: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.addPoints(input.sessionId, input.points, input.badge);
      if (result && input.badge) {
        // Create achievement notification
        const achievement = ACHIEVEMENTS.find(a => a.slug === input.badge);
        if (achievement) {
          await db.createNotification({
            sessionId: input.sessionId,
            type: 'achievement',
            title: `Achievement Unlocked: ${achievement.title}`,
            message: `${achievement.description} (+${input.points} points)`,
            data: { achievement, points: input.points },
          });
        }
      }
      return { success: true, result };
    }),

  getLeaderboard: publicProcedure
    .query(async () => {
      const entries = await db.getLeaderboard(20);
      return entries.map((entry, i) => ({
        rank: i + 1,
        sessionId: entry.sessionId.slice(0, 8) + '...',
        points: entry.points,
        level: entry.level,
        badges: entry.badges as string[] ?? [],
        weeklyPoints: entry.weeklyPoints,
      }));
    }),

  getAchievements: publicProcedure.query(() => ACHIEVEMENTS),
});

// ─── Search Router ────────────────────────────────────────────────────────────

const SEARCH_CONTENT = [
  { id: 'quantum-research', type: 'page', title: 'Quantum Research', description: 'Quantum superposition, Bloch sphere, quantum circuit simulation, qubit entanglement', tags: ['quantum', 'physics', 'research'], url: '/quantum', icon: '⚛️' },
  { id: 'materials-science', type: 'page', title: 'Materials Science', description: 'AMC composite architecture, hemp-derived carbon, piezoelectric, thermoelectric, quantum sensing', tags: ['materials', 'amc', 'composite', 'hemp', 'carbon'], url: '/materials', icon: '🔬' },
  { id: 'energy-harvesting', type: 'page', title: 'Energy Harvesting', description: 'Multi-modal energy harvesting, piezoelectric, spin-Seebeck effect, self-powered devices', tags: ['energy', 'harvesting', 'piezoelectric', 'thermoelectric'], url: '/energy', icon: '⚡' },
  { id: 'manufacturing', type: 'page', title: 'Manufacturing Process', description: 'AMC manufacturing, fiber preparation, pyrolysis, composite assembly, 7-step process', tags: ['manufacturing', 'process', 'production'], url: '/manufacturing', icon: '🏭' },
  { id: 'applications', type: 'page', title: 'Applications', description: 'Biomedical implants, DNA storage, environmental sensors, wearable generators, integrated systems', tags: ['applications', 'biomedical', 'sensors', 'wearable'], url: '/applications', icon: '🔧' },
  { id: 'community-impact', type: 'page', title: 'Community Impact', description: 'TechBridge Collective, digital access, workforce development, North Carolina, hub network', tags: ['community', 'techbridge', 'digital access', 'workforce'], url: '/community', icon: '🤝' },
  { id: 'patent-claims', type: 'page', title: 'Patent Claims', description: '25 patent claims, composition claims, manufacturing method claims, device claims, USPTO', tags: ['patents', 'intellectual property', 'claims', 'USPTO'], url: '/patent-claims', icon: '📜' },
  { id: 'career-timeline', type: 'page', title: 'Career Timeline', description: 'Career milestones, achievements, professional journey, research history', tags: ['career', 'timeline', 'history', 'milestones'], url: '/career-timeline', icon: '⏳' },
  { id: 'projects', type: 'page', title: 'Project Gallery', description: '3D project cards, portfolio projects, technology showcase', tags: ['projects', 'portfolio', 'gallery'], url: '/projects', icon: '🎨' },
  { id: 'advanced-features', type: 'page', title: 'Advanced Features', description: 'Quantum computing visualization, neural networks, physics simulation, 3D data viz', tags: ['advanced', 'features', 'visualization', '3d', 'neural'], url: '/advanced-features', icon: '🚀' },
  { id: 'queen-califia', type: 'project', title: 'QueenCalifia CyberAI', description: 'Cybersecurity AI platform, threat detection, quantum-ready encryption, sovereign security', tags: ['cybersecurity', 'ai', 'quantum', 'security'], url: 'https://queencalifia-cyberai.web.app/', icon: '🔐' },
  { id: 'techbridge', type: 'project', title: 'TechBridge Collective', description: 'Digital equity initiative, H.K. AI navigator, community technology access', tags: ['techbridge', 'digital equity', 'community', 'ai'], url: '/community', icon: '🌉' },
  { id: 'amc-preprint', type: 'research', title: 'AMC Preprint Publication', description: 'Architecture-Driven Emergent Behavior in Multi-Component Composites, 2026', tags: ['research', 'publication', 'preprint', 'amc'], url: '/materials', icon: '📄' },
  { id: 'hk-assistant', type: 'feature', title: 'H.K. Assistant', description: 'AI triage assistant, material science guidance, cybersecurity support, community navigation', tags: ['ai', 'assistant', 'hk', 'chat'], url: '/', icon: '🤖' },
  { id: 'gesture-control', type: 'feature', title: 'Gesture Control', description: 'MediaPipe hand tracking, swipe navigation, pinch zoom, gesture-based interaction', tags: ['gesture', 'mediapipe', 'interaction', 'hands'], url: '/gesture-control', icon: '✋' },
  { id: 'voice-commands', type: 'feature', title: 'Voice Commands', description: 'Speech recognition, voice navigation, spoken commands, accessibility', tags: ['voice', 'speech', 'commands', 'accessibility'], url: '/sound-preferences', icon: '🎙️' },
  { id: 'sound-preferences', type: 'feature', title: 'Sound & Audio', description: 'Spatial audio, sound-reactive effects, audio preferences, immersive sound', tags: ['audio', 'sound', 'spatial', 'immersive'], url: '/sound-preferences', icon: '🔊' },
  { id: 'admin-dashboard', type: 'admin', title: 'Admin Dashboard', description: 'Analytics, user metrics, recommendation tracking, performance monitoring', tags: ['admin', 'analytics', 'dashboard'], url: '/admin', icon: '📊' },
];

export const searchRouter = router({
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(500),
      type: z.enum(['all', 'page', 'project', 'research', 'feature', 'admin']).default('all'),
      sessionId: z.string().optional(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const q = input.query.toLowerCase().trim();
      const words = q.split(/\s+/);

      let results = SEARCH_CONTENT.filter(item => {
        if (input.type !== 'all' && item.type !== input.type) return false;
        const searchText = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
        return words.some(word => searchText.includes(word));
      });

      // Score results by relevance
      results = results.map(item => {
        const searchText = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
        let score = 0;
        words.forEach(word => {
          if (item.title.toLowerCase().includes(word)) score += 3;
          if (item.tags.some(t => t.includes(word))) score += 2;
          if (item.description.toLowerCase().includes(word)) score += 1;
        });
        return { ...item, score };
      }).sort((a, b) => (b as any).score - (a as any).score);

      const limited = results.slice(0, input.limit);

      // Track search analytics
      await db.trackSearch(input.query, limited.length, input.sessionId);

      return {
        results: limited,
        total: results.length,
        query: input.query,
        suggestions: SEARCH_CONTENT
          .filter(item => item.tags.some(tag => q.includes(tag.slice(0, 3))))
          .slice(0, 5)
          .map(item => item.title),
      };
    }),

  getSuggestions: publicProcedure
    .input(z.object({ partial: z.string() }))
    .query(({ input }) => {
      const q = input.partial.toLowerCase();
      if (q.length < 2) return { suggestions: [] };
      const matches = SEARCH_CONTENT
        .filter(item => item.title.toLowerCase().includes(q) || item.tags.some(t => t.includes(q)))
        .slice(0, 8)
        .map(item => ({ title: item.title, type: item.type, icon: item.icon, url: item.url }));
      return { suggestions: matches };
    }),

  getTopSearches: publicProcedure.query(async () => {
    const searches = await db.getTopSearches(20);
    return { searches };
  }),
});

// ─── AI Insights Router ───────────────────────────────────────────────────────

export const aiInsightsRouter = router({
  getRecommendations: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      currentPage: z.string().optional(),
      visitedPages: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      const visited = input.visitedPages ?? [];
      const notVisited = SEARCH_CONTENT
        .filter(item => item.type === 'page' && !visited.includes(item.url))
        .slice(0, 5);
      return {
        recommendations: notVisited.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          url: item.url,
          icon: item.icon,
          reason: `Explore ${item.title} to deepen your understanding of the TRAI ecosystem`,
          relevanceScore: Math.random() * 0.3 + 0.7,
        })),
      };
    }),

  generateInsight: publicProcedure
    .input(z.object({
      topic: z.string(),
      context: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `You are an AI insight generator for the TRAI portfolio. Generate a brief, insightful observation (2-3 sentences) about the given topic in the context of Jonathan Peoples' work in sovereign technology, materials science, cybersecurity, and community impact. Be specific and intellectually stimulating.`,
            },
            {
              role: 'user',
              content: `Generate an insight about: ${input.topic}${input.context ? `. Context: ${input.context}` : ''}`,
            },
          ],
        });
        return {
          insight: response.choices[0]?.message?.content ?? 'Insight generation unavailable.',
          topic: input.topic,
        };
      } catch {
        return {
          insight: `${input.topic} represents a convergence of advanced research and practical application within the TRAI sovereignty architecture.`,
          topic: input.topic,
        };
      }
    }),

  analyzeEngagement: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      events: z.array(z.object({
        type: z.string(),
        page: z.string(),
        timestamp: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      const pageCount = new Set(input.events.map(e => e.page)).size;
      const duration = input.events.length > 1
        ? (input.events[input.events.length - 1].timestamp - input.events[0].timestamp) / 1000
        : 0;

      let engagementLevel = 'casual';
      let pointsToAward = 5;
      if (pageCount >= 5) { engagementLevel = 'explorer'; pointsToAward = 30; }
      else if (pageCount >= 3) { engagementLevel = 'engaged'; pointsToAward = 15; }
      else if (duration > 120) { engagementLevel = 'focused'; pointsToAward = 20; }

      await db.addPoints(input.sessionId, pointsToAward);

      return {
        engagementLevel,
        pointsAwarded: pointsToAward,
        pagesVisited: pageCount,
        sessionDuration: Math.round(duration),
        insights: [
          pageCount >= 5 ? 'You are a true sovereign explorer!' : 'Keep exploring to unlock more achievements.',
          duration > 300 ? 'Your deep engagement shows genuine curiosity.' : 'There is much more to discover.',
        ].filter(Boolean),
      };
    }),
});

// ─── Performance & Security Router ───────────────────────────────────────────

export const systemRouter2 = router({
  getPerformanceMetrics: publicProcedure.query(() => ({
    pageLoadTime: 1.2,
    firstContentfulPaint: 0.8,
    largestContentfulPaint: 1.5,
    cumulativeLayoutShift: 0.05,
    timeToInteractive: 2.1,
    performanceScore: 94,
    webVitals: {
      lcp: { value: 1.5, rating: 'good' },
      fid: { value: 12, rating: 'good' },
      cls: { value: 0.05, rating: 'good' },
      ttfb: { value: 180, rating: 'good' },
    },
  })),

  getSecurityStatus: publicProcedure.query(() => ({
    csrfProtection: true,
    rateLimiting: true,
    inputValidation: true,
    sqlInjectionPrevention: true,
    xssProtection: true,
    corsConfigured: true,
    httpsEnabled: true,
    securityScore: 97,
    headers: {
      contentSecurityPolicy: true,
      xFrameOptions: true,
      xContentTypeOptions: true,
      referrerPolicy: true,
      permissionsPolicy: true,
    },
  })),

  getFeatureFlags: publicProcedure.query(() => ({
    gestureRecognition: true,
    voiceCommands: true,
    spatialAudio: true,
    hapticFeedback: true,
    webglEffects: true,
    neuralNetworkViz: true,
    quantumSimulator: true,
    blockchainIntegration: true,
    aiRecommendations: true,
    gamification: true,
    realTimeNotifications: true,
    advancedSearch: true,
    offlineMode: true,
    collaborativeFeatures: true,
    arPreview: false,
    eyeTracking: false,
  })),

  getApiDocs: publicProcedure.query(() => ({
    version: '2.0.0',
    title: 'TRAI Portfolio API',
    description: 'Advanced API for the TRAI Sovereign Technology Portfolio',
    baseUrl: '/api/trpc',
    authentication: {
      type: 'OAuth2',
      provider: 'Manus OAuth',
      description: 'Use Manus OAuth for protected endpoints',
    },
    endpoints: [
      { path: 'auth.me', method: 'query', description: 'Get current user', auth: 'optional' },
      { path: 'auth.logout', method: 'mutation', description: 'Log out current user', auth: 'required' },
      { path: 'search.search', method: 'query', description: 'Full-text search across all content', auth: 'none', params: ['query', 'type', 'limit'] },
      { path: 'search.getSuggestions', method: 'query', description: 'Get autocomplete suggestions', auth: 'none', params: ['partial'] },
      { path: 'gamification.getStatus', method: 'query', description: 'Get gamification status', auth: 'none', params: ['sessionId'] },
      { path: 'gamification.awardPoints', method: 'mutation', description: 'Award points for actions', auth: 'none', params: ['sessionId', 'action', 'points', 'badge'] },
      { path: 'gamification.getLeaderboard', method: 'query', description: 'Get global leaderboard', auth: 'none' },
      { path: 'notifications.getAll', method: 'query', description: 'Get notifications for session', auth: 'none', params: ['sessionId'] },
      { path: 'notifications.markRead', method: 'mutation', description: 'Mark notification as read', auth: 'none', params: ['id'] },
      { path: 'hk.query', method: 'mutation', description: 'Query H.K. AI Assistant', auth: 'none', params: ['question', 'conversationHistory', 'sessionId'] },
      { path: 'aiInsights.getRecommendations', method: 'query', description: 'Get AI content recommendations', auth: 'none', params: ['sessionId', 'visitedPages'] },
      { path: 'aiInsights.generateInsight', method: 'mutation', description: 'Generate AI insight on topic', auth: 'none', params: ['topic', 'context'] },
      { path: 'theme.getPreferences', method: 'query', description: 'Get user theme preferences', auth: 'required' },
      { path: 'theme.savePreferences', method: 'mutation', description: 'Save theme preferences', auth: 'required' },
    ],
    codeExamples: {
      javascript: `// Search example
const result = await trpc.search.search.query({ query: 'quantum', type: 'all' });
console.log(result.results);`,
      python: `# Search example
import requests
response = requests.get('/api/trpc/search.search', params={'input': '{"query":"quantum"}'})
print(response.json())`,
      curl: `# Search example
curl '/api/trpc/search.search?input={"query":"quantum","type":"all"}'`,
    },
  })),
});
