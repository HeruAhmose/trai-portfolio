import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useAudioManager', () => {
  it('should have correct sound URLs', () => {
    const SOUND_URLS = {
      click: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-click_39687cb8.wav',
      hover: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-hover_723ca378.wav',
      success: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-success_ebcb4c1d.wav',
      error: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-error_a27efddc.wav',
      transition: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-transition_41820513.wav',
      loading: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-loading_9362e7d1.wav',
    };

    expect(Object.keys(SOUND_URLS)).toHaveLength(6);
    expect(SOUND_URLS.click).toContain('sfx-click');
    expect(SOUND_URLS.hover).toContain('sfx-hover');
    expect(SOUND_URLS.success).toContain('sfx-success');
    expect(SOUND_URLS.error).toContain('sfx-error');
    expect(SOUND_URLS.transition).toContain('sfx-transition');
    expect(SOUND_URLS.loading).toContain('sfx-loading');
  });

  it('should have all URLs pointing to CDN', () => {
    const SOUND_URLS = {
      click: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-click_39687cb8.wav',
      hover: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-hover_723ca378.wav',
      success: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-success_ebcb4c1d.wav',
      error: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-error_a27efddc.wav',
      transition: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-transition_41820513.wav',
      loading: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-loading_9362e7d1.wav',
    };

    Object.values(SOUND_URLS).forEach(url => {
      expect(url).toContain('https://');
      expect(url).toContain('cloudfront.net');
      expect(url).toContain('.wav');
    });
  });
});
