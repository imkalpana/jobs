import { describe, it, expect, beforeEach } from 'vitest';
import ApplicationService from '../ApplicationService';

describe('ApplicationService', () => {
  let service;

  beforeEach(() => {
    service = new ApplicationService();
  });

  describe('initiateApplication', () => {
    it('should create a new application session', () => {
      const session = service.initiateApplication('job123', 'user456');

      expect(session).toBeDefined();
      expect(session.sessionId).toBeDefined();
      expect(session.jobId).toBe('job123');
      expect(session.userId).toBe('user456');
      expect(session.status).toBe('initiated');
      expect(session.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error if jobId or userId is missing', () => {
      expect(() => {
        service.initiateApplication('', 'user456');
      }).toThrow('Job ID and User ID are required');

      expect(() => {
        service.initiateApplication('job123', '');
      }).toThrow('Job ID and User ID are required');
    });
  });

  describe('reviewApplicationData', () => {
    it('should return pre-filled application data', () => {
      const session = service.initiateApplication('job123', 'user456');
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91-9876543210',
        location: 'Bangalore',
        resumeUrl: 'https://example.com/resume.pdf'
      };

      const applicationData = service.reviewApplicationData(session.sessionId, userData);

      expect(applicationData.sessionId).toBe(session.sessionId);
      expect(applicationData.personalInfo.name).toBe('John Doe');
      expect(applicationData.personalInfo.email).toBe('john@example.com');
      expect(applicationData.resumeUrl).toBe('https://example.com/resume.pdf');
    });

    it('should throw error for invalid session ID', () => {
      expect(() => {
        service.reviewApplicationData('invalid-session', {});
      }).toThrow('Invalid session ID');
    });
  });

  describe('submitApplication', () => {
    it('should submit application successfully', () => {
      const session = service.initiateApplication('job123', 'user456');
      const applicationData = {
        sessionId: session.sessionId,
        jobId: 'job123',
        userId: 'user456',
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91-9876543210'
        },
        coverLetter: 'I am interested in this position',
        resumeUrl: 'https://example.com/resume.pdf'
      };

      const result = service.submitApplication(applicationData);

      expect(result.success).toBe(true);
      expect(result.applicationId).toBeDefined();
      expect(result.status).toBe('applied');
      expect(result.appliedAt).toBeInstanceOf(Date);
    });

    it('should throw error for duplicate application', () => {
      const session = service.initiateApplication('job123', 'user456');
      const applicationData = {
        sessionId: session.sessionId,
        jobId: 'job123',
        userId: 'user456',
        personalInfo: { name: 'John Doe', email: 'john@example.com' }
      };

      service.submitApplication(applicationData);

      // Try to submit again
      const session2 = service.initiateApplication('job123', 'user456');
      const applicationData2 = { ...applicationData, sessionId: session2.sessionId };

      expect(() => {
        service.submitApplication(applicationData2);
      }).toThrow('Application already exists for this job');
    });

    it('should throw error for invalid session', () => {
      const applicationData = {
        sessionId: 'invalid-session',
        jobId: 'job123',
        userId: 'user456',
        personalInfo: { name: 'John Doe' }
      };

      expect(() => {
        service.submitApplication(applicationData);
      }).toThrow('Invalid session ID');
    });
  });

  describe('trackApplication', () => {
    it('should return application status', () => {
      const session = service.initiateApplication('job123', 'user456');
      const applicationData = {
        sessionId: session.sessionId,
        jobId: 'job123',
        userId: 'user456',
        personalInfo: { name: 'John Doe', email: 'john@example.com' }
      };

      const result = service.submitApplication(applicationData);
      const status = service.trackApplication(result.applicationId);

      expect(status.applicationId).toBe(result.applicationId);
      expect(status.jobId).toBe('job123');
      expect(status.status).toBe('applied');
    });

    it('should throw error for non-existent application', () => {
      expect(() => {
        service.trackApplication('non-existent-id');
      }).toThrow('Application not found');
    });
  });

  describe('getUserApplications', () => {
    it('should return all applications for a user', () => {
      // Submit multiple applications
      const session1 = service.initiateApplication('job1', 'user1');
      service.submitApplication({
        sessionId: session1.sessionId,
        jobId: 'job1',
        userId: 'user1',
        personalInfo: { name: 'John', email: 'john@example.com' }
      });

      const session2 = service.initiateApplication('job2', 'user1');
      service.submitApplication({
        sessionId: session2.sessionId,
        jobId: 'job2',
        userId: 'user1',
        personalInfo: { name: 'John', email: 'john@example.com' }
      });

      const applications = service.getUserApplications('user1');

      expect(applications).toHaveLength(2);
      expect(applications[0].userId).toBe('user1');
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update application status', () => {
      const session = service.initiateApplication('job123', 'user456');
      const applicationData = {
        sessionId: session.sessionId,
        jobId: 'job123',
        userId: 'user456',
        personalInfo: { name: 'John', email: 'john@example.com' }
      };

      const result = service.submitApplication(applicationData);
      const updated = service.updateApplicationStatus(result.applicationId, 'interview');

      expect(updated.status).toBe('interview');
      expect(updated.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid status', () => {
      const session = service.initiateApplication('job123', 'user456');
      const applicationData = {
        sessionId: session.sessionId,
        jobId: 'job123',
        userId: 'user456',
        personalInfo: { name: 'John', email: 'john@example.com' }
      };

      const result = service.submitApplication(applicationData);

      expect(() => {
        service.updateApplicationStatus(result.applicationId, 'invalid_status');
      }).toThrow('Invalid status');
    });
  });

  describe('getApplicationsByStatus', () => {
    it('should return applications filtered by status', () => {
      const session1 = service.initiateApplication('job1', 'user1');
      const result1 = service.submitApplication({
        sessionId: session1.sessionId,
        jobId: 'job1',
        userId: 'user1',
        personalInfo: { name: 'John', email: 'john@example.com' }
      });

      service.updateApplicationStatus(result1.applicationId, 'interview');

      const session2 = service.initiateApplication('job2', 'user1');
      service.submitApplication({
        sessionId: session2.sessionId,
        jobId: 'job2',
        userId: 'user1',
        personalInfo: { name: 'John', email: 'john@example.com' }
      });

      const interviewApps = service.getApplicationsByStatus('user1', 'interview');
      expect(interviewApps).toHaveLength(1);
      expect(interviewApps[0].status).toBe('interview');
    });
  });

  describe('getApplicationStats', () => {
    it('should return application statistics', () => {
      const session1 = service.initiateApplication('job1', 'user1');
      const result1 = service.submitApplication({
        sessionId: session1.sessionId,
        jobId: 'job1',
        userId: 'user1',
        personalInfo: { name: 'John', email: 'john@example.com' }
      });

      const session2 = service.initiateApplication('job2', 'user1');
      const result2 = service.submitApplication({
        sessionId: session2.sessionId,
        jobId: 'job2',
        userId: 'user1',
        personalInfo: { name: 'John', email: 'john@example.com' }
      });

      service.updateApplicationStatus(result1.applicationId, 'interview');

      const stats = service.getApplicationStats('user1');

      expect(stats.total).toBe(2);
      expect(stats.applied).toBe(1);
      expect(stats.interview).toBe(1);
    });
  });
});
