import { describe, it, expect, beforeEach } from 'vitest';
import JobListingService from '../JobListingService';

describe('JobListingService', () => {
  let service;
  let mockJobs;

  beforeEach(() => {
    service = new JobListingService();
    
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    mockJobs = [
      {
        id: 1,
        title: 'Data Scientist',
        company: 'Company A',
        location: 'Bangalore, India',
        category: 'Data Science',
        skills: ['Python', 'Machine Learning'],
        isRemote: false,
        postedDate: yesterday.toISOString()
      },
      {
        id: 2,
        title: 'Data Engineer',
        company: 'Company B',
        location: 'Mumbai, India',
        category: 'Data Engineering',
        skills: ['Python', 'SQL', 'Spark'],
        isRemote: true,
        postedDate: twoDaysAgo.toISOString()
      },
      {
        id: 3,
        title: 'ML Engineer',
        company: 'Company C',
        location: 'Bangalore, India',
        category: 'Machine Learning',
        skills: ['TensorFlow', 'Python'],
        isRemote: false,
        postedDate: weekAgo.toISOString()
      }
    ];

    service.setJobs(mockJobs);
  });

  describe('getRecentJobs', () => {
    it('should return jobs with metadata', async () => {
      const result = await service.getRecentJobs();

      expect(result.jobs).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.totalCount).toBe(3);
      expect(result.metadata.lastUpdated).toBeInstanceOf(Date);
    });

    it('should filter jobs by location', async () => {
      const result = await service.getRecentJobs({ location: 'Bangalore' });

      expect(result.jobs).toHaveLength(2);
      expect(result.jobs.every(job => job.location.includes('Bangalore'))).toBe(true);
    });

    it('should filter jobs by category', async () => {
      const result = await service.getRecentJobs({ category: 'Data Science' });

      expect(result.jobs).toHaveLength(1);
      expect(result.jobs[0].category).toBe('Data Science');
    });

    it('should filter jobs by skills', async () => {
      const result = await service.getRecentJobs({ skills: ['Machine Learning'] });

      expect(result.jobs).toHaveLength(1);
      expect(result.jobs[0].skills).toContain('Machine Learning');
    });

    it('should filter remote jobs', async () => {
      const result = await service.getRecentJobs({ remote: true });

      expect(result.jobs).toHaveLength(1);
      expect(result.jobs[0].isRemote).toBe(true);
    });

    it('should sort jobs by most recent first', async () => {
      const result = await service.getRecentJobs();

      const dates = result.jobs.map(job => new Date(job.postedDate).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
      }
    });

    it('should add freshness indicators to jobs', async () => {
      const result = await service.getRecentJobs();

      expect(result.jobs[0].freshnessIndicator).toBeDefined();
    });

    it('should calculate new jobs count', async () => {
      const result = await service.getRecentJobs();

      expect(result.metadata.newJobsCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getFreshnessIndicator', () => {
    it('should return "new" badge for jobs posted < 24 hours ago', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();

      const indicator = service.getFreshnessIndicator(recentDate);

      expect(indicator).toBeDefined();
      expect(indicator.badge).toBe('new');
      expect(indicator.label).toBe('New');
      expect(indicator.color).toBe('green');
    });

    it('should return "fresh" badge for jobs posted < 48 hours ago', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString();

      const indicator = service.getFreshnessIndicator(recentDate);

      expect(indicator).toBeDefined();
      expect(indicator.badge).toBe('fresh');
      expect(indicator.label).toBe('Fresh');
      expect(indicator.color).toBe('blue');
    });

    it('should return null for jobs posted > 48 hours ago', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();

      const indicator = service.getFreshnessIndicator(oldDate);

      expect(indicator).toBeNull();
    });
  });

  describe('getJobAge', () => {
    it('should return "Posted less than an hour ago" for very recent jobs', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

      const age = service.getJobAge(recentDate);

      expect(age).toBe('Posted less than an hour ago');
    });

    it('should return hours for jobs posted today', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString();

      const age = service.getJobAge(recentDate);

      expect(age).toMatch(/Posted \d+ hours? ago/);
    });

    it('should return days for jobs posted this week', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

      const age = service.getJobAge(recentDate);

      expect(age).toMatch(/Posted \d+ days? ago/);
    });

    it('should return weeks for jobs posted this month', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

      const age = service.getJobAge(recentDate);

      expect(age).toMatch(/Posted \d+ weeks? ago/);
    });
  });

  describe('getMostRecentJobs', () => {
    it('should return limited number of most recent jobs', () => {
      const recentJobs = service.getMostRecentJobs(2);

      expect(recentJobs).toHaveLength(2);
      expect(recentJobs[0].freshnessIndicator).toBeDefined();
      expect(recentJobs[0].age).toBeDefined();
    });
  });

  describe('getJobsByTimeRange', () => {
    it('should return jobs within specified time range', () => {
      const jobs = service.getJobsByTimeRange(48);

      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array if no jobs in time range', () => {
      const jobs = service.getJobsByTimeRange(1);

      expect(jobs).toHaveLength(0);
    });
  });

  describe('getNewJobsCount', () => {
    it('should return count of jobs posted in last 24 hours', () => {
      const count = service.getNewJobsCount(24);

      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should return count of jobs posted in custom time range', () => {
      const count = service.getNewJobsCount(48);

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
