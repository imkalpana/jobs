import React, { useState } from 'react';
import { BookOpen, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { interviewTips } from '../data/jobsData';

const InterviewPrep = ({ resumeData, appliedJobs = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get relevant categories based on applied jobs or resume skills
  const getRelevantCategories = () => {
    const categories = new Set();
    
    if (appliedJobs.length > 0) {
      appliedJobs.forEach(job => categories.add(job.category));
    } else if (resumeData?.skills) {
      // Infer categories from skills
      const skills = resumeData.skills.map(s => s.toLowerCase());
      
      if (skills.some(s => ['tensorflow', 'machine learning', 'deep learning', 'statistics'].includes(s))) {
        categories.add('Data Science');
      }
      if (skills.some(s => ['spark', 'kafka', 'airflow', 'etl'].includes(s))) {
        categories.add('Data Engineering');
      }
      if (skills.some(s => ['tableau', 'power bi', 'excel', 'sql'].includes(s))) {
        categories.add('Business Intelligence');
      }
      if (skills.some(s => ['mlops', 'kubernetes', 'docker'].includes(s))) {
        categories.add('Machine Learning');
      }
      if (skills.some(s => ['research', 'nlp', 'computer vision'].includes(s))) {
        categories.add('Research');
      }
      
      // Default fallback
      if (categories.size === 0) {
        categories.add('Data Analysis');
      }
    } else {
      // Show all categories if no context
      return Object.keys(interviewTips);
    }
    
    return Array.from(categories);
  };

  const relevantCategories = getRelevantCategories();

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Data Science': '🧠',
      'Data Engineering': '🔧',
      'Business Intelligence': '📊',
      'Machine Learning': '🤖',
      'Data Analysis': '📈',
      'Research': '🔬'
    };
    return iconMap[category] || '💼';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Data Science': 'bg-purple-100 text-purple-800 border-purple-200',
      'Data Engineering': 'bg-blue-100 text-blue-800 border-blue-200',
      'Business Intelligence': 'bg-green-100 text-green-800 border-green-200',
      'Machine Learning': 'bg-orange-100 text-orange-800 border-orange-200',
      'Data Analysis': 'bg-pink-100 text-pink-800 border-pink-200',
      'Research': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!resumeData && appliedJobs.length === 0) {
    return (
      <div className="card text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Preparation</h3>
        <p className="text-gray-600 mb-4">
          Upload your resume or apply to jobs to get personalized interview preparation tips.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-semibold text-gray-900">Interview Preparation</h3>
      </div>

      {!selectedCategory ? (
        <div>
          <p className="text-gray-600 mb-4">
            Select a category to get tailored interview preparation tips:
          </p>
          <div className="grid gap-3">
            {relevantCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-sm ${getCategoryColor(category)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <div>
                      <h4 className="font-medium">{category}</h4>
                      <p className="text-sm opacity-75">
                        {interviewTips[category]?.length || 0} preparation tips
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← Back to categories
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{getCategoryIcon(selectedCategory)}</span>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{selectedCategory}</h4>
              <p className="text-gray-600">Interview Preparation Guide</p>
            </div>
          </div>

          <div className="space-y-3">
            {interviewTips[selectedCategory]?.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <h5 className="font-medium text-primary-900 mb-2">💡 Pro Tip</h5>
            <p className="text-primary-800 text-sm">
              Practice explaining your projects using the STAR method (Situation, Task, Action, Result) 
              and prepare specific examples that demonstrate your experience with the technologies 
              mentioned in the job description.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;