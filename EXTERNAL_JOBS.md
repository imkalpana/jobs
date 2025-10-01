# External Job Listings Integration Guide

This document explains how to add job listings from external platforms like LinkedIn, Naukri.com, and others to the DataJobs India job board.

## Overview

The job board now supports displaying jobs from multiple external platforms alongside internal job postings. External jobs are clearly marked with a platform badge and feature an "Apply Now" button that redirects users to the original job posting.

## Job Data Structure

External jobs use the same data structure as internal jobs, with two additional fields:

### Required Fields for External Jobs

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `source` | string | Name of the external platform | "LinkedIn", "Naukri" |
| `externalUrl` | string | Direct URL to the job posting | "https://www.linkedin.com/jobs/view/..." |

### Complete Example

```javascript
{
  id: 9,
  title: "Senior Data Analyst",
  company: "Google",
  location: "Bangalore, India",
  type: "Full-time",
  experience: "5-7 years",
  salary: "₹35-50 LPA",
  postedDate: "2024-01-16",
  skills: ["SQL", "Python", "BigQuery", "Data Visualization", "Statistics", "A/B Testing"],
  description: "Analyze complex datasets to drive product insights and business strategy.",
  companyRating: 4.5,
  isRemote: false,
  category: "Data Analysis",
  source: "LinkedIn",                    // Platform source
  externalUrl: "https://www.linkedin.com/jobs/view/senior-data-analyst-google"  // External URL
}
```

## Adding External Jobs

### Method 1: Manual Addition

1. Open `src/data/jobsData.js`
2. Add a new job object to the `jobsData` array
3. Include all standard fields plus `source` and `externalUrl`
4. Ensure the `id` is unique

### Method 2: Platform Integration (Future)

For automated integration with platform APIs:

1. **LinkedIn Jobs API**: Requires LinkedIn Partner Program access
   - Documentation: https://docs.microsoft.com/en-us/linkedin/talent/job-postings
   - Requires OAuth authentication

2. **Naukri.com API**: Contact Naukri for API access
   - May require partnership agreement
   - Check their developer portal for details

3. **Other Platforms**: 
   - Indeed: https://opensource.indeedeng.io/api-documentation/
   - Glassdoor: Partner API available
   - Monster: Contact for API access

## UI Features

### Source Badge
External jobs display a blue badge next to the job title showing the platform source (e.g., "LinkedIn", "Naukri").

### Apply Now Button
- **Internal Jobs**: Standard button (can be configured for internal application flow)
- **External Jobs**: Clickable button with external link icon that opens the job posting in a new tab

### Security
All external links open with security attributes:
- `target="_blank"`: Opens in new tab
- `rel="noopener,noreferrer"`: Prevents security vulnerabilities

## Supported Platforms

Currently integrated platforms:
- ✅ LinkedIn
- ✅ Naukri.com

Easy to add more platforms by following the same pattern.

## Best Practices

1. **Keep URLs Updated**: Regularly check that external job URLs are still valid
2. **Rate Data Quality**: Ensure external jobs have accurate company ratings
3. **Consistent Formatting**: Follow the same salary format (₹X-Y LPA)
4. **Valid Categories**: Use existing categories: Data Science, Data Engineering, Business Intelligence, Machine Learning, Data Analysis, Research
5. **Fresh Content**: Update `postedDate` to keep listings current

## Code References

### JobCard Component (`src/components/JobCard.jsx`)
```javascript
const isExternalJob = job.source && job.externalUrl;

const handleApplyClick = () => {
  if (job.externalUrl) {
    window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
  }
};
```

### Checking for External Jobs
```javascript
// Check if a job is external
const isExternal = job.source && job.externalUrl;
```

## Future Enhancements

Potential improvements for external job integration:

1. **Automated Sync**: Set up scheduled jobs to fetch latest postings from platform APIs
2. **More Platforms**: Add support for Indeed, Glassdoor, Monster, etc.
3. **Click Tracking**: Track when users click "Apply Now" for analytics
4. **Job Expiry**: Automatically remove old job listings
5. **Platform Filters**: Allow users to filter by platform source
6. **Application Tracking**: Track which platform users apply through most often

## Troubleshooting

### External links not opening
- Verify `externalUrl` is a valid URL starting with http:// or https://
- Check browser console for JavaScript errors

### Badge not showing
- Ensure both `source` and `externalUrl` are present
- Check for typos in field names

### Build errors
- Validate JSON structure in jobsData.js
- Ensure no trailing commas in the last array element
- Run `npm run build` to check for syntax errors

## Contact

For questions about external job integration, please refer to the main repository README or open an issue on GitHub.
