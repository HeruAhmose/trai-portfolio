import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialPlatform {
  name: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  displayName: string;
  icon: string;
  color: string;
  shareUrl: string;
}

interface GestureShareButtonsProps {
  sectionId: string;
  sectionTitle: string;
  platforms: SocialPlatform[];
  isVisible?: boolean;
  onShare?: (platform: string) => void;
}

export const GestureShareButtons: React.FC<GestureShareButtonsProps> = ({
  sectionId,
  sectionTitle,
  platforms,
  isVisible = false,
  onShare,
}) => {
  const [showMenu, setShowMenu] = useState(isVisible);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  useEffect(() => {
    setShowMenu(isVisible);
  }, [isVisible]);

  const handleShare = (platform: SocialPlatform) => {
    // Track share event
    onShare?.(platform.name);

    // Open share URL
    if (platform.shareUrl) {
      if (platform.name === 'instagram') {
        // Instagram requires copy-to-clipboard approach
        navigator.clipboard.writeText(platform.shareUrl);
        alert('Share text copied to clipboard. Open Instagram and paste in a caption.');
      } else {
        window.open(platform.shareUrl, '_blank', 'width=600,height=400');
      }
    }
  };

  return (
    <div className="relative">
      {/* Main Share Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        <Button
          onClick={() => setShowMenu(!showMenu)}
          className="cyberpunk-button flex items-center gap-2"
          title="Share this section (or use peace gesture)"
        >
          <span className="text-lg">🔗</span>
          Share
        </Button>
      </motion.div>

      {/* Share Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50"
          >
            <Card className="p-4 bg-deep-blue border-neon-cyan/50 shadow-lg shadow-neon-cyan/20">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">Share to:</p>

                {platforms.map((platform) => (
                  <motion.div
                    key={platform.name}
                    onHoverStart={() => setHoveredPlatform(platform.name)}
                    onHoverEnd={() => setHoveredPlatform(null)}
                    whileHover={{ x: 4 }}
                  >
                    <Button
                      onClick={() => handleShare(platform)}
                      className="w-full justify-start gap-2 text-sm"
                      style={{
                        borderColor: platform.color,
                        color: hoveredPlatform === platform.name ? platform.color : '#e0e0e0',
                      }}
                      variant="outline"
                    >
                      <span>{platform.icon}</span>
                      <span>{platform.displayName}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Share Preview Card Component
 */
interface SharePreviewCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
  hashtags: string[];
  callToAction: string;
}

export const SharePreviewCard: React.FC<SharePreviewCardProps> = ({
  title,
  description,
  imageUrl,
  url,
  hashtags,
  callToAction,
}) => {
  return (
    <Card className="overflow-hidden border-neon-pink/30 bg-deep-blue/50 hover:border-neon-pink/60 transition-colors">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden bg-background">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-transparent to-transparent" />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-cyan mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {hashtags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-neon-pink/10 text-neon-pink rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2 border-t border-border/30">
          <p className="text-sm font-semibold text-lime">{callToAction}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">{url}</p>
        </div>
      </div>
    </Card>
  );
};

/**
 * Inline Share Button Component (for sections)
 */
interface InlineShareButtonProps {
  sectionId: string;
  sectionTitle: string;
  platforms: SocialPlatform[];
  onShare?: (platform: string) => void;
}

export const InlineShareButton: React.FC<InlineShareButtonProps> = ({
  sectionId,
  sectionTitle,
  platforms,
  onShare,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowTooltip(!showTooltip)}
        className="p-2 rounded-lg bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink transition-colors"
        title="Share this section"
      >
        <span className="text-xl">🔗</span>
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="p-2 bg-deep-blue border-neon-pink/50 whitespace-nowrap text-xs">
              <p className="text-neon-pink">Click to share</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
