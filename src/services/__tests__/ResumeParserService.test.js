import { describe, it, expect, beforeEach } from 'vitest';
import ResumeParserService from '../ResumeParserService';

describe('ResumeParserService', () => {
  let service;

  beforeEach(() => {
    service = new ResumeParserService();
  });

  describe('parseResume', () => {
    it('should parse resume content successfully', () => {
      const resumeText = `
John Doe
Senior Data Scientist
Email: john.doe@example.com
Phone: +91-9876543210
Location: Bangalore

EXPERIENCE:
5 years of experience in data science

SKILLS:
Python, Machine Learning, SQL, TensorFlow, AWS

EDUCATION:
Master's in Computer Science
      `;

      const parsed = service.parseResume(resumeText);

      expect(parsed.personalInfo).toBeDefined();
      expect(parsed.skills).toBeDefined();
      expect(parsed.experience).toBeDefined();
      expect(parsed.education).toBeDefined();
      expect(parsed.rawText).toBe(resumeText);
    });

    it('should throw error for invalid input', () => {
      expect(() => {
        service.parseResume(null);
      }).toThrow('Invalid resume text');

      expect(() => {
        service.parseResume(123);
      }).toThrow('Invalid resume text');
    });
  });

  describe('extractPersonalInfo', () => {
    it('should extract and mask email', () => {
      const text = 'Email: john.doe@example.com';
      const info = service.extractPersonalInfo(text);

      expect(info.emailRaw).toBe('john.doe@example.com');
      expect(info.email).toBe('joh***@example.com');
    });

    it('should extract and mask phone', () => {
      const text = 'Phone: +91-9876543210';
      const info = service.extractPersonalInfo(text);

      expect(info.phoneRaw).toBe('+91-9876543210');
      expect(info.phone).toMatch(/\*\*\*\*/);
    });

    it('should extract location', () => {
      const text = 'Located in Bangalore, India';
      const info = service.extractPersonalInfo(text);

      expect(info.location).toBe('Bangalore');
    });
  });

  describe('maskEmail', () => {
    it('should mask email correctly', () => {
      expect(service.maskEmail('john@example.com')).toBe('joh***@example.com');
      expect(service.maskEmail('ab@test.com')).toBe('ab***@test.com');
      expect(service.maskEmail('a@test.com')).toBe('a***@test.com');
    });

    it('should return null for null email', () => {
      expect(service.maskEmail(null)).toBeNull();
    });
  });

  describe('maskPhone', () => {
    it('should mask phone number correctly', () => {
      const masked = service.maskPhone('+91-9876543210');
      expect(masked).toMatch(/\*\*\*\*/);
      expect(masked).toContain('3210');
    });

    it('should return null for null phone', () => {
      expect(service.maskPhone(null)).toBeNull();
    });

    it('should return original for invalid phone', () => {
      const shortPhone = '123';
      expect(service.maskPhone(shortPhone)).toBe(shortPhone);
    });
  });

  describe('extractSkills', () => {
    it('should extract technical skills', () => {
      const text = `
        Proficient in Python, Machine Learning, SQL, TensorFlow, and AWS.
        Experience with Docker and Kubernetes.
      `;

      const skills = service.extractSkills(text);

      expect(skills.technical).toContain('python');
      expect(skills.technical).toContain('machine learning');
      expect(skills.technical).toContain('sql');
      expect(skills.technical).toContain('tensorflow');
      expect(skills.technical).toContain('aws');
      expect(skills.technical).toContain('docker');
      expect(skills.technical).toContain('kubernetes');
    });

    it('should not have duplicate skills', () => {
      const text = 'Python, Python, SQL, SQL';
      const skills = service.extractSkills(text);

      const pythonCount = skills.technical.filter(s => s === 'python').length;
      const sqlCount = skills.technical.filter(s => s === 'sql').length;

      expect(pythonCount).toBe(1);
      expect(sqlCount).toBe(1);
    });

    it('should extract certifications', () => {
      const text = 'AWS Certified Solutions Architect, Google Cloud Professional';
      const skills = service.extractSkills(text);

      expect(skills.certifications.length).toBeGreaterThan(0);
    });
  });

  describe('extractExperience', () => {
    it('should extract total years of experience', () => {
      const text = '5 years of experience in data science';
      const experience = service.extractExperience(text);

      expect(experience.totalYears).toBe(5);
    });

    it('should extract experience from different formats', () => {
      expect(service.extractTotalYears('7 years experience')).toBe(7);
      expect(service.extractTotalYears('3 yrs exp')).toBe(3);
      expect(service.extractTotalYears('experience of 6 years')).toBe(6);
    });

    it('should infer experience from seniority level', () => {
      expect(service.extractTotalYears('Senior Data Scientist')).toBe(5);
      expect(service.extractTotalYears('Junior Developer')).toBe(1);
      expect(service.extractTotalYears('Intern')).toBe(0);
    });

    it('should extract work roles', () => {
      const text = 'Data Scientist at Company X, Data Engineer at Company Y';
      const experience = service.extractExperience(text);

      expect(experience.roles.length).toBeGreaterThan(0);
    });
  });

  describe('extractEducation', () => {
    it('should extract education degrees', () => {
      const text = `
        Master's in Computer Science
        Bachelor of Technology in IT
      `;

      const education = service.extractEducation(text);

      expect(education.length).toBeGreaterThan(0);
    });

    it('should recognize various degree formats', () => {
      const text = 'PhD in Machine Learning, MSc Data Science, BTech, MBA';
      const education = service.extractEducation(text);

      expect(education.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractName', () => {
    it('should extract name from resume', () => {
      const text = `
John Doe
Senior Data Scientist
      `;

      const name = service.extractName(text);
      expect(name).toBe('John Doe');
    });

    it('should handle multi-word names', () => {
      const text = 'John Michael Smith\nData Scientist';
      const name = service.extractName(text);

      expect(name).toBeDefined();
    });
  });

  describe('extractLocation', () => {
    it('should extract location from resume', () => {
      expect(service.extractLocation('Based in Bangalore')).toBe('Bangalore');
      expect(service.extractLocation('Location: Mumbai')).toBe('Mumbai');
      expect(service.extractLocation('Working in Hyderabad')).toBe('Hyderabad');
      expect(service.extractLocation('Delhi, India')).toBe('Delhi');
    });

    it('should return null if no location found', () => {
      expect(service.extractLocation('No location mentioned')).toBeNull();
    });
  });

  describe('integration test', () => {
    it('should parse a complete resume', () => {
      const resumeText = `
John Doe
Senior Data Scientist
Email: john.doe@example.com
Phone: +91-9876543210
Bangalore, India

EXPERIENCE:
7 years of experience in machine learning and data science
- Data Scientist at Company A
- Data Engineer at Company B

SKILLS:
Python, R, SQL, Machine Learning, Deep Learning, TensorFlow, PyTorch,
Pandas, NumPy, Scikit-learn, AWS, Docker, Kubernetes, Tableau

EDUCATION:
Master's in Computer Science
Bachelor of Technology

CERTIFICATIONS:
AWS Certified Solutions Architect
      `;

      const parsed = service.parseResume(resumeText);

      // Personal info with masking
      expect(parsed.personalInfo.name).toBe('John Doe');
      expect(parsed.personalInfo.email).toContain('***');
      expect(parsed.personalInfo.phone).toContain('****');
      expect(parsed.personalInfo.emailRaw).toBe('john.doe@example.com');
      expect(parsed.personalInfo.location).toBe('Bangalore');

      // Skills
      expect(parsed.skills.technical.length).toBeGreaterThan(5);
      expect(parsed.skills.technical).toContain('python');
      expect(parsed.skills.technical).toContain('machine learning');
      expect(parsed.skills.technical).toContain('tensorflow');

      // Experience
      expect(parsed.experience.totalYears).toBe(7);
      expect(parsed.experience.roles.length).toBeGreaterThan(0);

      // Education
      expect(parsed.education.length).toBeGreaterThan(0);

      // Raw text
      expect(parsed.rawText).toBe(resumeText);
    });
  });
});
