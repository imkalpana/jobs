/**
 * JobListingService - Manage job listings with freshness indicators
 * Implements the design specification from design.md
 */
class JobListingService {
  constructor() {
    this.jobs = [];
  }

  /**
   * Set jobs for the service
   * @param {Array} jobs - Array of job listings
   */
  setJobs(jobs) {
    this.jobs = jobs;
  }

  /**
   * Get recent jobs with filters and metadata
   * @param {Object} filters - Job filters
   * @returns {Object} Jobs with metadata
   */
  async getRecentJobs(filters = {}) {
    let filteredJobs = [...this.jobs];

    // Apply filters
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.category) {
      filteredJobs = filteredJobs.filter(job =>
        job.category === filters.category
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        filters.skills.some(skill =>
          job.skills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.remote) {
      filteredJobs = filteredJobs.filter(job => job.isRemote);
    }

    // Sort by most recent first
    filteredJobs.sort((a, b) => {
      const dateA = new Date(a.postedDate);
      const dateB = new Date(b.postedDate);
      return dateB - dateA;
    });

    // Add freshness indicators
    filteredJobs = filteredJobs.map(job => ({
      ...job,
      freshnessIndicator: this.getFreshnessIndicator(job.postedDate)
    }));

    // Calculate metadata
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const newJobsCount = filteredJobs.filter(job =>
      new Date(job.postedDate) >= last24Hours
    ).length;

    return {
      jobs: filteredJobs,
      metadata: {
        totalCount: filteredJobs.length,
        newJobsCount,
        lastUpdated: new Date()
      }
    };
  }

  /**
   * Get freshness indicator for a job
   * @param {string} postedDate - Job posted date
   * @returns {Object} Freshness indicator
   */
  getFreshnessIndicator(postedDate) {
    const posted = new Date(postedDate);
    const now = new Date();
    const hoursDiff = (now - posted) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return {
        badge: 'new',
        label: 'New',
        color: 'green'
      };
    } else if (hoursDiff < 48) {
      return {
        badge: 'fresh',
        label: 'Fresh',
        color: 'blue'
      };
    }

    return null;
  }

  /**
   * Get job freshness age in human-readable format
   * @param {string} postedDate - Job posted date
   * @returns {string} Human-readable age
   */
  getJobAge(postedDate) {
    const posted = new Date(postedDate);
    const now = new Date();
    const diffMs = now - posted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Posted less than an hour ago';
    } else if (diffHours < 24) {
      return `Posted ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `Posted ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Posted ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Posted ${months} month${months > 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Get jobs sorted by freshness
   * @param {number} limit - Maximum number of jobs to return
   * @returns {Array} Most recent jobs
   */
  getMostRecentJobs(limit = 10) {
    return [...this.jobs]
      .sort((a, b) => {
        const dateA = new Date(a.postedDate);
        const dateB = new Date(b.postedDate);
        return dateB - dateA;
      })
      .slice(0, limit)
      .map(job => ({
        ...job,
        freshnessIndicator: this.getFreshnessIndicator(job.postedDate),
        age: this.getJobAge(job.postedDate)
      }));
  }

  /**
   * Get jobs by time range
   * @param {number} hours - Number of hours to look back
   * @returns {Array} Jobs within the time range
   */
  getJobsByTimeRange(hours) {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.jobs.filter(job => {
      const postedDate = new Date(job.postedDate);
      return postedDate >= cutoffDate;
    });
  }

  /**
   * Get count of new jobs
   * @param {number} hours - Number of hours to consider as "new"
   * @returns {number} Count of new jobs
   */
  getNewJobsCount(hours = 24) {
    return this.getJobsByTimeRange(hours).length;
  }
}

export default JobListingService;
