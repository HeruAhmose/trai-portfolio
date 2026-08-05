import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ContentRecommendation } from '../../../server/_core/recommendationService';

interface RecommendationCardProps {
  recommendation: ContentRecommendation;
  onNavigate?: (page: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onNavigate,
  variant = 'default',
}) => {
  const handleNavigate = () => {
    onNavigate?.(recommendation.page);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-lime';
    if (confidence > 0.6) return 'text-cyan';
    return 'text-neon-pink';
  };

  const getScoreDisplay = (score: number) => {
    return `${(score * 100).toFixed(0)}%`;
  };

  if (variant === 'compact') {
    return (
      <Card className="p-3 border-neon-cyan/30 bg-deep-blue/50 hover:border-neon-cyan/60 transition-all cursor-pointer">
        <div onClick={handleNavigate} className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-cyan">{recommendation.title}</h4>
            <Badge variant="outline" className="text-xs bg-neon-pink/20 text-neon-pink">
              {getScoreDisplay(recommendation.score)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{recommendation.reason}</p>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="p-6 border-gold/50 bg-gradient-to-br from-deep-blue/80 to-deep-blue/40 hover:border-gold transition-all">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gold mb-2">{recommendation.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan">{getScoreDisplay(recommendation.score)}</div>
              <div className={`text-xs font-semibold ${getConfidenceColor(recommendation.confidence)}`}>
                {(recommendation.confidence * 100).toFixed(0)}% match
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {recommendation.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground italic">{recommendation.reason}</p>
            <Button
              onClick={handleNavigate}
              className="cyberpunk-button text-xs"
              size="sm"
            >
              Explore
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="p-4 border-neon-cyan/30 bg-deep-blue/50 hover:border-neon-cyan/60 transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-cyan mb-1">{recommendation.title}</h4>
            <p className="text-xs text-muted-foreground">{recommendation.description}</p>
          </div>
          <Badge variant="outline" className="text-xs bg-neon-pink/20 text-neon-pink flex-shrink-0">
            {getScoreDisplay(recommendation.score)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan to-neon-pink"
              style={{ width: `${recommendation.confidence * 100}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${getConfidenceColor(recommendation.confidence)}`}>
            {(recommendation.confidence * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {recommendation.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground italic flex-1">{recommendation.reason}</p>
          <Button
            onClick={handleNavigate}
            variant="ghost"
            className="ml-2 text-cyan hover:text-neon-pink text-xs h-7"
            size="sm"
          >
            →
          </Button>
        </div>
      </div>
    </Card>
  );
};
