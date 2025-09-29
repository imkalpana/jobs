import React from 'react';
import { MapPin, Clock, Star, Briefcase, TrendingUp } from 'lucide-react';

const JobCard = ({ job, matchScore = null }) => {
  const formatSalary = (salary) => {
    return salary;
  };

  const getMatchBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            {matchScore && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchBadgeColor(matchScore)}`}>
                {matchScore}% match
              </span>
            )}
          </div>
          <p className="text-lg font-medium text-primary-600 mb-2">{job.company}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">{job.companyRating}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
          {job.isRemote && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs ml-1">
              Remote
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          <span>{job.experience}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium text-green-600">{formatSalary(job.salary)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatDate(job.postedDate)}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 6).map((skill, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 6 && (
          <span className="text-gray-500 text-sm">+{job.skills.length - 6} more</span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {job.category}
        </span>
        <button className="btn-primary">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;