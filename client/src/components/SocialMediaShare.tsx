import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Linkedin, Facebook, Copy, Check } from 'lucide-react';

interface ShareOptions {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
}

/**
 * Social Media Share Component
 * Enables sharing projects across social platforms
 */
export const SocialMediaShare: React.FC<ShareOptions> = ({
  title,
  description,
  url,
  hashtags = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `${title}: ${description} ${hashtags.join(' ')}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-afro-gold/20 border border-afro-gold/50 rounded-lg text-afro-gold hover:bg-afro-gold/30 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="w-4 h-4" />
        Share
      </motion.button>

      {/* Share Menu */}
      {isOpen && (
        <motion.div
          className="absolute top-full right-0 mt-2 p-4 bg-background border border-afro-gold/30 rounded-lg shadow-lg z-50 min-w-max"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="space-y-3">
            {/* Twitter */}
            <motion.button
              onClick={shareOnTwitter}
              className="flex items-center gap-3 w-full px-4 py-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] rounded-lg transition-colors"
              whileHover={{ x: 5 }}
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </motion.button>

            {/* LinkedIn */}
            <motion.button
              onClick={shareOnLinkedIn}
              className="flex items-center gap-3 w-full px-4 py-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#0A66C2] rounded-lg transition-colors"
              whileHover={{ x: 5 }}
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </motion.button>

            {/* Facebook */}
            <motion.button
              onClick={shareOnFacebook}
              className="flex items-center gap-3 w-full px-4 py-2 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] rounded-lg transition-colors"
              whileHover={{ x: 5 }}
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </motion.button>

            {/* Copy Link */}
            <motion.button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full px-4 py-2 bg-afro-sapphire/20 hover:bg-afro-sapphire/30 text-afro-sapphire rounded-lg transition-colors"
              whileHover={{ x: 5 }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
