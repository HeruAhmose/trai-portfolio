import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the db module
vi.mock('../../db', () => ({
  getNotifications: vi.fn().mockResolvedValue({ notifications: [], unreadCount: 0 }),
  createNotification: vi.fn().mockResolvedValue({ id: 1 }),
  markNotificationRead: vi.fn().mockResolvedValue(undefined),
  markAllNotificationsRead: vi.fn().mockResolvedValue(undefined),
  getGamificationStatus: vi.fn().mockResolvedValue({
    points: 50,
    level: 2,
    badges: ['first-visit'],
    progressToNextLevel: 50,
    nextLevelPoints: 100,
    achievements: [],
    availableAchievements: [],
  }),
  addPoints: vi.fn().mockResolvedValue({ points: 55, level: 2 }),
  getLeaderboard: vi.fn().mockResolvedValue([]),
  getAchievements: vi.fn().mockResolvedValue([]),
  searchContent: vi.fn().mockResolvedValue({ results: [], total: 0 }),
  getTopSearches: vi.fn().mockResolvedValue({ searches: [] }),
  getSuggestions: vi.fn().mockResolvedValue({ suggestions: [] }),
  getRecommendations: vi.fn().mockResolvedValue({ recommendations: [] }),
  saveConversationMessage: vi.fn().mockResolvedValue(undefined),
  getConversationHistory: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: 'AI insight about the topic.' } }],
  }),
}));

import { notificationsRouter, gamificationRouter, searchRouter, aiInsightsRouter, systemRouter2 } from '../features';

describe('Notifications Router', () => {
  it('exports notificationsRouter', () => {
    expect(notificationsRouter).toBeDefined();
    expect(typeof notificationsRouter).toBe('object');
  });

  it('has getAll, markRead, markAllRead, create procedures', () => {
    const procedures = Object.keys((notificationsRouter as any)._def.procedures);
    expect(procedures).toContain('getAll');
    expect(procedures).toContain('markRead');
    expect(procedures).toContain('markAllRead');
  });
});

describe('Gamification Router', () => {
  it('exports gamificationRouter', () => {
    expect(gamificationRouter).toBeDefined();
  });

  it('has getStatus, getLeaderboard, getAchievements procedures', () => {
    const procedures = Object.keys((gamificationRouter as any)._def.procedures);
    expect(procedures).toContain('getStatus');
    expect(procedures).toContain('getLeaderboard');
    expect(procedures).toContain('getAchievements');
    expect(procedures).toContain('awardPoints');
  });
});

describe('Search Router', () => {
  it('exports searchRouter', () => {
    expect(searchRouter).toBeDefined();
  });

  it('has search, getTopSearches, getSuggestions procedures', () => {
    const procedures = Object.keys((searchRouter as any)._def.procedures);
    expect(procedures).toContain('search');
    expect(procedures).toContain('getTopSearches');
    expect(procedures).toContain('getSuggestions');
  });
});

describe('AI Insights Router', () => {
  it('exports aiInsightsRouter', () => {
    expect(aiInsightsRouter).toBeDefined();
  });

  it('has getRecommendations and generateInsight procedures', () => {
    const procedures = Object.keys((aiInsightsRouter as any)._def.procedures);
    expect(procedures).toContain('getRecommendations');
    expect(procedures).toContain('generateInsight');
  });
});

describe('System Router 2', () => {
  it('exports systemRouter2', () => {
    expect(systemRouter2).toBeDefined();
  });

  it('has getApiDocs procedure', () => {
    const procedures = Object.keys((systemRouter2 as any)._def.procedures);
    expect(procedures).toContain('getApiDocs');
  });
});
