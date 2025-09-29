import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { parseResumeContent } from '../utils/resumeParser';

const ResumeUpload = ({ onResumeAnalyzed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, success, error
  const [parsedData, setParsedData] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    setUploadStatus('processing');
    
    try {
      // Check file type
      const allowedTypes = ['text/plain', 'application/pdf'];
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
        throw new Error('Please upload a PDF or text file');
      }

      // For demo purposes, we'll simulate reading a text file
      // In a real application, you'd use PDF parsing libraries
      let text = '';
      
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        text = await file.text();
      } else {
        // For PDF files, we'll use a sample resume text for demo
        text = `John Doe
Senior Data Scientist
Email: john.doe@email.com
Phone: +91-9876543210

EXPERIENCE:
- 5+ years of experience in machine learning and data science
- Python, SQL, TensorFlow, PyTorch, Scikit-learn
- AWS, Docker, Kubernetes for MLOps
- Statistical analysis and A/B testing
- Built recommendation systems at scale

SKILLS:
Python, R, SQL, Machine Learning, Deep Learning, TensorFlow, PyTorch, 
Pandas, NumPy, Scikit-learn, Statistics, AWS, Docker, Kubernetes, 
Tableau, Git, MLOps, Apache Spark, Kafka

EDUCATION:
Master's in Computer Science`;
      }

      const parsed = parseResumeContent(text);
      setParsedData(parsed);
      setUploadStatus('success');
      onResumeAnalyzed(parsed);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
    }
  };

  const clearResume = () => {
    setParsedData(null);
    setUploadStatus('idle');
    onResumeAnalyzed(null);
  };

  if (uploadStatus === 'success' && parsedData) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">Resume Analyzed Successfully</h3>
          </div>
          <button
            onClick={clearResume}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Extracted Skills ({parsedData.skills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {parsedData.skills.slice(0, 10).map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
              {parsedData.skills.length > 10 && (
                <span className="text-gray-500 text-sm">+{parsedData.skills.length - 10} more</span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Profile Summary</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Experience: ~{parsedData.experience} years</p>
              {parsedData.email && <p>Email: {parsedData.email}</p>}
              {parsedData.phone && <p>Phone: {parsedData.phone}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Upload Your Resume</h3>
      <p className="text-gray-600 mb-4">
        Upload your resume to get personalized job recommendations and interview preparation tips.
      </p>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-400 bg-primary-50'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.txt"
          onChange={handleFileInput}
          disabled={uploadStatus === 'processing'}
        />
        
        <div className="space-y-4">
          {uploadStatus === 'processing' ? (
            <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          ) : (
            <Upload className={`w-12 h-12 mx-auto ${dragActive ? 'text-primary-600' : 'text-gray-400'}`} />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploadStatus === 'processing'
                ? 'Analyzing your resume...'
                : uploadStatus === 'error'
                ? 'Error processing file'
                : dragActive
                ? 'Drop your resume here'
                : 'Drop your resume here, or click to browse'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports PDF and text files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;