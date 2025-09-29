export const jobsData = [
  {
    id: 1,
    title: "Senior Data Scientist",
    company: "Flipkart",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "4-7 years",
    salary: "₹25-35 LPA",
    postedDate: "2024-01-15",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Statistics"],
    description: "Lead data science initiatives for e-commerce recommendations and customer analytics.",
    companyRating: 4.2,
    isRemote: false,
    category: "Data Science"
  },
  {
    id: 2,
    title: "Data Engineer",
    company: "Zomato",
    location: "Gurugram, India", 
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹20-28 LPA",
    postedDate: "2024-01-14",
    skills: ["Apache Spark", "Python", "AWS", "Kafka", "SQL", "Docker"],
    description: "Build and maintain data pipelines for real-time analytics and machine learning.",
    companyRating: 4.0,
    isRemote: true,
    category: "Data Engineering"
  },
  {
    id: 3,
    title: "Business Intelligence Analyst",
    company: "Paytm",
    location: "Noida, India",
    type: "Full-time", 
    experience: "2-4 years",
    salary: "₹15-22 LPA",
    postedDate: "2024-01-13",
    skills: ["Tableau", "SQL", "Excel", "Python", "Power BI"],
    description: "Create dashboards and reports to drive business decisions across fintech operations.",
    companyRating: 3.8,
    isRemote: false,
    category: "Business Intelligence"
  },
  {
    id: 4,
    title: "Machine Learning Engineer",
    company: "Swiggy",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "3-6 years", 
    salary: "₹22-30 LPA",
    postedDate: "2024-01-12",
    skills: ["MLOps", "Python", "Kubernetes", "TensorFlow", "AWS", "Docker"],
    description: "Deploy and scale ML models for food delivery optimization and demand forecasting.",
    companyRating: 4.1,
    isRemote: true,
    category: "Machine Learning"
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "Myntra",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "1-3 years",
    salary: "₹12-18 LPA", 
    postedDate: "2024-01-11",
    skills: ["SQL", "Python", "Excel", "Tableau", "Statistics"],
    description: "Analyze customer behavior and fashion trends to optimize product recommendations.",
    companyRating: 4.0,
    isRemote: false,
    category: "Data Analysis"
  },
  {
    id: 6,
    title: "Principal Data Scientist",
    company: "PhonePe", 
    location: "Bangalore, India",
    type: "Full-time",
    experience: "7+ years",
    salary: "₹40-55 LPA",
    postedDate: "2024-01-10",
    skills: ["Deep Learning", "Python", "Scala", "Big Data", "Leadership", "MLOps"],
    description: "Lead data science team for fraud detection and payment optimization at scale.",
    companyRating: 4.3,
    isRemote: true,
    category: "Data Science"
  },
  {
    id: 7,
    title: "Data Platform Engineer",
    company: "Razorpay",
    location: "Bangalore, India", 
    type: "Full-time",
    experience: "4-6 years",
    salary: "₹25-35 LPA",
    postedDate: "2024-01-09",
    skills: ["Apache Airflow", "Python", "AWS", "Kubernetes", "Terraform", "SQL"],
    description: "Build scalable data infrastructure for fintech analytics and compliance reporting.",
    companyRating: 4.4,
    isRemote: true,
    category: "Data Engineering"
  },
  {
    id: 8,
    title: "Research Scientist - NLP",
    company: "Ola",
    location: "Hyderabad, India",
    type: "Full-time", 
    experience: "5-8 years",
    salary: "₹30-42 LPA",
    postedDate: "2024-01-08",
    skills: ["NLP", "Deep Learning", "Python", "Research", "TensorFlow", "PyTorch"],
    description: "Research and develop NLP solutions for customer support and voice assistants.",
    companyRating: 3.9,
    isRemote: false,
    category: "Research"
  }
];

export const companies = [
  { name: "Flipkart", rating: 4.2, size: "10000+", industry: "E-commerce" },
  { name: "Zomato", rating: 4.0, size: "5000-10000", industry: "Food Tech" },
  { name: "Paytm", rating: 3.8, size: "10000+", industry: "Fintech" },
  { name: "Swiggy", rating: 4.1, size: "5000-10000", industry: "Food Tech" },
  { name: "Myntra", rating: 4.0, size: "1000-5000", industry: "Fashion" },
  { name: "PhonePe", rating: 4.3, size: "5000-10000", industry: "Fintech" },
  { name: "Razorpay", rating: 4.4, size: "1000-5000", industry: "Fintech" },
  { name: "Ola", rating: 3.9, size: "5000-10000", industry: "Transportation" }
];

export const interviewTips = {
  "Data Science": [
    "Review statistical concepts and hypothesis testing",
    "Practice coding in Python/R with pandas and scikit-learn",
    "Be ready to explain machine learning algorithms in simple terms",
    "Prepare case studies from your previous projects",
    "Study A/B testing and experimental design"
  ],
  "Data Engineering": [
    "Know distributed systems concepts (HDFS, Spark, Kafka)",
    "Practice SQL optimization and database design",
    "Understand data pipeline architectures",
    "Be familiar with cloud platforms (AWS, GCP, Azure)",
    "Review ETL/ELT processes and best practices"
  ],
  "Business Intelligence": [
    "Master advanced SQL and query optimization",
    "Know visualization best practices (Tableau, Power BI)",
    "Understand business metrics and KPIs",
    "Practice translating business requirements to technical solutions",
    "Study data modeling and warehousing concepts"
  ],
  "Machine Learning": [
    "Review MLOps and model deployment strategies",
    "Understand model monitoring and maintenance",
    "Know containerization and orchestration (Docker, Kubernetes)",
    "Practice system design for ML applications",
    "Study feature engineering and model optimization"
  ],
  "Data Analysis": [
    "Strong foundation in statistics and probability",
    "Excel proficiency including advanced functions",
    "Practice data storytelling and visualization",
    "Know how to derive actionable insights from data",
    "Study business context and domain knowledge"
  ],
  "Research": [
    "Review recent papers in your domain",
    "Practice explaining complex concepts simply",
    "Know experimental methodology and research design",
    "Understand peer review and publication process",
    "Be ready to discuss your research contributions"
  ]
};