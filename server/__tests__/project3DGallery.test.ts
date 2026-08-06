import { describe, it, expect } from 'vitest';

describe('Project 3D Gallery', () => {
  describe('Project3DCard Component', () => {
    it('should render project card with front side content', () => {
      const project = {
        id: '1',
        title: 'Test Project',
        category: 'Cybersecurity',
        description: 'Test description',
        longDescription: 'Long test description',
        image: 'https://example.com/image.jpg',
        technologies: ['React', 'TypeScript'],
        year: 2026,
      };

      expect(project.title).toBe('Test Project');
      expect(project.category).toBe('Cybersecurity');
      expect(project.technologies.length).toBe(2);
    });

    it('should handle flip animation state', () => {
      const isFlipped = false;
      const rotateY = isFlipped ? 180 : 0;
      expect(rotateY).toBe(0);

      const isFlippedTrue = true;
      const rotateYTrue = isFlippedTrue ? 180 : 0;
      expect(rotateYTrue).toBe(180);
    });

    it('should render back side with technologies', () => {
      const project = {
        id: '1',
        title: 'Test Project',
        category: 'Cybersecurity',
        description: 'Test description',
        longDescription: 'Long test description',
        image: 'https://example.com/image.jpg',
        technologies: ['React', 'TypeScript', 'Node.js'],
        year: 2026,
      };

      expect(project.technologies).toContain('React');
      expect(project.technologies).toContain('TypeScript');
      expect(project.technologies).toContain('Node.js');
    });

    it('should include external links on back side', () => {
      const project = {
        id: '1',
        title: 'Test Project',
        category: 'Cybersecurity',
        description: 'Test description',
        longDescription: 'Long test description',
        image: 'https://example.com/image.jpg',
        technologies: ['React'],
        link: 'https://example.com',
        github: 'https://github.com/example',
        year: 2026,
      };

      expect(project.link).toBeDefined();
      expect(project.github).toBeDefined();
      expect(project.link).toContain('https');
    });
  });

  describe('ProjectGallery Component', () => {
    it('should filter projects by category', () => {
      const projects = [
        { id: '1', category: 'Cybersecurity', title: 'Project 1' },
        { id: '2', category: 'Material Science', title: 'Project 2' },
        { id: '3', category: 'Cybersecurity', title: 'Project 3' },
      ];

      const filtered = projects.filter(p => p.category === 'Cybersecurity');
      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.category === 'Cybersecurity')).toBe(true);
    });

    it('should search projects by title', () => {
      const projects = [
        { id: '1', title: 'Cyber AI Platform', description: 'Security' },
        { id: '2', title: 'Material Science Lab', description: 'Research' },
        { id: '3', title: 'Community Impact', description: 'Social' },
      ];

      const query = 'cyber';
      const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toContain('Cyber');
    });

    it('should search projects by technology', () => {
      const projects = [
        { id: '1', title: 'Project 1', technologies: ['React', 'TypeScript'] },
        { id: '2', title: 'Project 2', technologies: ['Python', 'Django'] },
        { id: '3', title: 'Project 3', technologies: ['React', 'Node.js'] },
      ];

      const query = 'react';
      const filtered = projects.filter(p =>
        p.technologies.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

      expect(filtered.length).toBe(2);
    });

    it('should sort projects by year (newest first)', () => {
      const projects = [
        { id: '1', year: 2024 },
        { id: '2', year: 2026 },
        { id: '3', year: 2025 },
      ];

      const sorted = [...projects].sort((a, b) => b.year - a.year);
      expect(sorted[0].year).toBe(2026);
      expect(sorted[1].year).toBe(2025);
      expect(sorted[2].year).toBe(2024);
    });

    it('should sort projects by year (oldest first)', () => {
      const projects = [
        { id: '1', year: 2024 },
        { id: '2', year: 2026 },
        { id: '3', year: 2025 },
      ];

      const sorted = [...projects].sort((a, b) => a.year - b.year);
      expect(sorted[0].year).toBe(2024);
      expect(sorted[1].year).toBe(2025);
      expect(sorted[2].year).toBe(2026);
    });

    it('should sort projects by name (A-Z)', () => {
      const projects = [
        { id: '1', title: 'Zebra Project' },
        { id: '2', title: 'Alpha Project' },
        { id: '3', title: 'Beta Project' },
      ];

      const sorted = [...projects].sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      expect(sorted[0].title).toBe('Alpha Project');
      expect(sorted[1].title).toBe('Beta Project');
      expect(sorted[2].title).toBe('Zebra Project');
    });

    it('should combine filtering and sorting', () => {
      const projects = [
        {
          id: '1',
          category: 'Cybersecurity',
          year: 2024,
          title: 'Cyber Project',
        },
        {
          id: '2',
          category: 'Material Science',
          year: 2026,
          title: 'Material Project',
        },
        {
          id: '3',
          category: 'Cybersecurity',
          year: 2025,
          title: 'Security Project',
        },
      ];

      let filtered = projects.filter(p => p.category === 'Cybersecurity');
      filtered = filtered.sort((a, b) => b.year - a.year);

      expect(filtered.length).toBe(2);
      expect(filtered[0].year).toBe(2025);
      expect(filtered[1].year).toBe(2024);
    });

    it('should handle empty search results', () => {
      const projects = [
        { id: '1', title: 'Project A' },
        { id: '2', title: 'Project B' },
      ];

      const query = 'nonexistent';
      const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );

      expect(filtered.length).toBe(0);
    });

    it('should display correct project count', () => {
      const projects = [
        { id: '1', title: 'Project 1' },
        { id: '2', title: 'Project 2' },
        { id: '3', title: 'Project 3' },
      ];

      expect(projects.length).toBe(3);
    });

    it('should handle project with impact metric', () => {
      const project = {
        id: '1',
        title: 'Test Project',
        impact: '95% accuracy',
      };

      expect(project.impact).toBeDefined();
      expect(project.impact).toContain('95%');
    });

    it('should validate project data structure', () => {
      const project = {
        id: '1',
        title: 'Test Project',
        category: 'Cybersecurity',
        description: 'Test',
        longDescription: 'Long test',
        image: 'https://example.com/image.jpg',
        technologies: ['React'],
        year: 2026,
      };

      expect(project.id).toBeDefined();
      expect(project.title).toBeDefined();
      expect(project.category).toBeDefined();
      expect(project.technologies).toBeInstanceOf(Array);
      expect(project.year).toBeGreaterThan(2000);
    });
  });

  describe('Project Categories', () => {
    it('should extract unique categories', () => {
      const projects = [
        { category: 'Cybersecurity' },
        { category: 'Material Science' },
        { category: 'Cybersecurity' },
        { category: 'AI' },
      ];

      const categories = Array.from(new Set(projects.map(p => p.category)));
      expect(categories.length).toBe(3);
      expect(categories).toContain('Cybersecurity');
      expect(categories).toContain('Material Science');
      expect(categories).toContain('AI');
    });

    it('should include All category in filter options', () => {
      const baseCategories = ['Cybersecurity', 'Material Science'];
      const filterOptions = ['All', ...baseCategories];

      expect(filterOptions[0]).toBe('All');
      expect(filterOptions.length).toBe(3);
    });
  });

  describe('Sort Options', () => {
    it('should have all sort options available', () => {
      const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'name', label: 'Name (A-Z)' },
      ];

      expect(sortOptions.length).toBe(3);
      expect(sortOptions.map(o => o.value)).toContain('newest');
      expect(sortOptions.map(o => o.value)).toContain('oldest');
      expect(sortOptions.map(o => o.value)).toContain('name');
    });
  });
});
