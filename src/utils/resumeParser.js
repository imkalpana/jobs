// Utility functions for resume parsing and job matching

export const extractSkillsFromText = (text) => {
  const skillKeywords = [
    // Programming Languages
    'python', 'r', 'sql', 'java', 'scala', 'javascript', 'typescript',
    // Data Science & ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'matplotlib', 'seaborn', 'statistics', 'probability',
    'regression', 'classification', 'clustering', 'nlp', 'computer vision',
    // Data Engineering
    'apache spark', 'kafka', 'airflow', 'hadoop', 'hive', 'pig', 'storm',
    'elasticsearch', 'mongodb', 'cassandra', 'redis', 'etl', 'elt',
    // Cloud & DevOps
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'jenkins',
    'git', 'ci/cd', 'mlops', 'devops',
    // Databases
    'mysql', 'postgresql', 'oracle', 'sql server', 'snowflake', 'redshift',
    'bigquery', 'databricks',
    // Visualization & BI
    'tableau', 'power bi', 'qlik', 'looker', 'd3.js', 'plotly', 'excel',
    // Big Data
    'big data', 'mapreduce', 'yarn', 'hdfs', 'spark streaming', 'flink'
  ];

  const lowerText = text.toLowerCase();
  const foundSkills = skillKeywords.filter(skill => 
    lowerText.includes(skill.toLowerCase())
  );
  
  return [...new Set(foundSkills)]; // Remove duplicates
};

export const calculateJobMatch = (resumeSkills, jobSkills) => {
  if (!resumeSkills || !jobSkills || resumeSkills.length === 0 || jobSkills.length === 0) {
    return 0;
  }

  const resumeSkillsLower = resumeSkills.map(skill => skill.toLowerCase());
  const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase());
  
  const matchingSkills = jobSkillsLower.filter(skill => 
    resumeSkillsLower.some(resumeSkill => 
      resumeSkill.includes(skill) || skill.includes(resumeSkill)
    )
  );
  
  return Math.round((matchingSkills.length / jobSkillsLower.length) * 100);
};

export const getExperienceLevel = (text) => {
  const lowerText = text.toLowerCase();
  
  // Look for experience indicators
  const experiencePatterns = [
    /(\d+)\s*[\-\+]?\s*years?\s*of\s*experience/gi,
    /(\d+)\s*years?\s*experience/gi,
    /(\d+)\s*yrs?\s*exp/gi,
    /experience.*?(\d+)\s*years?/gi
  ];
  
  for (const pattern of experiencePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      const numbers = matches[0].match(/\d+/g);
      if (numbers) {
        return parseInt(numbers[0]);
      }
    }
  }
  
  // Fallback: look for seniority levels
  if (lowerText.includes('senior') || lowerText.includes('lead')) return 5;
  if (lowerText.includes('junior') || lowerText.includes('fresher')) return 1;
  if (lowerText.includes('intern')) return 0;
  
  return 2; // Default assumption
};

export const parseResumeContent = (text) => {
  const skills = extractSkillsFromText(text);
  const experience = getExperienceLevel(text);
  
  // Extract contact information
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const phoneMatch = text.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);
  
  return {
    skills,
    experience,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    rawText: text
  };
};

export const filterRecentJobs = (jobs, daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return jobs.filter(job => {
    const jobDate = new Date(job.postedDate);
    return jobDate >= cutoffDate;
  });
};

export const filterQualityJobs = (jobs, minRating = 3.5) => {
  return jobs.filter(job => job.companyRating >= minRating);
};

export const sortJobsByRelevance = (jobs, resumeSkills) => {
  if (!resumeSkills || resumeSkills.length === 0) {
    return jobs;
  }

  return jobs
    .map(job => ({
      ...job,
      matchScore: calculateJobMatch(resumeSkills, job.skills)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};