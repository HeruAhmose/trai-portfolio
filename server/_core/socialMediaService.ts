export interface ShareableSection {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  hashtags: string[];
  callToAction: string;
}

export interface SocialPlatform {
  name: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  displayName: string;
  icon: string;
  color: string;
}

export interface ShareMetadata {
  sectionId: string;
  platform: string;
  timestamp: number;
  userAgent?: string;
  referrer?: string;
}

export interface PreviewCard {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  hashtags: string[];
  callToAction: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
}

class SocialMediaService {
  private sections = new Map<string, ShareableSection>();
  private shareHistory: ShareMetadata[] = [];
  private shareStats = new Map<string, number>();

  private platforms: SocialPlatform[] = [
    {
      name: 'twitter',
      displayName: 'Twitter/X',
      icon: '𝕏',
      color: '#000000',
    },
    {
      name: 'linkedin',
      displayName: 'LinkedIn',
      icon: 'in',
      color: '#0A66C2',
    },
    {
      name: 'facebook',
      displayName: 'Facebook',
      icon: 'f',
      color: '#1877F2',
    },
    {
      name: 'instagram',
      displayName: 'Instagram',
      icon: '📷',
      color: '#E4405F',
    },
  ];

  constructor() {
    this.initializeSections();
  }

  /**
   * Initialize portfolio sections for sharing
   */
  private initializeSections() {
    const sections: ShareableSection[] = [
      {
        id: 'quantum-research',
        title: 'Quantum Research & Development',
        description:
          'Exploring quantum computing applications in cybersecurity and material science. Advanced research in quantum algorithms and cryptography.',
        url: '/quantum',
        hashtags: ['#QuantumComputing', '#Cybersecurity', '#Research', '#Innovation'],
        callToAction: 'Explore Quantum Research',
      },
      {
        id: 'material-science',
        title: 'Advanced Material Science',
        description:
          'Cutting-edge research in material science with applications in sustainable technology and advanced manufacturing.',
        url: '/materials',
        hashtags: ['#MaterialScience', '#Sustainability', '#Innovation', '#Technology'],
        callToAction: 'Discover Material Science',
      },
      {
        id: 'cybersecurity',
        title: 'Cybersecurity Solutions',
        description:
          'Comprehensive cybersecurity frameworks and solutions for enterprise protection. AI-powered threat detection and response.',
        url: '/cybersecurity',
        hashtags: ['#Cybersecurity', '#InfoSec', '#AI', '#Protection'],
        callToAction: 'View Security Solutions',
      },
      {
        id: 'gesture-control',
        title: 'Gesture Recognition Technology',
        description:
          'Hands-free interaction technology using advanced gesture recognition. Control interfaces without touching the screen.',
        url: '/gesture-control',
        hashtags: ['#GestureRecognition', '#HCI', '#Innovation', '#Technology'],
        callToAction: 'Try Gesture Control',
      },
      {
        id: 'community-impact',
        title: 'Community Impact Initiatives',
        description:
          'Technology for social good. Building bridges between tech innovation and community development.',
        url: '/community',
        hashtags: ['#CommunityImpact', '#TechForGood', '#Innovation', '#SocialGood'],
        callToAction: 'Learn About Impact',
      },
    ];

    for (const section of sections) {
      this.sections.set(section.id, section);
      this.shareStats.set(section.id, 0);
    }
  }

  /**
   * Get shareable section
   */
  getSection(sectionId: string): ShareableSection | undefined {
    return this.sections.get(sectionId);
  }

  /**
   * Get all shareable sections
   */
  getAllSections(): ShareableSection[] {
    return Array.from(this.sections.values());
  }

  /**
   * Generate share URL for Twitter
   */
  generateTwitterShareUrl(section: ShareableSection): string {
    const text = `${section.title} - ${section.description.substring(0, 100)}... ${section.hashtags.join(' ')}`;
    const url = `${process.env.VITE_FRONTEND_FORGE_API_URL}${section.url}`;

    const params = new URLSearchParams({
      text,
      url,
    });

    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }

  /**
   * Generate share URL for LinkedIn
   */
  generateLinkedInShareUrl(section: ShareableSection): string {
    const url = `${process.env.VITE_FRONTEND_FORGE_API_URL}${section.url}`;

    const params = new URLSearchParams({
      url,
      title: section.title,
      summary: section.description,
      source: 'Jonathan Peoples Portfolio',
    });

    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
  }

  /**
   * Generate share URL for Facebook
   */
  generateFacebookShareUrl(section: ShareableSection): string {
    const url = `${process.env.VITE_FRONTEND_FORGE_API_URL}${section.url}`;

    const params = new URLSearchParams({
      u: url,
      quote: section.title,
      hashtag: section.hashtags[0],
    });

    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }

  /**
   * Generate share URL for Instagram (note: Instagram doesn't have direct sharing API)
   */
  generateInstagramShareUrl(section: ShareableSection): string {
    const text = `${section.title}\n\n${section.description}\n\n${section.hashtags.join(' ')}\n\nCheck it out: ${process.env.VITE_FRONTEND_FORGE_API_URL}${section.url}`;

    // Instagram uses copy-to-clipboard approach
    return `instagram://share?text=${encodeURIComponent(text)}`;
  }

  /**
   * Get share URL for platform
   */
  getShareUrl(
    sectionId: string,
    platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
  ): string | null {
    const section = this.sections.get(sectionId);
    if (!section) {
      return null;
    }

    switch (platform) {
      case 'twitter':
        return this.generateTwitterShareUrl(section);
      case 'linkedin':
        return this.generateLinkedInShareUrl(section);
      case 'facebook':
        return this.generateFacebookShareUrl(section);
      case 'instagram':
        return this.generateInstagramShareUrl(section);
      default:
        return null;
    }
  }

  /**
   * Generate preview card for section
   */
  generatePreviewCard(section: ShareableSection): PreviewCard {
    const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || 'https://portfolio.example.com';
    const fullUrl = `${baseUrl}${section.url}`;

    return {
      title: section.title,
      description: section.description,
      imageUrl: section.imageUrl || `${baseUrl}/og-image.png`,
      url: fullUrl,
      hashtags: section.hashtags,
      callToAction: section.callToAction,
      ogImage: section.imageUrl || `${baseUrl}/og-image.png`,
      ogTitle: section.title,
      ogDescription: section.description,
      twitterCard: 'summary_large_image',
    };
  }

  /**
   * Generate Open Graph meta tags
   */
  generateOpenGraphTags(section: ShareableSection): Record<string, string> {
    const preview = this.generatePreviewCard(section);

    return {
      'og:title': preview.ogTitle || section.title,
      'og:description': preview.ogDescription || section.description,
      'og:image': preview.ogImage || '',
      'og:url': preview.url,
      'og:type': 'website',
      'twitter:card': preview.twitterCard || 'summary',
      'twitter:title': section.title,
      'twitter:description': section.description,
      'twitter:image': preview.ogImage || '',
    };
  }

  /**
   * Track share event
   */
  trackShare(sectionId: string, platform: string, userAgent?: string): boolean {
    const section = this.sections.get(sectionId);
    if (!section) {
      return false;
    }

    const metadata: ShareMetadata = {
      sectionId,
      platform,
      timestamp: Date.now(),
      userAgent,
    };

    this.shareHistory.push(metadata);

    // Update share stats
    const currentCount = this.shareStats.get(sectionId) || 0;
    this.shareStats.set(sectionId, currentCount + 1);

    return true;
  }

  /**
   * Get share statistics
   */
  getShareStats(): Array<{ sectionId: string; title: string; shares: number }> {
    return Array.from(this.shareStats.entries()).map(([sectionId, shares]) => ({
      sectionId,
      title: this.sections.get(sectionId)?.title || 'Unknown',
      shares,
    }));
  }

  /**
   * Get share history
   */
  getShareHistory(limit: number = 50): ShareMetadata[] {
    return this.shareHistory.slice(-limit);
  }

  /**
   * Get platform list
   */
  getPlatforms(): SocialPlatform[] {
    return this.platforms;
  }

  /**
   * Get platform by name
   */
  getPlatform(name: string): SocialPlatform | undefined {
    return this.platforms.find((p) => p.name === name);
  }

  /**
   * Generate share button config
   */
  generateShareButtonConfig(sectionId: string) {
    const section = this.sections.get(sectionId);
    if (!section) {
      return null;
    }

    return {
      section,
      platforms: this.platforms.map((platform) => ({
        ...platform,
        shareUrl: this.getShareUrl(sectionId, platform.name),
      })),
      preview: this.generatePreviewCard(section),
    };
  }

  /**
   * Get most shared sections
   */
  getMostSharedSections(limit: number = 5): Array<{ sectionId: string; title: string; shares: number }> {
    return this.getShareStats().sort((a, b) => b.shares - a.shares).slice(0, limit);
  }

  /**
   * Get share analytics
   */
  getShareAnalytics() {
    const stats = this.getShareStats();
    const totalShares = stats.reduce((sum, s) => sum + s.shares, 0);
    const platformBreakdown = new Map<string, number>();

    for (const metadata of this.shareHistory) {
      const count = platformBreakdown.get(metadata.platform) || 0;
      platformBreakdown.set(metadata.platform, count + 1);
    }

    return {
      totalShares,
      sections: stats,
      platformBreakdown: Object.fromEntries(platformBreakdown),
      mostShared: this.getMostSharedSections(),
      shareHistory: this.shareHistory.length,
    };
  }
}

export const socialMediaService = new SocialMediaService();
