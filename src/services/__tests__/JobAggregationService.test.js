import { describe, it, expect, beforeEach } from 'vitest';
import JobAggregationService from '../JobAggregationService';

describe('JobAggregationService', () => {
  let service;

  beforeEach(() => {
    service = new JobAggregationService();
  });

  describe('registerSource', () => {
    it('should register a valid source', () => {
      const source = {
        name: 'linkedin',
        fetchLatestJobs: async () => [],
        refreshInterval: 6
      };

      service.registerSource(source);
      const sources = service.getActiveSources();

      expect(sources).toHaveLength(1);
      expect(sources[0].name).toBe('linkedin');
      expect(sources[0].refreshInterval).toBe(6);
    });

    it('should throw error for invalid source', () => {
      expect(() => {
        service.registerSource({ name: 'test' });
      }).toThrow('Invalid source configuration');
    });
  });

  describe('syncJobs', () => {
    it('should sync jobs from multiple sources', async () => {
      const source1 = {
        name: 'linkedin',
        fetchLatestJobs: async () => [
          { id: 1, title: 'Data Scientist', company: 'Company A', location: 'Bangalore' }
        ],
        refreshInterval: 6
      };

      const source2 = {
        name: 'naukri',
        fetchLatestJobs: async () => [
          { id: 2, title: 'Data Engineer', company: 'Company B', location: 'Mumbai' }
        ],
        refreshInterval: 4
      };

      service.registerSource(source1);
      service.registerSource(source2);

      const jobs = await service.syncJobs();

      expect(jobs).toHaveLength(2);
      expect(jobs[0].title).toBe('Data Scientist');
      expect(jobs[1].title).toBe('Data Engineer');
    });

    it('should update source metadata after sync', async () => {
      const source = {
        name: 'linkedin',
        fetchLatestJobs: async () => [
          { id: 1, title: 'Job 1', company: 'Company', location: 'City' }
        ],
        refreshInterval: 6
      };

      service.registerSource(source);
      await service.syncJobs();

      const sources = service.getActiveSources();
      expect(sources[0].lastSyncAt).toBeInstanceOf(Date);
      expect(sources[0].totalJobs).toBe(1);
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate jobs', () => {
      const jobs = [
        { id: 1, title: 'Data Scientist', company: 'Company A', location: 'Bangalore' },
        { id: 2, title: 'Data Scientist', company: 'Company A', location: 'Bangalore' },
        { id: 3, title: 'Data Engineer', company: 'Company B', location: 'Mumbai' }
      ];

      const unique = service.removeDuplicates(jobs);

      expect(unique).toHaveLength(2);
    });
  });

  describe('processAndStoreJobs', () => {
    it('should merge new jobs with existing jobs', async () => {
      const existingJobs = [
        { id: 1, title: 'Job 1', company: 'Company A', location: 'City A' }
      ];

      service.jobs = existingJobs;

      const newJobs = [
        { id: 1, title: 'Job 1', company: 'Company A', location: 'City A', updated: true },
        { id: 2, title: 'Job 2', company: 'Company B', location: 'City B' }
      ];

      await service.processAndStoreJobs(newJobs);

      expect(service.jobs).toHaveLength(2);
      expect(service.jobs[0].updated).toBe(true);
    });
  });

  describe('getSourceStats', () => {
    it('should return statistics for all sources', async () => {
      const source = {
        name: 'linkedin',
        fetchLatestJobs: async () => [
          { id: 1, title: 'Job', company: 'Company', location: 'City' }
        ],
        refreshInterval: 6
      };

      service.registerSource(source);
      await service.syncJobs();

      const stats = service.getSourceStats();

      expect(stats).toHaveLength(1);
      expect(stats[0].name).toBe('linkedin');
      expect(stats[0].totalJobs).toBe(1);
      expect(stats[0].lastSyncAt).toBeInstanceOf(Date);
    });
  });
});
