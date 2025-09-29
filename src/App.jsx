import React, { useState, useMemo } from 'react';
import { Database, TrendingUp, Users, MapPin } from 'lucide-react';
import JobCard from './components/JobCard';
import JobFilters from './components/JobFilters';
import ResumeUpload from './components/ResumeUpload';
import InterviewPrep from './components/InterviewPrep';
import { jobsData } from './data/jobsData';
import { sortJobsByRelevance, filterRecentJobs, filterQualityJobs } from './utils/resumeParser';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: 'All Locations',
    category: 'All Categories',
    experience: 'All Experience',
    rating: 'All Ratings',
    remoteOnly: false,
    recentOnly: false
  });
  const [resumeData, setResumeData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Filter and sort jobs based on search term, filters, and resume
  const filteredJobs = useMemo(() => {
    let jobs = [...jobsData];

    // Apply quality filter (good companies with rating >= 3.5)
    jobs = filterQualityJobs(jobs, 3.5);

    // Apply recent jobs filter if selected
    if (filters.recentOnly) {
      jobs = filterRecentJobs(jobs, 30);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.skills.some(skill => skill.toLowerCase().includes(term)) ||
        job.description.toLowerCase().includes(term)
      );
    }

    // Location filter
    if (filters.location !== 'All Locations') {
      jobs = jobs.filter(job => job.location.includes(filters.location));
    }

    // Category filter
    if (filters.category !== 'All Categories') {
      jobs = jobs.filter(job => job.category === filters.category);
    }

    // Experience filter
    if (filters.experience !== 'All Experience') {
      const experienceMap = {
        '0-2 years': (exp) => exp.includes('1-3') || exp.includes('0-2') || exp.includes('fresher'),
        '2-4 years': (exp) => exp.includes('2-4') || exp.includes('1-3'),
        '4-7 years': (exp) => exp.includes('4-7') || exp.includes('3-6') || exp.includes('5-8'),
        '7+ years': (exp) => exp.includes('7+') || exp.includes('8+') || exp.includes('senior') || exp.includes('lead')
      };
      const filterFn = experienceMap[filters.experience];
      if (filterFn) {
        jobs = jobs.filter(job => filterFn(job.experience.toLowerCase()));
      }
    }

    // Rating filter
    if (filters.rating !== 'All Ratings') {
      const minRating = parseFloat(filters.rating.replace('+', ''));
      jobs = jobs.filter(job => job.companyRating >= minRating);
    }

    // Remote filter
    if (filters.remoteOnly) {
      jobs = jobs.filter(job => job.isRemote);
    }

    // Sort by relevance if resume is uploaded
    if (resumeData?.skills) {
      jobs = sortJobsByRelevance(jobs, resumeData.skills);
    }

    return jobs;
  }, [searchTerm, filters, resumeData]);

  const handleResumeAnalyzed = (data) => {
    setResumeData(data);
  };

  const stats = [
    { label: 'Total Jobs', value: filteredJobs.length, icon: Database },
    { label: 'Top Companies', value: '50+', icon: TrendingUp },
    { label: 'Active Candidates', value: '1000+', icon: Users },
    { label: 'Cities', value: '15+', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DataJobs India</h1>
              <p className="text-gray-600 mt-1">Find your next data career opportunity</p>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#jobs" className="text-gray-700 hover:text-primary-600 font-medium">Jobs</a>
              <a href="#companies" className="text-gray-700 hover:text-primary-600 font-medium">Companies</a>
              <a href="#interview-prep" className="text-gray-700 hover:text-primary-600 font-medium">Interview Prep</a>
              <button className="btn-primary">Post a Job</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Land Your Dream Data Role in India
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Discover high-quality data science, engineering, and analytics positions 
            from India's top companies. Get personalized job matches and interview preparation.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <stat.icon className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-primary-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Jobs and Filters */}
          <div className="lg:col-span-2 space-y-6">
            <JobFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              jobsCount={filteredJobs.length}
            />

            {/* Jobs List */}
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    matchScore={
                      resumeData?.skills
                        ? job.matchScore
                        : null
                    }
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or filters to find more opportunities.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Resume Upload and Interview Prep */}
          <div className="space-y-6">
            <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
            <InterviewPrep 
              resumeData={resumeData} 
              appliedJobs={appliedJobs}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">DataJobs India</h3>
              <p className="text-gray-400 text-sm">
                Your premier destination for data careers in India. 
                Connecting talent with opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white">Resume Tips</a></li>
                <li><a href="#" className="hover:text-white">Interview Prep</a></li>
                <li><a href="#" className="hover:text-white">Salary Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white">Find Candidates</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Contact Sales</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 DataJobs India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;