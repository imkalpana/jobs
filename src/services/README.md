# Core Services

This directory contains the core business logic services for the job board platform, implementing the design specifications from `design.md`.

## Services

### 1. JobAggregationService
Manages job data from multiple sources (LinkedIn, Naukri, company APIs).

**Features:**
- Register multiple job data sources
- Sync jobs from all sources
- Remove duplicate jobs
- Track source statistics and last sync times

**Usage:**
```javascript
import { JobAggregationService } from './services';

const service = new JobAggregationService();

// Register a source
service.registerSource({
  name: 'linkedin',
  fetchLatestJobs: async () => [...jobsFromLinkedIn],
  refreshInterval: 6 // hours
});

// Sync jobs from all sources
const jobs = await service.syncJobs();

// Get source statistics
const stats = service.getSourceStats();
```

### 2. JobMatchingService
Calculates match scores between user profiles and job listings.

**Features:**
- Skill-based matching with percentage scores
- Experience alignment calculation
- Location preference matching
- Gap analysis (matched vs. missing skills)

**Usage:**
```javascript
import { JobMatchingService } from './services';

const service = new JobMatchingService();

const userProfile = {
  skills: ['Python', 'Machine Learning', 'SQL'],
  experience: 5,
  location: 'Bangalore'
};

const job = {
  skills: ['Python', 'Machine Learning', 'TensorFlow'],
  experience: '4-7 years',
  location: 'Bangalore, India'
};

const match = service.calculateMatch(userProfile, job);
// Returns: { score, matchedSkills, missingSkills, experienceAlignment, locationPreference }
```

### 3. ApplicationService
Manages job application workflow and tracking.

**Features:**
- Application session management
- Pre-filled application data
- Application submission
- Status tracking (applied, under_review, interview, rejected, accepted)
- Application statistics

**Usage:**
```javascript
import { ApplicationService } from './services';

const service = new ApplicationService();

// Step 1: Initiate application
const session = service.initiateApplication('job123', 'user456');

// Step 2: Review pre-filled data
const applicationData = service.reviewApplicationData(session.sessionId, userData);

// Step 3: Submit application
const result = service.submitApplication({
  sessionId: session.sessionId,
  jobId: 'job123',
  userId: 'user456',
  personalInfo: { name: 'John', email: 'john@example.com' },
  coverLetter: 'I am interested...'
});

// Step 4: Track application
const status = service.trackApplication(result.applicationId);
```

### 4. JobListingService
Manages job listings with freshness indicators and filtering.

**Features:**
- Recent jobs with metadata
- Freshness indicators (New, Fresh badges)
- Job age calculation
- Time-range filtering
- Advanced filtering (location, category, skills, remote)

**Usage:**
```javascript
import { JobListingService } from './services';

const service = new JobListingService();
service.setJobs(jobsArray);

// Get recent jobs with filters
const result = await service.getRecentJobs({
  location: 'Bangalore',
  category: 'Data Science',
  remote: true
});

// Get most recent jobs
const recentJobs = service.getMostRecentJobs(10);

// Get new jobs count (last 24 hours)
const newCount = service.getNewJobsCount(24);
```

### 5. ResumeParserService
Parses resumes and extracts structured information with privacy protection.

**Features:**
- Personal information extraction
- Email and phone masking for privacy
- Skills extraction (technical, certifications)
- Experience extraction
- Education extraction

**Usage:**
```javascript
import { ResumeParserService } from './services';

const service = new ResumeParserService();

const resumeText = `
John Doe
Email: john@example.com
Phone: +91-9876543210
5 years of experience in Python, Machine Learning, SQL
`;

const parsed = service.parseResume(resumeText);
// Returns: { personalInfo, skills, experience, education, rawText }

// Personal info includes both masked and raw versions
console.log(parsed.personalInfo.email); // "joh***@example.com"
console.log(parsed.personalInfo.emailRaw); // "john@example.com"
```

## Testing

All services have comprehensive test coverage. Run tests with:

```bash
npm test
```

Or watch mode:

```bash
npm run test:watch
```

## Design Specification

These services implement the core features outlined in the `design.md` document:
- Real-Time Job Data Integration (Feature 1)
- Direct Application Functionality (Feature 3)
- Recent Jobs Display (Feature 4)
- Resume Upload & Parsing (Feature 5)
- Resume-Based Job Matching (Feature 6)
