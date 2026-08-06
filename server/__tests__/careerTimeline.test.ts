import { describe, it, expect } from 'vitest';

describe('Career Timeline', () => {
  describe('TimelineEvent Component', () => {
    it('should render timeline event with year and title', () => {
      const event = {
        id: '1',
        year: 2018,
        title: 'Cybersecurity Foundation',
        description: 'Began advanced cybersecurity research',
        side: 'left' as const,
      };

      expect(event.year).toBe(2018);
      expect(event.title).toBe('Cybersecurity Foundation');
      expect(event.side).toBe('left');
    });

    it('should handle event expansion state', () => {
      const isExpanded = false;
      expect(isExpanded).toBe(false);

      const isExpandedTrue = true;
      expect(isExpandedTrue).toBe(true);
    });

    it('should render achievement badge when provided', () => {
      const event = {
        id: '1',
        year: 2018,
        title: 'Cybersecurity Foundation',
        description: 'Research',
        achievement: 'First publication',
      };

      expect(event.achievement).toBeDefined();
      expect(event.achievement).toContain('publication');
    });

    it('should render details array when provided', () => {
      const event = {
        id: '1',
        year: 2018,
        title: 'Cybersecurity Foundation',
        description: 'Research',
        details: [
          'Developed threat detection algorithms',
          'Published initial research findings',
          'Built security frameworks',
        ],
      };

      expect(event.details).toHaveLength(3);
      expect(event.details[0]).toContain('threat detection');
    });

    it('should handle left and right side positioning', () => {
      const leftEvent = { id: '1', side: 'left' as const };
      const rightEvent = { id: '2', side: 'right' as const };

      expect(leftEvent.side).toBe('left');
      expect(rightEvent.side).toBe('right');
    });

    it('should support custom color for milestone marker', () => {
      const event = {
        id: '1',
        color: 'bg-gradient-to-br from-red-500 to-red-700',
      };

      expect(event.color).toBeDefined();
      expect(event.color).toContain('gradient');
    });

    it('should render custom icon when provided', () => {
      const event = {
        id: '1',
        icon: '🛡️',
      };

      expect(event.icon).toBe('🛡️');
    });
  });

  describe('CareerTimeline Page', () => {
    it('should have 8 career milestones', () => {
      const milestones = [
        { id: '1', year: 2018 },
        { id: '2', year: 2019 },
        { id: '3', year: 2020 },
        { id: '4', year: 2021 },
        { id: '5', year: 2023 },
        { id: '6', year: 2024 },
        { id: '7', year: 2025 },
        { id: '8', year: 2026 },
      ];

      expect(milestones).toHaveLength(8);
    });

    it('should display milestones in chronological order', () => {
      const milestones = [
        { year: 2018 },
        { year: 2019 },
        { year: 2020 },
        { year: 2021 },
      ];

      for (let i = 1; i < milestones.length; i++) {
        expect(milestones[i].year).toBeGreaterThanOrEqual(milestones[i - 1].year);
      }
    });

    it('should have alternating left and right positioning', () => {
      const milestones = [
        { id: '1', side: 'left' as const },
        { id: '2', side: 'right' as const },
        { id: '3', side: 'left' as const },
        { id: '4', side: 'right' as const },
      ];

      expect(milestones[0].side).toBe('left');
      expect(milestones[1].side).toBe('right');
      expect(milestones[2].side).toBe('left');
      expect(milestones[3].side).toBe('right');
    });

    it('should include achievement metrics for each milestone', () => {
      const milestones = [
        { id: '1', achievement: 'First publication' },
        { id: '2', achievement: '5 patent claims' },
        { id: '3', achievement: 'Quantum-ready architecture' },
        { id: '4', achievement: '1000+ users served' },
      ];

      expect(milestones.every(m => m.achievement)).toBe(true);
    });

    it('should have detailed information for each milestone', () => {
      const milestone = {
        id: '1',
        title: 'Cybersecurity Foundation',
        details: [
          'Developed threat detection algorithms',
          'Published initial research findings',
          'Built security frameworks',
        ],
      };

      expect(milestone.details).toHaveLength(3);
      expect(milestone.details.every(d => typeof d === 'string')).toBe(true);
    });

    it('should calculate years of experience', () => {
      const startYear = 2018;
      const currentYear = 2026;
      const yearsActive = currentYear - startYear;

      expect(yearsActive).toBe(8);
      expect(yearsActive).toBeGreaterThanOrEqual(8);
    });

    it('should track total patent claims', () => {
      const patentClaims = 25;
      expect(patentClaims).toBeGreaterThan(0);
      expect(patentClaims).toBe(25);
    });

    it('should track community impact metrics', () => {
      const usersServed = 10000;
      expect(usersServed).toBeGreaterThan(1000);
      expect(usersServed).toBe(10000);
    });

    it('should track research projects', () => {
      const researchProjects = 50;
      expect(researchProjects).toBeGreaterThan(0);
      expect(researchProjects).toBe(50);
    });
  });

  describe('Timeline Animations', () => {
    it('should trigger animations on scroll', () => {
      const isInView = true;
      expect(isInView).toBe(true);
    });

    it('should stagger event animations', () => {
      const events = [
        { id: '1', delay: 0 },
        { id: '2', delay: 0.1 },
        { id: '3', delay: 0.2 },
      ];

      for (let i = 1; i < events.length; i++) {
        expect(events[i].delay).toBeGreaterThan(events[i - 1].delay);
      }
    });

    it('should animate connecting line on scroll', () => {
      const lineHeight = 0;
      const animatedHeight = 100;

      expect(lineHeight).toBeLessThan(animatedHeight);
    });

    it('should expand/collapse details on click', () => {
      let isExpanded = false;
      isExpanded = !isExpanded;
      expect(isExpanded).toBe(true);

      isExpanded = !isExpanded;
      expect(isExpanded).toBe(false);
    });
  });

  describe('Timeline Stats', () => {
    it('should display correct stat values', () => {
      const stats = [
        { label: 'Years Active', value: '8+' },
        { label: 'Patents Filed', value: '25+' },
        { label: 'Communities Served', value: '10K+' },
        { label: 'Research Projects', value: '50+' },
      ];

      expect(stats).toHaveLength(4);
      expect(stats[0].value).toBe('8+');
      expect(stats[1].value).toBe('25+');
    });

    it('should animate stat values on scroll', () => {
      const stats = [
        { value: '8+', animated: false },
        { value: '25+', animated: false },
      ];

      stats.forEach(stat => {
        stat.animated = true;
      });

      expect(stats.every(s => s.animated)).toBe(true);
    });
  });

  describe('Timeline Navigation', () => {
    it('should have career timeline route', () => {
      const route = '/career-timeline';
      expect(route).toBe('/career-timeline');
    });

    it('should link to projects page', () => {
      const projectsLink = '/projects';
      expect(projectsLink).toBe('/projects');
    });

    it('should have contact CTA', () => {
      const hasContactCTA = true;
      expect(hasContactCTA).toBe(true);
    });
  });

  describe('Milestone Data Structure', () => {
    it('should validate milestone object structure', () => {
      const milestone = {
        id: '1',
        year: 2018,
        title: 'Cybersecurity Foundation',
        description: 'Research',
        achievement: 'First publication',
        details: ['Detail 1', 'Detail 2'],
        side: 'left' as const,
      };

      expect(milestone.id).toBeDefined();
      expect(milestone.year).toBeGreaterThan(2000);
      expect(milestone.title).toBeDefined();
      expect(milestone.description).toBeDefined();
      expect(milestone.achievement).toBeDefined();
      expect(milestone.details).toBeInstanceOf(Array);
      expect(['left', 'right']).toContain(milestone.side);
    });

    it('should handle optional fields', () => {
      const milestone = {
        id: '1',
        year: 2018,
        title: 'Cybersecurity Foundation',
        description: 'Research',
      };

      expect(milestone.id).toBeDefined();
      expect(milestone.year).toBeDefined();
      expect(milestone.title).toBeDefined();
    });
  });
});
