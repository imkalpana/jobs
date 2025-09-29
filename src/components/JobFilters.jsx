import React from 'react';
import { Search, Filter, MapPin, Briefcase, Star } from 'lucide-react';

const JobFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  jobsCount 
}) => {
  const locations = ['All Locations', 'Bangalore', 'Gurugram', 'Noida', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai'];
  const categories = ['All Categories', 'Data Science', 'Data Engineering', 'Business Intelligence', 'Machine Learning', 'Data Analysis', 'Research'];
  const experienceLevels = ['All Experience', '0-2 years', '2-4 years', '4-7 years', '7+ years'];
  const companyRatings = ['All Ratings', '4.0+', '3.5+', '3.0+'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search jobs by title, company, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm ml-auto">
            {jobsCount} jobs found
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Company Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Company Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              {companyRatings.map(rating => (
                <option key={rating} value={rating}>{rating}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-3 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.remoteOnly}
              onChange={(e) => handleFilterChange('remoteOnly', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Remote jobs only</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.recentOnly}
              onChange={(e) => handleFilterChange('recentOnly', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Posted in last 30 days</span>
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => setFilters({
            location: 'All Locations',
            category: 'All Categories',
            experience: 'All Experience',
            rating: 'All Ratings',
            remoteOnly: false,
            recentOnly: false
          })}
          className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;