/**
 * ResumeParserService - Enhanced resume parsing with contact masking
 * Implements the design specification from design.md
 */
class ResumeParserService {
  /**
   * Parse resume content
   * @param {string} text - Resume text content
   * @returns {Object} Parsed resume data
   */
  parseResume(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid resume text');
    }

    const personalInfo = this.extractPersonalInfo(text);
    const skills = this.extractSkills(text);
    const experience = this.extractExperience(text);
    const education = this.extractEducation(text);

    return {
      personalInfo,
      skills,
      experience,
      education,
      rawText: text
    };
  }

  /**
   * Extract personal information with masking
   * @param {string} text - Resume text
   * @returns {Object} Personal information
   */
  extractPersonalInfo(text) {
    const email = this.extractEmail(text);
    const phone = this.extractPhone(text);
    const name = this.extractName(text);
    const location = this.extractLocation(text);

    return {
      name,
      email: email ? this.maskEmail(email) : null,
      emailRaw: email,
      phone: phone ? this.maskPhone(phone) : null,
      phoneRaw: phone,
      location
    };
  }

  /**
   * Extract email address
   */
  extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }

  /**
   * Extract phone number
   */
  extractPhone(text) {
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0].trim() : null;
  }

  /**
   * Extract name (basic implementation)
   */
  extractName(text) {
    const lines = text.split('\n');
    // Assume name is in the first few non-empty lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim();
      if (line && line.length < 50 && !line.includes('@') && !line.includes('http')) {
        // Basic name pattern: 2-4 words, each starting with capital
        if (/^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$/.test(line)) {
          return line;
        }
      }
    }
    return null;
  }

  /**
   * Extract location
   */
  extractLocation(text) {
    const locationRegex = /(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Chennai|Pune|Kolkata|Gurugram|Noida|Gurgaon)/i;
    const match = text.match(locationRegex);
    return match ? match[0] : null;
  }

  /**
   * Mask email address
   * @param {string} email - Email address
   * @returns {string} Masked email
   */
  maskEmail(email) {
    if (!email) return null;
    
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    const visibleChars = Math.min(3, username.length);
    const masked = username.substring(0, visibleChars) + '***';
    
    return `${masked}@${domain}`;
  }

  /**
   * Mask phone number
   * @param {string} phone - Phone number
   * @returns {string} Masked phone
   */
  maskPhone(phone) {
    if (!phone) return null;

    // Remove all non-digit characters for processing
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length < 10) return phone;

    // Mask middle digits, keep first 2-3 and last 3-4 digits
    const prefix = phone.startsWith('+91') ? '+91' : '';
    const lastFour = digits.slice(-4);
    const masked = `${prefix}-****-***-${lastFour}`;
    
    return masked;
  }

  /**
   * Extract skills from resume
   */
  extractSkills(text) {
    const skillKeywords = [
      'python', 'r', 'sql', 'java', 'scala', 'javascript', 'typescript',
      'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
      'pandas', 'numpy', 'matplotlib', 'seaborn', 'statistics', 'probability',
      'regression', 'classification', 'clustering', 'nlp', 'computer vision',
      'apache spark', 'kafka', 'airflow', 'hadoop', 'hive', 'elasticsearch',
      'mongodb', 'cassandra', 'redis', 'etl', 'aws', 'gcp', 'azure',
      'docker', 'kubernetes', 'terraform', 'jenkins', 'git', 'ci/cd',
      'mlops', 'mysql', 'postgresql', 'oracle', 'snowflake', 'redshift',
      'bigquery', 'databricks', 'tableau', 'power bi', 'looker', 'excel'
    ];

    const lowerText = text.toLowerCase();
    const foundSkills = [];
    const technical = [];
    const certifications = this.extractCertifications(text);

    for (const skill of skillKeywords) {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
        technical.push(skill);
      }
    }

    return {
      technical: [...new Set(technical)],
      soft: [],
      certifications
    };
  }

  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certPatterns = [
      /AWS Certified/i,
      /Google Cloud/i,
      /Azure Certified/i,
      /PMP/i,
      /Scrum Master/i
    ];

    const certs = [];
    for (const pattern of certPatterns) {
      const match = text.match(pattern);
      if (match) {
        certs.push(match[0]);
      }
    }

    return certs;
  }

  /**
   * Extract experience details
   */
  extractExperience(text) {
    const totalYears = this.extractTotalYears(text);
    const roles = this.extractRoles(text);

    return {
      totalYears,
      roles
    };
  }

  /**
   * Extract total years of experience
   */
  extractTotalYears(text) {
    const patterns = [
      /(\d+)\s*[\-\+]?\s*years?\s*of\s*experience/i,
      /(\d+)\s*years?\s*experience/i,
      /(\d+)\s*yrs?\s*exp/i,
      /experience.*?(\d+)\s*years?/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }

    // Check for seniority levels
    const lowerText = text.toLowerCase();
    if (lowerText.includes('senior') || lowerText.includes('lead')) return 5;
    if (lowerText.includes('junior') || lowerText.includes('fresher')) return 1;
    if (lowerText.includes('intern')) return 0;

    return 2; // Default
  }

  /**
   * Extract work roles (simplified)
   */
  extractRoles(text) {
    // This is a simplified implementation
    // In production, you'd use more sophisticated parsing
    const roles = [];
    const roleKeywords = ['data scientist', 'data engineer', 'analyst', 'engineer', 'developer'];
    const lowerText = text.toLowerCase();

    for (const keyword of roleKeywords) {
      if (lowerText.includes(keyword)) {
        roles.push({ title: keyword });
      }
    }

    return roles;
  }

  /**
   * Extract education
   */
  extractEducation(text) {
    const education = [];
    const degrees = ['phd', 'ph.d', 'master', 'msc', 'bachelor', 'bsc', 'btech', 'mtech', 'mba'];
    const lowerText = text.toLowerCase();

    for (const degree of degrees) {
      if (lowerText.includes(degree)) {
        education.push({ degree });
      }
    }

    return education;
  }
}

export default ResumeParserService;
