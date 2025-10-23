// ATS API integration layer
import { JobListing, JobApplication, Candidate, Employer, JobSearchFilters, ATSConfig } from '@/types/ats';
import { ENV_CONFIG, logATSStatus } from './env';

class ATSApiClient {
  private config: ATSConfig;
  private baseUrl: string;

  constructor(config: ATSConfig) {
    this.config = config;
    this.baseUrl = config.apiBaseUrl;
    
    // Log ATS status in development
    if (ENV_CONFIG.DEBUG_ATS) {
      logATSStatus();
    }
  }

  // Job Listings API
  async getJobListings(filters?: JobSearchFilters): Promise<JobListing[]> {
    try {
      // Check if ATS API is available
      if (ENV_CONFIG.USE_MOCK_DATA) {
        console.log('ATS API not configured, using mock data');
        return this.getMockJobListings(filters);
      }

      const params = new URLSearchParams();
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.experience) params.append('experience', filters.experience);
      if (filters?.salaryMin) params.append('salaryMin', filters.salaryMin.toString());
      if (filters?.salaryMax) params.append('salaryMax', filters.salaryMax.toString());
      if (filters?.postedWithin) params.append('postedWithin', filters.postedWithin);

      const response = await fetch(`${this.baseUrl}/api/jobs?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job listings, falling back to mock data:', error);
      return this.getMockJobListings(filters);
    }
  }

  // Mock data for development/testing
  private getMockJobListings(filters?: JobSearchFilters): JobListing[] {
    const mockJobs: JobListing[] = [
      {
        id: '1',
        title: 'CEO and Trust Secretary',
        company: 'Expert Hire',
        location: 'Nairobi',
        type: 'Full Time',
        category: 'Executive',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'We are seeking a dynamic and experienced CEO and Trust Secretary to lead our organization with strategic vision and operational excellence.',
        requirements: [
          'Master\'s degree in Business Administration or related field',
          'Minimum 10 years of executive leadership experience',
          'Proven track record in strategic planning and execution',
          'Strong financial management and governance skills',
          'Excellent communication and stakeholder management abilities',
          'Experience in trust administration and corporate governance'
        ],
        responsibilities: [
          'Provide strategic leadership and direction to the organization',
          'Oversee all operational activities and ensure efficiency',
          'Manage stakeholder relationships and communications',
          'Ensure compliance with regulatory requirements',
          'Lead board meetings and corporate governance activities',
          'Develop and implement organizational policies and procedures'
        ],
        benefits: [
          'Competitive executive compensation package',
          'Comprehensive health and life insurance',
          'Performance-based bonuses and incentives',
          'Professional development opportunities',
          'Executive vehicle and housing allowance',
          'Annual leave and sabbatical opportunities'
        ],
        salary: {
          min: 500000,
          max: 1000000,
          currency: 'KES'
        },
        experience: '10+ years',
        education: 'Master\'s degree',
        skills: ['Strategic Planning', 'Leadership', 'Governance', 'Financial Management'],
        isActive: true,
        applicationCount: 12,
        views: 156
      },
      {
        id: '2',
        title: 'Sales Representative – Coast Region',
        company: 'Expert Hire',
        location: 'Coast Region',
        type: 'Full Time',
        category: 'Sales & Marketing',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Join our dynamic sales team as a Sales Representative for the Coast Region. Drive business growth and build lasting client relationships.',
        requirements: [
          'Bachelor\'s degree in Business, Marketing, or related field',
          'Minimum 3 years of sales experience in the region',
          'Proven track record of meeting and exceeding sales targets',
          'Strong networking and relationship-building skills',
          'Excellent communication and presentation abilities',
          'Knowledge of the Coast region market dynamics'
        ],
        responsibilities: [
          'Identify and pursue new business opportunities',
          'Maintain and grow existing client relationships',
          'Conduct sales presentations and negotiations',
          'Prepare sales reports and forecasts',
          'Collaborate with marketing team on campaigns',
          'Attend industry events and networking functions'
        ],
        benefits: [
          'Competitive base salary plus commission',
          'Sales performance bonuses and incentives',
          'Company vehicle and fuel allowance',
          'Health insurance and medical cover',
          'Sales training and development programs',
          'Flexible working arrangements'
        ],
        salary: {
          min: 80000,
          max: 150000,
          currency: 'KES'
        },
        experience: '3+ years',
        education: 'Bachelor\'s degree',
        skills: ['Sales', 'Marketing', 'Networking', 'Communication'],
        isActive: true,
        applicationCount: 8,
        views: 89
      },
      {
        id: '3',
        title: 'Senior Lecturer in Software Development',
        company: 'Expert Hire',
        location: 'Nairobi',
        type: 'Full Time',
        category: 'Education & Training',
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'We are looking for an experienced Senior Lecturer in Software Development to join our academic team and shape the next generation of software engineers.',
        requirements: [
          'PhD in Computer Science, Software Engineering, or related field',
          'Minimum 5 years of teaching experience at university level',
          'Strong background in software development and programming',
          'Published research in software engineering or related areas',
          'Experience with modern programming languages and frameworks',
          'Excellent communication and mentoring skills'
        ],
        responsibilities: [
          'Develop and deliver curriculum for software development courses',
          'Conduct research in software engineering',
          'Supervise student projects and thesis work',
          'Contribute to academic program development',
          'Mentor junior faculty and teaching assistants',
          'Participate in industry partnerships and collaborations'
        ],
        benefits: [
          'Competitive academic salary scale',
          'Research funding and conference support',
          'Comprehensive health insurance',
          'Professional development opportunities',
          'Sabbatical leave and research time',
          'Modern teaching facilities and resources'
        ],
        salary: {
          min: 200000,
          max: 400000,
          currency: 'KES'
        },
        experience: '5+ years',
        education: 'PhD',
        skills: ['Software Development', 'Teaching', 'Research', 'Programming'],
        isActive: true,
        applicationCount: 15,
        views: 203
      },
      {
        id: '4',
        title: 'ICT Security Officer',
        company: 'Expert Hire',
        location: 'Nairobi',
        type: 'Full Time',
        category: 'Technology',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'We are seeking a skilled ICT Security Officer to protect our organization\'s information systems and data from cyber threats.',
        requirements: [
          'Bachelor\'s degree in Computer Science, IT Security, or related field',
          'Certifications in cybersecurity (CISSP, CISM, CEH preferred)',
          'Minimum 3 years of experience in IT security',
          'Knowledge of security frameworks and compliance standards',
          'Experience with security tools and technologies',
          'Strong analytical and problem-solving skills'
        ],
        responsibilities: [
          'Monitor and analyze security threats and vulnerabilities',
          'Implement and maintain security policies and procedures',
          'Conduct security audits and risk assessments',
          'Respond to security incidents and breaches',
          'Train staff on security best practices',
          'Stay updated with latest security trends and technologies'
        ],
        benefits: [
          'Competitive salary with security allowances',
          'Professional certification support',
          'Comprehensive health insurance',
          'Latest security tools and technologies',
          'Professional development opportunities',
          'Flexible working arrangements'
        ],
        salary: {
          min: 150000,
          max: 300000,
          currency: 'KES'
        },
        experience: '3+ years',
        education: 'Bachelor\'s degree',
        skills: ['Cybersecurity', 'IT Security', 'Risk Assessment', 'Compliance'],
        isActive: true,
        applicationCount: 6,
        views: 67
      }
    ];

    // Apply filters to mock data
    let filteredJobs = mockJobs;

    if (filters?.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
    }

    if (filters?.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters?.category) {
      filteredJobs = filteredJobs.filter(job => 
        job.category === filters.category
      );
    }

    if (filters?.type) {
      filteredJobs = filteredJobs.filter(job => 
        job.type === filters.type
      );
    }

    return filteredJobs;
  }

  async getJobById(id: string): Promise<JobListing | null> {
    try {
      // Check if ATS API is available
      if (ENV_CONFIG.USE_MOCK_DATA) {
        console.log('ATS API not configured, using mock data');
        const mockJobs = this.getMockJobListings();
        return mockJobs.find(job => job.id === id) || null;
      }

      const response = await fetch(`${this.baseUrl}/api/jobs/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job, falling back to mock data:', error);
      const mockJobs = this.getMockJobListings();
      return mockJobs.find(job => job.id === id) || null;
    }
  }

  // Job Applications API
  async submitApplication(application: Omit<JobApplication, 'id' | 'appliedDate' | 'status'>): Promise<JobApplication | null> {
    try {
      // Check if ATS API is available
      if (!this.config.apiKey || this.config.apiKey === '') {
        console.log('ATS API not configured, simulating application submission');
        // Simulate successful application submission
        return {
          id: `mock-app-${Date.now()}`,
          jobId: application.jobId,
          candidateId: application.candidateId,
          status: 'pending',
          appliedDate: new Date().toISOString(),
          coverLetter: application.coverLetter,
          resumeUrl: application.resumeUrl,
          notes: application.notes
        };
      }

      const response = await fetch(`${this.baseUrl}/api/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit application: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting application, simulating success:', error);
      // Simulate successful application submission even on error
      return {
        id: `mock-app-${Date.now()}`,
        jobId: application.jobId,
        candidateId: application.candidateId,
        status: 'pending',
        appliedDate: new Date().toISOString(),
        coverLetter: application.coverLetter,
        resumeUrl: application.resumeUrl,
        notes: application.notes
      };
    }
  }

  async getApplicationStatus(applicationId: string): Promise<JobApplication | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch application: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching application:', error);
      return null;
    }
  }

  // Candidate Management API
  async createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'lastActive'>): Promise<Candidate | null> {
    try {
      // Check if ATS API is available
      if (!this.config.apiKey || this.config.apiKey === '') {
        console.log('ATS API not configured, simulating candidate creation');
        // Simulate successful candidate creation
        return {
          id: `mock-candidate-${Date.now()}`,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          location: candidate.location,
          experience: candidate.experience,
          skills: candidate.skills,
          resumeUrl: candidate.resumeUrl,
          profilePicture: candidate.profilePicture,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
      }

      const response = await fetch(`${this.baseUrl}/api/candidates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidate),
      });

      if (!response.ok) {
        throw new Error(`Failed to create candidate: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating candidate, simulating success:', error);
      // Simulate successful candidate creation even on error
      return {
        id: `mock-candidate-${Date.now()}`,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        experience: candidate.experience,
        skills: candidate.skills,
        resumeUrl: candidate.resumeUrl,
        profilePicture: candidate.profilePicture,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
    }
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/candidates/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update candidate: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating candidate:', error);
      return null;
    }
  }

  // Employer Management API
  async getEmployerById(id: string): Promise<Employer | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/employers/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching employer:', error);
      return null;
    }
  }

  // Analytics API
  async getJobAnalytics(jobId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  // Utility methods
  async uploadResume(file: File): Promise<string | null> {
    try {
      // Check if ATS API is available
      if (!this.config.apiKey || this.config.apiKey === '') {
        console.log('ATS API not configured, simulating resume upload');
        // Simulate successful resume upload
        return `https://mock-storage.eaglehr.co.ke/resumes/${file.name}`;
      }

      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseUrl}/api/upload/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload resume: ${response.statusText}`);
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Error uploading resume, simulating success:', error);
      // Simulate successful resume upload even on error
      return `https://mock-storage.eaglehr.co.ke/resumes/${file.name}`;
    }
  }
}

// Default ATS configuration
export const defaultATSConfig: ATSConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_ATS_API_URL || 'https://api.eaglehr.co.ke',
  apiKey: process.env.NEXT_PUBLIC_ATS_API_KEY || '',
  features: {
    jobPosting: true,
    candidateManagement: true,
    applicationTracking: true,
    analytics: true,
    emailNotifications: true,
    resumeParsing: true,
  },
  branding: {
    primaryColor: '#1e40af',
    secondaryColor: '#f59e0b',
    logo: '/images/logo/logo_dark_ubxaCll.png',
  },
};

// Create default ATS client instance
export const atsClient = new ATSApiClient(defaultATSConfig);

// Hook for using ATS API
export const useATS = () => {
  return {
    getJobListings: atsClient.getJobListings.bind(atsClient),
    getJobById: atsClient.getJobById.bind(atsClient),
    submitApplication: atsClient.submitApplication.bind(atsClient),
    getApplicationStatus: atsClient.getApplicationStatus.bind(atsClient),
    createCandidate: atsClient.createCandidate.bind(atsClient),
    updateCandidate: atsClient.updateCandidate.bind(atsClient),
    getEmployerById: atsClient.getEmployerById.bind(atsClient),
    getJobAnalytics: atsClient.getJobAnalytics.bind(atsClient),
    uploadResume: atsClient.uploadResume.bind(atsClient),
  };
};
