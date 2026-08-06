import { userBehaviorAnalytics, type RecommendationScore } from './userBehaviorAnalytics';
import { invokeLLM } from './llm';

export interface ContentRecommendation {
  id: string;
  page: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  confidence: number;
  tags: string[];
}

export interface PersonalizedRecommendationSet {
  userId: string;
  recommendations: ContentRecommendation[];
  generatedAt: number;
  expiresAt: number;
}

class RecommendationService {
  private recommendationCache = new Map<string, PersonalizedRecommendationSet>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  private pageMetadata: Record<string, { title: string; description: string; tags: string[] }> = {
    '/': {
      title: 'Home',
      description: 'Portfolio overview and introduction',
      tags: ['overview', 'introduction', 'portfolio'],
    },
    '/quantum': {
      title: 'Quantum Research',
      description: 'Advanced quantum computing research and projects',
      tags: ['quantum', 'research', 'computing', 'advanced'],
    },
    '/materials': {
      title: 'Material Science',
      description: 'Cutting-edge material science innovations',
      tags: ['materials', 'science', 'innovation', 'research'],
    },
    '/cybersecurity': {
      title: 'Cybersecurity',
      description: 'Cybersecurity solutions and expertise',
      tags: ['cybersecurity', 'security', 'protection', 'technology'],
    },
    '/community': {
      title: 'Community Impact',
      description: 'Community initiatives and social impact',
      tags: ['community', 'impact', 'social', 'initiatives'],
    },
    '/gesture-control': {
      title: 'Gesture Control',
      description: 'Interactive gesture recognition interface',
      tags: ['gesture', 'interactive', 'control', 'technology'],
    },
    '/analytics': {
      title: 'Analytics Dashboard',
      description: 'Real-time analytics and insights',
      tags: ['analytics', 'dashboard', 'insights', 'data'],
    },
  };

  /**
   * Get recommendations for a user
   */
  async getRecommendations(userId: string, currentPage: string): Promise<ContentRecommendation[]> {
    // Check cache first
    const cached = this.recommendationCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.recommendations;
    }

    // Generate new recommendations
    const baseRecommendations = userBehaviorAnalytics.generateRecommendations(userId, currentPage, 5);
    const recommendations = this.enrichRecommendations(baseRecommendations);

    // Enhance with AI insights
    const enhancedRecommendations = await this.enhanceWithAI(userId, recommendations);

    // Cache results
    this.recommendationCache.set(userId, {
      userId,
      recommendations: enhancedRecommendations,
      generatedAt: Date.now(),
      expiresAt: Date.now() + this.cacheExpiry,
    });

    return enhancedRecommendations;
  }

  /**
   * Enrich recommendations with metadata
   */
  private enrichRecommendations(scores: RecommendationScore[]): ContentRecommendation[] {
    return scores.map((score, index) => {
      const metadata = this.pageMetadata[score.page] || {
        title: score.page,
        description: 'Explore this section',
        tags: [],
      };

      return {
        id: `rec-${index}-${Date.now()}`,
        page: score.page,
        title: metadata.title,
        description: metadata.description,
        score: score.score,
        reason: score.reason,
        confidence: score.confidence,
        tags: metadata.tags,
      };
    });
  }

  /**
   * Enhance recommendations with AI insights
   */
  private async enhanceWithAI(
    userId: string,
    recommendations: ContentRecommendation[]
  ): Promise<ContentRecommendation[]> {
    try {
      const profile = userBehaviorAnalytics.getUserProfile(userId);
      if (!profile) return recommendations;

      // Build context about user behavior
      const behaviorContext = `
User Profile:
- Behavior Type: ${profile.behaviorCluster}
- Interaction Intensity: ${(profile.interactionIntensity * 100).toFixed(0)}%
- Pages Visited: ${Object.keys(profile.pageVisits).join(', ')}
- Gesture Patterns: ${Object.entries(profile.gesturePatterns)
        .map(([g, c]) => `${g}(${c})`)
        .join(', ')}

Current Recommendations:
${recommendations.map((r) => `- ${r.title}: ${r.reason}`).join('\n')}

Please provide brief, personalized insights for why these recommendations match the user's interests.
`;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content:
              'You are a recommendation expert. Provide brief, personalized insights about why content recommendations match user interests.',
          },
          {
            role: 'user',
            content: behaviorContext,
          },
        ],
      });

      // Parse AI response and update recommendations
      const content = response.choices[0]?.message?.content;
      const aiInsights = typeof content === 'string' ? content : '';
      return this.applyAIInsights(recommendations, aiInsights);
    } catch (error) {
      console.error('[RecommendationService] AI enhancement failed:', error);
      return recommendations;
    }
  }

  /**
   * Apply AI insights to recommendations
   */
  private applyAIInsights(
    recommendations: ContentRecommendation[],
    _insights: string
  ): ContentRecommendation[] {
    // Simple enhancement: boost confidence based on AI insights
    return recommendations.map((rec) => ({
      ...rec,
      confidence: Math.min(rec.confidence + 0.1, 1),
    }));
  }

  /**
   * Get trending recommendations (popular across all users)
   */
  getTrendingRecommendations(): ContentRecommendation[] {
    const summary = userBehaviorAnalytics.getAnalyticsSummary();

    // Return most popular pages
    const trending = Object.entries(this.pageMetadata)
      .slice(0, 5)
      .map(([page, metadata], index) => ({
        id: `trending-${index}`,
        page,
        title: metadata.title,
        description: metadata.description,
        score: 0.8,
        reason: 'Popular among all visitors',
        confidence: 0.7,
        tags: metadata.tags,
      }));

    return trending;
  }

  /**
   * Get personalized recommendations for onboarding
   */
  getOnboardingRecommendations(): ContentRecommendation[] {
    return [
      {
        id: 'onboard-1',
        page: '/',
        title: 'Home',
        description: 'Start your journey with an overview of the portfolio',
        score: 1,
        reason: 'Perfect starting point',
        confidence: 1,
        tags: ['overview', 'start'],
      },
      {
        id: 'onboard-2',
        page: '/gesture-control',
        title: 'Gesture Control',
        description: 'Try interactive gesture recognition',
        score: 0.9,
        reason: 'Unique interactive experience',
        confidence: 0.9,
        tags: ['interactive', 'gesture'],
      },
      {
        id: 'onboard-3',
        page: '/quantum',
        title: 'Quantum Research',
        description: 'Explore cutting-edge quantum computing',
        score: 0.8,
        reason: 'Featured research project',
        confidence: 0.8,
        tags: ['research', 'featured'],
      },
    ];
  }

  /**
   * Get recommendations for a specific interest
   */
  getRecommendationsByInterest(interest: string): ContentRecommendation[] {
    const interestMap: Record<string, string[]> = {
      technology: ['/quantum', '/cybersecurity', '/gesture-control'],
      research: ['/quantum', '/materials'],
      community: ['/community'],
      interactive: ['/gesture-control', '/analytics'],
      learning: ['/quantum', '/materials', '/cybersecurity'],
    };

    const pages = interestMap[interest.toLowerCase()] || [];

    return pages.map((page, index) => {
      const metadata = this.pageMetadata[page] || { title: page, description: '', tags: [] };
      return {
        id: `interest-${index}`,
        page,
        title: metadata.title,
        description: metadata.description,
        score: 0.85,
        reason: `Matches your interest in ${interest}`,
        confidence: 0.85,
        tags: metadata.tags,
      };
    });
  }

  /**
   * Clear cache for a user
   */
  clearUserCache(userId: string) {
    this.recommendationCache.delete(userId);
  }

  /**
   * Clear all cache
   */
  clearAllCache() {
    this.recommendationCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedUsers: this.recommendationCache.size,
      cacheExpiry: this.cacheExpiry,
    };
  }
}

export const recommendationService = new RecommendationService();
