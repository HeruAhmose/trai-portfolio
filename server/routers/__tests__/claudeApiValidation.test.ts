import { describe, it, expect } from 'vitest';

describe('Claude API Key Validation', () => {
  it('should have CLAUDE_API_KEY_HL environment variable set', () => {
    const apiKeyHl = process.env.CLAUDE_API_KEY_HL;
    expect(apiKeyHl).toBeDefined();
    expect(typeof apiKeyHl).toBe('string');
    expect(apiKeyHl?.length).toBeGreaterThan(0);
    expect(apiKeyHl).toMatch(/^sk-ant-api03-/);
  });

  it('should have CLAUDE_API_KEY_QC environment variable set', () => {
    const apiKeyQc = process.env.CLAUDE_API_KEY_QC;
    expect(apiKeyQc).toBeDefined();
    expect(typeof apiKeyQc).toBe('string');
    expect(apiKeyQc?.length).toBeGreaterThan(0);
    expect(apiKeyQc).toMatch(/^sk-ant-api03-/);
  });

  it('should have different API keys for HL and QC', () => {
    const apiKeyHl = process.env.CLAUDE_API_KEY_HL;
    const apiKeyQc = process.env.CLAUDE_API_KEY_QC;
    expect(apiKeyHl).not.toBe(apiKeyQc);
  });

  it('should validate Claude API key format', () => {
    const apiKeyHl = process.env.CLAUDE_API_KEY_HL;
    // Claude API keys follow format: sk-ant-api03-{random-characters}
    expect(apiKeyHl).toMatch(/^sk-ant-api03-[A-Za-z0-9_-]+$/);
  });

  it('should have sufficient key length for Claude API', () => {
    const apiKeyHl = process.env.CLAUDE_API_KEY_HL;
    const apiKeyQc = process.env.CLAUDE_API_KEY_QC;
    // Claude API keys are typically 80+ characters
    expect(apiKeyHl?.length).toBeGreaterThanOrEqual(40);
    expect(apiKeyQc?.length).toBeGreaterThanOrEqual(40);
  });
});
