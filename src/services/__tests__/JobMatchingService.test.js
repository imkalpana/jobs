import { describe, it, expect, beforeEach } from 'vitest';
import JobMatchingService from '../JobMatchingService';

describe('JobMatchingService', () => {
  let service;

  beforeEach(() => {
    service = new JobMatchingService();
  });

  describe('calculateMatch', () => {
    it('should calculate match score for user profile and job', () => {
      const userProfile = {
        skills: ['Python', 'Machine Learning', 'SQL'],
        experience: 5,
        location: 'Bangalore'
      };

      const job = {
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning'],
        experience: '4-7 years',
        location: 'Bangalore, India'
      };

      const match = service.calculateMatch(userProfile, job);

      expect(match.score).toBeGreaterThan(0);
      expect(match.matchedSkills).toContain('Python');
      expect(match.matchedSkills).toContain('Machine Learning');
      expect(match.missingSkills).toContain('TensorFlow');
      expect(match.experienceAlignment).toBe('perfect');
      expect(match.locationPreference).toBe(true);
    });

    it('should throw error if user profile or job is missing', () => {
      expect(() => {
        service.calculateMatch(null, {});
      }).toThrow('User profile and job are required');
    });

    it('should handle missing skills', () => {
      const userProfile = {
        skills: ['Python'],
        experience: 3
      };

      const job = {
        skills: ['Java', 'Scala'],
        experience: '2-4 years'
      };

      const match = service.calculateMatch(userProfile, job);

      expect(match.score).toBeLessThan(50);
      expect(match.matchedSkills).toHaveLength(0);
      expect(match.missingSkills).toContain('Java');
    });
  });

  describe('calculateSkillMatch', () => {
    it('should calculate skill match percentage', () => {
      const userSkills = ['Python', 'SQL', 'Machine Learning'];
      const jobSkills = ['Python', 'SQL', 'TensorFlow', 'Deep Learning'];

      const score = service.calculateSkillMatch(userSkills, jobSkills);

      expect(score).toBe(50); // 2 out of 4 skills match
    });

    it('should return 0 for no matching skills', () => {
      const userSkills = ['Python', 'SQL'];
      const jobSkills = ['Java', 'Scala'];

      const score = service.calculateSkillMatch(userSkills, jobSkills);

      expect(score).toBe(0);
    });

    it('should handle empty skills arrays', () => {
      const score = service.calculateSkillMatch([], ['Python']);
      expect(score).toBe(0);
    });
  });

  describe('calculateExperienceAlignment', () => {
    it('should return "perfect" for experience within range', () => {
      const alignment = service.calculateExperienceAlignment(5, '4-7 years');
      expect(alignment).toBe('perfect');
    });

    it('should return "under" for experience below minimum', () => {
      const alignment = service.calculateExperienceAlignment(2, '4-7 years');
      expect(alignment).toBe('under');
    });

    it('should return "over" for experience above maximum', () => {
      const alignment = service.calculateExperienceAlignment(10, '4-7 years');
      expect(alignment).toBe('over');
    });

    it('should handle "5+ years" format', () => {
      const alignment = service.calculateExperienceAlignment(6, '5+ years');
      expect(alignment).toBe('perfect');
    });
  });

  describe('parseExperienceRange', () => {
    it('should parse "X-Y years" format', () => {
      const range = service.parseExperienceRange('3-5 years');
      expect(range).toEqual({ min: 3, max: 5 });
    });

    it('should parse "X+ years" format', () => {
      const range = service.parseExperienceRange('5+ years');
      expect(range).toEqual({ min: 5, max: null });
    });

    it('should return null for invalid format', () => {
      const range = service.parseExperienceRange('invalid');
      expect(range).toBeNull();
    });
  });

  describe('getMatchedSkills', () => {
    it('should return list of matched skills', () => {
      const userSkills = ['Python', 'SQL', 'Machine Learning'];
      const jobSkills = ['Python', 'SQL', 'TensorFlow'];

      const matched = service.getMatchedSkills(userSkills, jobSkills);

      expect(matched).toContain('Python');
      expect(matched).toContain('SQL');
      expect(matched).not.toContain('TensorFlow');
    });
  });

  describe('getMissingSkills', () => {
    it('should return list of missing skills', () => {
      const userSkills = ['Python', 'SQL'];
      const jobSkills = ['Python', 'SQL', 'TensorFlow', 'Deep Learning'];

      const missing = service.getMissingSkills(userSkills, jobSkills);

      expect(missing).toContain('TensorFlow');
      expect(missing).toContain('Deep Learning');
      expect(missing).not.toContain('Python');
    });
  });

  describe('calculateMatchesForJobs', () => {
    it('should calculate matches for multiple jobs and sort by score', () => {
      const userProfile = {
        skills: ['Python', 'Machine Learning'],
        experience: 5,
        location: 'Bangalore'
      };

      const jobs = [
        {
          id: 1,
          title: 'Job 1',
          skills: ['Java', 'Scala'],
          experience: '3-5 years',
          location: 'Mumbai'
        },
        {
          id: 2,
          title: 'Job 2',
          skills: ['Python', 'Machine Learning', 'TensorFlow'],
          experience: '4-7 years',
          location: 'Bangalore'
        }
      ];

      const results = service.calculateMatchesForJobs(userProfile, jobs);

      expect(results[0].id).toBe(2); // Higher match score
      expect(results[0].match.score).toBeGreaterThan(results[1].match.score);
    });
  });
});
