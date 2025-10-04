# Job Board Platform - Minimal Viable Product (MVP) PRD

## Product Vision

Build a **streamlined job board platform** that focuses on essential functionality for job seekers to discover, apply, and get matched to relevant data science opportunities in India. The platform will emphasize simplicity, real-time data, and intelligent resume-based job matching.

## Core MVP Features

### 1. Real-Time Job Data Integration
**Priority: Critical**

**Current State**: Static job data with outdated posting dates (20-21 months old)

**MVP Requirements**:
- **Live Job Feed**: Integration with multiple job sources (LinkedIn Jobs API, Naukri API, direct company APIs)
- **Auto-Refresh**: Jobs updated every 4-6 hours with real posting dates
- **Data Validation**: Remove duplicate jobs and ensure data quality
- **Job Freshness Indicators**: Clear timestamps showing "Posted 2 hours ago", "New", etc.

**Technical Implementation**:
```typescript
interface JobDataSource {
  source: 'linkedin' | 'naukri' | 'company_api';
  refreshInterval: number; // in hours
  lastSyncAt: Date;
  totalJobs: number;
}

// Job aggregation service
class JobAggregationService {
  async syncJobs(): Promise<void> {
    const sources = await this.getActiveSources();
    for (const source of sources) {
      const newJobs = await source.fetchLatestJobs();
      await this.processAndStoreJobs(newJobs);
    }
  }
}
```

### 2. Individual Job Detail Pages
**Priority: Critical**

**Current Gap**: No detailed job views, only summary cards

**MVP Requirements**:
- **Dedicated Job URLs**: `/jobs/[jobId]/[job-slug]` for SEO-friendly URLs
- **Complete Job Information**: 
  - Full job description and requirements
  - Company details and culture information
  - Salary range and benefits
  - Application deadline
  - Skills required vs. user skills match percentage
- **Similar Jobs Recommendations**: Show 3-4 related positions
- **Company Profile Integration**: Link to company page with all their active jobs

**UI/UX Design**:
```typescript
interface JobDetailPage {
  jobInfo: {
    title: string;
    company: Company;
    location: string;
    salary: SalaryRange;
    postedDate: Date;
    applicationDeadline?: Date;
  };
  description: {
    overview: string;
    responsibilities: string[];
    requirements: string[];
    preferredSkills: string[];
  };
  matchScore?: number; // If user is logged in
  similarJobs: Job[];
  applicationSection: ApplicationCTA;
}
```

### 3. Direct Application Functionality
**Priority: Critical**

**Current Gap**: No application process exists

**MVP Requirements**:
- **One-Click Apply**: Use uploaded resume and basic profile info
- **Quick Apply Form**: 
  - Pre-filled contact details
  - Cover letter (optional, with templates)
  - Additional documents upload
- **Application Tracking**: Basic status tracking (Applied, Under Review, Rejected, Interview)
- **Email Confirmations**: Automatic confirmation emails for applications
- **Application History**: Simple dashboard showing all applications

**Application Flow**:
```typescript
interface ApplicationProcess {
  // Step 1: Application Intent
  initiateApplication(jobId: string, userId: string): ApplicationSession;
  
  // Step 2: Review Pre-filled Data
  reviewApplicationData(sessionId: string): PrefilledApplication;
  
  // Step 3: Submit Application
  submitApplication(applicationData: ApplicationSubmission): ApplicationResult;
  
  // Step 4: Track Status
  trackApplication(applicationId: string): ApplicationStatus;
}
```

### 4. Recent Jobs Display
**Priority: High**

**Enhancement to Existing**: Improve current job listing with real-time data

**MVP Requirements**:
- **Smart Sorting**: Most recent jobs appear first by default
- **Freshness Indicators**: Visual badges for "New" (< 24hrs), "Fresh" (< 48hrs)
- **Auto-Update**: Page refreshes job count and new listings every 15 minutes
- **Load More**: Pagination or infinite scroll for older jobs
- **Quick Preview**: Hover/tap to see job summary without full page navigation

**Display Logic**:
```typescript
interface JobListingService {
  getRecentJobs(filters: JobFilters): Promise<{
    jobs: Job[];
    metadata: {
      totalCount: number;
      newJobsCount: number; // Last 24 hours
      lastUpdated: Date;
    };
  }>;
}
```

### 5. Resume Upload & Parsing
**Priority: High**

**Current State**: Basic file upload with no processing

**MVP Requirements**:

#### 5.1 Resume Processing
- **File Support**: PDF, DOC, DOCX formats
- **Text Extraction**: Parse resume content using AI/ML services
- **Skills Detection**: Automatically identify technical skills, programming languages, tools
- **Experience Extraction**: Years of experience, previous roles, education
- **Contact Information Masking**: Automatically hide/mask phone numbers for privacy

```typescript
interface ResumeParser {
  parseResume(file: File): Promise<ParsedResume>;
}

interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string; // Masked: +91-****-***-789
    location: string;
  };
  skills: {
    technical: string[]; // ['Python', 'SQL', 'Machine Learning']
    soft: string[];
    certifications: string[];
  };
  experience: {
    totalYears: number;
    roles: WorkExperience[];
  };
  education: Education[];
  rawText: string; // For fallback/debugging
}
```

#### 5.2 Privacy Protection
- **Phone Number Masking**: Display as "+91-****-***-789" in profile
- **Email Protection**: Show first 3 chars + domain (abc***@gmail.com)
- **Download Control**: Users control who can download their resume
- **Data Encryption**: All personal data encrypted at rest

### 6. Resume-Based Job Matching
**Priority: High**

**New Feature**: Intelligent job recommendations based on uploaded resume

**MVP Requirements**:

#### 6.1 Skill-Based Matching
- **Skill Comparison**: Match resume skills with job requirements
- **Match Score**: Display percentage match (e.g., "85% match")
- **Gap Analysis**: Show missing skills for better matches
- **Personalized Feed**: Reorder jobs based on user's profile fit

```typescript
interface JobMatchingService {
  calculateMatch(userProfile: ParsedResume, job: Job): JobMatch;
}

interface JobMatch {
  score: number; // 0-100%
  matchedSkills: string[];
  missingSkills: string[];
  experienceAlignment: 'under' | 'perfect' | 'over';
  salaryAlignment: 'below' | 'in-range' | 'above';
  locationPreference: boolean;
}
```

#### 6.2 Personalized Job Recommendations
- **Smart Filtering**: Auto-apply filters based on user's experience level
- **Recommended Jobs Section**: Separate section for "Jobs for You"
- **Skill-Based Alerts**: Notify when jobs matching user's skills are posted
- **Career Progression**: Suggest roles that are one level up from current experience

## Simplified User Flow

### New User Journey
1. **Visit Platform** → See recent jobs without account
2. **Upload Resume** → Quick registration with email
3. **Resume Processing** → Skills extracted, phone masked, profile created
4. **Personalized Experience** → Jobs reordered by match score
5. **Apply to Jobs** → One-click apply using parsed resume data
6. **Track Applications** → Simple dashboard with application status

### Returning User Journey
1. **Login** → Dashboard shows new jobs matching their profile
2. **Browse Jobs** → Enhanced filtering based on their skills/experience
3. **View Matches** → See match scores and skill alignment
4. **Quick Apply** → Pre-filled applications with saved preferences

## Technical Architecture (MVP Simplified)

### Frontend Stack
```typescript
// Next.js 14 with TypeScript
Frontend: Next.js 14 + TypeScript + Tailwind CSS
├── Authentication: NextAuth.js (Google/LinkedIn OAuth)
├── State Management: Zustand (lightweight)
├── Forms: React Hook Form + Zod
├── File Upload: React Dropzone + AWS S3
└── UI Components: Headless UI + Custom components
```

### Backend Services
```typescript
// Simplified microservices
API Structure:
├── /api/jobs (Job CRUD + Search)
├── /api/applications (Application management)
├── /api/resume (Upload + Parsing)
├── /api/auth (Authentication)
└── /api/matching (Job recommendation engine)
```

### Database Schema (Minimal)
```sql
-- Core tables for MVP
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20), -- Encrypted/masked
    location VARCHAR(100),
    resume_url VARCHAR(500),
    skills TEXT[], -- Parsed from resume
    experience_years INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    company_name VARCHAR(255),
    location VARCHAR(100),
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT,
    requirements TEXT,
    skills_required TEXT[],
    posted_at TIMESTAMP,
    source VARCHAR(50), -- 'linkedin', 'naukri', etc.
    external_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE applications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    job_id UUID REFERENCES jobs(id),
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);
```

### Resume Parsing Service
```python
# AI-powered resume parsing (Python/FastAPI)
class ResumeParsingService:
    def __init__(self):
        self.skills_extractor = SkillsExtractor()
        self.contact_extractor = ContactExtractor()
        self.experience_extractor = ExperienceExtractor()
    
    async def parse_resume(self, file_content: bytes) -> ParsedResume:
        # Extract text from PDF/DOC
        text = self.extract_text(file_content)
        
        # Parse different sections
        skills = await self.skills_extractor.extract(text)
        contact_info = await self.contact_extractor.extract(text)
        experience = await self.experience_extractor.extract(text)
        
        # Mask sensitive information
        masked_contact = self.mask_personal_info(contact_info)
        
        return ParsedResume(
            skills=skills,
            contact_info=masked_contact,
            experience=experience,
            raw_text=text
        )
```

## Success Metrics for MVP

### User Engagement
- **Resume Upload Rate**: % of visitors who upload resumes
- **Application Conversion**: % of job views that result in applications
- **Return Visits**: Users returning within 7 days
- **Job Match Accuracy**: User feedback on recommended jobs

### Platform Performance
- **Job Freshness**: Average age of jobs on platform (target: < 2 days)
- **Application Success Rate**: % of applications that get responses
- **Page Load Speed**: < 2 seconds for job listings
- **Mobile Usage**: % of traffic from mobile devices

## Development Timeline (8-10 weeks)

### Week 1-2: Foundation
- Set up Next.js project structure
- Implement basic authentication (Google OAuth)
- Create job listing API with real data sources
- Design responsive UI components

### Week 3-4: Job Management
- Build individual job detail pages
- Implement job application functionality
- Create application tracking system
- Set up email notification system

### Week 5-6: Resume Processing
- Integrate resume upload and parsing
- Implement skills extraction AI service
- Build contact information masking system
- Create user profile management

### Week 7-8: Personalization
- Develop job matching algorithm
- Implement personalized job recommendations
- Add match score calculations
- Create user dashboard with applications

### Week 9-10: Polish & Launch
- Performance optimization
- Mobile responsiveness testing
- Security audit and testing
- Production deployment and monitoring

This MVP focuses on delivering core value quickly while maintaining the simplicity requested in your product vision. The platform will provide immediate utility to job seekers while establishing a foundation for future enhancements.
