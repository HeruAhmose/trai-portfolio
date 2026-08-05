import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { RecommendationCard } from './RecommendationCard';
import { trpc } from '@/lib/trpc';
import type { ContentRecommendation } from '../../../server/_core/recommendationService';

interface RecommendationSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const RecommendationSidebar: React.FC<RecommendationSidebarProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = trpc.auth.me.useQuery();

  // Fetch recommendations when component mounts or user changes
  useEffect(() => {
    if (!user) return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would call a tRPC endpoint
        // For now, we'll use mock data
        const mockRecommendations: ContentRecommendation[] = [
          {
            id: 'rec-1',
            page: '/quantum',
            title: 'Quantum Research',
            description: 'Explore quantum computing innovations',
            score: 0.92,
            reason: 'Based on your gesture patterns',
            confidence: 0.92,
            tags: ['quantum', 'research', 'advanced'],
          },
          {
            id: 'rec-2',
            page: '/materials',
            title: 'Material Science',
            description: 'Cutting-edge material innovations',
            score: 0.85,
            reason: 'Similar to pages you spend time on',
            confidence: 0.85,
            tags: ['materials', 'science', 'innovation'],
          },
          {
            id: 'rec-3',
            page: '/gesture-control',
            title: 'Gesture Control',
            description: 'Interactive gesture recognition',
            score: 0.78,
            reason: 'Popular among users like you',
            confidence: 0.78,
            tags: ['interactive', 'gesture', 'tech'],
          },
        ];
        setRecommendations(mockRecommendations);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleNavigate = (page: string) => {
    setLocation(page);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-background border-l border-border/50 shadow-2xl z-40 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-cyan">Recommended For You</h2>
          <p className="text-sm text-muted-foreground">Based on your interaction patterns</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-background/50 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Recommendations List */}
        {!isLoading && recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onNavigate={handleNavigate}
                variant="default"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recommendations.length === 0 && (
          <Card className="p-4 border-border/50 bg-background/50 text-center">
            <p className="text-sm text-muted-foreground">
              Explore more sections to get personalized recommendations
            </p>
          </Card>
        )}

        {/* Footer Info */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            💡 Recommendations update as you explore the portfolio
          </p>
        </div>
      </div>
    </div>
  );
};
