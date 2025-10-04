/**
 * JobMatchingService - Calculate match scores between user profiles and jobs
 * Implements the design specification from design.md
 */
class JobMatchingService {
  /**
   * Calculate match score between user profile and job
   * @param {Object} userProfile - Parsed resume data
   * @param {Object} job - Job listing
   * @returns {Object} JobMatch with score and details
   */
  calculateMatch(userProfile, job) {
    if (!userProfile || !job) {
      throw new Error('User profile and job are required');
    }

    const skillScore = this.calculateSkillMatch(userProfile.skills, job.skills);
    const experienceAlignment = this.calculateExperienceAlignment(
      userProfile.experience,
      job.experience
    );
    const locationPreference = this.calculateLocationMatch(
      userProfile.location,
      job.location
    );

    // Calculate overall score (weighted average)
    const score = Math.round(
      skillScore * 0.6 + // Skills are 60% of the match
      this.getExperienceScore(experienceAlignment) * 0.3 + // Experience is 30%
      (locationPreference ? 10 : 0) // Location is 10%
    );

    const matchedSkills = this.getMatchedSkills(userProfile.skills, job.skills);
    const missingSkills = this.getMissingSkills(userProfile.skills, job.skills);

    return {
      score: Math.min(100, Math.max(0, score)),
      matchedSkills,
      missingSkills,
      experienceAlignment,
      locationPreference
    };
  }

  /**
   * Calculate skill match percentage
   */
  calculateSkillMatch(userSkills, jobSkills) {
    if (!userSkills || !jobSkills || userSkills.length === 0 || jobSkills.length === 0) {
      return 0;
    }

    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

    let matchCount = 0;
    for (const jobSkill of jobSkillsLower) {
      if (userSkillsLower.some(userSkill => 
        userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
      )) {
        matchCount++;
      }
    }

    return (matchCount / jobSkillsLower.length) * 100;
  }

  /**
   * Calculate experience alignment
   */
  calculateExperienceAlignment(userExperience, jobExperience) {
    if (typeof userExperience !== 'number' || !jobExperience) {
      return 'unknown';
    }

    // Parse job experience string (e.g., "3-5 years", "5+ years")
    const experienceRange = this.parseExperienceRange(jobExperience);
    if (!experienceRange) {
      return 'unknown';
    }

    const { min, max } = experienceRange;

    if (userExperience < min) {
      return 'under';
    } else if (max && userExperience > max) {
      return 'over';
    } else {
      return 'perfect';
    }
  }

  /**
   * Parse experience range from string
   */
  parseExperienceRange(experienceStr) {
    if (!experienceStr) return null;

    const str = experienceStr.toLowerCase();
    
    // Match patterns like "3-5 years", "5+ years", "5-7 years"
    const rangeMatch = str.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (rangeMatch) {
      return {
        min: parseInt(rangeMatch[1]),
        max: parseInt(rangeMatch[2])
      };
    }

    // Match patterns like "5+ years", "7+ years"
    const plusMatch = str.match(/(\d+)\s*\+/);
    if (plusMatch) {
      return {
        min: parseInt(plusMatch[1]),
        max: null
      };
    }

    // Match single number
    const singleMatch = str.match(/(\d+)/);
    if (singleMatch) {
      const years = parseInt(singleMatch[1]);
      return {
        min: years,
        max: years + 2
      };
    }

    return null;
  }

  /**
   * Calculate location match
   */
  calculateLocationMatch(userLocation, jobLocation) {
    if (!userLocation || !jobLocation) {
      return false;
    }

    const userLoc = userLocation.toLowerCase();
    const jobLoc = jobLocation.toLowerCase();

    return jobLoc.includes(userLoc) || userLoc.includes(jobLoc);
  }

  /**
   * Get experience score for overall calculation
   */
  getExperienceScore(alignment) {
    switch (alignment) {
      case 'perfect':
        return 100;
      case 'over':
        return 80;
      case 'under':
        return 60;
      default:
        return 50;
    }
  }

  /**
   * Get matched skills
   */
  getMatchedSkills(userSkills, jobSkills) {
    if (!userSkills || !jobSkills) {
      return [];
    }

    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const matched = [];

    for (const jobSkill of jobSkills) {
      if (userSkillsLower.some(userSkill =>
        userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      )) {
        matched.push(jobSkill);
      }
    }

    return matched;
  }

  /**
   * Get missing skills
   */
  getMissingSkills(userSkills, jobSkills) {
    if (!jobSkills) {
      return [];
    }
    if (!userSkills) {
      return jobSkills;
    }

    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const missing = [];

    for (const jobSkill of jobSkills) {
      if (!userSkillsLower.some(userSkill =>
        userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      )) {
        missing.push(jobSkill);
      }
    }

    return missing;
  }

  /**
   * Calculate matches for multiple jobs and sort by score
   */
  calculateMatchesForJobs(userProfile, jobs) {
    return jobs
      .map(job => ({
        ...job,
        match: this.calculateMatch(userProfile, job)
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }
}

export default JobMatchingService;
