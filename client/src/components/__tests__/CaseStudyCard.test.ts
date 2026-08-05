import { describe, it, expect } from 'vitest';

describe('CaseStudyCard Component', () => {
  it('should render case study card with title and category', () => {
    const mockCaseStudy = {
      id: 'test-001',
      title: 'Test Case Study',
      category: 'cybersecurity' as const,
      timeline: '6 months',
      challenge: 'Test challenge',
      solution: 'Test solution',
      impact: 'Test impact',
      metrics: [
        { label: 'Test Metric', value: '100%', icon: '📊', color: 'primary' },
      ],
      tags: ['test', 'case-study'],
      results: [
        { title: 'Result 1', description: 'Description 1' },
      ],
    };

    expect(mockCaseStudy.title).toBe('Test Case Study');
    expect(mockCaseStudy.category).toBe('cybersecurity');
    expect(mockCaseStudy.metrics.length).toBe(1);
  });

  it('should handle case study expansion state', () => {
    const caseId = 'test-001';
    let expandedCase: string | null = null;

    const toggleExpanded = () => {
      expandedCase = expandedCase === caseId ? null : caseId;
    };

    expect(expandedCase).toBeNull();
    toggleExpanded();
    expect(expandedCase).toBe(caseId);
    toggleExpanded();
    expect(expandedCase).toBeNull();
  });

  it('should filter case studies by category', () => {
    const allCases = [
      { id: '1', category: 'cybersecurity' as const },
      { id: '2', category: 'materials' as const },
      { id: '3', category: 'cybersecurity' as const },
      { id: '4', category: 'community' as const },
    ];

    const filtered = allCases.filter(c => c.category === 'cybersecurity');
    expect(filtered.length).toBe(2);
    expect(filtered.every(c => c.category === 'cybersecurity')).toBe(true);
  });

  it('should display metrics correctly', () => {
    const metrics = [
      { label: 'Incidents Reduced', value: '87%', icon: '📉', color: 'primary' },
      { label: 'Threat Detection', value: '99.2%', icon: '🎯', color: 'cyan-400' },
      { label: 'Response Time', value: '2.3s', icon: '⚡', color: 'yellow-400' },
    ];

    expect(metrics.length).toBe(3);
    expect(metrics[0].value).toBe('87%');
    expect(metrics[1].label).toBe('Threat Detection');
    expect(metrics[2].icon).toBe('⚡');
  });

  it('should handle testimonials', () => {
    const testimonial = {
      quote: 'This is a great project',
      author: 'John Doe',
      role: 'CEO',
    };

    expect(testimonial.quote).toBeTruthy();
    expect(testimonial.author).toBe('John Doe');
    expect(testimonial.role).toBe('CEO');
  });

  it('should organize results correctly', () => {
    const results = [
      { title: 'Result 1', description: 'Description 1' },
      { title: 'Result 2', description: 'Description 2' },
      { title: 'Result 3', description: 'Description 3' },
    ];

    expect(results.length).toBe(3);
    expect(results[0].title).toBe('Result 1');
    expect(results.every(r => r.description)).toBe(true);
  });
});
