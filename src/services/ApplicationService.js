/**
 * ApplicationService - Manage job applications
 * Implements the design specification from design.md
 */
class ApplicationService {
  constructor() {
    this.applications = [];
    this.sessions = new Map();
  }

  /**
   * Initiate a new application
   * @param {string} jobId - Job ID
   * @param {string} userId - User ID
   * @returns {Object} Application session
   */
  initiateApplication(jobId, userId) {
    if (!jobId || !userId) {
      throw new Error('Job ID and User ID are required');
    }

    const sessionId = this.generateSessionId();
    const session = {
      sessionId,
      jobId,
      userId,
      status: 'initiated',
      createdAt: new Date()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Review pre-filled application data
   * @param {string} sessionId - Session ID
   * @param {Object} userData - User data for pre-filling
   * @returns {Object} Pre-filled application
   */
  reviewApplicationData(sessionId, userData) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Invalid session ID');
    }

    return {
      sessionId,
      jobId: session.jobId,
      userId: session.userId,
      personalInfo: {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || ''
      },
      resumeUrl: userData.resumeUrl || null,
      coverLetter: '',
      additionalDocuments: []
    };
  }

  /**
   * Submit application
   * @param {Object} applicationData - Application submission data
   * @returns {Object} Application result
   */
  submitApplication(applicationData) {
    if (!applicationData.sessionId || !applicationData.jobId || !applicationData.userId) {
      throw new Error('Invalid application data');
    }

    // Validate session
    const session = this.sessions.get(applicationData.sessionId);
    if (!session) {
      throw new Error('Invalid session ID');
    }

    // Check for duplicate application
    const existingApplication = this.applications.find(
      app => app.jobId === applicationData.jobId && app.userId === applicationData.userId
    );
    
    if (existingApplication) {
      throw new Error('Application already exists for this job');
    }

    const application = {
      id: this.generateApplicationId(),
      jobId: applicationData.jobId,
      userId: applicationData.userId,
      personalInfo: applicationData.personalInfo,
      coverLetter: applicationData.coverLetter || '',
      resumeUrl: applicationData.resumeUrl,
      additionalDocuments: applicationData.additionalDocuments || [],
      status: 'applied',
      appliedAt: new Date(),
      updatedAt: new Date()
    };

    this.applications.push(application);
    
    // Clean up session
    this.sessions.delete(applicationData.sessionId);

    return {
      success: true,
      applicationId: application.id,
      status: application.status,
      appliedAt: application.appliedAt
    };
  }

  /**
   * Track application status
   * @param {string} applicationId - Application ID
   * @returns {Object} Application status
   */
  trackApplication(applicationId) {
    const application = this.applications.find(app => app.id === applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }

    return {
      applicationId: application.id,
      jobId: application.jobId,
      status: application.status,
      appliedAt: application.appliedAt,
      updatedAt: application.updatedAt
    };
  }

  /**
   * Get all applications for a user
   * @param {string} userId - User ID
   * @returns {Array} List of applications
   */
  getUserApplications(userId) {
    return this.applications
      .filter(app => app.userId === userId)
      .sort((a, b) => b.appliedAt - a.appliedAt);
  }

  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {string} status - New status (applied, under_review, rejected, interview)
   */
  updateApplicationStatus(applicationId, status) {
    const validStatuses = ['applied', 'under_review', 'rejected', 'interview', 'accepted'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const application = this.applications.find(app => app.id === applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }

    application.status = status;
    application.updatedAt = new Date();

    return application;
  }

  /**
   * Get applications by status
   * @param {string} userId - User ID
   * @param {string} status - Status to filter by
   * @returns {Array} Filtered applications
   */
  getApplicationsByStatus(userId, status) {
    return this.applications.filter(
      app => app.userId === userId && app.status === status
    );
  }

  /**
   * Generate session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate application ID
   */
  generateApplicationId() {
    return `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get application statistics for a user
   */
  getApplicationStats(userId) {
    const userApplications = this.getUserApplications(userId);
    
    const stats = {
      total: userApplications.length,
      applied: 0,
      under_review: 0,
      interview: 0,
      rejected: 0,
      accepted: 0
    };

    for (const app of userApplications) {
      if (stats.hasOwnProperty(app.status)) {
        stats[app.status]++;
      }
    }

    return stats;
  }
}

export default ApplicationService;
