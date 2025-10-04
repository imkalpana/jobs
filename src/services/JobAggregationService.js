/**
 * JobAggregationService - Manages job data from multiple sources
 * Implements the design specification from design.md
 */
class JobAggregationService {
  constructor() {
    this.sources = [];
    this.jobs = [];
  }

  /**
   * Register a job data source
   * @param {Object} source - Job data source configuration
   * @param {string} source.name - Source identifier (e.g., 'linkedin', 'naukri')
   * @param {Function} source.fetchLatestJobs - Function to fetch jobs from this source
   * @param {number} source.refreshInterval - Refresh interval in hours
   */
  registerSource(source) {
    if (!source.name || !source.fetchLatestJobs || !source.refreshInterval) {
      throw new Error('Invalid source configuration');
    }
    
    this.sources.push({
      ...source,
      lastSyncAt: null,
      totalJobs: 0
    });
  }

  /**
   * Get all active sources
   */
  getActiveSources() {
    return this.sources;
  }

  /**
   * Sync jobs from all registered sources
   */
  async syncJobs() {
    const allNewJobs = [];
    
    for (const source of this.sources) {
      try {
        const newJobs = await source.fetchLatestJobs();
        allNewJobs.push(...newJobs);
        
        // Update source metadata
        source.lastSyncAt = new Date();
        source.totalJobs = newJobs.length;
      } catch (error) {
        console.error(`Error syncing from ${source.name}:`, error);
      }
    }
    
    await this.processAndStoreJobs(allNewJobs);
    return this.jobs;
  }

  /**
   * Process and store jobs, removing duplicates
   * @param {Array} newJobs - Array of new job listings
   */
  async processAndStoreJobs(newJobs) {
    // Remove duplicates based on title + company + location
    const uniqueJobs = this.removeDuplicates(newJobs);
    
    // Merge with existing jobs
    for (const newJob of uniqueJobs) {
      const existingIndex = this.jobs.findIndex(
        job => this.isSameJob(job, newJob)
      );
      
      if (existingIndex >= 0) {
        // Update existing job
        this.jobs[existingIndex] = { ...this.jobs[existingIndex], ...newJob };
      } else {
        // Add new job
        this.jobs.push(newJob);
      }
    }
    
    return this.jobs;
  }

  /**
   * Remove duplicate jobs
   */
  removeDuplicates(jobs) {
    const seen = new Map();
    const unique = [];
    
    for (const job of jobs) {
      const key = `${job.title}-${job.company}-${job.location}`.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, true);
        unique.push(job);
      }
    }
    
    return unique;
  }

  /**
   * Check if two jobs are the same
   */
  isSameJob(job1, job2) {
    return job1.title === job2.title &&
           job1.company === job2.company &&
           job1.location === job2.location;
  }

  /**
   * Get all jobs
   */
  getJobs() {
    return this.jobs;
  }

  /**
   * Get source statistics
   */
  getSourceStats() {
    return this.sources.map(source => ({
      name: source.name,
      lastSyncAt: source.lastSyncAt,
      totalJobs: source.totalJobs,
      refreshInterval: source.refreshInterval
    }));
  }
}

export default JobAggregationService;
